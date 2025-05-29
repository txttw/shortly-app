import dayjs from "dayjs";
import { Permissions } from "./models/Permissions";
import { Borders, DateRange, MUIProps, TimeGroups, ValueRange } from "./types";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isUUID = (id: string) =>
  Boolean(
    id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  );

export const hasAllPermissions = (
  has: Permissions[] | undefined,
  req: Permissions[]
) => !!has && new Set(has).intersection(new Set(req)).size === req.length;

export const hasSomePermissions = (
  has: Permissions[] | undefined,
  req: Permissions[]
) => !!has && has.some((p) => req.includes(p));

export const testPermissions = (
  has: Permissions[] | undefined,
  test: Record<Permissions, boolean>
) =>
  has?.filter((p) => test[p]).length ===
  Object.values(test).filter((t) => t).length;

export const clearBorder = (border: Borders): MUIProps["sx"] => {
  const borders = {
    [Borders.Left]: {
      borderLeft: "none",
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    [Borders.Right]: {
      borderRight: "none",
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    [Borders.Top]: {
      borderTop: "none",
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
    },
    [Borders.Bottom]: {
      borderBottom: "none",
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
    },
  };
  return borders[border];
};

export const clearBorders = (borders: Borders[]): MUIProps["sx"] => {
  return borders.reduce(
    (prev, border) => ({ ...prev, ...clearBorder(border) }),
    {}
  );
};

export const isValidDateRange = (value: DateRange) =>
  value.to && value.from
    ? value.to > value.from
    : Boolean(value.from) || Boolean(value.to);

export const isValidRange = (value: ValueRange) => {
  const fromIsNum = Number.isInteger(value.from);
  const toIsNum = Number.isInteger(value.to);
  return fromIsNum && toIsNum ? value.to! >= value.from! : fromIsNum || toIsNum;
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const dateTimeLabelFormatStrings = {
  [TimeGroups.Year]: "YYYY",
  [TimeGroups.Month]: "YYYY-MM",
  [TimeGroups.Day]: "YYYY-MM-DD",
  [TimeGroups.Hour]: "MM-DD HH",
};

export const formatDTLAbel = (value: string | Date, tg: TimeGroups) =>
  dayjs(value).format(dateTimeLabelFormatStrings[tg]);
