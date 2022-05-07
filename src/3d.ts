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
    vbuffer: DOMPoint[];
    ibuffer: number[];
    constructor(parent: HTMLElement){
        const canvas = document.createElement('canvas');
        canvas.width = (2500);
        canvas.height = (1200);        
        const context = canvas.getContext('2d');
        this.context = context;
        parent.append(canvas);
        context.fillStyle = ('#c7375c');
        context.strokeStyle = ('#ffffff');
        context.lineWidth = 3;
        context.fillRect(0, 0, canvas.width, canvas.height);
        const vbuffer = [
            new DOMPoint (-1, -1, -1, 1),
            new DOMPoint (1, -1, -1, 1),
            new DOMPoint (1, 1, -1, 1),
            new DOMPoint (-1, 1, -1, 1),
            new DOMPoint (-1, -1, 1, 1),
            new DOMPoint (1, -1, 1, 1),
            new DOMPoint (1, 1, 1, 1),
            new DOMPoint (-1, 1, 1, 1),            
        ];
        const ibuffer = [
            0, 1, 2,
            0, 2, 3, 
            4, 5, 6,
            4, 6, 7,            
            1, 5, 6,
            6, 2, 1,
            0, 4, 7,
            0, 3, 7,
            3, 7, 6,
            6, 2, 3,         
            0, 4, 5,
            5, 1, 0,
        ];
        this.vbuffer = vbuffer;
        this.ibuffer = ibuffer;
    }

        private render(){
        const context = this.context;
        const canvas = this.context.canvas;
        const center = new Vector(canvas.width / 2, canvas.height /2);
        context.fillRect(0, 0, canvas.width, canvas.height);
        const matrix = new DOMMatrix().         
        translate(0, 0, 10).rotate(this.angle, this.angle, 0);
        const projection = perspective(Math.PI/2, canvas.width/canvas.height, 1, 1000);
        this.angle += 1;
        const vbuffer = this.vbuffer.map(v => {
            const result = projection.multiply(matrix).transformPoint(v);
            return new DOMPoint(
                (((result.x/result.w)*0.5)+0.5)*canvas.width, 
                ((result.y/result.w)*(-0.5)+0.5)*canvas.height
            );
            //return result;
        })                      
        for (let i=0; i<this.ibuffer.length; i+=3) {
            const i1 = this.ibuffer[i];
            const i2 = this.ibuffer[i+1];
            const i3 = this.ibuffer[i+2];
            context.beginPath();       
            context.moveTo(vbuffer [i1].x, vbuffer [i1].y);            
            context.lineTo(vbuffer [i2].x, vbuffer [i2].y);
            context.lineTo(vbuffer [i3].x, vbuffer [i3].y);
            context.lineTo(vbuffer [i1].x, vbuffer [i1].y);
            context.stroke();
            context.closePath();  
        };                
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

/*const a = 10;
function Zhan(b: string): boolean{
    return true;
}*/

function buttonCreate(onClick: () => void): HTMLElement{
    const button = document.createElement('button');
    button.textContent = 'make me 3D';
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


function perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
    const dst = [];
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    dst[ 0] = f / aspect;
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = f;
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = (near + far) * rangeInv;
    dst[11] = -1;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = near * far * rangeInv * 2;
    dst[15] = 0;

    return new DOMMatrix(dst);
  }
