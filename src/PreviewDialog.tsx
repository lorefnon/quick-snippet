import { Checkbox, Dialog, FormGroup, TextArea } from "@blueprintjs/core";
import { useEffect, useMemo, useState } from "react";
import { style } from "typestyle";
import { EditorSettings } from "./settings";
import { getPermalink } from "./utils/url";

export interface PreviewPopupProps {
  onClose: () => void;
  code: string;
  settings: EditorSettings;
  canvas: HTMLCanvasElement;
}

export default function PreviewDialog(props: PreviewPopupProps) {
  const alertBodyRef = (el: HTMLDivElement | null) => {
    if (!el || !props.canvas) {
      props.onClose();
      return;
    }
    el.appendChild(props.canvas);
  };

  const [dataURI, setDataURI] = useState<string | null>(null);
  
  useEffect(function updateDataURI() {
    setDataURI(props.canvas.toDataURL());
  }, [props.canvas]);

  const [includePermalinkInMd, setIncludePermalinkInMd] = useState<boolean>(
    true
  );

  const mdContent = useMemo(function computeMarkdownContent() {
    const img = `![Code Snippet](${dataURI})`;
    if (includePermalinkInMd)
      return `[${img}](${getPermalink({
        code: props.code,
        settings: props.settings,
      })}`;
    return img;
  }, [includePermalinkInMd, dataURI, props.settings, props.code]);

  return (
    <Dialog
      isOpen
      title="Preview"
      className="bp3-dark"
      onClose={props.onClose}
      style={{
        width: 0.8 * window.innerWidth,
      }}
    >
      <div className={innerContainer}>
        <div ref={alertBodyRef} className={canvasContainer}></div>
        <div style={{ margin: "1rem 0" }}>
          <small>(Right click and save image)</small>
        </div>
        <FormGroup label="Data URI" labelFor="datauri-input">
          <TextArea
            rows={5}
            id="datauri-input"
            placeholder="Placeholder text"
            value={dataURI ?? ""}
            readOnly
            style={{ width: "100%" }}
          />
        </FormGroup>
        <FormGroup label="Markdown" labelFor="md-input">
          <TextArea
            id="md-input"
            rows={5}
            value={mdContent}
            readOnly
            style={{ width: "100%" }}
          />
        </FormGroup>
        <Checkbox
          id="permalink-md-check"
          checked={includePermalinkInMd}
          onChange={(e) => {
            setIncludePermalinkInMd(e.currentTarget.checked);
          }}
          label="Include permalink in Markdown"
        />
      </div>
    </Dialog>
  );
}

const innerContainer = style({
  margin: "10px",
  position: "relative",
});

const canvasContainer = style({
  maxHeight: "300px",
  width: "100%",
  overflow: "auto",
  $nest: {
    canvas: {
      margin: "auto",
    },
  },
});
