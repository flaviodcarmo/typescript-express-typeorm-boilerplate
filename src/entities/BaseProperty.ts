import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"
import "reflect-metadata"

class BaseProperty extends BaseEntity {
    @Column()
    createdByUserId: string;

    @Column({ default: null })
    updatedByUserId: string;

    @Column({ select: false, default: null })
    deletedByUserId: string;

    @Column({ type: "datetime", default: () => 'CURRENT_TIMESTAMP' })
    createdDate: Date = new Date;

    @Column({ type: "datetime", default: null })
    updatedDate: Date;

    @Column({ type: "datetime", select: false, default: null })
    deletedDate: Date;

    @Column({ type: "boolean", select: false, default: true })
    isEnabled: boolean;
}

export default BaseProperty;