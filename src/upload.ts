import { storageAccount } from './storage';
import { Readable } from 'stream';
import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob';

const containerName = 'audio-samples';
const blobService = new BlobServiceClient(storageAccount.getClientTokenUrl(containerName));
// const uploadUrl = storageAccount.getClientTokenUrl(containerName);



// get Container - full public read access
const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);
export async function upload(stream: Readable, filename: string) {
    const blobClient = containerClient.getBlockBlobClient(filename);
    await blobClient.uploadStream(stream);
}


// set mimetype as determined from browser with file upload control
// const options = { blobHTTPHeaders: { blobContentType: file.type } };
// upload file