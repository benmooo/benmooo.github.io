import {
  getMdxExportFilename,
  toMdx,
  type MdxExportOptions,
  type WriterDraft,
} from "~/features/writer/writer-model";

export const downloadWriterDraft = (
  draft: WriterDraft,
  options: MdxExportOptions,
) => {
  const document = new Blob([toMdx(draft, options)], {
    type: "text/markdown;charset=utf-8",
  });
  const url = window.URL.createObjectURL(document);
  const link = window.document.createElement("a");

  link.href = url;
  link.download = getMdxExportFilename(draft);
  link.click();
  window.URL.revokeObjectURL(url);
};
