
import Player from './Player';
import {getRandomArbitrary} from '../utils/math';

const DEFAULT_PLAYER_NUMBER = 1;

export default class MainCanvas {

    private static instance: MainCanvas;

    private width: number;
    private height: number;
    private playerList: Player[];

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private bufferPlayerPosition: Array<{angle: number, x: number, y: number, radius: number, color: string}>;
    private gameBoard: boolean[][];

    private constructor() { }

    public static getInstance() {
        if (!MainCanvas.instance) {
            MainCanvas.instance = new MainCanvas();
        }
        return MainCanvas.instance;
    }

    /**
     * Fonction used to properly setup the canvas the first time it renders
     */
    public initializeCanvas = (_canvas?: HTMLCanvasElement) => {

        if(this.canvas === undefined && _canvas === undefined){
            throw new Error('Could not get a canvas');
        }

        // Setup canvas size
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        this.canvas = _canvas || this.canvas;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Set default canvas style
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.position = 'absolute';

        //Set context
        const context = this.canvas.getContext("2d");
        if(context === null) {
            throw new Error(`Could not create main canvas context`);
        } else {
            this.ctx = context;
        }

        // Initiaize the player list
        this.initializePlayers();

        // Initialize the gameBoard
        this.bufferPlayerPosition = [];
        this.initializeGameBoard();

        // Draw the background
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // First render
        this.render();

        // Add a listener in case the window is resized
        window.addEventListener("resize", () => {

            // Setup canvas size
            this.width = document.documentElement.clientWidth;
            this.height = document.documentElement.clientHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.width, this.height);
        });
    };

    /**
     * Called each time the canvas needs to re-render
     */
    public render = () => {

        // Render each players
        this.playerList.forEach(player => player.render());

        this.drawPlayerTrailers();

        // Request a new frame
        window.requestAnimationFrame(this.render);
    };

    public getContext = () => this.ctx;
    public getBufferPlayerPosition = () => this.bufferPlayerPosition;
    public getGameBoard = () => this.gameBoard;
    public getWith = () => this.width;
    public getHeiht = () => this.height;

    private initializePlayers = () => {
        this.playerList = [];
        for(let i=0; i<DEFAULT_PLAYER_NUMBER ; i++){
            this.playerList.push(new Player(
                getRandomArbitrary(0, this.width),
                getRandomArbitrary(0, this.height),
                getRandomArbitrary(0, Math.PI * 2),
                'blue'
            ));
        }
    };

    private initializeGameBoard = () => {
        this.gameBoard = new Array<boolean[]>(this.width);
        for(let i=0; i<this.width; i++){
            this.gameBoard[i] = new Array<boolean>(this.height);
        }
        for(let i=0; i<this.width; i++)
            for(let j=0; j<this.height; j++)
                this.gameBoard[i][j] = false;
    };

    private drawPlayerTrailers = () => {

        // Get the latest positions of the players
        for(let position of this.bufferPlayerPosition){

            // Draw the latest postion
            this.ctx.fillStyle = position.color;
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, position.radius, 0, Math.PI * 2, false);
            this.ctx.fill();

            // Save the latest position in the game board
            for(let i=Math.ceil(position.x - position.radius); i<=Math.ceil(position.x + position.radius); i++)
                for(let j=Math.ceil(position.y - position.radius); j<=Math.ceil(position.y + position.radius); j++)
                    this.gameBoard[i][j] = true;
            /*for(let i=position.angle - Math.PI / 4; i<=position.angle + Math.PI / 4; i+=0.1){
                const x = Math.ceil(position.x + (position.radius + 1) * Math.cos(i));
                const y = Math.ceil(position.y + (position.radius + 1) * Math.sin(i));
                this.gameBoard[x][y] = true;
            }*/
        }

        // Empty the positions buffer
        this.bufferPlayerPosition = [];

    };


}