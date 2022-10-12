import { Scene, Math } from 'phaser';
import { Actor } from '../Actor';
import { Player } from '../player/Player';
import { AIController } from './AIController';
import StateMachine from '../../StateMachine/StateMachine';
import {EVENTS_NAME} from '../../GameEvents';

export class Enemy extends Actor {
    private stateMachine: StateMachine;
    private target: Player;
    
    private aiController: AIController;

    constructor (scene: Scene, x: number, y: number, texture: string, target: Player, frame?: string | number) {
        super(scene, x, y, 'atlas_bee_fly');

        this.target = target;

                
        this.stateMachine = new StateMachine(this, 'enemy_bee');
        
        this.setStates();
        
        this.stateMachine.setState(EVENTS_NAME.enemyIdle);

        this.getPhysBody().setSize(32, 32);
        this.getPhysBody().setOffset(16, 16);

        this.aiController = new AIController(this, scene);
        this.aiController.setTarget(target);
        this.setEvent(EVENTS_NAME.enemyIdle);
        this.setEvent(EVENTS_NAME.enemyMoveTo);
        this.setEvent(EVENTS_NAME.enemyAttack);    
        
        
        this.setDebug(true, true, 145);
    }
 
    private setStates(): void {
        this.stateMachine.addState(EVENTS_NAME.enemyIdle,{
            onUpdate: () => {
                this.getPhysBody().setVelocity(0,0);
                !this.anims.isPlaying && this.anims.play('fly', true);
            },
          })
          .addState(EVENTS_NAME.enemyMoveTo, {
            onUpdate: () => {
                this.getPhysBody().setVelocityX(this.target.x - this.x);
                this.getPhysBody().setVelocityY(this.target.y - this.y);
                
                if(this.updateFlip()) {this.getPhysBody().setOffset(48, 16);} else {this.getPhysBody().setOffset(16, 16);}

                !this.anims.isPlaying && this.anims.play('fly', true);         
            }            
          })          
          .addState(EVENTS_NAME.enemyAttack, {
            onUpdate: () => {
                this.getPhysBody().setVelocity(0,0);
              !this.anims.isPlaying && this.anims.play('attack', true);
            },            
          });
    }

    preUpdate(time:number, dt:number): void {
        super.preUpdate(time, dt);
        this.aiController.update();
        
    }

    public update(dt:number): void {             
        this.stateMachine.update(dt);            
    }

    private setEvent (event: EVENTS_NAME) {
        this.aiController.setAction(event, () => {
          this.stateMachine.setState(event);
        });
    }

    private showDebug(): void {
        const debugGraphics = this.scene.add.graphics().setAlpha(0.7);
        this.debugShowBody = true;
      }
}