import { Expose, Transform } from 'class-transformer';
import { format } from 'date-fns';
import { ExposeId } from 'src/transform-id.transformer';
export class TenantEntityDto {
  @ExposeId({ name: '_id' })
  _id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) =>
    value ? format(new Date(value), 'dd-MMM-yyyy HH:mm:ss') : null,
  )
  createdAt: string | null;

  @Expose()
  subdomain: string; // e.g., tenant1

  @Expose()
  customDomain: string;

  @Expose()
  isPublished: boolean;

  @Expose()
  isDomainVerified: boolean;

  @Expose()
  libraryName: string; // The name of the library

  @Expose()
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };

  @Expose()
  contact: {
    phone: string;
    email: string;
  };

  @Expose()
  logo?: string;
}
