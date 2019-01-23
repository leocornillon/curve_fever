import MainCanvas from "./MainCanvas";

const DEFAULT_VELOCITY = 2;
const DEFAULT_RADIUS = 5;
const DEFAULT_ANGLE_TICK = Math.PI / 50;
const DEFAULT_TRANSPARENT_CHANCE = 0.005;
const DEFAULT_TRANSPARENT_TIME = 300;
const DEFAULT_SAMPLING = 10;

export default class Player {

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
    private sampling: number = 0;

    // Those boolean are mandatory to simulate a long keyPress
    private rotatingLeft: boolean = false;
    private rotatingRight: boolean = false;

    constructor(_x: number, _y: number, _angle: number, _color: string) {
        this.x = _x;
        this.y = _y;
        this.angle = _angle;
        this.color = _color;
        this.radius = DEFAULT_RADIUS;
        this.velocity = DEFAULT_VELOCITY;

        this.vx = this.velocity * Math.cos(this.angle);
        this.vy = this.velocity * Math.sin(this.angle);

        // Add a keyboard listener when the player start rotating
        document.addEventListener('keydown', (ev: KeyboardEvent) => {
            if(ev.key === 'ArrowRight') this.rotatingRight = true;
            else if(ev.key === 'ArrowLeft') this.rotatingLeft = true;
        });

        // Stop rotating when the player release the key
        document.addEventListener('keyup', (ev: KeyboardEvent) => {
            if(ev.key === 'ArrowRight') this.rotatingRight = false;
            else if(ev.key === 'ArrowLeft') this.rotatingLeft = false;
        })
    }

    private movePlayer = () => {

        // Rotate the player
        if(this.rotatingRight) this.angle += DEFAULT_ANGLE_TICK;
        if(this.rotatingLeft) this.angle -= DEFAULT_ANGLE_TICK;

        // Applying the velocity
        this.vx = this.velocity * Math.cos(this.angle);
        this.vy = this.velocity * Math.sin(this.angle);

        // Actually move the player
        this.x += this.vx;
        this.y += this.vy;
    };

    private drawPlayer = () => {

        // Get canvas
        const ctx = MainCanvas.getInstance().getContext();
        ctx.fillStyle = this.color;

        // Move the player
        ctx.beginPath();

        // Draw the players circle
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        // Draw the player trailer
        ctx.fill();
    };

    private setTransparent = () => {
        this.isSolid = false;
        this.color = 'yellow';
        setTimeout(() => {
            this.isSolid = true;
            this.color = 'blue';
        }, DEFAULT_TRANSPARENT_TIME);
    };

    private savePlayerPosition = () => {

        console.log('Saving');

        // We don't save the position if the player is transparent
        if(!this.isSolid) return;

        const canvas = MainCanvas.getInstance();
        const buffer = canvas.getBufferPlayerPosition();
        buffer.push({
            angle: this.angle,
            x: this.x,
            y: this.y,
            radius: this.radius,
            color: this.color
        });
    };

    private checkPlayerStatus = () => {

        console.log('Checking');

        const canvas = MainCanvas.getInstance();

        // If we are outside the board
        if( this.x + this.radius >= canvas.getWith() - 1 ||
            this.x - this.radius <= 1 ||
            this.y + this.radius >= canvas.getHeiht() ||
            this.y - this.radius <= 0
        ) this.isDead = true;

        // If the player touch another player trailer
        const gameBoard = canvas.getGameBoard();
        for(let i=Math.ceil(this.x - this.radius); i<=Math.ceil(this.x + this.radius); i++)
            for(let j=Math.ceil(this.y - this.radius); j<=Math.ceil(this.y + this.radius); j++)
                if(gameBoard[i][j] && this.isSolid) this.isDead = true;


        // Change the color if the player is dead
        if(this.isDead) this.color = 'red';
    };

    public render() {

        // If the player is dead, we can leave
        if(this.isDead) return;

        this.movePlayer();

        if(Math.random() <= DEFAULT_TRANSPARENT_CHANCE && this.isSolid) this.setTransparent();

        if(this.sampling === DEFAULT_SAMPLING){
            this.checkPlayerStatus();
            this.sampling = 0;
        }

        this.drawPlayer();

        if(!this.isDead && this.sampling === Math.ceil(DEFAULT_SAMPLING / 2)) this.savePlayerPosition();

        this.sampling++;

    }

}