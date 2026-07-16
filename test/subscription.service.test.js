import { describe, it, expect, toBe } from 'vitest';
import { SubscriptionsService } from '../src/subscriptions/subscriptions.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('find one', () => {
  it('doit chercher une subscription par rapport a son id', async () => {
    const prisma = new PrismaService();
    const subscription = new SubscriptionsService(prisma);

    expect(await subscription.findOne(1)).toEqual({
      id: 1,
      user_id: 2,
      plan_name: 'Pro',
      is_active: true,
      start_date: new Date('2026-07-02'),
      end_date: new Date('2026-08-02'),
    });
  });
});
