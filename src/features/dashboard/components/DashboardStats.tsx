import { useCallback, useEffect, useState } from "react";
import {
  AnalyticsQueryRequest,
  DocTypes,
  MUIProps,
  Statistics,
} from "../../../types";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { fetchStats } from "../../../api/fetchStats";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { dateRangeQuery } from "../../../query";
import { UnauthenticatedError } from "../../../errors/unauthenticatedError";
import { RouteNames } from "../../../routes";
import { useNavigate } from "react-router";
import { LinkWithAnalytics } from "../../../models/Link";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectUser } from "../../auth/store/authUserSlice";
import { Permissions } from "../../../models/Permissions";
import { fetchDocs } from "../../../api/fetchDocs";
import LaunchIcon from "@mui/icons-material/Launch";

dayjs.extend(relativeTime);

const currentMonthAsDateRange = dateRangeQuery({
  from: dayjs().startOf("month").toDate(),
  to: null,
});

const ExtraSmallText = styled(Typography)({
  fontSize: ".8rem",
});

function ShortLinkButton({
  link: { id, short, count, lastLookup, long },
}: {
  link: LinkWithAnalytics;
}) {
  return (
    <Box>
      <Tooltip key={id} title={long}>
        <Button
          variant="text"
          href={`${import.meta.env.VITE_GO_URL}/${short}`}
          target="_blank"
          endIcon={<LaunchIcon />}
          color="secondary"
        >
          {short}
        </Button>
      </Tooltip>
      <ExtraSmallText px={1}>{count} views</ExtraSmallText>
      <ExtraSmallText px={1}>
        {dayjs(lastLookup).fromNow().toLowerCase()}
      </ExtraSmallText>
    </Box>
  );
}

export default function DashboardStats({ sx }: MUIProps) {
  const user = useAppSelector(selectUser);
  const [stats, setStats] = useState<Statistics | undefined>(undefined);
  const [popular, setPopular] = useState<LinkWithAnalytics[]>([]);
  const [lastVisited, setLastVisited] = useState<LinkWithAnalytics[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    const hasReadAll = user?.permissions.includes(
      Permissions.Analytics_ReadAll
    );
    const whereQuery = {
      user: !hasReadAll ? { id: user!.id } : undefined,
      expiresAt: {
        gt: new Date(),
      },
    };
    const popularQuery: AnalyticsQueryRequest = {
      where: whereQuery,
      sort: {
        count: "desc",
      },
      limit: 4,
    };
    const lastVisitedQuery: AnalyticsQueryRequest = {
      where: whereQuery,
      sort: {
        lastLookup: { sort: "desc", nulls: "last" },
      },
      limit: 4,
    };
    try {
      const statistics = await fetchStats({
        statPeriod: currentMonthAsDateRange,
      });
      if (statistics) {
        setStats(statistics);
      }
      const popular = await fetchDocs<LinkWithAnalytics, AnalyticsQueryRequest>(
        DocTypes.AnalyticsLinks,
        popularQuery
      );
      setPopular(popular.docs);
      const lastVisited = await fetchDocs<
        LinkWithAnalytics,
        AnalyticsQueryRequest
      >(DocTypes.AnalyticsLinks, lastVisitedQuery);

      setLastVisited(lastVisited.docs);
    } catch (err: unknown) {
      if (err instanceof UnauthenticatedError) {
        await navigate(RouteNames.Login);
      }
    }

    setLoading(false);
  }, [navigate, user]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return (
    <Paper sx={sx}>
      {!loading ? (
        <Grid container rowSpacing={4} columnSpacing={2.6} p={3}>
          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <Stack spacing={0.4}>
              <Typography fontWeight={500}>
                Active links: {stats?.links ?? 0}
              </Typography>
              <Typography fontWeight={500}>
                Total visits: {stats?.lookups ?? 0}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 6, xl: 6 }}>
            <Typography fontWeight={600} mb={0.5}>
              Popular
            </Typography>
            <Grid container rowSpacing={1} columnSpacing={3}>
              {popular.map((link) => (
                <Grid key={link.id} size={"auto"}>
                  <ShortLinkButton link={link} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, lg: 6, xl: 6 }}>
            <Typography fontWeight={600} mb={0.5}>
              Recently visited
            </Typography>
            <Grid container rowSpacing={1} columnSpacing={3}>
              {lastVisited.map((link) => (
                <Grid key={link.id} size={"auto"}>
                  <ShortLinkButton link={link} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Stack direction={"row"} justifyContent={"center"} py={3}>
          <CircularProgress size={24} />
        </Stack>
      )}
    </Paper>
  );
}
