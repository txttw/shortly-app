import { MUIProps } from "../../../types";
import { Box, IconButton, Modal, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style: MUIProps["sx"] = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 1.4,
  p: 3.4,
};

export default function DemoInfoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack direction={"row"} justifyContent={"space-between"} mb={2.5}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            fontWeight={600}
          >
            Shortly
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack id="modal-modal-description" spacing={1.2}>
          <Typography>
            This application has been made for demonstrational purposes.
          </Typography>
          <Typography fontWeight={500}>
            To get an account, please, contact the person who sent the link to
            this application.
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
}
