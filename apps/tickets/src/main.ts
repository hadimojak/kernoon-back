import { bootstrap } from '@app/common';
import { AppModule } from './app.module';

void bootstrap(AppModule, { name: 'tickets', defaultPort: 3010, cors: true });
