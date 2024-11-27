import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: 'Name of the category cannot be null' })
    name: string;
    description: string;
}
