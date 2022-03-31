import { convert } from "./convert";
const args = process.argv.slice(2);
const filename = args[0];
const extension = args[1];
if (filename && extension) {
        const startTime = new Date();
        convert(filename, extension)
            .then(() => {
                const endTime = new Date();
                const timeToRun = endTime.getTime() - startTime.getTime();
                console.log(`Time run in ms: ${timeToRun}`);
            })
            .catch(console.error);
}