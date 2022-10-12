import { Scene, Input } from "phaser";
import {EVENTS_NAME} from '../../GameEvents';

export class PlayerController {
    private scene: Scene;
    private eventList: EVENTS_NAME[];

    constructor(scene: Scene) {
        this.scene = scene;
        this.eventList = [];

        this.setKeyboardEvent('W', EVENTS_NAME.moveUp, EVENTS_NAME.idle);
        this.setKeyboardEvent('S', EVENTS_NAME.moveDown, EVENTS_NAME.idle);
        this.setKeyboardEvent('A', EVENTS_NAME.moveLeft, EVENTS_NAME.idle);
        this.setKeyboardEvent('D', EVENTS_NAME.moveRight, EVENTS_NAME.idle);
    }

    private setKeyboardEvent(keyName: string, eventDown: EVENTS_NAME, eventUp: EVENTS_NAME) : void {
        const key: Input.Keyboard.Key = this.scene.input.keyboard.addKey(keyName);

        key.on('down', (event: KeyboardEvent) => { 
            this.scene.game.events.emit(eventDown);
        });

        key.on('up', (event: KeyboardEvent) => {            
            this.scene.game.events.emit(eventUp);
        });
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