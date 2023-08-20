import { IUser } from "../../shared/repositories/modules/database/models/user.model";
import { ICreateUserRequest, ILoginUserRequest } from "../../shared/types/request/user";
import ResponseInterface from "../../shared/types/response/response";
import AuthService from "./auth.service";
import AuthValidator from "./auth.validator";


class AuthController {
    private _userService: AuthService;
    private _authValidator: AuthValidator;
    
    constructor({authValidator, userService} : {authValidator: AuthValidator, userService : AuthService}) {
        this._authValidator = authValidator;
        this._userService = userService;
    }

    registerUser = async (
        {body }: { body: ICreateUserRequest },
        sendJson: (code: number, response: ResponseInterface<IUser>)=>void
    )  => {
      const validationErrors = this._authValidator.register({ ...body });
      console.log(validationErrors)
      if (validationErrors.length > 0) return sendJson(400, { error: validationErrors, code: 400, status: false });
  
      const response = await this._userService.createUser(body);
      if (!response.user) return sendJson(401, { error: response.errors, code: 401, status: false });
  
      return sendJson(201, { data: response.user, code: 201, status: true });
    }

    loginUser = async (
        {body}: {body: ILoginUserRequest},
        sendJson: (code: number, response: ResponseInterface<IUser>)=>void
    )  => {
        const validationErrors = this._authValidator.login({ ...body });
        if (validationErrors.length > 0) return sendJson(403, {code: 403, status: false, error: validationErrors});
  
        const { username, password } = body;
        const response = await this._userService.loginUser({username, password});
        if (!response.user) return sendJson(403, { status: false, code: 403, error: response.errors });
  
        return sendJson(200, { status: true, code: 200, data: response.user });
    }
}

export default AuthController;


// how to validate email?