import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';


@Injectable()
export class ProductsService {
  constructor(
    //Esto nos da la posibilidad de poder interactuar con la tabla de Productos y tabla de Categoria
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>

  ) {}
  create(createProductDto: CreateProductDto) {

    return {createProductDto};
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
