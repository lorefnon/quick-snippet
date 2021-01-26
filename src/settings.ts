import { Null, Record, String, Array, Boolean, Number, Static } from "runtypes";
import uniqueId from "lodash/uniqueId";

export const LineRange = Record({
    start: Number,
    end: Number
})

export type LineRange = Static<typeof LineRange>;

export const FoldedRange = Record({
    id: String,
    summary: String.Or(Null),
    range: LineRange.Or(Null)
});

export type FoldedRange = Static<typeof FoldedRange>;

export const HighlightedRange = Record({
    id: String,
    background: String,
    range: LineRange.Or(Null)
});

export type HighlightedRange = Static<typeof HighlightedRange>;

export const EditorSettings = Record({
    mode: String,
    theme: String,
    showLineNumbers: Boolean,
    lineHighlights: Array(HighlightedRange),
    folds: Array(FoldedRange)
});

export type EditorSettings = Static<typeof EditorSettings>;

export const newFoldId = () => uniqueId("editor-fold-");

export const newHighlightId = () => uniqueId("editor-highlight-");

export const defaultSettings: EditorSettings = {
    mode: "jsx",
    theme: "monokai",
    showLineNumbers: true,
    lineHighlights: [
      {
        id: newHighlightId(),
        background: "black",
        range: null,
      },
    ],
    folds: [
      {
        id: newFoldId(),
        summary: null,
        range: null,
      },
    ],
  };
  