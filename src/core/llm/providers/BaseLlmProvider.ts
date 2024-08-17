import { LlmChatMessage } from './messages/LlmMessages';
import { StreamWrapper } from './StreamWrapper';

export interface LlmConfig {
  token: string;
  model: string;
}

export abstract class BaseLlmProvider {
  protected token: string;
  protected model: string;

  protected constructor({ token, model }: LlmConfig) {
    this.token = token;
    this.model = model;
  }

  abstract sendMessages(messages: LlmChatMessage[]): StreamWrapper<string>;
  abstract countMessagesTokens(messages: LlmChatMessage[]): number;
  abstract countTextTokens(text: string): number;
  abstract getTokenLimit(): number;
}
