import { configureStore } from '@reduxjs/toolkit';

import abacusStateManager from '@/lib/abacus';
import appMiddleware from './appMiddleware';
import localizationMiddleware from './localizationMiddleware';

import { accountSlice } from './account';
import { appSlice } from './app';
import { assetsSlice } from './assets';
import { configsSlice } from './configs';
import { dialogsSlice } from './dialogs';
import { inputsSlice } from './inputs';
import { layoutSlice } from './layout';
import { localizationSlice } from './localization';
import { perpetualsSlice } from './perpetuals';

export const commandMenuSlices = [layoutSlice, localizationSlice];

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    app: appSlice.reducer,
    assets: assetsSlice.reducer,
    configs: configsSlice.reducer,
    dialogs: dialogsSlice.reducer,
    inputs: inputsSlice.reducer,
    layout: layoutSlice.reducer,
    localization: localizationSlice.reducer,
    perpetuals: perpetualsSlice.reducer,
  },

  middleware: (getDefaultMiddleware: any) => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    appMiddleware,
    localizationMiddleware,
  ],

  devTools: process.env.NODE_ENV !== 'production',
});

// Set store so (Abacus & v4-Client) classes can getState and dispatch
abacusStateManager.setStore(store);

export type RootStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
