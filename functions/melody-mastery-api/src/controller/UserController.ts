import {Controller} from "../decorator/Controller";
import {Repository} from "typeorm";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {Route} from "../decorator/Route";
import {NextFunction, Request, Response} from "express";
import {validate, ValidationError, ValidatorOptions} from "class-validator";
import {createHash} from "node:crypto";
import {v4 as uuidv4} from 'uuid';
import {ResponseHandler} from "../response-handler";

// Default values
const hashAlgorithm: string = 'sha256';
const defaultAccessLevel = 'read';

@Controller("/user")
export default class UserController {
    userRepo: Repository<User> = AppDataSource.getRepository(User)
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

    @Route('get', '/all')
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users: User[] = await this.userRepo.find();
            let usersLimitedInfo = []
            for (let user of users) {
                let limitedInfoUser = {
                    userUUID: user.userUUID,
                    username: user.username,
                    accessLevel: user.accessLevel,
                }
                usersLimitedInfo.push(limitedInfoUser)
            }
            ResponseHandler.success(res, 200, usersLimitedInfo)
        } catch (error) {
            ResponseHandler.error(res, 500,null, 'Unable to get users', )
        }

    }

    @Route('get', '/isAdmin')
    async isAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userRepo.findOneBy({token: req.headers.authorization});
            if (user.accessLevel === 'admin') {
                ResponseHandler.success(res, 200, null)
            } else {
                ResponseHandler.error(res, 401, null, 'Unauthorized')
            }
        } catch (error) {
            ResponseHandler.error(res, 500,null, 'Unable to get users', )
        }

    }

    @Route('post', '/create')
    async create(req: Request, res: Response, next: NextFunction) {
        // take in username, and password
        // hash password immediately
        const username: string = req.body.username;
        const passwordHash: string = createHash(hashAlgorithm).update(req.body.password).digest("hex")

        // create user and generate first session token
        // generate userUUID
        const newUser: User = new User()
        newUser.username = username
        newUser.passwordHash = passwordHash
        newUser.accessLevel = defaultAccessLevel

        // validate properties
        const violations: ValidationError[] = await validate(newUser, this.validOptions)

        if (!violations.length) {
            const data = await this.userRepo.save(newUser)
            ResponseHandler.success(res, 201, data)
        } else {
            ResponseHandler.error(res, 422, violations, 'Username already exists')
        }

    }

    @Route('put', '/login')
    async login(req: Request, res: Response, next: NextFunction) {
        // take in username, and password
        // hash password immediately
        const provideUsername: string = req.body.username;
        const providedPasswordHashed: string = createHash(hashAlgorithm).update(req.body.password).digest("hex")

        // check if password matches hash for provided user
        const user: User = await this.userRepo.findOneBy({username: provideUsername})

        if (user && providedPasswordHashed === user.passwordHash) {
            // generate new token
            const newToken = uuidv4();

            // update user with new token
            user.token = newToken
            await this.userRepo.save(user);

            // Return custom data
            let returnData = {
                userUUID: user.userUUID,
                username: user.username,
                token: user.token
            }
            ResponseHandler.success(res, 200, returnData)
        } else {
            ResponseHandler.error(res, 401, null, 'Password or username is incorrect', )
        }

    }

    @Route('put', '/logout')
    async logout(req: Request, res: Response, next: NextFunction) {
        // Get user from token
        const token = req.headers.authorization;

        try {
            const user = await this.userRepo.findOneBy({token: token});

            // Clear the token
            user.token = null;
            await this.userRepo.save(user);
            ResponseHandler.success(res, 200,null,  'Logged out successfully')
        } catch (error) {
            ResponseHandler.error(res, 401, null, 'Logged out error')
        }
    }

    @Route('put', '/:userUUID/access')
    async update(req: Request, res: Response, next: NextFunction) {
        // update the access level
        console.log('updating user...')
        const newAccess = req.body.accessLevel
        if (!['read', 'write', 'admin'].includes(newAccess)){
            ResponseHandler.error(res, 422, null, 'Invalid data must be read, write, or admin access')
            return
        }

        const user = await this.userRepo.findOneBy({userUUID: req.params.userUUID})
        // Provided userUUID must match path
        const providedUserUUID = req.body.userUUID;
        if (providedUserUUID != req.params.userUUID) {
            ResponseHandler.error(res, 422, null, 'userUUID in body does not match path uuid.')
            return
        }

        if (user) {
            // add updated data
            user.accessLevel = newAccess;
            await this.userRepo.update(providedUserUUID, user);
            ResponseHandler.success(res, 200,  null, `User updated`)

            // If not found return 404 error
        } else {
            console.log('Failed')
            ResponseHandler.error(res, 404, null,`User not found` )
            return
        }

    }

    @Route('delete', '/:userUUID/')
    async delete(req: Request, res: Response, next: NextFunction) {
        const target = await this.userRepo.findOneBy({userUUID: req.params.userUUID})
        // If they don't exist return 404 not found
        if (!target) {
            ResponseHandler.error(res, 404, null, `User with uuid ${req.params.userUUID} not found`)
            return
        }

        const data = await this.userRepo.remove(target)
        ResponseHandler.success(res, 200, data, `User "${req.params.userUUID}" was deleted successfully`)
        return
    }


}