import { Types, Math, Scene } from 'phaser';
import { Player } from '../player/Player';
import { Enemy } from './Enemy';
import {EVENTS_NAME} from '../../GameEvents';

export class AIController {
    private scene: Scene;
    private target!: Player;
    private pawn: Enemy;
    private sightRadius = 80;
    private attackRadius = 22;
    private eventList: EVENTS_NAME[];

    constructor(pawn: Enemy, scene: Scene) {
        this.pawn = pawn;        
        this.scene = scene;
        this.eventList = [];
    }

    private calcDistance(aX: number, aY: number, bX: number, bY: number): number {
        const enemyPosition: Types.Math.Vector2Like = {x: aX, y: aY};
        const playerPosition: Types.Math.Vector2Like = {x: bX, y: bY};
        return Math.Distance.BetweenPoints(enemyPosition, playerPosition);        
    }

    public setTarget(target: Player): void {
        this.target = target;
    }

    public setSightRadius(radius: number): void {
        this.sightRadius = radius;
    }

    public update(): void {
        const dist: number = this.calcDistance(this.pawn.x, this.pawn.y, this.target.x, this.target.y);
        if (dist < this.sightRadius && dist > this.attackRadius) {
            this.scene.game.events.emit(EVENTS_NAME.enemyMoveTo);
        } else if (dist < this.attackRadius) {
            this.scene.game.events.emit(EVENTS_NAME.enemyAttack);
        } else {
            this.scene.game.events.emit(EVENTS_NAME.enemyIdle);
        }
    }

    public setAction(event: EVENTS_NAME, func: Function) {
        this.scene.game.events.on(event, () => {
            func(); 
        }, this);  
        this.eventList.push(event);
    }

    public removeAllActions() : void {
        this.eventList.forEach(event =>{
            const func = this.scene.game.events.listeners(event)[0]
            this.scene.game.events.removeListener(event, func);
        });        
    }
}