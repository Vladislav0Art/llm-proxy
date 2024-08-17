import { BaseLlmProvider } from '../providers/BaseLlmProvider';
import { StreamWrapper } from '../providers/StreamWrapper';
import {
  AssistantLlmChatMessage,
  LlmChatMessage,
  SystemLlmChatMessage,
  UserLlmChatMessage,
} from '../providers/messages/LlmMessages';


export interface AiChatConfig {
  systemPrompt: string | null,
  preserveHistory: boolean,
}

export interface SendParams {
  message: string;
}

export class AiChat {
  private static defaultConfig: AiChatConfig = {
    preserveHistory: true,
    systemPrompt: null,
  }

  // members
  private provider: BaseLlmProvider;
  private config: AiChatConfig = AiChat.defaultConfig;

  private _history: LlmChatMessage[] = [];
  private _systemMessage: SystemLlmChatMessage | null = null;

  private constructor(provider: BaseLlmProvider) {
    this.provider = provider;
  }

  withConfig(config: AiChatConfig): AiChat {
    this.config = config;
    if (this.config.systemPrompt !== null) {
      this._systemMessage = new SystemLlmChatMessage(this.config.systemPrompt);
    }
    return this;
  }

  static create(provider: BaseLlmProvider) {
    return new AiChat(provider);
  }

  async send({ message }: SendParams): Promise<StreamWrapper> {
    if (!this.config.preserveHistory) {
      // purge history
      this._history.length = 0;
    }
    this._history.push(new UserLlmChatMessage(message));

    const messages: LlmChatMessage[] = this._systemMessage ?
      [this._systemMessage, ...this._history] : this._history;

    const wrapper = await this.provider.sendMessages(messages);
    const responseChunks: string[] = [];

    wrapper.data((chunk: string) => responseChunks.push(chunk))
      .end(() => {
        // save AI's response in history
        if (this.config.preserveHistory) {
          this._history.push(new AssistantLlmChatMessage(responseChunks.join("")))
        }
      })

    return Promise.resolve(wrapper);
  }

  history(): LlmChatMessage[] {
    return this._history;
  }
}

/*
val provider = new Provider({ token, model })
aiChat = AiChat.create(provider).withParams({
  systemPrompt: "",
  preserveHistory: true,
})

aiChat.send({
  message: "my msg"
})
 */