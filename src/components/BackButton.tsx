import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import MuIconify from "./iconify/mui-iconify";

export default function BackButton() {
  const { back } = useRouter();
  return (
    <>
      <IconButton
        edge="start"
        color="default"
        size="large"
        onClick={() => {
          back();
        }}
        aria-label="close"
      >
        <MuIconify
          sx={{
            width: "inherit",
            height: "inherit",
          }}
          icon="ic:outline-chevron-left"
        />
      </IconButton>
    </>
  );
}
