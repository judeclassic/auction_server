import _BaseValidator from "../../shared/repositories/modules/validator/validator";
import IError from "../../shared/types/error/error";
import { ICreateUserRequest, ILoginUserRequest } from "../../shared/types/request/user";


class AuthValidator  extends _BaseValidator{
  register =  ({
    name,
    username,
    password,
    email_address,
  }: ICreateUserRequest): IError[] => {
    const errors: IError[] = [];

    const _validateName = this._validateSingleName(name);
    if (_validateName.status === false && _validateName.message ) {
      errors.push({ field: 'name', message: _validateName.message });
    }

    const _validateUsername = this._validateSingleName(name);
    if (_validateUsername.status === false && _validateUsername.message ) {
      errors.push({ field: 'username', message: _validateUsername.message });
    }

    const _validatePhoneNumber = this._validateEmail(email_address);
    if (_validatePhoneNumber.status === false && _validatePhoneNumber.message ) {
      errors.push({ field: 'email_address', message: _validatePhoneNumber.message });
    }

    const _validatePassword = this._validatePassword(password);
    if (_validatePassword.status === false && _validatePassword.message ) {
      errors.push({ field: 'password', message: _validatePassword.message });
    }

    return errors;
  }
  
  login = ({ email_address, password }: ILoginUserRequest) => {
    const errors: IError[] = [];

    const validatePhone = this._validateEmail(email_address);
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
