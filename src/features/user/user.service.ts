import AuthorizationRepo, { TokenType } from "../../shared/repositories/modules/encryption";
import { IUser, UserModel } from "../../shared/repositories/modules/database/models/user.model";
import { ICreateUserRequest, ILoginUserRequest } from "../../shared/types/request/user";
import IError from "../../shared/types/error/error";

const ERROR_USER_ALREADY_EXISTS_WITH_EMAIL: IError = {
  field: 'emailAddress',
  message: 'A user with this email already exists.',
};
const ERROR_USER_NOT_FOUND: IError = {
  field: 'password',
  message: 'User with this email/password combination does not exist.',
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

  public updateProfile = async (userId: string, userRequest: Omit<IUser, 'id'>): Promise<{ errors?: IError[]; user?: IUser }> => {
    if ( userRequest.email_address ) {
      const userWithEmailExists = await this._userModel.findOne({ emailAddress: userRequest.email_address });
      if ( userWithEmailExists ) {
        return { errors: [ERROR_USER_ALREADY_EXISTS_WITH_EMAIL] };
      }
    }
    
    const user = await this._userModel.create(userRequest);
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

  public getProfile = async (userId: string): Promise<{
    errors?: IError[];
    user?: IUser;
  }> => {
    const user = await this._userModel.findById(userId);
    if (user == null) return { errors: [ERROR_USER_NOT_FOUND] };

    return { user };
  };

}
export default AuthService;
