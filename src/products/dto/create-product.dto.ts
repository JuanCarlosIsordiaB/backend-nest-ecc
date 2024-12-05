import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    @IsString({message: 'Name field must be a string'})
    @IsNotEmpty({message: 'Name field cannot be empty'})
    name: string;

    @IsString({message: 'Image field must be a string'})
    @IsOptional()
    image: string

    @IsNumber({maxDecimalPlaces: 2}, {message: 'Price field must be a number'})
    @IsNotEmpty({message: 'Price field cannot be empty'})
    price: number;

    @IsNumber()
    @IsNotEmpty({message: 'Inventory field cannot be empty'})
    inventory: number;

    @IsInt({message: 'CategoryId field must be an integer'})
    @IsNotEmpty({message: 'CategoryId field cannot be empty'})
    categoryId: number;
}
