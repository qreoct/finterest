
import {
    collection,
    onSnapshot,
    query,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    orderBy,
    Timestamp,
    runTransaction,
    where,
    addDoc,
    arrayUnion,
    FieldValue,
} from "firebase/firestore";

import { db } from "@/config/firebase.config.js";

export async function addNewArticle(
    articleId,
    article
) {
    const articleToStore = {
        article_id: articleId,
        title: article.title,
        link: article.link,
        creator: article.creator,
        image_url: article.image_url,
        description: article.description,
        content: article.content,
        pubDate: (new Date(article.pubDate)).getTime(),
        source_id: article.source_id,
        category: article.category,
        dateStored: (new Date()).getTime(),
    }

    // Add article to database
    await setDoc(doc(db, "articles", articleId), articleToStore);
}

// Returns a list of article id strings
export async function getArticleIdList() {
    const q = query(collection(db, "articles"), orderBy("dateStored", "desc"));
    const results = await getDocs(q);

    return results.docs.map(currDoc => {
        return currDoc.id;
    });
}

// Returns a personalised list of article id strings based on user's category history
// Use naive bayes approach to recommend articles according to a probability distribution based on user's category history
export async function getPersonalisedArticleIdList(userId, numArticles) {
    const userRef = doc(db, "users", userId);
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
    const all_categories = ["business", "world", "top", "technology"]; // Maybe change this to a global variable in newsfetcher
    all_categories.forEach(currCategory => {
        if (!user_category_count[currCategory]) {
            user_category_count[currCategory] = 1;
            user_article_count += 1;
        }
    });

    // Calculate the probability of each category
    const category_prob = {};
    for (const [key, value] of Object.entries(user_category_count)) {
        category_prob[key] = value / user_article_count;
    }

    // Filter out all articles that the user has read
    const user_article_history = (await getDoc(userRef)).data()["article_history"];
    const q = query(collection(db, "articles"), orderBy("dateStored", "desc"));
    const results = await getDocs(q);
    console.warn(results.docs.length);
    const user_article_history_set = new Set(user_article_history);
    let filtered_articles = results.docs.filter(currDoc => {
        return !user_article_history_set.has(currDoc.id);
    });

    // Iterate through all articles and add to articleIdList based on probability until numArticles is reached
    const articleIdList = [];
    filtered_articles.forEach(currDoc => {
        const currArticle = currDoc.data();
        const currArticleCategory = currArticle.category[0];
        const currArticleProb = category_prob[currArticleCategory];
        const randNum = Math.random();
        if (randNum < currArticleProb) {
            articleIdList.push(currArticle.article_id);
        }
    });

    console.warn(articleIdList.length);

    return articleIdList.slice(0, numArticles);
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

// Update user's article history and category history
export async function updateUserHistory(userId, articleId) {
    const userRef = doc(db, "users", userId);
    const category = (await getArticle(articleId)).category[0];
    const user_category_count = (await getDoc(userRef)).data()["category_history"];
    // Check if user has category_history, if not, create one
    if (!user_category_count) {
        await updateDoc(userRef, {
            article_history: arrayUnion(articleId),
            category_history: {
                [category]: 1
            }
        });
        return;
    }
    // Else, update the category_history
    if (!user_category_count[category]) {
        await updateDoc(userRef, {
            chats: arrayUnion(articleId),
            article_history: arrayUnion(articleId),
            // Add new category to user's category_history
            category_history: {
                ...user_category_count,
                [category]: 1
            }
        });
        return;
    }
    await updateDoc(userRef, {
        chats: arrayUnion(articleId),
        article_history: arrayUnion(articleId),
        category_history: {
            ...user_category_count,
            [category]: user_category_count[category] + 1
        }
    });
}

// Add user to user collection with empty chat list
export async function addUserIfNotExist(userId) {
    console.log("ADDING USER");
    const userRef = doc(db, "users", userId);

    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        await setDoc(userRef, {
            chats: []
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