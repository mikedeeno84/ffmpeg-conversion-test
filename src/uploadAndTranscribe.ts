import { upload } from "./upload";
import { createReadStream, existsSync } from 'fs';
import { outputPath } from "./paths";
import { storageAccount } from "./storage";
import { transcribe } from "./transcribe";
const args = process.argv.slice(2);
const filename = args[0];
const filepath = outputPath + '/' + filename;
const exists = existsSync(filepath);
const urlBlob = storageAccount.getBlobDownloadUrl('audio-samples', filename);
if (filepath) {
    const stream = createReadStream(filepath);
    upload(stream, filename)
        .then(() => {
            return transcribe(urlBlob);
        })
        .then(res => {
            const data = JSON.parse(res.data);
            const statusUrl: string = data?.contentUrls[0];
            console.log('RES: ', statusUrl);
            const txId = statusUrl?.split('/').pop()
            console.log('TXID:', txId.split('/').pop())
        })
        .catch(console.error);
}
