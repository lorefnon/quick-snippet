import { Dialog, TextArea } from "@blueprintjs/core";
import { getPermalink, HashPayload } from "./utils/url";

interface PermalinkDialogProps extends HashPayload {
  onClose: () => void;
}

export default function PermalinkDialog(props: PermalinkDialogProps) {
  return (
    <Dialog
      title="Share snippet link"
      isOpen
      onClose={props.onClose}
      className="bp3-dark"
    >
      <div style={{ padding: "0.5rem" }}>
        <TextArea style={{ width: "100%" }} rows={10}>
          {getPermalink(props)}
        </TextArea>
        <div style={{ margin: "0.5rem 0 0 0" }}>
          <strong>Note:</strong> This URL contains the entire content of your
          snippet. If you modify the contents, you'll need to regenerate the URL
          and share it again. There is no recovery mechanism if you loose the
          URL.
        </div>
      </div>
    </Dialog>
  );
}
