import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import "reflect-metadata"

class BaseProperty extends BaseEntity {
    @Column({ select: false })
    createdByUserId: string;

    @Column({ select: false })
    updatedByUserId: string;

    @Column({ select: false })
    deletedByUserId: string;

    @Column({ type: "datetime", select: false })
    createdDate: Date;

    @Column({ type: "datetime", select: false })
    updatedDate: Date;

    @Column({ type: "datetime", select: false })
    deletedDate: Date;

    @Column({ type: "boolean", select: false })
    isEnabled: number;
}

export default BaseProperty;