import React from "react";

function Preview({ data }) {
  return (
    <div className="preview">
      <h1>Live Preview</h1>
      <div dangerouslySetInnerHTML={{ __html: data}}></div>
    </div>
  );
}

export default Preview;
