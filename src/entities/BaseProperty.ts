import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import "reflect-metadata"

class BaseProperty extends BaseEntity {
    @Column({ select: false })
    createdByUserId: string;

    @Column({ select: false, default: null })
    updatedByUserId: string;

    @Column({ select: false, default: null })
    deletedByUserId: string;

    @Column({ type: "datetime", select: false, default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date;

    @Column({ type: "datetime", select: false, default: null })
    updatedDate: Date;

    @Column({ type: "datetime", select: false, default: null })
    deletedDate: Date;

    @Column({ type: "boolean", select: false, default: true })
    isEnabled: boolean;
}

export default BaseProperty;