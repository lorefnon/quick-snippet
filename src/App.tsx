import { style } from "typestyle";
import cc from "classcat";
import Split from "@uiw/react-split";
import { Navbar, Alignment, Button, Intent, AnchorButton } from "@blueprintjs/core";
import CodeMirror from "@uiw/react-codemirror";
import html2canvas from "html2canvas";
import { IconNames } from "@blueprintjs/icons";

import "codemirror/keymap/sublime";
import "codemirror/theme/monokai.css";

import React, { useCallback, useEffect, useRef, useState } from "react";
import PreviewDialog from "./PreviewDialog";
import uniqueId from "lodash/uniqueId";
import SettingsPanel from "./SettingsPanel";
import { defaultSettings, EditorSettings } from "./settings";
import { extractHash } from "./utils/url";
import PermalinkDialog from "./PermalinkDialog";
import { applySettings } from "./utils/codemirror";

const defaultCodeContent = `
// Enter code snippet here
//
// and generate preview using the sidebar on the right
`;

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [content, setContent] = useState<string>(defaultCodeContent);
  const [editorKey, setEditorKey] = useState<string>(uniqueId("cm-key-"));
  const cmRef = useRef<CodeMirror | null>();
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const [settingsExpanded, setSettingsExpanded] = useState<boolean>(false);
  const [activeDialog, setActiveDialog] = useState<
    "PERMALINK" | "EMBED" | null
  >(null);

  useEffect(function consumeQueryParams() {
    const payload = extractHash();
    if (!payload) return;
    setContent(payload.code);
    if (payload.settings) {
      setSettings(payload.settings);
      const { theme, mode } = payload.settings;
      if (theme) import(`codemirror/theme/${theme}.css`);
      if (mode) import(`codemirror/mode/${mode}.js`);
    }
  }, []);

  useEffect(
    function updateEditorKey() {
      setEditorKey(uniqueId("cm-key-"));
    },
    [settings]
  );

  const handleEditorInstance = useCallback(
    function handleEditorInstance(component: CodeMirror | null) {
      cmRef.current = component;
      if (!component) return;
      const { editor } = component;
      if (!editor) return;
      applySettings(editor, settings);
    },
    [settings]
  );

  const editor = (
    <div
      className={cc([editorContainer, "CodeMirror", `cm-s-${settings.theme}`])}
      key={editorKey}
      ref={editorContainerRef}
    >
      <CodeMirror
        ref={handleEditorInstance}
        value={content}
        onChange={(editor) => {
          setContent(editor.getValue());
        }}
        options={{
          lineNumbers: settings.showLineNumbers,
          theme: settings.theme,
          keyMap: "sublime",
          mode: settings.mode,
          lineWrapping: true,
          viewportMargin: Infinity,
          scrollbarStyle: "null",
        }}
      />
    </div>
  );

  const body = settingsExpanded ? (
    <Split style={{ height: "100%", width: "100%" }}>
      <div style={{ width: "calc(100% - 250px)" }}>{editor}</div>
      <div style={{ minWidth: "250px" }}>
        <SettingsPanel defaultSettings={settings} onSubmit={(settings) => setSettings(settings)} />
      </div>
    </Split>
  ) : (
    editor
  );

  const handleDialogClose = useCallback(() => {
    setActiveDialog(null);
  }, []);

  const dialog =
    activeDialog === "PERMALINK" ? (
      <PermalinkDialog
        code={content}
        settings={settings}
        onClose={handleDialogClose}
      />
    ) : activeDialog === "EMBED" && canvasRef.current ? (
      <PreviewDialog
        canvas={canvasRef.current}
        onClose={handleDialogClose}
        code={content}
        settings={settings}
      />
    ) : null;

  return (
    <>
      <Navbar fixedToTop className="bp3-dark">
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Quick Snippet</Navbar.Heading>
          <AnchorButton icon={IconNames.HOME} text="About" href={"https://github.com/lorefnon/quick-snippet"} target="_blank" />
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Navbar.Divider />
          <Button
            icon={IconNames.SHARE}
            text="Share"
            intent={Intent.PRIMARY}
            style={{ marginRight: "0.5rem" }}
            onClick={() => {
              setActiveDialog("PERMALINK");
            }}
          />
          <Button
            icon={IconNames.INSERT}
            text="Embed"
            intent={Intent.PRIMARY}
            style={{ marginRight: "0.5rem" }}
            onClick={() => {
              const editorEl = editorContainerRef?.current?.querySelector<HTMLElement>(
                ".CodeMirror"
              );
              if (!editorEl) return;
              html2canvas(editorEl).then((canvas) => {
                canvasRef.current = canvas;
                setActiveDialog("EMBED");
              });
            }}
          />
          <Button
            icon={IconNames.MENU}
            minimal
            text="Settings"
            onClick={() => {
              setSettingsExpanded((s) => !s);
            }}
          />
        </Navbar.Group>
      </Navbar>
      <div className={topLevelContainer}>
        {dialog}
        <div className={appBody}>{body}</div>
      </div>
    </>
  );
}

export default App;

const topLevelContainer = style({
  position: "absolute",
  top: "50px",
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  $nest: {
    "*": {
      borderRadius: 0,
    },
  },
});

const fluidFlexChild = style({
  flexGrow: 1,
  flexShrink: 1,
});

const editorContainer = cc([
  fluidFlexChild,
  style({
    height: "100%",
    position: "relative",
    overflowY: "auto",
    overflowX: "hidden",
    $nest: {
      ".CodeMirror": {
        height: "auto !important",
        width: "auto !important",
      },
      ".CodeMirror-scroll": {
        overflow: "visible !important",
      },
    },
  }),
]);

const appBody = style({
  background: "#39444c",
  width: "100%",
  $nest: {
    ".w-split-bar": {
      background: "#39444c",
      boxShadow: "inset 1px 0 0 0 #6d6c6c, 1px 0 0 0 #00000059",
    },
    ".w-split-bar *": {
      background: "#39444c",
    },
  },
});
