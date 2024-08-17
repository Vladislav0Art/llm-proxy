import { describe, it } from 'vitest';
import { ExampleLlmProvider } from '../examples/llm/ExampleLlmProvider';
import { AiChat, UserLlmChatMessage } from '@llm-proxy/core';
import { OpenAiLlmProvider } from '@llm-proxy/openai';


describe('LLM', () => {
  it('ExampleLlmProvider', async () => {
    await new Promise<void>(async (resolve, reject) => {
      const provider = new ExampleLlmProvider();
      const wrapper = await provider.sendMessages([
        new UserLlmChatMessage('Hello, world!'),
        new UserLlmChatMessage('Testing responses'),
        new UserLlmChatMessage('Final message'),
      ]);

      wrapper.data((chunk) => {
          console.log(`Chunk: '${chunk}'`);
        }).end(() => {
          console.log("Ended!");
          resolve();
        }).error((error) => reject(error));
    });
  });

  it('AiChat', async () => {
    await new Promise<void>(async (resolve, reject) => {
      const provider = new ExampleLlmProvider();
      const chat = AiChat.create(provider).withConfig({
        systemPrompt: "Hello, World!",
        preserveHistory: true,
      });

      const wrapper = await chat.send({
        message: 'First message!',
      });

      wrapper
        .data(chunk => console.log(chunk))
        .end(() => resolve());
    });
  });

  it('OpenAI & AiChat', async () => {
    const provider = new OpenAiLlmProvider({
      token: "TOKEN",
      model: "gpt-4o",
    });

    const chat = AiChat.create(provider).withConfig({
      systemPrompt: "You must reply with 'Roger that!' as your first response to the first user message.",
      preserveHistory: true,
    });

    const wrapper = await chat.send({ message: 'Hello! Help me with my home assignment!' });

    const response = await new Promise<string>((res, rej) => {
      const response: string[] = [];

      wrapper
        .data(chunk => response.push(chunk))
        .end(() => res(response.join("")))
        .error(() => rej());
    });

    console.log(response);
  }, -1);
});