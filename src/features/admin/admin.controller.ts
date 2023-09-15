import { IAdmin } from "../../shared/repositories/modules/database/models/admin.model";
import { IMultipleUser, IUser } from "../../shared/repositories/modules/database/models/user.model";
import { ICreateUserRequest, ILoginUserRequest } from "../../shared/types/request/user";
import AutheticatedUserInterface from "../../shared/types/response/authencated-user";
import ResponseInterface from "../../shared/types/response/response";
import AuthService from "./admin.service";
import AuthValidator from "./auth.validator";


class AuthController {
    private _userService: AuthService;
    private _authValidator: AuthValidator;
    
    constructor({authValidator, userService} : {authValidator: AuthValidator, userService : AuthService}) {
        this._authValidator = authValidator;
        this._userService = userService;
    }

    loginUser = async (
        {body}: {body: ILoginUserRequest},
        sendJson: (code: number, response: ResponseInterface<IAdmin>)=>void
    )  => {
        const validationErrors = this._authValidator.login({ ...body });
        if (validationErrors.length > 0) return sendJson(403, {code: 403, status: false, error: validationErrors});
  
        const { email_address, password } = body;
        const response = await this._userService.loginUser({email_address, password});
        if (!response.admin) return sendJson(403, { status: false, code: 403, error: response.errors });
  
        return sendJson(200, { status: true, code: 200, data: response.admin });
    }

    getAdminProfile = async (
        { user }: { user: AutheticatedUserInterface },
        sendJson: (code: number, response: ResponseInterface<IAdmin>)=>void
    )  => {

      const response = await this._userService.getAdminProfile(user.id);
      if (response.errors && response.errors.length > 0) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      return sendJson(201, { data: response.admin, code: 201, status: true });
    }

    getAllUsers = async (
        { user, query }: { user: AutheticatedUserInterface, query: { limit: number; page: number } },
        sendJson: (code: number, response: ResponseInterface<IMultipleUser>)=>void
    )  => {

      const response = await this._userService.getAllUsers(query);
      if (response.errors && response.errors.length > 0) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      return sendJson(201, { data: response.users, code: 201, status: true });
    }

    unbanUser = async (
        { body: { userId } }: { body: { userId: string } },
        sendJson: (code: number, response: ResponseInterface<IUser>)=>void
    )  => {
        if (!userId) return sendJson(403, {code: 403, status: false, error: [{ message: 'userid is invalid' }]});
  
        const response = await this._userService.unbanUser({ userId });
        if (!response.user) return sendJson(403, { status: false, code: 403, error: response.errors });
  
        return sendJson(200, { status: true, code: 200, data: response.user });
    }

    banUser = async (
        { body: { userId } }: { body: { userId: string } },
        sendJson: (code: number, response: ResponseInterface<IUser>)=>void
    )  => {
        if (!userId) return sendJson(403, {code: 403, status: false, error: [{ message: 'userid is invalid' }]});
  
        const response = await this._userService.banUser({ userId });
        if (!response.user) return sendJson(403, { status: false, code: 403, error: response.errors });
  
        return sendJson(200, { status: true, code: 200, data: response.user });
    }

    removeUser = async (
        { body: { userId } }: { body: { userId: string } },
        sendJson: (code: number, response: ResponseInterface<IUser>)=>void
    )  => {
        if (!userId) return sendJson(403, {code: 403, status: false, error: [{ message: 'userid is invalid' }]});
  
        const response = await this._userService.removeUser({ userId });
        if (!response.user) return sendJson(403, { status: false, code: 403, error: response.errors });
  
        return sendJson(200, { status: true, code: 200, data: response.user });
    }
}

export default AuthController;


// how to validate email?