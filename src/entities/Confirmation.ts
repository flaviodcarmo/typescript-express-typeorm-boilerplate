import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import "reflect-metadata"
import BaseProperty from "./BaseProperty";

@Entity('confirmation')
class Confirmation extends BaseProperty {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    userId: string;

    @Column({ type: "varchar" })
    code: string;

    @Column({ type: "varchar" })
    typeId: string;
}

export default Confirmation;