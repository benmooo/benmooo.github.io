import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import {
  Compartment,
  EditorState,
  StateField,
  type Extension,
} from "@codemirror/state";
import {
  Decoration,
  EditorView,
  keymap,
  placeholder,
  type DecorationSet,
} from "@codemirror/view";
import { useEffect, useRef } from "react";

import type { WriterSettings } from "~/features/writer/writer-model";

type WriterEditorProps = {
  value: string;
  settings: WriterSettings;
  placeholder: string;
  onChange: (value: string) => void;
  onSave: () => void;
};

const createFocusedLineDecorations = (state: EditorState): DecorationSet => {
  const line = state.doc.lineAt(state.selection.main.head);

  return Decoration.set([
    Decoration.line({ class: "writer-active-line" }).range(line.from),
  ]);
};

export const writerFocusLineField = StateField.define<DecorationSet>({
  create: createFocusedLineDecorations,
  update: (decorations, transaction) =>
    transaction.docChanged || transaction.selection
      ? createFocusedLineDecorations(transaction.state)
      : decorations,
  provide: (field) => EditorView.decorations.from(field),
});

export const createFocusModeExtension = (enabled: boolean): Extension =>
  enabled
    ? [
        writerFocusLineField,
        EditorView.editorAttributes.of({ class: "writer-focus-mode" }),
      ]
    : [];

export const writerEditorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "transparent",
    color: "var(--writer-ink)",
    fontFamily: "var(--writer-font)",
    fontSize: "calc(1.125rem * var(--writer-font-scale))",
  },
  ".cm-scroller": {
    fontFamily: "inherit",
    lineHeight: "var(--writer-line-height)",
    overflow: "auto",
  },
  ".cm-content": {
    minHeight: "100%",
    maxWidth: "var(--writer-measure)",
    margin: "0 auto",
    padding: "clamp(3rem, 10vh, 9rem) clamp(1.5rem, 7vw, 6rem) 42vh",
  },
  ".cm-line": {
    padding: "0",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection":
    {
      backgroundColor: "var(--writer-selection)",
    },
  ".cm-gutters": {
    display: "none",
  },
  "&.writer-focus-mode .cm-line": {
    opacity: "0.26",
    transition: "opacity 180ms ease",
  },
  "&.writer-focus-mode .cm-line.writer-active-line": {
    opacity: "1",
  },
  "&.cm-focused": {
    outline: "none",
  },
});

const scrollCaretIntoTypewriterPosition = (view: EditorView) => {
  const coordinates = view.coordsAtPos(view.state.selection.main.head);
  const scroller = view.scrollDOM;

  if (!coordinates || !view.hasFocus) {
    return;
  }

  const scrollBounds = scroller.getBoundingClientRect();
  const targetScrollTop =
    scroller.scrollTop +
    coordinates.top -
    scrollBounds.top -
    scrollBounds.height * 0.42;

  scroller.scrollTo({
    top: Math.max(0, targetScrollTop),
    behavior: "auto",
  });
};

export function WriterEditor({
  value,
  settings,
  placeholder: placeholderText,
  onChange,
  onSave,
}: WriterEditorProps) {
  const hostElement = useRef<HTMLDivElement>(null);
  const editorViewReference = useRef<EditorView | null>(null);
  const focusModeCompartment = useRef(new Compartment());
  const onChangeReference = useRef(onChange);
  const onSaveReference = useRef(onSave);
  const settingsReference = useRef(settings);

  onChangeReference.current = onChange;
  onSaveReference.current = onSave;
  settingsReference.current = settings;

  useEffect(() => {
    const host = hostElement.current;

    if (!host) {
      return;
    }

    const editorState = EditorState.create({
      doc: value,
      extensions: [
        history(),
        EditorView.lineWrapping,
        placeholder(placeholderText),
        markdown(),
        writerEditorTheme,
        focusModeCompartment.current.of(
          createFocusModeExtension(settingsReference.current.focusMode),
        ),
        keymap.of([
          {
            key: "Mod-s",
            run: () => {
              onSaveReference.current();

              return true;
            },
          },
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeReference.current(update.state.doc.toString());
          }

          if (
            (update.docChanged || update.selectionSet) &&
            settingsReference.current.typewriterMode
          ) {
            window.requestAnimationFrame(() =>
              scrollCaretIntoTypewriterPosition(update.view),
            );
          }
        }),
      ],
    });
    const editorView = new EditorView({
      state: editorState,
      parent: host,
    });

    editorViewReference.current = editorView;
    editorView.focus();

    return () => {
      editorView.destroy();
      editorViewReference.current = null;
    };
  }, []);

  useEffect(() => {
    const editorView = editorViewReference.current;

    if (!editorView) {
      return;
    }

    editorView.dispatch({
      effects: focusModeCompartment.current.reconfigure(
        createFocusModeExtension(settings.focusMode),
      ),
    });
  }, [settings.focusMode]);

  return <div ref={hostElement} className="h-full min-h-0" />;
}
