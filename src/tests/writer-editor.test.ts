import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { describe, expect, it } from "vitest";

import {
  createFocusModeExtension,
  writerFocusLineField,
} from "~/features/writer/writer-editor";

const getDecorationStarts = (
  state: EditorState,
  field: typeof writerFocusLineField,
) => {
  const starts: number[] = [];

  state.field(field).between(0, state.doc.length, (from) => {
    starts.push(from);
  });

  return starts;
};
describe("writer focus mode", () => {
  it("keeps its editor class through selection changes", () => {
    const initialState = EditorState.create({
      doc: "first line\nsecond line",
      extensions: [createFocusModeExtension(true)],
    });
    const nextState = initialState.update({
      selection: {
        anchor: initialState.doc.line(2).from,
      },
    }).state;

    expect(initialState.facet(EditorView.editorAttributes)).toContainEqual({
      class: "writer-focus-mode",
    });
    expect(nextState.facet(EditorView.editorAttributes)).toContainEqual({
      class: "writer-focus-mode",
    });
    expect(getDecorationStarts(nextState, writerFocusLineField)).toEqual([
      nextState.doc.line(2).from,
    ]);
  });

  it("does not install focus decorations when disabled", () => {
    const state = EditorState.create({
      doc: "first line",
      extensions: [createFocusModeExtension(false)],
    });

    expect(state.facet(EditorView.editorAttributes)).not.toContainEqual({
      class: "writer-focus-mode",
    });
  });
});
