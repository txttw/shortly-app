import { Stack, TextField } from "@mui/material";
import { ValueRange } from "../types";
import { isValidRange } from "../utils";

export default function ValueRangeInput({
  value,
  onChange,
  size,
}: {
  value: ValueRange;
  onChange: (value: ValueRange) => void;
  size?: "medium" | "small";
}) {
  const handleFromChange = (v: string) => {
    const from = parseInt(v);
    if (v === "") {
      onChange({ ...value, from: undefined });
    } else if (Number.isInteger(from)) {
      onChange({ ...value, from });
    }
  };
  const handleToChange = (v: string) => {
    const to = parseInt(v);
    if (v === "") {
      onChange({ ...value, to: undefined });
    } else if (Number.isInteger(to)) {
      onChange({ ...value, to });
    }
  };

  const isValid =
    isValidRange(value) || (value.from === undefined && value.to === undefined);

  return (
    <Stack direction={"row"} spacing={2}>
      <TextField
        fullWidth
        label="From"
        type="string"
        size={size}
        error={!isValid}
        value={value.from !== undefined ? value.from : ""}
        helperText={isValid ? "Integer number (inclusive)" : "invaid value"}
        onChange={(e) => handleFromChange(e.target.value)}
      />

      <TextField
        fullWidth
        label="To"
        type="string"
        size={size}
        error={!isValid}
        value={value.to !== undefined ? value.to : ""}
        helperText={isValid ? "Integer number (inclusive)" : "invaid value"}
        onChange={(e) => handleToChange(e.target.value)}
      />
    </Stack>
  );
}
