import { useCallback, useEffect, useState } from "react";
import { User } from "../../../models/User";
import { fetchDocs } from "../../../api/fetchDocs";
import ResourceList, { HeadCell } from "../../../components/ResourceList";

import { useNavigate } from "react-router";
import { UnauthenticatedError } from "../../../errors/unauthenticatedError";
import {
  ActionStatus,
  DocTypes,
  Pagination,
  SortDirectionOptions,
  UserFilterValues,
  UserQueryRequest,
  UserWhereQuery,
} from "../../../types";
import getListItemCells from "./getListItemCells";
import { RouteNames } from "../../../routes";
import { Alert, Box, Collapse } from "@mui/material";
import UserFilter from "./UserFilter";
import { deleteDocs } from "../../../api/deleteDocs";
import { DeleteIconButton } from "../../../components/DeleteIconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { isUUID } from "../../../utils";
import { arrayQuery, dateRangeQuery, textQuery } from "../../../query";

const headCells: HeadCell<User>[] = [
  {
    id: "id",
    label: "Id",
    sortable: true,
  },
  {
    id: "username",
    label: "Username",
    sortable: true,
  },
  {
    id: "permissions",
    label: "Permissions",
    sortable: false,
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

const defaultFilter: UserFilterValues = {
  search: "",
  permissions: [],
  createdAtRange: { from: null, to: null },
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<ActionStatus | undefined>(
    undefined
  );
  const [filterValues, setFilterValues] =
    useState<UserFilterValues>(defaultFilter);
  const [sort, setSort] = useState<
    Partial<Record<keyof User, SortDirectionOptions>>
  >({ createdAt: "desc" });
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultPageSize);
  const [pagination, setPagination] = useState<Pagination | undefined>(
    undefined
  );
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const prepareQuery = useCallback((): UserQueryRequest => {
    const isUUIDSearch = isUUID(filterValues.search);
    const searchQuery = textQuery(filterValues.search, "contains");
    let where: UserWhereQuery | undefined = {
      id: isUUIDSearch ? filterValues.search : undefined,
      username: !isUUIDSearch ? searchQuery : undefined,
      permissions: arrayQuery(filterValues.permissions),
      createdAt: dateRangeQuery(filterValues.createdAtRange),
    };
    if (Object.keys(where).length === 0) {
      where = undefined;
    }
    return {
      where,
      sort,
      page,
      limit,
    };
  }, [filterValues, limit, sort, page]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setSelected([]);
    const query = prepareQuery();

    try {
      const { docs, pagination } = await fetchDocs<User, UserQueryRequest>(
        DocTypes.Users,
        query
      );
      setUsers(docs);
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
        const status = await deleteDocs(DocTypes.Users, selected);
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
    fetchUsers();
  }, [fetchUsers, deleteStatus]);

  const refresh = () => fetchUsers();

  const items =
    users?.map((item) => ({
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
          severity={"error"}
          sx={{ mb: 2 }}
          onClose={() => setDeleteStatus(undefined)}
        >
          An error happened. Unable to delete.
        </Alert>
      </Collapse>

      <UserFilter
        defaultFilter={defaultFilter}
        onChange={(v) => setFilterValues(v)}
        onRefresh={refresh}
        sx={{ mb: 3 }}
      />
      <ResourceList<User>
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
