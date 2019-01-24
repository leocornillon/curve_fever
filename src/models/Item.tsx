import ItemManager from "../managers/ItemManager";
import {getRandomArbitrary} from '../utils/math';
import { DEFAULT_ITEM_RADIUS } from '../configs/item.config'

const BONUS_LIST = ['accelerate', 'transparent'];
const MALUS_LIST = ['deccelerate'];

export default class Item {

    private x: number;
    private y: number;
    private isBonus: boolean;
    private type: string;

    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
        this.isBonus = Math.random() > 0.5;
        const randomItem = this.isBonus ? getRandomArbitrary(0, BONUS_LIST.length - 1) : getRandomArbitrary(0, MALUS_LIST.length - 1);
        this.type = this.isBonus ? BONUS_LIST[randomItem] : MALUS_LIST[randomItem];
    }

    public getIsBonus = () => this.isBonus;
    public getType = () => this.type;
    public getX = () => this.x;
    public getY = () => this.y;

    public render = () => {
        // Get canvas
        const ctx = ItemManager.getInstance().getContext();
        ctx.fillStyle = this.isBonus ? 'green' : 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, DEFAULT_ITEM_RADIUS, 0, Math.PI * 2, false);
        ctx.fill();
    }

}