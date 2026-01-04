# Automatic Video Transcoding - Implementation Plan

**Status**: Planned - Not Yet Implemented
**Priority**: Medium
**Estimated Effort**: 2-3 weeks
**Estimated Cost**: $5-100/month depending on volume

---

## Executive Summary

Automatically convert uploaded videos (MOV, AVI, MKV, etc.) to web-optimized MP4 format to ensure Firefox compatibility and optimal playback across all browsers.

**Problem**: Firefox cannot play MOV files and other formats due to:
- Limited codec support (yuv420p only, not yuv422p/yuv444p)
- Partial QuickTime/MOV support
- No support for AVI, limited MKV support

**Solution**: AWS Lambda + MediaConvert hybrid transcoding pipeline triggered by S3 uploads.

---

## Architecture Overview

### Hybrid Transcoding Approach

**Small Files (<2GB)**: AWS Lambda with FFmpeg Layer
- Cost: ~$0.0003 per 500MB video
- Processing: ~2 minutes for 500MB video
- Ideal for: 95% of uploaded videos

**Large Files (≥2GB)**: AWS MediaConvert
- Cost: ~$0.90 per 30min video at 720p
- Processing: Real-time or faster
- Ideal for: Large experiment videos

### Flow Diagram

```
┌─────────────┐
│ User Uploads│
│  MOV/AVI/   │
│  MKV Video  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   S3 Event Trigger  │
│  (videos/*.{mov,    │
│   avi,mkv,m4v})     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Lambda Function    │
│  - Check file size  │
│  - Check format     │
└──────┬──────────────┘
       │
   ┌───┴────┐
   │        │
   ▼        ▼
┌──────┐ ┌──────────┐
│<2GB  │ │  ≥2GB    │
│      │ │          │
│Lambda│ │MediaConv.│
│FFmpeg│ │  Job     │
└──┬───┘ └────┬─────┘
   │          │
   └────┬─────┘
        │
        ▼
┌────────────────┐
│  MP4 Output    │
│  - H.264       │
│  - yuv420p     │
│  - AAC audio   │
│  - faststart   │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Update Firestore│
│ Delete Original│
│ Notify Frontend│
└────────────────┘
```

---

## Technical Implementation

### 1. Lambda Function - Small Files (<2GB)

**Location**: `backend/aws-lambda/video-transcoder/`

**Handler**: `index.js`

```javascript
const AWS = require('aws-sdk');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3();
const mediaconvert = new AWS.MediaConvert({ endpoint: process.env.MEDIACONVERT_ENDPOINT });

const BUCKET = process.env.TRANSCODE_BUCKET || 'hyperstudy-videos';
const SIZE_THRESHOLD_MB = parseInt(process.env.SIZE_THRESHOLD_MB || '2048');
const DELETE_ORIGINAL = process.env.DELETE_ORIGINAL === 'true';

exports.handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    // Skip if already MP4/WebM
    const ext = path.extname(key).toLowerCase();
    if (ext === '.mp4' || ext === '.webm') {
      console.log(`Skipping ${key} - already in compatible format`);
      continue;
    }

    // Get file size
    const headData = await s3.headObject({ Bucket: bucket, Key: key }).promise();
    const fileSizeMB = headData.ContentLength / (1024 * 1024);

    console.log(`Processing ${key} (${fileSizeMB.toFixed(2)}MB)`);

    if (fileSizeMB < SIZE_THRESHOLD_MB) {
      // Use Lambda FFmpeg
      await transcodeWithFFmpeg(bucket, key);
    } else {
      // Use MediaConvert
      await transcodeWithMediaConvert(bucket, key);
    }
  }
};

async function transcodeWithFFmpeg(bucket, key) {
  const inputPath = `/tmp/input${path.extname(key)}`;
  const outputPath = '/tmp/output.mp4';
  const outputKey = key.replace(/\.[^.]+$/, '.mp4');

  try {
    // Download from S3
    console.log(`Downloading ${key}...`);
    const inputData = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    fs.writeFileSync(inputPath, inputData.Body);

    // Transcode with FFmpeg
    console.log('Transcoding with FFmpeg...');
    await ffmpegTranscode(inputPath, outputPath);

    // Upload to S3
    console.log(`Uploading ${outputKey}...`);
    await s3.putObject({
      Bucket: bucket,
      Key: outputKey,
      Body: fs.readFileSync(outputPath),
      ContentType: 'video/mp4',
      CacheControl: 'public, max-age=10800, immutable'
    }).promise();

    // Delete original if configured
    if (DELETE_ORIGINAL) {
      await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
      console.log(`Deleted original: ${key}`);
    }

    // Update Firestore (call backend webhook)
    await notifyBackend(key, outputKey, 'completed');

    console.log(`Successfully transcoded ${key} → ${outputKey}`);
  } catch (error) {
    console.error(`Error transcoding ${key}:`, error);
    await notifyBackend(key, null, 'failed', error.message);
    throw error;
  } finally {
    // Cleanup
    [inputPath, outputPath].forEach(p => {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    });
  }
}

function ffmpegTranscode(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('/opt/bin/ffmpeg', [
      '-i', inputPath,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'medium',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-y',
      outputPath
    ]);

    ffmpeg.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}

async function transcodeWithMediaConvert(bucket, key) {
  // MediaConvert job creation logic
  const jobSettings = {
    // ... MediaConvert job template
  };

  const job = await mediaconvert.createJob({
    Role: process.env.MEDIACONVERT_ROLE,
    Settings: jobSettings
  }).promise();

  console.log(`Created MediaConvert job: ${job.Job.Id}`);
  // Job completion handled by separate EventBridge → Lambda
}

async function notifyBackend(originalKey, convertedKey, status, error = null) {
  // Call backend webhook to update Firestore
  const axios = require('axios');
  await axios.post(`${process.env.BACKEND_URL}/api/upload/video/transcode-webhook`, {
    originalKey,
    convertedKey,
    status,
    error
  }, {
    headers: {
      'x-transcode-secret': process.env.TRANSCODE_SECRET
    }
  });
}
```

