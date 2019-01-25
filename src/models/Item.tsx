import ItemManager from "../managers/ItemManager";
import PlayerManager from "../managers/PlayerManager";
import Player from "./Player";
import {getRandomArbitrary} from '../utils/math';
import { DEFAULT_ITEM_RADIUS } from '../configs/item.config'
import BackgroundManager from "../managers/BackgroundManager";

const BONUS_LIST = ['accelerate', 'transparent', 'shrink', 'allAccelerate'];
const MALUS_LIST = ['deccelerate', 'expand', 'allDeccelerate'];
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
        this.category = Math.random() < 0.3 ? 'bonus' : Math.random() > 0.5 ? 'malus' : 'neutral'
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
            case 'deccelerate':
                player.deccelerate();
                break;
            case 'expand':
                player.expand();
                break;
            case 'allDeccelerate':
                PlayerManager.getInstance().getPlayerList().forEach((otherPlayer) => {
                    if(otherPlayer.getId() !== player.getId()) otherPlayer.deccelerate();
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
        // Get canvas
        const ctx = ItemManager.getInstance().getContext();

        // Draw circle
        if(this.category === 'bonus') ctx.fillStyle = 'green';
        else if(this.category === 'malus') ctx.fillStyle = 'red';
        else if(this.category === 'neutral') ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();

        // Draw text
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '15px serif';
        ctx.fillText(this.type, this.x , this.y + 7);
    };

}