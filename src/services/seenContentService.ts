import { seenContentRepository } from "@dal";
import { AlreadyExistsException, NotFoundException } from "@exceptions";
import AppDependencies from "appDependencies";

export class SeenContentService {
    public constructor(dependencies: AppDependencies) {
    }

    public async create(userId: string) {
        const seenContent = await seenContentRepository.get(userId);
        if (seenContent) {
            throw new AlreadyExistsException('Seen Content List already exists');
        }
        return await seenContentRepository.create(userId);
    }

    public async addMovie(userId: string, movieId: number) {
        this.failIfListDoesNotExist(userId);
        await seenContentRepository.addMovie(userId, movieId);
    }

    private async failIfListDoesNotExist(userId: string) {
        const seenContent = await seenContentRepository.get(userId);
        if (!seenContent) {
            throw new NotFoundException('Seen Content List does not exist');
        }
        return seenContent;
    }
}
