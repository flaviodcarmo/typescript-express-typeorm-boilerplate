import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinTable } from "typeorm"
import BaseProperty from "./BaseProperty";
import "reflect-metadata"

@Entity('users')
class User extends BaseProperty {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    email: string;

    @Column({ type: "date" })
    birthDay: string;
    
    @Column({ type: "varchar", nullable: true })
    profileId?: string | null;

    @Column({ type: "boolean", select: false, default: false })
    isSentMail: boolean;

    @Column({ type: "boolean", default: false })
    isConfirmed: boolean;

    super (entity : any = {}) {
        this.name               = entity.name ? entity.name : this.name;
        this.email              = entity.email ? entity.email : this.email;
        this.birthDay           = entity.birthDay ? entity.birthDay : this.birthDay;
        this.profileId          = entity.profileId ? entity.profileId : this.profileId;
        this.createdByUserId    = entity.createdByUserId ? entity.createdByUserId : this.createdByUserId;
    }
}

export default User;