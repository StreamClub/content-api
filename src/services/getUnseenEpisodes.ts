import { SeenSeason, SeenSeries } from "@entities";

export const getUnseenSeasonEpisodes = (season: SeenSeason, seenSeries: SeenSeries) => {
    const seasonIndex = seenSeries.seasons.findIndex(seenSeason => seenSeason.seasonId === season.seasonId);
    if (seasonIndex === -1) {
        return season.episodes;
    } else {
        const existingEpisodeIds = seenSeries.seasons[seasonIndex].episodes.map(ep => ep.episodeId);
        return season.episodes.filter(episode => !existingEpisodeIds.includes(episode.episodeId));
    }
}