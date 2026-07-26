import {
  createWriterLibraryState,
  resolveWriterLibrary,
  sortWriterDraftsByUpdatedAt,
  toWriterDraftSummary,
  WriterDraftSchema,
  WriterImageSchema,
  WriterLibrarySchema,
  WriterSnapshotSchema,
  type WriterDraft,
  type WriterImage,
  type WriterLibraryState,
  type WriterSnapshot,
} from "~/features/writer/writer-model";

const databaseName = "writer-studio";
const databaseVersion = 3;
const draftsStoreName = "drafts";
const imagesStoreName = "images";
const snapshotsStoreName = "snapshots";
const libraryStoreName = "library";
const libraryRecordId = "current";

const requestToPromise = <Result>(request: IDBRequest<Result>) =>
  new Promise<Result>((resolve, reject) => {
    request.addEventListener("success", () => resolve(request.result), {
      once: true,
    });
    request.addEventListener("error", () => reject(request.error), {
      once: true,
    });
  });

const transactionToPromise = (transaction: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    transaction.addEventListener("complete", () => resolve(), { once: true });
    transaction.addEventListener("abort", () => reject(transaction.error), {
      once: true,
    });
    transaction.addEventListener("error", () => reject(transaction.error), {
      once: true,
    });
  });

const openWriterDatabase = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, databaseVersion);

    request.addEventListener(
      "upgradeneeded",
      () => {
        const database = request.result;

        if (!database.objectStoreNames.contains(draftsStoreName)) {
          database.createObjectStore(draftsStoreName, { keyPath: "id" });
        }

        if (!database.objectStoreNames.contains(imagesStoreName)) {
          const images = database.createObjectStore(imagesStoreName, {
            keyPath: "id",
          });
          images.createIndex("draftId", "draftId", { unique: false });
        }

        if (!database.objectStoreNames.contains(snapshotsStoreName)) {
          const snapshots = database.createObjectStore(snapshotsStoreName, {
            keyPath: "id",
          });
          snapshots.createIndex("draftId", "draftId", { unique: false });
        }

        if (!database.objectStoreNames.contains(libraryStoreName)) {
          database.createObjectStore(libraryStoreName, { keyPath: "id" });
        }
      },
      { once: true },
    );
    request.addEventListener("success", () => resolve(request.result), {
      once: true,
    });
    request.addEventListener("error", () => reject(request.error), {
      once: true,
    });
  });

const withWriterStores = async <Result>(
  storeNames: readonly string[],
  mode: IDBTransactionMode,
  action: (getStore: (storeName: string) => IDBObjectStore) => Promise<Result>,
) => {
  const database = await openWriterDatabase();
  const transaction = database.transaction([...storeNames], mode);
  const transactionCompletion = transactionToPromise(transaction);

  try {
    const result = await action((storeName) =>
      transaction.objectStore(storeName),
    );
    await transactionCompletion;

    return result;
  } finally {
    database.close();
  }
};

const parseWriterDrafts = (drafts: unknown[]) =>
  sortWriterDraftsByUpdatedAt(drafts.map((draft) => WriterDraftSchema.parse(draft)));

const createWriterLibraryRecord = (activeDraftId: string | null) => ({
  id: libraryRecordId,
  activeDraftId,
});

const createLibraryState = ({
  drafts,
  storedLibrary,
}: {
  drafts: readonly WriterDraft[];
  storedLibrary: unknown;
}) => {
  const library = resolveWriterLibrary({
    library: WriterLibrarySchema.parse(storedLibrary ?? {}),
    drafts,
  });

  return {
    library,
    state: createWriterLibraryState({
      activeDraftId: library.activeDraftId,
      drafts: drafts.map(toWriterDraftSummary),
    }),
  };
};

export const loadWriterDraft = async (id: string) =>
  withWriterStores([draftsStoreName], "readonly", async (getStore) => {
    const store = getStore(draftsStoreName);
    const result = await requestToPromise(store.get(id));

    return result ? WriterDraftSchema.parse(result) : null;
  });

export const saveWriterDraft = async (draft: WriterDraft) => {
  const parsedDraft = WriterDraftSchema.parse(draft);

  return withWriterStores([draftsStoreName], "readwrite", async (getStore) =>
    requestToPromise(getStore(draftsStoreName).put(parsedDraft)),
  );
};

