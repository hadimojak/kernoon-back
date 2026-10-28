export const categories = [
  'newborn',
  'toddler',
  'kids',
  'sleepwear',
  'outerwear',
] as const;

export type Category = (typeof categories)[number];

export const sizeIds = ['0-3', '3-6', '6-12', '1-2', '2-3', '3-4'] as const;

export type SizeId = (typeof sizeIds)[number];

/** Per-size body / garment measurements for a product size guide. */
export type SizeGuideRow = {
  size: SizeId;
  heightCm: string;
  chestCm: string;
  waistCm: string;
  note?: string;
};

const defaultMeasurements: Record<
  SizeId,
  Pick<SizeGuideRow, 'heightCm' | 'chestCm' | 'waistCm'>
> = {
  '0-3': { heightCm: '50–61', chestCm: '40–43', waistCm: '40–43' },
  '3-6': { heightCm: '61–67', chestCm: '43–45', waistCm: '43–45' },
  '6-12': { heightCm: '67–74', chestCm: '45–48', waistCm: '45–47' },
  '1-2': { heightCm: '74–86', chestCm: '48–51', waistCm: '47–50' },
  '2-3': { heightCm: '86–98', chestCm: '51–54', waistCm: '50–53' },
  '3-4': { heightCm: '98–104', chestCm: '54–56', waistCm: '53–55' },
};

export function defaultSizeGuide(
  sizes: SizeId[],
  note?: string,
): SizeGuideRow[] {
  return sizes.map((size) => ({
    size,
    ...defaultMeasurements[size],
    ...(note ? { note } : {}),
  }));
}

export const tiers = ['standard', 'deluxe', 'premium'] as const;

export type Tier = (typeof tiers)[number];

export const roles = ['customer', 'seller', 'masterSeller'] as const;

export type Role = (typeof roles)[number];

export const iranianBanks = [
  'melli',
  'mellat',
  'saderat',
  'sepah',
  'tejarat',
  'keshavarzi',
  'maskan',
  'refah',
  'pasargad',
  'parsian',
  'saman',
  'sarmayeh',
  'ayandeh',
  'other',
] as const;

export type IranianBank = (typeof iranianBanks)[number];

export const paymentGateways = ['zarinpal', 'idpay', 'saman', 'mellat'] as const;

export type PaymentGateway = (typeof paymentGateways)[number];

export const iranProvinces = [
  'east-azerbaijan',
  'west-azerbaijan',
  'ardabil',
  'isfahan',
  'alborz',
  'ilam',
  'bushehr',
  'tehran',
  'chaharmahal-and-bakhtiari',
  'south-khorasan',
  'razavi-khorasan',
  'north-khorasan',
  'khuzestan',
  'zanjan',
  'semnan',
  'sistan-and-baluchestan',
  'fars',
  'qazvin',
  'qom',
  'kurdistan',
  'kerman',
  'kermanshah',
  'kohgiluyeh-and-boyer-ahmad',
  'golestan',
  'gilan',
  'lorestan',
  'mazandaran',
  'markazi',
  'hormozgan',
  'hamadan',
  'yazd',
] as const;

export type IranProvince = (typeof iranProvinces)[number];

/** Stable seed IDs shared by identity + products. */
export const SEED_MASTER_SELLER_ID = 'a0000000-0000-4000-8000-000000000001';
export const SEED_SELLER_ID = 'a0000000-0000-4000-8000-000000000002';

export type CatalogProduct = {
  id: string;
  name: string;
  nameFa: string;
  usd: number;
  toman: number;
  image: string;
  images: string[];
  category: Category;
  sizes: SizeId[];
  sizeGuide: SizeGuideRow[];
  stock: number;
  description: string;
  masterSellerId?: string;
  sellerId?: string;
};

