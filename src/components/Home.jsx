import { useState } from "react";
import Editor from "./Editor";
import Preview from "./Preview";
import Navbar from "./Navbar";

function Home() {
  const [text, setText] = useState("");

  const handleText = (e) => {
    setText(e.target.value);
  };

  const convertInline = (line) => {
    let result = "";
    let i = 0;

    while (i < line.length) {
      if (line[i] === "*" && line[i + 1] === "*") {
        let end = i + 2;
        while (end < line.length - 1) {
          if (line[end] === "*" && line[end + 1] === "*") break;
          end++;
        }

        if (line[end] === "*" && line[end + 1] === "*") {
          const boldText = line.substring(i + 2, end);
          result += `<b>${boldText}</b>`;
          i = end + 2;
          continue;
        }
      }

      if (line[i] === "*") {
        let end = i + 1;
        while (end < line.length) {
          if (line[end] === "*") break;
          end++;
        }

        if (line[end] === "*") {
          const italicText = line.substring(i + 1, end);
          result += `<i>${italicText}</i>`;
          i = end + 1;
          continue;
        }
      }

      if (line[i] === "!" && line[i + 1] === "[") {
        let altStart = i + 2;
        let altEnd = line.indexOf("]", altStart);
        let urlStart = line.indexOf("(", altEnd) + 1;
        let urlEnd = line.indexOf(")", urlStart);

        if (altEnd !== -1 && urlStart !== -1 && urlEnd !== -1) {
          const altText = line.substring(altStart, altEnd);
          const imageUrl = line.substring(urlStart, urlEnd);
          result += `<img src="${imageUrl}" alt="${altText}" />`;
          i = urlEnd + 1;
          continue;
        }
      }

      if (line[i] === "[" && line.indexOf("]", i) !== -1) {
        let textStart = i + 1;
        let textEnd = line.indexOf("]", textStart);
        let urlStart = line.indexOf("(", textEnd) + 1;
        let urlEnd = line.indexOf(")", urlStart);

        if (textEnd !== -1 && urlStart !== -1 && urlEnd !== -1) {
          const linkText = line.substring(textStart, textEnd);
          const linkUrl = line.substring(urlStart, urlEnd);
          result += `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
          i = urlEnd + 1;
          continue;
        }
      }

      result += line[i];
      i++;
    }

    console.log("Result", result);

    return result;
  };

  const handleData = () => {
    const lines = text.split("\n");

    const convertedLines = lines.map((line) => {
      // Headings
      if (line.startsWith("###### "))
        return "<h6>" + line.substring(7) + "</h6>";
      if (line.startsWith("##### "))
        return "<h5>" + line.substring(6) + "</h5>";
      if (line.startsWith("#### ")) return "<h4>" + line.substring(5) + "</h4>";
      if (line.startsWith("### ")) return "<h3>" + line.substring(4) + "</h3>";
      if (line.startsWith("## ")) return "<h2>" + line.substring(3) + "</h2>";
      if (line.startsWith("# ")) return "<h1>" + line.substring(2) + "</h1>";

      //Function to handle inline chracters
      const parsedLine = convertInline(line);

      return "<p>" + parsedLine + "</p>";
    });

    return convertedLines.join("<br>");
  };

  return (
    <>
      <Navbar />
      <div className="main-layout">
        <Editor updateText={handleText} />
        <Preview data={handleData} />
      </div>
    </>
  );
}

export default Home;
