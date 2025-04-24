function Editor({ onChange }) {
  return (
    <div className="editor">
      <h1>Text Editor</h1>
      <textarea onChange={onChange} placeholder="Enter Text..." />
    </div>
  );
}

export default Editor;
