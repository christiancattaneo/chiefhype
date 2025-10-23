# Video Files

Place your 7 app screen recordings here.

## Required Files

- `app1.mp4` - Featured app (center of first row)
- `app2.mp4` - Second row, first app
- `app3.mp4` - Second row, second app
- `app4.mp4` - Second row, third app
- `app5.mp4` - Third row, first app
- `app6.mp4` - Third row, second app
- `app7.mp4` - Third row, third app

## Video Specifications

### Recommended Format
- **Container**: MP4
- **Video Codec**: H.264
- **Audio Codec**: AAC (optional, will be muted)
- **Resolution**: 1280x720 or 1920x1080
- **Frame Rate**: 30fps
- **Bitrate**: 2-4 Mbps
- **Duration**: 3-10 seconds
- **File Size**: < 5MB per video

### Optimization Commands

**Using FFmpeg to optimize videos:**

```bash
# Basic optimization
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -vf "scale=1280:720" app1.mp4

# High quality with smaller file size
ffmpeg -i input.mov -c:v libx264 -crf 20 -preset slow -c:a aac -b:a 128k -vf "scale=1920:1080" app1.mp4

# Create loopable video (cut to exact length)
ffmpeg -i input.mov -t 5 -c:v libx264 -crf 23 -preset medium app1.mp4
```

**Create WebM version for better browser support:**

```bash
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -vf "scale=1280:720" app1.webm
```

## Tips

1. **Keep files small** - Aim for under 5MB per video
2. **Loop-friendly content** - Ensure the end flows smoothly into the beginning
3. **No audio needed** - Videos will be muted (audio will be stripped for smaller files)
4. **Test on mobile** - Ensure videos play smoothly on mobile devices
5. **Use consistent aspect ratio** - 16:9 recommended for all videos

## Current Status

⚠️ Placeholder videos are currently in use. Replace with actual app recordings.

