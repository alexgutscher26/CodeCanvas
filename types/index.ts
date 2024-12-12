import { editor } from "monaco-editor";

export interface Theme {
  id: editor.BuiltinTheme;
  label: string;
  color: string;
}
