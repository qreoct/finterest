## Finterest
> Turning learning into earning for youths

Finterest is a web application that aims to promote financial literacy for interested youths via a tailored and gamified educational experience.

### Installation
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
5. Setup API keys (for more info check out PRs #14, #15)
```
NEXT_PUBLIC_OPENAI_API_KEY={apiKey}
NEXT_PUBLIC_FIREBASE_API_KEY={apikey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN {domain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID={projectid}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET={storagebucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID={senderid}
NEXT_PUBLIC_FIREBASE_APP_ID={appid}
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID={measurementid}
NEXT_PUBLIC_OPENAI_API_KEY={openAIKey}
NEXT_PUBLIC_NEWS_KEY={newsDataKey}
NEXT_PUBLIC_GOOGLE_ANALYTICS={googleAnalyticsKey}
```
6. Run Finterest on your local server
```
npm run dev
```
