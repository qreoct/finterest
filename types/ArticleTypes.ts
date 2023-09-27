export interface ArticleType {
    article_id: string;
    category: [string];
    content: string;
    creator: string;
    description: string;
    image_url: string;
    link: string;
    pubDate: string;
    source_id: string;
    title: string;
    content_summary: string
    prompt_one: string
    prompt_two: string
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