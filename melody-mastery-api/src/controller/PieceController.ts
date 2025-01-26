import {Controller} from "../decorator/Controller";
import {Repository} from "typeorm";
import {AppDataSource} from "../data-source";
import {validate, ValidationError, ValidatorOptions} from "class-validator";
import {Piece} from "../entity/Piece";
import {Route} from "../decorator/Route";
import {NextFunction, Request, Response} from "express";
import {ResponseHandler} from "../response-handler";

let path:string = '/piece';

@Controller(path)
export default class PieceController {
    // connect to db
    pieceRepo: Repository<Piece> = AppDataSource.getRepository(Piece)

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
        const data = await this.pieceRepo.find();
        ResponseHandler.success(res, 200, data)
    }

    @Route('get', '/random')
    async getRandom(req: Request, res: Response, next: NextFunction) {
        const randomPiece = await this.pieceRepo
            .createQueryBuilder('piece')
            .select()
            .orderBy('RANDOM()')
            .getOne();
        ResponseHandler.success(res, 200, randomPiece)
    }

    @Route('get', '/:uuid')
    async get(req: Request, res: Response, next: NextFunction) {

        // get piece with uuid if they exist
        const piece = await this.pieceRepo.findOneBy({pieceUUID: req.params.uuid})

        if (!piece) {
            ResponseHandler.error(res, 404, null, 'piece not found')
            return
        }
        ResponseHandler.success(res, 200, piece)
    }

    @Route('post')
    async create(req: Request, res: Response, next: NextFunction) {
        const providedUUID = req.body.pieceUUID;
        if (providedUUID) {
            ResponseHandler.error(res, 422, null, 'pieceUUID must not be provided. Please let the database generate it' )
            return
        }

        const newPiece = Object.assign(new Piece(), req.body)
        const violations:ValidationError[] = await validate(newPiece, this.validOptions);

        if (!violations.length) {
            const data = this.pieceRepo.save(newPiece);
            ResponseHandler.success(res, 201, data)
            return
        } else {
            ResponseHandler.error(res, 422, violations, 'Invalid data')
            return
        }
    }

    @Route('put')
    async update(req: Request, res: Response, next: NextFunction) {

        const providedUUID = req.body.pieceUUID;
        // check if record exists
        const targetPiece:Piece = await this.pieceRepo.findOneBy({pieceUUID: providedUUID})
        if (targetPiece) {
            // add updated data
            Object.assign(targetPiece, req.body)

            // check if valid data
            const violations:ValidationError[] = await validate(targetPiece, this.validOptions);

            // If no violations send status 200 (OK) and updated field
            if (!violations.length) {
                const data = await this.pieceRepo.update(providedUUID, targetPiece)
                ResponseHandler.success(res,200, data,  `Piece with uuid ${providedUUID} updated`)
                return
            } else {
                ResponseHandler.error(res, 422, violations, 'Invalid data')
                return
            }
            // If no piece with UUID found return 404 error
        } else {
            ResponseHandler.error(res, 404, null, `Piece with uuid ${providedUUID} not found`)
            return
        }
    }

    @Route('delete', '/:uuid')
    async delete(req: Request, res: Response, next: NextFunction) {

        const targetPiece = await this.pieceRepo.findOneBy({pieceUUID: req.params.uuid})
        // If they don't exist throw error
        if (!targetPiece) {
            ResponseHandler.error(res, 404, null, `Piece with uuid ${req.params.uuid} not found`)
            return
        }

        const data = await this.pieceRepo.remove(targetPiece)
        ResponseHandler.success(res, 200, data,  `Piece "${targetPiece.name}" was deleted successfully`)
        return
    }
}