import * as React from 'react';

import MainCanvas from '../component/MainCanvas';

interface MainLayoutProps {}
interface MainLayoutState {
    mainCanvas: MainCanvas
}

export default class MainLayout extends React.Component<MainLayoutProps, MainLayoutState> {

    componentDidMount(){

        // Assigned the canvas
        const canvas = MainCanvas.getInstance();
        canvas.initializeCanvas(this.refs.mainCanvas as HTMLCanvasElement);
        this.setState({mainCanvas: canvas});

    }

    render() {
        return <canvas ref={'mainCanvas'}/>
    }

}