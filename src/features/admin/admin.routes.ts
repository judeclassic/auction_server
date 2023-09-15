import RequestHandler from "../../shared/repositories/modules/server/router";
import AuthorizationRepo from "../../shared/repositories/modules/encryption";
import AuthValidator from "./auth.validator";
import { UserModel } from "../../shared/repositories/modules/database/models/user.model";
import AuthService from "./admin.service";
import AuthController from "./admin.controller";
import MailerRepo from "../../shared/repositories/modules/mailer";
import { AdminModel } from "../../shared/repositories/modules/database/models/admin.model";

const adminRoutes = async ({router}: {router: RequestHandler}) => {
    const authValidator = new AuthValidator();

    const authRepo = new AuthorizationRepo();

    const userService = new AuthService({authRepo, userModel: UserModel, adminModel: AdminModel});
    const authController = new AuthController({ authValidator, userService});
    
    router.postWithBody('/signin', authController.loginUser);
    router.getWithAuth('/getadmin', authController.getAdminProfile);

    router.getWithAuth('/getallusers', authController.getAllUsers);

    router.postWithBody('/banuser', authController.banUser);
    router.postWithBody('/unbanuser', authController.unbanUser);
    router.postWithBody('/removeuser', authController.removeUser);
}

export default adminRoutes;