import { rootpath } from "./paths"
const envFile = require(rootpath + '/' + 'local.settings.json');
export const env = envFile.Values;
// export const env = process.env;