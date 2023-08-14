import _BaseValidator from "../../shared/repositories/modules/validator/validator";
import IError from "../../shared/types/error/error";
import { ICreateUserRequest, ILoginUserRequest } from "../../shared/types/request/user";


class AuthValidator  extends _BaseValidator{
  register =  ({
    name,
    password,
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

    const _validatePassword = this._validatePassword(password);
    if (_validatePassword.status === false && _validatePassword.message ) {
      errors.push({ field: 'password', message: _validatePassword.message });
    }

    return errors;
  }
  
  login = ({ emailAddress, password }: ILoginUserRequest) => {
    const errors: IError[] = [];

    const validatePhone = this._validateEmail(emailAddress);
    if (validatePhone.status === false && validatePhone.message ) {
      errors.push({ field: 'emailAddress', message: validatePhone.message });
    }

    const _validatePassword = this._validatePassword(password);
    if (_validatePassword.status === false && _validatePassword.message ) {
      errors.push({ field: 'password', message: _validatePassword.message });
    }

    return errors;
  }
};

export default AuthValidator;
