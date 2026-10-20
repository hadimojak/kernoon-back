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

export type CatalogProduct = {
  id: string;
  name: string;
  nameFa: string;
  usd: number;
  toman: number;
  image: string;
  category: Category;
  sizes: SizeId[];
  stock: number;
  description: string;
};

export const catalogSeed: CatalogProduct[] = [
  {
    id: 'onesie',
    name: 'Cotton snap onesie',
    nameFa: 'سرهمی نخی دکمه‌دار',
    usd: 24,
    toman: 890000,
    image: '/clothes/onesie.svg',
    category: 'newborn',
    sizes: ['0-3', '3-6', '6-12'],
    stock: 40,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: 'tee',
    name: 'Striped toddler tee',
    nameFa: 'تی‌شرت راه‌راه نوپا',
    usd: 18,
    toman: 650000,
    image: '/clothes/tee.svg',
    category: 'toddler',
    sizes: ['1-2', '2-3'],
    stock: 36,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: 'cardigan',
    name: 'Knit cardigan',
    nameFa: 'ژاکت بافت',
    usd: 36,
    toman: 1290000,
    image: '/clothes/cardigan.svg',
    category: 'outerwear',
    sizes: ['6-12', '1-2', '2-3'],
    stock: 18,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: 'joggers',
    name: 'Jogger set',
    nameFa: 'ست جاگر',
    usd: 32,
    toman: 1150000,
    image: '/clothes/joggers.svg',
    category: 'kids',
    sizes: ['2-3', '3-4'],
    stock: 22,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: 'sleep',
    name: 'Cotton sleep sack',
    nameFa: 'قنداق خواب نخی',
    usd: 28,
    toman: 990000,
    image: '/clothes/sleep.svg',
    category: 'sleepwear',
    sizes: ['0-3', '3-6', '6-12'],
    stock: 30,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: 'overalls',
    name: 'Denim overalls',
    nameFa: 'بیلر جین',
    usd: 40,
    toman: 1450000,
    image: '/clothes/overalls.svg',
    category: 'toddler',
    sizes: ['1-2', '2-3', '3-4'],
    stock: 16,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: 'hoodie',
    name: 'Kids hoodie',
    nameFa: 'هودی کودک',
    usd: 34,
    toman: 1220000,
    image: '/clothes/hoodie.svg',
    category: 'kids',
    sizes: ['2-3', '3-4'],
    stock: 20,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
  {
    id: 'dress',
    name: 'Summer dress',
    nameFa: 'پیراهن تابستانی',
    usd: 30,
    toman: 1080000,
    image: '/clothes/dress.svg',
    category: 'toddler',
    sizes: ['1-2', '2-3'],
    stock: 24,
    description:
      'Soft cotton, labeled with the age it is cut for. Machine wash cold and dry low.',
  },
];

export type PublicUser = {
  id: string;
  firstName: string;
  lastName: string;

  username: string;
  email: string;
  phone: string;
  gender: string;
  role: Role;
  createdAt: string;
};

export type CartLine = {
  productId: string;
  size: SizeId;
  tier: Tier;
  quantity: number;
};
