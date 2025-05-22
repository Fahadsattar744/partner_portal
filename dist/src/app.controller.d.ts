import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getStatus(): Promise<{
        message: string;
        status: string;
    }>;
}
