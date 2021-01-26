import {
  Button,
  FormGroup,
  Checkbox,
  InputGroup,
  Icon,
  Tag,
  AnchorButton,
} from "@blueprintjs/core";
import cc from "classcat";
import { useState } from "react";
import LangSelect from "./LangSelect";
import toNumber from "lodash/toNumber";
import ThemeSelect from "./ThemeSelect";
import { IconNames } from "@blueprintjs/icons";
import { style } from "typestyle";
import Panel, { panelHeader } from "./Panel";
import { EditorSettings, LineRange, newFoldId, newHighlightId } from "./settings";

interface SettingsPanelProps {
  defaultSettings: EditorSettings;
  classNames?: {
    container?: string;
  },
  onSubmit: (settings: EditorSettings) => void;
}

export default function SettingsPanel(props: SettingsPanelProps) {
  const [settings, setSettings] = useState<EditorSettings>(props.defaultSettings);

  return (
    <div className={settingsContainer}>
      <div className={panelHeader}>Settings</div>
      <div className={settingsInnerContainer}>
        <div className={itemGroupRow}>
          <FormGroup label="Language" style={{ marginRight: "0.5rem" }}>
            <LangSelect
              mode={settings.mode}
              onChange={(mode) =>
                setSettings((s) => ({
                  ...s,
                  mode,
                }))
              }
            />
          </FormGroup>
          <FormGroup label="Theme">
            <ThemeSelect
              mode={settings.theme}
              onChange={(theme) =>
                setSettings((s) => ({
                  ...s,
                  theme,
                }))
              }
            />
          </FormGroup>
        </div>
        <Checkbox
          checked={settings.showLineNumbers}
          onChange={(e) => {
            const showLineNumbers = e.currentTarget.checked;
            setSettings((s) => ({ ...s, showLineNumbers }));
          }}
        >
          Show Line Numbers
        </Checkbox>

        <Panel header={"Highlighted ranges"}>
          {settings.lineHighlights.map((h, idx) => (
            <div key={h.id}>
              <InputGroup
                placeholder="Eg, 1-2"
                leftElement={<Tag minimal>Lines</Tag>}
                style={{
                  marginBottom: "0.5rem",
                }}
                onChange={(e) => {
                  const { value } = e.target;
                  setSettings((s) => ({
                    ...s,
                    lineHighlights: s.lineHighlights.map((hItem) =>
                      hItem.id === h.id
                        ? { ...hItem, range: parseRange(value) }
                        : hItem
                    ),
                  }));
                }}
              />
              {idx === settings.lineHighlights.length - 1 && (
                <div className={itemGroupRow}>
                  <Button>
                    <Icon
                      icon={IconNames.ADD}
                      onClick={() => {
                        setSettings((s) => ({
                          ...s,
                          lineHighlights: s.lineHighlights.concat({
                            background: "black",
                            range: null,
                            id: newHighlightId(),
                          }),
                        }));
                      }}
                    />
                  </Button>
                  <div style={{flexGrow: 1}} />
                  <small className={subText}>(Both ends are inclusive)</small>
                </div>
              )}
            </div>
          ))}
        </Panel>
        <br />
        <Panel header="Collapsed ranges">
          {settings.folds.map((fold, idx) => (
            <div key={fold.id}>
              <div className={itemGroupRow}>
                <div className={itemGroupControl}>
                  <InputGroup
                    placeholder="Eg, 1-2"
                    leftElement={<Tag minimal>Lines</Tag>}
                    style={{
                      marginBottom: "0.5rem",
                    }}
                    onChange={(e) => {
                      const { value } = e.target;
                      setSettings((s) => ({
                        ...s,
                        folds: s.folds.map((foldItem) =>
                          foldItem.id === fold.id
                            ? { ...foldItem, range: parseRange(value) }
                            : foldItem
                        ),
                      }));
                    }}
                  />
                  <InputGroup
                    leftElement={<Tag minimal>Summary</Tag>}
                    placeholder="Eg, 1-2"
                    style={{
                      marginBottom: "0.5rem",
                    }}
                    onChange={(e) => {
                      const { value } = e.target;
                      setSettings((s) => ({
                        ...s,
                        folds: s.folds.map((foldItem) =>
                          foldItem.id === fold.id
                            ? { ...foldItem, summary: value }
                            : foldItem
                        ),
                      }));
                    }}
                  />
                </div>
                <div className={itemGroupCloser}>
                  <AnchorButton minimal>
                    <Icon icon={IconNames.CROSS} />
                  </AnchorButton>
                </div>
              </div>
              {idx < settings.folds.length - 1 && (
                <div className={formGroupSeparator} />
              )}
              {idx === settings.folds.length - 1 && (
                <div className={itemGroupRow}>
                  <Button>
                    <Icon
                      icon={IconNames.ADD}
                      onClick={() => {
                        setSettings((s) => ({
                          ...s,
                          folds: s.folds.concat({
                            summary: null,
                            range: null,
                            id: newFoldId(),
                          }),
                        }));
                      }}
                    />
                  </Button>
                  <div style={{flexGrow: 1}} />
                  <small className={subText}>(Both ends are inclusive)</small>
                </div>
              )}
            </div>
          ))}
        </Panel>
        <br />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            text="Update"
            onClick={() => props.onSubmit(settings)}
            style={{ marginRight: "0.5rem" }}
          />
        </div>
        <br />
        <small className={subText}>
          (<strong>Tip:</strong> Use the resizer to increase/decrease the width
          of generated image. Long lines will wrap.).
        </small>
      </div>
    </div>
  );
}

function parseRange(value: string): LineRange | null {
  const parts = value.split("-").map((i) => i.trim());
  if (parts.length === 1) {
    const num = toNumber(parts[0]);
    if (!isNaN(num)) {
      return { start: num, end: num };
    }
  } else if (parts.length === 2) {
    const start = toNumber(parts[0]);
    const end = toNumber(parts[1]);
    if (!isNaN(start) && !isNaN(end)) {
      return { start, end };
    }
  }
  return null;
}

const settingsContainer = cc(["bp3-dark", style({
  height: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  background: "#323c44"
})]);

const settingsInnerContainer = style({
  overflow: "auto",
  padding: "1rem",
  flexGrow: 1,
  flexShrink: 1,
});

const formGroupSeparator = style({
  marginBottom: "0.5rem",
  borderTop: "1px dotted rgba(255, 255, 255, 0.3)",
  height: 0,
});

const itemGroupRow = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const itemGroupControl = style({
  flexGrow: 1,
  flexShrink: 1,
});

const itemGroupCloser = style({
  flexGrow: 0,
  flexShrink: 0,
  borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
  marginLeft: "0.5rem",
  marginBottom: "0.5rem",
});

const subText = style({
  color: "rgba(255, 255, 255, 0.5)"
});