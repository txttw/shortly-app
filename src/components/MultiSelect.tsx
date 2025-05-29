import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useMemo } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 260,
    },
  },
};

export default function MultiSelect({
  options,
  value,
  label,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string[];
  label?: string;
  onChange?: (value: string[]) => void;
}) {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    onChange?.(
      typeof event.target.value == "string"
        ? [event.target.value]
        : event.target.value
    );
  };

  const optionsObj = useMemo(
    () =>
      options.reduce((prev, option) => {
        prev[option.value] = option.label;
        return prev;
      }, {} as { [key: string]: string }),
    [options]
  );

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
      <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label="Scope Filter" />}
        MenuProps={MenuProps}
        renderValue={(val) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {val.map((v) => (
              <Chip key={v} label={optionsObj[v]} />
            ))}
          </Box>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
