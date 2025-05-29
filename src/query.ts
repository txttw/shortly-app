import { isUUID } from "./utils";
import {
  DateQuery,
  DateRange,
  TextQuery,
  ValueRange,
  ValueRangeQuery,
} from "./types";

export const dateRangeQuery = (range: DateRange): DateQuery | undefined =>
  Boolean(range.from) || Boolean(range.to)
    ? {
        gt: range.from || undefined,
        lt: range.to || undefined,
      }
    : undefined;

export const rangeQuery = (range: ValueRange): ValueRangeQuery | undefined =>
  Boolean(range.from) || Boolean(range.to)
    ? {
        gte: range.from || undefined,
        lte: range.to || undefined,
      }
    : undefined;

export const textQuery = (
  search: string | undefined,
  type: keyof TextQuery
): TextQuery | undefined =>
  search
    ? {
        [type]: search,
      }
    : undefined;

export const arrayQuery = <T>(list: T[]) =>
  list.length > 0
    ? {
        array_contains: list,
      }
    : undefined;

export const userQuery = (
  search: string | undefined,
  type: keyof TextQuery
) => {
  if (!search) return undefined;
  const isUUIDSearch = isUUID(search);
  return isUUIDSearch
    ? { id: search }
    : {
        username: {
          [type]: search,
        },
      };
};
