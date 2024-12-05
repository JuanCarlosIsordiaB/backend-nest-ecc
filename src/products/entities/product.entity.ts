import { Category } from "src/categories/entities/category.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 80})
    name: string;

    @Column({type: 'varchar', length: 255, nullable: true, default: null})
    image: string

    @Column({type: 'decimal'})
    price: number;


    @Column({type: 'int'})
    inventory: number;
    
   @ManyToOne(() => Category)
   category: Category;


}
