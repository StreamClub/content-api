export class Page {
    page: number;
    totalPages: number;
    totalResults: number;
    results: any[];

    constructor(page: number, pageSize: number, totalResults: number, results: any[]) {
        this.page = page;
        this.totalResults = totalResults;
        this.totalPages = Math.ceil(this.totalResults / pageSize);
        this.results = results.slice((page - 1) * pageSize, page * pageSize);
    }

}