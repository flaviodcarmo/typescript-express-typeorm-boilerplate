import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import "reflect-metadata"

@Entity('apiRequestHistory')
class ApiRequestHistory extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", default: null })
    userId: string | null;

    @Column({ type: "varchar" })
    ip: string | null;

    @Column({ type: "varchar" })
    sourceApp: string | null;

    @Column({ type: "varchar", length: 300, nullable: true })
    userToken: string | null;

    @Column({ type: "varchar" })
    url: string | null;

    @Column({ type: "varchar" })
    method: string | null;

    @Column({ type: "varchar" })
    body: string | null;

    @Column({ type: "datetime", select: false })
    createdDate: Date;
}

export default ApiRequestHistory;