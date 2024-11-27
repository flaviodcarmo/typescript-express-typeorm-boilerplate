import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import "reflect-metadata"
import BaseProperty from "./BaseProperty";

@Entity('profiles')
class Profile extends BaseProperty {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    name: string;
}

export default Profile;