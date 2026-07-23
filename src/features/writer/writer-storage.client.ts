import {
  WriterDraftSchema,
  WriterSnapshotSchema,
  type WriterDraft,
  type WriterSnapshot,
} from "~/features/writer/writer-model";

const databaseName = "writer-studio";
const databaseVersion = 1;
const draftsStoreName = "drafts";
const snapshotsStoreName = "snapshots";

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

        if (!database.objectStoreNames.contains(snapshotsStoreName)) {
          const snapshots = database.createObjectStore(snapshotsStoreName, {
            keyPath: "id",
          });
          snapshots.createIndex("draftId", "draftId", { unique: false });
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

const withWriterStore = async <Result>(
  storeName: string,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => Promise<Result>,
) => {
  const database = await openWriterDatabase();
  const transaction = database.transaction(storeName, mode);
  const transactionCompletion = transactionToPromise(transaction);

  try {
    const result = await action(transaction.objectStore(storeName));
    await transactionCompletion;

    return result;
  } finally {
    database.close();
  }
};

export const loadWriterDraft = async (id: string) =>
  withWriterStore(draftsStoreName, "readonly", async (store) => {
    const result = await requestToPromise(store.get(id));

    return result ? WriterDraftSchema.parse(result) : null;
  });

export const saveWriterDraft = async (draft: WriterDraft) => {
  const parsedDraft = WriterDraftSchema.parse(draft);

  return withWriterStore(draftsStoreName, "readwrite", async (store) =>
    requestToPromise(store.put(parsedDraft)),
  );
};

export const saveWriterSnapshot = async (snapshot: WriterSnapshot) => {
  const parsedSnapshot = WriterSnapshotSchema.parse(snapshot);

  return withWriterStore(snapshotsStoreName, "readwrite", async (store) =>
    requestToPromise(store.put(parsedSnapshot)),
  );
};
