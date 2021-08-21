
/**
 * custom error for packer specific issues
 */
export class ApiError extends Error {
    /**
     * create a new ApiError
     * @constructor
     * @param {string} message - actual error message.
     * @param {string} stack - error stack trace.
     */
    constructor(message: string, stack: any = null) {
        super(message);
        this.stack = stack;
    }
}
