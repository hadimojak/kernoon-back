import { Controller, DynamicModule, Get, Inject, Module } from '@nestjs/common';

export const SERVICE_NAME = 'SERVICE_NAME';

@Controller('health')
export class HealthController {
  constructor(@Inject(SERVICE_NAME) private readonly serviceName: string) {}

  @Get()
  check() {
    return {
      status: 'ok',
      service: this.serviceName,
      timestamp: new Date().toISOString(),
    };
  }
}

@Module({})
export class HealthModule {
  static forRoot(serviceName: string): DynamicModule {
    return {
      module: HealthModule,
      controllers: [HealthController],
      providers: [{ provide: SERVICE_NAME, useValue: serviceName }],
    };
  }
}
