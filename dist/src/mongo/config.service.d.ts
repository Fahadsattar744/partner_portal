import { ConfigService } from '@nestjs/config';
export declare class MongoConfigService {
    private readonly configService;
    constructor(configService: ConfigService);
    get username(): string;
    get password(): string;
    get host(): string;
    get database(): string;
    get url(): string;
}
