import { Button, Icon } from "@blueprintjs/core";
import { ReactChild } from "react";
import { IconNames } from "@blueprintjs/icons";
import { style } from "typestyle";

export interface BaseItem {
  id: string;
}

export interface ItemListProps<TItem extends BaseItem> {
  itemList: TItem[];
  renderItem: (item: TItem) => ReactChild;
  onAdd: () => void;
  helpText?: ReactChild;
  onRemove: (id: string) => void;
}

export default function ItemList<TItem extends BaseItem>(
  props: ItemListProps<TItem>
) {
  return (
    <>
      {props.itemList.map((item, idx) => (
        <div
          key={item.id}
          style={{
            marginBottom: "0.5rem"
          }}
        >
          <div className={itemGroupRow}>
            <div className={itemGroupControl}>{props.renderItem(item)}</div>
            {props.itemList.length > 1 && (
              <div className={itemGroupCloser}>
                <Button minimal onClick={() => props.onRemove(item.id)}>
                  <Icon icon={IconNames.CROSS} />
                </Button>
              </div>
            )}
          </div>
          {idx === props.itemList.length - 1 && (
            <div style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "0.5rem"
            }}>
              <Button>
                <Icon
                  icon={IconNames.ADD}
                  onClick={() => {
                    props.onAdd();
                  }}
                />
              </Button>
              <div style={{ flexGrow: 1 }} />
              {props.helpText}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export const itemGroupRow = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  clear: "both",
  borderBottom:  "1px dotted #ddd"
});

export const itemGroupControl = style({
  flexGrow: 1,
  flexShrink: 1,
});

export const itemGroupCloser = style({
  flexGrow: 0,
  flexShrink: 0,
  borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
  marginLeft: "0.5rem",
  marginBottom: "0.5rem",
});
