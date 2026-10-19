import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('CATALOG_DATABASE_URL'),
    HealthModule.forRoot('catalog'),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class AppModule {}
