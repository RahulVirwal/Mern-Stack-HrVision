import React, { useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";

Quill.register("modules/imageUploader", ImageUploader);


const Editor = ({ _onChange, value }) => {
  const [editorHtml, setEditorHtml] = useState(value);
  const quillRef = useRef(null);
  const isInitialMount = useRef(true);

  const handleChange = (value) => {
    isInitialMount.current = false;
    setEditorHtml(value);
    _onChange(value);
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === "IMG") {
              node.style.maxWidth = "100px";
              node.style.maxHeight = "100px";
              node.style.objectFit = "contain";
            }
          });
        }
      });
    });

    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const quillContainer = editor.root;
      observer.observe(quillContainer, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      onChange={handleChange}
      theme="snow"
      style={{ minHeight: "25vh", maxHeight: "30vh" }}
      value={isInitialMount.current ? value : editorHtml}
    />
  );
};

export default Editor;
