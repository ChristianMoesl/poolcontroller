import './app.component.scss';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'poolcontroller-app',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    private title = 'Status';

    constructor(private titleService: Title) { }

    public ngOnInit() {
        this.setTitle(this.titleService.getTitle());
    }

    public setTitle(title: string) {
        this.title = title;
        this.titleService.setTitle(`Pool Controller: ${title}`);
    }
 }