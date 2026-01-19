---
title: HLS Transcoding Architecture
sidebar_position: 5
---

# HLS Transcoding Architecture

HyperStudy uses AWS MediaConvert for automatic video transcoding to HLS (HTTP Live Streaming) format, enabling adaptive bitrate streaming for optimal playback.

## Overview

### Why AWS MediaConvert?

The system migrated from Lambda + FFmpeg to AWS MediaConvert to solve critical limitations:

| Aspect | Old (Lambda + FFmpeg) | New (MediaConvert) |
|--------|----------------------|-------------------|
| Timeout | 15-minute Lambda limit | No timeout |
| Max video length | ~1.5 hours | Unlimited |
| Scaling | Manual Lambda concurrency | AWS-managed |
| Output quality | Custom FFmpeg settings | Optimized presets |
| Cost | Pay for Lambda execution | Pay per minute (~$0.015/min) |

## Architecture

```
┌─────────────────┐
│  User Upload    │ (multipart for >100MB)
└────────┬────────┘
         ▼
┌─────────────────┐         ┌─────────────────────┐
│       S3        │────────►│    EventBridge      │
│  (raw video)    │         │  (upload trigger)   │
└─────────────────┘         └──────────┬──────────┘
                                       ▼
                            ┌─────────────────────┐
                            │ mediaconvert-submit │
                            │     (Lambda)        │
                            │  - probe resolution │
                            │  - submit job       │
                            └──────────┬──────────┘
                                       ▼
                            ┌─────────────────────┐
                            │   AWS MediaConvert  │
                            │  (no timeout limit) │
                            │  - 360p/480p/720p/  │
                            │    1080p outputs    │
                            └──────────┬──────────┘
                                       ▼
                            ┌─────────────────────┐
                            │    EventBridge      │
                            │ (completion event)  │
                            └──────────┬──────────┘
                                       ▼
                            ┌─────────────────────┐
                            │ mediaconvert-webhook│
                            │     (Lambda)        │
                            └──────────┬──────────┘
                                       ▼
                            ┌─────────────────────┐
                            │      Backend        │
                            │  (update Firestore) │
                            └─────────────────────┘
```

## Components

### 1. mediaconvert-submit Lambda

Triggered when a video is uploaded to S3. Probes the video resolution and submits a MediaConvert job.

```javascript
// backend/aws-lambda/mediaconvert-submit/index.js

exports.handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  // Extract video ID from key (e.g., "videos/vid_abc123/original.mp4")
  const videoId = extractVideoId(key);

  // Probe video resolution
  const resolution = await probeVideoResolution(bucket, key);

  // Determine output presets based on source resolution
  const outputs = getOutputPresets(resolution);

  // Submit MediaConvert job
  const jobId = await submitMediaConvertJob({
    inputBucket: bucket,
    inputKey: key,
    outputBucket: bucket,
    outputPrefix: `videos/${videoId}/hls/`,
    outputs,
    videoId
  });

  // Update video status to "processing"
  await updateVideoStatus(videoId, 'processing', { jobId });

  return { statusCode: 200, jobId };
};
```

#### Resolution Detection

Only generates quality levels up to the source resolution:

```javascript
function getOutputPresets(resolution) {
  const { width, height } = resolution;
  const outputs = [];

  // Always include 360p
  outputs.push({ preset: '360p', width: 640, height: 360, bitrate: 800000 });

  // 480p if source is >= 480p
  if (height >= 480) {
    outputs.push({ preset: '480p', width: 854, height: 480, bitrate: 1400000 });
  }

  // 720p if source is >= 720p
  if (height >= 720) {
    outputs.push({ preset: '720p', width: 1280, height: 720, bitrate: 2800000 });
  }

  // 1080p if source is >= 1080p
  if (height >= 1080) {
    outputs.push({ preset: '1080p', width: 1920, height: 1080, bitrate: 5000000 });
  }

  return outputs;
}
```

### 2. AWS MediaConvert Job

The MediaConvert job configuration:

