import { IUser } from "../../shared/repositories/modules/database/models/user.model";
import AutheticatedUserInterface from "../../shared/types/response/authencated-user";
import ResponseInterface from "../../shared/types/response/response";
import AuthService from "./user.service";
import AuthValidator from "./user.validator";


class UserController {
    private _userService: AuthService;
    private _userValidator: AuthValidator;
    
    constructor({userValidator, userService} : {userValidator: AuthValidator, userService : AuthService}) {
        this._userValidator = userValidator;
        this._userService = userService;
    }

    getUserInformation = async (
        { user }: { user: AutheticatedUserInterface },
        sendJson: (code: number, response: ResponseInterface<IUser>)=>void
    )  => {

      const response = await this._userService.getProfile(user.id);
      if (response.errors && response.errors.length > 0) return sendJson(401, { error: response.errors, code: 401, status: false });
      if (user === null) return sendJson(401, { code: 401, status: false });
  
      return sendJson(201, { data: response.user, code: 201, status: true });
    }

    updateUserInformation = async (
        {user, body}: {user: AutheticatedUserInterface, body: Omit<IUser, '_id'>},
        sendJson: (code: number, response: ResponseInterface<IUser>)=>void
    )  => {
        const validationErrors = this._userValidator.userInformation({ ...body });
        if (validationErrors.length > 0) return sendJson(403, {code: 403, status: false, error: validationErrors});
  
        const response = await this._userService.updateProfile(user.id, body);
        if (!response.user) return sendJson(403, { status: false, code: 403, error: response.errors });
  
        return sendJson(200, { status: true, code: 200, data: response.user });
    }
}

export default UserController;