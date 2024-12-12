/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompletionItem } from 'vscode-languageserver-types';

export interface AICompletionContext {
  prefix: string;
  line: string;
  lineNumber: number;
  filePath: string;
  language: string;
  precedingCode: string;
  followingCode: string;
}

export interface AICompletionResponse {
  suggestions: CompletionItem[];
}

export async function getAICompletions(context: AICompletionContext): Promise<AICompletionResponse> {
  try {
    console.log('Sending completion request:', context);
    
    const response = await fetch('/api/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(context),
    });

    if (!response.ok) {
      throw new Error(`Failed to get AI completions: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received completion response:', data);
    
    return data;
  } catch (error) {
    console.error('Error getting AI completions:', error);
    return { suggestions: [] };
  }
}
