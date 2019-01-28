import * as React from 'react';

import './InterfaceContainer.css';

interface InterfaceContainerProps {}
interface InterfaceContainerState {}

export default class InterfaceContainer extends React.Component<InterfaceContainerProps, InterfaceContainerState> {

    render() {
        return (
            <div className={'interfaceContainer'} >
                <h1 className={'interfaceTitle'}>Curve Fever</h1>
            </div>
        )
    }

}