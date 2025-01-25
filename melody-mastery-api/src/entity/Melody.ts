import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {
    IsNotEmpty,
    IsOptional,
    Length,
    Min
} from "class-validator";
import {Piece} from "./Piece";

// Melody (melodyUUID(PK), pieceUUID(FK), name, startTimeMS, endTimeMS)
@Entity()
export class Melody {
    @PrimaryGeneratedColumn("uuid")
    @IsOptional()
    melodyUUID: string;

    @Column({type: "varchar"})
    @ManyToOne(() => Piece, (piece) => piece.pieceUUID)
    @IsNotEmpty({message: 'Piece UUID is required'})
    pieceUUID: string;

    @Column({type: "varchar", length: 50, nullable: false})
    @Length(1, 50, {message: 'Melody name must be 1 to 50 characters'})
    @IsNotEmpty({message: 'Name is required'})
    name: string;

    @Column({type: "int", nullable: false})
    @Min(0, {message: 'Melody start time must not be negative'})
    startTimeMS: number;

    @Column({type: "int", nullable: false})
    @Min(0, {message: 'Melody end time must not be negative'})
    endTimeMS: number;
}