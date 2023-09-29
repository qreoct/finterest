## Finterest
> Where Wisdom Meets Wealth

Finterest is a web application delivering up-to-date financial news empowered with generative AI. It empowers readers to not only access the latest news, but also to foster deep understanding and engagement with the articles. With Finterest, you can seamlessly query, seek clarifications, and gain profound insights into every article, making complex financial information easily accessible and digestible.

If you are someone seeking to delve deep into the world of financial news, look no further. Try out Finterest [here](https://finterest3216.vercel.app/) today! 💸📰


 <p align="center">
    <img src="public/assets/readme-logo.png" width="250" />
   </p>



### Installation for Local Testing
1. Ensure that you have [NodeJS](https://nodejs.org/en) installed. 
2. Clone the repo to your computer.
```
git clone https://github.com/qreoct/finterest.git
```
3. Change directory into `finterest`.
```
cd finterest
```
4. Download dependencies for the application.
```
npm install
```
5. In the root directory of `finterest`, create a new file called `.env.local`. Paste the following content into the environment file. Then, you would need to create your Firebase project and obtain your [OpenAI](https://platform.openai.com/), [NewsData](https://newsdata.io/) and [Google Analytics](https://analytics.google.com/) keys. Finally, replace the values in the curly brackets accordingly. 
```
NEXT_PUBLIC_OPENAI_API_KEY={apiKey}
NEXT_PUBLIC_FIREBASE_API_KEY={apikey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN={domain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID={projectid}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET={storagebucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID={senderid}
NEXT_PUBLIC_FIREBASE_APP_ID={appid}
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID={measurementid}
NEXT_PUBLIC_NEWSDATA_KEY={newsDataKey}
NEXT_PUBLIC_GOOGLE_ANALYTICS={googleAnalyticsKey}
```
6. Run Finterest on your local server.
```
npm run dev
```

### About the Creators
Finterest is a product proudly created by the following contributors:

#### Kleon Ang Cunrong (A0223905J)
Contributions:
- Built the article recommendation system using the Naive-Bayes algorithm, keeping track of the number and types of articles that a user has read.
- Created the profile page, integrating it with the statistics of the users.
- Designed database schema for Finterest.
- Improved on layout and resolved bugs, such as date parsing and authentication issues during refreshing.

#### Jefferson Lim (A0217512N)
Contributions:
- Created the branding and image of Finterest.
- Designed hi-fidelity prototypes and design system via Figma.
- Enhanced the parsing of raw news information from NewsData into OpenAI before storing into the database.
- Implemented the summary caching feature where AI summaries of articles would be generated on-demand by the user, and cached for future users to view.

#### Elvis Teo Chin Hao (A0218206M)
Contributions:
- Implemented the fetching and parsing of news articles from NewsData API into Finterest.
- Set up OpenAI integration with NextJS
- Created basic chatbot logic and interface.
- Set up Firestore database.

#### Eugene Tang KangJie (A0233828Y)
Contributions:
- Designed database schema for Finterest.
- Set up Firebase authentication and implemented relevant features, such as login and registration.
- Implemented the feature to view one's history of article chats
- Converted the hi-fidelity prototypes into mobile-responsive interfaces, including the landing pages, chat interfaces and dashboard.

#### Joonghyun Eo (A0190907Y)
Contributions:
- Experimented with different AI LLM models and frameworks.
- Conducted prompt engineering for the chat bots present in Finterest.
- Developed marketing and monetisation strategies for Finterest.
- Carried out quality assurance testing after Finterest has been built, identifying bugs and layout issues.


### Acknowledgements
In the course of developing Finterest, our team utilised a variety of online resources. We would like to sincerely thank the authors and creators of these resources.

1. [NewsData API](https://newsdata.io/documentation) for fetching of articles from NewsData
2. [OpenAI API](https://platform.openai.com/docs/libraries/node-js-library) for integration of OpenAI with NextJS
3. [TailwindCSS documentation](https://v2.tailwindcss.com/docs) for responsive layouts
4. [Firebase documentation](https://firebase.google.com/docs/firestore) for authentication and Firestore features
5. [Firebase Authentication with NextJS tutorial](https://www.stoman.me/articles/nextjs-firebase-auth) by Nangialai Stoman
6. [Landing page design inspiration](https://onepagelove.com/honk) by Honk
7. [How to Add Google Analytics to a Next.js Application](https://www.mohammadfaisal.dev/blog/add-google-analytics-to-nextjs) by Mohammad Faisal
8. [ChatGPT](https://chat.openai.com/) for asking questions related to debugging and coding



