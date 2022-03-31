import ffmpeg from "./ffmpeg";
export function probe (inputFilePath: string) {
    ffmpeg.ffprobe(inputFilePath, function (err, metadata) {
        console.log(`Metadata:`);
        console.log(metadata);
    });
}