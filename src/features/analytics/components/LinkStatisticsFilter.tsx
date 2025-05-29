import { Box, Button, MenuItem, Select, Stack } from "@mui/material";

import { useState } from "react";
import DateRangeSelect from "../../../components/DateRangeSelect";

import {
  MUIProps,
  LinkStatisticsFilterValues,
  TimeGroups,
} from "../../../types";

import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function LinkStatisticsFilter({
  onChange,
  defaultFilter,
  onRefresh,
  sx,
}: {
  defaultFilter: LinkStatisticsFilterValues;
  onChange: (filter: LinkStatisticsFilterValues) => void;
  onRefresh?: () => void;
} & MUIProps) {
  const [filter, setFilter] =
    useState<LinkStatisticsFilterValues>(defaultFilter);

  const onClear = () => {
    setFilter(defaultFilter);
  };

  const handleChange = () => {
    onChange(filter);
  };

  return (
    <Box sx={sx}>
      <Stack direction="row" spacing={2}>
        <Box>
          <DateRangeSelect
            size="small"
            value={filter.statPeriod}
            onChange={(v) => setFilter({ ...filter, statPeriod: v })}
          />
        </Box>
        <Box>
          <Select
            labelId="time-aggregate-select-label"
            size="small"
            value={filter.groupBy}
            onChange={(val) =>
              setFilter({ ...filter, groupBy: val.target.value })
            }
          >
            {Object.entries(TimeGroups).map(([k, v]) => (
              <MenuItem key={v} value={v}>
                {k}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Stack direction={"row"} spacing={1} justifyContent={"end"}>
          <Button
            variant="text"
            onClick={onClear}
            color="secondary"
            startIcon={<ClearIcon />}
          >
            Clear
          </Button>
          <Button
            variant="text"
            onClick={handleChange}
            startIcon={<AssessmentOutlinedIcon />}
          >
            Apply
          </Button>
          <Button
            variant="text"
            onClick={onRefresh}
            color="secondary"
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
