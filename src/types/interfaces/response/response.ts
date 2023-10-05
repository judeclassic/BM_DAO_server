import ErrorInterface from "../error";

interface ResponseInterface<T> {
    code: number;
    status: boolean;
    data?: T
    error?: ErrorInterface[]
}
  
export default ResponseInterface;
  