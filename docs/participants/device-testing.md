---
title: Device Testing
sidebar_position: 2
---

# Device Testing Guide

Before joining any experiment, it's crucial to ensure your devices are working properly. HyperStudy will test your camera, microphone, and speakers during the device setup phase before each experiment.

## What Gets Tested

During the device setup phase of an experiment, HyperStudy will automatically check:

### 1. Camera Test
- **What it does**: Displays a live preview of your webcam feed
- **What to look for**: 
  - Clear video image
  - Proper lighting (not too dark or bright)
  - Camera positioned at eye level
- **Common issues**:
  - Browser hasn't been granted camera permission
  - Another application is using the camera
  - Camera drivers need updating

### 2. Microphone Test
- **What it does**: Shows real-time audio levels as you speak
- **What to look for**:
  - Audio meter responds when you speak
  - Levels reach green/yellow zones (not constantly red)
  - No excessive background noise
- **Common issues**:
  - Browser hasn't been granted microphone permission
  - Wrong input device selected
  - Microphone muted at system level

### 3. Speaker Test
- **What it does**: Plays a test sound to verify audio output
- **What to look for**:
  - You can hear the test sound clearly
  - Volume is at a comfortable level
- **Common issues**:
  - Wrong output device selected
  - System volume too low or muted
  - Browser audio permissions blocked

### 4. Connection Test
- **What it does**: Measures your internet connection quality
- **What it checks**:
  - Download speed
  - Upload speed
  - Latency (ping)
  - Connection stability
- **Minimum requirements**:
  - 2 Mbps download speed
  - 2 Mbps upload speed
  - Less than 150ms latency

## Browser Compatibility

The Device Tester also verifies your browser compatibility:

### Recommended Browsers
- **Google Chrome** (version 90+) - Best performance
- **Microsoft Edge** (Chromium-based) - Excellent compatibility
- **Firefox** (version 88+) - Good alternative

### Not Recommended
- Safari (limited WebRTC support)
- Internet Explorer (not supported)
- Mobile browsers (limited functionality)

## Troubleshooting Common Issues

### Camera Not Detected

1. **Check browser permissions**:
   - Click the camera icon in your browser's address bar
   - Ensure camera access is allowed for hyperstudy.io

2. **Close other applications**:
   - Quit Zoom, Skype, Teams, or other video apps
   - Restart your browser

3. **Try a different browser**:
   - Switch to Chrome or Edge if using Safari/Firefox

### Microphone Not Working

1. **Check system settings**:
   - Windows: Settings → Privacy → Microphone
   - Mac: System Preferences → Security & Privacy → Microphone
   - Ensure your browser has permission

2. **Select correct device**:
   - Click the microphone settings in the Device Tester
   - Choose your preferred input device

3. **Test with another application**:
   - Verify the microphone works in other apps
   - Check if it's muted at the hardware level

### Poor Connection Quality

1. **Improve your connection**:
   - Move closer to your WiFi router
   - Use ethernet cable if possible
   - Close bandwidth-heavy applications

2. **Reduce network load**:
   - Pause downloads/uploads
   - Ask others on your network to limit streaming
   - Close unnecessary browser tabs

3. **Check with your ISP**:
   - Run a speed test at [fast.com](https://fast.com)
   - Contact your provider if speeds are below advertised

## Best Practices

### Before Every Experiment

1. **Prepare early** - Join 5-10 minutes before your scheduled time
2. **Check your environment**:
   - Good lighting (face clearly visible)
   - Quiet space (minimize background noise)
   - Stable surface for your device
3. **Prepare backup options**:
   - Have a phone hotspot ready if WiFi fails
   - Know how to quickly switch audio devices
   - Have the researcher's contact information handy

### During the Test

1. **Follow all prompts** carefully
2. **Grant permissions** when requested
3. **Note any warnings** and address them before joining
4. **Save your settings** if the option is available

## Getting Help

If you experience persistent device issues:

1. **Try basic troubleshooting** steps listed above
2. **Contact the researcher** with specific error messages
3. **Prepare alternative devices** (different computer, tablet)
4. **Test well in advance** of your scheduled experiment time

## Next Steps

Once your devices pass all tests:
- Return to [Getting Started](./getting-started.md) to continue setup
- Proceed to [Joining Experiments](./joining-experiments.md) when ready
- Review experiment-specific requirements from your researcher