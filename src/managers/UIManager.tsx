import GameOrchestrator from './GameOrchestrator';

export default class UIManager {

    private static instance: UIManager;

    private gameOrchestrator: GameOrchestrator;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private fps: number = 0;
    private fps_counter: number = 0;

    private constructor() { }

    public static getInstance() {
        if (!UIManager.instance) {
            UIManager.instance = new UIManager();
        }
        return UIManager.instance;
    }


    /**********************************
     * PRIVATE METHODS
     *********************************/

    private drawUI = () => {
        this.ctx.clearRect(0, 0, this.gameOrchestrator.getWith(), this.gameOrchestrator.getHeiht());
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px serif';
        this.ctx.fillText(`${this.fps} FPS`, 20, 50);
    };


    /**********************************
     * PUBLIC METHODS
     *********************************/

    public initializeCanvas = (_canvas?: HTMLCanvasElement) => {

        if(_canvas === undefined && this.canvas === undefined){
            throw new Error('Could not get a canvas for the UI');
        }

        // Get the main game manager
        this.gameOrchestrator = GameOrchestrator.getInstance();

        this.canvas = _canvas || this.canvas;
        this.canvas.width = this.gameOrchestrator.getWith();
        this.canvas.height = this.gameOrchestrator.getHeiht();

        // Set default canvas style
        this.canvas.style.zIndex = '3';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.position = 'absolute';

        //Set context
        const context = this.canvas.getContext("2d");
        if(context === null) {
            throw new Error(`Could not create UI canvas context`);
        } else {
            this.ctx = context;
        }

        // Set timer to trigger the FPS rendering
        setInterval(() => {
            this.fps =  10 * this.fps_counter;
            this.fps_counter = 0;
        }, 100);

    };

    public render = () => {
        this.fps_counter++;
        this.drawUI();
    }

}