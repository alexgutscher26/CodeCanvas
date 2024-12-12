import type { editor, Uri } from 'monaco-editor';

// Safe wrapper for Monaco editor functions
class MonacoEditorWrapper {
  private static instance: typeof editor | null = null;

  static async getEditor() {
    if (typeof window === 'undefined') return null;
    
    if (!this.instance) {
      const monaco = await import('monaco-editor');
      this.instance = monaco.editor;
    }
    return this.instance;
  }

  static async getModelMarkers(params: { resource: Uri }) {
    const editor = await this.getEditor();
    if (!editor) return [];
    return editor.getModelMarkers(params);
  }

  static async onDidChangeMarkers(callback: (uris: Uri[]) => void) {
    const editor = await this.getEditor();
    if (!editor) return { dispose: () => {} };
    return editor.onDidChangeMarkers(callback);
  }

  static get MarkerSeverity() {
    return {
      Error: 8,
      Warning: 4,
      Info: 2,
      Hint: 1
    };
  }
}

export const { getModelMarkers, onDidChangeMarkers, MarkerSeverity } = MonacoEditorWrapper; 