import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark as SHStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";

const MyJsonComponent = ({ json }: { json: string }) => {
  const [jsonString, setJsonString] = useState(
    `{
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  }
}`,
  );

  const handleJsonChange = (event) => {
    setJsonString(event.target.value);
  };

  return (
    <SyntaxHighlighter
      language="json"
      style={SHStyle}
      customStyle={{ borderRadius: "5px", padding: "10px", fontSize: "14px" }}
      showLineNumbers={true}
      wrapLines={true}
      onChange={handleJsonChange}
      value={json}
      overflowY="auto"
    >
      {json}
    </SyntaxHighlighter>
  );
};

export default MyJsonComponent;
