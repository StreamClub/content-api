import { TMDB_PROVIDER_CLASS, TMDB_STREAM_PROVIDER_CLASS, TMDB_STREAM_PROVIDER_TYPE } from "@config";
import axios from "axios";
import cheerio from "cheerio";

export const getRedirectLinks = async (providersUrl: string) => {
    const providers = await axios.get(providersUrl);
    const $ = cheerio.load(providers.data);
    const providersData: any = {};

    $(TMDB_PROVIDER_CLASS).each((_, element) => {
        const providerType = $(element).find('h3').text().trim();
        if (providerType == TMDB_STREAM_PROVIDER_TYPE) {
            $(element).find(TMDB_STREAM_PROVIDER_CLASS).each((_, provider) => {
                const providerLink = $(provider).find('a').attr('href');
                const providerImage = $(provider).find('img').attr('src');
                if (!providersData[providerImage]) {
                    providersData[providerImage] = {
                        link: providerLink
                    };
                }
            });
        }
    });
    return providersData;
}
