import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    //Esto nos da la posibilidad de poder interactuar con la tabla de Productos y tabla de Categoria
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { name, image, price, inventory, categoryId } = createProductDto;

    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });

    if (!category) throw new NotFoundException('Category not found');

    const product = await this.productRepository.create({
      name,
      image,
      price,
      inventory,
      category,
    });

    await this.productRepository.save(product);

    return { product, message: 'Product created successfully' };
  }

  async findAll(categoryId: number, take: number, skip: number) {
    const options:FindManyOptions<Product> = {
      relations: { category: true },
      order: { id: 'DESC' },
      take: take,
      skip: skip,
    };

    if (categoryId) {
      options.where = { category: { id: categoryId} };
    }
    const [products, total] = await this.productRepository.findAndCount(options);
    return { products, total };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne(
      {
        where:{
          id
        },
        relations: ['category']
      }
    )
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto); // Copia las propiedades de updateProductDto a product

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });
  
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }
    
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
  }
}
