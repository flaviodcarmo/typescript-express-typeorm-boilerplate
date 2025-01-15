import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import BaseProperty from "./BaseProperty";
import "reflect-metadata"

@Entity('dollar')
class Dollar extends BaseProperty {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    fromCode: string;

    @Column({ type: "varchar" })
    toCode: string;

    @Column({ type: "varchar" })
    bidPrice: string;

    @Column({ type: "varchar" })
    askPrice: string;

    @Column({ type: "varchar" })
    high: string;

    @Column({ type: "varchar" })
    low: string;

    @Column({ type: "varchar" })
    bidVariation: string;

    @Column({ type: "varchar" })
    percentageChange: string;

    @Column({ type: "datetime" })
    refDate: Date;
}

export default Dollar;

