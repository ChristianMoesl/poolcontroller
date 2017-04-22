import { ActionReducer, Action } from '@ngrx/store';

export const CHANGE_SETTING = 'CHANGE_SETTING';
export const ADD_SETTING = 'ADD_SETTING';

export class Setting {
    public id: number;
    public name: string;
    public group: string;
    public setting: any;
}

export type SettingsState = Setting[];

export function settingsReducer(state: SettingsState = [], action: Action): SettingsState {
    switch (action.type) {
        case CHANGE_SETTING:
            if (!action.payload || !action.payload.id || !action.payload.setting)
                throw new TypeError("Unknown  type");
            
            return state.map((item, index) => {
                if(item.id !== action.payload.id) 
                    return item;    // This isn't the item we care about - keep it as-is
                return {            // Otherwise, this is the one we want - return an updated value
                    id: action.payload.id,
                    name: Object.assign({}, item.name),
                    group: Object.assign({}, item.group),
                    setting: action.payload.setting
                };
            }); 
        case ADD_SETTING:
            if (!action.payload)
                throw new TypeError("Missing payload");

            return [
                ...state,
                action.payload
            ];
        default:
            return state;
    }
}