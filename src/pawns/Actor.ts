import { Physics, Scene } from 'phaser';

type CountKey = {
    [key: string]: number;
}

export class Actor extends Physics.Arcade.Sprite {
    protected hp = 100;

    constructor(scene: Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        scene.physics.add.existing(this);

        this.getPhysBody().setCollideWorldBounds(true);
    }

    public getHP(): number {
        return this.hp;
    }

    public getDamage(value?: number): void {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 5,
            yoyo: true,
            alpha: 0.5,
            onStart: () => {
                if (!value) return;
                this.hp -= value;                
            },
            onComplete: () => {
                this.setAlpha(1.0);
            },
        });
    }

    protected getPhysBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }

    protected updateFlip(): boolean {
        this.scaleX = this.body.velocity.x < 0 ? 1: -1;        
        return this.body.velocity.x > 0;
    }   
}