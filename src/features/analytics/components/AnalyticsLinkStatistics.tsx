import { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router";
import { UnauthenticatedError } from "../../../errors/unauthenticatedError";
import {
  LinkStatisticsFilterValues,
  LinkStatsQuery,
  TimeGroups,
} from "../../../types";

import { RouteNames } from "../../../routes";
import {
  Box,
  Button,
  LinearProgress,
  Stack,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";

import LinkStatisticsFilter from "./LinkStatisticsFilter";
import dayjs from "dayjs";
import { fetchLinkStats } from "../../../api/fetchLinkStats";
import BarChart from "./BarChart";
import { formatDTLAbel } from "../../../utils";
import { LinkWithAnalytics } from "../../../models/Link";
import LaunchIcon from "@mui/icons-material/Launch";

const defaultFilter: LinkStatisticsFilterValues = {
  groupBy: TimeGroups.Day,
  statPeriod: {
    from: dayjs().startOf("month").toDate(),
    to: dayjs().endOf("month").toDate(),
  },
};

const SmallText = styled(Typography)({
  fontSize: ".9rem",
});

export default function AnalyticsLinkStatistics({
  linkId,
}: {
  linkId: string;
}) {
  const [link, setLink] = useState<LinkWithAnalytics | undefined>(undefined);
  const [groups, setGroups] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterValues, setFilterValues] =
    useState<LinkStatisticsFilterValues>(defaultFilter);

  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    setLoading(true);

    const query: LinkStatsQuery = {
      statPeriod: {
        lt: filterValues.statPeriod.to ?? undefined,
        gt: filterValues.statPeriod.from ?? undefined,
      },
      groupBy: filterValues.groupBy,
    };
    try {
      const res = await fetchLinkStats(linkId, query);
      setGroups([]);
      setValues([]);
      if (res) {
        if (Array.isArray(res.stats.lookups)) {
          setGroups(res.stats.lookups.map((lu) => lu.group));
          setValues(res.stats.lookups.map((lu) => lu.count));
        }
        setLink(res.link);
      }
    } catch (err: unknown) {
      if (err instanceof UnauthenticatedError) {
        await navigate(RouteNames.Login);
      }
    }

    setLoading(false);
  }, [filterValues, linkId, navigate]);

  const labels = useMemo(() => {
    return groups.map((g) => formatDTLAbel(g, filterValues.groupBy));
  }, [filterValues.groupBy, groups]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refresh = () => fetchStats();

  return (
    <Box>
      {link && (
        <Stack direction={"row"} spacing={2} alignItems={"center"} my={2}>
          <Tooltip key={link.id} title={link.long}>
            <Button
              variant="text"
              href={`${import.meta.env.VITE_GO_URL}/${link.short}`}
              target="_blank"
              endIcon={<LaunchIcon />}
              color="secondary"
            >
              {link.short}
            </Button>
          </Tooltip>
          <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
            <SmallText>Total:</SmallText>
            <SmallText>{link.count} views</SmallText>
          </Stack>
          <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
            <SmallText>Last visit:</SmallText>
            <SmallText px={1}>
              {dayjs(link.lastLookup).fromNow().toLowerCase()}
            </SmallText>
          </Stack>
        </Stack>
      )}
      <LinkStatisticsFilter
        defaultFilter={defaultFilter}
        onChange={(v) => setFilterValues(v)}
        onRefresh={() => refresh()}
        sx={{ mb: 3 }}
      />
      {loading && <LinearProgress />}
      {groups && values && (
        <BarChart label="Number of visits" labels={labels} data={values} />
      )}
    </Box>
  );
}
