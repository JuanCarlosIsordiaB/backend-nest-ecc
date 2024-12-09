import { IsNotEmpty } from "class-validator";

export class ApplyCouponDto {

    @IsNotEmpty({message: 'Coupon Name is required'})
    coupon_name: string;
}