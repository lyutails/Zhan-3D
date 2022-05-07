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
    points: {pos: DOMPoint, angle: number}[]=[];
    rot: DOMPoint = new DOMPoint();
    keys: Record<string, boolean>;
    position: DOMPoint = new DOMPoint();
    constructor(parent: HTMLElement){        
        const keys: Record<string, boolean> = {};
        document.onkeyup = (e) => {
            keys [e.code] = false;
        }
        document.onkeydown = (e) => {
            keys [e.code] = true;
        }
        this.keys = keys;        
        for (let i=0; i<10; i+=1){
            const random = new DOMPoint(Math.random()*10-5, Math.random()*10-5, Math.random()*10+5);
            this.points.push({pos: random, angle: 0});
        }
        const canvas = document.createElement('canvas');
        canvas.onmousemove = (e) => {
            this.rot.x += e.movementX*0.01
            this.rot.y += e.movementY*0.01
        };
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

    private handleKey(){
        const direction = new DOMPoint();
        if (this.keys["KeyW"]){
            direction.y += 0.1;
        }
        if (this.keys["KeyA"]){
            direction.x += 0.1;
        }
        if (this.keys["KeyS"]){
            direction.y -= 0.1;
        }
        if (this.keys["KeyD"]){
            direction.x -= 0.1;
        }
        this.position.x += direction.x;
        this.position.y += direction.y;
    }

    private cube(projection: DOMMatrix, position: DOMPoint, angle: number){
        const context = this.context;
        const matrix = new DOMMatrix().         
        translate(position.x, position.y, position.z).rotate(angle, angle, 0);        
        //this.angle += 1;
        const vbuffer = this.vbuffer.map(v => {            
            return this.transform(projection, matrix, v);
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
    }

    private transform(projection: DOMMatrix, matrix: DOMMatrix, vector: DOMPoint) {
        const context = this.context;
        const canvas = this.context.canvas;
        const result = projection.multiply(matrix).transformPoint(vector);
            return new DOMPoint(
                (((result.x/result.w)*0.5)+0.5)*canvas.width,
                ((result.y/result.w)*(-0.5)+0.5)*canvas.height
            );
    }

        private render(){
            this.handleKey();        
            const context = this.context;
            const canvas = this.context.canvas;
            const center = new Vector(canvas.width / 2, canvas.height /2);
            context.fillRect(0, 0, canvas.width, canvas.height); 
            const projection = perspective(Math.PI/2, canvas.width/canvas.height, 1, 1000);
            const camera = new DOMMatrix().translate(this.position.x, 0, this.position.y).rotate(this.rot.y, this.rot.x);
            this.points.forEach((cube, i) => {
                cube.angle += (i*0.1);
                this.cube(projection.multiply(camera), cube.pos, cube. angle);
            });       
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

function buttonCreate(onClick: () => void): HTMLElement{
    const button = document.createElement('button');
    button.textContent = 'move me WASD 3D';
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
