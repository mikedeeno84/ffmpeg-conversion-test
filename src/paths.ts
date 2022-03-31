const path = require("path");
export const rootpath = process.cwd();
export const inputPath = path.normalize(`${rootpath}/samples`);
export const outputPath = path.normalize(`${rootpath}/converted`);