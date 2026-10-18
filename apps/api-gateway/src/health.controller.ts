import { Controller, Get } from '@nestjs/common';
import { serviceNames, ServiceClient, serviceUrls } from '@app/common';

@Controller('health')
export class HealthController {
  constructor(private readonly client: ServiceClient) {}

  @Get()
  async check() {
    const urls = serviceUrls();
    const checks = await Promise.all(
      serviceNames.map(async (name) => {
        try {
          const result = await this.client.send({
            baseUrl: urls[name],
            service: name,
            method: 'GET',
            path: '/health',
          });
          return { service: name, ok: result.status === 200 };
        } catch {
          return { service: name, ok: false };
        }
      }),
    );
    return {
      status: checks.every((check) => check.ok) ? 'ok' : 'degraded',
      service: 'api-gateway',
      checks,
    };
  }
}
