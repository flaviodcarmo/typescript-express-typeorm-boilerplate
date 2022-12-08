import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import "reflect-metadata"
import BaseProperty from "./BaseProperty";

@Entity('passwords')
class Password extends BaseProperty {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    hash: string;
}

export default Password;