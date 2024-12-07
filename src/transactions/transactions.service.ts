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
import { FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { error } from 'console';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.ProductRepository.manager.transaction(async (transactionEntityManager) => {

      const transaction = new Transaction();
      const total = createTransactionDto.contents.reduce((total, item) => total + (item.price * item.quantity), 0);
      transaction.total = total;
      await transactionEntityManager.save(transaction);

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

  findAll() {
    const options:FindManyOptions<Transaction> = {
      relations: {
        contents: true,
      }
    }
    return this.transactionRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
