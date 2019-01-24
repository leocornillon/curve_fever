
import BackgroundManager from "./BackgroundManager";
import PlayerManager from "./PlayerManager";
import UIManager from "./UIManager";

export default class GameOrchestrator {

    private static instance: GameOrchestrator;

    private backgroundManager: BackgroundManager;
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
        this.playerManager.render();
        this.uiManager.render();

        // Request a new frame
        window.requestAnimationFrame(this.render);
    };


    /**********************************
     * PUBLIC METHODS
     *********************************/

    public getWith = () => this.width;
    public getHeiht = () => this.height;

    public initializeGame = (
        backgroundCanvas: HTMLCanvasElement,
        playerCanvas: HTMLCanvasElement,
        uiCanvas: HTMLCanvasElement,
        ) => {

        // Setup canvas size
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        // Initialize managers
        this.backgroundManager = BackgroundManager.getInstance();
        this.playerManager = PlayerManager.getInstance();
        this.uiManager = UIManager.getInstance();
        this.backgroundManager.initializeCanvas(backgroundCanvas);
        this.playerManager.initializeCanvas(playerCanvas);
        this.uiManager.initializeCanvas(uiCanvas);

        // Add a listener in case the window is resized
        window.addEventListener("resize", () => {

            // Setup canvas size
            this.width = document.documentElement.clientWidth;
            this.height = document.documentElement.clientHeight;

            this.backgroundManager.initializeCanvas();
            this.playerManager.initializeCanvas();
        });

    };

    public startGame = () => {
        this.render();
    };

}