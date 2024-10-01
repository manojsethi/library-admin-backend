import { Exclude, Expose, Transform } from 'class-transformer';
import { format } from 'date-fns';
import { ExposeId } from 'src/transform-id.transformer';
export class UserDto {
  @ExposeId({ name: '_id' })
  _id: string;

  @Expose() // Explicitly expose this field
  email: string;

  @Expose()
  name: string;

  @Expose()
  roles: string[];

  @Expose()
  phone: string;

  @Expose()
  @Transform(({ value }) =>
    value ? format(new Date(value), 'dd-MMM-yyyy HH:mm:ss') : null,
  )
  createdAt: string | null;

  // Exclude password and isActive
  @Exclude()
  password: string;

  @Exclude()
  isActive: boolean;
}
