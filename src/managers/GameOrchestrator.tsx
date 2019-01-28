
import BackgroundManager from "./BackgroundManager";
import ItemManager from "./ItemManager";
import PlayerManager from "./PlayerManager";
import UIManager from "./UIManager";

export default class GameOrchestrator {

    private static instance: GameOrchestrator;

    private backgroundManager: BackgroundManager;
    private itemManager: ItemManager;
    private playerManager: PlayerManager;
    private uiManager: UIManager;

    private width: number;
    private height: number;

    private constructor() { }

    public static getInstance() {
        if (!GameOrchestrator.instance) {
            GameOrchestrator.instance = new GameOrchestrator();
        }
        return GameOrchestrator.instance;
    }

    /**********************************
     * PRIVATE METHODS
     *********************************/

    private render = () => {

        this.backgroundManager.render();
        this.itemManager.render();
        this.playerManager.render();
        this.uiManager.render();

        // Request a new frame
        window.requestAnimationFrame(this.render);
    };


    /**********************************
     * PUBLIC METHODS
     *********************************/

    public getWith = () => this.width;
    public getHeight = () => this.height;

    public initializeGame = (
        gameContainer: HTMLDivElement,
        backgroundCanvas: HTMLCanvasElement,
        itemCanvas: HTMLCanvasElement,
        playerCanvas: HTMLCanvasElement,
        uiCanvas: HTMLCanvasElement,
        ) => {

        // Setup canvas size
        this.width = gameContainer.clientWidth;
        this.height = gameContainer.clientHeight;

        // Initialize managers
        this.backgroundManager = BackgroundManager.getInstance();
        this.itemManager = ItemManager.getInstance();
        this.playerManager = PlayerManager.getInstance();
        this.uiManager = UIManager.getInstance();
        this.backgroundManager.initializeCanvas(backgroundCanvas);
        this.itemManager.initializeCanvas(itemCanvas);
        this.playerManager.initializeCanvas(playerCanvas);
        this.uiManager.initializeCanvas(uiCanvas);

        // Add a listener in case the window is resized
        window.addEventListener("resize", () => {

            // Setup canvas size
            this.width = gameContainer.clientWidth;
            this.height = gameContainer.clientHeight;

            this.backgroundManager.initializeCanvas();
            this.itemManager.initializeCanvas();
            this.playerManager.initializeCanvas();
            this.uiManager.initializeCanvas();
        });

    };

    public startGame = () => {
        this.render();
    };

}