**package.json**:
```json
{
  "name": "video-transcoder",
  "version": "1.0.0",
  "dependencies": {
    "aws-sdk": "^2.1400.0",
    "axios": "^1.6.0"
  }
}
```

**Lambda Configuration**:
- Runtime: Node.js 18.x
- Memory: 3008 MB
- Timeout: 900 seconds (15 minutes)
- Ephemeral storage: 10 GB
- Environment variables:
  - `TRANSCODE_BUCKET=hyperstudy-videos`
  - `SIZE_THRESHOLD_MB=2048`
  - `DELETE_ORIGINAL=true`
  - `BACKEND_URL=https://hyperstudy.io`
  - `TRANSCODE_SECRET=[random-secret]`
  - `MEDIACONVERT_ENDPOINT=[your-endpoint]`
  - `MEDIACONVERT_ROLE=[role-arn]`

**FFmpeg Layer**:
Use pre-built layer: `arn:aws:lambda:us-east-1:145266761615:layer:ffmpeg:4`
Or build custom layer with latest FFmpeg.

---

### 2. S3 Event Configuration

**Bucket**: `hyperstudy-videos`

**Event Configuration**:
```json
{
  "LambdaFunctionConfigurations": [
    {
      "Id": "VideoTranscodeOnUpload",
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:ACCOUNT:function:video-transcoder",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            { "Name": "prefix", "Value": "videos/" },
            { "Name": "suffix", "Value": ".mov" }
          ]
        }
      }
    },
    {
      "Id": "AviTranscodeOnUpload",
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:ACCOUNT:function:video-transcoder",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            { "Name": "prefix", "Value": "videos/" },
            { "Name": "suffix", "Value": ".avi" }
          ]
        }
      }
    },
    {
      "Id": "MkvTranscodeOnUpload",
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:ACCOUNT:function:video-transcoder",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            { "Name": "prefix", "Value": "videos/" },
            { "Name": "suffix", "Value": ".mkv" }
          ]
        }
      }
    },
    {
      "Id": "M4vTranscodeOnUpload",
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:ACCOUNT:function:video-transcoder",
      "Events": ["s3:ObjectCreated:*"],
      "Filter": {
        "Key": {
          "FilterRules": [
            { "Name": "prefix", "Value": "videos/" },
            { "Name": "suffix", "Value": ".m4v" }
          ]
        }
      }
    }
  ]
}
```

---

### 3. Backend API Updates

**New Endpoint**: `POST /api/upload/video/transcode-webhook`

**Purpose**: Receive transcoding completion notifications from Lambda

**Implementation** (`backend/src/routes/uploadRoutes.js`):

