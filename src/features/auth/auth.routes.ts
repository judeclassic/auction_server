import RequestHandler from "../../shared/repositories/modules/server/router";
import AuthorizationRepo from "../../shared/repositories/modules/encryption";
import AuthValidator from "./auth.validator";
import { UserModel } from "../../shared/repositories/modules/database/models/user.model";
import AuthService from "./auth.service";
import AuthController from "./auth.controller";
import MailerRepo from "../../shared/repositories/modules/mailer";

const authRoutes = async ({router}: {router: RequestHandler}) => {
    const authValidator = new AuthValidator();

    const mailRepo = new MailerRepo();
    const authRepo = new AuthorizationRepo();

    const userService = new AuthService({authRepo, mailRepo, userModel: UserModel});
    const authController = new AuthController({ authValidator, userService});
    
    router.postWithBody('/signup', authController.registerUser);
    router.postWithBody('/signin', authController.loginUser);

    router.postWithBody('/forgotpassword', authController.forgetPassword);
    router.postWithBody('/verifycode', authController.verifyCode);
    router.postWithBody('/newpassword', authController.newPassword);
}

export default authRoutes;