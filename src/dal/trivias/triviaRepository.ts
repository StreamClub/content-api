import { TriviaModel } from './triviaModel';
import { InsertTriviaDto } from '@dtos';

class TriviaRepository {

    async getAll() {
        return await TriviaModel.find();
    }

    async insertMany(trivias: InsertTriviaDto[]) {
        return await TriviaModel.insertMany(trivias);
    }

}

export const triviaRepository = new TriviaRepository();
