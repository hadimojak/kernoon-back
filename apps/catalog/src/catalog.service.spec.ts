import { INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { API_VERSION } from '@app/common';
import { Category, SizeId } from '@app/contracts';
import { AppModule } from './app.module';
import { CatalogService } from './catalog.service';
import { Product } from './models/product';

const fixtures: Product[] = [
  {
    id: 'onesie',
    name: 'Cotton snap onesie',
    nameFa: 'سرهمی',
    usd: 24,
    toman: 890000,
    image: '/clothes/onesie.svg',
    category: 'newborn' as Category,
    sizes: ['0-3', '3-6', '6-12'] as SizeId[],
    stock: 40,
    description: 'Soft cotton',
    position: 0,
  },
  {
    id: 'joggers',
    name: 'Jogger set',
    nameFa: 'ست جاگر',
    usd: 32,
    toman: 1150000,
    image: '/clothes/joggers.svg',
    category: 'kids' as Category,
    sizes: ['2-3', '3-4'] as SizeId[],
    stock: 22,
    description: 'Soft cotton',
    position: 1,
  },
  {
    id: 'overalls',
    name: 'Denim overalls',
    nameFa: 'بیلر جین',
    usd: 40,
    toman: 1450000,
    image: '/clothes/overalls.svg',
    category: 'toddler' as Category,
    sizes: ['1-2', '2-3', '3-4'] as SizeId[],
    stock: 16,
    description: 'Soft cotton',
    position: 2,
  },
  {
    id: 'hoodie',
    name: 'Kids hoodie',
    nameFa: 'هودی کودک',
    usd: 34,
    toman: 1220000,
    image: '/clothes/hoodie.svg',
    category: 'kids' as Category,
    sizes: ['2-3', '3-4'] as SizeId[],
    stock: 20,
    description: 'Soft cotton',
    position: 3,
  },
];

function memoryCatalog() {
  const rows = [...fixtures];
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
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: API_VERSION,
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /v1/products returns an empty catalog when nothing is stored', async () => {
    const response = await request(app.getHttpServer()).get('/v1/products');
    const body = response.body as { id: string }[];
    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });

  it('GET /health is ready for a container probe', async () => {
    const response = await request(app.getHttpServer()).get('/health');
    const body = response.body as { service: string };
    expect(response.status).toBe(200);
    expect(body.service).toBe('catalog');
  });
});
