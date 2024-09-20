import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RefreshToken extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ default: Date.now, expires: '7d' }) // Auto-delete after 7 days
  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
