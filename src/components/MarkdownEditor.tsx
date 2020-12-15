import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Showdown from "showdown";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

type MarkdownEditorProps = {
  value: any;
  setValue: any;
};

const MarkdownEditor = ({ value, setValue }: MarkdownEditorProps) => {
  return <ReactQuill theme="snow" value={value} onChange={setValue} />;
};

export default MarkdownEditor;
