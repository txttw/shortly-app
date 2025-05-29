import { Box, Button, TableCell, Typography } from "@mui/material";
import { LinkWithAnalytics } from "../../../models/Link";
import AppLink from "../../../components/AppLink";
import { RouteNames } from "../../../routes";
import LaunchIcon from "@mui/icons-material/Launch";
import CollapsibleContent from "../../../components/CollapsibleContent";

export default function getListItemCells({
  id,
  short,
  long,
  user,
  userId,
  expiresAt,
  count,
  lookups,
  lastLookup,
}: LinkWithAnalytics) {
  const isVisited = Boolean(lastLookup);
  const hasMoreLookups = lookups && lookups.length > 1;

  return [
    <TableCell
      component="th"
      scope="row"
      sx={{ color: (theme) => theme.palette.text.primary }}
    >
      <AppLink
        to={RouteNames.AnalyticsLinkStats}
        params={{ id }}
        className="app-link"
      >
        {id}
      </AppLink>
    </TableCell>,
    <TableCell align="left">
      {
        <Button
          variant="text"
          href={`${import.meta.env.VITE_GO_URL}/${short}`}
          target="_blank"
          endIcon={<LaunchIcon />}
          color="secondary"
        >
          {short}
        </Button>
      }
    </TableCell>,
    <TableCell align="left">{long}</TableCell>,
    <TableCell align="left">{user?.username || userId}</TableCell>,
    <TableCell align="left">{count}</TableCell>,
    <TableCell align="left">
      {isVisited ? (
        <Box>
          <div className="p-list-item">
            {new Date(lastLookup!).toLocaleString()}
          </div>
          {hasMoreLookups && (
            <CollapsibleContent>
              {lookups!
                .sort(
                  (a, b) =>
                    new Date(b.timestamp!).getTime() -
                    new Date(a.timestamp!).getTime()
                )
                .slice(1)
                .map((lu, i) => (
                  <div key={i} className="p-list-item">
                    {new Date(lu.timestamp!).toLocaleString()}
                  </div>
                ))}
            </CollapsibleContent>
          )}
        </Box>
      ) : (
        <Typography>Never</Typography>
      )}
    </TableCell>,
    <TableCell align="left">
      <div>{new Date(expiresAt!).toLocaleDateString()}</div>
      <div>{new Date(expiresAt!).toLocaleTimeString()}</div>
    </TableCell>,
  ];
}
