import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoConfigService {
  constructor(private readonly configService: ConfigService) {}

  public get username(): string {
    return this.configService.get<string>('mongo.username') ?? '';
  }

  public get password(): string {
    return this.configService.get<string>('mongo.password') ?? '';
  }

  public get host(): string {
    return this.configService.get<string>('mongo.host') ?? '';
  }

  public get database(): string {
    return this.configService.get<string>('mongo.database') ?? '';
  }

  public get url(): string {
    if (this.host && this.username && this.password) {
      return `mongodb+srv://${this.username}:${this.password}@${this.host}/${this.database}?retryWrites=true&w=majority`;
    }

    return this.configService.get<string>('mongo.url') ?? '';
  }
}
