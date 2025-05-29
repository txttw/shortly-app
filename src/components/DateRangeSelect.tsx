import { Stack } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";
import { DateRange } from "../types";
import { isValidDateRange } from "../utils";

export default function DateRangeSelect({
  value,
  onChange,
  size,
}: {
  value: DateRange;
  onChange: (value: DateRange) => void;
  size?: "medium" | "small";
}) {
  const handleFromChange = (v: PickerValue) => {
    const vDate = v?.startOf("day").toDate() || null;
    if (!isValidDateRange({ from: vDate, to: value.to })) {
      onChange({ ...value, from: null });
      return;
    }

    onChange({ ...value, from: vDate });
  };
  const handleToChange = (v: PickerValue) => {
    const vDate = v?.endOf("day").toDate() || null;
    if (!isValidDateRange({ from: value.from, to: vDate })) {
      onChange({ ...value, to: null });
      return;
    }

    onChange({ ...value, to: vDate });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction={"row"} spacing={2}>
        <DatePicker
          label="From"
          value={dayjs(value.from)}
          onChange={handleFromChange}
          slotProps={{
            textField: {
              size: size,
              error: false,
            },
          }}
        />

        <DatePicker
          label="To"
          value={dayjs(value.to)}
          onChange={handleToChange}
          slotProps={{
            textField: {
              size: size,
              error: false,
            },
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
}
