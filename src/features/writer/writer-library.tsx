import { useEffect, useState } from "react";

import {
  getWriterDraftLabel,
  type WriterDraftSummary,
} from "~/features/writer/writer-model";

type WriterLibraryProps = {
  activeDraftId: string | null;
  drafts: readonly WriterDraftSummary[];
  isBusy: boolean;
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  onDelete: (draftId: string) => void;
  onSelect: (draftId: string) => void;
};

const formatDraftUpdatedAt = (updatedAt: string) =>
  new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(updatedAt));

export function WriterLibrary({
  activeDraftId,
  drafts,
  isBusy,
  isOpen,
  onClose,
  onCreate,
  onDelete,
  onSelect,
}: WriterLibraryProps) {
  const [pendingDeletionId, setPendingDeletionId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) {
      setPendingDeletionId(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <aside aria-label="文稿库" className="writer-library">
      <header className="writer-library-header">
        <div>
          <p>文稿</p>
          <span>{drafts.length} 篇</span>
        </div>
        <button
          aria-label="关闭文稿库"
          className="writer-action"
          disabled={isBusy}
          onClick={onClose}
          type="button"
        >
          关闭
        </button>
      </header>

      <button
        className="writer-library-create"
        disabled={isBusy}
        onClick={onCreate}
        type="button"
      >
        新建文章
      </button>

      <ol className="writer-library-list">
        {drafts.map((draft) => {
          const isActive = draft.id === activeDraftId;
          const isConfirmingDeletion = draft.id === pendingDeletionId;
          const label = getWriterDraftLabel(draft);

          return (
            <li key={draft.id}>
              <button
                aria-current={isActive ? "page" : undefined}
                aria-label={`打开 ${label}`}
                className="writer-library-draft"
                data-active={isActive}
                disabled={isBusy}
                onClick={() => onSelect(draft.id)}
                type="button"
              >
                <span>{label}</span>
                <small>
                  {formatDraftUpdatedAt(draft.updatedAt)} · {draft.writingUnits} 字
                </small>
              </button>
              <div className="writer-library-draft-actions">
                {isConfirmingDeletion ? (
                  <>
                    <button
                      className="writer-library-delete"
                      disabled={isBusy}
                      onClick={() => setPendingDeletionId(null)}
                      type="button"
                    >
                      取消
                    </button>
                    <button
                      className="writer-library-delete writer-library-delete-confirm"
                      disabled={isBusy}
                      onClick={() => onDelete(draft.id)}
                      type="button"
                    >
                      确认删除
                    </button>
                  </>
                ) : (
                  <button
                    aria-label={`删除 ${label}`}
                    className="writer-library-delete"
                    disabled={isBusy}
                    onClick={() => setPendingDeletionId(draft.id)}
                    type="button"
                  >
                    删除
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
