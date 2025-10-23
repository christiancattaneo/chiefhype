#!/bin/bash

# ==========================================
# Video Optimization Script
# ==========================================
# This script optimizes video files for web delivery
# Requires: ffmpeg
#
# Usage:
#   ./scripts/optimize-videos.sh input.mov output.mp4
#   ./scripts/optimize-videos.sh input.mov output.mp4 1280:720
#
# Arguments:
#   $1 - Input video file
#   $2 - Output video file (optional, defaults to app_optimized.mp4)
#   $3 - Resolution (optional, defaults to 1280:720)
# ==========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: ffmpeg is not installed${NC}"
    echo "Install ffmpeg:"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu: sudo apt-get install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/"
    exit 1
fi

# Validate arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: No input file specified${NC}"
    echo "Usage: $0 input.mov [output.mp4] [resolution]"
    echo "Example: $0 myapp.mov app1.mp4 1280:720"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${2:-app_optimized.mp4}"
RESOLUTION="${3:-1280:720}"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}Error: Input file '$INPUT_FILE' not found${NC}"
    exit 1
fi

echo -e "${GREEN}=== Video Optimization ===${NC}"
echo "Input:  $INPUT_FILE"
echo "Output: $OUTPUT_FILE"
echo "Resolution: $RESOLUTION"
echo ""

# Get input file info
echo -e "${YELLOW}Input file information:${NC}"
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height -of default=noprint_wrappers=1 "$INPUT_FILE"
echo ""

# Optimize video
echo -e "${YELLOW}Optimizing video...${NC}"
ffmpeg -i "$INPUT_FILE" \
    -c:v libx264 \
    -crf 23 \
    -preset medium \
    -vf "scale=$RESOLUTION" \
    -an \
    -movflags +faststart \
    -y \
    "$OUTPUT_FILE"

echo ""
echo -e "${GREEN}✓ Optimization complete!${NC}"
echo ""

# Show output file info
echo -e "${YELLOW}Output file information:${NC}"
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height -of default=noprint_wrappers=1 "$OUTPUT_FILE"

# Show file size comparison
INPUT_SIZE=$(stat -f%z "$INPUT_FILE" 2>/dev/null || stat -c%s "$INPUT_FILE" 2>/dev/null)
OUTPUT_SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE" 2>/dev/null)

INPUT_SIZE_MB=$(echo "scale=2; $INPUT_SIZE / 1024 / 1024" | bc)
OUTPUT_SIZE_MB=$(echo "scale=2; $OUTPUT_SIZE / 1024 / 1024" | bc)
REDUCTION=$(echo "scale=1; 100 - ($OUTPUT_SIZE * 100 / $INPUT_SIZE)" | bc)

echo ""
echo -e "${GREEN}Size Comparison:${NC}"
echo "  Input:  ${INPUT_SIZE_MB} MB"
echo "  Output: ${OUTPUT_SIZE_MB} MB"
echo "  Reduction: ${REDUCTION}%"
echo ""

# Check if output is under 5MB
if (( $(echo "$OUTPUT_SIZE_MB < 5" | bc -l) )); then
    echo -e "${GREEN}✓ Output file is under 5MB - optimal for web delivery${NC}"
else
    echo -e "${YELLOW}⚠ Output file is over 5MB - consider reducing resolution or duration${NC}"
fi

echo ""
echo -e "${GREEN}Done!${NC}"

