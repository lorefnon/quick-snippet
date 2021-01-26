import { CSSProperties, ReactChild } from "react";
import { style } from "typestyle";
import cc from "classcat";

export interface PanelProps {
  style?: CSSProperties;
  header: ReactChild;
  children: ReactChild | ReactChild[];
  classNames?: {
    body?: string;
    header?: string;
  };
}

export default function Panel(props: PanelProps) {
  return (
    <div className={panelContainer} style={props.style}>
      <div className={cc([panelHeader, props.classNames?.header])}>
        {props.header}
      </div>
      <div className={cc([panelBody, props.classNames?.body])}>
        {props.children}
      </div>
    </div>
  );
}

export const panelHeader = style({
  flexGrow: 0,
  flexShrink: 0,
  backgroundColor: "#394b59",
  borderBottom: "1px solid #182026",
  padding: "0.5rem",
  background:
    "linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))",
});

export const panelContainer = style({
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #2e3c46",
});

export const panelBody = style({
  overflow: "auto",
  flexGrow: 1,
  flexShrink: 1,
  padding: "0.5rem",
  background: "#39444c",
});
