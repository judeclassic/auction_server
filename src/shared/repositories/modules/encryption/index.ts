//@ts-check
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import defaultConfig from '../../../configurations/config';
const { accessTokenSecret, adminAccessTokenSecret } = defaultConfig.auth;

export enum TokenType {
    accessToken = 'ACCESS_TOKEN_SECRET',
    adminAccessToken = 'ADMIN_ACCESS_TOKEN_SECRET',
    refreshToken = 'REFRESH_TOKEN_SECRET',
    resetPassword = 'RESET_PASSWORD_SECRET',
    emailVerification = 'EMAIL_VERIFICATION_SECRET'
}

class AuthorizationRepo {
    key: string;
    jwt: typeof jwt;
    uuid: any;
    bcrypt: typeof bcrypt;

    constructor() {
        this.key = 'key';
        this.jwt = jwt;
        this.uuid = uuid;
        this.bcrypt = bcrypt;
    }

    private getTokenKeyByType = (type?: TokenType) => {
        if (type === TokenType.adminAccessToken) {
            return {key: `${adminAccessTokenSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 30 * 2};
        }
        return {key: `${accessTokenSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 7,};
    }

    public encryptToken = (data: any, type?: TokenType) => {
        const token = this.getTokenKeyByType(type);
        return this.jwt.sign(data, token.key, { expiresIn: token.expiresIn});
    }

    public decryptToken = (data: any, type: TokenType) => {
        return this.jwt.decode(data);
    }

    public createSpecialKey = ({prefix='', suffix='', removeDashes=false}) => {
        const secretKey = this.uuid().split('_').join('');
        if (removeDashes ) {
            const secretKeyWithDashes = secretKey.split('_').join('');
            return `${prefix}${secretKeyWithDashes}${suffix}`;
        }
        return `${prefix}${secretKey}${suffix}`;
    }


    public verifyBearerToken = (data: string, type: TokenType) => {
        if (data === null || data === undefined) {
            return { status: false, error: 'Authentication Failed'};
        }
        const tokenKey = this.getTokenKeyByType(type)
        try {
            const token = data.split(" ",2)[1];
            const decoded = this.jwt.verify(token, tokenKey.key);
            return {status: true, data: decoded};
        }
        catch (error) {
            return { status: false, error: 'Authentication Failed' };
        }
    }

    public encryptPassword = (password:any) => {
        return this.bcrypt.hashSync(password, 10);
    }

    public comparePassword = ( password: string, userPassword :string ) => {
        return this.bcrypt.compareSync(password, userPassword)
    }

    public generateVerificationCode = (numb: number) => {
        return Math.floor(Math.random() * ((10^numb)-1)).toString();
    }
}

export default AuthorizationRepo;