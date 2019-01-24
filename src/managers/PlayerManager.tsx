import GameOrchestrator from './GameOrchestrator';
import Player from '../models/Player';
import BackgroundManager from "./BackgroundManager";
import {getRandomArbitrary, getRandomColor} from '../utils/math';

export default class PlayerManager {

    private static instance: PlayerManager;

    private gameOrchestrator: GameOrchestrator;
    private backgroundManager: BackgroundManager;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private playerList: Player[] = [];

    private constructor() { }

    public static getInstance() {
        if (!PlayerManager.instance) {
            PlayerManager.instance = new PlayerManager();
        }
        return PlayerManager.instance;
    }


    /**********************************
     * PRIVATE METHODS
     *********************************/

    private initializePlayers = () => {
        this.playerList.push( new Player(
            1,
            getRandomArbitrary(0, this.gameOrchestrator.getWith() - 50),
            getRandomArbitrary(0, this.gameOrchestrator.getHeight() - 50),
            Math.random() * Math.PI * 2,
            getRandomColor(),
            'ArrowLeft',
            'ArrowRight'
        ));
        this.playerList.push( new Player(
            2,
            getRandomArbitrary(0, this.gameOrchestrator.getWith() - 50),
            getRandomArbitrary(0, this.gameOrchestrator.getHeight() - 50),
            Math.random() * Math.PI * 2,
            getRandomColor(),
            'q',
            'd'
        ));
    };

    private savePlayersPosition = () => {

        for(let position of this.backgroundManager.getBufferPlayerPosition()){
            for(let i=((position.angle + Math.PI) % Math.PI*2) - Math.PI / 2 + 0.2; i<((position.angle + Math.PI) % Math.PI*2) + Math.PI / 2; i+=0.1){
                const x = Math.ceil(position.x + position.radius * Math.cos(i));
                const y = Math.ceil(position.y + position.radius * Math.sin(i));
                this.backgroundManager.getGameBoard()[x][y] = position.id;
            }
        }

    };

    private drawPlayers = () => {
        this.playerList.forEach(player => player.render());
    };


    /**********************************
     * PUBLIC METHODS
     *********************************/

    public getContext = () => this.ctx;
    public getPlayerList = () => this.playerList;

    public initializeCanvas = (_canvas?: HTMLCanvasElement) => {

        if(_canvas === undefined && this.canvas === undefined){
            throw new Error('Could not get a canvas for the player');
        }

        // Get the game managers
        this.gameOrchestrator = GameOrchestrator.getInstance();
        this.backgroundManager = BackgroundManager.getInstance();

        this.canvas = _canvas || this.canvas;
        this.canvas.width = this.gameOrchestrator.getWith();
        this.canvas.height = this.gameOrchestrator.getHeight();

        // Set default canvas style
        this.canvas.style.zIndex = '3';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.position = 'absolute';

        //Set context
        const context = this.canvas.getContext("2d");
        if(context === null) {
            throw new Error(`Could not create player canvas context`);
        } else {
            this.ctx = context;
        }

        // Initialize the gameboard
        this.initializePlayers();

    };

    public render = () => {
        this.ctx.clearRect(0, 0, this.gameOrchestrator.getWith(), this.gameOrchestrator.getHeight());
        this.drawPlayers();
        this.savePlayersPosition();
    }

}