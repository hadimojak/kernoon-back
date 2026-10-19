import { Module } from '@nestjs/common';
import { AppConfigModule, HealthModule } from '@app/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [AppConfigModule, HealthModule.forRoot('catalog')],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class AppModule {}
