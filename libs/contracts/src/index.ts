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

export const clothingColorIds = [
  'white',
  'black',
  'navy',
  'blue',
  'pink',
  'red',
  'beige',
  'gray',
  'green',
  'yellow',
  'brown',
  'multi',
] as const;

export type ClothingColorId = (typeof clothingColorIds)[number];

export const clothingColorHex: Record<ClothingColorId, string> = {
  white: '#f4f4f4',
  black: '#1c1c1c',
  navy: '#1f2a44',
  blue: '#3b6ea5',
  pink: '#e8a0b5',
  red: '#c0392b',
  beige: '#d7c4a8',
  gray: '#8a8a8a',
  green: '#3d7a5a',
  yellow: '#e2c15a',
  brown: '#7a5230',
  multi: 'linear-gradient(135deg,#e8a0b5,#3b6ea5,#e2c15a)',
};

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
  colors: ClothingColorId[];
  countryOfOrigin: string;
  stock: number;
  description: string;
  masterSellerId?: string;
  sellerId?: string;
};

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
  color?: ClothingColorId | string;
  quantity: number;
};
