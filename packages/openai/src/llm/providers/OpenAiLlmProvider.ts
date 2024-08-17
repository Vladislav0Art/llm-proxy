import * as tiktoken from 'tiktoken';
import { TiktokenModel } from 'tiktoken';
import OpenAI from 'openai';
import { BaseLlmProvider, LlmConfig, LlmChatMessage, StreamWrapper, UserLlmChatMessage } from '@llm-proxy/core';
import { Readable } from 'stream';


export class OpenAiLlmProvider extends BaseLlmProvider {
  private openai: OpenAI;

  constructor(config: LlmConfig) {
    super(config);
    this.openai = new OpenAI({
      apiKey: this.token,
    });
  }

  async sendMessages(messages: LlmChatMessage[]): Promise<StreamWrapper> {
    const stream = new Readable({
      read() {}
    });

    const llmResponseStream = await this.openai.chat.completions.create({
      model: this.model,
      messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
      stream: true,
    });

    for await (const chunk of llmResponseStream) {
      // terminate stream
      if (chunk.choices[0]?.finish_reason !== null) {
        stream.push(null);
      }
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        stream.push(content, "utf8");
      }
    }

    return Promise.resolve(new StreamWrapper(stream));
  }

  countMessagesTokens(messages: LlmChatMessage[]): number {
    let enc: tiktoken.Tiktoken | null = null;
    try {
      enc = tiktoken.encoding_for_model(this.model as TiktokenModel);
      return messages
        .map(msg => enc!.encode(msg.content).length)
        .reduce((acc, value) => acc + value, 0);
    }
    finally {
      if (enc) {
        enc.free();
      }
    }
  }

  countTextTokens(text: string): number {
    return this.countMessagesTokens([new UserLlmChatMessage(text)]);
  }

  getTokenLimit(): number {
    // TODO: implement
    throw new Error('Method not implemented.');
  }
}