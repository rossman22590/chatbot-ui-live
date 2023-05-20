import { ChatBody, Conversation } from '@chatbot-ui/core/types/chat';

export const sendChatRequest = async (
  conversation: Conversation,
  apiKey: string,
) => {
  const chatBody: ChatBody = {
    model: conversation.model,
    messages: conversation.messages,
    key: apiKey,
    prompt: conversation.prompt,
    temperature: conversation.temperature,
  };
  let body = JSON.stringify(chatBody);
  const controller = new AbortController();
  const response = await fetch('api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
    body,
  });

  return { response: response, controller: controller };
};
