// TODO: Migrate from textarea to Monaco Editor for better DX
// Monaco will provide syntax highlighting, auto-closing brackets, etc.

export default function UserEditor({ tab, value, onChange }) {
  return (
    <textarea
      className="user-area"
      value={value}
      onChange={onChange}
      placeholder={`Enter ${tab} here...`}
      spellCheck="false"
    />
  );
}
