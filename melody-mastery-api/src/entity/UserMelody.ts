import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {
    IsIn,
    IsNotEmpty,
    IsOptional,
} from "class-validator";
import {Piece} from "./Piece";
import {User} from "./User";


@Entity()
export class UserMelody {
    @PrimaryGeneratedColumn("uuid")
    @IsOptional()
    userMelodyUUID: string;

    @Column({type: "varchar"})
    @ManyToOne(() => Piece, (piece) => piece.pieceUUID)
    @IsNotEmpty({message: 'Piece UUID is required'})
    pieceUUID: string;

    @Column({type: "varchar"})
    @ManyToOne(() => User, (user) => user.userUUID)
    @IsNotEmpty({message: 'User UUID is required'})
    userUUID: string;

    @Column({type: "varchar", nullable: false})
    @IsIn(['completed', 'in-progress', 'for-later'])
    status: string;

}