```javascript
/**
 * Webhook for video transcoding completion
 * POST /api/upload/video/transcode-webhook
 */
uploadRouter.post('/video/transcode-webhook', async (req, res) => {
  try {
    // Verify webhook secret
    const secret = req.headers['x-transcode-secret'];
    if (secret !== process.env.TRANSCODE_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { originalKey, convertedKey, status, error } = req.body;

    // Find video record in Firestore by s3Key
    const videosSnapshot = await db.collection('videos')
      .where('s3Key', '==', originalKey)
      .get();

    if (videosSnapshot.empty) {
      console.error(`No video found for key: ${originalKey}`);
      return res.status(404).json({ error: 'Video not found' });
    }

    const videoDoc = videosSnapshot.docs[0];
    const videoId = videoDoc.id;

    if (status === 'completed') {
      // Update video record with new MP4 URL
      const mp4Url = getVideoUrl(convertedKey);

      await db.collection('videos').doc(videoId).update({
        url: mp4Url,
        cloudFrontUrl: mp4Url,
        s3Key: convertedKey,
        contentType: 'video/mp4',
        transcoded: true,
        transcodedAt: new Date(),
        originalFormat: path.extname(originalKey),
        updatedAt: new Date()
      });

      // Emit Socket.IO event for real-time UI update
      if (global.io) {
        global.io.emit('video:transcoded', {
          videoId,
          url: mp4Url,
          status: 'completed'
        });
      }

      console.log(`Video transcoded successfully: ${originalKey} → ${convertedKey}`);
    } else if (status === 'failed') {
      // Mark as failed
      await db.collection('videos').doc(videoId).update({
        transcodeFailed: true,
        transcodeError: error,
        updatedAt: new Date()
      });

      console.error(`Video transcode failed: ${originalKey} - ${error}`);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Error processing transcode webhook:', error);
    res.status(500).json({
      error: 'Failed to process webhook',
      details: error.message
    });
  }
});
```

---

### 4. Frontend Updates

**Update Video Upload UI** to show transcoding status:

```svelte
{#if video.transcoding}
  <div class="status-badge transcoding">
    <Spinner size="small" />
    Processing video...
  </div>
{:else if video.transcodeFailed}
  <div class="status-badge error">
    Transcode failed
  </div>
{:else if video.transcoded}
  <div class="status-badge success">
    Ready
  </div>
{/if}
```

**Socket.IO Listener**:
```javascript
socket.on('video:transcoded', ({ videoId, url, status }) => {
  // Update video in local state
  videos.update(list =>
    list.map(v => v.id === videoId
      ? { ...v, transcoding: false, transcoded: true, url }
      : v
    )
  );
});
```

---

## Cost Analysis

### Lambda FFmpeg Costs (Small Files)

**Assumptions**:
- 500MB average file size
- 2 minutes processing time per file
- 3GB Lambda memory

**Calculation**:
- Compute: $0.0000166667 per GB-second
- 3GB × 120 seconds = 360 GB-seconds
- Cost per transcode: $0.0000166667 × 360 = **$0.006** (~0.6 cents)

**Monthly Estimates**:
- 100 videos/month: $0.60
- 1,000 videos/month: $6.00
- 10,000 videos/month: $60.00

### MediaConvert Costs (Large Files)

**Pricing**: $0.015/minute (SD), $0.03/minute (HD)

**Example**:
- 30-minute 720p video: $0.90
- 60-minute 1080p video: $1.80

### S3 Storage Savings (Deleting Originals)

If MOV files are 20% larger than MP4:
- 100GB of MOV files → 80GB of MP4
- Savings: 20GB × $0.023/GB = **$0.46/month**

### Total Estimated Monthly Cost

**Light Usage** (100 videos/month):
- Lambda: $0.60
- MediaConvert: $5-10
- **Total: $5-15/month**

**Heavy Usage** (1,000 videos/month):
- Lambda: $6.00
- MediaConvert: $50-100
- **Total: $56-106/month**

---

## Migration Plan - Convert Existing Files

### Batch Conversion Script

**Location**: `backend/scripts/batch-convert-videos.js`

```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const lambda = new AWS.Lambda();

const BUCKET = 'hyperstudy-videos';
const LAMBDA_FUNCTION = 'video-transcoder';

async function listMovFiles() {
  const files = [];
  let continuationToken;

  do {
    const response = await s3.listObjectsV2({
      Bucket: BUCKET,
      Prefix: 'videos/',
      ContinuationToken: continuationToken
    }).promise();

    const movFiles = response.Contents.filter(obj =>
      /\.(mov|avi|mkv|m4v)$/i.test(obj.Key)
    );

    files.push(...movFiles);
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return files;
}

async function triggerTranscode(key) {
  // Simulate S3 event
  const event = {
    Records: [{
      s3: {
        bucket: { name: BUCKET },
        object: { key }
      }
    }]
  };

  await lambda.invoke({
    FunctionName: LAMBDA_FUNCTION,
    InvocationType: 'Event',
    Payload: JSON.stringify(event)
  }).promise();

  console.log(`Triggered transcode for: ${key}`);
}

async function main() {
  console.log('Listing files to transcode...');
  const files = await listMovFiles();

  console.log(`Found ${files.length} files to transcode`);

  // Process in batches of 10 to avoid throttling
  for (let i = 0; i < files.length; i += 10) {
    const batch = files.slice(i, i + 10);

    await Promise.all(batch.map(file => triggerTranscode(file.Key)));

    console.log(`Processed ${Math.min(i + 10, files.length)}/${files.length}`);

    // Wait 5 seconds between batches
    if (i + 10 < files.length) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('Batch conversion triggered for all files');
}

main().catch(console.error);
```

