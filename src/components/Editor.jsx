function Editor({ onUpdateText }) {
  return (
    <div className="editor">
      <h1>Text Editor</h1>
      <textarea onChange={onUpdateText} placeholder="Enter Text..." />
    </div>
  );
}

export default Editor;
