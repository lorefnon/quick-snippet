import { CSSProperties, ReactChild, useState } from "react";
import { style } from "typestyle";
import cc from "classcat";
import { IconNames } from "@blueprintjs/icons";
import { Button, Icon } from "@blueprintjs/core";

export interface PanelProps {
  defaultCollapsed?: boolean;
  style?: CSSProperties;
  header: ReactChild;
  children: ReactChild | ReactChild[];
  classNames?: {
    body?: string;
    header?: string;
  };
}

export default function Panel(props: PanelProps) {
  const [isCollapsed, setCollapsed] = useState(props.defaultCollapsed ?? false);
  return (
    <div className={panelContainer} style={props.style}>
      <div className={cc([panelHeader, props.classNames?.header])}>
        <Button
          minimal
          onClick={() => {
            setCollapsed((c) => !c);
          }}
          style={{
            marginRight: '0.5rem',
            padding: "2px"
          }}
        >
          <Icon
            icon={
              isCollapsed ? IconNames.CHEVRON_RIGHT : IconNames.CHEVRON_DOWN
            }
          />
        </Button>{props.header}
      </div>
      {isCollapsed || (
        <div className={cc([panelBody, props.classNames?.body])}>
          {props.children}
        </div>
      )}
    </div>
  );
}

export const panelHeader = style({
  flexGrow: 0,
  flexShrink: 0,
  backgroundColor: "#394b59",
  borderBottom: "1px solid #182026",
  padding: "0.2rem 0.5rem",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
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
