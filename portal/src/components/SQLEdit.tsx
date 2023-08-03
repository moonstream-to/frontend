/* eslint-disable @typescript-eslint/no-var-requires */
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-twilight";
import "brace/ext/searchbox";

const SQLEdit = ({
  sql,
  onChange,
  readOnly = true,
  ...props
}: {
  sql: string;
  onChange?: (arg0: any) => void;
  readOnly?: boolean;
  [x: string]: any;
}) => {
  const handleJsonChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <AceEditor
      style={{
        backgroundColor: "#232323",
        borderRadius: "10px",
        fontSize: "14px",
        padding: "10px",
        ...props,
      }}
      mode="sql"
      theme="twilight"
      onChange={handleJsonChange}
      onLoad={function (editor) {
        editor.renderer.setShowGutter(false);
        editor.renderer.setPadding(20);
        editor.renderer.setScrollMargin(20, 20, 0, 0);
        editor.setReadOnly(readOnly);
      }}
      name="sql-editor"
      editorProps={{ $blockScrolling: true }}
      value={sql}
      height="300px"
      width="100%"
      setOptions={{ useWorker: false }}
      {...props}
    />
  );
};

export default SQLEdit;
