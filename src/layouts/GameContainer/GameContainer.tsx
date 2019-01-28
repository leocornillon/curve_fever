import * as React from 'react';

import GameOrchestrator from "../../managers/GameOrchestrator";

import './GameContainer.css';

interface GameContainerProps {}
interface GameContainerState {}

export default class GameContainer extends React.Component<GameContainerProps, GameContainerState> {

    private container = React.createRef<HTMLDivElement>();
    private background = React.createRef<HTMLCanvasElement>();
    private items = React.createRef<HTMLCanvasElement>();
    private players = React.createRef<HTMLCanvasElement>();
    private UI = React.createRef<HTMLCanvasElement>();

    componentDidMount(): void {
        // Check Canvas references
        if( this.container.current === null ||
            this.background.current === null ||
            this.items.current === null ||
            this.players.current === null ||
            this.UI.current === null) {
            throw Error ('Could not get Canvas');
        }

        // Assigned the canvas
        const gameOrchestrator = GameOrchestrator.getInstance();
        gameOrchestrator.initializeGame(
            this.container.current,
            this.background.current,
            this.items.current,
            this.players.current,
            this.UI.current
        );
    }

    render() {
        return (
            <div ref={this.container} className={'gameContainer'}>
                <canvas ref={this.background}/>
                <canvas ref={this.items} />
                <canvas ref={this.players} />
                <canvas ref={this.UI} />
            </div>
        )
    }

}