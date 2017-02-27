/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import './Client.scss';
import Layout from './pages/Layout';
import Status from './pages/Status';
import Settings from './pages/Settings';

const app = document.getElementById('app');

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Status} />
            <Route path="status" component={Status} />
            <Route path="settings" component={Settings} />
        </Route>
    </Router>
, app);
