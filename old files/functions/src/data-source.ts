import "reflect-metadata"
import {DataSource} from "typeorm"
import {Artist} from "./entity/Artist";
import {Piece} from "./entity/Piece";
import {Melody} from "./entity/Melody";
import {User} from "./entity/User";
import {UserMelody} from "./entity/UserMelody";

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: './sqlite.db',
    synchronize: true,
    logging: false,
    entities: [Artist, Piece, Melody, User, UserMelody], // add entities to be created
    migrations: [],
    subscribers: [],
})
