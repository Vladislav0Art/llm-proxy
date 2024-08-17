import { describe, it } from 'vitest';
import { ExampleLlmProvider } from '../examples/llm/ExampleLlmProvider';
import { UserLlmChatMessage, AiChat } from '@llm-proxy/core';


describe('LLM', () => {
  it('ExampleLlmProvider', async () => {
    await new Promise<void>((resolve, reject) => {
      const provider = new ExampleLlmProvider();
      const wrapper = provider.sendMessages([
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
    await new Promise<void>((resolve, reject) => {
      const provider = new ExampleLlmProvider();
      const chat = AiChat.create(provider).withConfig({
        systemPrompt: "Hello, World!",
        preserveHistory: true,
      });

      const wrapper = chat.send({
        message: 'First message!',
      });

      wrapper
        .data(chunk => console.log(chunk))
        .end(() => resolve());
    });
  });
});