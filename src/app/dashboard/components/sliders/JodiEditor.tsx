/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Jodit } from "jodit-react"; // class type
import { MillatConfig } from "@/config/joditEditor.config";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface MillatEditorProps {
  name: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
}

const MillatEditor: React.FC<MillatEditorProps> = ({
  name,
  label,
  value = "",
  onChange,
}) => {
  const editorRef = useRef<Jodit | null>(null); // ✅ Correct ref type
  const [editorValue, setEditorValue] = useState(value);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleEditorChange = (newContent: string) => {
    setEditorValue(newContent);
    onChange(newContent);
  };

  const config = {
    ...MillatConfig,
    uploader: {
      ...MillatConfig.uploader,
      defaultHandlerSuccess: function (this: Jodit, response: any) {
        if (response.files?.length) {
          const imageUrl = response.files[0];
          this.selection.insertImage(imageUrl, null, 250);
        }
      },
    },
    imageProcessor: {
      replaceDataURIToBlobIdInView: true, // Type-safe
    },
  };

  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <JoditEditor
        ref={editorRef} // ✅ Fixed
        value={editorValue}
        config={config}
        onBlur={(newContent) => handleEditorChange(newContent)}
        onChange={() => {}}
      />
    </div>
  );
};

export default MillatEditor;
