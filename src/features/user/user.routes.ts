import RequestHandler from "../../shared/repositories/modules/server/router";
import AuthorizationRepo, { TokenType } from "../../shared/repositories/modules/encryption";
import UserValidator from "./user.validator";
import { UserModel } from "../../shared/repositories/modules/database/models/user.model";
import UserService from "./user.service";
import UserController from "./user.controller";

const userRoutes = async ({router}: {router: RequestHandler}) => {
    const userValidator = new UserValidator();
    const authRepo = new AuthorizationRepo();
    const userService = new UserService({authRepo, userModel: UserModel});
    const userController = new UserController({ userValidator, userService});
    
    router.getWithAuth('/', userController.getUserInformation);
    router.postWithBodyAndAuth('/update', userController.updateUserInformation);
}

export default userRoutes;