import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { ProductsModule } from './products.module';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('PRODUCTS_DATABASE_URL'),
    HealthModule.forRoot('products'),
    ProductsModule,
  ],
})
export class AppModule {}
