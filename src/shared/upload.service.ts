import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly defaultExpiry = 60 * 60; // Default expiry time for signed URLs (1 hour)

  constructor(private readonly configService: ConfigService) {
    // Retrieve configuration values using ConfigService
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');

    this.s3Client = new S3Client({
      region: this.configService.get<string>('S3_REGION'), // Region for your Space
      endpoint: this.configService.get<string>('S3_ENDPOINT'), // Custom endpoint for DigitalOcean Spaces
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'), // Access key
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'), // Secret key
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folderPath: string,
  ): Promise<string> {
    const fileKey = `${folderPath}/${uuidv4()}-${file.originalname}`; // Unique file key with UUID

    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer, // File buffer from Multer
      ACL: 'private', // Set ACL to private
      ContentType: file.mimetype, // Set the correct MIME type
    };

    try {
      // Upload the file
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return fileKey;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getSignedUrl(
    fileKey: string,
    expiry = this.defaultExpiry,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      // Generate signed URL
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiry,
      });
      return url;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }
}
