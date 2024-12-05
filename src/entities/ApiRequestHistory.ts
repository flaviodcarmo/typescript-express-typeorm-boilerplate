import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import "reflect-metadata"

@Entity('apiRequestHistory')
class ApiRequestHistory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", default: null })
    userId: string | null;

    @Column({ type: "varchar", nullable: true })
    ip: string | null;

    @Column({ type: "varchar", nullable: true })
    sourceApp: string | null;

    @Column({ type: "varchar", length: 300, nullable: true })
    userToken: string | null;

    @Column({ type: "varchar", nullable: true })
    url: string | null;

    @Column({ type: "varchar", nullable: true })
    method: string | null;

    @Column({ type: "varchar", nullable: true })
    body: string | null;

    @Column({ type: "datetime", select: false })
    createdDate: Date = new Date();
}

export default ApiRequestHistory;