import { triviaRepository } from "@dal";
import AppDependencies from "appDependencies";

export class TriviaService {
    public constructor(dependencies: AppDependencies) {
    }

    public async getTrivias(userId: number) {
        return await triviaRepository.getAll();
    }

}
