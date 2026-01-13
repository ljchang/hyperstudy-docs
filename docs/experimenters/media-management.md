---
title: Media Management
sidebar_position: 6
---

# Media Management

The HyperStudy platform provides a comprehensive media management system for organizing, uploading, and using videos and images in your experiments. The system includes folder organization, tagging, and sophisticated permission controls for sharing media across research teams.

![Video Management Interface](/img/experimenters/media-videos.png)
*Video management interface showing folder structure and video library with URLs and metadata*

![Image Management Interface](/img/experimenters/media-images.png)
*Image management interface with grid view and folder navigation*

## Media Types

The platform supports two primary types of media:

### Images

- Supported formats: JPG, PNG, GIF, SVG
- Maximum file size: 10MB per image
- Recommended resolution: 1920x1080px or smaller
- Common uses: Visual stimuli, diagrams, instructions

### Videos

All videos must be uploaded to the platform for security, performance, and HLS streaming support:

#### Platform-Hosted Videos
- **Security**: Videos use signed URLs that are not publicly accessible
- **Privacy**: URLs are only valid for authorized users and expire after 3 hours
- **HLS Streaming**: Automatic transcoding to adaptive bitrate HLS format
- **Performance**: Optimized for all connection speeds with automatic quality adaptation
- **Precaching**: Automatically precached for optimal loading and synchronization
- **Accepted formats**: MP4, WebM, OGG, MOV, AVI, MKV, M4V
- **Recommended format**: MP4 (H.264 video, AAC audio, yuv420p chroma)
- **Maximum file size**: 5GB per video
- **Recommended resolution**: 1080p (1920x1080) or smaller

:::info Why Upload-Only?
External URL support has been removed to ensure all videos benefit from:
- **HLS adaptive streaming** for smooth playback on any connection
- **Automatic format conversion** eliminating browser compatibility issues
- **Consistent security** with signed URL protection
- **Reliable synchronization** for multi-participant experiments
:::

## HLS Adaptive Streaming

All uploaded videos are automatically transcoded to HLS (HTTP Live Streaming) format, providing adaptive bitrate streaming for optimal playback on any connection:

### How It Works

1. **Upload**: You upload your video in any supported format
2. **Automatic Transcoding**: The platform transcodes to multiple quality levels (360p, 480p, 720p, 1080p)
3. **HLS Ready**: Within 2-5 minutes, your video is available in adaptive streaming format
4. **Smart Playback**: The player automatically selects the best quality based on viewer's connection

### Benefits

| Feature | Progressive Download | HLS Streaming |
|---------|---------------------|---------------|
| Buffering on slow connections | Frequent pauses | Automatic quality reduction |
| Time to first frame | Wait for initial buffer | Near-instant playback |
| Bandwidth usage | Fixed high bitrate | Adapts to connection |
| Multi-participant sync | May desync during buffering | Consistent playback |
| Format compatibility | Varies by browser | Universal (H.264) |

### Quality Levels

Videos are transcoded to multiple resolutions based on the source quality:

| Resolution | Bitrate | When Used |
|------------|---------|-----------|
| 360p | 800 kbps | Slow connections (< 2 Mbps) |
| 480p | 1,400 kbps | Standard mobile connections |
| 720p | 2,800 kbps | Normal broadband |
| 1080p | 5,000 kbps | Fast connections |

### HLS Status Indicators

In the Video Manager, each video shows its HLS transcoding status:

| Status | Meaning |
|--------|---------|
| ✓ Ready | HLS streaming available |
| 🔄 Processing | Transcoding in progress (2-5 min) |
| ⏳ Pending | Waiting to start transcoding |
| ✗ Failed | Transcoding error (original still playable) |
| — | Pre-HLS video (progressive only) |

:::tip Progressive Fallback
Videos remain playable immediately after upload using progressive download. HLS becomes available once transcoding completes. If transcoding fails, the original video continues to work.
:::

## Video Format Recommendations

:::info Automatic Format Conversion
With HLS transcoding enabled, format compatibility issues are largely eliminated. The transcoder converts all uploads to browser-compatible H.264 with yuv420p chroma subsampling. However, uploading in recommended formats ensures the best source quality.
:::

