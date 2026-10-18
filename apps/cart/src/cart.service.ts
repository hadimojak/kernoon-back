import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { SizeId, Tier } from '@app/contracts';

export type CartItem = {
  id: string;
  productId: string;
  size: SizeId;
  tier: Tier;
  quantity: number;
};

type Cart = { items: CartItem[] };

@Injectable()
export class CartService {
  private readonly carts = new Map<string, Cart>();

  get(ownerId: string) {
    return this.carts.get(ownerId) ?? { items: [] };
  }

  add(
    ownerId: string,
    input: { productId: string; size: SizeId; tier: Tier; quantity: number },
  ) {
    const cart = this.ensure(ownerId);
    const existing = cart.items.find(
      (item) =>
        item.productId === input.productId &&
        item.size === input.size &&
        item.tier === input.tier,
    );
    if (existing) {
      existing.quantity = Math.min(20, existing.quantity + input.quantity);
      return cart;
    }
    cart.items.push({
      id: randomBytes(8).toString('hex'),
      productId: input.productId,
      size: input.size,
      tier: input.tier,
      quantity: input.quantity,
    });
    return cart;
  }

  update(ownerId: string, itemId: string, quantity: number) {
    const item = this.requireItem(ownerId, itemId);
    item.quantity = quantity;
    return this.get(ownerId);
  }

  remove(ownerId: string, itemId: string) {
    const cart = this.ensure(ownerId);
    const next = cart.items.filter((item) => item.id !== itemId);
    if (next.length === cart.items.length) {
      throw new NotFoundException('Cart item not found');
    }
    cart.items = next;
    return cart;
  }

  clear(ownerId: string) {
    this.carts.set(ownerId, { items: [] });
    return { items: [] };
  }

  private ensure(ownerId: string) {
    const existing = this.carts.get(ownerId);
    if (existing) return existing;
    const cart = { items: [] };
    this.carts.set(ownerId, cart);
    return cart;
  }

  private requireItem(ownerId: string, itemId: string) {
    const item = this.ensure(ownerId).items.find(
      (entry) => entry.id === itemId,
    );
    if (!item) throw new NotFoundException('Cart item not found');
    return item;
  }
}
