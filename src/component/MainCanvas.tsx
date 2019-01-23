
import Player from './Player';
import Item from "./Item";
import {getRandomArbitrary, getRandomColor} from '../utils/math';
import {setInterval} from "timers";

const DEFAULT_ITEM_RATE = 0.001;

export default class MainCanvas {

    private static instance: MainCanvas;

    private width: number;
    private height: number;
    private playerList: Player[] = [];
    private itemList: Item[] = [];

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private ctxImage: ImageData;

    private bufferPlayerPosition: Array<{id: number, angle: number, x: number, y: number, radius: number, color: string}>;
    private gameBoard: number[][];

    private fps_counter: number = 0;

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
        const context = this.canvas.getContext("2d", { alpha: false });
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

        // First render
        this.render();

        // Add a listener in case the window is resized
        window.addEventListener("resize", () => {

            // Setup canvas size
            this.width = document.documentElement.clientWidth;
            this.height = document.documentElement.clientHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.drawBackground();
        });

        // Print FPS in the console
        setInterval(() => {
            console.log(`${this.fps_counter} FPS`);
            this.fps_counter = 0;
        }, 1000)
    };

    /**
     * Called each time the canvas needs to re-render
     */
    public render = () => {

        this.drawBackground();

        if(this.ctxImage !== undefined)
            this.ctx.putImageData(this.ctxImage, 0, 0);

        this.savePlayersPosition();

        this.drawPlayerTrailers();

        this.ctxImage = this.ctx.getImageData(0, 0, this.width, this.height);

        // Add and draw items
        this.manageItems();

        // Empty the positions buffer
        this.bufferPlayerPosition = [];

        // Render each players
        this.playerList.forEach(player => player.render());

        //Count the number of frames
        this.fps_counter++;

        // Request a new frame
        window.requestAnimationFrame(this.render);
    };

    public getContext = () => this.ctx;
    public getBufferPlayerPosition = () => this.bufferPlayerPosition;
    public getItemList = () => this.itemList;
    public getGameBoard = () => this.gameBoard;
    public getWith = () => this.width;
    public getHeiht = () => this.height;

    private initializePlayers = () => {
        this.playerList.push( new Player(
            1,
            getRandomArbitrary(0, this.width - 50),
            getRandomArbitrary(0, this.height - 50),
            Math.random() * Math.PI * 2,
            getRandomColor(),
            'ArrowLeft',
            'ArrowRight'
        ));
        this.playerList.push( new Player(
            2,
            getRandomArbitrary(0, this.width - 50),
            getRandomArbitrary(0, this.height - 50),
            Math.random() * Math.PI * 2,
            getRandomColor(),
            'q',
            'd'
        ));
    };

    private initializeGameBoard = () => {
        this.gameBoard = new Array<number[]>(this.width);
        for(let i=0; i<this.width; i++){
            this.gameBoard[i] = new Array<number>(this.height);
        }
        for(let i=0; i<this.width; i++)
            for(let j=0; j<this.height; j++)
                this.gameBoard[i][j] = 0;
    };

    private savePlayersPosition = () => {
        // Get the latest positions of the players
        for(let position of this.bufferPlayerPosition){
            // Save the latest position in the game board
            for(let i=((position.angle + Math.PI) % Math.PI*2) - Math.PI / 2 + 0.2; i<((position.angle + Math.PI) % Math.PI*2) + Math.PI / 2; i+=0.1){
                const x = Math.ceil(position.x + position.radius * Math.cos(i));
                const y = Math.ceil(position.y + position.radius * Math.sin(i));
                this.gameBoard[x][y] = position.id;
            }
        }

    };

    private drawPlayerTrailers = () => {

        for(let position of this.bufferPlayerPosition) {
            this.ctx.fillStyle = position.color;
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, position.radius, 0, Math.PI * 2, false);
            this.ctx.fill();
        }

    };

    private drawBackground = () => {
        this.ctx.fillStyle = 'black';
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillRect(0, 0, this.width, this.height);
    };

    private manageItems = () => {
        if(Math.random() < DEFAULT_ITEM_RATE){
            this.itemList.push(new Item(
                getRandomArbitrary(0, this.width),
                getRandomArbitrary(0, this.height)
            ))
        }

        this.itemList.forEach(item => item.render());
    }


}