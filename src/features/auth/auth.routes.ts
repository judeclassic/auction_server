import RequestHandler from "../../shared/repositories/modules/server/router";
import AuthorizationRepo, { TokenType } from "../../shared/repositories/modules/encryption";
import AuthValidator from "./auth.validator";
import { UserModel } from "../../shared/repositories/modules/database/models/user.model";
import AuthService from "./auth.service";
import AuthController from "./auth.controller";

const authRoutes = async ({router}: {router: RequestHandler}) => {
    const authValidator = new AuthValidator();
    const authRepo = new AuthorizationRepo();
    const userService = new AuthService({authRepo, userModel: UserModel});
    const authController = new AuthController({ authValidator, userService});
    
    router.postWithBody('/signup', authController.registerUser);
    router.postWithBody('/signin', authController.loginUser);
}

export default authRoutes;