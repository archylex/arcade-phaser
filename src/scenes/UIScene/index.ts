import { Scene } from "phaser";
import { Label } from "../../components/Label";

export class UIScene extends Scene {
    private testText!: Label;

    constructor() {
        super('ui_scene');
        
        
        
    }

    create(): void {
        this.testText = new Label(this, 100, 100, 'Testing...');
        
        setTimeout(()=>{this.scene.stop('ui_scene');},2000)
    }

}