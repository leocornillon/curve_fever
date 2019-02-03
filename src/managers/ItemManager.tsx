import GameOrchestrator from './GameOrchestrator';
import Item from '../models/Item';
import {getRandomArbitrary} from "../utils/math";
import {DEFAULT_ITEM_APPARITION_RATE} from '../configs/item.config';

export default class ItemManager {

    private static instance: ItemManager;

    private gameOrchestrator: GameOrchestrator;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private itemList: Item[] = [];

    private constructor() { }

    public static getInstance() {
        if (!ItemManager.instance) {
            ItemManager.instance = new ItemManager();
        }
        return ItemManager.instance;
    }


    /**********************************
     * PRIVATE METHODS
     *********************************/

    private addItem = () => {
      if(Math.random() < DEFAULT_ITEM_APPARITION_RATE) {
          this.itemList.push(new Item(
              getRandomArbitrary(10, this.gameOrchestrator.getWith() - 10),
              getRandomArbitrary(10, this.gameOrchestrator.getHeight() - 10),
          ));
      }
    };

    private drawItems = () => {
        //this.ctx.clearRect(0, 0, this.gameOrchestrator.getWith(), this.gameOrchestrator.getHeight());
        this.itemList.forEach(item => item.render());
    };


    /**********************************
     * PUBLIC METHODS
     *********************************/

    public getContext = () => this.ctx;
    public getitemList = () => this.itemList;

    public initializeCanvas = (_canvas?: HTMLCanvasElement) => {

        if(_canvas === undefined && this.canvas === undefined){
            throw new Error('Could not get a canvas for items');
        }

        // Get the game managers
        this.gameOrchestrator = GameOrchestrator.getInstance();

        this.canvas = _canvas || this.canvas;
        this.canvas.width = this.gameOrchestrator.getWith();
        this.canvas.height = this.gameOrchestrator.getHeight();

        // Set default canvas style
        this.canvas.style.zIndex = '2';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.position = 'absolute';

        //Set context
        const context = this.canvas.getContext("2d");
        if(context === null) {
            throw new Error(`Could not create items canvas context`);
        } else {
            this.ctx = context;
        }
    };

    public removeItem = (item: Item) => {
        const index = this.itemList.indexOf(item);
        if (index > -1) {
            this.itemList.splice(index, 1);
        }

        // Clean the canvas
        this.ctx.clearRect(0, 0, this.gameOrchestrator.getWith(), this.gameOrchestrator.getHeight());
    };

    public render = () => {
        this.addItem();
        this.drawItems();
    }

}