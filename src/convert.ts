import ffmpeg from "./ffmpeg";
import { inputPath, outputPath } from './paths';
import fs from 'fs';
import { Writable } from 'stream';
import { BlobServiceClient } from "@azure/storage-blob";
import { storageAccount } from "./storage";
import { Readable } from 'stream';

export async function convert(filename: string, ext: string, outputToBlob?: boolean) {
    return new Promise<void>(async (resolve, reject) => {
        const filenameNoExt = filename.split('.')[0];
        const inputStream = fs.createReadStream(`${inputPath}/${filename}`);
        const outputeFileName = `${filenameNoExt}.${ext}`;
        const outputFilePath = `${outputPath}/${outputeFileName}`;
        const outputWritableFile = fs.createWriteStream(outputFilePath);
        // const readableOutput = new Readable({
        //     read() { }
        // });
        // const outputWritable = new Writable();
        // outputWritable.on('close', () => {
        //     readableOutput.push(null);
        //     console.log('there\'s done too');
        // })
        // outputWritable._write = (chunk, encoding, next) => {
        //     readableOutput.push(chunk);
        //     if (chunk === null) console.log('null chunk received');
        //     next()
        // }
        const inputContainerName = 'audio-samples';
        const blobServiceClient = new BlobServiceClient(storageAccount.getClientTokenUrl(inputContainerName));

        const containerClient = blobServiceClient.getContainerClient(inputContainerName);
        const blobClient = containerClient.getBlockBlobClient(filename);
        const blockRes = await blobClient.download();
        // const duplex = new Duplex();
        // const output = new 
        ffmpeg()
            .input(inputStream)
            // .input(blockRes.readableStreamBody as Readable)
            // .output(outputFilePath)
            .on('end', () => {
                resolve();
            })
            .on('error', (error) => {
                reject(error);
            })
            // .audioChannels(1)
            // .audioBitrate(16)
            // .run();
            // .save(outputFilePath);
            .output(outputWritableFile, { end: true });
        const outputContainerName = 'audio-output';
        const outputClient = new BlobServiceClient(storageAccount.getClientTokenUrl(outputContainerName));
        const outputContainerClient = outputClient.getContainerClient(outputContainerName);
        const uploadClient = outputContainerClient.getBlockBlobClient(outputeFileName);
        // await uploadClient.uploadStream(readableOutput);
        // output.pipe(output2);
    })
}