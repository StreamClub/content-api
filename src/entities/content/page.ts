export class Page {
    pageNumber: number;
    totalPages: number;
    totalResults: number;
    results: any[];

    constructor(pageNumber: number, pageSize: number, totalResults: number, results: any[]) {
        this.pageNumber = pageNumber;
        this.totalResults = totalResults;
        this.totalPages = Math.ceil(this.totalResults / pageSize);
        this.results = results.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    }

}