import {
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { JSX, PropsWithChildren } from "react";

import { BaseResource } from "../models/BaseResource";
import { MUIProps, Pagination, SortDirectionOptions } from "../types";
import { SkeletonTable } from "./SkeletonTable";
import { randomInt } from "../utils";

export interface HeadCell<T> {
  id: keyof T;
  label: string;
  sortable: boolean;
}

export default function ResourceList<T extends BaseResource>({
  headCells,
  items,
  loading,
  sort,
  pagination,
  selected,
  pageSizeOptions,
  selectAction,
  onSelect,
  onSortChange,
  onPageChange,
  sx,
}: PropsWithChildren<
  {
    headCells: HeadCell<T>[];
    items: {
      doc: T;
      elements: JSX.Element[];
    }[];
    loading: boolean;
    selectAction?: JSX.Element;
    sort: Partial<Record<keyof T, SortDirectionOptions>>;
    pagination?: Pagination;
    selected: string[];
    pageSizeOptions: number[];
    onSelect?: (selected: string[]) => void;
    onSortChange?: (
      sort: Partial<Record<keyof T, SortDirectionOptions>>
    ) => void;
    onPageChange?: (pagination: { page?: number; limit?: number }) => void;
  } & MUIProps
>) {
  const handleSelectAll = () => {
    onSelect?.(selected.length > 0 ? [] : items.map((item) => item.doc.id));
  };

  const handleSort = (property: keyof T) => {
    const s: typeof sort = {};
    if (sort[property]) {
      s[property] = sort[property] === "desc" ? "asc" : "desc";
    } else {
      s[property] = "asc";
    }
    onSortChange?.(s);
  };

  const handleSelect = (id: string) => {
    const sel = new Set(selected);
    if (selected.find((v) => v === id)) {
      sel.delete(id);
    } else {
      sel.add(id);
    }
    onSelect?.([...sel]);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    // mui uses 0 based page index
    if (pagination?.page !== newPage + 1) {
      onPageChange?.({
        page: newPage + 1,
      });
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const limit = parseInt(event.target.value, 10);
    if (pagination?.limit !== limit) {
      onPageChange?.({
        page: 1,
        limit,
      });
    }
  };

  return (
    <Paper sx={sx}>
      {selected.length > 0 && (
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          px={2}
          sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
        >
          <Typography
            mb={0}
            fontWeight={500}
            fontSize={"1rem"}
          >{`${selected.length} selected`}</Typography>
          {selectAction}
        </Stack>
      )}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <TableHead>
            <TableRow>
              {selectAction && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < items.length
                    }
                    checked={
                      items.length > 0 && selected.length === items.length
                    }
                    onChange={handleSelectAll}
                    slotProps={{
                      input: {
                        "aria-label": "select all",
                      },
                    }}
                  />
                </TableCell>
              )}
              {headCells.map((c) => (
                <TableCell key={String(c.id)} align={"left"}>
                  {c.sortable ? (
                    <TableSortLabel
                      active={!!sort[c.id]}
                      direction={sort[c.id]}
                      onClick={() => handleSort(c.id)}
                    >
                      {c.label}
                    </TableSortLabel>
                  ) : (
                    c.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <SkeletonTable
                rowCnt={items?.length || randomInt(3, 8)}
                cellCnt={headCells.length}
                checkbox={Boolean(selectAction)}
              />
            )}
            {!loading &&
              items.map((row) => {
                const isItemSelected = selected.includes(row.doc.id);
                return (
                  <TableRow
                    key={row.doc.id}
                    selected={isItemSelected}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {selectAction && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onChange={() => handleSelect(row.doc.id)}
                          slotProps={{
                            input: {
                              "aria-label": `select ${row.doc.id}`,
                            },
                          }}
                        />
                      </TableCell>
                    )}
                    {...row.elements}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={pageSizeOptions}
          component="div"
          count={
            pagination.hasNextPage
              ? -1
              : pagination.limit * (pagination.page - 1) + items.length
          }
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
      {!loading && items.length === 0 && (
        <Stack
          mt={1}
          p={5}
          borderTop={(theme) => `1px dotted ${theme.palette.grey[600]} `}
          justifyContent={"center"}
          alignItems={"center"}
        >
          No data found with current filter and search options
        </Stack>
      )}
    </Paper>
  );
}
