export class ApiException extends Error {
    public code: number;
    public description: string;
    public isScException = true;

    constructor(message: string) {
        super(message);
    }
}
