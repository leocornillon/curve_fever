import * as React from 'react';

import GameOrchestrator from '../managers/GameOrchestrator';

interface MainLayoutProps {}
interface MainLayoutState {
    mainCanvas: GameOrchestrator
}

export default class MainLayout extends React.Component<MainLayoutProps, MainLayoutState> {

    componentDidMount(){

        // Assigned the canvas
        const gameOrchestrator = GameOrchestrator.getInstance();
        gameOrchestrator.initializeGame(
            this.refs.backroundCanvas as HTMLCanvasElement,
            this.refs.playerCanvas as HTMLCanvasElement,
            this.refs.UICanvas as HTMLCanvasElement
        );

        // Start the game
        gameOrchestrator.startGame();

    }

    render() {
        return (
            <React.Fragment>
                <canvas ref={'backroundCanvas'}/>
                <canvas ref={'itemsCanvas'} />
                <canvas ref={'playerCanvas'} />
                <canvas ref={'UICanvas'} />
            </React.Fragment>
        )
    }

}