### Recommended Formats (Best Compatibility)

For maximum browser compatibility and reliable playback across all features:

1. **MP4 (H.264 video codec, AAC audio) ⭐ RECOMMENDED**
   - **Encoding requirements**:
     - Video codec: H.264 (x264)
     - Audio codec: AAC
     - Chroma subsampling: **yuv420p** (critical for Firefox)
     - Container optimization: `-movflags +faststart` flag
   - **Why**: Universal browser support, optimal for web playback
   - **Best for**: All experiments, especially those with sparse rating or timestamp jumping

2. **WebM (VP8/VP9 video, Vorbis/Opus audio) ✅ GOOD ALTERNATIVE**
   - Full browser support
   - Open format
   - Good compression

**Example FFmpeg command for optimal MP4:**
```bash
ffmpeg -i input.mov -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 \
       -c:a aac -b:a 128k -movflags +faststart output.mp4
```

### Problematic Formats (May Cause Issues)

:::caution Known Issues
The following formats may cause playback errors in Firefox and other browsers, particularly when using features that require precise video seeking (sparse rating, timestamp-based state transitions):
:::

#### MOV (QuickTime) ⚠️ **Compatibility Warning**

**Issues**:
- **Limited Firefox support**: Often fails with "Video can't be played because file is corrupt" error
- **Chroma subsampling incompatibility**: Many MOV files use yuv422p or yuv444p chroma subsampling, which Firefox cannot decode (Firefox only supports yuv420p)
- **Partial codec support**: Firefox has limited QuickTime container support

:::danger Critical Firefox + Signed URL Issue
**MOV files may fail to seek in Firefox when served via signed URLs**, even if initial playback works. This is due to Firefox's strict handling of range requests combined with QuickTime container limitations. The issue is **especially problematic for experiments using**:
- Sparse Rating (pause/resume at specific timestamps)
- Multi-state video segmentation (different time ranges across states)
- Any timestamp-based seeking

**Solution**: Convert MOV files to MP4 with yuv420p chroma subsampling before uploading. MP4 files work reliably with signed URLs in all browsers.
:::

**Impact on experiments**:
- ❌ **Sparse Rating Component**: May fail when pausing/resuming at specific timestamps
- ❌ **Multi-state experiments**: May fail when transitioning between states using different time segments of the same video
- ❌ **Seek operations**: May crash decoder when jumping to specific timestamps
- ❌ **Signed URL + MOV**: Firefox cannot reliably seek to timestamps in MOV files served via authenticated URLs
- ⚠️ **Inconsistent behavior**: Works in Chrome/Safari but fails in Firefox

**When uploaded**, you'll receive a warning recommending conversion to MP4.

#### AVI ❌ **Not Recommended**

**Issues**:
- **No browser support**: Not supported by modern browsers
- **No native HTML5 support**: Cannot play in Firefox, Chrome, or Safari
- **Will not work**: Guaranteed playback failure

**Action required**: Convert to MP4 before uploading.

#### MKV (Matroska) ⚠️ **Limited Support**

**Issues**:
- **Very limited browser support**: Only experimental support in Firefox Nightly builds
- **Not production-ready**: Should not be used for participant-facing experiments
- **Inconsistent playback**: May work in some browsers but fail in others

**When uploaded**, you'll receive a warning recommending conversion to MP4.

#### M4V ⚠️ **Potential Issues**

**Issues**:
- **Similar to MOV**: Can have same chroma subsampling problems
- **Codec-dependent**: Compatibility depends on encoding settings
- **May fail in Firefox**: If encoded with yuv422p/yuv444p

**When uploaded**, you'll receive a warning. Test thoroughly before using in experiments.

### Why These Issues Occur

**Technical explanation**: Firefox's video decoder only supports **YUV 4:2:0 chroma subsampling** for H.264 videos. Many professional video cameras and editing software export MOV files with YUV 4:2:2 or YUV 4:4:4 chroma subsampling for higher color fidelity. While these higher-quality formats work fine in standalone media players, they cause Firefox's browser-based decoder to fail with a `MEDIA_ERR_DECODE` error.

