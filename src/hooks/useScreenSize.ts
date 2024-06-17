import { useMediaQuery } from "react-responsive";

export default function useScreenSize() {
  const isTabletScreen = useMediaQuery({ maxWidth: 1024, minWidth: 769 });
  const isDesktopScreen = useMediaQuery({ minWidth: 1025 });
  const isMobileScreen = useMediaQuery({ maxWidth: 768 });

  return { isTabletScreen, isDesktopScreen, isMobileScreen };
}
