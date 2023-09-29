import {
    collection,
    query,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    orderBy,
    where,
    addDoc,
    arrayUnion,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "@/config/firebase.config.js";

import { getCurrentDate, convertDateToString, convertDateToDDMM } from "@/utils/convertTimeStampToString";

export async function addNewArticleToDB(
    articleId,
    article
) {
    const articleToStore = {
        article_id: articleId,
        title: article.title,
        source_id: article.source_id,
        pubDate: article.pubDate,
        creator: article.creator,
        category: article.category,
        image_url: article.image_url,
        description: article.description,
        link: article.link,
        content: article.content,
        content_summary: article.content_summary,
        prompt_one: article.prompt_one,
        prompt_two: article.prompt_two,
    }

    // Add article to database
    // await db.collection('articles').add(articleToStore);
    await setDoc(doc(db, "articles", articleId), articleToStore).then((article) => {
        console.log(`succesfully wrote article ${articleId} to db`);
    });
}

// Update summary content of an article
export async function updateArticleSummary(articleId, summaryContent) {
    const articleRef = doc(db, "articles", articleId);
    await updateDoc(articleRef, {
        content_summary: summaryContent
    });
}


// Returns a list of article id strings
export async function getArticleIdList() {
    const q = query(collection(db, "articles"), orderBy("dateStored", "desc"));
    const results = await getDocs(q);

    return new Set(results.docs.map(currDoc => {
        return currDoc.id;
    }));
}


// Returns a personalised list of article id strings based on user's category history
// Use naive bayes approach to recommend articles according to a probability distribution based on user's category history
export async function getPersonalisedArticleIdList(userId, numArticles) {
    const userRef = doc(db, "users", userId);

    // Filter out all articles that the user has read
    const user_article_history = (await getDoc(userRef)).data()["article_history"];
    const q = query(collection(db, "articles"), orderBy("dateStored", "desc"));
    const results = await getDocs(q);
    const user_article_history_set = new Set(user_article_history);
    let filtered_articles = results.docs.filter(currDoc => {
        return !user_article_history_set.has(currDoc.id);
    });

    // Calculate the probability of each category in the whole database (from results)
    const category_prob = {};
    results.docs.forEach(currDoc => {
        const currArticle = currDoc.data();
        const currArticleCategory = currArticle.category[0];
        if (!category_prob[currArticleCategory]) {
            category_prob[currArticleCategory] = 1 / results.docs.length;
        } else {
            category_prob[currArticleCategory] += 1 / results.docs.length;
        }
    });

    const user_category_count = (await getDoc(userRef)).data()["category_history"];

    if (!user_category_count) {
        // No category history, return all articles
        return getArticleIdList();
    }

    let user_article_count = 0;
    // Add 1 to each category count to avoid 0 probability
    for (const [key, value] of Object.entries(user_category_count)) {
        user_category_count[key] = value + 1;
        user_article_count += value + 1;
    }

    // Add 1 to all other categories not in user's category history
    const all_categories = Object.keys(category_prob);
    all_categories.forEach(currCategory => {
        if (!user_category_count[currCategory]) {
            user_category_count[currCategory] = 1;
            user_article_count += 1;
        }
    });

    // Calculate the probability of each category given the user's category history
    const category_prior_prob = {};
    for (const [key, value] of Object.entries(user_category_count)) {
        category_prior_prob[key] = value / user_article_count;
    }

    // Calculate the posterior probability of the user clicking given each category
    // P(user clicks | category) = [P(category | user clicks) * P(user clicks)] / P(category)
    // P(user clicks) is the same for all categories, so we can ignore it
    const category_posterior_prob = {};
    let posterior_sum = 0;
    for (const [key, value] of Object.entries(category_prob)) {
        category_posterior_prob[key] = category_prior_prob[key] / category_prob[key];
        posterior_sum += category_posterior_prob[key];
    }

    // Rescale the posterior probabilities so that they sum to 1
    for (const [key, value] of Object.entries(category_posterior_prob)) {
        category_posterior_prob[key] = value / posterior_sum;
    }

    // Iterate through all unread articles and add to articleIdList based on probability until numArticles is reached
    const articleIdList = [];
    filtered_articles.forEach(currDoc => {
        const currArticle = currDoc.data();
        const currArticleCategory = currArticle.category[0];
        const currArticlePosteriorProb = category_posterior_prob[currArticleCategory];
        const randNum = Math.random(); // Random number between 0 and 1
        if (randNum <= currArticlePosteriorProb) {
            articleIdList.push(currArticle.article_id);
        }
    });

    // If not enough articles, add articles that the user has not read and are not in the list
    if (articleIdList.length < numArticles) {
        filtered_articles.forEach(currDoc => {
            const currArticle = currDoc.data();
            if (!articleIdList.includes(currArticle.article_id)) {
                articleIdList.push(currArticle.article_id);
            }
        });
    }

    return articleIdList.slice(0, numArticles);
}

// Get trending article list based on the number of times each article has been read by all users
export async function getTrendingArticleIdList(userId, numArticles) {
    const userRef = doc(db, "users", userId);

    // Filter out all articles that the user has read
    const user_article_history = (await getDoc(userRef)).data()["article_history"];
    const q = query(collection(db, "articles"), orderBy("dateStored", "desc"));
    const results = await getDocs(q);
    const user_article_history_set = new Set(user_article_history);
    let filtered_articles = results.docs.filter(currDoc => {
        return !user_article_history_set.has(currDoc.id);
    });

    // Sort the articles by their view_count (descending)
    // If two articles have the same number of reads, sort by dateStored
    filtered_articles.sort((a, b) => {
        let a_view_count = a.data()["view_count"];
        let b_view_count = b.data()["view_count"];

        if (!a_view_count) {
            a_view_count = 0;
        }
        if (!b_view_count) {
            b_view_count = 0;
        }

        const a_date_stored = a.data()["dateStored"];
        const b_date_stored = b.data()["dateStored"];
        if (a_view_count === b_view_count) {
            return b_date_stored - a_date_stored;
        } else {
            return b_view_count - a_view_count;
        }
    });

    // Return the top numArticles articles
    return filtered_articles.slice(0, numArticles).map(currDoc => {
        return currDoc.id;
    });
}

// Get an article object
export async function getArticle(articleId) {
    const docRef = doc(db, "articles", articleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

// Add articleID to the chats array in the users document
export async function addArticleIdToUser(userId, articleId) {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
        chats: arrayUnion(articleId)
    });
    // chatId = userId + articleId << In this way all chats still have unique Ids
}

// Update user's article history and category history and article read count on article click
export async function updateUserHistory(userId, articleId) {
    const userRef = doc(db, "users", userId);
    const category = (await getArticle(articleId)).category[0];
    const user_category_count = (await getDoc(userRef)).data()["category_history"];
    const user_read_count = (await getDoc(userRef)).data()["read_count"];
    const today = getCurrentDate();

    // If article is already in user's article history, do nothing
    const user_article_history = (await getDoc(userRef)).data()["article_history"];
    if (user_article_history.includes(articleId)) {
        return;
    }

    let new_read_count = 0;
    let new_category_count = 0;

    // Check if user has read_count, if not, create one
    if (!user_read_count || !user_read_count[today]) {
        new_read_count = 1;
    } else {
        new_read_count = user_read_count[today] + 1;
    }

    // Check if user has category_history, if not, create one
    if (!user_category_count || !user_category_count[category]) {
        new_category_count = 1;
    } else {
        new_category_count = user_category_count[category] + 1;
    }

    // Else, update the article_history, category_history and read_count
    await updateDoc(userRef, {
        article_history: arrayUnion(articleId),
        category_history: {
            ...user_category_count,
            [category]: new_category_count
        },
        read_count: {
            ...user_read_count,
            [today]: new_read_count
        }
    });

    // Update article's view_count
    const articleRef = doc(db, "articles", articleId);
    const article_view_count = (await getDoc(articleRef)).data()["view_count"];
    let new_view_count = 1;

    if (article_view_count) {
        new_view_count = article_view_count + 1;
    }

    await updateDoc(articleRef, {
        view_count: new_view_count
    });
}

// Get user's read count for today
export async function getUserReadCountToday(userId) {
    const userRef = doc(db, "users", userId);
    const user_read_count = (await getDoc(userRef)).data()["read_count"];
    const today = getCurrentDate();

    if (!user_read_count || !user_read_count[today]) {
        return 0;
    } else {
        return user_read_count[today];
    }
}

// Get user's read counts for n days (starting from today)
// Returns list of [date, read_count] pairs
export async function getUserReadCountNDays(userId, n) {
    const userRef = doc(db, "users", userId);
    const user_read_count = (await getDoc(userRef)).data()["read_count"];
    const read_count_n_days = [];

    for (let i = 0; i < n; i++) {
        const currDate = new Date();
        currDate.setDate(currDate.getDate() - i);
        const currDateString = convertDateToString(currDate);
        const currDateDDMM = convertDateToDDMM(currDate);
        if (!user_read_count || !user_read_count[currDateString]) {
            read_count_n_days.push([currDateDDMM, 0]);
        } else {
            read_count_n_days.push([currDateDDMM, user_read_count[currDateString]]);
        }
    }

    const output = read_count_n_days.reverse();
    return output;
}

// Get user's read total for n days (starting from today)
export async function getUserReadTotalNDays(userId, n) {
    const userRef = doc(db, "users", userId);
    const user_read_count = (await getDoc(userRef)).data()["read_count"];
    let read_total_n_days = 0;

    for (let i = 0; i < n; i++) {
        const currDate = new Date();
        currDate.setDate(currDate.getDate() - i);
        const currDateString = convertDateToString(currDate);
        if (!user_read_count || !user_read_count[currDateString]) {
            read_total_n_days += 0;
        } else {
            read_total_n_days += user_read_count[currDateString];
        }
    }

    return read_total_n_days;
}

// Add user to user collection with empty chat list
export async function addUserIfNotExist(userId) {
    const userRef = doc(db, "users", userId);

    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        await setDoc(userRef, {
            articleHistory: []
        });
    }
}

