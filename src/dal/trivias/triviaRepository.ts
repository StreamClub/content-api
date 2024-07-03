import { Trivia } from '@entities';
import { TriviaModel } from './triviaModel';
import { InsertTriviaDto } from '@dtos';

class TriviaRepository {

    async getAll() {
        const trivias = await TriviaModel.find();
        return trivias.map(trivia =>
            new Trivia(trivia)
        );
    }

    async insertMany(trivias: InsertTriviaDto[]) {
        return await TriviaModel.insertMany(trivias);
    }

}

export const triviaRepository = new TriviaRepository();
