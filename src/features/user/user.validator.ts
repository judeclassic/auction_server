import _BaseValidator from "../../shared/repositories/modules/validator/validator";
import IError from "../../shared/types/error/error";
import { ICreateUserRequest, ILoginUserRequest } from "../../shared/types/request/user";


class UserValidator  extends _BaseValidator{
  userInformation =  ({
    name,
    emailAddress,
  }: ICreateUserRequest): IError[] => {
    const errors: IError[] = [];

    const _validateUsername = this._validateSingleName(name);
    if (_validateUsername.status === false && _validateUsername.message ) {
      errors.push({ field: 'name', message: _validateUsername.message });
    }

    const _validatePhoneNumber = this._validateEmail(emailAddress);
    if (_validatePhoneNumber.status === false && _validatePhoneNumber.message ) {
      errors.push({ field: 'emailAddress', message: _validatePhoneNumber.message });
    }

    return errors;
  }

};

export default UserValidator;
