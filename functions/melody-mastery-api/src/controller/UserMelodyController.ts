import {Controller} from "../decorator/Controller";
import {Repository} from "typeorm";
import {AppDataSource} from "../data-source";
import {validate, ValidationError, ValidatorOptions} from "class-validator";
import {Route} from "../decorator/Route";
import {NextFunction, Request, Response} from "express";
import {UserMelody} from "../entity/UserMelody";
import {ResponseHandler} from "../response-handler";
import {Piece} from "../entity/Piece";


@Controller('/user-melody')
export default class UserMelodyController {
    // connect to db
    userMelodyRepo: Repository<UserMelody> = AppDataSource.getRepository(UserMelody)

    validOptions: ValidatorOptions = {
        skipMissingProperties: false,
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
            target: false,
            value: false,
        },
        stopAtFirstError: true
    }

    @Route('get', '/:userUUID')
    async getAll(req: Request, res: Response, next: NextFunction) {
        console.log(`getting all user-melodies for ${req.params.userUUID}`)
        try {
            const melodiesList : any = await this.userMelodyRepo.findBy({userUUID: req.params.userUUID})

            if (melodiesList) {
                // Add the genre to the passed back data
                const pieceRepo = AppDataSource.getRepository(Piece);

                for (let melody of melodiesList) {
                    const piece = await pieceRepo.findOneBy({pieceUUID: melody.pieceUUID})
                    melody.genre = piece.genre
                    melody.name = piece.name
                    melody.url = piece.url
                    melody.lengthInSeconds = piece.lengthInSeconds
                }
                ResponseHandler.success(res, 200, melodiesList)
                return
            }
        } catch (error) {
            ResponseHandler.error(res, 404,null, 'No melodies found for user')
            return
        }
    }


    @Route('post', '/:userUUID')
    async create(req: Request, res: Response, next: NextFunction) {
        console.log('Adding new usermelody')
        const providedUserMelodyUUID = req.body.userMelodyUUID;
        if (providedUserMelodyUUID) {
            ResponseHandler.error(res, 422, null,  'userMelodyUUID must not be provided. Please let the database generate it')
            return
        }

        const providedUserUUID = req.body.userUUID;
        if (providedUserUUID != req.params.userUUID) {
            ResponseHandler.error(res, 422, null, 'userUUID in body does not match path uuid.')
            return
        }

        const newUserMelody = Object.assign(new UserMelody(), req.body)
        const violations:ValidationError[] = await validate(newUserMelody, this.validOptions);

        if (!violations.length) {
            const data = await this.userMelodyRepo.save(newUserMelody);
            ResponseHandler.success(res, data, 201)
            return
        } else {
            ResponseHandler.error(res, 422, violations, 'Invalid data')
            return
        }
    }

    @Route('put', '/:userUUID/:userMelodyUUID')
    async update(req: Request, res: Response, next: NextFunction) {
        console.log(`Attempting to update usermelody ${req.params.userUUID}`)

        // Provided userUUID must match path
        const providedUserUUID = req.body.userUUID;
        if (providedUserUUID != req.params.userUUID) {
            ResponseHandler.error(res, 422, null, 'userUUID in body does not match path uuid.')
            return
        }

        const providedUUID = req.body.userMelodyUUID;
        // check if record exists
        const targetMelody:UserMelody = await this.userMelodyRepo.findOneBy({userMelodyUUID: providedUUID})
        if (targetMelody) {
            // add updated data
            Object.assign(targetMelody, req.body)

            // check if valid data
            const violations:ValidationError[] = await validate(targetMelody, this.validOptions);

            // If no violations send status 200 (OK) and updated field
            if (!violations.length) {
                const data = await this.userMelodyRepo.update(providedUUID, targetMelody)
                ResponseHandler.success(res, 200,  data, `User Melody with uuid ${providedUUID} updated`)
                return
            } else {
                ResponseHandler.error(res, 422, violations, 'Invalid data')
                return
            }
            // If not found return 404 error
        } else {
            console.log('Failed')
            ResponseHandler.error(res, 404, null,`Melody with uuid ${providedUUID} not found` )
            return
        }
    }

    @Route('delete', '/:userUUID/:userMelodyUUID')
    async delete(req: Request, res: Response, next: NextFunction) {
        const target = await this.userMelodyRepo.findOneBy({userMelodyUUID: req.params.userMelodyUUID})
        // If they don't exist return 404 not found
        if (!target) {
            ResponseHandler.error(res, 404, null, `UserMelody with uuid ${req.params.userMelodyUUID} not found`)
            return
        }

        const data = await this.userMelodyRepo.remove(target)
        ResponseHandler.success(res, 200, data, `UserMelody "${req.params.userMelodyUUID}" was deleted successfully`)
        return
    }
}