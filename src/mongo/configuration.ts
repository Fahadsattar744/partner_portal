import { env } from 'node:process';

import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  url: env.MONGODB_URL,
  username: env.MONGODB_ATLAS_USERNAME,
  password: env.MONGODB_ATLAS_PASSWORD,
  host: env.MONGODB_ATLAS_URL,
  database: env.MONGODB_ATLAS_DATABASE || 'partner_portal',
}));
