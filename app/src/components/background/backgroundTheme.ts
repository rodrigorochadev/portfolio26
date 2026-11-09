import { create } from "zustand";

/** Overrides for the gradient's main band ("blob") and its hover highlight. */
export type BackgroundTheme = {
  blob: string;
  hover: string;
};

type BackgroundThemeState = {
  /** `null` uses the colors passed to `<Background>`. */
  theme: BackgroundTheme | null;
  setTheme: (theme: BackgroundTheme | null) => void;
};

/** Lets any page recolor the persistent background; the change is eased, not snapped. */
export const useBackgroundTheme = create<BackgroundThemeState>((set) => ({
  theme: null,
  setTheme: (theme) => set({ theme }),
}));
