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

    const validateEmail = this._validateEmail(email_address);
    if (validateEmail.status === false && validateEmail.message ) {
      errors.push({ field: 'email_address', message: validateEmail.message });
    }

    const _validatePassword = this._validatePassword(password);
    if (_validatePassword.status === false && _validatePassword.message ) {
      errors.push({ field: 'password', message: _validatePassword.message });
    }

    return errors;
  }

  beforeForgetPassword =  ({
    email_address,
  }: { email_address: string }): IError[] => {
    const errors: IError[] = [];

    const _validateEmailAddress = this._validateEmail(email_address);
    if (_validateEmailAddress.status === false && _validateEmailAddress.message ) {
      errors.push({ field: 'email_address', message: _validateEmailAddress.message });
    }

    return errors;
  }

  beforeNewPassword =  ({ email_address, new_password, confirm_password }: { email_address: string, new_password: string, confirm_password: string }): IError[] => {
    const errors: IError[] = [];

    const _validateEmailAddress = this._validateEmail(email_address);
    if (_validateEmailAddress.status === false && _validateEmailAddress.message ) {
      errors.push({ field: 'email_address', message: _validateEmailAddress.message });
    }

    const _validatePassword = this._validatePassword(new_password);
    if (_validatePassword.status === false && _validatePassword.message ) {
      errors.push({ field: 'new_password', message: _validatePassword.message });
    }

    const _validateConfirmPassword = this._validatePassword(confirm_password);
    if (_validateConfirmPassword.status === false && _validateConfirmPassword.message ) {
      errors.push({ field: 'confirmPassword', message: _validateConfirmPassword.message });
    }

    return errors;
  }
};

export default AuthValidator;
