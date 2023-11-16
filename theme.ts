'use client';

import { CSSVariablesResolver, createTheme, rem } from '@mantine/core';
import {
  TOTAL_WIDTH,
  MELODY_UNIT_HEIGHT,
  MELODY_UNIT_NUM,
  RHYTHM_UNIT_HEIGHT,
  RHYTHM_UNIT_NUM,
} from './constants/studio';

export const themeOverride = createTheme({
  other: {
    studioHeaderHeight: rem(60),
    studioMainTopHeight: rem(40),
    studioMainMiddleCompositionFooterHeight: rem(35),
    studioMainBottomHeight: rem(60),
    studioTotalWidth: rem(TOTAL_WIDTH),
    studioMelodyUnitNum: MELODY_UNIT_NUM,
    studioMelodyUnitHeight: rem(MELODY_UNIT_HEIGHT),
    studioRhythmUnitNum: RHYTHM_UNIT_NUM,
    studioRhythmUnitHeight: rem(RHYTHM_UNIT_HEIGHT),
  },
});

export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-studio-header-height': theme.other.studioHeaderHeight,
    '--mantine-studio-main-top-height': theme.other.studioMainTopHeight,
    '--mantine-studio-main-middle-composition-footer-height':
      theme.other.studioMainMiddleCompositionFooterHeight,
    '--mantine-studio-main-bottom-height': theme.other.studioMainBottomHeight,
    '--mantine-studio-total-width': theme.other.studioTotalWidth,
    '--mantine-studio-melody-unit-num': theme.other.studioMelodyUnitNum,
    '--mantine-studio-melody-unit-height': theme.other.studioMelodyUnitHeight,
    '--mantine-studio-rhythm-unit-num': theme.other.studioRhythmUnitNum,
    '--mantine-studio-rhythm-unit-height': theme.other.studioRhythmUnitHeight,
  },
  light: {},
  dark: {},
});
