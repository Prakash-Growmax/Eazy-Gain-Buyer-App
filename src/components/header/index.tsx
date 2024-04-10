"use client";
import {
  AppBar,
  Backdrop,
  Badge,
  BadgeProps,
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";

import React, { useState, useTransition } from "react";

import { bgBlur } from "@/components/Theme/css";
import useUser from "@/lib/hooks/useUser";
import useCart from "@/lib/hooks/usecart";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Logo from "../Logo";
import MuIconify from "../iconify/mui-iconify";
import { ChangeLangCookie } from "./actions";

export default function AppHeader() {
  const theme = useTheme();
  const { CartData } = useCart();
  const [openMenu, setOpenMenu] = useState(false);
  const [LogoutLoading, setLogoutLoading] = useState(false);
  const { push, back } = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();
  const {t} = useTranslation("Home");
  const handleSearchClick = () => {
    push("/search");
  };
  const { user } = useUser();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpenMenu(open);
    };
  const handleLogout = async () => {
    setLogoutLoading(true);
    await signOut();
    setLogoutLoading(false);
  };
  const HandleLangSwitch = () => {
    startTransition(() => {
      ChangeLangCookie();
    });
  };

  return (
    <>
      {LogoutLoading ||
        (isPending && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={LogoutLoading || isPending}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ))}

      {!pathName.includes("/search") &&
        !pathName.includes("/login") &&
        !pathName.includes("/order/success") &&
        !pathName.includes("order-summary") &&
        !pathName.includes("/p/") &&
        !pathName.includes("/p2/") && (
          <>
            <AppBar
              elevation={2}
              sx={{
                zIndex: theme.zIndex.appBar + 1,
                ...bgBlur({
                  color: theme.palette.background.paper,
                }),
                transition: theme.transitions.create(["height"], {
                  duration: theme.transitions.duration.shorter,
                }),
              }}
            >
              <Toolbar
                sx={{
                  flexWrap: "wrap",
                  mt: pathName == "/" ? 1 : "auto",
                }}
                disableGutters
                variant="dense"
              >
                {pathName == "/" ? (
                  <IconButton
                    onClick={() => {
                      setOpenMenu(true);
                    }}
                  >
                    <MuIconify icon="mdi:hamburger-menu" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      back();
                    }}
                    size="large"
                  >
                    <MuIconify icon="material-symbols:arrow-back" />
                  </IconButton>
                )}
                <Logo sx={{ width: 130, height: "100%", mb: "-1px" }} />
                <Stack
                  flexGrow={1}
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={{ xs: 0.5, sm: 1 }}
                >
                  <Stack direction="row" alignItems="center">
                    {pathName !== "/" && (
                      <IconButton onClick={handleSearchClick}>
                        <MuIconify icon="eva:search-fill" />
                      </IconButton>
                    )}

                    <IconButton
                      onClick={() => {
                        push("/order-summary");
                      }}
                    >
                      <StyledBadge
                        badgeContent={CartData?.length}
                        color="primary"
                      >
                        <MuIconify icon="mdi:cart" />
                      </StyledBadge>
                    </IconButton>
                    <IconButton onClick={HandleLangSwitch}>
                      <MuIconify icon="bi:translate" />
                    </IconButton>
                    <IconButton onClick={handleLogout}>
                      <MuIconify icon="material-symbols:logout" />
                    </IconButton>
                  </Stack>
                </Stack>
                {pathName === "/" && (
                  <TextField
                    fullWidth
                    onClick={handleSearchClick}
                    size="small"
                    placeholder={t('Search')}
                    sx={{
                      m: 1,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              </Toolbar>
            </AppBar>
            <Toolbar />
          </>
        )}
      {pathName === "/" && <Toolbar />}
      <Drawer anchor={"left"} open={openMenu} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          m={2}
        >
          {user && (
            <AccountStyle>
              <Box minWidth={0}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.primary" }}
                  noWrap
                >
                  {user.displayName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                  noWrap
                >
                  {user.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary" }}
                  noWrap
                >
                  {user.roleName}
                </Typography>
              </Box>
            </AccountStyle>
          )}
          <List>
            <ListItem divider disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MuIconify icon="mdi:home" />
                </ListItemIcon>
                <ListItemText
                  onClick={() => {
                    push("/");
                  }}
                  primary={"Home"}
                />
              </ListItemButton>
            </ListItem>
            <ListItem divider disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MuIconify icon="ep:shopping-bag" />
                </ListItemIcon>
                <ListItemText
                  onClick={() => {
                    push("/order/landing");
                  }}
                  primary={"Orders"}
                />
              </ListItemButton>
            </ListItem>
            <ListItem divider disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MuIconify icon="material-symbols:logout" />
                </ListItemIcon>
                {LogoutLoading ? (
                  <CircularProgress />
                ) : (
                  <ListItemText onClick={handleLogout} primary={"Logout"} />
                )}
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));
const AccountStyle = styled("div")(
  ({ theme }) => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: theme.spacing(2, 2.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.29),
  }),
  {
    name: "AccountStyle",
  }
);
