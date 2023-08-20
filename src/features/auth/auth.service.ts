import AuthorizationRepo, { TokenType } from "../../shared/repositories/modules/encryption";
import { IUser, UserModel } from "../../shared/repositories/modules/database/models/user.model";
import { ICreateUserRequest, ILoginUserRequest } from "../../shared/types/request/user";
import IError from "../../shared/types/error/error";

const ERROR_USER_ALREADY_EXISTS_WITH_EMAIL: IError = {
  field: 'email_address',
  message: 'A user with this email already exists.',
};
const ERROR_USER_ALREADY_EXISTS_WITH_USERNAME: IError = {
  field: 'username',
  message: 'A user with this username already exists.',
};
const ERROR_USER_NOT_FOUND: IError = {
  field: 'password',
  message: 'Invalid login credencials',
};
const ERROR_UNABLE_TO_SAVE_USER: IError = {
  message: 'Unable to save user data on DB',
};

class AuthService {
  private _authRepo: AuthorizationRepo;
  private _userModel: typeof UserModel;

  constructor ({ authRepo, userModel} : { authRepo: AuthorizationRepo, userModel: typeof UserModel }){
    this._userModel = userModel;
    this._authRepo = authRepo;
  }

  public createUser = async ( { name, username, email_address, password }: ICreateUserRequest): Promise<{ errors?: IError[]; user?: IUser }> => {
    const userWithEmailExists = await this._userModel.findOne({ email_address });
    if ( userWithEmailExists ) {
      return { errors: [ERROR_USER_ALREADY_EXISTS_WITH_EMAIL] };
    }

    const userWithUsername = await this._userModel.findOne({ username });
    if ( userWithUsername ) {
      return { errors: [ERROR_USER_ALREADY_EXISTS_WITH_USERNAME] };
    }

    password = this._authRepo.encryptPassword(password);
    const request: IUser = {
      name,
      username: username.toLowerCase(),
      email_address: email_address.toLowerCase(),
      password,
    };
    
    const user = await this._userModel.create(request);

    if ( !user ) return { errors: [ERROR_UNABLE_TO_SAVE_USER] }

    const accessToken = this._authRepo.encryptToken({
        id: user._id,
        username: user.name,
        email: user.email_address,
        createdAt: user.createdAt?.toString(),
    }, TokenType.accessToken);

    user.accessToken = accessToken;

    return { user };
  };

  public loginUser = async ({ username, password }: ILoginUserRequest): Promise<{
    errors?: IError[];
    user?: IUser;
  }> => {
    const user = await this._userModel.findOne({ username: username.toLowerCase() });
    if (user == null) return { errors: [ERROR_USER_NOT_FOUND] };

    if (!user) return { errors: [ERROR_USER_NOT_FOUND] };

    const passwordIsValid = this._authRepo.comparePassword(password, user.password);
    if (!passwordIsValid) return { errors: [ERROR_USER_NOT_FOUND] };

    const accessToken = this._authRepo.encryptToken({
        id: user._id,
        username: user.name,
        email: user.email_address,
        createdAt: user.createdAt?.toString(),
    }, TokenType.accessToken);

    user.accessToken = accessToken;

    this._userModel.findByIdAndUpdate( user._id!, { accessToken });

    return { user };
  };

}
export default AuthService;
