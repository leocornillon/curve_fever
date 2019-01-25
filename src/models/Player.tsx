import GameOrchestrator from "../managers/GameOrchestrator";
import PlayerManager from "../managers/PlayerManager";
import BackgroundManager from "../managers/BackgroundManager";
import * as CONFIG from "../configs/player.config";
import ItemManager from "../managers/ItemManager";

export default class Player {

    private readonly id: number;
    private readonly rightControl: string;
    private readonly leftControl: string;
    private x: number;
    private y: number;
    private vx: number;
    private vy: number;
    private radius: number;
    private angle: number;
    private velocity: number;
    private color: string;
    private isSolid: boolean = true;
    private isDead: boolean = false;

    // Those boolean are mandatory to simulate a long keyPress
    private rotatingLeft: boolean = false;
    private rotatingRight: boolean = false;

    constructor(_id: number, _x: number, _y: number, _angle: number, _color: string, _left: string, _right: string) {
        this.id = _id;
        this.x = _x;
        this.y = _y;
        this.angle = _angle;
        this.color = _color;
        this.radius = CONFIG.DEFAULT_PLAYER_RADIUS;
        this.velocity = CONFIG.DEFAULT_PLAYER_VELOCITY;
        this.rightControl = _right;
        this.leftControl = _left;

        this.vx = this.velocity * Math.cos(this.angle);
        this.vy = this.velocity * Math.sin(this.angle);

        // Add a keyboard listener when the player start rotating
        document.addEventListener('keydown', (ev: KeyboardEvent) => {
            if(ev.key === this.rightControl) this.rotatingRight = true;
            else if(ev.key === this.leftControl) this.rotatingLeft = true;
        });

        // Stop rotating when the player release the key
        document.addEventListener('keyup', (ev: KeyboardEvent) => {
            if(ev.key === this.rightControl) this.rotatingRight = false;
            else if(ev.key === this.leftControl) this.rotatingLeft = false;
        });
    }

    private movePlayer = () => {

        // Rotate the player
        if(this.rotatingRight) this.angle += CONFIG.DEFAULT_PLAYER_ANGLE_TICK;
        if(this.rotatingLeft) this.angle -= CONFIG.DEFAULT_PLAYER_ANGLE_TICK;

        // Applying the velocity
        this.vx = this.velocity * Math.cos(this.angle);
        this.vy = this.velocity * Math.sin(this.angle);

        // Actually move the player
        this.x += this.vx;
        this.y += this.vy;
    };

    private drawPlayer = () => {

        // Get canvas
        const ctx = PlayerManager.getInstance().getContext();
        ctx.fillStyle = this.color;

        // Move the player
        ctx.beginPath();

        // Draw the players circle
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        // Draw the player trailer
        ctx.fill();
    };

    private savePlayerPosition = () => {

        // We don't save the position if the player is transparent
        if(!this.isSolid) return;

        const canvas = BackgroundManager.getInstance();
        const buffer = canvas.getBufferPlayerPosition();
        buffer.push({
            id: this.id,
            angle: this.angle,
            x: this.x,
            y: this.y,
            radius: this.radius,
            color: this.color
        });
    };

    private checkPlayerStatus = () => {

        const canvas = BackgroundManager.getInstance();

        // If we are outside the board
        if( this.x + this.radius >= GameOrchestrator.getInstance().getWith() - 1 ||
            this.x - this.radius <= 1 ||
            this.y + this.radius >= GameOrchestrator.getInstance().getHeight() - 1 ||
            this.y - this.radius <= 1
        ) {
            this.isDead = true;
        }

        // If the player touch another player trailer, he is dead
        else {
            const gameBoard = canvas.getGameBoard();
            let colisionNumber = 0, colisionChecked = 0;
            for(let i=this.angle - Math.PI / 2; i<=this.angle + Math.PI / 2; i+=0.1) {
                const x = Math.ceil(this.x + this.radius * Math.cos(i));
                const y = Math.ceil(this.y + this.radius * Math.sin(i));
                if (gameBoard[x][y] !== 0 && this.isSolid) colisionNumber++;
                colisionChecked++;
            }
            // We need to apply a colision rate to be sure the colision is not an error
            if( colisionNumber / colisionChecked > 0.3) this.isDead = true;
        }


        // Change the color if the player is dead
        if(this.isDead){
            this.color = 'red';
        }
    };

    private checkPlayerItems = () => {
      const itemManager = ItemManager.getInstance();
      itemManager.getitemList().forEach((item) => {
          // Check if we touch the item
          if(Math.sqrt((this.x - item.getX()) ** 2 + (this.y - item.getY()) ** 2) < this.radius + item.getRadius())
            item.activate(this);
      })
    };

    public getId = () => this.id;

    public render() {

        // If the player is dead, we can leave
        if(this.isDead) return;

        this.movePlayer();

        if(Math.random() <= CONFIG.DEFAULT_PLAYER_TRANSPARENT_CHANCE && this.isSolid) this.setTransparent();

        this.checkPlayerStatus();

        this.checkPlayerItems();

        this.drawPlayer();

        if(!this.isDead) this.savePlayerPosition();

    };

    /************************************************
     * Here comes function that alterate the player's status
     ************************************************/

    public setTransparent = (delay?: number) => {
        this.isSolid = false;
        setTimeout(() => {
            this.isSolid = true;
        }, delay || CONFIG.DEFAULT_PLAYER_TRANSPARENT_TIME);
    };

    public accelerate = () => {
        this.velocity *= 2;
        setTimeout(() => {
            this.velocity /= 2;
        }, 3000)
    };

    public deccelerate = () => {
        this.velocity /= 2;
        setTimeout(() => {
            this.velocity *= 2;
        }, 3000)
    };

    public shrink = () => {
        this.radius -= 2;
        if (this.radius < 1) this.radius = 1;
        setTimeout(() => {
            this.radius += 2;
        }, 4000)
    };

    public expand = () => {
        this.radius += 3;
        setTimeout(() => {
            this.radius -= 3;
        }, 3000)
    };


}