import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { CatalogModule } from './catalog.module';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('CATALOG_DATABASE_URL'),
    HealthModule.forRoot('catalog'),
    CatalogModule,
  ],
})
export class AppModule {}
