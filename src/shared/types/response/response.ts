import IError from "../error/error";


interface ResponseInterface<T> {
    code: number;
    status: boolean;
    data?: T
    error?: IError[]
}
  
export default ResponseInterface;