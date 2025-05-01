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
      const content = line.slice(prefix.length);
      return `<${tag}>${content}</${tag}>`;
    }
  }

  return null;
};

const parseInline = (line) => {
  let processed = line;
  processed = replaceBold(processed);
  processed = replaceItalic(processed);
  processed = replaceImage(processed);
  processed = replaceLink(processed);
  console.log("Processed Line: ", processed);
  return processed;
};

const replaceBold = (text) => {
  let result = "";
  let stack = [];
  let i = 0;
  let starting_index,
    closing_index = 0;

  while (i < text.length) {
    if (text[i] === "*" && text[i + 1] === "*") {
      if (stack.length > 0 && stack[stack.length - 1] === "**") {
        result += "</b>";
        let temp_result = result.split("");
        temp_result.splice(starting_index, 2, "<b>");
        result = temp_result.join("");
        console.log("Result Before pop: ", result);
        closing_index = i;
        console.log("Closing Index: ", closing_index);
        console.log("Data in Closing Index: ", text[closing_index]);
        stack.pop();
        console.log("Stack after pop: ", stack);
      } else {
        console.log("Result Before push: ", result);
        stack.push("**");
        result += text[i] + text[i + 1];
        starting_index = i;
        console.log("Result After push: ", result);
        console.log("Stack after push: ", stack);
      }
      i += 2;
    } else {
      result += text[i];
      i++;
    }
  }

  console.log("Total Iterations (Bold): ", i);
  console.log("Total Lenght of String (Bold): ", text.length);

  return result;
};

const replaceItalic = (text) => {
  let result = "";
  let stack = [];
  let i = 0;
  let starting_index,
    closing_index = 0;

  while (i < text.length) {
    if (text[i] === "*" && text[i + 1] !== "*") {
      if (stack.length > 0 && stack[stack.length - 1] === "*") {
        result += "</i>";
        let temp_result = result.split("");
        temp_result.splice(starting_index, 1, "<i>");
        result = temp_result.join("");
        closing_index = i;
        console.log("Closing Index: ", closing_index);
        console.log("Data in Closing Index: ", text[closing_index]);
        stack.pop();
        console.log("Stack after pop: ", stack);
      } else {
        // result += "<i>";
        stack.push("*");
        result += text[i];
        starting_index = i;
        console.log("Result After push: ", result);
        console.log("Stack after push: ", stack);
      }
      i++;
    } else {
      result += text[i];
      i++;
    }
  }

  console.log("Total Iterations (Italic): ", i);
  console.log("Total Lenght of String (Italic): ", text.length);

  return result;
};

const replaceLink = (text) => {
  let result = "";
  let i = 0;
  let stack = [];

  while (i < text.length) {
    if (text[i] === "[") {
      const textStart = i + 1;
      const textEnd = text.indexOf("]", textStart);

      if (text[textEnd + 1] !== "(") {
        result += text[i];
        i++;
        continue;
      }

      const hrefStart = textEnd + 2;
      const hrefEnd = text.indexOf(")", hrefStart);

      if (hrefEnd === -1) {
        result += text[i];
        i++;
        continue;
      }

      const label = text.slice(textStart, textEnd);
      const href = text.slice(hrefStart, hrefEnd);

      if (stack.length > 0 && stack[stack.length - 1] === "link") {
        result += `</a>`;
        stack.pop();
      } else {
        result += `<a href="${href}" target="_blank">${label}</a>`;
        stack.push("link");
      }

      i = hrefEnd + 1;
    } else {
      result += text[i];
      i++;
    }
  }

  return result;
};

const replaceImage = (text) => {
  let result = "";
  let i = 0;
  let stack = [];

  while (i < text.length) {
    if (text[i] === "!" && text[i + 1] === "[") {
      const altStart = i + 2;
      const altEnd = text.indexOf("]", altStart);

      if (text[altEnd + 1] !== "(") {
        result += text[i];
        i++;
        continue;
      }

      const srcStart = altEnd + 2;
      const srcEnd = text.indexOf(")", srcStart);

      if (srcEnd === -1) {
        result += text[i];
        i++;
        continue;
      }

      const alt = text.slice(altStart, altEnd);
      const src = text.slice(srcStart, srcEnd);

      if (stack.length > 0 && stack[stack.length - 1] === "image") {
        result += `</img>`;
        stack.pop();
      } else {
        result += `<img src="${src}" alt="${alt}" />`;
        stack.push("image");
      }

      i = srcEnd + 1;
    } else {
      result += text[i];
      i++;
    }
  }

  return result;
};

const parseMdToHtml = (text) => {
  return text
    .split("\n")
    .map((line) => {
      const heading = parseHeading(line);
      if (heading) {
        return heading;
      }

      const inline = parseInline(line);
      return `<p>${inline}</p>`;
    })
    .join("");
};

function Home() {
  const [data, setData] = useState("");

  const handleText = (e) => {
    const html = parseMdToHtml(e.target.value);
    setData(html);
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
