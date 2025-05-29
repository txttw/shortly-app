import {
  Box,
  Grid,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";

import { JSX } from "react";
import { MUIProps } from "../types";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

import { useNavigate } from "react-router";

const TitleText = styled(Typography)({
  variant: "h6",
  fontWeight: 600,
  mb: 0,
});

const SubTitleText = styled(Typography)({
  fontSize: "1rem",
});

export default function ListPageHead({
  title,
  subtitle,
  action,
  hasBack = false,
  sx,
}: {
  title: string;
  subtitle?: string | JSX.Element;
  action?: JSX.Element | undefined | false | null;
  hasBack?: boolean;
} & MUIProps) {
  const navigate = useNavigate();

  return (
    <Grid sx={sx} container spacing={2} justifyContent={"space-between"}>
      <Grid size="auto">
        <Box>
          {hasBack ? (
            <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
              <Tooltip title="Back">
                <IconButton onClick={() => navigate(-1)}>
                  <KeyboardBackspaceOutlinedIcon />
                </IconButton>
              </Tooltip>
              <TitleText>{title}</TitleText>
            </Stack>
          ) : (
            <TitleText>{title}</TitleText>
          )}
          {typeof subtitle === "string" ? (
            <SubTitleText>{subtitle}</SubTitleText>
          ) : (
            subtitle
          )}
        </Box>
      </Grid>
      <Grid size="auto">{action}</Grid>
    </Grid>
  );
}
