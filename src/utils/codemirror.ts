import { style } from "typestyle";
import cc from "classcat";
import { EditorSettings } from "../settings";
import { toNumber } from "lodash";

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
    for (const entry of settings.annotations) {
        if (!entry.line || !entry.content) continue;
        const widgetNode = document.createElement("div");
        widgetNode.setAttribute("class", cc(["annotation-widget", widgetAnnotation]));
        doc.addLineWidget(entry.line-1, widgetNode, {
            above: entry.position === "before"
        });
        let left = entry.arrowLeftShift?.trim();
        if (!left) {
            left = "10px";
        } else {
            const leftNum = toNumber(left);
            if (!isNaN(leftNum)) left = `${leftNum}px`;
        }
        widgetNode.innerHTML = `
            <div style="
                border-top: 2px solid ${entry.color ?? "black"};
                border-bottom: 2px solid ${entry.color ?? "black"};
                background: ${entry.color ?? "gray"};
                margin: 0.5rem 0;
                position: relative;">
                    <div style="
                        width: 0;
                        position: absolute;
                        ${entry.position === "before" ? "bottom": "top"}: -14px;
                        left: ${left};
                        border: 6px solid transparent;
                        border-${entry.position === "before" ? "top": "bottom"}: 6px solid ${entry.color ?? "black"};">
                    </div>
                    <div style="
                        background: rgba(0,0,0,0.5);
                        padding: 1rem 0.5rem;">
                        ${entry.content}
                    </div>
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

const widgetAnnotation = style({
    position: "relative"
});