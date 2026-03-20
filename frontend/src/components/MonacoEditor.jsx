import Editor from "@monaco-editor/react";

const languageMap = {
  html: "html",
  css: "css",
  js: "javascript",
};

export default function MonacoEditor({ tab, value, onChange, theme }) {
  const language = languageMap[tab] || "html";
  const monacoTheme = theme === "dark" ? "vs-dark" : "light";

  const editorOptions = {
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    autoClosingTags: true,
    minimap: { enabled: false },
    wordWrap: "on",
    lineNumbers: "on",
    tabSize: 2,
    formatOnPaste: true,
    bracketPairColorization: { enabled: true },
    fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    fontSize: 14,
    fontLigatures: true,
    cursorBlinking: "smooth",
    cursorStyle: "line",
    cursorSmoothCaretAnimation: "on",
  };

  return (
    <div className="monaco-editor-wrapper">
      <Editor
        height="100%"
        defaultLanguage="html"
        language={language}
        theme={monacoTheme}
        value={value}
        onChange={(val) => onChange(val)}
        options={editorOptions}
      />
    </div>
  );
}
