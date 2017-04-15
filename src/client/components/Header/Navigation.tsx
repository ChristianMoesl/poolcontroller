import * as React from 'react';
import * as ReactRouter from 'react-router';

const rr: any = ReactRouter;

interface Props { }
interface State {
    collapsed: boolean;
 }

export class Navigation extends React.Component<Props, State> {
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
                        <button type="button" className="navbar-toggle" onClick={() => this.toggleCollapse()}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                    </div>
                    <div className={`navbar-collapse ${navClass}`} id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li>
                                <rr.Link to="status" onClick={() => this.toggleCollapse()}>Status</rr.Link>
                            </li>
                            <li>
                                <rr.Link to="settings" onClick={() => this.toggleCollapse()}>Settings</rr.Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