export const loadWriterImages = async (
  draftId: string,
): Promise<WriterImage[]> =>
  withWriterStores([imagesStoreName], "readonly", async (getStore) => {
    const images = getStore(imagesStoreName).index("draftId");
    const results = await requestToPromise(images.getAll(IDBKeyRange.only(draftId)));

    return results
      .map((image) => WriterImageSchema.parse(image))
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  });

export const saveWriterImages = async (images: readonly WriterImage[]) => {
  const parsedImages = images.map((image) => WriterImageSchema.parse(image));

  return withWriterStores([imagesStoreName], "readwrite", async (getStore) =>
    Promise.all(
      parsedImages.map((image) =>
        requestToPromise(getStore(imagesStoreName).put(image)),
      ),
    ),
  );
};

export const saveWriterSnapshot = async (snapshot: WriterSnapshot) => {
  const parsedSnapshot = WriterSnapshotSchema.parse(snapshot);

  return withWriterStores(
    [snapshotsStoreName],
    "readwrite",
    async (getStore) =>
      requestToPromise(getStore(snapshotsStoreName).put(parsedSnapshot)),
  );
};

export const loadWriterLibraryState = async (): Promise<WriterLibraryState> =>
  withWriterStores(
    [draftsStoreName, libraryStoreName],
    "readwrite",
    async (getStore) => {
      const draftsStore = getStore(draftsStoreName);
      const libraryStore = getStore(libraryStoreName);
      const [storedDrafts, storedLibrary] = await Promise.all([
        requestToPromise(draftsStore.getAll()),
        requestToPromise(libraryStore.get(libraryRecordId)),
      ]);
      const { library, state } = createLibraryState({
        drafts: parseWriterDrafts(storedDrafts),
        storedLibrary,
      });

      if (
        !storedLibrary ||
        WriterLibrarySchema.parse(storedLibrary).activeDraftId !==
          library.activeDraftId
      ) {
        await requestToPromise(
          libraryStore.put(createWriterLibraryRecord(library.activeDraftId)),
        );
      }

      return state;
    },
  );

export const selectWriterDraft = async (id: string) =>
  withWriterStores(
    [draftsStoreName, libraryStoreName],
    "readwrite",
    async (getStore) => {
      const draft = await requestToPromise(getStore(draftsStoreName).get(id));

      if (!draft) {
        return null;
      }

      const parsedDraft = WriterDraftSchema.parse(draft);
      await requestToPromise(
        getStore(libraryStoreName).put(createWriterLibraryRecord(parsedDraft.id)),
      );

      return parsedDraft;
    },
  );

export const deleteWriterDraft = async (
  draftId: string,
): Promise<WriterLibraryState> =>
  withWriterStores(
    [draftsStoreName, imagesStoreName, snapshotsStoreName, libraryStoreName],
    "readwrite",
    async (getStore) => {
      const draftsStore = getStore(draftsStoreName);
      const imagesStore = getStore(imagesStoreName);
      const snapshotsStore = getStore(snapshotsStoreName);
      const libraryStore = getStore(libraryStoreName);
      const imageIndex = imagesStore.index("draftId");
      const snapshotIndex = snapshotsStore.index("draftId");
      const [storedDrafts, storedLibrary, imageIds, snapshotIds] =
        await Promise.all([
          requestToPromise(draftsStore.getAll()),
          requestToPromise(libraryStore.get(libraryRecordId)),
          requestToPromise(imageIndex.getAllKeys(IDBKeyRange.only(draftId))),
          requestToPromise(snapshotIndex.getAllKeys(IDBKeyRange.only(draftId))),
        ]);
      const remainingDrafts = parseWriterDrafts(storedDrafts).filter(
        (draft) => draft.id !== draftId,
      );
      const storedLibraryState = WriterLibrarySchema.parse(storedLibrary ?? {});
      const { library, state } = createLibraryState({
        drafts: remainingDrafts,
        storedLibrary:
          storedLibraryState.activeDraftId === draftId
            ? { activeDraftId: remainingDrafts[0]?.id ?? null }
            : storedLibrary,
      });

      await Promise.all([
        requestToPromise(draftsStore.delete(draftId)),
        ...imageIds.map((imageId) =>
          requestToPromise(imagesStore.delete(imageId)),
        ),
        ...snapshotIds.map((snapshotId) =>
          requestToPromise(snapshotsStore.delete(snapshotId)),
        ),
        requestToPromise(
          libraryStore.put(createWriterLibraryRecord(library.activeDraftId)),
        ),
      ]);

      return state;
    },
  );
