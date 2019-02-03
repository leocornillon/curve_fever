import ItemManager from "../managers/ItemManager";
import PlayerManager from "../managers/PlayerManager";
import Player from "./Player";
import {getRandomArbitrary} from '../utils/math';
import { DEFAULT_ITEM_RADIUS } from '../configs/item.config'
import BackgroundManager from "../managers/BackgroundManager";

// Import icons
import rabbit from '../assets/rabbit.png';
import tortoise from '../assets/tortoise.png';
import contract from '../assets/contract.png';
import expand from '../assets/expand.png';
import broom from '../assets/broom.png';
import invisible from '../assets/invisible.png';

const BONUS_LIST = ['accelerate', 'transparent', 'shrink', 'expand', 'decelerate', 'expand'];
const MALUS_LIST = ['AllDecelerate', 'allAccelerate'];
const NEUTRAL_LIST = ['erase'];

export default class Item {

    private x: number;
    private y: number;
    private radius: number = DEFAULT_ITEM_RADIUS;
    private category: 'bonus' | 'malus' | 'neutral';
    private type: string;

    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
        this.category = Math.random() < 0.2 ? 'neutral' : Math.random() > 0.5 ? 'malus' : 'bonus';
        let randomItem: number;
        if(this.category === 'bonus') {
            randomItem = Math.floor(getRandomArbitrary(0, BONUS_LIST.length));
            this.type = BONUS_LIST[randomItem];
        }
        else if (this.category === 'malus') {
            randomItem = Math.floor(getRandomArbitrary(0, MALUS_LIST.length));
            this.type = MALUS_LIST[randomItem];
        }
        else if (this.category === 'neutral') {
            randomItem = Math.floor(getRandomArbitrary(0, NEUTRAL_LIST.length));
            this.type = NEUTRAL_LIST[randomItem];
        }
    }

    private drawItem = () => {
        this.drawCircle();
        this.drawIcons();
    };

    private drawCircle = () => {
        // Get canvas
        const ctx = ItemManager.getInstance().getContext();

        if(this.category === 'bonus') ctx.fillStyle = 'green';
        else if(this.category === 'malus') ctx.fillStyle = 'red';
        else if(this.category === 'neutral') ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    };

    private drawIcons = () => {
        // Get canvas
        const ctx = ItemManager.getInstance().getContext();

        const img = new Image();
        switch(this.type) {
            case 'accelerate':
            case 'allAccelerate':
                img.src = rabbit;
                break;
            case 'decelerate':
            case 'allDecelerate':
                img.src = tortoise;
                break;
            case 'shrink':
                img.src = contract;
                break;
            case 'expand':
                img.src = expand;
                break;
            case 'erase':
                img.src = broom;
                break;
            case 'transparent':
                img.src = invisible;
                break;
            default: console.log('No image', this.type); break;
        }
        img.width = DEFAULT_ITEM_RADIUS;
        img.height = DEFAULT_ITEM_RADIUS;
        ctx.drawImage(img, this.x - DEFAULT_ITEM_RADIUS / 2, this.y - DEFAULT_ITEM_RADIUS / 2, DEFAULT_ITEM_RADIUS, DEFAULT_ITEM_RADIUS);
    };

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
            case 'allAccelerate':
                PlayerManager.getInstance().getPlayerList().forEach((otherPlayer) => {
                    if(otherPlayer.getId() !== player.getId()) otherPlayer.accelerate();
                });
                break;

            // Manage malus
            case 'decelerate':
                player.decelerate();
                break;
            case 'expand':
                player.expand();
                break;
            case 'alldecelerate':
                PlayerManager.getInstance().getPlayerList().forEach((otherPlayer) => {
                    if(otherPlayer.getId() !== player.getId()) otherPlayer.decelerate();
                });
                break;

            // Manage neutral items
            case 'erase':
                BackgroundManager.getInstance().eraseTrailers();
                break;
        }

        // Finally we can remove the item from the game
        ItemManager.getInstance().removeItem(this);
    };

    public render = () => {
        this.drawItem();
    };

}