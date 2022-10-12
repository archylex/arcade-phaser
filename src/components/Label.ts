import { GameObjects, Scene } from 'phaser';

export class Label extends GameObjects.Text {
  constructor(scene: Scene, x: number, y: number, text: string) {    
    super(scene, x, y,text, {
        fontSize: '24',
        color: '#ff0000',
        stroke: '#000',
        strokeThickness: 4,
      });

    this.setOrigin(0, 0);

    scene.add.existing(this);
  }
}