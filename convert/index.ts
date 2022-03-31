
console.log('start me up')
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { BlobServiceClient } from '@azure/storage-blob';
import { Readable, Writable } from 'stream';
console.log('start load storage')
import { storageAccount } from '../src/storage';
console.log('start load ffmpeg')
import ffmpeg from "../src/ffmpeg";
import os from 'os';

const release_tag = "b4.4";
const release_name = "4.4";


const httpTrigger: AzureFunction = async function (context: Context, req: GenericRequest<fileRequestBody>): Promise<void> {
    let errors;

    try {
        context.log('HTTP trigger function processed a request\n');
        const inputContainerName = 'audio-samples';
        context.log('getting request data');
        const filename = req.body && req.body?.filename;
        const ext = req.body && req.body?.outputFormat;
        context.log('fetched request data');
        context.log(filename, ext);
        context.log('setting up blob client');
        const blobServiceClient = new BlobServiceClient(storageAccount.getClientTokenUrl(inputContainerName));
        const containerClient = blobServiceClient.getContainerClient(inputContainerName);
        const blobClient = containerClient.getBlobClient(filename);
        context.log('dowloading input')
        const blockRes = await blobClient.download();
        context.log('input downloaded');
        context.log('Creating Read/Write Streams....');


        const filenameNoExt = filename.split('.')[0];
        const outputeFileName = `${filenameNoExt}.${ext}`;
        const readableOutput = new Readable({
            read() { }
        });
        const outputWritable = new Writable();
        outputWritable.on('close', () => {
            readableOutput.push(null);
            context.log('there\'s done too');
        })
        outputWritable._write = (chunk, encoding, next) => {
            readableOutput.push(chunk);
            if (chunk === null) context.log('null chunk received');
            next()
        }
        context.log('setting up output blob client');
        const outputContainerName = 'audio-output';
        const outputClient = new BlobServiceClient(storageAccount.getClientTokenUrl(outputContainerName));
        const outputContainerClient = outputClient.getContainerClient(outputContainerName);
        const uploadClient = outputContainerClient.getBlockBlobClient(outputeFileName);
        context.log('calling ffmpeg');
        ffmpeg()
            .input(blockRes.readableStreamBody as Readable)
            .audioChannels(1)
            .audioBitrate(16)
            .format(ext)
            .on('codecData',context.log)
            .on('error', (error) => {
                context.log.error(error);
            })
            .on('end', () => { context.log('ffmpeg done processessing') })
            .stream(outputWritable, { end: true });
        context.log('uploading converted file to blob');

        await uploadClient.uploadStream(readableOutput);
        context.log('ok all done');
    } catch (e) {
        errors = e;
        context.log(e);
    }
    const data = {
        body: { status: 'done', errors }
    }
    context.res = data

};

export default httpTrigger;

interface GenericRequest<T> extends HttpRequest {
    body?: T
}
interface fileRequestBody {
    filename: string;
    outputFormat?: string
}