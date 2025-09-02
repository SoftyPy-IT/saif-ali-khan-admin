/* eslint-disable @typescript-eslint/no-explicit-any */
export const MillatConfig = {
  uploader: {
    url: `https://api.cloudinary.com/v1_1/do2cbxkkj/image/upload`,
    format: "json",
    prepareData: (formData: FormData) => {
      const file = formData.get("files[0]");
      if (!file) {
        throw new Error("No file selected");
      }
      formData.delete("files[0]");
      formData.append("file", file);
      formData.append("upload_preset", "millat");
      return formData;
    },
    isSuccess: (resp: any) => !resp.error,
    process: (resp: any) => {
      return {
        files: resp.secure_url ? [resp.secure_url] : [],
        path: resp.secure_url,
        error: resp.error,
        msg: resp.message,
      };
    },
    defaultHandlerSuccess: (response: any, editor: any) => {
      const imageUrl = response?.files[0];
      console.log("Inserting image URL:", imageUrl);
      if (imageUrl) {
        // Insert the image into the editor
        editor?.selection?.insertImage(imageUrl, null, 250);
      }
    },
    error: (e: Error) => {
      console.error("Upload error:", e.message);
    },
  },
  height: 500,
  toolbarAdaptive: false,
  spellcheck: false,
  disablePlugins: ["speechRecognition"],
  enableDragAndDropFileToEditor: true,
  imageDefaultWidth: 250,
  imageProcessor: {
    replaceRelativeUrls: true,
  },
  events: {
    afterInit: (editor: any) => {
      console.log("Jodit Editor initialized:", editor);
    },
    beforeDestruct: (editor: any) => {
      console.log("Jodit Editor is about to be destroyed:", editor);
    },
  },
  style: {
    ".jodit-editor img": {
      maxWidth: "100%",
      height: "auto",
    },
  },
};
