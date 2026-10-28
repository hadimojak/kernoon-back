import { bootstrap } from '@app/common';
import { AppModule } from './app.module';

void bootstrap(AppModule, { name: 'products', defaultPort: 3009 });
