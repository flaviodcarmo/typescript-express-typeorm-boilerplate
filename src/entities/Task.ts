import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import "reflect-metadata"
import BaseProperty from "./BaseProperty";

@Entity('tasks')
class Task extends BaseProperty {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    userId: string;
}

export default Task;