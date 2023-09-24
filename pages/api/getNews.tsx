import runGetNews from '@/lib/NewsController';
import { NextApiRequest, NextApiResponse } from 'next';

//This is the API end point of Finterest for fetching news from NewsData.
//When we host it on Vercel, we can configure a scheduled function to call this API every midnight, updating our database
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await runGetNews();
    res.status(200).json({ message: 'News data fetched successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};