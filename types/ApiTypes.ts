
export interface NewsDataIoResponseType {
    status: string;
    totalResults: number;
    results: NewsDataIoArticleType[];
    nextPage: string;
}

export interface NewsDataIoArticleType {
    article_id: string;
    title: string;
    content: string;
    link: string;
    image_url: string;
    video_url: string;
    creator: [string];
    description: string;
    pubDate: string;
    source_id: string;
    category: [string];
    language: string;
    country: [string];
    sourcePriority: number;
}

