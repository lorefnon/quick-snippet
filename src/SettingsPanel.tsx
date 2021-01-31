import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import {
  Button,
  FormGroup,
  Checkbox,
  InputGroup,
  Icon,
  Tag,
  TextArea,
  MenuItem,
} from "@blueprintjs/core";
import cc from "classcat";
import React, { useState } from "react";
import LangSelect from "./LangSelect";
import toNumber from "lodash/toNumber";
import ThemeSelect from "./ThemeSelect";
import { IconNames } from "@blueprintjs/icons";
import { style } from "typestyle";
import Panel, { panelHeader } from "./Panel";
import {
  EditorSettings,
  LineRange,
  Annotation,
  newAnnotationId,
  newFoldId,
  newHighlightId,
} from "./settings";
import { SketchPicker } from "react-color";
import {
  Popover2 as Popover,
  Tooltip2 as Tooltip,
  Classes as TooltipClasses,
} from "@blueprintjs/popover2";
import ItemList, { itemGroupRow } from "./ItemList";
import { Select } from "@blueprintjs/select";
import { capitalize } from "lodash";

interface SettingsPanelProps {
  defaultSettings: EditorSettings;
  classNames?: {
    container?: string;
  };
  onClose: () => void;
  onSubmit: (settings: EditorSettings) => void;
}

