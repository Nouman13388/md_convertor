import React from "react";

function Preview({ data }) {
  const createGrid = (data) => {
    let html = data.replace(/\[r\]/g, "<tr>").replace(/\[\/r\]/g, "</tr>");

    html = html.replace(/\[h\]/g, "<th>").replace(/\[\/h\]/g, "</th>");

    html = html.replace(/\[c\]/g, "<td>").replace(/\[\/c\]/g, "</td>");

    return `<table class="table-grid">${html}</table>`;
  };

  const transformedData = createGrid(data);

  return (
    <div className="preview">
      <div dangerouslySetInnerHTML={{ __html: transformedData }}></div>
    </div>
  );
}

export default Preview;
