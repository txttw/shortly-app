import { Box, Button, Popover, Stack, Typography } from "@mui/material";
import { Permissions } from "../../../models/Permissions";
import { useState } from "react";
import DateRangeSelect from "../../../components/DateRangeSelect";

import { Borders, MUIProps, UserFilterValues } from "../../../types";
import { clearBorder, clearBorders, isValidDateRange } from "../../../utils";
import MultiSelect from "../../../components/MultiSelect";
import SearchInput from "../../../components/SearchInput";
import SearchBarButton from "../../../components/SearchBarButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

export default function UserFilter({
  onChange,
  onRefresh,
  defaultFilter,
  sx,
}: {
  defaultFilter: UserFilterValues;
  onChange: (filter: UserFilterValues) => void;
  onRefresh: () => void;
} & MUIProps) {
  const [filter, setFilter] = useState<UserFilterValues>(defaultFilter);

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
    });
  };

  const handleChange = () => {
    closeFilter();
    onChange(filter);
  };

  const hasFilter =
    filter.permissions.length > 0 || isValidDateRange(filter.createdAtRange);

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
        <Stack direction="column" spacing={3} p={3} pt={2}>
          <Box>
            <Typography mb={1.6}>Filter by permissions</Typography>
            <MultiSelect
              value={filter.permissions}
              onChange={(val) =>
                setFilter({ ...filter, permissions: val as Permissions[] })
              }
              options={Object.entries(Permissions).map(([k, v]) => ({
                value: v,
                label: k,
              }))}
            />
          </Box>
          <Box>
            <Typography mb={1.6}>Filter by created date</Typography>
            <DateRangeSelect
              value={filter.createdAtRange}
              onChange={(v) => setFilter({ ...filter, createdAtRange: v })}
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
