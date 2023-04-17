/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
// import "brace/mode/json";
// import "brace/theme/github";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-twilight";
import { Flex } from "@chakra-ui/react";
// import "ace-builds/src-noconflict/ext-language_tools";

// const ace = require("ace-builds/src-noconflict/ace");

// useEffect(() => {

// })
// ace.edit()

const MyJsonComponent = ({ json, onChange }: { json: string; onChange: (arg0: any) => void }) => {
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

  const handleJsonChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <AceEditor
      style={{
        backgroundColor: "#232323",
        borderRadius: "10px",
        fontSize: "14px",
        padding: "10px",
      }}
      mode="json"
      theme="twilight"
      onChange={handleJsonChange}
      onLoad={function (editor) {
        editor.renderer.setPadding(20);
        editor.renderer.setScrollMargin(20, 20, 0, 0);
      }}
      name="json-editor"
      editorProps={{ $blockScrolling: true }}
      value={json}
      height="300px"
      width="100%"
      setOptions={{ useWorker: false }}
    />
  );
};

export default MyJsonComponent;
