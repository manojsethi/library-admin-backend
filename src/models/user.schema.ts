import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from './base.schema';

@Schema({ timestamps: true })
export class User extends BaseModel {
  @Prop({ required: true, unique: true })
  @Expose() // Explicitly expose this field
  email: string;

  @Prop({ required: true })
  @Exclude() // Exclude password
  password: string;

  @Prop({ required: true })
  @Expose() // Explicitly expose this field
  name: string;

  @Prop({ type: [String], default: ['tenant'] })
  @Expose() // Explicitly expose this field
  roles: string[];

  @Prop({ default: true })
  @Exclude() // Exclude isActive
  isActive: boolean;

  @Prop({ required: true })
  @Expose() // Explicitly expose this field
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
