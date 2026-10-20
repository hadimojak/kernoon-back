import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChargeDto } from './dto';
import { Charge } from './models/charge';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Charge)
    private readonly charges: Repository<Charge>,
  ) {}

  async list(userId: string) {
    const rows = await this.charges.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return rows.map(present);
  }

  async get(userId: string, id: string) {
    const charge = await this.charges.findOne({ where: { userId, id } });
    if (!charge) throw new NotFoundException('Payment not found');
    return present(charge);
  }

  async create(userId: string, dto: ChargeDto) {
    const saved = await this.charges.save(
      this.charges.create({
        userId,
        orderId: dto.orderId,
        amountToman: dto.amountToman,
        gateway: dto.gateway,
        status: 'pending',
        authority: '',
        refId: '',
      }),
    );
    return present(saved);
  }
}

function present(charge: Charge) {
  return {
    id: charge.id,
    userId: charge.userId,
    orderId: charge.orderId,
    amountToman: charge.amountToman,
    gateway: charge.gateway,
    status: charge.status,
    authority: charge.authority,
    refId: charge.refId,
    createdAt: charge.createdAt.toISOString(),
  };
}
