import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SizeId, Tier } from '@app/contracts';
import { Basket, BasketItem } from './models/basket';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Basket)
    private readonly baskets: Repository<Basket>,
    @InjectRepository(BasketItem)
    private readonly items: Repository<BasketItem>,
  ) {}

  async get(ownerId: string) {
    const basket = await this.find(ownerId);
    return { items: (basket?.items ?? []).map(present) };
  }

  async add(
    ownerId: string,
    input: { productId: string; size: SizeId; tier: Tier; quantity: number },
  ) {
    const basket = await this.ensure(ownerId);
    const existing = basket.items.find(
      (item) =>
        item.productId === input.productId &&
        item.size === input.size &&
        item.tier === input.tier,
    );
    if (existing) {
      existing.quantity = Math.min(20, existing.quantity + input.quantity);
      await this.items.save(existing);
      return this.get(ownerId);
    }
    await this.items.save(
      this.items.create({
        basket,
        productId: input.productId,
        size: input.size,
        tier: input.tier,
        quantity: input.quantity,
      }),
    );
    return this.get(ownerId);
  }

  async update(ownerId: string, itemId: string, quantity: number) {
    const item = await this.requireItem(ownerId, itemId);
    item.quantity = quantity;
    await this.items.save(item);
    return this.get(ownerId);
  }

  async remove(ownerId: string, itemId: string) {
    const item = await this.requireItem(ownerId, itemId);
    await this.items.remove(item);
    return this.get(ownerId);
  }

  async clear(ownerId: string) {
    const basket = await this.find(ownerId);
    if (basket) await this.items.remove(basket.items);
    return { items: [] };
  }

  async merge(fromOwnerId: string, toOwnerId: string) {
    if (fromOwnerId === toOwnerId) return this.get(toOwnerId);
    const from = await this.find(fromOwnerId);
    if (!from?.items?.length) return this.get(toOwnerId);

    for (const item of [...from.items]) {
      await this.add(toOwnerId, {
        productId: item.productId,
        size: item.size as SizeId,
        tier: item.tier as Tier,
        quantity: item.quantity,
      });
    }

    const leftover = await this.find(fromOwnerId);
    if (leftover) {
      if (leftover.items?.length) await this.items.remove(leftover.items);
      await this.baskets.remove(leftover);
    }
    return this.get(toOwnerId);
  }

  private async find(ownerId: string) {
    return this.baskets.findOne({
      where: { ownerId },
      relations: { items: true },
    });
  }

  private async ensure(ownerId: string) {
    const existing = await this.find(ownerId);
    if (existing) return existing;
    const created = await this.baskets.save(
      this.baskets.create({ ownerId, items: [] }),
    );
    created.items = [];
    return created;
  }

  private async requireItem(ownerId: string, itemId: string) {
    const basket = await this.find(ownerId);
    const item = basket?.items.find((entry) => entry.id === itemId);
    if (!item) throw new NotFoundException('Cart item not found');
    return item;
  }
}

function present(item: BasketItem) {
  return {
    id: item.id,
    productId: item.productId,
    size: item.size as SizeId,
    tier: item.tier as Tier,
    quantity: item.quantity,
  };
}
