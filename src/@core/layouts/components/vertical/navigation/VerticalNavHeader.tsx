// ** React Import
import { ReactNode } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box, { BoxProps } from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";

// ** Type Import
import { Settings } from "src/@core/context/settingsContext";

// ** Configs
import themeConfig from "src/configs/themeConfig";

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (values: Settings) => void;
  verticalNavMenuBranding?: (props?: any) => ReactNode;
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingRight: theme.spacing(4.5),
  transition: "padding .25s ease-in-out",
  minHeight: theme.mixins.toolbar.minHeight,
}));

const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  lineHeight: "normal",
  textTransform: "uppercase",
  color: theme.palette.text.primary,
  transition: "opacity .25s ease-in-out, margin .25s ease-in-out",
}));

const StyledLink = styled("a")({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
});

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const { verticalNavMenuBranding: userVerticalNavMenuBranding } = props;

  // ** Hooks
  const theme = useTheme();

  return (
    <MenuHeaderWrapper className="nav-header" sx={{ pl: 6 }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Link href="/dashboard" passHref>
          <StyledLink>
            <svg
              width={40}
              height={50}
              version="1.1"
              viewBox="0 0 30 23"
              xmlns="https://www.w3.org/2000/svg"
              xmlnsXlink="https://www.w3.org/1999/xlink"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <image
                  x="0"
                  y="0"
                  width="30"
                  height="34"
                  xlinkHref="/images/logos/logo.png"
                />
              </g>
            </svg>
            <HeaderTitle variant="h6" sx={{ ml: 3 }}>
              ECOCHARGE
              @KMUTNB
            </HeaderTitle>
          </StyledLink>
        </Link>
      )}
    </MenuHeaderWrapper>
  );
};

export default VerticalNavHeader;
