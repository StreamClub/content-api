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
}
