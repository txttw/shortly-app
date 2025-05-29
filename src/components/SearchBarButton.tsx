import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { JSX } from "react";
import { MUIProps } from "../types";

export default function SearchBarButton({
  onClick,
  startIcon,
  endIcon,
  icon,
  label,
  sx,
  className = "",
  tooltip,
}: {
  label?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  icon?: JSX.Element;
  className?: string;
  tooltip?: string;
} & MUIProps) {
  return (
    <Stack
      direction={"column"}
      justifyContent={"center"}
      sx={sx}
      className={className}
    >
      {label ? (
        <Tooltip title={tooltip}>
          <Button
            variant="text"
            color="secondary"
            endIcon={endIcon}
            startIcon={startIcon}
            onClick={onClick}
          >
            {label}
          </Button>
        </Tooltip>
      ) : (
        <IconButton onClick={onClick}>{icon}</IconButton>
      )}
    </Stack>
  );
}
