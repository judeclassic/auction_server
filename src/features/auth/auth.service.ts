import AuthorizationRepo, { TokenType } from "../../shared/repositories/modules/encryption";
import { IUser, UserModel } from "../../shared/repositories/modules/database/models/user.model";
import { ICreateUserRequest, ILoginUserRequest } from "../../shared/types/request/user";
import IError from "../../shared/types/error/error";
import MailerRepo from "../../shared/repositories/modules/mailer";

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
  message: 'Invalid Password',
};

const ERROR_UNABLE_TO_SAVE_USER: IError = {
  message: 'Unable to save user data on DB',
};

const ERROR_THIS_EMAIL_DO_NOT_EXIST: IError = {
  field: 'email_address',
  message: 'This email is not register with us'
}

const ERROR_CODE_NOT_VALID: IError = {
  field: 'code',
  message: 'Code is not valid'
}

class AuthService {
  private _authRepo: AuthorizationRepo;
  private _mailRepo: MailerRepo;
  private _userModel: typeof UserModel;

  constructor ({ authRepo, mailRepo, userModel} : { authRepo: AuthorizationRepo, mailRepo: MailerRepo; userModel: typeof UserModel }){
    this._userModel = userModel;
    this._authRepo = authRepo;
    this._mailRepo = mailRepo;
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

  public loginUser = async ({ email_address, password }: ILoginUserRequest): Promise<{
    errors?: IError[];
    user?: IUser;
  }> => {
    const user = await this._userModel.findOne({ email_address: email_address.toLowerCase() });
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

    this._userModel.findByIdAndUpdate( user._id, { accessToken });

    return { user };
  };

  public forgetPassword = async ({ email_address }: { email_address: string }): Promise<{
    errors?: IError[];
    status?: boolean;
  }> => {
    const user = await this._userModel.findOne({ email_address: email_address.toLowerCase() });
    if (user == null || !user) return { errors: [ERROR_THIS_EMAIL_DO_NOT_EXIST] };

    const authenticationCode = this._authRepo.generateVerificationCode(6);

    console.log(authenticationCode);

    this._userModel.findByIdAndUpdate( user._id, { 
      authenticationCode: authenticationCode
    });

    this._mailRepo.sendVerificationEmail(email_address, {
      name: user.name.split(' ')[0],
      subject: 'Verification code',
      code: authenticationCode,
    });

    return { status: true };
  };

  public verifyCode = async ({ email_address, code }: { email_address: string, code: string }): Promise<{
    errors?: IError[];
    status?: boolean;
  }> => {
    const user = await this._userModel.findOne({ email_address: email_address.toLowerCase() });
    if (user == null || !user) return { errors: [ERROR_THIS_EMAIL_DO_NOT_EXIST] };

    if (user.authenticationCode !== code) return { errors: [ERROR_CODE_NOT_VALID] };

    return { status: true };
  };

  public newPassword = async ({ email_address, code, new_password }: { email_address: string; code: string; new_password: string }): Promise<{
    errors?: IError[];
    status?: boolean;
  }> => {
    const user = await this._userModel.findOne({ email_address: email_address.toLowerCase() });
    if (user == null || !user) return { errors: [ERROR_THIS_EMAIL_DO_NOT_EXIST] };

    if (user.authenticationCode !== code) return { errors: [ERROR_CODE_NOT_VALID] };

    const password = this._authRepo.encryptPassword(new_password);

    this._userModel.findByIdAndUpdate( user._id, { password });

    return { status: true };
  };

}
export default AuthService;
