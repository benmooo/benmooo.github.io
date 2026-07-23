import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import ReactMarkdown from "react-markdown";

import {
  downloadWriterDraftOnClient,
  loadWriterDraftOnClient,
  saveWriterDraftOnClient,
  saveWriterSnapshotOnClient,
} from "~/features/writer/writer-browser";
import { WriterEditor } from "~/features/writer/writer-editor";
import {
  countWritingUnits,
  createWriterDraft,
  createWriterSnapshot,
  shouldCreateWriterSnapshot,
  updateWriterDraft,
  type WriterDraft,
  type WriterSettings,
} from "~/features/writer/writer-model";

const primaryDraftId = "primary";
const autoSaveDelayMilliseconds = 500;

type SaveState = "loading" | "saving" | "saved" | "error";

const toToday = () => new Date().toISOString().slice(0, 10);

const toNow = () => new Date().toISOString();

const createPrimaryDraft = () =>
  createWriterDraft({
    id: primaryDraftId,
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
  const lastSnapshotAt = useRef<string | null>(null);
  const [draft, setDraft] = useState<WriterDraft | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [isZenMode, setIsZenMode] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const saveCurrentDraft = useCallback(async () => {
    const currentDraft = draftReference.current;

    if (!currentDraft) {
      return;
    }

    setSaveState("saving");

    try {
      await saveWriterDraftOnClient(currentDraft);
      const savedAt = toNow();

      if (
        shouldCreateWriterSnapshot({
          lastSnapshotAt: lastSnapshotAt.current,
          now: savedAt,
        })
      ) {
        await saveWriterSnapshotOnClient(
          createWriterSnapshot(currentDraft, savedAt),
        );
        lastSnapshotAt.current = savedAt;
      }

      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadDraft = async () => {
      try {
        const savedDraft = await loadWriterDraftOnClient(primaryDraftId);

        if (isMounted) {
          setDraft(savedDraft ?? createPrimaryDraft());
          setSaveState("saved");
        }
      } catch {
        if (isMounted) {
          setDraft(createPrimaryDraft());
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
            onChange={(body) => updateDraft({ body })}
            onSave={() => void saveCurrentDraft()}
            placeholder="写下去，直到想法变得清晰。"
            settings={draft.settings}
            value={draft.body}
          />
        )}
      </div>

      <WriterFooter
        body={draft.body}
        onSettingsChange={(settings) => updateDraft({ settings })}
        settings={draft.settings}
      />
    </main>
  );
}
