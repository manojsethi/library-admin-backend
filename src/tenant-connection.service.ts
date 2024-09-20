import { Injectable, Scope } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, createConnection } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class TenantConnectionService {
  private tenantConnections: Map<string, Connection> = new Map();

  constructor(@InjectConnection() private defaultConnection: Connection) {}

  async getTenantConnection(dbName: string): Promise<Connection> {
    // Check if we already have an open connection to this tenant's DB
    if (this.tenantConnections.has(dbName)) {
      return this.tenantConnections.get(dbName);
    }

    // If not, create a new connection for the tenant's DB
    const tenantUri = this.getTenantDatabaseUri(dbName);
    const connection = await createConnection(tenantUri);

    this.tenantConnections.set(dbName, connection);
    return connection;
  }

  private getTenantDatabaseUri(dbName: string): string {
    const baseUri = this.defaultConnection.host; // use the same host
    return `mongodb+srv://Prsnt:prsnt123@cluster99.7bmrjhw.mongodb.net/${dbName}`;
  }

  async closeTenantConnection(dbName: string): Promise<void> {
    const connection = this.tenantConnections.get(dbName);
    if (connection) {
      await connection.close();
      this.tenantConnections.delete(dbName);
    }
  }
}
