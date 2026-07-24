import { createClientOnlyFn } from "@tanstack/react-start";

import type {
  MdxExportOptions,
  WriterDraft,
  WriterLibraryState,
  WriterSnapshot,
} from "~/features/writer/writer-model";

export const loadWriterDraftOnClient = createClientOnlyFn(async (id: string) => {
  const { loadWriterDraft } = await import(
    "~/features/writer/writer-storage.client"
  );

  return loadWriterDraft(id);
});

export const saveWriterDraftOnClient = createClientOnlyFn(
  async (draft: WriterDraft) => {
    const { saveWriterDraft } = await import(
      "~/features/writer/writer-storage.client"
    );

    return saveWriterDraft(draft);
  },
);

export const saveWriterSnapshotOnClient = createClientOnlyFn(
  async (snapshot: WriterSnapshot) => {
    const { saveWriterSnapshot } = await import(
      "~/features/writer/writer-storage.client"
    );

    return saveWriterSnapshot(snapshot);
  },
);

export const loadWriterLibraryStateOnClient = createClientOnlyFn(async () => {
  const { loadWriterLibraryState } = await import(
    "~/features/writer/writer-storage.client"
  );

  return loadWriterLibraryState();
});

export const selectWriterDraftOnClient = createClientOnlyFn(
  async (id: string) => {
    const { selectWriterDraft } = await import(
      "~/features/writer/writer-storage.client"
    );

    return selectWriterDraft(id);
  },
);

export const deleteWriterDraftOnClient = createClientOnlyFn(
  async (id: string): Promise<WriterLibraryState> => {
    const { deleteWriterDraft } = await import(
      "~/features/writer/writer-storage.client"
    );

    return deleteWriterDraft(id);
  },
);

export const downloadWriterDraftOnClient = createClientOnlyFn(
  async (draft: WriterDraft, options: MdxExportOptions) => {
    const { downloadWriterDraft } = await import(
      "~/features/writer/writer-export.client"
    );

    return downloadWriterDraft(draft, options);
  },
);
