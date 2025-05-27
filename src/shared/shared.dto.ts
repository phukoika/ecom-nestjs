export class SuccessDTO  {
    statusCode: string;
    data: any;
    
    constructor(partial: Partial<SuccessDTO>) {
        Object.assign(this, partial);
    }
}

