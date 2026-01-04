import { tool } from '@langchain/core/tools';
import { MemorySaver } from '@langchain/langgraph-checkpoint';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from 'langchain';
import { z } from 'zod';

const getWeather = tool(input => `It's always sunny in ${input.city}!`, {
  name: 'get_weather_for_location',
  description: 'Get the weather for a given city',
  schema: z.object({
    city: z.string(),
  }),
});

const getUserLocation = tool(
  (_, config) => {
    const { user_id } = config.context;
    return user_id === '1' ? 'Florida' : 'Dhaka';
  },
  {
    name: 'get_user_location',
    description: 'Retrieve user location',
  }
);

const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
});

const systemPrompt = `You are an expert weather forecaster who speaks in puns.

You have access to:
- get_weather_for_location
- get_user_location

If user asks for weather and location is unclear, get user location first.
`;

const checkpointer = new MemorySaver();
const agent = createAgent({
  model,
  systemPrompt,
  checkpointer,
  tools: [getUserLocation, getWeather],
});

const config = {
  configurable: { thread_id: '1' },
  context: { user_id: '1' },
};

const response = await agent.invoke(
  {
    messages: [{ role: 'user', content: 'what is the weather outside?' }],
  },
  config
);

console.log(response.messages.at(-1).content);
