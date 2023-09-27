import runGetNewsAndStoreInDb from '@/lib/NewsController';
import { NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

//This is the API end point of Finterest for fetching news from NewsData.
//When we host it on Vercel, we can configure a scheduled function to call this API every midnight, updating our database

const getNews = async (req: NextRequest, res: NextApiResponse) => {
  try {
    const news = await runGetNewsAndStoreInDb();
    res.status(200).json({ message: 'News data fetched successfully', articles: news});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred:\n' + error });
  }
};

export default getNews;