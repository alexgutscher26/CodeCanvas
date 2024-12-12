import { NextResponse } from 'next/server';
import { CompletionItemKind, InsertTextFormat } from 'vscode-languageserver-types';
import { AICompletionContext } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const context: AICompletionContext = await request.json();
    const { prefix, line, language } = context;

    console.log('Completion request:', { prefix, line, language });

    // Generate suggestions based on context
    const suggestions = [];

    // Add language-specific suggestions
    if (language === 'javascript' || language === 'typescript' || language === 'typescriptreact') {
      // React component suggestion
      if (!prefix || prefix.includes('comp') || prefix.includes('react')) {
        suggestions.push({
          label: 'React Component',
          kind: CompletionItemKind.Snippet,
          detail: 'Create a new React functional component',
          documentation: 'Create a new React functional component with props',
          insertText: [
            'function ${1:ComponentName}({ ${2:props} }) {',
            '\treturn (',
            '\t\t<div>',
            '\t\t\t${3}',
            '\t\t</div>',
            '\t);',
            '}'
          ].join('\n'),
          insertTextFormat: InsertTextFormat.Snippet,
          sortText: '0'
        });
      }

      // Console log suggestion
      if (!prefix || prefix.includes('con') || prefix.includes('log')) {
        suggestions.push({
          label: 'console.log',
          kind: CompletionItemKind.Function,
          detail: 'Log output to the console',
          documentation: 'Log output to the console',
          insertText: 'console.log(${1});',
          insertTextFormat: InsertTextFormat.Snippet,
          sortText: '1'
        });
      }

      // Function suggestion
      if (!prefix || prefix.includes('fun') || prefix.includes('function')) {
        suggestions.push({
          label: 'function',
          kind: CompletionItemKind.Snippet,
          detail: 'Create a new function',
          documentation: 'Create a new function',
          insertText: [
            'function ${1:name}(${2:params}) {',
            '\t${3}',
            '}'
          ].join('\n'),
          insertTextFormat: InsertTextFormat.Snippet,
          sortText: '2'
        });
      }

      // Arrow function suggestion
      if (!prefix || prefix.includes('arr') || prefix.includes('=>')) {
        suggestions.push({
          label: 'Arrow Function',
          kind: CompletionItemKind.Snippet,
          detail: 'Create a new arrow function',
          documentation: 'Create a new arrow function',
          insertText: '(${1:params}) => ${2}',
          insertTextFormat: InsertTextFormat.Snippet,
          sortText: '3'
        });
      }

      // useState hook
      if (!prefix || prefix.includes('use') || prefix.includes('state')) {
        suggestions.push({
          label: 'useState',
          kind: CompletionItemKind.Snippet,
          detail: 'React useState hook',
          documentation: 'Declare a new state variable with useState hook',
          insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialState});',
          insertTextFormat: InsertTextFormat.Snippet,
          sortText: '4'
        });
      }

      // useEffect hook
      if (!prefix || prefix.includes('use') || prefix.includes('effect')) {
        suggestions.push({
          label: 'useEffect',
          kind: CompletionItemKind.Snippet,
          detail: 'React useEffect hook',
          documentation: 'Setup side effects with useEffect hook',
          insertText: [
            'useEffect(() => {',
            '\t${1}',
            '}, [${2}]);'
          ].join('\n'),
          insertTextFormat: InsertTextFormat.Snippet,
          sortText: '5'
        });
      }
    }

    console.log('Returning suggestions:', suggestions);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error in completions API:', error);
    return NextResponse.json({ error: 'Failed to generate completions' }, { status: 500 });
  }
}
