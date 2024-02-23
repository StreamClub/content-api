import { TMDB_PROVIDER_CLASS, TMDB_STREAM_PROVIDER_CLASS, TMDB_STREAM_PROVIDER_TYPE } from "@config";
import { ProvidersDictionary } from "@entities";
import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import { logger } from "./logger";

export const getRedirectLinks = async (providersUrl: string) => {
    const providers = await safeGet(providersUrl);
    const $ = cheerio.load(providers.data);
    const providersData: ProvidersDictionary = {};

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

const safeGet = async (url: string): Promise<AxiosResponse<any, any>> => {
    try {
        return await axios.get(url);
    } catch (error) {
        if (error.response.status == 429) {
            logger.warn(`Rate limit exceeded, waiting 1 second`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return safeGet(url);
        }
        throw error;
    }
}
