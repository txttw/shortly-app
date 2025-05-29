import {
  Box,
  Button,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";
import DateRangeSelect from "../../../components/DateRangeSelect";

import { MUIProps, Borders, AnalyticsFilterValues } from "../../../types";
import {
  clearBorder,
  clearBorders,
  isValidDateRange,
  isValidRange,
} from "../../../utils";

import SearchBarButton from "../../../components/SearchBarButton";
import SearchInput from "../../../components/SearchInput";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ValueRangeInput from "../../../components/ValueRangeInput";

export default function AnalyticsFilter({
  onChange,
  onRefresh,
  defaultFilter,
  sx,
}: {
  defaultFilter: AnalyticsFilterValues;
  onChange: (filter: AnalyticsFilterValues) => void;
  onRefresh: () => void;
} & MUIProps) {
  const [filter, setFilter] = useState<AnalyticsFilterValues>(defaultFilter);
  const [filterAnchorEl, setFilterAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const openFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const closeFilter = () => {
    setFilterAnchorEl(null);
  };

  const onClear = () => {
    setFilter({
      ...defaultFilter,
      expiresAtRange: { from: null, to: null },
    });
  };

  const handleChange = () => {
    closeFilter();
    onChange(filter);
  };

  const hasFilter =
    isValidRange(filter.countRange) ||
    isValidDateRange(filter.expiresAtRange) ||
    Boolean(filter.userSearch);

  return (
    <Box sx={sx}>
      <Stack direction={"row"} spacing={0}>
        <SearchBarButton
          label="Filter"
          onClick={openFilter}
          className={"search-bar-border"}
          endIcon={
            hasFilter ? <FilterAltOffOutlinedIcon /> : <FilterAltOutlinedIcon />
          }
        />

        <SearchBarButton
          onClick={() => onRefresh()}
          icon={<RefreshIcon />}
          tooltip="Reload"
          className={"search-bar-border"}
          sx={clearBorders([Borders.Left, Borders.Right])}
        />

        <SearchInput
          value={filter.search}
          onChange={(v) => setFilter({ ...filter, search: v })}
          onAction={() => handleChange()}
        />
        <SearchBarButton
          onClick={() => handleChange()}
          icon={<SearchIcon />}
          tooltip="Search"
          className={"search-bar-border"}
          sx={clearBorder(Borders.Left)}
        />
      </Stack>
      <Popover
        id={"filter"}
        open={!!filterAnchorEl}
        anchorEl={filterAnchorEl}
        onClose={closeFilter}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Stack direction="column" spacing={2} p={3} pt={2}>
          <Typography variant="h6">Filter</Typography>
          <Box>
            <Typography mb={1.6}>User</Typography>
            <TextField
              fullWidth
              id="user"
              label="Username or Id"
              value={filter.userSearch}
              onChange={(e) =>
                setFilter({ ...filter, userSearch: e.target.value })
              }
              helperText="Partial username or full Id"
            />
          </Box>
          <Box>
            <Typography mb={1.6}>Visit count</Typography>
            <ValueRangeInput
              value={filter.countRange}
              onChange={(v) => setFilter({ ...filter, countRange: v })}
            />
          </Box>
          <Box>
            <Typography mb={1.6}>Expiry date</Typography>
            <DateRangeSelect
              value={filter.expiresAtRange}
              onChange={(v) => setFilter({ ...filter, expiresAtRange: v })}
            />
          </Box>

          <Stack direction={"row"} spacing={1} justifyContent={"end"}>
            <Button variant="text" onClick={onClear} color="secondary">
              Clear
            </Button>
            <Button variant="text" onClick={handleChange}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </Box>
  );
}
