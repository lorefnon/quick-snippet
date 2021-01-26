import { Select } from "@blueprintjs/select";
import { Button, MenuItem } from "@blueprintjs/core";
import path from "path";
import { capitalize, memoize } from "lodash";
import "@blueprintjs/select/lib/css/blueprint-select.css";

const StrSelect = Select.ofType<string>();

export interface ThemeSelectProps {
  mode: string;
  onChange: (theme: string) => void;
}

export default function ThemeSelect(props: ThemeSelectProps) {
  /* @ts-ignore */
  const ctx: any = require.context("codemirror/theme", true, /\.css$/);
  const modes: string[] = ctx.keys();
  return (
    <StrSelect
      items={modes}
      itemPredicate={(query, item) => {
        if (!query) return true;
        return (
          getTheme(item).slice(0, query.length).toLowerCase() ===
          query.toLowerCase()
        );
      }}
      itemRenderer={(item, itemProps) => (
        <MenuItem
          text={capitalize(getTheme(item))}
          onClick={itemProps.handleClick}
        />
      )}
      onItemSelect={(item) => {
        ctx(item);
        props.onChange(getTheme(item));
      }}
    >
      <Button text={capitalize(props.mode)} rightIcon="double-caret-vertical" />
    </StrSelect>
  );
}

const getTheme = memoize((entry: string) =>
  path.basename(entry, path.extname(entry))
);
