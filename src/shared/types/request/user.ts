
export type ICreateUserRequest =  {
    name: string;
    email_address: string;
    password: string;
}

export type ILoginUserRequest =  {
    email_address: string;
    password: string;
}