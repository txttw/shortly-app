import { Box, Button, SxProps, Theme } from "@mui/material";
import { MUIProps } from "../types";
import CollapsibleContent from "./CollapsibleContent";
import QRCode from "react-qr-code";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";
import { useCallback, useRef } from "react";

export default function DownloadableQRCode({
  value,
  filename,
  sx,
  qrContainerStyles,
}: {
  value: string;
  filename?: string;
  qrContainerStyles?: SxProps<Theme>;
} & MUIProps) {
  const qrRef = useRef<SVGElement | null>(null);

  const handleDownloadImage = useCallback(async () => {
    if (qrRef.current && filename) {
      if (!filename.endsWith(".png")) throw new Error("png filename expected");

      const svg = qrRef.current;

      const dataHeader = "data:image/svg+xml;charset=utf-8";

      const serializeAsXML = (node: Node) =>
        new XMLSerializer().serializeToString(node);

      const encodeAsUTF8 = (s: string) =>
        `${dataHeader},${encodeURIComponent(s)}`;

      const svgData = encodeAsUTF8(serializeAsXML(svg));

      const loadImage = async (data: string): Promise<HTMLImageElement> => {
        const img = document.createElement("img");
        img.src = data;
        return new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      };
      const img = await loadImage(svgData);

      const canvas = document.createElement("canvas");
      canvas.width = qrRef.current.clientWidth;
      canvas.height = qrRef.current.clientHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, svg.clientWidth, svg.clientHeight);
      }

      const data = canvas.toDataURL("image/png", 1.0);

      const link = document.createElement("a");

      link.href = data;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [filename]);

  return (
    <Box sx={sx}>
      <CollapsibleContent showLabel="Show QR code" hideLabel="Hide QR code">
        <Box sx={qrContainerStyles}>
          <Box>
            {/*
            // @ts-expect-error correct type*/}
            <QRCode ref={qrRef} value={value} />
          </Box>
          <Button
            startIcon={<DownloadForOfflineOutlinedIcon />}
            variant={"text"}
            color="secondary"
            onClick={() => handleDownloadImage()}
          >
            Download QR code
          </Button>
        </Box>
      </CollapsibleContent>
    </Box>
  );
}