**Additional Firefox + Signed URL complexity**: Platform-uploaded videos use **signed URLs for security**. These time-limited, authenticated URLs protect your proprietary content but can interact poorly with Firefox's video decoder when combined with incompatible formats. When Firefox attempts to seek to a specific timestamp in a MOV file served via signed URL, it may fail to properly re-request video segments, causing playback errors even if the initial load succeeded. **MP4 files with yuv420p chroma subsampling do NOT have this issue** - they work reliably with signed URLs in all browsers including Firefox.

This is particularly problematic for:
- **Timestamp-based features**: Seeking to specific video times (used in sparse rating)
- **Video segmentation**: Playing different time ranges of the same video across multiple states
- **Multi-participant sync**: When Firefox participants cannot decode the video
- **Signed URL + MOV combination**: Firefox may fail to seek even if initial playback works

### Upload Warnings System

When you upload a problematic format, the system will warn you:

**Warning severity levels**:
- 🔴 **Error** (AVI): Format will not work, conversion required
- 🟡 **Warning** (MOV, MKV, M4V): Format may not work in all browsers

**Warning message includes**:
- Specific compatibility issues
- Browsers affected
- Recommended formats
- Note that sparse rating and timestamp features may fail

**Your options**:
1. **Convert to MP4** (recommended): Use FFmpeg or video editing software
2. **Upload anyway**: For testing or if you know all participants use compatible browsers
3. **Cancel**: Choose a different file

### Converting Videos to Compatible Format

If you have MOV, AVI, or other problematic files:

**Quick conversion** (preserves quality):
```bash
# Convert MOV to web-optimized MP4
ffmpeg -i input.mov -pix_fmt yuv420p -c:a copy -movflags +faststart output.mp4
```

**Full conversion** (with compression):
```bash
# Convert any format to optimized MP4
ffmpeg -i input.mov -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 \
       -c:a aac -b:a 128k -movflags +faststart output.mp4
```

**What these flags do**:
- `-pix_fmt yuv420p`: Ensures Firefox-compatible chroma subsampling
- `-movflags +faststart`: Optimizes for web streaming (moov atom at start)
- `-preset medium`: Balances encoding speed vs compression
- `-crf 23`: Constant quality (lower = higher quality, 18-28 typical range)

**Need help?** Many free tools can convert videos:
- **HandBrake** (free, cross-platform GUI)
- **FFmpeg** (free, command-line)
- **Online converters** (for smaller files)

### Testing Video Compatibility

Before using a video in an experiment with sparse rating or timestamp features:

1. **Upload** the video to the platform
2. **Check for warnings** during upload
3. **Test in Firefox**:
   - Create a simple test experiment
   - Add the video to a state with timestamp segmentation (e.g., startTime: 0, endTime: 15, then second state startTime: 15, endTime: 30)
   - Run the experiment in Firefox
   - Verify no "corrupt file" errors when transitioning between states
4. **Test sparse rating**: If using sparse rating component, test pause/resume functionality in Firefox

### Automatic Transcoding (Now Available)

All uploaded videos are now automatically transcoded to HLS format with multiple quality levels. This system:
- Converts all formats to web-optimized H.264 automatically
- Eliminates browser compatibility issues (including Firefox problems)
- Provides adaptive bitrate streaming for optimal performance
- Ensures consistent playback on slow connections