// Add messageID to the messages array in the chats document
export async function addMessageIdToChat(chatId, messageId) {
    const chatRef = doc(db, "chats", chatId);

    await updateDoc(chatRef, {
        messages: arrayUnion(messageId)
    });
}

// Add message to the messages collection with id generated by firebase and return the id
export async function addMessage(message, chatId) {
    const messageRef = await addDoc(collection(db, "messages"), message);

    // Add message id to the chat
    await addMessageIdToChat(chatId, messageRef.id);

    return messageRef.id;
}

// Add chat
export async function addChat(chatToStore, articleId, newChatId, userId) {
    const chatRef = doc(db, "chats", newChatId);

    const docSnap = await getDoc(chatRef);

    if (!docSnap.exists()) {
        // Add chat id to the user
        await addArticleIdToUser(userId, articleId);


        await setDoc(doc(db, "chats", newChatId), chatToStore);
    }
}

// Get a chat object
export async function getChat(chatId) {
    const docRef = doc(db, "chats", chatId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

// Get a message object
export async function getMessage(messageId) {
    const docRef = doc(db, "messages", messageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

// CAUTION: This returns a list of article IDs. To get the chat ID u have to do userId + articleId
export async function getChatIdList(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (Array.isArray(docSnap.data().chats)) {
        return docSnap.data().chats.map(currChat => {
            return currChat
        });
    } else {
        return [];
    }
}

// Get message list for chatID
export async function getMessageList(chatId) {
    const docRef = doc(db, "chats", chatId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data().messages;
    } else {
        return [];
    }
}



// Checks if an article conversation exists in the database, given a user and an article
export async function doesArticleChatExist(articleChatId) {
    const docRef = doc(db, "article_chats", articleChatId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

// Creates a new article chat
export async function createNewArticleChat(uid, articleId, articleChatId) {
    await setDoc(doc(db, "article_chats", articleChatId), {
        uid: uid,
        article_id: articleId,
        message_history: [],
        timestamp: serverTimestamp(),
    });
}


// Stores a new message being sent by the user
// Returns the updated list of messages
export async function storeArticleChatMessage(articleChatId, message, givenRole) {
    //Retrieve article chat information
    const articleChatRef = doc(db, "article_chats", articleChatId);
    const articleChatSnap = await getDoc(articleChatRef);
    const articleChatSnapData = articleChatSnap.data();


    //Add a new message instance into article messages
    const messagesDocRef = await addDoc(collection(db, "article_messages"), {
        content: message,
        role: givenRole,
        datetime: serverTimestamp(),
        article_chat_id: articleChatId
    });


    //Update article chat to indicate that there is at least a message in the history
    if (!articleChatSnapData.hasMessage) {
        await updateDoc(articleChatRef, {
            hasMessage: true
        });
    }


    //Update article chat timestamp
    await updateDoc(articleChatRef, {
        datetime: serverTimestamp(),
    });


    return fetchArticleChatHistory(articleChatId);

}

//Fetch list of article chat history based on user chat id
//Each article chat history is returned in the form of an article message instance, i.e. a map with the relevant fields stated in Firestore
export async function fetchArticleChatHistory(articleChatId) {
    //Retrieve article chat message history
    const messagesCollection = collection(db, "article_messages");
    const querySnapshot = await getDocs(query(messagesCollection, where("article_chat_id", "==", articleChatId)));
    const matchingDocuments = [];
    querySnapshot.forEach((doc) => {
        matchingDocuments.push(doc.data());
    });

    //Sort messages in ascending order of datetime
    matchingDocuments.sort((messageOne, messageTwo) => messageOne.datetime - messageTwo.datetime);

    return matchingDocuments;

}


//Check if user has an existing general chat. If yes, return general chat id.
//Else, creates a new general chat instance for the user
let isCreatingGeneralChat = false;
export async function checkOtherwiseCreateGeneralChat(uid) {

    if (isCreatingGeneralChat) {
        return null;

    }

    try {
        isCreatingGeneralChat = true;
        const generalChatsCollection = collection(db, "general_chats")
        const queryMade = query(generalChatsCollection, where("uid", "==", uid));
        const querySnapshot = await getDocs(queryMade);


        if (!querySnapshot.empty) {
            //General chat exists. Just return id.
            return querySnapshot.docs[0].id;
        } else {
            //General chat does not exist. Create it, and return the id of the new chat
            const chatDocRef = await addDoc(collection(db, "general_chats"), {
                uid: uid,
                hasMessage: false
            });
            return chatDocRef.id
        }
    } finally {
        isCreatingGeneralChat = false;
    }

}

//Fetch list of general chat history based on general chat id
//Each item in the list is returned in the form of a general message instance, i.e. a map with the relevant fields in GENERAL_MESSAGE
//Fetch list of article chat history based on user chat id
//Each article chat history is returned in the form of an article instance, i.e. a map with the relevant fields stated in Firestore
export async function fetchGeneralChatHistory(generalChatId) {
    //Retrieve general chat message history
    const messagesCollection = collection(db, "general_messages");
    const querySnapshot = await getDocs(query(messagesCollection, where("general_chat_id", "==", generalChatId)));
    const matchingDocuments = [];
    querySnapshot.forEach((doc) => {
        matchingDocuments.push(doc.data());
    });

    //Sort messages in ascending order of datetime
    matchingDocuments.sort((messageOne, messageTwo) => messageOne.datetime - messageTwo.datetime);

    return matchingDocuments;

}


// Stores a new general chat message into the database, updating the associated
// general chat instance
export async function storeGeneralChatMessage(generalChatId, message, givenRole) {
    //Retrieve general chat information
    const generalChatRef = doc(db, "general_chats", generalChatId);
    const generalChatSnap = await getDoc(generalChatRef);
    const generalChatSnapData = generalChatSnap.data();


    //Add a new message instance into general messages
    const messagesDocRef = await addDoc(collection(db, "general_messages"), {
        content: message,
        role: givenRole,
        datetime: serverTimestamp(),
        general_chat_id: generalChatId
    });


    //Update general chat to indicate that there is at least a message in the history
    if (!generalChatSnapData.hasMessage) {
        await updateDoc(generalChatRef, {
            hasMessage: true
        });
    }

    return fetchGeneralChatHistory(generalChatId);

}


//Fetch
export async function getListOfArticleChatHistory(userId) {
    //Retrieve article chat collection
    const articleChatsCollection = collection(db, "article_chats");

    //Fetch all article chats of the user where there is at least one message sent in the chat
    //Arrange them from latest to oldest chat
    const querySnapshot = await getDocs(query(articleChatsCollection, where("uid", "==", userId), where("hasMessage", "==", true), orderBy("datetime", "desc")));
    const matchingDocuments = querySnapshot.docs.map((doc) => doc.data());




    //Get corresponding article IDs
    const articleIds = [...new Set(matchingDocuments.map((doc) => doc.article_id))];

    //Prepare for output
    const output = [];

    await Promise.all(articleIds.map(async (articleId) => {
        const articleDocRef = doc(collection(db, "articles"), articleId);
        const articleDocSnapshot = await getDoc(articleDocRef);
        if (articleDocSnapshot.exists()) {
            const articleData = articleDocSnapshot.data();

            //Get date time of chat associated with this article
            const articleChatsForArticle = matchingDocuments.filter(
                (doc) => doc.article_id === articleId
            );

            //Add to output
            articleChatsForArticle.forEach((articleChat) => {
                output.push({
                    ...articleData,
                    datetimeOfChat: articleChat.datetime.toDate(), // Combine datetime field
                });
            });
        }
    }));

    return output;

}