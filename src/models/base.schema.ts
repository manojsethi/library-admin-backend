import { Document } from 'mongoose';

export abstract class BaseModel extends Document {
  createdAt: Date;
  updatedAt: Date;
}
