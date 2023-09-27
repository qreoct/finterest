import { NewsDataIoArticleType, NewsDataIoResponseType } from '@/types/ApiTypes';

export async function getNewsFromNewsData(): Promise<NewsDataIoResponseType> {

    // Finance keywords const maybe move to some config file later
    // These are the search keywords used
    const baseUrl = `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWSDATA_KEY}`
    const financeKeywords = "((finance OR stock OR economic OR GDP OR inflation OR interest) NOT horoscope)";
    const categories = ['business', 'world', 'technology'].join(',');
    const countries = ['au', 'jp', 'gb', 'sg', 'us'].join(',');
    let fetchedArticles: NewsDataIoArticleType[] = [];
    let page = '';
    let pageParam = '';
    let count = 0;

    for (let i = 0; i < 10; i++) {

        if (page != '') {
            pageParam = `&page=${page}`
        } else {
            pageParam = ''
        }

        const apiResponse = await fetch(
            baseUrl + `&q=${financeKeywords}&full_content=1&category=${categories}` + 
                `&language=en&image=1&prioritydomain=top&country=${countries}` + pageParam,
            {
                headers: {
                    // Add any headers here if we need next time
                },
            },
        );

        let json: NewsDataIoResponseType;

        try {
            json = await apiResponse.json();
        } catch (error) {
            console.log(error);
            return {
                status: "error",
                results: fetchedArticles,
                totalResults: fetchedArticles.length,
                pageNumber: '',
            };
        }

        const { status, results, pageNumber } = json as NewsDataIoResponseType;
        console.log(results)
        for (const res of results) {
            fetchedArticles.push(res);
            count += 1;
        }
        page = pageNumber ?? '';

    }

    return { status: "success", results: fetchedArticles, totalResults: count };
}