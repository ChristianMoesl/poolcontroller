import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default class Layout extends React.Component {
    propTypes = {
        children: React.PropTypes.element,
    };

    render() {
        return (
            <div>
                <Header />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}
