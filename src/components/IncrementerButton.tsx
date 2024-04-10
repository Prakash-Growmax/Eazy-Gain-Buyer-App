import { Box, CircularProgress, InputLabel, SxProps } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/system";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, Ref, forwardRef, memo } from "react";
import MuIconify from "./iconify/mui-iconify";
interface IncrementerButtonProps {
  quantity?: number;
  onIncrease?: () => void;
  onDelete?: () => void;
  onDecrease?: any;
  minQty: any;
  sx?: SxProps;
  children?: ReactNode;
  addingToCart: boolean;
  isBag?: boolean;
  productId?: number;
  setIsOpenCase?: any;
  label?: string;
}

const IncrementerButton = forwardRef(
  (
    {
      quantity,
      onIncrease,
      minQty,
      onDecrease,
      sx,
      onDelete,
      addingToCart,
      setIsOpenCase,
      productId,
      label,
      ...other
    }: IncrementerButtonProps,
    ref: Ref<any>
  ) => {
    const { push } = useRouter();
    const pathName = usePathname();
    return (
      <>
        <Stack
          ref={ref}
          flexShrink={0}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 0.5,
            borderRadius: 1,
            position: "relative",
            typography: "subtitle2",
            inset: "-5px 0px 0px",
            border: (theme) =>
              `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
            ...sx,
          }}
          {...other}
        >
          {label && (
            <InputLabel
              sx={{
                position: "absolute",
                top: "-10px",
                left: 12,
                // fontSize: "12px",
              }}
            >
              {label}
            </InputLabel>
          )}
          {quantity === parseFloat(minQty) ? (
            <IconButton onClick={onDelete} sx={{ borderRadius: 0.75 }}>
              {addingToCart ? (
                <CircularProgress size={16} />
              ) : (
                <MuIconify icon={"ic:outline-delete"} width={16} />
              )}
            </IconButton>
          ) : (
            <IconButton
              disabled={quantity === 0}
              onClick={onDecrease}
              sx={{ borderRadius: 0.75 }}
            >
              {addingToCart ? (
                <CircularProgress size={16} />
              ) : (
                <MuIconify icon={"material-symbols:remove"} width={16} />
              )}
            </IconButton>
          )}
          <Box
            onClick={() => {
              setIsOpenCase();
              push(`${pathName}?qty=${productId}`);
            }}
          >
            {quantity}
          </Box>

          <IconButton onClick={onIncrease} sx={{ borderRadius: 0.75 }}>
            {addingToCart ? (
              <CircularProgress size={16} />
            ) : (
              <MuIconify icon="mingcute:add-line" width={16} />
            )}
          </IconButton>
        </Stack>
      </>
    );
  }
);

IncrementerButton.displayName = "IncrementerButton";
export default memo(IncrementerButton);
