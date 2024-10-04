import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { BaseModel } from './base.schema';

@Schema({ timestamps: true })
export class TenantEntity extends BaseModel {
  @Prop({ required: true, unique: true })
  subdomain: string; // e.g., tenant1

  @Prop({ unique: true, sparse: true })
  customDomain: string;

  @Prop({ required: true })
  name: string; // Tenant's name

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: true })
  isDomainVerified: boolean;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  users: MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creator: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  dbName: string;

  // New fields added
  @Prop({ required: true })
  libraryName: string; // The name of the library

  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    _id: false,
  })
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };

  @Prop({
    type: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    _id: false,
  })
  contact: {
    phone: string;
    email: string;
  };

  @Prop()
  logo?: string; // URL or path to the logo image, optional field
}

export const TenantEntitySchema = SchemaFactory.createForClass(TenantEntity);
