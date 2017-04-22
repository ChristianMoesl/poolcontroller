import { ModuleWithProviders } from '@angular/core';
import { combineReducers } from 'redux';
import { StoreModule } from '@ngrx/store';

import { SettingsState, settingsReducer } from './settings/settings.reducer';

export interface AppState {
    settings: SettingsState;
}

const rootReducer = combineReducers({
    settings: settingsReducer,
});

export const store: ModuleWithProviders = StoreModule.provideStore(rootReducer);
