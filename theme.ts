'use client';

import { CSSVariablesResolver, createTheme, rem } from '@mantine/core';

export const themeOverride = createTheme({
  other: {
    studioHeaderHeight: rem(60),
    studioMainTopHeight: rem(40),
    studioMainMiddleCompositionFooterHeight: rem(35),
    studioMainBottomHeight: rem(60),
  },
});

export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-studio-header-height': theme.other.studioHeaderHeight,
    '--mantine-studio-main-top-height': theme.other.studioMainTopHeight,
    '--mantine-studio-main-middle-composition-footer-height':
      theme.other.studioMainMiddleCompositionFooterHeight,
    '--mantine-studio-main-bottom-height': theme.other.studioMainBottomHeight,
  },
  light: {},
  dark: {},
});
