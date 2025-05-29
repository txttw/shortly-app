import { SxProps, Theme } from "@mui/material";
import { Permissions } from "./models/Permissions";
import { JSX } from "react";
import { RouteNames } from "./routes";
import { LinkWithAnalytics } from "./models/Link";

export interface MUIProps {
  sx?: SxProps<Theme>;
}

// Common validation error returned by service specific fetch functions
export interface ValidationError {
  [x: string]: string;
}

export interface Pagination {
  page: number;
  limit: number;
  hasNextPage: boolean;
  prev: number | null;
  next: number | null;
}

export type SortDirectionOptions = "asc" | "desc";
export type SortNullOptions = "first" | "last";

export type SortOptions<SortableFields extends PropertyKey> = Partial<
  Record<
    SortableFields,
    | SortDirectionOptions
    | { sort: SortDirectionOptions; nulls: SortNullOptions }
  >
>;

export interface PaginatedResults<T> {
  docs: T[];
  pagination?: Pagination;
}

export enum Borders {
  Left = "l",
  Right = "r",
  Top = "t",
  Bottom = "b",
}

export interface MenuItemDescriptor {
  id: string;
  title: string;
  subtitle?: string;
  to: RouteNames;
  icon: JSX.Element;
}

export interface QueryRequest<Where, SortableFields extends string> {
  where?: Where;
  sort?: SortOptions<SortableFields>;
  page?: number;
  limit?: number;
  include?: { [key: string]: boolean } | { select: { [key: string]: boolean } };
}

export enum DocTypes {
  Users = "users",
  Links = "links",
  AnalyticsLinks = "analytics_links",
  AnalyticsLookups = "analytics_lookups",
}

export enum ActionStatus {
  Ok = 1,
  NotOk,
}

export interface APIResult<T> {
  data?: T;
  error?: ValidationError;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface ValueRange {
  from?: number;
  to?: number;
}

export interface UserFilterValues {
  search: string;
  permissions: Permissions[];
  createdAtRange: DateRange;
}

export interface LinkFilterValues {
  search: string;
  userSearch: string;
  expiresAtRange: DateRange;
  createdAtRange: DateRange;
}

export interface AnalyticsFilterValues {
  search: string;
  userSearch: string;
  countRange: ValueRange;
  expiresAtRange: DateRange;
}

export interface LinkStatisticsFilterValues {
  statPeriod: DateRange;
  groupBy: TimeGroups;
}

export type IdQuery = string | undefined;

export interface TextQuery {
  equals?: string;
  contains?: string;
  not?: string;
  in?: string[];
  notIn?: string[];
}

export interface DateQuery {
  lt?: string | Date;
  gt?: string | Date;
}

export interface ValueRangeQuery {
  lte?: number;
  gte?: number;
}

export interface ArrayQuery<T> {
  array_contains?: T[];
}

export interface UserWhereQuery {
  id?: string;
  username?: TextQuery;
  permissions?: ArrayQuery<Permissions>;
  createdAt?: DateQuery;
}
export type SortableUserFields = "id" | "username" | "createdAt";

export type UserQueryRequest = QueryRequest<UserWhereQuery, SortableUserFields>;

export interface LinkWhereQuery {
  OR?: LinkWhereQuery[];
  id?: string;
  short?: TextQuery;
  long?: TextQuery;
  user?: {
    id?: IdQuery;
    username?: TextQuery;
  };
  expiresAt?: DateQuery;
  createdAt?: DateQuery;
}

export type SortableLinkFields =
  | "id"
  | "short"
  | "long"
  | "expiresAt"
  | "createdAt";

export type LinkQueryRequest = QueryRequest<LinkWhereQuery, SortableLinkFields>;

export interface AnalyticsWhereQuery {
  OR?: AnalyticsWhereQuery[];
  id?: string;
  short?: TextQuery;
  long?: TextQuery;
  count?: ValueRangeQuery;
  user?: {
    id?: IdQuery;
    username?: TextQuery;
  };
  expiresAt?: DateQuery;
}

export type SortableAnalyticsFields =
  | "id"
  | "short"
  | "long"
  | "count"
  | "expiresAt"
  | "lastLookup";

export type AnalyticsQueryRequest = QueryRequest<
  AnalyticsWhereQuery,
  SortableAnalyticsFields
>;

export interface StatsQuery {
  statPeriod?: DateQuery;
}

export interface Statistics {
  links: number;
  lookups: number;
}

export enum TimeGroups {
  Year = "year",
  Month = "month",
  Day = "day",
  Hour = "hour",
}

export interface LinkStatsQuery {
  statPeriod?: DateQuery;
  groupBy?: TimeGroups;
}

export interface LinkStatistics {
  lookups: Array<{ group: string; count: number }> | number;
}

export interface LinkStatisticsResult {
  link: LinkWithAnalytics;
  stats: LinkStatistics;
}
