import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.store';
import { ADD_SETTING, Setting } from './settings.reducer';
import { Observable } from 'rxjs/Observable';

@Component({
    template: `
        <h2>Settings:</h2>
        <ul>
            <li *ngFor="let setting of settings | async">
                {{setting.name}}
            </li>
        </ul>
    `
})
export class SettingsComponent {
   private settings: Observable<Array<Setting>>;

    constructor(private store: Store<AppState>) {
        this.settings = store.select(s => s.settings);
        
        this.store.dispatch({ 
            type: ADD_SETTING, 
            payload: { id: 0, name: 'one', group: 'g1', setting: 'on'}
        });

        setTimeout(() => {
        this.store.dispatch({ 
            type: ADD_SETTING, 
            payload: { id: 1, name: 'two', group: 'g1', setting: 'on'}
        });
        }, 2000);

setTimeout(() => {
        this.store.dispatch({ 
            type: ADD_SETTING, 
            payload: { id: 2, name: 'three', group: 'g1', setting: 'on'}
        });
        }, 4000);
    }
}