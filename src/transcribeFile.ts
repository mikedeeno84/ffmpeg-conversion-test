import { storageAccount } from "./storage";
import { transcribe } from "./transcribe";

const args = process.argv.slice(2);
const filename = args[0];
const urlBlob = storageAccount.getBlobDownloadUrl('audio-samples', filename);
// const uploadUrl = storageAccount.getClientTokenUrl(containerName);
transcribe(filename)
    .then(res => {
        const data = JSON.parse(res.data);
        const statusUrl: string = data?.contentUrls[0];
        console.log('RES: ', statusUrl);
        const txId = statusUrl?.split('/').pop()
        console.log('TXID:', txId.split('/').pop())
    })
    .catch(console.error);