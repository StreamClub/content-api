import { Page } from "./page";
import { PaginatedResult } from "./paginatedResult";

export class UserContentList extends PaginatedResult {
    userId: number;

    constructor(userId: number, page: Page) {
        super(page.pageNumber, page.totalPages, page.totalResults, page.results);
        this.userId = userId;
    }

}
