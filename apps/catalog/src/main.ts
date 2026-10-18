import { bootstrap } from '@app/common';
import { AppModule } from './app.module';

void bootstrap(AppModule, { name: 'catalog', defaultPort: 3002 });
