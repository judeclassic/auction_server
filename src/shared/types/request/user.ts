
export type ICreateUserRequest =  {
    name: string;
    emailAddress: string;
    password: string;
}

export type ILoginUserRequest =  {
    emailAddress: string;
    password: string;
}