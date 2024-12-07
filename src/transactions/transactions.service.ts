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
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

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
      transaction.total = createTransactionDto.total;
      await transactionEntityManager.save(transaction);

      for (const contents of createTransactionDto.contents) {
        const product = await transactionEntityManager.findOneBy(Product,{
          id: contents.productId,
        });

        if (contents.quantity > product.inventory) {
          throw new BadRequestException('Product out of stock');
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
    return `This action returns all transactions`;
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
