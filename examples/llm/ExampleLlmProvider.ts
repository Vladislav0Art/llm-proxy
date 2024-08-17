import { Readable } from 'stream';
import { LlmChatMessage, StreamWrapper, BaseLlmProvider } from '@llm-proxy/core';


export class ExampleLlmProvider extends BaseLlmProvider {
  constructor() {
    super({ token: "token", model: "model" });
  }

  sendMessages(messages: LlmChatMessage[]): StreamWrapper {
    const stream = new Readable({
      read() {
      }, // No-op, we will push data manually
    });

    // Simulate an API that sends chunks of data over time
    let counter = 0;
    const interval = setInterval(() => {
      if (counter < messages.length) {
        // Simulate sending each message as a chunk
        stream.push(`[Message #${counter + 1}]: Response chunk for message: ${messages[counter].content}\n`);
        counter++;
      } else {
        // End the stream
        stream.push(null);
        clearInterval(interval);
      }
    }, 100); // Simulate receiving chunks every second

    return new StreamWrapper(stream);
  }

  countMessagesTokens(messages: LlmChatMessage[]): number {
    throw new Error('Method not implemented.');
  }

  countTextTokens(text: string): number {
    throw new Error('Method not implemented.');
  }

  getTokenLimit(): number {
    throw new Error('Method not implemented.');
  }

}