```javascript
async function submitMediaConvertJob(params) {
  const mediaConvert = new AWS.MediaConvert({
    endpoint: process.env.MEDIACONVERT_ENDPOINT
  });

  const jobSettings = {
    Role: process.env.MEDIACONVERT_ROLE_ARN,
    Settings: {
      Inputs: [{
        FileInput: `s3://${params.inputBucket}/${params.inputKey}`,
        AudioSelectors: {
          'Audio Selector 1': { DefaultSelection: 'DEFAULT' }
        }
      }],
      OutputGroups: [{
        Name: 'HLS Group',
        OutputGroupSettings: {
          Type: 'HLS_GROUP_SETTINGS',
          HlsGroupSettings: {
            Destination: `s3://${params.outputBucket}/${params.outputPrefix}`,
            SegmentLength: 6,
            MinSegmentLength: 0,
            // CRITICAL: Required for long videos
            SegmentsPerSubdirectory: 10000
          }
        },
        Outputs: params.outputs.map(output => ({
          ContainerSettings: { Container: 'M3U8' },
          VideoDescription: {
            Width: output.width,
            Height: output.height,
            CodecSettings: {
              Codec: 'H_264',
              H264Settings: {
                Bitrate: output.bitrate,
                RateControlMode: 'CBR',
                CodecProfile: 'MAIN',
                CodecLevel: 'AUTO'
              }
            }
          },
          AudioDescriptions: [{
            CodecSettings: {
              Codec: 'AAC',
              AacSettings: {
                Bitrate: 128000,
                SampleRate: 48000
              }
            }
          }],
          NameModifier: `_${output.preset}`
        }))
      }]
    },
    UserMetadata: {
      videoId: params.videoId
    }
  };

  const result = await mediaConvert.createJob(jobSettings).promise();
  return result.Job.Id;
}
```

:::warning SegmentsPerSubdirectory
The `SegmentsPerSubdirectory: 10000` setting is **critical**. Without it, MediaConvert creates subdirectories for segments, breaking HLS playback. This was a key fix during migration.
:::

### 3. mediaconvert-webhook Lambda

Receives MediaConvert completion events via EventBridge:

```javascript
// backend/aws-lambda/mediaconvert-webhook/index.js

exports.handler = async (event) => {
  const detail = event.detail;
  const videoId = detail.userMetadata.videoId;
  const status = detail.status;

  if (status === 'COMPLETE') {
    // Get output file locations
    const hlsManifestKey = `videos/${videoId}/hls/master.m3u8`;

    // Notify backend
    await notifyBackend(videoId, {
      status: 'ready',
      hlsManifestKey,
      outputs: detail.outputGroupDetails
    });

  } else if (status === 'ERROR') {
    const errorMessage = detail.errorMessage || 'Unknown error';

    await notifyBackend(videoId, {
      status: 'failed',
      error: errorMessage
    });
  }

  return { statusCode: 200 };
};

