import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

export default function SearchInput({
  value,
  onChange,
  onAction,
}: {
  value: string;
  onChange?: (value: string) => void;
  onAction?: () => void;
}) {
  return (
    <TextField
      fullWidth
      id="searchInput"
      placeholder="search"
      label=""
      size="small"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        onChange?.(e.target.value)
      }
      onKeyDown={(e) => e.key === "Enter" && onAction?.()}
      slotProps={{
        input: {
          sx: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            height: "100%",
          },
        },
      }}
    />
  );
}
