import config from "@/config";
import { useMediaQuery } from "./useMediaQuery";

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${config.mobileScreenWidth}px)`);
}