async function notifyBackend(videoId, data) {
  await fetch(`${process.env.BACKEND_URL}/api/internal/videos/${videoId}/hls-complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Key': process.env.INTERNAL_API_KEY
    },
    body: JSON.stringify(data)
  });
}
```

### 4. Backend Webhook Handler

Updates Firestore when transcoding completes:

```javascript
// backend/src/routes/internal.js

router.post('/videos/:videoId/hls-complete', verifyInternalKey, async (req, res) => {
  const { videoId } = req.params;
  const { status, hlsManifestKey, error } = req.body;

  await db.collection('videos').doc(videoId).update({
    hlsStatus: status,
    hlsManifestKey: status === 'ready' ? hlsManifestKey : null,
    hlsError: status === 'failed' ? error : null,
    hlsCompletedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  res.json({ success: true });
});
```

## Multipart Upload API

For large files (>100MB), the frontend uses multipart upload:

### Initiate Multipart Upload

```javascript
// POST /api/upload/video/multipart/initiate
router.post('/upload/video/multipart/initiate', async (req, res) => {
  const { filename, contentType, fileSize } = req.body;

  const videoId = generateVideoId();
  const key = `videos/${videoId}/original/${filename}`;

  // Create multipart upload
  const upload = await s3.createMultipartUpload({
    Bucket: process.env.VIDEO_BUCKET,
    Key: key,
    ContentType: contentType
  }).promise();

  // Generate presigned URLs for each part (max 10GB = ~100 parts of 100MB)
  const partCount = Math.ceil(fileSize / (100 * 1024 * 1024));
  const presignedUrls = [];

  for (let partNumber = 1; partNumber <= partCount; partNumber++) {
    const url = await s3.getSignedUrlPromise('uploadPart', {
      Bucket: process.env.VIDEO_BUCKET,
      Key: key,
      UploadId: upload.UploadId,
      PartNumber: partNumber,
      Expires: 3600
    });
    presignedUrls.push({ partNumber, url });
  }

  res.json({
    videoId,
    uploadId: upload.UploadId,
    key,
    presignedUrls
  });
});
```

### Complete Multipart Upload

```javascript
// POST /api/upload/video/multipart/complete
router.post('/upload/video/multipart/complete', async (req, res) => {
  const { uploadId, key, parts } = req.body;

  await s3.completeMultipartUpload({
    Bucket: process.env.VIDEO_BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts.map(p => ({
        ETag: p.etag,
        PartNumber: p.partNumber
      }))
    }
  }).promise();

  res.json({ success: true });
});
```

### Abort Multipart Upload

```javascript
// POST /api/upload/video/multipart/abort
router.post('/upload/video/multipart/abort', async (req, res) => {
  const { uploadId, key } = req.body;

  await s3.abortMultipartUpload({
    Bucket: process.env.VIDEO_BUCKET,
    Key: key,
    UploadId: uploadId
  }).promise();

  res.json({ success: true });
});
```

## Frontend Upload Service

```javascript
// frontend/src/lib/services/videoService.js

export async function uploadVideo(file, onProgress) {
  const MULTIPART_THRESHOLD = 100 * 1024 * 1024; // 100MB

  if (file.size > MULTIPART_THRESHOLD) {
    return uploadMultipart(file, onProgress);
  } else {
    return uploadDirect(file, onProgress);
  }
}

async function uploadMultipart(file, onProgress) {
  // 1. Initiate multipart upload
  const { videoId, uploadId, key, presignedUrls } = await initiateMultipartUpload(file);

  // 2. Upload parts (4 concurrent)
  const PART_SIZE = 100 * 1024 * 1024;
  const parts = [];
  const concurrency = 4;

  for (let i = 0; i < presignedUrls.length; i += concurrency) {
    const batch = presignedUrls.slice(i, i + concurrency);

    const batchResults = await Promise.all(
      batch.map(async ({ partNumber, url }) => {
        const start = (partNumber - 1) * PART_SIZE;
        const end = Math.min(start + PART_SIZE, file.size);
        const chunk = file.slice(start, end);

        const response = await fetch(url, {
          method: 'PUT',
          body: chunk
        });

        return {
          partNumber,
          etag: response.headers.get('etag')
        };
      })
    );

    parts.push(...batchResults);

    // Report progress
    onProgress((i + batch.length) / presignedUrls.length);
  }

  // 3. Complete multipart upload
  await completeMultipartUpload(uploadId, key, parts);

  return { videoId };
}
```

## Manual Retry Endpoint

For admin-triggered retry of failed transcodes:

```javascript
// POST /api/videos/:videoId/retry-hls
router.post('/videos/:videoId/retry-hls', verifyAdmin, async (req, res) => {
  const { videoId } = req.params;

  // Get video document
  const video = await db.collection('videos').doc(videoId).get();
  if (!video.exists) {
    return res.status(404).json({ error: 'Video not found' });
  }

  // Reset HLS status
  await db.collection('videos').doc(videoId).update({
    hlsStatus: 'pending',
    hlsError: null
  });

  // Re-trigger Lambda by copying the object to itself
  // (This fires the S3 event that triggers mediaconvert-submit)
  const key = video.data().storageKey;
  await s3.copyObject({
    Bucket: process.env.VIDEO_BUCKET,
    CopySource: `${process.env.VIDEO_BUCKET}/${key}`,
    Key: key
  }).promise();

  res.json({ success: true, message: 'Retry initiated' });
});
```

## EventBridge Retry Mechanism

EventBridge provides automatic retry for failed Lambda invocations:

```yaml
# CloudFormation/SAM template
MediaConvertCompleteRule:
  Type: AWS::Events::Rule
  Properties:
    EventPattern:
      source:
        - aws.mediaconvert
      detail-type:
        - MediaConvert Job State Change
      detail:
        status:
          - COMPLETE
          - ERROR
    Targets:
      - Id: WebhookLambda
        Arn: !GetAtt MediaConvertWebhookFunction.Arn
        RetryPolicy:
          MaximumRetryAttempts: 3
          MaximumEventAgeInSeconds: 3600
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MEDIACONVERT_ENDPOINT` | Regional MediaConvert endpoint |
| `MEDIACONVERT_ROLE_ARN` | IAM role for MediaConvert jobs |
| `VIDEO_BUCKET` | S3 bucket for video storage |
| `BACKEND_URL` | Backend API URL for webhooks |
| `INTERNAL_API_KEY` | Shared secret for internal APIs |

## Cost Considerations

MediaConvert pricing (~$0.015/minute for standard queue):

| Video Length | Approximate Cost |
|--------------|------------------|
| 5 minutes | $0.08 |
| 30 minutes | $0.45 |
| 1 hour | $0.90 |
| 2 hours | $1.80 |

Tips for cost optimization:
- Use on-demand queue for typical videos
- Consider reserved queue for high volume
- Only generate quality levels up to source resolution

## Key Implementation Files

| File | Purpose |
|------|---------|
| `backend/aws-lambda/mediaconvert-submit/` | S3 trigger, job submission |
| `backend/aws-lambda/mediaconvert-webhook/` | Completion handler |
| `backend/src/services/s3Service.js` | Multipart upload functions |
| `frontend/src/lib/services/videoService.js` | Frontend upload logic |
| `backend/src/routes/videos.js` | Video API endpoints |

## Troubleshooting

### Job Stuck in "Processing"

1. Check MediaConvert console for job status
2. Review CloudWatch logs for Lambda errors
3. Verify IAM role permissions

### "Access Denied" Errors

1. Verify MediaConvert role has S3 access
2. Check bucket policy allows MediaConvert
3. Verify Lambda execution role

### HLS Playback Issues

1. Verify `SegmentsPerSubdirectory: 10000` is set
2. Check master playlist exists
3. Verify CloudFront distribution (if using CDN)

## Related Documentation

- [Media Management](../../experimenters/media-management.md) - User-facing documentation
- [Video Synchronization](../video-synchronization.md) - How videos sync across participants