export default function SettingsPanel(props: SettingsPanelProps) {
  const [settings, setSettings] = useState<EditorSettings>(
    props.defaultSettings
  );

  return (
    <div className={settingsContainer}>
      <div className={panelHeader}>
        Settings
        <div style={{ flexGrow: 1 }} />
        <Button minimal onClick={props.onClose}>
          <Icon icon={IconNames.CROSS} />
        </Button>
      </div>
      <div className={settingsInnerContainer}>
        <div className={itemGroupRow}>
          <FormGroup label="Language" style={{ marginRight: "1rem" }}>
            <LangSelect
              mode={settings.mode}
              onChange={(mode) =>
                setSettings((prevSettings) => ({
                  ...prevSettings,
                  mode,
                }))
              }
            />
          </FormGroup>
          <FormGroup label="Theme">
            <ThemeSelect
              mode={settings.theme}
              onChange={(theme) =>
                setSettings((prevSettings) => ({
                  ...prevSettings,
                  theme,
                }))
              }
            />
          </FormGroup>
        </div>
        <Checkbox
          checked={settings.showLineNumbers}
          onChange={(event) => {
            const showLineNumbers = event.currentTarget.checked;
            setSettings((prevSettings) => ({
              ...prevSettings,
              showLineNumbers,
            }));
          }}
        >
          Show Line Numbers
        </Checkbox>
        <Panel
          defaultCollapsed
          header={"Annotations"}
          style={{ marginBottom: "1rem" }}
        >
          <ItemList
            itemList={settings.annotations}
            renderItem={(item) => (
              <>
                <FormGroup label={"Content (Basic HTML supported)"}>
                  <TextArea
                    style={{ width: "100%" }}
                    rows={5}
                    onChange={(e) => {
                      import("sanitize-html").then(({ default: sanitize }) => {
                        const content = sanitize(e.target.value);
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          annotations: prevSettings.annotations.map((it) =>
                            it.id === item.id
                              ? { ...it, content }
                              : it
                          ),
                        }))
                      });
                    }}
                  />
                </FormGroup>
                <div className={itemGroupRow}>
                  <FormGroup label="Position" style={{ marginRight: "1rem" }}>
                    <Select
                      items={["before", "after"]}
                      itemRenderer={(item, itemProps) => (
                        <MenuItem
                          key={item}
                          text={capitalize(item)}
                          onClick={itemProps.handleClick}
                        />
                      )}
                      onItemSelect={(position: "before" | "after") => {
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          annotations: prevSettings.annotations.map((it) =>
                            it.id === item.id ? { ...it, position } : it
                          ),
                        }));
                      }}
                    >
                      <Button
                        text={item.position}
                        rightIcon="double-caret-vertical"
                      />
                    </Select>
                  </FormGroup>
                  <FormGroup label={"Line"}>
                    <InputGroup
                      type="number"
                      value={`${item.line ?? ""}`}
                      onChange={(e) => {
                        const line = toNumber(e.target.value);
                        if (isNaN(line)) return;
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          annotations: prevSettings.annotations.map((it) =>
                            it.id === item.id ? { ...it, line } : it
                          ),
                        }));
                      }}
                    />
                  </FormGroup>
                </div>
                <div className={itemGroupRow}>
                  <FormGroup
                    label={"Arrow Distance (From Left)"}
                    style={{ marginRight: "1rem" }}
                  >
                    <InputGroup
                      value={`${item.arrowLeftShift ?? ""}`}
                      onChange={(e) => {
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          annotations: prevSettings.annotations.map((it) =>
                            it.id === item.id
                              ? { ...it, arrowLeftShift: e.target.value }
                              : it
                          ),
                        }));
                      }}
                    />
                  </FormGroup>
                  <Popover
                    content={
                      <SketchPicker
                        color={item.color ?? undefined}
                        styles={{
                          default: {
                            picker: {
                              background: "rgb(102 113 121)",
                            },
                          },
                        }}
                        onChangeComplete={(e) => {
                          setSettings((prevSettings) => ({
                            ...prevSettings,
                            annotations: prevSettings.annotations.map(
                              (annotation): Annotation =>
                                annotation.id === item.id
                                  ? { ...annotation, color: e.hex }
                                  : annotation
                            ),
                          }));
                        }}
                      />
                    }
                  >
                    <Tooltip
                      content={<div>Highlight background color</div>}
                      className={TooltipClasses.TOOLTIP2_INDICATOR}
                    >
                      <Button
                        icon={
                          <span
                            style={{
                              backgroundColor: item.color ?? undefined,
                              height: "16px",
                              width: "16px",
                              borderRadius: "4px"
                            }}
                          />
                        }
                        text="Color"
                      />
                    </Tooltip>
                  </Popover>
                </div>
              </>
            )}
            onAdd={() => {
              setSettings((prevSettings) => ({
                ...prevSettings,
                annotations: prevSettings.annotations.concat({
                  id: newAnnotationId(),
                  position: "after",
                  line: null,
                  content: null,
                  arrowLeftShift: null,
                  color: null,
                }),
              }));
            }}
            onRemove={(id) => {
              setSettings((prevSettings) => ({
                ...prevSettings,
                annotations: prevSettings.annotations.filter(
                  (it) => it.id !== id
                ),
              }));
            }}
          />
        </Panel>
        <Panel
          defaultCollapsed
          header={
            "Highlighted ranges (" +
            getRangeContainerLength(settings.lineHighlights) +
            ")"
          }
        >
          <ItemList
            itemList={settings.lineHighlights}
            helpText={
              <small className={subText}>(Both ends are inclusive)</small>
            }
            renderItem={(item) => (
              <InputGroup
                placeholder="Eg, 1-2"
                leftElement={<Tag minimal>Lines</Tag>}
                style={{
                  marginBottom: "0.5rem",
                }}
                onChange={(e) => {
                  const { value } = e.target;
                  setSettings((prevSettings) => ({
                    ...prevSettings,
                    lineHighlights: prevSettings.lineHighlights.map((hItem) =>
                      hItem.id === item.id
                        ? { ...hItem, range: parseRange(value) }
                        : hItem
                    ),
                  }));
                }}
                rightElement={
                  <Popover
                    content={
                      <SketchPicker
                        color={item.background}
                        styles={{
                          default: {
                            picker: {
                              background: "rgb(102 113 121)",
                            },
                          },
                        }}
                        onChangeComplete={(e) => {
                          setSettings((prevSettings) => ({
                            ...prevSettings,
                            lineHighlights: prevSettings.lineHighlights.map(
                              (hItem) =>
                                hItem.id === item.id
                                  ? { ...hItem, background: e.hex }
                                  : hItem
                            ),
                          }));
                        }}
                      />
                    }
                  >
                    <Tooltip
                      content={<div>Annotation theme color</div>}
                      className={TooltipClasses.TOOLTIP2_INDICATOR}
                    >
                      <Button
                        minimal
                        style={{
                          backgroundColor: item.background,
                        }}
                      >
                        <Icon icon={IconNames.EYE_OPEN} />
                      </Button>
                    </Tooltip>
                  </Popover>
                }
              />
            )}
            onAdd={() => {
              setSettings((s) => ({
                ...s,
                lineHighlights: s.lineHighlights.concat({
                  background: "black",
                  range: null,
                  id: newHighlightId(),
                }),
              }));
            }}
            onRemove={(id) => {
              setSettings((prevSettings) => ({
                ...prevSettings,
                lineHighlights: prevSettings.lineHighlights.filter(
                  (item) => item.id !== id
                ),
              }));
            }}
          />
        </Panel>
        <br />
        <Panel
          defaultCollapsed
          header={
            "Collapsed ranges (" + getRangeContainerLength(settings.folds) + ")"
          }
        >
          <ItemList
            itemList={settings.folds}
            renderItem={(item) => (
              <>
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
                        foldItem.id === item.id
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
                        foldItem.id === item.id
                          ? { ...foldItem, summary: value }
                          : foldItem
                      ),
                    }));
                  }}
                />
              </>
            )}
            onRemove={(id) => {
              setSettings((prevSettings) => ({
                ...prevSettings,
                folds: prevSettings.folds.filter(
                  (foldItem) => foldItem.id !== id
                ),
              }));
            }}
            onAdd={() => {
              setSettings((prevSettings) => ({
                ...prevSettings,
                folds: prevSettings.folds.concat({
                  summary: null,
                  range: null,
                  id: newFoldId(),
                }),
              }));
            }}
          />
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

function getRangeContainerLength(containers: { range?: LineRange | null }[]) {
  return containers.filter((it) => it.range).length;
}

const settingsContainer = cc([
  "bp3-dark",
  style({
    height: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background: "#323c44",
  }),
]);

const settingsInnerContainer = style({
  overflow: "auto",
  padding: "1rem",
  flexGrow: 1,
  flexShrink: 1,
});

const subText = style({
  color: "rgba(255, 255, 255, 0.5)",
});
