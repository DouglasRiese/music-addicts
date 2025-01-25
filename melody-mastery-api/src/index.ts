import * as express from "express";
import * as bodyParser from "body-parser";
import {AppDataSource} from "./data-source";
import {RouteDefinition} from "./decorator/RouteDefinition";
import * as createError from "http-errors";
import * as cors from "cors";
import ArtistController from "./controller/ArtistController";
import PieceController from "./controller/PieceController";
import MelodyController from "./controller/MelodyController";
import UserController from "./controller/UserController";
import {authenticate} from "./database-authorization";
import {User} from "./entity/User";
import {Artist} from "./entity/Artist";
import {Piece} from "./entity/Piece";
import {Melody} from "./entity/Melody";
import {UserMelody} from "./entity/UserMelody";
import UserMelodyController from "./controller/UserMelodyController";


// cors stuff
const corsOptions = {
    credentials: true, // allow cookies on a fetch
    origin: /localhost:\d{4,5}$/i,
    allowHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "GET,POST,PUT,DELETE,OPTIONS"
}


AppDataSource.initialize().then(async () => {
    // create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(cors(corsOptions))

    // Require authentication
    app.use(authenticate);

    // a failsafe option if any path gets sent through options request use cors
    app.options('*', cors(corsOptions))

    // (Important!) Add other controllers here -- else controllers will not have handlers connected to the actions/methods
    // Iterate over all our controllers and register our routes
    const controllers = [
        PieceController,
        ArtistController,
        MelodyController,
        UserController,
        UserMelodyController
    ];
    controllers.forEach((controller) => {
        const instance = new controller();
        // get metadata for path from controller
        const basePath = Reflect.getMetadata('path', controller);
        // get all routes for controller
        const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
        // go through routes and register them to our express application
        routes.forEach((route) => {
            // Modified to work with multiple parameters
            const fullPath = `${basePath}/${route.param}`.replace(/\/+/g, '/');

            app[route.method](fullPath, (req: express.Request, res: express.Response,
                                                   next: express.NextFunction) => {
                try {
                    // Logic here had to change since I added the response-handler
                    const result = instance[route.action](req, res, next);
                    if (result instanceof Promise) {
                        // Prevent from sending stuff after already sent
                        if (res.headersSent) {
                            return
                        }
                    }

                } catch (e) {
                    if (!res.headersSent) {
                        next(createError(500, e));
                    }
                }})

        });
    });

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        next(createError(404));
    })

    app.use((err, req, res, next) => {
        // check status
        res.status(err.status || 500)
        // split the stack and replace spaces
        res.json({error: err.message, status: err.status, stack: err.stack.split("/\s{4,}/")});
    })

    // start express server use env port or 3005 as a backup
    const port = process.env.PORT || 3005
    app.listen(port)

    //-------------------- User test data --------------------//
    const ernestoUserUUID = 'aecb279b-68fc-4491-9dfa-85ad8dfd1c6f'
    const dougUserUUID = '45350730-a4e0-4f31-b1d3-b52996060007'

    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            userUUID: ernestoUserUUID,
            username: 'ernesto',
            passwordHash: '8327633a473d05da22bff20053cb2d50c75d0a4d8a855b08da9ab8c9e706c856', // SHA-256 hash of 'demigods'
            accessLevel: 'write',
        })
    )
    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            userUUID: dougUserUUID,
            username: 'doug',
            passwordHash: '3db84bec8c36d5672f67e2aa445dc59b06e38c54a44157b0e63e729e63725953', // SHA-256 hash of 'iscool'
            accessLevel: 'admin',
        })
    )


    //-------------------- Artists test data --------------------//
    const louisArmstrongArtistUUID = 'cda1ba4c-100f-4d9f-bc2e-7a8a20a5aa5f'
    const richardVreelandArtistUUID = '982d5e02-d1d0-492a-a5ac-1ba1786bdc3f'
    const jacquelineDuPreArtistUUID = 'baeae031-e8da-45de-aa96-a31b4f91f65b'


    await AppDataSource.manager.save(
        AppDataSource.manager.create(Artist, {
            artistUUID: louisArmstrongArtistUUID,
            firstName: 'Louis',
            lastName: 'Armstrong',
            birthDate: '04-august-1901',
            country: 'USA'
        })
    )
    await AppDataSource.manager.save(
        AppDataSource.manager.create(Artist, {
            artistUUID: richardVreelandArtistUUID,
            firstName: 'Richard',
            lastName: 'Vreeland',
            birthDate: '29-june-1986',
            country: 'USA'
        })
    )
    await AppDataSource.manager.save(
        AppDataSource.manager.create(Artist, {
            artistUUID: jacquelineDuPreArtistUUID,
            firstName: 'Jacqueline',
            lastName: 'de Pre',
            birthDate: '26-january-1945',
        })
    )

    //-------------------- Pieces test data --------------------//
    const whatAWonderfulWorldPieceUUID = '1b0967e7-7e8c-4fe1-9afc-3236202867c9'
    const vignettePanaceaPieceUUID = '3dc67f0d-1c96-4c5b-9e90-e254a51deb7d'
    const celloSonataNo1PieceUUID = '062af785-cefb-409a-8ab1-bbd622405b10'

    await AppDataSource.manager.save(
        AppDataSource.manager.create(Piece, {
            pieceUUID: whatAWonderfulWorldPieceUUID,
            artistUUID: louisArmstrongArtistUUID,
            name: 'What a Wonderful World',
            lengthInSeconds: 138,
            genre: 'Jazz',
            url: 'https://www.youtube.com/watch?v=rBrd_3VMC3c'
        })
    )
    await AppDataSource.manager.save(
        AppDataSource.manager.create(Piece, {
            pieceUUID: vignettePanaceaPieceUUID,
            artistUUID: richardVreelandArtistUUID,
            name: 'Vignette: Panacea',
            lengthInSeconds: 103,
            genre: 'Impressionism',
            url: 'https://www.youtube.com/watch?v=sfPapxO550o'
        })
    )

    await AppDataSource.manager.save(
        AppDataSource.manager.create(Piece, {
            artistUUID: jacquelineDuPreArtistUUID,
            pieceUUID: celloSonataNo1PieceUUID,
            name: 'Brahms - Cello Sonata No.1 in E minor, Op. 38',
            lengthInSeconds: 1513,
            genre: 'Classical',
            url: 'https://www.youtube.com/watch?v=9XiYrzsgWto'
        })
    )

    //-------------------- Melody test data --------------------//
    const melody1UUID = '6b2ddd65-a749-4691-86c7-aa8592bed099'
    const melody2UUID = 'd8738e21-74e2-4f5f-951e-82a1ed48abad'
    const melody3UUID = '8d1e8beb-6243-451e-ac6d-42f42f772757'
    const melody4UUID = '8d1e8beb-6243-451e-ac6d-42f42f772757'

    await AppDataSource.manager.save(
        AppDataSource.manager.create(Melody, {
            melodyUUID: melody1UUID,
            pieceUUID: whatAWonderfulWorldPieceUUID,
            name: 'Intro to What a Wonderful World',
            startTimeMS: 0,
            endTimeMS: 8000
        })
    )
    await AppDataSource.manager.save(
        AppDataSource.manager.create(Melody, {
            melodyUUID: melody2UUID,
            pieceUUID: whatAWonderfulWorldPieceUUID,
            name: 'Middle Section in What a Wonderful World',
            startTimeMS: 72000,
            endTimeMS: 80000
        })
    )
    await AppDataSource.manager.save(
        AppDataSource.manager.create(Melody, {
            melodyUUID: melody3UUID,
            pieceUUID: vignettePanaceaPieceUUID,
            name: 'Piano Opening',
            startTimeMS: 0,
            endTimeMS: 60000
        })
    )
    await AppDataSource.manager.save(
        AppDataSource.manager.create(Melody, {
            melodyUUID: melody4UUID,
            pieceUUID: celloSonataNo1PieceUUID,
            name: 'Brahms Famous Cello Sonata Beginning',
            startTimeMS: 0,
            endTimeMS: 22000
        })
    )

    //-------------------- User Melody test data --------------------//
    const userMelody1UUID = 'db3684a1-d817-4e4f-b1ac-d0e7ad213285'
    const userMelody2UUID = '606a9ed6-046a-4438-9e9c-b042a2012749'


    await AppDataSource.manager.save(
        AppDataSource.manager.create(UserMelody, {
            userMelodyUUID: userMelody1UUID,
            pieceUUID: whatAWonderfulWorldPieceUUID,
            userUUID: ernestoUserUUID,
            status: 'in-progress'
        })
    )
    await AppDataSource.manager.save(
        AppDataSource.manager.create(UserMelody, {
            userMelodyUUID: userMelody2UUID,
            pieceUUID: celloSonataNo1PieceUUID,
            userUUID: ernestoUserUUID,
            status: 'completed'
        })
    )


    console.log(`Server started on http://localhost:${port}/`)

}).catch(error => console.log(error))
