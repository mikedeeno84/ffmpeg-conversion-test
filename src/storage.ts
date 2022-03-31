import { env } from './fauxEnv';
const { BLOB_NAME, BLOB_KEY, BLOB_SAS } = env;
import {
    BlobSASPermissions,
    BlobSASSignatureValues,
    generateBlobSASQueryParameters,
    SASProtocol,
    SASQueryParameters,
    StorageSharedKeyCredential,
  } from '@azure/storage-blob';
  import moment from 'moment';
  
  export class AzureStorageCredentials {
    private readonly creds: StorageSharedKeyCredential;
  
    constructor(config: AzureStorageConfig) {
      this.creds = new StorageSharedKeyCredential(config.accountName, config.key);
    }
    public getAccountName(): string {
      return this.creds.accountName;
    }
    public getBaseUrl(): string {
      return `https://${this.getAccountName()}.blob.core.windows.net`;
    }
    public getContainerUrl(containerName: string): string {
      return this.getBaseUrl() + '/' + containerName;
    }
    public getClientTokenUrl(containerName: string): string {
      const baseUrl = this.getBaseUrl();
      const token = this.generateClientToken(containerName);
      return baseUrl + '?' + token.toString();
    }
    public generateClientToken(containerName: string): SASQueryParameters {
      const startsOn = new Date();
      const expiresOn = moment().add(1, 'hour').toDate();
      const options = this.generateBlobSASSignatureValues({
        containerName,
        startsOn,
        expiresOn,
      });
      return this.generateSAS(options);
    }
  
    public getBlobDownloadUrl(containerName: string, fileName: string): string {
      const containerURL = this.getContainerUrl(containerName);
      const fileURL = containerURL + '/' + encodeURI(fileName) + '?';
      const token = this.generateClientToken(containerName);
      return fileURL + token.toString();
    }
  
    private generateBlobSASSignatureValues(
      config: AzureSASGenerateOptions
    ): BlobSASSignatureValues {
      return {
        protocol: SASProtocol.Https,
        permissions: BlobSASPermissions.parse('racwd'),
        ...config,
      };
    }
  
    private generateSAS(options: BlobSASSignatureValues): SASQueryParameters {
      return generateBlobSASQueryParameters(options, this.creds);
    }
  }
  
  export interface AzureStorageConfig {
    key: string;
    accountName: string;
  }
  
  export interface AzureSASGenerateOptions {
    startsOn: Date;
    expiresOn: Date;
    containerName: string;
  }
export const storageAccount = new AzureStorageCredentials({key: BLOB_KEY, accountName: BLOB_NAME});