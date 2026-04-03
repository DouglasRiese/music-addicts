import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, IsOptional, IsUrl, Length, Max, MaxLength} from "class-validator";
import {Artist} from "./Artist";

// Piece (pieceUUID(PK), artistUUID(FK), name, length, genre, URL)
@Entity()
export class Piece {
    @PrimaryGeneratedColumn("uuid")
    @IsOptional()
    pieceUUID: string;

    @Column({type: "varchar" })
    @ManyToOne(() => Artist, (artist) => artist.artistUUID)
    @IsNotEmpty({message: 'Artist is required'})
    artistUUID: string;

    @Column({type: "varchar", length: 50, nullable: false})
    @Length(1, 50, {message: 'Piece name must be 1 to 50 characters'})
    @IsNotEmpty({message: 'Name is required'})
    name: string;

    @Column({type: "int", nullable: false})
    @Max(1800, {message: 'Length must be less than 1800 seconds (30 min)'})
    lengthInSeconds: number;

    @Column({type: "varchar", length: 30, nullable: true})
    @MaxLength(30, {message: 'Genre must be less than 30 characters'})
    @IsOptional()
    genre: string;

    @Column({type: "varchar", length: 255, nullable: false})
    @IsNotEmpty({message: 'URL link is required'})
    @IsUrl({}, {message: 'Must be a valid URL'})
    url: string;



}