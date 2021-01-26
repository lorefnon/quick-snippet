import { style } from "typestyle";
import { EditorSettings } from "../settings";

export function applySettings(
    editor: CodeMirror.Editor, 
    settings: EditorSettings, 
    onSettingsChange: React.Dispatch<React.SetStateAction<EditorSettings>>
) {
    const doc = editor.getDoc();
    if (!doc) return;
    for (const entry of settings!.lineHighlights) {
        if (!entry.range) continue;
        const { start, end } = entry.range;
        for (let i = start; i <= end; i++) {
            // @ts-ignore
            doc.addLineClass(i - 1, "background", style({
                background: entry.background
            }));
        }
    }
    for (const entry of settings.folds) {
        if (!entry.range) continue;
        const { start, end } = entry.range;
        for (let i = start; i <= end; i++) {
            // @ts-ignore
            doc.addLineClass(i - 1, "container", lineHidden);
        }
        const widgetNode = document.createElement("div");
        widgetNode.setAttribute("class", widgetContainer);
        widgetNode.addEventListener("click", () => {
            onSettingsChange(oldSettings => ({
                ...oldSettings,
                folds: oldSettings.folds.filter(f => f.id !== entry.id)
            }));
        })
        doc.addLineWidget(end - 1, widgetNode);
        const summary = entry.summary ? `(${entry.summary})` : "";
        widgetNode.innerHTML = `
            <div class="${dottedLining}">
            </div>
            <div class="${collapsedInfoLabel}">
            ${end - start + 1} lines collapsed ${summary}
            </div>`;
    }
}


const lineHidden = style({
    $nest: {
        ".CodeMirror-gutter-wrapper": { display: "none" },
        ".CodeMirror-line": { display: "none" },
    },
});

const collapsedInfoLabel = style({
    zIndex: 2,
    position: "relative",
    display: "inline-block",
    background: "#565454",
    padding: "0.2rem 1rem",
    borderRadius: "20px !important",
    margin: ".2rem",
});

const dottedLining = style({
    zIndex: 1,
    height: "50%",
    borderBottom: "2px dotted rgba(255, 255, 255, 0.2)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
});

const widgetContainer = style({
    position: "relative",
    paddingLeft: "1rem",
    cursor: "pointer"
});
