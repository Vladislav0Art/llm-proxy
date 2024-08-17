import { BaseLlmProvider, LlmChatMessage, StreamWrapper } from "@llm-proxy/core"


export class OpenAiLlmProvider extends BaseLlmProvider {
    sendMessages(messages: LlmChatMessage[]): StreamWrapper {
        throw new Error("Method not implemented.");
    }
    countMessagesTokens(messages: LlmChatMessage[]): number {
        throw new Error("Method not implemented.");
    }
    countTextTokens(text: string): number {
        throw new Error("Method not implemented.");
    }
    getTokenLimit(): number {
        throw new Error("Method not implemented.");
    }
}