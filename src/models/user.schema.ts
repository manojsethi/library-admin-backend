import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string; // User's email for login

  @Prop({ required: true })
  password: string; // Hashed password

  @Prop({ required: true })
  name: string; // User's name

  @Prop({ type: [String], default: ['tenant'] })
  roles: string[]; // Roles array, e.g., ['admin', 'tenant']

  @Prop({ default: true })
  isActive: boolean; // Status of the user

  @Prop({ required: true })
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
