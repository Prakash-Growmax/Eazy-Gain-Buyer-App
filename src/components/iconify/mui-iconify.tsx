import { forwardRef, ReactNode } from "react";
import { Icon } from "@iconify/react";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/material";
import { BoxProps } from "@mui/system";

interface IProps extends BoxProps {
  icon: string;
  width?: number;
  sx?: SxProps;
  children?: ReactNode;
}

const MuIconify = forwardRef<HTMLDivElement, IProps>((props, ref) => {
  const { icon, width = 20, sx, ...other } = props;
  return (
    <Box
      ref={ref}
      component={Icon}
      className="component-iconify"
      icon={icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
  );
});

MuIconify.displayName = "MuIconify"
export default MuIconify;
