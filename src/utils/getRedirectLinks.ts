import axios from "axios";
import cheerio from "cheerio";

export const getRedirectLinks = async (providersUrl: string) => {
    const providers = await axios.get(providersUrl);
    const $ = cheerio.load(providers.data);
    const providersData: any = {};

    $('.ott_provider').each((_, element) => {
        const providerTitle = $(element).find('h3').text().trim();
        if (providerTitle == 'Stream') {
            $(element).find('.providers li').each((_, provider) => {
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
