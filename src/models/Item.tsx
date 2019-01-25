import ItemManager from "../managers/ItemManager";
import Player from "./Player";
import {getRandomArbitrary} from '../utils/math';
import { DEFAULT_ITEM_RADIUS } from '../configs/item.config'

const BONUS_LIST = ['accelerate', 'transparent', 'shrink'];
const MALUS_LIST = ['deccelerate', 'expand'];

export default class Item {

    private x: number;
    private y: number;
    private radius: number = DEFAULT_ITEM_RADIUS;
    private isBonus: boolean;
    private type: string;

    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
        this.isBonus = Math.random() > 0.5;
        const randomItem = this.isBonus ? Math.floor(getRandomArbitrary(0, BONUS_LIST.length)) : Math.floor(getRandomArbitrary(0, MALUS_LIST.length));
        this.type = this.isBonus ? BONUS_LIST[randomItem] : MALUS_LIST[randomItem];
    }

    public getX = () => this.x;
    public getY = () => this.y;
    public getRadius = () => this.radius;

    public activate = (player: Player) => {

        // Affect the player depending on the item
        switch(this.type) {
            // Manage bonus
            case 'transparent':
                player.setTransparent(5000);
                break;
            case 'accelerate':
                player.accelerate();
                break;
            case 'shrink':
                player.shrink();
                break;

            // Manage malus
            case 'deccelerate':
                player.deccelerate();
                break;
            case 'expand':
                player.expand();
                break;
        }

        // Finally we can remove the item from the game
        ItemManager.getInstance().removeItem(this);
    };

    public render = () => {
        // Get canvas
        const ctx = ItemManager.getInstance().getContext();
        ctx.fillStyle = this.isBonus ? 'green' : 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    };

}