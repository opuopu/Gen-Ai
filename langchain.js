import * as z from 'zod';
// npm install @langchain/anthropic to call the model
import { createAgent, tool } from 'langchain';

const getWeather = tool(({ city }) => `It's always sunny in ${city}!`, {
  name: 'get_weather',
  description: 'Get the weather for a given city',
  schema: z.object({
    city: z.string(),
  }),
});

async function main() {
  // If the Anthropic API key isn't set, avoid instantiating an Anthropic model
  // (which would throw) and use a local fallback for development/demo purposes.
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      'Anthropic API key not found. Using local fallback (no external API call).'
    );

    // Local fallback: directly return the canned response for the demo input
    // (don't assume internal properties of `tool` objects).
    console.log("It's always sunny in Tokyo!");
    return;
  }

  const agent = createAgent({
    model: 'claude-sonnet-4-5-20250929',
    tools: [getWeather],
  });

  const result = await agent.invoke({
    messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
  });

  console.log(result);
}

main().catch(err => {
  console.error('Error running agent:', err);
  process.exit(1);
});
