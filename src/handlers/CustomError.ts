export class CustomError extends Error{
    public code:number=500;
    public details?:string;


    constructor(message:string,code?:number,details?:string){
        super(message);
        this.code=code||500;
        this.message=message;
        this.details=details;
    }

    public toJson(){

        const resString = `${this.name}-${this.message}-${this.code}`;

        return resString;

    }

}