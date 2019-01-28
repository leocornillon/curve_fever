import * as React from 'react';

import GameContainer from './GameContainer';
import InterfaceContainer from './InterfaceContainer';
import GameOrchestrator from '../managers/GameOrchestrator';

import './MainLayout.css';

interface MainLayoutProps {}
interface MainLayoutState {}

export default class MainLayout extends React.Component<MainLayoutProps, MainLayoutState> {

    componentDidMount(){
        // Start the game
        GameOrchestrator.getInstance().startGame();

    }

    render() {
        return (
            <div className={'mainContainer'}>
                <GameContainer/>
                <InterfaceContainer/>
            </div>
        )
    }

}