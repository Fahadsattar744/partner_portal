import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getStatus() {
    return {
      message: 'Server is running',
      status: 'OK',
    };
  }
}
