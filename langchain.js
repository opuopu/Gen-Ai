// npm install langchain @langchain/openai zod
// Set your API key in terminal: export OPENAI_API_KEY=your-key-here
import { ChatOpenAI } from '@langchain/openai';
import { createAgent, tool } from 'langchain';
import * as z from 'zod';

const getWeather = tool(({ city }) => `It's always sunny in ${city}!`, {
  name: 'get_weather',
  description: 'Get the weather for a given city',
  schema: z.object({
    city: z.string().describe('The city to get weather for'),
  }),
});

async function main() {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
  });

  const agent = createAgent({
    model,
    tools: [getWeather],
  });

  const result = await agent.invoke({
    messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
  });

  console.log(result.messages);
}

main().catch(err => {
  console.error('Error running agent:', err);
  process.exit(1);
});
