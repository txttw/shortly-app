import { Checkbox, Skeleton, TableCell, TableRow } from "@mui/material";

function SkeletonCells({ cellCnt }: { cellCnt: number }) {
  const cellIds = [...Array(cellCnt).keys()];
  return cellIds.map((c) => (
    <TableCell key={c} align="right">
      <Skeleton variant="rounded" />
    </TableCell>
  ));
}

export function SkeletonTable({
  rowCnt,
  cellCnt,
  checkbox = false,
}: {
  rowCnt: number;
  cellCnt: number;
  checkbox?: boolean;
}) {
  const cellIds = [...Array(rowCnt).keys()];
  return cellIds.map((row) => (
    <TableRow
      key={row}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      {checkbox && (
        <TableCell padding="checkbox">
          <Checkbox color="primary" checked={false} />
        </TableCell>
      )}
      <SkeletonCells cellCnt={cellCnt} />
    </TableRow>
  ));
}