See the [HLS Adaptive Streaming](#hls-adaptive-streaming) section above for details.

## Media Library

### Accessing the Media Library

There are multiple ways to access the media library:

1. **From the Admin Dashboard**:
   - Navigate to your dashboard
   - Click the "Media" button in the sidebar
   - Toggle between "Videos" and "Images" tabs

2. **From the Experimenter Dashboard**:
   - Access your experimenter view
   - Navigate to the Media section
   - Browse available media based on your permissions

3. **During Experiment Design**:
   - When configuring an Image or Video component
   - Click "Browse Library" or "Select Media" in the component properties
   - This opens the media selector interface with filtering options

### Library Organization

The media library provides sophisticated organization features:

- **Folder Structure**: 
  - Create nested folders for hierarchical organization
  - Folders visible in the left sidebar
  - Quick navigation with breadcrumb trail
  - Add new folders with the "Add Folder" button

- **Media Information**:
  - Direct URLs for each media item
  - File metadata (size, format, duration for videos)
  - Upload date and owner information
  - Usage tracking across experiments

- **Search and Filters**:
  - Search by filename, URL, or description
  - Filter by media type, date range, or owner
  - Export options for bulk operations
  - Pagination for large libraries

## Uploading Media

### Image Upload

To upload images:

1. Navigate to the Images section of the Media Library
2. Click the "Upload" button
3. Select one or more image files from your device
4. Alternatively, drag and drop files into the upload area
5. Add metadata (title, description, tags) during upload
6. Assign to folders and set permissions
7. Click "Upload" to complete the process


### Video Upload

Upload videos directly to HyperStudy's secure storage:

1. Navigate to the Videos section
2. Click the "Add Video" button
3. Drag and drop your video file or click to browse
4. Supported formats: MP4, WebM, MOV, AVI, MKV, M4V (all converted to HLS)
5. Add metadata during upload (title, description, tags)
6. Select target folder and set permissions
7. Monitor upload progress

**What Happens After Upload:**
1. **Immediate**: Video available via progressive download
2. **2-5 minutes**: HLS transcoding completes (360p-1080p adaptive streaming)
3. **Automatic**: System switches to HLS once ready

**Security Benefits:**
- **Private by Default**: Videos are not publicly accessible
- **Signed URLs**: Access controlled through time-limited, authenticated URLs
- **Permission Controls**: Share only with authorized users or groups
- **Automatic Expiration**: URLs expire after 3 hours, preventing unauthorized access
- **No Public Exposure**: Videos cannot be accessed outside the platform

**HLS Benefits:**
- **Adaptive Quality**: Automatically adjusts to viewer's connection speed
- **Faster Start**: Near-instant playback with segment-based loading
- **Better Sync**: Consistent playback across all participants
- **Browser Compatible**: Universal format support including Firefox

#### Processing

All uploaded videos are automatically processed:
- Thumbnails generated automatically
- Duration and resolution detected
- Format conversion if needed for compatibility
- Optimization for web playback

### Bulk Upload

For multiple files:

1. Select multiple files during the upload process
2. Apply batch metadata to all files
3. Set common permissions and folder location
4. Individual files can be edited after the upload completes

### File Size Considerations

When uploading media, consider:

- **Network Bandwidth**: Larger files take longer to upload
- **Storage Limits**: Your account may have storage quotas
- **Participant Experience**: Larger files may cause loading delays
- **Quality Needs**: Balance file size with required quality

## Media Organization

### Creating Folders

To organize media into folders:

1. In the Media Library, click "New Folder"
2. Enter a name for the folder
3. Select a parent folder (optional)
4. Set permission level for the folder
5. Click "Create"

Folders can be nested to create a hierarchical structure.

### Using Tags

Tags offer flexible categorization:

1. Select one or more media items
2. Click "Edit" or use the tag field in the info panel
3. Enter new tags or select from existing ones
4. Tags are searchable and can be used as filters

Example useful tags: "stimuli", "instructions", "faces", "landscape", "high-arousal".

### Searching and Filtering

To find specific media:

1. Use the search bar to find by filename, description, or tags
2. Apply filters to narrow results:
   - Type: Image or video
   - Date: Recently added, modified date range
   - Size: Small, medium, large
   - Creator: Who uploaded the media
   - Tags: Filter by specific tags

### Batch Operations

For managing multiple items:

1. Select multiple items by clicking with Shift or Ctrl/Cmd
2. Available batch operations:
   - Move to folder
   - Add/remove tags
   - Change permissions
   - Delete multiple items

## Media Permissions

The platform uses a comprehensive permission system to control media access.

### Permission Levels

Media items can have three visibility levels:

1. **Private**: Only visible to you
2. **Group**: Visible to members of specified groups
3. **Public**: Visible to all experimenters on the platform

### Setting Permissions

To set permissions for media:

1. Select the media item(s)
2. Click "Permissions" or find the permissions section in the info panel
3. Choose the visibility level
4. For Group visibility, select which groups can access
5. Click "Save" to apply the permissions


### Folder Permissions

Folders have their own permission settings:

1. Folder permissions can be set during creation or edited later
2. All items in a folder inherit its permissions by default
3. Individual items can override folder permissions
4. Moving items between folders updates their permissions

### Experimenter Groups

Permission groups allow controlled sharing:

1. Administrators create experimenter groups
2. Groups typically represent labs, departments, or research teams
3. When you share with a group, all members get access
4. You can be a member of multiple groups

To see your groups:
1. Go to your profile settings
2. Check the "Groups" section
3. Group membership is managed by administrators

## Using Media in Experiments

### In Image Components

To use images in your experiment:

1. Add an Image component to a state
2. In the component properties, click "Select Image"
3. Browse the media library for your image
4. Only images you have permission to access will appear
5. Select the image and configure display settings

### In Video Components

To use videos in your experiment:

1. Add a Video component to a state
2. In the component properties, click "Select Video"
3. Browse the media library for your video
4. Only videos you have permission to access will appear
5. Select the video and configure playback settings

### Media Library Benefits

All media should be uploaded to the platform library for:

1. **HLS Streaming**: Automatic adaptive bitrate for optimal playback
2. **Security**: Signed URLs with automatic expiration
3. **Precaching**: Faster experiment startup
4. **Synchronization**: Reliable multi-participant sync
5. **Format Conversion**: Automatic transcoding to compatible formats

## Media Optimization

### Image Optimization

For optimal performance:

1. **Resize before uploading**: Match image dimensions to display size
2. **Compress appropriately**: Use JPG for photos, PNG for graphics with transparency
3. **Check file size**: Keep under 1MB when possible for faster loading
4. **Use vector formats**: SVG is ideal for diagrams and illustrations

### Video Optimization

For optimal video performance:

1. **Use appropriate resolution**: 720p or 1080p is sufficient for most experiments
2. **Compress efficiently**: Use H.264 encoding with balanced quality settings
3. **Consider segmentation**: Break long videos into shorter segments
4. **Progressive loading**: Enable for longer videos

### Media Precaching for Performance

HyperStudy automatically precaches media to ensure smooth playback and precise timing:

#### How Precaching Works

1. **Automatic Detection**: The platform identifies all media used in your experiment
2. **Pre-experiment Loading**: Media is loaded before the experiment starts
3. **Browser Caching**: Optimized cache headers ensure fast subsequent access
4. **Synchronized Loading**: All participants preload media before entering states

#### Benefits

- **Eliminates Loading Delays**: No waiting for videos to buffer during critical moments
- **Improved Synchronization**: Preloaded videos start playing immediately across all participants
- **Consistent Timing**: Removes variability caused by network-dependent loading
- **Better Performance**: Reduces bandwidth usage during active experiment phases

#### What Gets Precached

- **Videos**: All videos used in Video components
- **Images**: All images used in Image components
- **Platform-Hosted Media**: Uploaded media benefits most from precaching
- **External Media**: External videos are also precached when possible

#### Best Practices

1. **Upload to Platform**: Platform-hosted media has optimal precaching support
2. **Keep Media Reasonable**: Very large files (>500MB) may take time to precache
3. **Test Precaching**: Check the console logs during testing to verify precaching completion
4. **Stable URLs**: External videos should have stable, consistent URLs

#### Monitoring Precaching

During experiment initialization, you can monitor precaching progress:
- Check browser console for "Media preload complete" messages
- Loading screens display precaching status
- The experiment won't start until essential media is preloaded

**Note**: Precaching is automatic and requires no configuration. The system intelligently determines which media to precache based on your experiment design.

## Collaboration Through Media Sharing

### Sharing with Colleagues

To collaborate using shared media:

1. Organize related media in dedicated folders
2. Set appropriate group permissions
3. Tag media with project-specific tags
4. Notify colleagues when new media is available

### Best Practices for Shared Media

When working with shared media:

1. **Consistent Naming**: Use clear, descriptive filenames
2. **Complete Metadata**: Add thorough descriptions and tags
3. **Version Control**: Include version information in filenames
4. **Attribution**: Note the source or creator in the description
5. **Usage Notes**: Add information about intended purpose

## Media Analytics

The platform provides insights into media usage:

1. **Usage Tracking**: See which experiments use each media item
2. **View Counts**: Track how often media is accessed
3. **Performance Metrics**: Monitor loading times and playback issues
4. **Storage Utilization**: Track how much of your quota is used

Access analytics in the Media Library by selecting an item and viewing its info panel.

## Advanced Features

### HLS Streaming Architecture

The platform automatically provides adaptive streaming for all uploaded videos:

1. **Automatic HLS Generation**:
   - Videos transcoded to multiple quality levels (360p-1080p)
   - Master playlist (.m3u8) with quality variants
   - 6-second segments for smooth seeking

2. **Delivery via CloudFront CDN**:
   - Global edge caching for fast delivery
   - Signed URLs for security
   - Optimized cache headers

3. **Intelligent Playback**:
   - HLS.js for cross-browser support
   - Native HLS on Safari
   - Automatic quality switching based on bandwidth

### Media Synchronization

For experiments requiring precise timing:

1. **Frame-Accurate Sync**: Videos synchronized across all participants
2. **Preloading**: Media cached before experiment start
3. **Bandwidth Adaptation**: Quality adjusts based on connection
4. **Fallback Options**: Alternative URLs if primary fails

### Monitoring Usage

To check your current storage usage:

1. Go to your Profile Settings
2. Select the "Storage" tab
3. View current usage, quota, and item breakdown
4. Get notifications when approaching quota limits

### Managing Storage

If approaching storage limits:

1. **Archive Unused Items**: Move to long-term storage
2. **Optimize File Sizes**: Reduce unnecessarily large files
3. **Remove Duplicates**: Delete redundant media
4. **Request Quota Increase**: Contact administrators if needed

## Troubleshooting

### Common Upload Issues

| Issue | Potential Solutions |
|-------|---------------------|
| Upload fails | Check file size and format; ensure stable internet connection |
| Processing stuck | For videos, check format compatibility; try re-uploading |
| Permissions error | Verify you have upload rights; check quota availability |
| File too large | Compress or resize the file; split large videos |

### Playback Problems

| Issue | Potential Solutions |
|-------|---------------------|
| Video won't play | Check format compatibility; verify processing completed |
| Poor playback quality | Check internet connection; lower video resolution |
| Image display issues | Verify format support; check image dimensions |
| Synchronization problems | Use platform-hosted media instead of external links |

### HLS Transcoding Issues

If a video's HLS status shows **Failed** or remains **Pending** for more than 10 minutes:

| Status | What It Means | What To Do |
|--------|---------------|------------|
| ⏳ Pending (>10 min) | Transcoding hasn't started | Use the retry button |
| ✗ Failed | Transcoding encountered an error | Hover to see error, then retry |
| 🔄 Processing (>15 min) | Transcoding is taking longer than expected | Wait, or contact support for large files |

**To retry transcoding:**

1. Go to Admin → Videos
2. Find the video with the issue
3. Hover over the HLS status to see error details (if any)
4. Click the **retry button** (circular arrow icon) next to the status
5. The status will change to "Pending" and transcoding will restart

**Common error messages:**

| Error | Meaning | Solution |
|-------|---------|----------|
| "Video file not found" | Original file is missing | Re-upload the video |
| "Video file is too large" | Exceeds 4GB limit | Compress or split the video |
| "Video format not supported" | Codec not recognized | Convert to MP4 (H.264) |
| "Video encoding failed" | FFmpeg processing error | Try a different format/codec |

:::tip Progressive Fallback
Even if HLS transcoding fails, your video is still playable via progressive download. HLS provides adaptive streaming benefits, but the original upload always works as a fallback.
:::

## Next Steps

Now that you understand media management, explore these related topics:

- [Image Component Configuration](./experiment-design/components/image.md)
- [Video Component Configuration](./experiment-design/components/video.md)
- [Collaborating Through Groups](./collaboration.md)
{/* The following guide is coming soon: Experiment Sharing */}
