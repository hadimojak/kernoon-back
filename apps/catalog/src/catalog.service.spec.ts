import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { catalogSeed } from '@app/contracts';
import { AppModule } from './app.module';
import { CatalogService } from './catalog.service';
import { Product } from './models/product';

function memoryCatalog() {
  const rows = catalogSeed.map((product, position) => ({
    ...product,
    sizes: [...product.sizes],
    position,
  }));
  const repo = {
    count: async () => rows.length,
    find: async () => rows,
    findOne: async ({ where }: { where: { id: string } }) =>
      rows.find((row) => row.id === where.id) ?? null,
    create: (value: Product) => value,
    save: async (value: Product | Product[]) => value,
  };
  return new CatalogService(repo as unknown as Repository<Product>);
}

describe('CatalogService', () => {
  const catalog = memoryCatalog();

  it('filters by the frontend category ids', async () => {
    const newborn = await catalog.list('newborn');
    expect(newborn.map((product) => product.id)).toEqual(['onesie']);
  });

  it('filters by size', async () => {
    const ids = (await catalog.list(undefined, '3-4')).map(
      (product) => product.id,
    );
    expect(ids).toEqual(['joggers', 'overalls', 'hoodie']);
  });
});

describe('Catalog HTTP', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /products returns the clothes catalog', async () => {
    const response = await request(app.getHttpServer()).get('/products');
    const body = response.body as { id: string }[];
    expect(response.status).toBe(200);
    expect(body).toHaveLength(8);
    expect(body[0].id).toBe('onesie');
  });

  it('GET /health is ready for a container probe', async () => {
    const response = await request(app.getHttpServer()).get('/health');
    const body = response.body as { service: string };
    expect(response.status).toBe(200);
    expect(body.service).toBe('catalog');
  });
});
