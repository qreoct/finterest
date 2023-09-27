import { loadQARefineChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatPromptTemplate, PromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { BufferMemory } from "langchain/memory"
import { ConversationChain } from "langchain/chains"

const openai = new OpenAI ({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,  
  temperature: 0.9,
});

async function refinedarticlefetch(articlePath){
    //article is the file path to the text file that holds its content 

    const embeddings = new OpenAIEmbeddings({openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY});
    const chain = loadQARefineChain(openai);
    
    const loader = new TextLoader(articlePath);
    const docs = await loader.loadAndSplit();
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

    const prompt = `
        I am going to give you content for a news article. The content not only contains the news article, but it also contains also some random gibberish that corresponds to web UI elements found on websites. There is also advertisement content in the news article. I need you to give me the output in a specified format as shown:

        {
        "content": {content},
        "description": {description},
        "content_summary": {content_summary},
        "prompt_one": {prompt_one},
        "prompt_two": {prompt_two}
        }

        Replace {content} with the content of the article, but remove the gibberish, HTML content such as escape characters and advertisement content. Replace {description} with a one-liner description of what the article is about. Replace {content_summary} with a one-paragraph description of the main points of the article. Replace {prompt_one} with a question that a user could have about the article. Place {prompt_two} with another question that a user could have about the article, being distinct from the content you gave for {prompt_one}.

        Now, I will give you the article to process:
    `;
    
    const res = await chain.call({
        input_documents: store,
        prompt,
    })

    return res.output_text

}
export { refinedarticlefetch };


async function aiChat(type, prompt, chain, memory, model){

  //chain is the conversation instance of a user
  //memory is the memory buffer for the particular user
  //https://stackoverflow.com/questions/75965605/how-to-persist-langchain-conversation-memory-save-and-load

  if (type == "article"){
    
    /*
    //to be put under user initialization
    const chatPrompt = ChatPromptTemplate.fromMessages([
      [
      "system",
      "The following is a conversation between a human and an AI, where the AI gives helpful information about the article the human is asking about. The information should be digestible to a person unfamiliar with financial jargon and concepts.",
    ],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
    ]);

    const chain = new new ConversationChain({
      memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
      prompt: chatPrompt,
      llm: model,
    });
    */

    const response = await chain.call({
      input: prompt,
    })
  }
  else if (type == "general"){
    //chat for general
  }
}


async function generatePrompts(engine, prompt, recipe, previousMessages = []) {

    const recipeMsg = {
      role: "system",
      content: recipe,
    };
  
    // We want to reduce the size of the context so that the message list set to chatGPT dont just keep getting larger
    let context = [recipeMsg];
    context = context.concat(previousMessages.slice(-9));
  
    // Get the rightmost 9 elements from the previousMessages array and add it into context array in the same order
    // for (let i = 1 + previousMessages.length - 10; i < Math.min(previousMessages.length, 10) + previousMessages.length - 10; i++) {
    //   if (previousMessages[i]) {
    //     context.push(previousMessages[i]);
    //   }
    // }
  
    const newMessage = {
      role: "user",
      content: prompt
    };
  
    context.push(newMessage);
  
    console.log(context);
  
    const response = await openai.chat.completions.create({
      model: engine,
      messages: context,
      max_tokens: 256,
      temperature: 0.5
    });
  
    console.log(response);
  
    return response.choices[0].message.content;
  }
  
  
  export { generatePrompts };