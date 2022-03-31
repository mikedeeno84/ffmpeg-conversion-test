import { ffmpegPath, ffprobePath } from 'ffmpeg-ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
console.log(ffmpegPath);
console.log(fs.existsSync(ffmpegPath));
export default ffmpeg;