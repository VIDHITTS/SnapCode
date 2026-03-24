import Editor from "@monaco-editor/react";

const languageMap = {
  html: "html",
  css: "css",
  js: "javascript",
};

function EditorLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "var(--muted-foreground, #888)",
        fontSize: "0.9rem",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          border: "3px solid var(--muted, #333)",
          borderTopColor: "var(--primary, #646cff)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginRight: "8px",
        }}
      />
      Loading editor...
    </div>
  );
}

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
    scrollBeyondLastLine: false,
    smoothScrolling: true,
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
        loading={<EditorLoading />}
      />
    </div>
  );
}
