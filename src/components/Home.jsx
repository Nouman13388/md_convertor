import { useState } from "react";
import Editor from "./Editor";
import Preview from "./Preview";

function Home() {
  const [text, setText] = useState("");
  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleData = () => {

    const lines = text.split("\n");
    console.log('Before processing',lines)

    const processedLines = lines.map((line) => {
      if (line.startsWith("######"))
        return "<h6>" + line.substring(6) + "</h6>";
      if (line.startsWith("#####")) return "<h5>" + line.substring(5) + "</h5>";
      if (line.startsWith("####")) return "<h4>" + line.substring(4) + "</h4>";
      if (line.startsWith("###")) return "<h3>" + line.substring(3) + "</h3>";
      if (line.startsWith("##")) return "<h2>" + line.substring(2) + "</h2>";
      if (line.startsWith("#")) return "<h1>" + line.substring(1) + "</h1>";
      if (line.startsWith("**") && line.endsWith("**")) {
        return "<p><b>" + line.substring(2, line.length - 2) + "</b></p>";
      }
      if (line.startsWith("*") && line.endsWith("*")) {
        return "<p><i>" + line.substring(1, line.length - 1) + "</i></p>";
      }
      if (line.startsWith("[")) {
        const linkText = line.substring(1, line.indexOf("]"));
        const url = line.substring(line.indexOf("(") + 1, line.indexOf(")"));
        return `<a href="${url}" target="_blank">${linkText}</a>`;
      }
      if (line.startsWith("![")) {
        const altText = line.substring(2, line.indexOf("]"));
        const url = line.substring(line.indexOf("(") + 1, line.indexOf(")"));
        return `<img src="${url}" alt="${altText}" />`;
      }
      if (line.startsWith("`")) {
        return "<code>" + line.substring(1, line.length) + "</code>";
      }
      if (line) return line;
    });

    console.log('Processed Lines',processedLines);

    return processedLines.join("<br>");
  };

  return (
    <div className="main-layout">
      <Editor onChange={handleChange} />
      <Preview data={handleData} />
    </div>
  );
}

export default Home;
