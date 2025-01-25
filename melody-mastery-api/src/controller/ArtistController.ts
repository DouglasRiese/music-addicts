import {Controller} from "../decorator/Controller";
import {Repository} from "typeorm";
import {Artist} from "../entity/Artist";
import {AppDataSource} from "../data-source";
import {validate, ValidationError, ValidatorOptions} from "class-validator";
import {Route} from "../decorator/Route";
import {NextFunction, Request, Response} from "express";
import {ResponseHandler} from "../response-handler";

let path:string = '/artist';

@Controller(path)
export default class ArtistController {
    // connect to db
    artistRepo: Repository<Artist> = AppDataSource.getRepository(Artist)

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

    @Route('get')
    async getAll(req: Request, res: Response, next: NextFunction) {
        ResponseHandler.success(res, 200, this.artistRepo.find())
    }

    @Route('get', '/:uuid')
    async get(req: Request, res: Response, next: NextFunction) {
        // get artist with uuid if they exist
        const artist = await this.artistRepo.findOneBy({artistUUID: req.params.uuid})

        if (!artist) {
            ResponseHandler.error(res, 404, null, 'artist not found')
        }
        return artist
    }

    @Route('post')
    async create(req: Request, res: Response, next: NextFunction) {
        const providedUUID = req.body.artistUUID;
        if (providedUUID) {
            ResponseHandler.error(res, 422, null, 'artistUUID must not be provided. Please let the database generate it')
            return
        }

        const newArtist = Object.assign(new Artist(), req.body)
        const violations:ValidationError[] = await validate(newArtist, this.validOptions);

        if (!violations.length) {
            ResponseHandler.success(res, 201, this.artistRepo.save(newArtist))

        } else {
            ResponseHandler.error(res, 422, violations, 'Invalid data')
        }
    }

    @Route('put')
    async update(req: Request, res: Response, next: NextFunction) {
        const providedUUID = req.body.artistUUID;
        // check if record exists
        const targetArtist:Artist = await this.artistRepo.findOneBy({artistUUID: providedUUID})
        if (targetArtist) {
            // add updated data
            Object.assign(targetArtist, req.body)

            // check if valid data
            const violations:ValidationError[] = await validate(targetArtist, this.validOptions);

            // If no violations send status 200 (OK) and updated field
            if (!violations.length) {
                const data = await this.artistRepo.update(providedUUID, targetArtist)
                ResponseHandler.success(res, 200, data,  'Artist updated successfully')
                return
            } else {
                ResponseHandler.error(res, 422, violations, 'Invalid data')
                return
            }
            // If no artist with UUID found return 404 error
        } else {
            ResponseHandler.error(res, 404, null, `Artist with uuid ${providedUUID} not found`)
            return
        }
    }

    @Route('delete', '/:uuid')
    async delete(req: Request, res: Response, next: NextFunction) {
        const targetArtist = await this.artistRepo.findOneBy({artistUUID: req.params.uuid})
        // If they don't exist return 404 not found
        if (!targetArtist) {
            ResponseHandler.error(res, 404, null, `Artist with uuid ${req.params.uuid} not found`)
            return
        }

        await this.artistRepo.remove(targetArtist)
        ResponseHandler.error(res, 200, null, `Artist "${targetArtist.firstName} ${targetArtist.lastName}" was deleted successfully`)
        return
    }
}