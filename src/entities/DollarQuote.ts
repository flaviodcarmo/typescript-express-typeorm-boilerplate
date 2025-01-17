import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import BaseProperty from "./BaseProperty";

@Entity('dollarQuote')
class DollarQuote extends BaseProperty {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  code: string;
  
  @Column({ type: "varchar" })
  codein: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  high: string;

  @Column({ type: "varchar" })
  low: string;

  @Column({ type: "varchar" })
  varBid: string;
  
  @Column({ type: "varchar" })
  pctChange: string;
  
  @Column({ type: "varchar" })
  bid: string;
  
  @Column({ type: "varchar" })
  ask: string;

  @Column({ type: "datetime" })
  createDate: Date;

}

export default DollarQuote;