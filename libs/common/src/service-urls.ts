export const serviceNames = [
  'identity',
  'catalog',
  'cart',
  'orders',
  'account',
  'sellers',
  'payments',
  'panel',
  'products',
  'tickets',
] as const;

export type ServiceName = (typeof serviceNames)[number];

const defaults: Record<ServiceName, string> = {
  identity: 'http://127.0.0.1:3001',
  catalog: 'http://127.0.0.1:3002',
  cart: 'http://127.0.0.1:3003',
  orders: 'http://127.0.0.1:3004',
  account: 'http://127.0.0.1:3005',
  sellers: 'http://127.0.0.1:3006',
  payments: 'http://127.0.0.1:3007',
  panel: 'http://127.0.0.1:3008',
  products: 'http://127.0.0.1:3009',
  tickets: 'http://127.0.0.1:3010',
};

export function serviceUrls(): Record<ServiceName, string> {
  return {
    identity: process.env.IDENTITY_URL ?? defaults.identity,
    catalog: process.env.CATALOG_URL ?? defaults.catalog,
    cart: process.env.CART_URL ?? defaults.cart,
    orders: process.env.ORDERS_URL ?? defaults.orders,
    account: process.env.ACCOUNT_URL ?? defaults.account,
    sellers: process.env.SELLERS_URL ?? defaults.sellers,
    payments: process.env.PAYMENTS_URL ?? defaults.payments,
    panel: process.env.PANEL_URL ?? defaults.panel,
    products: process.env.PRODUCTS_URL ?? defaults.products,
    tickets: process.env.TICKETS_URL ?? defaults.tickets,
  };
}
