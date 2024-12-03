import {BaseEntity, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Category extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    name: string;
    description: string;
    status: boolean;
}
