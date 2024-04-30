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
        console.log(url)
        return await axios.get(url);
    } catch (error) {
        if (error.response.status == 429) {
            logger.warn(`Rate limit exceeded, waiting between 1 and 2 seconds`);
            await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1000) + 1000));
            return safeGet(url);
        }
        logger.error(`Error getting ${url}: ${error.message}`);
        const emptyResponse: AxiosResponse<any> = {
            data: {}, // or use `null` or `undefined` depending on what you mean by "empty"
            status: 200, // Assuming OK status
            statusText: 'OK',
            headers: {
                'content-type': 'application/json'
            },
            config: {
                url: '',
                method: 'get',
                headers: null,
                transformRequest: [],
                transformResponse: [],
                timeout: 0,
                xsrfCookieName: 'XSRF-TOKEN',
                xsrfHeaderName: 'X-XSRF-TOKEN',
                maxContentLength: -1,
                validateStatus: () => true
            },
            request: {} // You often also need to mock the request object
        };

        return Promise.resolve(emptyResponse);
    }

}
