import React from 'react';
import { Link } from 'react-router';

export default class Navigation extends React.Component {
    constructor() {
        super();
        this.state = {
            collapsed: true,
        };
    }

    toggleCollapse() {
        const collapsed = !this.state.collapsed;
        this.setState({ collapsed });
    }

    render() {
        const { collapsed } = this.state;
        const navClass = collapsed ? 'collapse' : '';

        return (
            <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" onClick={() => this.toggleCollapse}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                    </div>
                    <div className={`navbar-collapse ${navClass}`} id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to="status" onClick={() => this.toggleCollapse}>Status</Link>
                            </li>
                            <li>
                                <Link to="settings" onClick={() => this.toggleCollapse}>Settings</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
