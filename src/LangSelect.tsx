import { Select } from "@blueprintjs/select";
import { Button, MenuItem } from "@blueprintjs/core";
import path from "path";
import { capitalize, memoize } from "lodash";
import "@blueprintjs/select/lib/css/blueprint-select.css";

const StrSelect = Select.ofType<string>();

export interface LangSelectProps {
  mode: string;
  onChange: (mode: string) => void;
}

export default function LangSelect(props: LangSelectProps) {
  /* @ts-ignore */
  const ctx: any = require.context("codemirror/mode", true, /\.js$/);
  const modes: string[] = ctx.keys();
  return (
    <StrSelect
      items={modes}
      itemPredicate={(query, item) => {
        if (!query) return true;
        return (
          getMode(item).slice(0, query.length).toLowerCase() ===
          query.toLowerCase()
        );
      }}
      itemRenderer={(item, itemProps) => (
        <MenuItem
          key={item}
          text={capitalize(getMode(item))}
          onClick={itemProps.handleClick}
        />
      )}
      onItemSelect={(item) => {
        ctx(item);
        props.onChange(getMode(item));
      }}
    >
      <Button text={capitalize(props.mode)} rightIcon="double-caret-vertical" />
    </StrSelect>
  );
}

const getMode = memoize((entry: string) =>
  path.basename(entry, path.extname(entry))
);
