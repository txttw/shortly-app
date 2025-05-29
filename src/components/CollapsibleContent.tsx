import { JSX, useState } from "react";
import { Button, Collapse } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function CollapsibleContent({
  children,
  showLabel = "Show more",
  hideLabel = "Hide",
}: {
  children: JSX.Element | JSX.Element[];
  showLabel?: string;
  hideLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {Array.isArray(children) ? (
        <Collapse in={open}>{...children}</Collapse>
      ) : (
        <Collapse in={open}>{children}</Collapse>
      )}

      <Button
        startIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        size="small"
        variant={"text"}
        color="secondary"
        onClick={() => setOpen((c) => !c)}
      >
        {open ? hideLabel : showLabel}
      </Button>
    </>
  );
}
