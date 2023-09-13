import { OpenAI } from 'openai';

// Documentation for OpenAI API: https://github.com/openai/openai-node
// https://platform.openai.com/docs/api-reference/chat/create
// https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb

// I am not sure what is the best way to set the API key in environment file up, didnt find the answer for this online yet
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

async function generatePrompts(engine, prompt, recipe) {
  const response = await openai.chat.completions.create({
    model: engine,
    messages: [{
      role: "system",
      content: recipe,
    }, {
      role: "user",
      content: prompt
    }],
    max_tokens: 256,
    temperature: 0.5
  });

  console.log(response);

  return response.choices[0].message.content;
}

export { generatePrompts };