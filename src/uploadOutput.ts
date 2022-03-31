import { upload } from "./upload";
import { createReadStream,  } from 'fs';
import { outputPath } from "./paths";
const filename = 'debate-craig-rosenberg.mp3';
const filepath = outputPath + '/' + filename;

const stream = createReadStream(filepath);
upload(stream, filename)
    .then(console.log)
    .catch(console.error);


