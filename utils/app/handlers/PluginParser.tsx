import { MutableRefObject } from 'react';

import { InstalledPlugin } from '@/types/plugin';
import { User } from '@chatbot-ui/core/types/auth';
import { Conversation } from '@chatbot-ui/core/types/chat';
import { OpenAIModels } from '@chatbot-ui/core/types/openai';

import { sendChatRequest } from '../chat';

export const handlePluginParse = async (
  user: User,
  operationId: string,
  operationResult: any,
  conversation: Conversation,
  enabledPlugins: InstalledPlugin[],
  stopConversationRef: MutableRefObject<boolean>,
  apiKey: string,
  homeDispatch: React.Dispatch<any>,
) => {
  const systemPrompt = `
  You are an ai model in charge of converting results returned by a plugin's api to human readable content. 

  Another ai model is in charge of sending the api request and you are in charge of parsing the results.


  These are the plugins that the user has enabled the other ai model to use:

  [
    {
      "id": "com.jmenjivar.google",
      "name": "google search plugin",
      "description": "Plugin for searching the internet using google to find answers to questions and retrieve relevant information. Use it whenever a user asks something that might be found on the internet.",
      "paths": {
        "/search": {
          "post": {
            "summary": "Search Google",
            "description": "Does a google search.",
            "operationId": "search",
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "title": "Query",
                    "required": ["query"],
                    "type": "object",
                    "properties": {
                      "query": "string"
                    }
                  }
                }
              },
              "required": true
            }
          }
        }
      }
    }
  ]

  And these are some example results for the plugins. Follow the a similar format for the corresponding plugin when possible.

  [
    {
      "id": "com.jmenjivar.google",
      "examples" : {
        "search": [
          {
            "input": "What's the weather in San Francisco today?",
            "output": "It's 65 degrees and sunny in San Francisco today. [[1]](https://www.google.com/search?q=weather+san+francisco)"
          },
          {
            "input": "How's the weather in San Francisco for tomorrow?",
            "output": "It's going to be 70 degrees and sunny in San Francisco tomorrow. [[1]](https://www.google.com/search?q=weather+san+francisco)"
          }
        ]
      }
    }
  ]

  Cite your sources when possible. If you can't find a source, just say "I don't know" or "I can't find a source for that".
  `;

  const completeLog = `
  Calling ${operationId}.

  Result:
  ${JSON.stringify(operationResult)}
  `;

  const messages = conversation.messages;
  const length = messages.length;
  messages[length - 1].content = JSON.stringify(completeLog);

  const customConversation: Conversation = {
    id: conversation.id,
    model: OpenAIModels['gpt-3.5-turbo'],
    name: 'Plugin Parser',
    temperature: 0.1,
    messages: messages,
    prompt: systemPrompt,
    folderId: null,
    timestamp: new Date().toISOString(),
  };

  const { response, controller } = await sendChatRequest(
    customConversation,
    apiKey,
  );

  if (!response.ok) {
    console.log('Error sending parse request');
    return '';
  }
  const data = response.body;
  if (!data) {
    console.log('Error sending parse request');
    return '';
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let text = '';

  console.log(completeLog);

  while (!done) {
    if (stopConversationRef.current === true) {
      controller.abort();
      done = true;
      break;
    }
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    text += chunkValue;

    conversation.messages[length - 1].content = text;

    homeDispatch({
      field: 'selectedConversation',
      value: conversation,
    });
  }

  return text;
};
