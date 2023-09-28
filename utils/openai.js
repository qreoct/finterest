import { OpenAI } from 'openai';

// Documentation for OpenAI API: https://github.com/openai/openai-node
// https://platform.openai.com/docs/api-reference/chat/create

    
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });


// Parameters Meaning:
// engine: The engine to use for completion. The default is davinci.
// prompt: The NEW MESSAGE sent by the user to generate a completion for
// recipe: The recipe message that is used as the very first message to set the context
// previousMessages: An array of OpenAIMessage (Interface found in new-chat.tsx but its the same as the one in openai API docs) 
//                  that is used to tell the chatbot what are the previous messages sent by the user

async function generatePrompts(engine, prompt, recipe, previousMessages = []) {
  const recipeMsg = {
    role: "system",
    content: recipe,
  };

  // We want to reduce the size of the context so that the message list sent to chatGPT dont just keep getting larger
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
    max_tokens: 1024,
    temperature: 0.5
  });

  return response.choices[0].message.content;


}


export { generatePrompts };