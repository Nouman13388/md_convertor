function Editor({ updateText }) {
  return (
    <div className="editor">
      <h1>Text Editor</h1>
      <textarea onChange={updateText} placeholder="Enter Text..." />
    </div>
  );
}

export default Editor;
