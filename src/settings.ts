import { Null, Record, String, Array, Boolean, Number, Static, Literal, Runtype, Undefined } from "runtypes";
import uniqueId from "lodash/uniqueId";

const Maybe = <T> (t: Runtype<T>) => t.Or(Null).Or(Undefined);

export const LineRange = Record({
    start: Number,
    end: Number
})

export type LineRange = Static<typeof LineRange>;

export const FoldedRange = Record({
    id: String,
    summary: Maybe(String),
    range: Maybe(LineRange)
});

export type FoldedRange = Static<typeof FoldedRange>;

export const HighlightedRange = Record({
    id: String,
    background: String,
    range: Maybe(LineRange)
});

export type HighlightedRange = Static<typeof HighlightedRange>;

export const Position = Literal("before").Or(Literal("after"));

export const Annotation = Record({
  id: String,
  line: Maybe(Number),
  position: Position,
  content: Maybe(String),
  arrowLeftShift: Maybe(String),
  color: Maybe(String)
});

export type Annotation = Static<typeof Annotation>;

export const EditorSettings = Record({
    mode: String,
    theme: String,
    showLineNumbers: Boolean,
    lineHighlights: Array(HighlightedRange),
    annotations: Array(Annotation),
    folds: Array(FoldedRange)
});

export type EditorSettings = Static<typeof EditorSettings>;

export const newFoldId = () => uniqueId("qs-fold-");

export const newHighlightId = () => uniqueId("qs-hl-");

export const newAnnotationId = () => uniqueId("qs-ann-");

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
    annotations: [{
      id: newAnnotationId(),
      position: "before",
      line: null,
      arrowLeftShift: null,
      color: null,
      content: null
    }]
  };
  