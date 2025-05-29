import { useCallback, useEffect, useState } from "react";
import { LinkWithAnalytics } from "../../../models/Link";
import { fetchDocs } from "../../../api/fetchDocs";

import { useNavigate } from "react-router";
import { UnauthenticatedError } from "../../../errors/unauthenticatedError";
import { AnalyticsQueryRequest, DocTypes } from "../../../types";
import getListItemCells from "./getListItemCells";
import { RouteNames } from "../../../routes";
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import useWebSocket from "react-use-websocket";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectToken, selectUser } from "../../auth/store/authUserSlice";
import { Flipper, Flipped } from "react-flip-toolkit";

import { headCells } from "../data/headCells";
import { SkeletonTable } from "../../../components/SkeletonTable";

const limit = 100;

export default function LiveAnalytics({
  onSocketStateChange,
}: {
  onSocketStateChange?: (ready: boolean) => void;
}) {
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const [links, setLinks] = useState<LinkWithAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [listId, setListId] = useState(1);
  const navigate = useNavigate();
  const socketUrl = `${import.meta.env.VITE_LIVE_ANALYTICS_URL}?token=${token}`;

  /*const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
     getWebSocket,
  } =*/
  useWebSocket(socketUrl, {
    onOpen: () => onSocketStateChange?.(true),
    onClose: () => onSocketStateChange?.(false),
    onMessage: (event: WebSocketEventMap["message"]) => {
      const link = JSON.parse(event.data);
      const temp = [...links];
      const foundIdx = temp.findIndex((l) => l.id === link.id);
      if (foundIdx >= 0) {
        temp.splice(foundIdx, 1);
      }
      setLinks([link, ...temp].slice(0, limit));
      setListId(Date.now() + Math.random());
    },
    onError(_event: WebSocketEventMap["error"]) {
      onSocketStateChange?.(false);
    },
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: () => {
      return true;
    },
  });

  const fetchLinks = useCallback(async () => {
    setLoading(true);

    const query: AnalyticsQueryRequest = {
      where: {
        user: {
          id: user?.id,
        },
      },
      sort: {
        lastLookup: { sort: "desc", nulls: "last" },
      },
      limit,
    };

    try {
      const { docs } = await fetchDocs<
        LinkWithAnalytics,
        AnalyticsQueryRequest
      >(DocTypes.AnalyticsLinks, query);
      setLinks(docs);
    } catch (err: unknown) {
      if (err instanceof UnauthenticatedError) {
        await navigate(RouteNames.Login);
      }
    }

    setLoading(false);
  }, [navigate, user?.id]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks, token]);

  // This is not used for security
  //const crypto = useMemo(() => window.crypto.subtle || {}, []);

  // Remove user column from analytics
  const userColIdx = headCells.findIndex((h) => h.id === "user");

  const headCellsWoUser = [...headCells];
  headCellsWoUser.splice(userColIdx, 1);

  const items =
    links?.map((item) => ({
      doc: item,
      elements: getListItemCells(item).filter((_, i) => i !== userColIdx),
    })) || [];

  return (
    <Box>
      <Stack direction={"row"} justifyContent={"end"}></Stack>
      <Flipper flipKey={listId}>
        <Paper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="table">
              <TableHead>
                <TableRow>
                  {headCellsWoUser.map((c) => (
                    <TableCell key={c.id} align={"left"}>
                      {c.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <SkeletonTable
                    rowCnt={items?.length || 4}
                    cellCnt={headCells.length}
                  />
                )}
                {!loading &&
                  items.map((row) => {
                    return (
                      <Flipped key={row.doc.id} flipId={row.doc.id}>
                        <TableRow
                          key={row.doc.id + row.doc.count}
                          className="highlight"
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          {...row.elements}
                        </TableRow>
                      </Flipped>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Flipper>
    </Box>
  );
}
