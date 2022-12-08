import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import "reflect-metadata"
import BaseProperty from "./BaseProperty";

@Entity('confirmation')
class Confirmation extends BaseProperty {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    code: string;

    @Column()
    typeId: string;
}

export default Confirmation;