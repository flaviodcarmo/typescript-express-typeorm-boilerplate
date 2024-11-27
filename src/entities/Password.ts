import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import "reflect-metadata"
import BaseProperty from "./BaseProperty";

@Entity('passwords')
class Password extends BaseProperty {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    userId: string;

    @Column({ type: "varchar" })
    hash: string;
}

export default Password;