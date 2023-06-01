import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import "reflect-metadata"

@Entity('apiRequestHistory')
class ApiRequestHistory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    userId: string;

    @Column()
    ip: string;

    @Column()
    sourceApp: string;

    @Column({ type: "varchar", length: 300, nullable: true })
    userToken: string;

    @Column()
    url: string;

    @Column()
    method: string;

    @Column()
    body: string;

    @Column({ type: "datetime", select: false })
    createdDate: Date;
}

export default ApiRequestHistory;