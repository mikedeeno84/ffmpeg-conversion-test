import { inputPath } from './paths';
import { probe } from './probe';

const args = process.argv.slice(2);
const filename = args[0];
// const filename = filename.split('.')[0];
const inputFilePath = `${inputPath}/${filename}`;
probe(inputFilePath);