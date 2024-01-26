import { Text } from "./text.js";
import { Particle } from "./particle.js";

export class Visual {
    constructor() {
        this.text = new Text();

        this.texture = PIXI.Texture.from('./particle.png');

        this.particles = [];

        this.mouse = {
            x: 0,
            y: 0,
            radius: 100,
        };

        document.addEventListener('pointermove', this.onMove.bind(this));
    }

    show(stageWidth, stageHeight, stage) {
        if(this.container) {
            stage.removeChild(this.container);
        }

        this.pos = this.text.setText('A', 2, stageWidth, stageHeight);

        this.container = new PIXI.ParticleContainer(
            this.pos.length,
            {
                vertices: false,
                position: true,
                rotation: false,
                scale: false,
                uvs: false,
                tint: false,
            }
        )
        
        stage.addChild(this.container);

        this.particles = [];
        for(let i=0; i<this.pos.length; i++) {
            const item = new Particle(this.pos[i], this.texture);
            this.container.addChild(item.sprite);
            this.particles.push(item);
        }
    }

    animate() {
        for(let i=0; i<this.particles.length; i++) {
            // const item = this.particles[i];
            // const dx = this.mouse.x - item.x;
            // const dy = this.mouse.y - item.y; // item to mouse -> theta가 -x축 시작
            // const dist = Math.sqrt(dx * dx + dy * dy);
            // const minDist = item.radius + this.mouse.radius;

            // if(dist < minDist) {
            //     const angle = Math.atan2(dy, dx);
            //     const tx = item.x + Math.cos(angle) * minDist;
            //     const ty = item.y + Math.sin(angle) * minDist;
            //     const ax = tx - this.mouse.x;
            //     const ay = ty - this.mouse.y;
            //     item.vx -= ax;
            //     item.vy -= ay;
            // }

            const item = this.particles[i];
            const dx = item.x - this.mouse.x;
            const dy = item.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = item.radius + this.mouse.radius;

            if(dist < minDist) {
                const angle = Math.atan2(dy, dx);
                const ax = - dx + minDist * Math.cos(angle); // 가속도가 거리에 따른 일차함수 // 탄성체 max -kx 꼴
                const ay = - dy + minDist * Math.sin(angle); // -|d| -> 거리가 멀어지면 힘이 작아짐 / minDist -> d벡터 방향이지만 최댓값이 |minDist|임 이 함축되어 있는 식
                // 다른 가속도 공식
                // const ax = Math.pow((-dx + minDist * Math.cos(angle))/20, 3);
                // const ay = Math.pow((-dy + minDist * Math.sin(angle))/20, 3);

                item.vx += ax;
                item.vy += ay;
            }

            item.draw();
        }
    }

    onMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
}
