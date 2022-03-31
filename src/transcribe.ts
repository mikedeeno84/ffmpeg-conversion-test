import axios from 'axios';
import { env } from './fauxEnv';
const { COGNITIVE_KEY, COGNITIVE_URL } = env;
const sttURL = `${COGNITIVE_URL}/speechtotext/v3.0/`
const transcribeUrl = sttURL + 'transcriptions';

const headers = {
    'Ocp-Apim-Subscription-Key': COGNITIVE_KEY,
    'Content-Type': 'application/json'
};

// axios(config)
//     .then(function (response) {
//         console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//         console.log(error);
//     });


export async function transcribe(fileURL: string) {
    const data = JSON.stringify({
        "contentUrls": [
            fileURL
        ],
        "properties": {
            "diarizationEnabled": true,
            "wordLevelTimestampsEnabled": false,
            "punctuationMode": "DictatedAndAutomatic",
            "profanityFilterMode": "Masked"
        },
        "locale": "en-US",
        "displayName": "Transcription using default model for en-US"
    });
    return axios.post(transcribeUrl, data, { headers });
}