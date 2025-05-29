import { HeadCell } from "../../../components/ResourceList";
import { LinkWithAnalytics } from "../../../models/Link";

export const headCells: HeadCell<LinkWithAnalytics>[] = [
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
    id: "count",
    label: "Number of visits",
    sortable: true,
  },
  {
    id: "lastLookup",
    label: "Last visit",
    sortable: true,
  },
  {
    id: "expiresAt",
    label: "Expires at",
    sortable: true,
  },
];
