export class PaginatedResult {
    page: number;
    totalPages: number;
    totalResults: number;
    results: any[];

    constructor(page: number, totalPages: number, totalResults: number, results: any[]) {
        this.page = page;
        this.totalPages = totalPages;
        this.totalResults = totalResults;
        this.results = results;
    }

}
