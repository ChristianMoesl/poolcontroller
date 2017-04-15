import * as React from 'react';
import { ReactDOM } from 'react-dom';
import * as ReactRouter from 'react-router';

import './Client.scss';
import { Layout } from './pages/Layout';
import { Status } from './pages/Status';
import { Settings } from './pages/Settings';

const rr: any = ReactRouter;
const app = document.getElementById('app');

ReactDOM.render(
    <rr.Router history={rr.hashHistory}>
        <rr.Route path="/" component={Layout}>
            <rr.IndexRoute component={Status} />
            <rr.Route path="status" component={Status} />
            <rr.Route path="settings" component={Settings} />
        </rr.Route>
    </rr.Router>
, app);
