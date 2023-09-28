export interface ChatHistoryArticleType {
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
    datetimeOfChat: Date
}

export function convertToChatHistoryArticleType(articleData: any): ChatHistoryArticleType | null {
    try {
        const article = articleData as ChatHistoryArticleType;
        return article;
    } catch (error) {
        console.log(error);
        return null;
    }
}