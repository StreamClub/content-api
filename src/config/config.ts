import dotenv from 'dotenv';

type Config = {
    port: number;
    dbUrl: string;
    tmdbApiKey?: string;
};

dotenv.config();


export const config: Config = {
    port: Number(process.env.PORT) || 8080,
    dbUrl: process.env.DB_URL || 'YOUR_DB_URL',
    tmdbApiKey: process.env.TMDB_API_KEY || "YOUR_TMDB_API"
};
