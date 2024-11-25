import { memo } from "react";
import {
  Box,
  styled,
  Avatar,
  Hidden,
  useTheme,
  MenuItem,
  useMediaQuery
} from "@mui/material";

import useAuth from "app/hooks/useAuth";
import useSettings from "app/hooks/useSettings";

import { Span } from "app/components/Typography";
import { MatxMenu } from "app/components";
import { themeShadows } from "app/components/MatxTheme/themeColors";

import { topBarHeight } from "app/utils/constant";

import sha256 from 'crypto-js/sha256';
import Brand from "app/components/Brand";

import {
  PowerSettingsNew
} from "@mui/icons-material";

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: themeShadows[8],
  transition: "all 0.3s ease"
});

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 }
}));

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" }
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none"
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary }
}));


const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({ layout1Settings: { leftSidebar: { ...sidebarSettings } } });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
        <Brand>
        </Brand>
        </Box>

        <Box display="flex" alignItems="center">
          <MatxMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  <Span>
                    Hi <strong>{user.username}</strong>
                  </Span>
                </Hidden>
                <Avatar src={"http://www.gravatar.com/avatar/" + sha256(user.username)} sx={{ cursor: "pointer" }} />
              </UserMenu>
            }>

            <StyledItem onClick={logout}>
              <PowerSettingsNew />
              <Span>Logout</Span>
            </StyledItem>
          </MatxMenu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);
