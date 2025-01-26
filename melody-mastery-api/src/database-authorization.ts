import {NextFunction, Request, Response} from "express";
import {Repository} from "typeorm";
import {User} from "./entity/User";
import {AppDataSource} from "./data-source";
import {ResponseHandler} from "./response-handler";


/**
 * Authenticates checking if the path requires no auth, user level permission, admin permission etc.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const path: string = req.path
    const reqMethod: string = req.method
    const token: string = req.headers.authorization
    let access: string
    // Track if user is authorized
    let isAuth: boolean = false

    console.log(`\nAuthenticating ${reqMethod} request for ${path} `)

    // look up the access level of the token in the users database
    const userRepo: Repository<User> = AppDataSource.getRepository(User)

    // Allowed certain unauthenticated actions
    if (!token) {
        isAuth = await authorizeUnauthenticatedAccess(req)
        if (isAuth) {
            console.log('Success! No authorization needed')
            next()
        } else {
            // If they have no authorization token deny access
            console.log('No Authorization header found')
            ResponseHandler.error(res, 401, null, 'No Authorization header found')
        }
        return
    }


    // If token is present in headers search for its user in the db
    const user = await userRepo.findOneBy({token: token})

    // If no user with token... unauthorized
    if (!user) {
        console.log('No user with token found')
        ResponseHandler.error(res, 401, null, 'Unauthorized')
        return
    }
    access = user.accessLevel

    // Important! check /user-melody BEFORE /user otherwise will override and check the wrong path

    // authenticate user-melody path
    if (path.startsWith('/user-melody')) {
        isAuth = await isUpdatingOwnAccount(req, user)
    }
    // authenticate user path
    else if (path.startsWith('/user')) {
        console.log('auth user path')
        isAuth = await authenticateUserPath(req, user)
    }

    // authenticate other paths
    else {
        // If admin they are approved
        if (access === 'admin') {
            isAuth = true;
        }

        // get requires read or write access
        if (reqMethod === 'GET' && (access === 'read' || access === 'write')) {
            isAuth = true;
        }
        // post, put, and delete require write access
        if (reqMethod === 'POST' && access === 'write') {
            isAuth = true;
        }
        if (reqMethod === 'PUT' && access === 'write') {
            isAuth = true;
        }
        if (reqMethod === 'DELETE' && access === 'write') {
            isAuth = true;
        }
    }


    // If authenticated proceed to next call
    if (isAuth) {
        console.log('Success!')
        next()
    } else {
        console.log('Unauthorized')
        ResponseHandler.error(res, 401, null, 'Unauthorized')
    }
}

async function authorizeUnauthenticatedAccess(req: Request): Promise<boolean> {
    const path: string = req.path
    const reqMethod: string = req.method
    let isAuth: boolean = false
    // Creating a new user
    if (reqMethod === 'POST' && path === '/user/create') {
        isAuth = true
    }
    // login in
    else if (reqMethod === 'PUT' && path === '/user/login') {
        isAuth = true
    }
    else if (reqMethod === 'GET' && path === '/piece/random') {
        isAuth = true
    }
    return isAuth
}

/**
 * Authentication accessing the user entity
 */
async function authenticateUserPath(req: Request, user: User): Promise<boolean> {
    const path: string = req.path
    const reqMethod: string = req.method
    const token: string = req.headers.authorization
    const access: string = user.accessLevel
    let isAuth: boolean = false
    console.log(`\nAuthenticating... path = ${path}, method = ${reqMethod}, access = ${access} token = ${token}`)

    // Admin access to user table
    if (access === 'admin') {
        // Only admins are allowed to getAll
        if (reqMethod === 'GET' && path === '/user/all') {
            isAuth = true;
        }
        // Admins can update their access level
        else if (reqMethod === 'GET' && path === '/user/isAdmin') {
            isAuth = true;
        }
        // Admins can update their access level
        else if (reqMethod === 'PUT') {
            isAuth = true;
        }
        // Admins can delete users
        else if (reqMethod === 'DELETE') {
            isAuth = true;
        }

    }
    // Own user access to their record
    else if (access === 'read' && isUpdatingOwnAccount(req, user)) {
        // can update username, password, and get token


    }
    // Non authenticated users
    // see authorizeUnauthenticatedAccess as it has to come before
    // checking if a user exists


    // Users can update their username and password


    return isAuth;
}

async function isUpdatingOwnAccount(req:Request, user:User):Promise<boolean> {
    // users can only edit their own usermelodies

    // get the provided user UUID from the path
    const providedUUID = req.path.split('/')[2]

    if (providedUUID === user.userUUID) {
        return true;
    }
    return false
}






