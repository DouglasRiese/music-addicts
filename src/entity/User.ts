import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsHash, IsIn, IsOptional, Length} from "class-validator";
import {UniqueUsername} from "../decorator/CustomDecorators";

// User (userUUID(PK), username, token, passwordHash accessLevel)
// Used to restrict access to the API
@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    @IsOptional()
    userUUID: string;

    @Column({type: "varchar", nullable: false})
    @Length(1, 50, {message: 'username must be 1 to 50 characters'})
    @UniqueUsername({message: 'Username $value already exists. Choose another name.',})
    username: string;

    @Column({type: "varchar", nullable: false})
    @IsHash('sha256')
    passwordHash: string;

    @Column({type: "varchar", nullable: true})
    token: string;

    @Column({type: "varchar", nullable: false})
    @IsIn(['read', 'write', 'admin'])
    accessLevel: string;
}