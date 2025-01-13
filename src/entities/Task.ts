import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import "reflect-metadata"
import BaseProperty from "./BaseProperty";

@Entity('tasks')
class Task extends BaseProperty {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", nullable: false })
    userId: string;

    @Column({ type: "varchar", nullable: false })
    name: string;

    @Column({ type: "date", nullable: false })
    refDate: string;
}

export default Task;