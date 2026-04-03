import {Controller} from "../decorator/Controller";
import {Repository} from "typeorm";
import {Melody} from "../entity/Melody";
import {AppDataSource} from "../data-source";
import {validate, ValidationError, ValidatorOptions} from "class-validator";
import {Route} from "../decorator/Route";
import {NextFunction, Request, Response} from "express";
import {ResponseHandler} from "../response-handler";
import {Piece} from "../entity/Piece";

let path:string = '/melody';

@Controller(path)
export default class MelodyController {
    // connect to db
    melodyRepo: Repository<Melody> = AppDataSource.getRepository(Melody)

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
        const data :any = await this.melodyRepo.find()

        if (data) {
            // Add the genre to the passed back data
            const pieceRepo = AppDataSource.getRepository(Piece);

            for (let melody of data) {
                const piece = await pieceRepo.findOneBy({pieceUUID: melody.pieceUUID})
                melody.genre = piece.genre
                melody.url = piece.url
            }

            ResponseHandler.success(res, 200, data)
            return
        }
        ResponseHandler.error(res, 404, null, 'Not found')
    }

    @Route('get', '/:uuid')
    async get(req: Request, res: Response, next: NextFunction) {
        // get melody with uuid if they exist
        const melody = await this.melodyRepo.findOneBy({melodyUUID: req.params.uuid})

        if (!melody) {
            ResponseHandler.error(res, 404, null, 'melody not found')
            return
        }
        return melody
    }

    @Route('post')
    async create(req: Request, res: Response, next: NextFunction) {
        const providedUUID = req.body.melodyUUID;
        if (providedUUID) {
            ResponseHandler.error(res, 422, null, 'melodyUUID must not be provided. Please let the database generate it' )
            return
        }

        const newMelody = Object.assign(new Melody(), req.body)
        const violations:ValidationError[] = await validate(newMelody, this.validOptions);

        if (!violations.length) {
            const data = this.melodyRepo.save(newMelody);
            ResponseHandler.success(res, 201, data)
            return
        } else {
            ResponseHandler.error(res, 422, violations, 'Invalid data')
            return
        }
    }

    @Route('put')
    async update(req: Request, res: Response, next: NextFunction) {
        const providedUUID = req.body.melodyUUID;
        // check if record exists
        const targetMelody:Melody = await this.melodyRepo.findOneBy({melodyUUID: providedUUID})
        if (targetMelody) {
            // add updated data
            Object.assign(targetMelody, req.body)

            // check if valid data
            const violations:ValidationError[] = await validate(targetMelody, this.validOptions);

            // If no violations send status 200 (OK) and updated field
            if (!violations.length) {
                const data = await this.melodyRepo.update(providedUUID, targetMelody)
                ResponseHandler.error(res, 200, data, `Artist with uuid ${providedUUID} updated`)
                return
            } else {
                ResponseHandler.error(res, 422, violations, 'Invalid data')
                return
            }
            // If no artist with UUID found return 404 error
        } else {
            ResponseHandler.error(res, 404, null, `Melody with uuid ${providedUUID} not found`)
            return
        }
    }

    @Route('delete', '/:uuid')
    async delete(req: Request, res: Response, next: NextFunction) {
        const targetMelody = await this.melodyRepo.findOneBy({melodyUUID: req.params.uuid})
        // If they don't exist return 404 not found
        if (!targetMelody) {
            ResponseHandler.error(res, 404, null, `Melody with uuid ${req.params.uuid} not found`)
            return
        }

        const data = await this.melodyRepo.remove(targetMelody)
        ResponseHandler.error(res, 200, data, `Melody "${targetMelody.name}" was deleted successfully`)
        return
    }
}