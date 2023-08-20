
export type ICreateUserRequest =  {
    name: string;
    username: string;
    email_address: string;
    password: string;
}

export type ILoginUserRequest =  {
    username: string;
    password: string;
}