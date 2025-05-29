import { useCallback, useEffect, useState } from "react";
import { Link } from "../../../models/Link";
import { fetchDocs } from "../../../api/fetchDocs";
import ResourceList, { HeadCell } from "../../../components/ResourceList";

import { useNavigate } from "react-router";
import { UnauthenticatedError } from "../../../errors/unauthenticatedError";
import {
  ActionStatus,
  DocTypes,
  LinkQueryRequest,
  LinkFilterValues,
  Pagination,
  SortDirectionOptions,
  LinkWhereQuery,
} from "../../../types";
import getListItemCells from "./getListItemCells";
import { RouteNames } from "../../../routes";
import { Alert, Box, Collapse } from "@mui/material";
import LinkFilter from "./LinkFilter";
import { DeleteIconButton } from "../../../components/DeleteIconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDocs } from "../../../api/deleteDocs";
import { isUUID } from "../../../utils";
import { dateRangeQuery, textQuery, userQuery } from "../../../query";

const headCells: HeadCell<Link>[] = [
  {
    id: "id",
    label: "Id",
    sortable: true,
  },
  {
    id: "short",
    label: "Short link",
    sortable: true,
  },
  {
    id: "long",
    label: "Long link",
    sortable: true,
  },
  {
    id: "user",
    label: "Owner",
    sortable: false,
  },
  {
    id: "expiresAt",
    label: "Expires at",
    sortable: true,
  },
  {
    id: "createdAt",
    label: "Created at",
    sortable: true,
  },
];

const pageSizeOptions = [10, 25, 50];
const defaultPage = 1;
const defaultPageSize = pageSizeOptions[0];

const defaultFilter: LinkFilterValues = {
  search: "",
  userSearch: "",
  expiresAtRange: { from: new Date(), to: null },
  createdAtRange: { from: null, to: null },
};

export default function LinkList() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<ActionStatus | undefined>(
    undefined
  );
  const [filterValues, setFilterValues] =
    useState<LinkFilterValues>(defaultFilter);
  const [sort, setSort] = useState<
    Partial<Record<keyof Link, SortDirectionOptions>>
  >({ createdAt: "desc" });
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultPageSize);
  const [pagination, setPagination] = useState<Pagination | undefined>(
    undefined
  );
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const prepareQuery = useCallback((): LinkQueryRequest => {
    const isUUIDSearch = isUUID(filterValues.search);
    const searchQuery = textQuery(filterValues.search, "contains");
    let where: LinkWhereQuery | undefined = {
      id: isUUIDSearch ? filterValues.search : undefined,
      OR: !isUUIDSearch
        ? [{ short: searchQuery }, { long: searchQuery }]
        : undefined,
      user: userQuery(filterValues.userSearch, "contains"),
      expiresAt: dateRangeQuery(filterValues.expiresAtRange),
      createdAt: dateRangeQuery(filterValues.createdAtRange),
    };
    if (Object.keys(where).length === 0) {
      where = undefined;
    }
    return {
      where,
      page,
      limit,
      sort,
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
      const { docs, pagination } = await fetchDocs<Link, LinkQueryRequest>(
        DocTypes.Links,
        query
      );
      setLinks(docs);
      setPagination(pagination);
    } catch (err: unknown) {
      if (err instanceof UnauthenticatedError) {
        await navigate(RouteNames.Login);
      }
    }
    setLoading(false);
  }, [navigate, prepareQuery]);

  const onDelete = useCallback(
    async (selected: string[]) => {
      setDeleting(true);
      try {
        const status = await deleteDocs(DocTypes.Links, selected);
        setDeleteStatus(status);
      } catch (err: unknown) {
        if (err instanceof UnauthenticatedError) {
          await navigate(RouteNames.Login);
        }
      }
      setDeleting(false);
    },
    [navigate]
  );

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks, deleteStatus]);

  const refresh = () => fetchLinks();

  const items =
    links?.map((item) => ({
      doc: item,
      elements: getListItemCells(item),
    })) || [];

  return (
    <Box>
      <Collapse in={deleteStatus === ActionStatus.Ok}>
        <Alert
          sx={{ mb: 2 }}
          severity={"success"}
          onClose={() => setDeleteStatus(undefined)}
        >
          Selected items deleted successfully
        </Alert>
      </Collapse>

      <Collapse in={deleteStatus === ActionStatus.NotOk}>
        <Alert
          sx={{ mb: 2 }}
          severity={"error"}
          onClose={() => setDeleteStatus(undefined)}
        >
          An error happened. Unable to delete.
        </Alert>
      </Collapse>

      <LinkFilter
        defaultFilter={defaultFilter}
        onChange={(v) => setFilterValues(v)}
        onRefresh={refresh}
        sx={{ mb: 3 }}
      />
      <ResourceList<Link>
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
        selectAction={
          <DeleteIconButton
            size="large"
            loading={deleting}
            onDelete={() => onDelete?.(selected)}
          >
            <DeleteIcon />
          </DeleteIconButton>
        }
        sx={{ width: "100%", mb: 2 }}
      ></ResourceList>
    </Box>
  );
}
