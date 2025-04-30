import { useState } from "react";
import Editor from "./Editor";
import Preview from "./Preview";
import Navbar from "./Navbar";

const parseHeading = (line) => {
  const levels = [
    { prefix: "###### ", tag: "h6" },
    { prefix: "##### ", tag: "h5" },
    { prefix: "#### ", tag: "h4" },
    { prefix: "### ", tag: "h3" },
    { prefix: "## ", tag: "h2" },
    { prefix: "# ", tag: "h1" },
  ];

  for (let i = 0; i < levels.length; i++) {
    const { prefix, tag } = levels[i];
    if (line.startsWith(prefix)) {
      return `<${tag}>${line.substring(prefix.length)}</${tag}>`;
    }
  }
  return null;
}

const replaceBold = (text) => {
  const start = text.indexOf("**");
  console.log('Staring Index:', start);
  if (start === -1) return text;
  const end = text.indexOf("**", start + 2);
  console.log('Ending Index: ', end)
  if (end === -1) return text;
  return replaceBold(
    text.substring(0, start) +
      `<b> ${replaceBold(text.substring(start + 2, end))} </b>` +
      text.substring(end + 2)
  );
}

const replaceItalic = (text) => {
  const start = text.indexOf("*");
  console.log('Staring Index:', start);
  if (start === -1) return text;
  const end = text.indexOf("*", start + 1);
  console.log('Ending Index: ', end)
  if (end === -1) return text;
  return replaceItalic(
    text.substring(0, start) +
      `<i> ${replaceItalic(text.substring(start + 1, end))} </i>` +
      text.substring(end + 1)
  );
}

const replaceImage = (text) => {
  const start = text.indexOf("![");
  if (start === -1) return text;
  const altEnd = text.indexOf("]", start + start.length);
  if (altEnd === -1) return text;
  if (text.charAt(altEnd + 1) !== "(") return text;
  const srcEnd = text.indexOf(")", altEnd + 2);
  if (srcEnd === -1) return text;
  const alt = text.substring(start + 2, altEnd);
  const src = text.substring(altEnd + 2, srcEnd);
  return replaceImage(
    text.substring(0, start) +
      `<img src="${src}" alt="${alt}" />` +
      text.substring(srcEnd + 1)
  );
}

const replaceLink = (text) => {
  const start = text.indexOf("[");
  if (start === -1) return text;
  const end = text.indexOf("]", start);
  if (end === -1) return text;
  if (text.charAt(end + 1) !== "(") return text;
  const srcEnd = text.indexOf(")", end + 2);
  if (srcEnd === -1) return text;
  const linkText = text.substring(start + 1, end);
  const href = text.substring(end + 2, srcEnd);
  return replaceLink(
    text.substring(0, start) +
      `<a href="${href}" target="_blank">` +
      replaceLink(linkText) +
      `</a>` +
      text.substring(srcEnd + 1)
  );
}

const parseInline = (line) => {
  let processed = line;
  processed = replaceBold(processed);
  processed = replaceItalic(processed);
  processed = replaceImage(processed);
  processed = replaceLink(processed);
  return processed;
}

const parseMdToHtml = (text) => {
  return text
    .split("\n")
    .map((line) => {
      const heading = parseHeading(line);
      const inline = parseInline(line);
      console.log(heading || `<p>${inline}</p>`);
      return heading || `<p>${inline}</p>`;
    })
    .join("<br>");
}

function Home() {
  const [data, setData] = useState("");

  const handleText = (e) => {
    setData(parseMdToHtml(e.target.value));
  };

  return (
    <>
      <Navbar />
      <div className="main-layout">
        <Editor updateText={handleText} />
        <Preview data={data} />
      </div>
    </>
  );
}

export default Home;
