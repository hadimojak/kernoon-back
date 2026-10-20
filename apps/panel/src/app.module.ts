import { Module } from '@nestjs/common';
import { AppConfigModule, databaseModule, HealthModule } from '@app/common';
import { PanelModule } from './panel.module';

@Module({
  imports: [
    AppConfigModule,
    databaseModule('PANEL_DATABASE_URL'),
    HealthModule.forRoot('panel'),
    PanelModule,
  ],
})
export class AppModule {}
