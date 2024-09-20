import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from 'src/models/refreshtoken.schema';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async saveRefreshToken(userId: string, token: string): Promise<void> {
    // Save a new refresh token, allowing multiple tokens per user
    await this.refreshTokenModel.create({ userId, token });
  }

  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    // Find the refresh token by userId, token, and deviceId
    const refreshToken = await this.refreshTokenModel
      .findOne({ userId, token })
      .exec();
    return !!refreshToken;
  }

  async revokeRefreshToken(userId: string, token: string): Promise<void> {
    // Revoke a specific refresh token by device/session
    await this.refreshTokenModel.deleteOne({ userId, token }).exec();
  }

  async revokeAllTokens(userId: string): Promise<void> {
    // Revoke all refresh tokens for a user (e.g., on logout from all devices)
    await this.refreshTokenModel.deleteMany({ userId }).exec();
  }
}
