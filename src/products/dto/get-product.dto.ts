import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class GetProductQueryDto {
    @IsOptional()
    @IsNumberString({},{message : 'category_id must be a number'})
    category_id?: number;

    @IsOptional()
    @IsNumberString({},{message : 'take must be a number'})
    take?: number;

    @IsOptional()
    @IsNumberString({},{message : 'skip must be a number'})
    skip?: number;



    
}