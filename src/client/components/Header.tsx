import * as React from 'react';
import { Navigation } from './Header/Navigation';

interface Props { }
interface State { }

export class Header extends React.Component<Props, State> {
    render() {
        return (
            <header>
                <Navigation />
            </header>
        );
    }
}
