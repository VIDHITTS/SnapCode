import Editor from "@monaco-editor/react";

const languageMap = {
  html: "html",
  css: "css",
  js: "javascript",
};

export default function MonacoEditor({ tab, value, onChange }) {
  const language = languageMap[tab] || "html";

  const editorOptions = {
    // Language-specific settings will be added here
  };

  return (
    <div className="monaco-editor-wrapper">
      <Editor
        height="100%"
        defaultLanguage="html"
        language={language}
        value={value}
        onChange={(val) => onChange(val)}
        options={editorOptions}
      />
    </div>
  );
}
