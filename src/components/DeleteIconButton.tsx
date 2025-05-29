import { JSX } from "@emotion/react/jsx-runtime";
import {
  Box,
  IconButton,
  Paper,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

export function DeleteIconButton({
  children,
  confirmText = "Are you sure?",
  loading,
  size,
  color,
  onDelete,
}: {
  children: JSX.Element | JSX.Element[];
  confirmText?: string;
  loading?: boolean;
  size?: "small" | "large" | "medium";
  color?:
    | "inherit"
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  onDelete?: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleDeleteRequest = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleClose();
    onDelete?.();
  };

  const open = Boolean(anchorEl);
  const id = open ? "delete-popover" : undefined;

  return (
    <Box>
      <IconButton
        size={size}
        color={color}
        onClick={handleDeleteRequest}
        loading={loading}
      >
        {children}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Paper sx={{ p: 2 }}>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Typography>{confirmText}</Typography>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDelete()}>
                <CheckIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton onClick={() => handleClose()}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      </Popover>
    </Box>
  );
}
