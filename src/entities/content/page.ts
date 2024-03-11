export class Page {
    page: number;
    totalPages: number;
    totalResults: number;
    results: any[];

    constructor(page: number, pageSize: number, totalResults: number, results: any[]) {
        this.page = page;
        this.totalResults = totalResults;
        this.totalPages = Math.ceil(totalResults / pageSize);
        this.results = results;
    }

}