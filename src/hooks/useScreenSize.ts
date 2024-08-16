import { useMediaQuery } from "react-responsive";

export default function useScreenSize() {
  const isTabletScreen = useMediaQuery({ maxWidth: 1024, minWidth: 769 });
  const isDesktopScreen = useMediaQuery({ minWidth: 1025 });
  const isMobileScreen = useMediaQuery({ maxWidth: 768 });
  const isSmallScreen = useMediaQuery({ maxWidth: 500 });

  return {
    isTabletScreen,
    isSmallScreen,
    isDesktopScreen,
    isMobileScreen,
  };
}
