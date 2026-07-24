import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import ReactMarkdown from "react-markdown";

import {
  deleteWriterDraftOnClient,
  downloadWriterDraftOnClient,
  loadWriterDraftOnClient,
  loadWriterLibraryStateOnClient,
  saveWriterDraftOnClient,
  saveWriterSnapshotOnClient,
  selectWriterDraftOnClient,
} from "~/features/writer/writer-browser";
import { WriterEditor } from "~/features/writer/writer-editor";
import { WriterLibrary } from "~/features/writer/writer-library";
import {
  countWritingUnits,
  createWriterDraft,
  createWriterSnapshot,
  shouldCreateWriterSnapshot,
  upsertWriterDraftSummary,
  updateWriterDraft,
  type WriterDraft,
  type WriterDraftSummary,
  type WriterSettings,
} from "~/features/writer/writer-model";

const autoSaveDelayMilliseconds = 500;

type SaveState = "loading" | "saving" | "saved" | "error";

const toToday = () => new Date().toISOString().slice(0, 10);

const toNow = () => new Date().toISOString();

const createNewDraft = () =>
  createWriterDraft({
    id: crypto.randomUUID(),
    now: toNow(),
  });

const saveStateLabel: Record<SaveState, string> = {
  loading: "正在打开草稿",
  saving: "正在保存",
  saved: "已本地保存",
  error: "保存失败，内容仍在当前页面",
};

const scaleOptions = [
  { label: "小", value: 0.9 },
  { label: "标准", value: 1 },
  { label: "大", value: 1.15 },
] as const;

const lineHeightOptions = [
  { label: "紧凑", value: 1.65 },
  { label: "舒展", value: 1.85 },
  { label: "留白", value: 2.05 },
] as const;

type StudioHeaderProps = {
  draft: WriterDraft;
  saveState: SaveState;
  isZenMode: boolean;
  isPreviewOpen: boolean;
  onTitleChange: (title: string) => void;
  onToggleZenMode: () => void;
  onTogglePreview: () => void;
  onOpenLibrary: () => void;
  onExport: () => void;
};

function StudioHeader({
  draft,
  saveState,
  isZenMode,
  isPreviewOpen,
  onTitleChange,
  onToggleZenMode,
  onTogglePreview,
  onOpenLibrary,
  onExport,
}: StudioHeaderProps) {
  return (
    <header className="writer-header">
      <input
        aria-label="文章标题"
        className="writer-title"
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="无题"
        value={draft.title}
      />

      <div className="writer-actions" aria-label="写作操作">
        <span className="writer-save-state" data-state={saveState}>
          {saveStateLabel[saveState]}
        </span>
        <button
          className="writer-action writer-library-action"
          onClick={onOpenLibrary}
          type="button"
        >
          文稿
        </button>
        <button
          className="writer-action"
          onClick={onTogglePreview}
          type="button"
        >
          {isPreviewOpen ? "继续写作" : "预览"}
        </button>
        <button className="writer-action" onClick={onExport} type="button">
          导出 MDX
        </button>
        <button
          aria-pressed={isZenMode}
          className="writer-action writer-zen-action"
          onClick={onToggleZenMode}
          type="button"
        >
          {isZenMode ? "退出 Zen" : "进入 Zen"}
        </button>
      </div>
    </header>
  );
}

type WriterSettingsPanelProps = {
  settings: WriterSettings;
  onSettingsChange: (settings: WriterSettings) => void;
};

