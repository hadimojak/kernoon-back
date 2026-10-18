import { bootstrap } from '@app/common';
import { AppModule } from './app.module';

void bootstrap(AppModule, { name: 'orders', defaultPort: 3004 });
