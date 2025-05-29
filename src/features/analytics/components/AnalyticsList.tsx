import { useCallback, useEffect, useState } from "react";
import { LinkWithAnalytics } from "../../../models/Link";
import { fetchDocs } from "../../../api/fetchDocs";
import ResourceList from "../../../components/ResourceList";

import { useNavigate } from "react-router";
import { UnauthenticatedError } from "../../../errors/unauthenticatedError";
import {
  AnalyticsFilterValues,
  AnalyticsQueryRequest,
  AnalyticsWhereQuery,
  DocTypes,
  Pagination,
  SortDirectionOptions,
  SortOptions,
} from "../../../types";
import getListItemCells from "./getListItemCells";
import { RouteNames } from "../../../routes";
import { Box } from "@mui/material";
import AnalyticsFilter from "./AnalyticsFilter";
import { isUUID } from "../../../utils";
import {
  dateRangeQuery,
  rangeQuery,
  textQuery,
  userQuery,
} from "../../../query";
import { headCells } from "../data/headCells";

const pageSizeOptions = [10, 25, 50];
const defaultPage = 1;
const defaultPageSize = pageSizeOptions[0];

const defaultFilter: AnalyticsFilterValues = {
  search: "",
  userSearch: "",
  countRange: {},
  expiresAtRange: { from: new Date(), to: null },
};

export default function AnalyticsList() {
  const [links, setLinks] = useState<LinkWithAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterValues, setFilterValues] =
    useState<AnalyticsFilterValues>(defaultFilter);
  const [sort, setSort] = useState<
    Partial<Record<keyof LinkWithAnalytics, SortDirectionOptions>>
  >({ lastLookup: "desc" });
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultPageSize);
  const [pagination, setPagination] = useState<Pagination | undefined>(
    undefined
  );
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const prepareQuery = useCallback((): AnalyticsQueryRequest => {
    const isUUIDSearch = isUUID(filterValues.search);
    const searchQuery = textQuery(filterValues.search, "contains");
    let where: AnalyticsWhereQuery | undefined = {
      id: isUUIDSearch ? filterValues.search : undefined,
      OR: !isUUIDSearch
        ? [{ short: searchQuery }, { long: searchQuery }]
        : undefined,
      user: userQuery(filterValues.userSearch, "contains"),
      count: rangeQuery(filterValues.countRange),
      expiresAt: dateRangeQuery(filterValues.expiresAtRange),
    };
    if (Object.keys(where).length === 0) {
      where = undefined;
    }
    const sortOptionalColumn: SortOptions<keyof LinkWithAnalytics> =
      sort.lastLookup
        ? {
            ...sort,
            lastLookup: {
              sort: sort.lastLookup,
              nulls: "last",
            },
          }
        : sort;

    return {
      where,
      page,
      limit,
      sort: sortOptionalColumn,
      include: {
        user: true,
        lookups: true,
      },
    };
  }, [filterValues, limit, sort, page]);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setSelected([]);
    const query = prepareQuery();

    try {
      const { docs, pagination } = await fetchDocs<
        LinkWithAnalytics,
        AnalyticsQueryRequest
      >(DocTypes.AnalyticsLinks, query);
      setLinks(docs);
      setPagination(pagination);
    } catch (err: unknown) {
      if (err instanceof UnauthenticatedError) {
        await navigate(RouteNames.Login);
      }
    }

    setLoading(false);
  }, [navigate, prepareQuery]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const refresh = () => fetchLinks();

  const items =
    links?.map((link) => ({
      doc: link,
      elements: getListItemCells(link),
    })) || [];

  return (
    <Box>
      <AnalyticsFilter
        defaultFilter={defaultFilter}
        onChange={(v) => setFilterValues(v)}
        onRefresh={refresh}
        sx={{ mb: 3 }}
      />
      <ResourceList<LinkWithAnalytics>
        headCells={headCells}
        items={items}
        loading={loading}
        sort={sort}
        pagination={pagination}
        selected={selected}
        pageSizeOptions={pageSizeOptions}
        onSelect={setSelected}
        onSortChange={(sort) => setSort(sort)}
        onPageChange={({ page, limit }) => (
          setPage(page || defaultPage), setLimit(limit || defaultPageSize)
        )}
        sx={{ width: "100%", mb: 2 }}
      ></ResourceList>
    </Box>
  );
}