**Run**:
```bash
cd backend/scripts
node batch-convert-videos.js
```

---

## Rollout Strategy

### Phase 1: Infrastructure Setup (Week 1)
- [ ] Create Lambda function
- [ ] Add FFmpeg layer
- [ ] Set up IAM roles/permissions
- [ ] Configure MediaConvert
- [ ] Test with sample files locally

### Phase 2: Testing (Week 2)
- [ ] Deploy to test environment
- [ ] Test with various file formats
- [ ] Test size threshold (1.9GB vs 2.1GB files)
- [ ] Test failure scenarios
- [ ] Verify Firefox compatibility of outputs
- [ ] Load test with multiple concurrent uploads

### Phase 3: Production Deployment (Week 3)
- [ ] Deploy Lambda to production
- [ ] Configure S3 event triggers (disabled initially)
- [ ] Deploy backend webhook endpoint
- [ ] Deploy frontend UI updates
- [ ] Test end-to-end flow manually

### Phase 4: Enable Auto-Transcode (Week 3)
- [ ] Enable S3 event triggers for MOV only
- [ ] Monitor CloudWatch logs
- [ ] Verify Firestore updates
- [ ] Check costs in AWS billing
- [ ] If successful, enable for all formats

### Phase 5: Batch Migration (Week 4)
- [ ] Run batch script on 10 test files
- [ ] Verify conversions successful
- [ ] Run full batch conversion
- [ ] Monitor progress and costs
- [ ] Clean up any failures

---

## Monitoring & Alerts

### CloudWatch Metrics to Track
- Lambda invocations
- Lambda errors
- Lambda duration
- Lambda throttles
- MediaConvert job count
- MediaConvert failures

### Alarms to Set
- Lambda error rate > 5%
- Lambda duration > 10 minutes (approaching timeout)
- MediaConvert job failures > 10/hour
- Daily transcode cost > $50

### Logs to Monitor
- Lambda execution logs
- S3 event delivery failures
- Backend webhook errors
- Firestore update failures

---

## Rollback Plan

If critical issues arise:

1. **Disable S3 Event Triggers** (immediate stop)
   ```bash
   aws s3api put-bucket-notification-configuration \
     --bucket hyperstudy-videos \
     --notification-configuration '{}'
   ```

2. **Keep both formats temporarily**
   - Update `DELETE_ORIGINAL=false` environment variable
   - Allows fallback to original files

3. **Frontend graceful degradation**
   - Check both MP4 and original format URLs
   - Use original if MP4 not available

4. **Investigate and fix**
   - Review CloudWatch logs
   - Fix Lambda/MediaConvert configuration
   - Test thoroughly

5. **Re-enable**
   - Start with single format (MOV)
   - Monitor closely
   - Expand to other formats

---

## Security Considerations

1. **IAM Roles**
   - Lambda role: Read/write S3, invoke MediaConvert, CloudWatch logs
   - MediaConvert role: Read/write S3
   - Principle of least privilege

2. **Webhook Secret**
   - Strong random secret for webhook authentication
   - Rotate periodically

3. **Input Validation**
   - Validate file extensions
   - Validate file sizes
   - Prevent path traversal attacks

4. **Output Sanitization**
   - Ensure output keys don't overwrite critical files
   - Use consistent naming convention

---

## Future Enhancements

1. **Adaptive Bitrate** - Generate multiple quality levels (240p, 480p, 720p, 1080p)
2. **Thumbnail Generation** - Extract video thumbnail during transcode
3. **Progress Tracking** - Real-time transcode progress via WebSocket
4. **Quality Presets** - Allow users to choose quality vs file size
5. **Parallel Processing** - Split large files into chunks for faster processing
6. **AI Analysis** - Extract metadata, detect scenes, generate captions

---

## References

- [AWS Lambda FFmpeg Layer](https://github.com/serverlesspub/ffmpeg-aws-lambda-layer)
- [AWS MediaConvert Documentation](https://docs.aws.amazon.com/mediaconvert/)
- [FFmpeg H.264 Encoding Guide](https://trac.ffmpeg.org/wiki/Encode/H.264)
- [Firebase compatibility issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1368063)

---

## Support

For questions or issues during implementation:
1. Review CloudWatch logs
2. Check `docs/issues/firefox-video-decode-error.md`
3. Test with sample files first
4. Monitor costs in AWS billing dashboard
