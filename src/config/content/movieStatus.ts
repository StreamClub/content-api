interface MovieStatus {
    [key: string]: string;
}

export const movieStatus: MovieStatus = {
    "Canceled": "Cancelada",
    "In Production": "En producción",
    "Planned": "Programada",
    "Post Production": "Posproducción",
    "Released": "Estrenada",
    "Rumored": "Se rumorea",
};
