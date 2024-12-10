import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionContents,
} from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from 'src/coupons/coupons.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>,
    private readonly couponService: CouponsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.ProductRepository.manager.transaction(async (transactionEntityManager) => {

      const transaction = new Transaction();
      const total = createTransactionDto.contents.reduce((total, item) => total + (item.price * item.quantity), 0);
      transaction.total = total;

      if(createTransactionDto.coupon) {
        const coupon = await this.couponService.applyCoupon(createTransactionDto.coupon);

        const discount = (coupon.percentage / 100) * total;

        transaction.discount = discount;
        transaction.coupon = coupon.name;
        transaction.total -= discount;
      }
      

      for (const contents of createTransactionDto.contents) {
        const product = await transactionEntityManager.findOneBy(Product,{
          id: contents.productId,
        });

        let errors = [];	

        if(!product ) {
          errors.push('Product not found');
          throw new NotFoundException(errors);
        }

        if (contents.quantity > product.inventory) {
          errors.push('Product out of stock');
          throw new BadRequestException(errors);
        }
        product.inventory -= contents.quantity;

        //Crear Instancia 
        const transactionContents = new TransactionContents();
        transactionContents.price = contents.price;
        transactionContents.product = product;
        transactionContents.quantity = contents.quantity;
        transactionContents.transaction = transaction;


        await transactionEntityManager.save(transaction);
        await transactionEntityManager.save(transactionContents);
      }
      return 'Sale completed';
    });
  }

  findAll(transactionDate?: string) {
    const options:FindManyOptions<Transaction> = {
      relations: {
        contents: true,
      }
    }

    if(transactionDate) {
      const date = parseISO(transactionDate);
      if(!isValid(date)) {
        throw new BadRequestException('Invalid date format');
      }
      
      const start = startOfDay(date);
      const end = endOfDay(start);

      options.where = {
        trasactionDate: Between(start, end),
      }
      



    }

    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id }, relations: ['contents'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  
  async remove(id: number) {
    const transaction = await this.findOne(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    for (const contents of transaction.contents) {
      const product = await this.ProductRepository.findOneBy({id:contents.product.id});
      product.inventory += contents.quantity;
      await this.ProductRepository.save(product);

      const transactionContents = await this.transactionContentsRepository.findOneBy({id:contents.id});
      await this.transactionContentsRepository.remove(transactionContents);
    }
    await this.transactionRepository.remove(transaction);
    return {message: ` #${id} transaction deleted`};
  }
}
