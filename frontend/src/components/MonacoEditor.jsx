import Editor from "@monaco-editor/react";

const languageMap = {
  html: "html",
  css: "css",
  js: "javascript",
};

export default function MonacoEditor({ tab, value, onChange }) {
  const language = languageMap[tab] || "html";

  return (
    <div className="monaco-editor-wrapper">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(val) => onChange(val)}
      />
    </div>
  );
}
