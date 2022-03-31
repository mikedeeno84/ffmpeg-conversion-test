import ffmpeg from "./ffmpeg";
import { inputPath, outputPath } from './paths';
const filename = 'debate-craig-rosenberg.mp3';
const inputFilePath = `${inputPath}/${filename}`;

const filenameNoExt = filename.split('.')[0];
const outputFilePath = `${outputPath}/${filenameNoExt}.mp3`;
// const fs = require('fs');
// var outStream = fs.createWriteStream('/path/to/output.mp4');

try {
  const startTime = new Date();
  // ffmpeg()
  //   .input(inputPath)
  //   .output(outputPath)
  //   .audioChannels(1)
  //   .audioBitrate(16)
  //   .run();
// //   const endTime = new Date();
// //   const timeToRun = endTime - startTime;

  ffmpeg.ffprobe(inputFilePath, function (err, metadata) {
    console.log("Metadata:");
    console.log(metadata);
  });
} catch (e) {
  console.log(e);
}
