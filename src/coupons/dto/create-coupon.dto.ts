import { IsDateString, IsInt, IsNotEmpty, IsNumber, Max, Min } from "class-validator";



export class CreateCouponDto {

    @IsNotEmpty({message: 'Coupons Name is required'})
    name: string;

    @IsInt()
    @IsNotEmpty({message: 'Coupons Percentage is required'})
    @Max(100, {message: 'Percentage must be less than or equal to 100'})
    @Min(1, {message: 'Percentage must be greater than or equal to 1'})
    percentage: number;

    @IsNotEmpty({message: 'Coupons Expiration Date is required'})
    @IsDateString({}, {message: 'Invalid Date Format'})
    expirationDate: Date;


}
