import './index.scss'

class Vector{
    x: number;
    y: number; 
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
    add(vector: Vector){
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    scale(multiplier: number){
        this.x *= multiplier;
        this.y *= multiplier;
        return this;
    }
    abs(): number{
        return Math.hypot(this.x, this.y);
    }
    clone(): Vector{
        return new Vector(this.x, this.y);
    }    
};

class Main{
    private lastAnimation: number = null;
    private context: CanvasRenderingContext2D;
    private angle: number = 0;
    constructor(parent: HTMLElement){
        const canvas = document.createElement('canvas');
        canvas.width = (2500);
        canvas.height = (1200);        
        const context = canvas.getContext('2d');
        this.context = context;
        parent.append(canvas);
        context.fillStyle = ('#c7375c01');
        context.strokeStyle = ('#ffffff');
        context.lineWidth = 3;
        context.fillRect(0, 0, canvas.width, canvas.height);
        //let this.angle = 0;                  
        //render();        
    }
    private render(){
        const context = this.context;
        const canvas = this.context.canvas;
        const center = new Vector(canvas.width / 2, canvas.height /2);
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        const point = new Vector(Math.sin(this.angle), Math.cos(this.angle)).scale(400).add(center);
        //this.angle += (0.05);
        //this.angle += (Math.PI + 0.01);
        //this.angle += (Math.PI * 2 / 3 + 0.01); // triangle
        //this.angle += (Math.PI * 2 / 4 + 0.01);
        this.angle += (Math.PI * 5 / 4 + 0.01); // star
        //this.angle += (Math.PI * 20 / 4 + 0.01);
        const nextPoint = new Vector(Math.sin(this.angle), Math.cos(this.angle)).scale(400).add(center);
        context.moveTo(point.x, point.y);            
        context.lineTo(nextPoint.x, nextPoint.y);
        context.stroke();
        context.closePath();            
        this.lastAnimation = requestAnimationFrame(() => {
            this.render();
        });
        canvas.toDataURL();                        
    }  
    start(){
        this.render();
    }  
    stop(){
        cancelAnimationFrame(this.lastAnimation);
    }       
};

const main = new Main(document.body);

const a = 10;
function Zhan(b: string): boolean{
    return true;
}

function buttonCreate(onClick: () => void): HTMLElement{
    const button = document.createElement('button');
    button.textContent = 'rotate me';
    button.className = 'rotate_button';
    button.onclick = () => {
        onClick();        
    }
    return button;    
}
function addButton(start: boolean){
    const button = buttonCreate(() => {
        if (start){
            main.start();
        } else {
            main.stop();
        }
        button.remove();
        addButton(!start);
    })
    document.body.append(button);
};
addButton(true);


//const array = [1, 2, 3, 4, 5];
//const cd = array.map(item => item *2);







