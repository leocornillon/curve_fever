import GameOrchestrator from './GameOrchestrator';


interface IPlayerPosition {
    id: number
    angle: number
    x: number
    y: number
    radius: number
    color: string
}

export default class BackgroundManager {

    private static instance: BackgroundManager;

    private gameOrchestrator: GameOrchestrator;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private bufferPlayerPosition: Array<IPlayerPosition> = [];
    private gameBoard: number[][];
    
    private constructor() { }

    public static getInstance() {
        if (!BackgroundManager.instance) {
            BackgroundManager.instance = new BackgroundManager();
        }
        return BackgroundManager.instance;
    }


    /**********************************
     * PRIVATE METHODS
     *********************************/

    private initializeGameBoard = () => {
        this.gameBoard = new Array<number[]>(this.gameOrchestrator.getWith());
        for(let i=0; i<this.gameOrchestrator.getWith(); i++){
            this.gameBoard[i] = new Array<number>(this.gameOrchestrator.getHeight());
        }
        for(let i=0; i<this.gameOrchestrator.getWith(); i++)
            for(let j=0; j<this.gameOrchestrator.getHeight(); j++)
                this.gameBoard[i][j] = 0;
    };

    private drawPlayerTrailers = () => {

        for(let position of this.bufferPlayerPosition) {
            this.ctx.fillStyle = position.color;
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, position.radius, 0, Math.PI * 2, false);
            this.ctx.fill();
        }

    };


    /**********************************
     * PUBLIC METHODS
     *********************************/

    public getBufferPlayerPosition = () => this.bufferPlayerPosition;
    public getGameBoard = () => this.gameBoard;

    public initializeCanvas = (_canvas?: HTMLCanvasElement) => {

        if(_canvas === undefined && this.canvas === undefined){
            throw new Error('Could not get a canvas for the background');
        }

        // Get the main game manager
        this.gameOrchestrator = GameOrchestrator.getInstance();

        this.canvas = _canvas || this.canvas;
        this.canvas.width = this.gameOrchestrator.getWith();
        this.canvas.height = this.gameOrchestrator.getHeight();

        // Set default canvas style
        this.canvas.style.zIndex = '1';
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

        // Initialize the gameboard
        this.initializeGameBoard();
        
    };

    public eraseTrailers = () => {
        // Clear the canvas
        this.ctx.clearRect(0, 0, GameOrchestrator.getInstance().getWith(), GameOrchestrator.getInstance().getHeight());

        // Erase old trailers
        for(let i=0; i<this.gameOrchestrator.getWith(); i++)
            for(let j=0; j<this.gameOrchestrator.getHeight(); j++)
                this.gameBoard[i][j] = 0;
    };

    public render = () => {
        this.drawPlayerTrailers();
        this.bufferPlayerPosition = [];
    }
    
}