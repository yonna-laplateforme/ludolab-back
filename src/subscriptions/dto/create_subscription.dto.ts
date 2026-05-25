export class CreateSubscriptionDto {
  user_id!: number;
  plan_name!: string;
  is_active!: boolean;
  start_date!: Date;
  end_date!: Date;
}
