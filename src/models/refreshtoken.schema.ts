import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base.schema';

@Schema()
export class RefreshToken extends BaseModel {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ default: Date.now, expires: '7d' })
  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
