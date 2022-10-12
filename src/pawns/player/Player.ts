import { Scene } from 'phaser';
import { Actor } from '../Actor';
import { EVENTS_NAME } from '../../GameEvents';
import StateMachine from '../../StateMachine/StateMachine';
import { PlayerController } from './PlayerController';

export class Player extends Actor {
    private stateMachine : StateMachine;
    private playerController : PlayerController;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'atlas_player');

        this.stateMachine = new StateMachine(this, 'player');
        
        this.setStates();
        
        this.stateMachine.setState(EVENTS_NAME.idle);

        this.playerController = new PlayerController(scene);

        this.setEvent(EVENTS_NAME.idle);
        this.setEvent(EVENTS_NAME.moveDown);
        this.setEvent(EVENTS_NAME.moveLeft);
        this.setEvent(EVENTS_NAME.moveRight);
        this.setEvent(EVENTS_NAME.moveUp);

        this.scene.game.events.on('destroy', () => {
          this.playerController.removeAllActions();
        });

        this.getPhysBody().setSize(12, 12);
        this.getPhysBody().setOffset(6, 6);
    }

    private setStates() : void {
      this.stateMachine.addState(EVENTS_NAME.idle,{
        onEnter: () => {
          this.anims.play('runface', true);
          this.anims.stop();
        }
      })
      .addState(EVENTS_NAME.moveUp, {
        onUpdate: () => {
          this.body.velocity.y = -110;
          !this.anims.isPlaying && this.anims.play('runback', true);
        },
        onEnter: () => {
          this.anims.stop();
        }
      })
      .addState(EVENTS_NAME.moveDown, {
        onUpdate: () => {
          this.body.velocity.y = 110;
          !this.anims.isPlaying && this.anims.play('runface', true);
        },
        onEnter: () => {
          this.anims.stop();
        }
      })
      .addState(EVENTS_NAME.moveLeft, {
        onUpdate: () => {
          this.body.velocity.x = -110;
          //this.getPhysBody().setOffset(48, 15);
          !this.anims.isPlaying && this.anims.play('runleft', true);
        },
        onEnter: () => {
          this.anims.stop();
        }
      })
      .addState(EVENTS_NAME.moveRight, {
        onUpdate: () => {
          this.body.velocity.x = 110;
          //this.getPhysBody().setOffset(15, 15);
          !this.anims.isPlaying && this.anims.play('runright', true);
        },
        onEnter: () => {
          this.anims.stop();
        }
      });
    }

    private setEvent (event: EVENTS_NAME) {
      this.playerController.setAction(event, () => {
        this.stateMachine.setState(event);
      });
    }


    public update(dt:number): void {
      this.getPhysBody().setVelocity(0);
               
      this.stateMachine.update(dt); 
    }

    public getDamage(value?: number): void {
      super.getDamage(value);
  
      if (this.hp <= 0) {
        this.scene.game.events.emit(EVENTS_NAME.gameOver);
      }
    }
    
}