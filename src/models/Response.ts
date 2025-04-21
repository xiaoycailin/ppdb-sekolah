export class ResponseError extends Error {
    constructor(public code: number, public message: string, public name: string = 'ResponseError',) {
        super(message);
    }
}

