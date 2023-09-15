import AuthorizationRepo, { TokenType } from "../../shared/repositories/modules/encryption";
import { IMultipleUser, IUser, UserModel } from "../../shared/repositories/modules/database/models/user.model";
import { ICreateUserRequest, ILoginUserRequest } from "../../shared/types/request/user";
import IError from "../../shared/types/error/error";
import MailerRepo from "../../shared/repositories/modules/mailer";
import { AdminModel, IAdmin } from "../../shared/repositories/modules/database/models/admin.model";

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


class AdminService {
  private _authRepo: AuthorizationRepo;
  private _userModel: typeof UserModel;
  private _adminModel: typeof AdminModel;

  constructor ({ authRepo, userModel, adminModel} : {
    authRepo: AuthorizationRepo,
    userModel: typeof UserModel
    adminModel: typeof AdminModel;
  }){
    this._userModel = userModel;
    this._authRepo = authRepo;
    this._adminModel = adminModel;
  }

  public loginUser = async ({ email_address, password }: ILoginUserRequest): Promise<{ errors?: IError[]; admin?: IAdmin; }> => {
    const admin = await this._adminModel.findOne({ email_address: email_address.toLowerCase() });

    if (!admin) return { errors: [ERROR_USER_NOT_FOUND] };
    const passwordIsValid = this._authRepo.comparePassword(password, admin.password);

    if (!passwordIsValid) return { errors: [ERROR_USER_NOT_FOUND] };
    const accessToken = this._authRepo.encryptToken({
        id: admin._id,
        username: admin.name,
        email: admin.email_address,
        createdAt: admin.createdAt?.toString(),
    }, TokenType.accessToken);

    admin.accessToken = accessToken;
    this._adminModel.findByIdAndUpdate( admin._id, { accessToken });

    return { admin };
  };
  
  public getAdminProfile = async (userId: string): Promise<{
    errors?: IError[];
    admin?: IAdmin;
  }> => {
    const admin = await this._adminModel.findById(userId);
    if (!admin) return { errors: [ERROR_USER_NOT_FOUND] };

    return { admin };
  };

  public getAllUsers = async ({ limit, page }: { limit: number, page: number }): Promise<{ errors?: IError[]; users?: IMultipleUser; }> => {
    const users = await this._userModel.paginate({},{ limit, page });
    if (!users) return { errors: [ERROR_THIS_EMAIL_DO_NOT_EXIST] };

    return { users: {
      total_users: users.totalDocs,
      users: users.docs,
      has_next: users.hasNextPage
    } };
  };

  public banUser = async ({ userId }: { userId: string }): Promise<{ errors?: IError[]; user?: IUser; }> => {
    const user = await this._userModel.findOneAndUpdate({ _id: userId }, { isBanned: true }, { new: true });
    if (!user) return { errors: [ERROR_THIS_EMAIL_DO_NOT_EXIST] };

    return { user };
  };

  public unbanUser = async ({ userId }: { userId: string }): Promise<{ errors?: IError[]; user?: IUser; }> => {
    const user = await this._userModel.findOneAndUpdate({ _id: userId }, { isBanned: false }, { new: true });
    if (!user) return { errors: [ERROR_THIS_EMAIL_DO_NOT_EXIST] };

    return { user };
  };

  public removeUser = async ({ userId }: { userId: string }): Promise<{ errors?: IError[]; user?: IUser; }> => {
    const user = await this._userModel.findOneAndRemove({ _id: userId });
    if (!user) return { errors: [ERROR_THIS_EMAIL_DO_NOT_EXIST] };

    return { user };
  };

}
export default AdminService;
