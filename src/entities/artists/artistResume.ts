import { Person } from "moviedb-promise";


export class ArtistResume {
    id: number;
    name: string;
    poster: string;
    birthDate: string;
    birthPlace: string;
    deathDate: string;
    gender: string;

    constructor(tmdbArtist: Person) {
        this.id = tmdbArtist.id;
        this.name = tmdbArtist.name;
        this.poster = tmdbArtist.profile_path;
        this.birthDate = tmdbArtist.birthday;
        this.birthPlace = tmdbArtist.place_of_birth;
        this.deathDate = tmdbArtist.deathday;
        this.gender = this.getGender(tmdbArtist.gender);
    }

    public getGender(tmdbGender: number) {
        switch (tmdbGender) {
            case 1:
                return "Mujer"
            case 2:
                return "Hombre"
            case 3:
                return "No binario"
            default:
                return "Desconocido"
        }
    }
}
