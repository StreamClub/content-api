import { Page } from "./page";
import { PaginatedResult } from "./paginatedResult";

export class UserContentList extends PaginatedResult {
    userId: string;

    constructor(userId: string, page: Page) {
        super(page.pageNumber, page.totalPages, page.totalResults, page.results);
        this.userId = userId;
    }

}