/** Stable product seed UUIDs (slug → uuid). */
export const seedProductIds = {
  onesie: 'b0000000-0000-4000-8000-000000000001',
  tee: 'b0000000-0000-4000-8000-000000000002',
  cardigan: 'b0000000-0000-4000-8000-000000000003',
  joggers: 'b0000000-0000-4000-8000-000000000004',
  sleep: 'b0000000-0000-4000-8000-000000000005',
  overalls: 'b0000000-0000-4000-8000-000000000006',
  hoodie: 'b0000000-0000-4000-8000-000000000007',
  dress: 'b0000000-0000-4000-8000-000000000008',
} as const;

const catalogSeedBase: Omit<CatalogProduct, 'sizeGuide'>[] = [
  {
    id: seedProductIds.onesie,
    name: 'Cotton snap onesie',
    nameFa: 'سرهمی نخی دکمه‌دار',
    usd: 24,
    toman: 890000,
    image: '/clothes/onesie.svg',
    images: ['/clothes/onesie.svg'],
    category: 'newborn',
    sizes: ['0-3', '3-6', '6-12'],
    stock: 40,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: seedProductIds.tee,
    name: 'Striped toddler tee',
    nameFa: 'تی‌شرت راه‌راه نوپا',
    usd: 18,
    toman: 650000,
    image: '/clothes/tee.svg',
    images: ['/clothes/tee.svg'],
    category: 'toddler',
    sizes: ['1-2', '2-3'],
    stock: 36,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: seedProductIds.cardigan,
    name: 'Knit cardigan',
    nameFa: 'ژاکت بافت',
    usd: 36,
    toman: 1290000,
    image: '/clothes/cardigan.svg',
    images: ['/clothes/cardigan.svg'],
    category: 'outerwear',
    sizes: ['6-12', '1-2', '2-3'],
    stock: 18,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: seedProductIds.joggers,
    name: 'Jogger set',
    nameFa: 'ست جاگر',
    usd: 32,
    toman: 1150000,
    image: '/clothes/joggers.svg',
    images: ['/clothes/joggers.svg'],
    category: 'kids',
    sizes: ['2-3', '3-4'],
    stock: 22,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: seedProductIds.sleep,
    name: 'Cotton sleep sack',
    nameFa: 'قنداق خواب نخی',
    usd: 28,
    toman: 990000,
    image: '/clothes/sleep.svg',
    images: ['/clothes/sleep.svg'],
    category: 'sleepwear',
    sizes: ['0-3', '3-6', '6-12'],
    stock: 30,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: seedProductIds.overalls,
    name: 'Denim overalls',
    nameFa: 'بیلر جین',
    usd: 40,
    toman: 1450000,
    image: '/clothes/overalls.svg',
    images: ['/clothes/overalls.svg'],
    category: 'toddler',
    sizes: ['1-2', '2-3', '3-4'],
    stock: 16,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: seedProductIds.hoodie,
    name: 'Kids hoodie',
    nameFa: 'هودی کودک',
    usd: 34,
    toman: 1220000,
    image: '/clothes/hoodie.svg',
    images: ['/clothes/hoodie.svg'],
    category: 'kids',
    sizes: ['2-3', '3-4'],
    stock: 20,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: seedProductIds.dress,
    name: 'Summer dress',
    nameFa: 'پیراهن تابستانی',
    usd: 30,
    toman: 1080000,
    image: '/clothes/dress.svg',
    images: ['/clothes/dress.svg'],
    category: 'toddler',
    sizes: ['1-2', '2-3'],
    stock: 24,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
];

export const catalogSeed: CatalogProduct[] = catalogSeedBase.map((product) => ({
  ...product,
  sizeGuide: defaultSizeGuide(product.sizes),
}));

export type PublicUser = {
  id: string;
  firstName: string;
  lastName: string;

  username: string;
  email: string;
  phone: string;
  gender: string;
  role: Role;
  /** Set for seller accounts; equals id for masterSeller. */
  masterSellerId?: string;
  avatarUrl: string | null;
  createdAt: string;
};

export type CartLine = {
  productId: string;
  size: SizeId;
  tier: Tier;
  quantity: number;
};
