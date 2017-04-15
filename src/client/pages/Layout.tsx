import * as React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
//import './Layout.scss';

interface Props { 
    children: Element;
}
interface State { }

export class Layout extends React.Component<Props, State> {
    render() {
        return (
            <div className="my-layout">
                <Header />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