function WriterSettingsPanel({
  settings,
  onSettingsChange,
}: WriterSettingsPanelProps) {
  const updateSettings = (changes: Partial<WriterSettings>) =>
    onSettingsChange({ ...settings, ...changes });

  return (
    <details className="writer-settings">
      <summary aria-label="写作设置">Aa</summary>
      <div className="writer-settings-panel">
        <label className="writer-toggle">
          <input
            checked={settings.focusMode}
            onChange={(event) =>
              updateSettings({ focusMode: event.target.checked })
            }
            type="checkbox"
          />
          <span>聚焦当前行</span>
        </label>
        <label className="writer-toggle">
          <input
            checked={settings.typewriterMode}
            onChange={(event) =>
              updateSettings({ typewriterMode: event.target.checked })
            }
            type="checkbox"
          />
          <span>打字机模式</span>
        </label>
        <fieldset>
          <legend>字号</legend>
          <div className="writer-option-group">
            {scaleOptions.map((option) => (
              <button
                aria-pressed={settings.fontScale === option.value}
                key={option.value}
                onClick={() => updateSettings({ fontScale: option.value })}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>行距</legend>
          <div className="writer-option-group">
            {lineHeightOptions.map((option) => (
              <button
                aria-pressed={settings.lineHeight === option.value}
                key={option.value}
                onClick={() => updateSettings({ lineHeight: option.value })}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </details>
  );
}

type WriterFooterProps = {
  body: string;
  settings: WriterSettings;
  onSettingsChange: (settings: WriterSettings) => void;
};

function WriterFooter({
  body,
  settings,
  onSettingsChange,
}: WriterFooterProps) {
  return (
    <footer className="writer-footer">
      <WriterSettingsPanel
        onSettingsChange={onSettingsChange}
        settings={settings}
      />
      <span>{countWritingUnits(body)} 字</span>
      <span className="writer-shortcuts">⌘S 保存 · ⌘⇧E 导出 · ⌘⇧F Zen</span>
    </footer>
  );
}

type WriterPreviewProps = {
  draft: WriterDraft;
  onClose: () => void;
};

function WriterPreview({ draft, onClose }: WriterPreviewProps) {
  return (
    <section aria-label="Markdown 预览" className="writer-preview">
      <div className="writer-preview-toolbar">
        <p>预览</p>
        <button className="writer-action" onClick={onClose} type="button">
          返回写作
        </button>
      </div>
      <article className="writer-preview-content">
        <h1>{draft.title || "无题"}</h1>
        <ReactMarkdown>{draft.body || "写下去，直到想法变得清晰。"}</ReactMarkdown>
      </article>
    </section>
  );
}

export function WriterStudio() {
  const studioElement = useRef<HTMLElement>(null);
  const draftReference = useRef<WriterDraft | null>(null);
  const lastSnapshotAtByDraft = useRef<Record<string, string>>({});
  const [draft, setDraft] = useState<WriterDraft | null>(null);
  const [drafts, setDrafts] = useState<WriterDraftSummary[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [isLibraryBusy, setIsLibraryBusy] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const saveCurrentDraft = useCallback(async (): Promise<WriterDraft | null> => {
    const currentDraft = draftReference.current;

    if (!currentDraft) {
      return null;
    }

    setSaveState("saving");

    try {
      await saveWriterDraftOnClient(currentDraft);
      setDrafts((currentDrafts) =>
        upsertWriterDraftSummary({
          draft: currentDraft,
          drafts: currentDrafts,
        }),
      );
      const savedAt = toNow();

      if (
        shouldCreateWriterSnapshot({
          lastSnapshotAt: lastSnapshotAtByDraft.current[currentDraft.id] ?? null,
          now: savedAt,
        })
      ) {
        await saveWriterSnapshotOnClient(
          createWriterSnapshot(currentDraft, savedAt),
        );
        lastSnapshotAtByDraft.current = {
          ...lastSnapshotAtByDraft.current,
          [currentDraft.id]: savedAt,
        };
      }

      setSaveState("saved");
      return currentDraft;
    } catch {
      setSaveState("error");
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadDraft = async () => {
      try {
        const libraryState = await loadWriterLibraryStateOnClient();
        const savedDraft = libraryState.activeDraftId
          ? await loadWriterDraftOnClient(libraryState.activeDraftId)
          : null;
        const initialDraft = savedDraft ?? createNewDraft();

        if (isMounted) {
          setDraft(initialDraft);
          setDrafts(
            upsertWriterDraftSummary({
              draft: initialDraft,
              drafts: libraryState.drafts,
            }),
          );
          setSaveState("saved");
        }

        if (!savedDraft) {
          await saveWriterDraftOnClient(initialDraft);
          await selectWriterDraftOnClient(initialDraft.id);
        }
      } catch {
        if (isMounted) {
          const fallbackDraft = createNewDraft();

          setDraft(fallbackDraft);
          setDrafts(
            upsertWriterDraftSummary({
              draft: fallbackDraft,
              drafts: [],
            }),
          );
          setSaveState("error");
        }
      }
    };

    void loadDraft();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    draftReference.current = draft;
  }, [draft]);

  useEffect(() => {
    if (!draft) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void saveCurrentDraft();
    }, autoSaveDelayMilliseconds);

    return () => window.clearTimeout(timeoutId);
  }, [draft, saveCurrentDraft]);

  useEffect(() => {
    const synchronizeZenMode = () =>
      setIsZenMode(document.fullscreenElement === studioElement.current);

    document.addEventListener("fullscreenchange", synchronizeZenMode);

    return () =>
      document.removeEventListener("fullscreenchange", synchronizeZenMode);
  }, []);

  const updateDraft = useCallback(
    (changes: Parameters<typeof updateWriterDraft>[0]["changes"]) => {
      const currentDraft = draftReference.current;

      if (!currentDraft) {
        return;
      }

      const nextDraft = updateWriterDraft({
        draft: currentDraft,
        changes,
        now: toNow(),
      });

      draftReference.current = nextDraft;
      setDraft(nextDraft);
      setDrafts((currentDrafts) =>
        upsertWriterDraftSummary({
          draft: nextDraft,
          drafts: currentDrafts,
        }),
      );
    },
    [],
  );

  const toggleZenMode = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();

      return;
    }

    try {
      await studioElement.current?.requestFullscreen();
    } catch {
      setIsZenMode(false);
    }
  }, []);

  const exportDraft = useCallback(() => {
    if (!draftReference.current) {
      return;
    }

    void downloadWriterDraftOnClient(draftReference.current, {
      date: toToday(),
      tags: [],
      draft: true,
    });
  }, []);

  const activateDraft = useCallback((nextDraft: WriterDraft) => {
    draftReference.current = nextDraft;
    setDraft(nextDraft);
    setDrafts((currentDrafts) =>
      upsertWriterDraftSummary({
        draft: nextDraft,
        drafts: currentDrafts,
      }),
    );
    setIsPreviewOpen(false);
    setSaveState("saved");
  }, []);

  const createDraft = useCallback(async () => {
    setIsLibraryBusy(true);

    try {
      if (draftReference.current && !(await saveCurrentDraft())) {
        return;
      }

      const nextDraft = createNewDraft();

      await saveWriterDraftOnClient(nextDraft);
      await selectWriterDraftOnClient(nextDraft.id);
      activateDraft(nextDraft);
      setIsLibraryOpen(false);
    } catch {
      setSaveState("error");
    } finally {
      setIsLibraryBusy(false);
    }
  }, [activateDraft, saveCurrentDraft]);

  const selectDraft = useCallback(
    async (draftId: string) => {
      if (draftReference.current?.id === draftId) {
        setIsLibraryOpen(false);

        return;
      }

      setIsLibraryBusy(true);

      try {
        if (!(await saveCurrentDraft())) {
          return;
        }

        const nextDraft = await selectWriterDraftOnClient(draftId);

        if (!nextDraft) {
          setSaveState("error");

          return;
        }

        activateDraft(nextDraft);
        setIsLibraryOpen(false);
      } catch {
        setSaveState("error");
      } finally {
        setIsLibraryBusy(false);
      }
    },
    [activateDraft, saveCurrentDraft],
  );

  const deleteDraft = useCallback(
    async (draftId: string) => {
      setIsLibraryBusy(true);

      try {
        if (draftReference.current?.id === draftId && !(await saveCurrentDraft())) {
          return;
        }

        const nextLibraryState = await deleteWriterDraftOnClient(draftId);
        setDrafts(nextLibraryState.drafts);

        if (draftReference.current?.id !== draftId) {
          return;
        }

        const nextDraft = nextLibraryState.activeDraftId
          ? await selectWriterDraftOnClient(nextLibraryState.activeDraftId)
          : null;

        if (nextDraft) {
          activateDraft(nextDraft);
          setIsLibraryOpen(false);

          return;
        }

        const replacementDraft = createNewDraft();

        await saveWriterDraftOnClient(replacementDraft);
        await selectWriterDraftOnClient(replacementDraft.id);
        activateDraft(replacementDraft);
        setIsLibraryOpen(false);
      } catch {
        setSaveState("error");
      } finally {
        setIsLibraryBusy(false);
      }
    },
    [activateDraft, saveCurrentDraft],
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) {
        return;
      }

      const shortcut = event.key.toLowerCase();
      const shiftShortcut = event.shiftKey;

      if (shortcut === "s") {
        event.preventDefault();
        void saveCurrentDraft();
      }

      if (shiftShortcut && shortcut === "e") {
        event.preventDefault();
        exportDraft();
      }

      if (shiftShortcut && shortcut === "p") {
        event.preventDefault();
        setIsPreviewOpen((isOpen) => !isOpen);
      }

      if (shiftShortcut && shortcut === "f") {
        event.preventDefault();
        void toggleZenMode();
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => window.removeEventListener("keydown", handleShortcut);
  }, [exportDraft, saveCurrentDraft, toggleZenMode]);

  if (!draft) {
    return (
      <main className="writer-loading" aria-live="polite">
        正在打开写作空间…
      </main>
    );
  }

  return (
    <main
      className="writer-studio"
      data-writer-studio="true"
      data-zen-mode={isZenMode}
      ref={studioElement}
      style={
        {
          "--writer-font-scale": draft.settings.fontScale,
          "--writer-line-height": draft.settings.lineHeight,
        } as CSSProperties
      }
    >
      <StudioHeader
        draft={draft}
        isPreviewOpen={isPreviewOpen}
        isZenMode={isZenMode}
        onExport={exportDraft}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onTitleChange={(title) => updateDraft({ title })}
        onTogglePreview={() => setIsPreviewOpen((isOpen) => !isOpen)}
        onToggleZenMode={() => void toggleZenMode()}
        saveState={saveState}
      />

      <div className="writer-surface">
        {isPreviewOpen ? (
          <WriterPreview
            draft={draft}
            onClose={() => setIsPreviewOpen(false)}
          />
        ) : (
          <WriterEditor
            key={draft.id}
            onChange={(body) => updateDraft({ body })}
            onSave={() => void saveCurrentDraft()}
            placeholder="写下去，直到想法变得清晰。"
            settings={draft.settings}
            value={draft.body}
          />
        )}
      </div>

      <WriterLibrary
        activeDraftId={draft.id}
        drafts={drafts}
        isBusy={isLibraryBusy}
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onCreate={() => void createDraft()}
        onDelete={(draftId) => void deleteDraft(draftId)}
        onSelect={(draftId) => void selectDraft(draftId)}
      />

      <WriterFooter
        body={draft.body}
        onSettingsChange={(settings) => updateDraft({ settings })}
        settings={draft.settings}
      />
    </main>
  );
}
