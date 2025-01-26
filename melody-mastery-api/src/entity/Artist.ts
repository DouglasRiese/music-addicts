import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsDateString, IsNotEmpty, IsOptional, Length, MaxLength} from "class-validator";

//Artist (artistUUID(PK), firstName, lastName, birthDate, country)
@Entity()
export class Artist {
    @PrimaryGeneratedColumn("uuid")
    @IsOptional()
    artistUUID: string;

    @Column({type: "varchar", length: 50, nullable: false})
    @Length(1, 50, {message: 'First name must be 1 to 50 characters'})
    @IsNotEmpty({message: 'First name is required'})
    firstName: string;

    @Column({type: "varchar", nullable: false})
    @Length(1, 50, {message: 'Last name must be 1 to 50 characters'})
    @IsNotEmpty({message: 'Last name is required'})
    lastName: string;

    @Column({type: "date", nullable: false})
    @IsNotEmpty({message: 'Birth date is required'})
    @IsDateString()
    birthDate: Date;

    @Column({type: "varchar", length: 80, nullable: true})
    @MaxLength(80, {message: 'Country must be less than 80 characters'})
    @IsOptional()
    country: string;



}