export class CustomError extends Error{

    public statusCode:number;
    public details?:string;

    constructor(message:string,statusCode?:number,details?:string){
        super(message);
        this.statusCode=this.statusCode||500;
        this.details=this.details;

    }
}