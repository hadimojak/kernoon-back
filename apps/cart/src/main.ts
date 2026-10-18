import { bootstrap } from '@app/common';
import { AppModule } from './app.module';

void bootstrap(AppModule, { name: 'cart', defaultPort: 3003 });
