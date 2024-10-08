export enum LlmChatMessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export class LlmChatMessage {
  readonly role: LlmChatMessageRole;
  readonly content: string;

  protected constructor(role: LlmChatMessageRole, content: string) {
    this.role = role;
    this.content = content;
  }
}

export class UserLlmChatMessage extends LlmChatMessage {
  constructor(content: string) {
    super(LlmChatMessageRole.USER, content);
  }
}

export class AssistantLlmChatMessage extends LlmChatMessage {
  constructor(content: string) {
    super(LlmChatMessageRole.ASSISTANT, content);
  }
}

export class SystemLlmChatMessage extends LlmChatMessage {
  constructor(content: string) {
    super(LlmChatMessageRole.SYSTEM, content);
  }
}