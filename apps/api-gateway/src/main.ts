import { bootstrap } from '@app/common';
import { AppModule } from './app.module';

void bootstrap(AppModule, {
  name: 'api-gateway',
  defaultPort: 3000,
  cors: true,
  prefix: 'api',
});
