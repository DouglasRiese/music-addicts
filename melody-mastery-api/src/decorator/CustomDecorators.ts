import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import {Repository} from "typeorm";
import {User} from "../entity/User";
import {AppDataSource} from "../data-source";



@ValidatorConstraint({ async: true })
export class UniqueUsernameConstraint implements ValidatorConstraintInterface {
    private UserRepository: Repository<User> = AppDataSource.getRepository(User);
    validate(userName: any, args: ValidationArguments) {
        return this.UserRepository.findOneBy({username: userName}).then(user => {
            if (user) return false;
            return true;
        });
    }
}

export function UniqueUsername(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UniqueUsernameConstraint,
        });
    };
}