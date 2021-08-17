
export class ApiError extends Error {
    constructor(message: string, stack: any = null) {
        super(message);
        this.stack = stack;
    }
}
