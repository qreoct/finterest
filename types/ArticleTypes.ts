
export interface ArticleType {
    article_id: string;
    title: string;
    content: string;
    link: string;
    image_url: string;
    creator: string
    description: string;
    pubDate: string;
    source_id: string;
    category: [string];
    dateStored: Number;
}

export function convertToArticleType(articleData: any): ArticleType | null {
    try {
        const article = articleData as ArticleType;
        return article;
    } catch (error) {
        console.log(error);
        return null;
    }
}