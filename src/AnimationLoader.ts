import { Scene } from "phaser";

type CountKey = {
    [key: string]: number;
};

type Atlas = {
    name: string,
    textureUrl: string,
    jsonUrl: string,
    frameRate: number
};

export class AnimationLoader {
    private scene: Scene;
    private atlases: Atlas[];

    constructor(scene: Scene) {
        this.scene = scene;
        this.atlases = [];
    }

    public load(key: string, textureUrl: string, jsonUrl: string, frameRate: number) {
        this.scene.load.atlas(key, textureUrl, jsonUrl);
        
        this.atlases.push({
            'name': key,
            'textureUrl': textureUrl,
            'jsonUrl': jsonUrl,
            'frameRate': frameRate
        });
    }

    public createAllAnimations(): void {
        this.atlases.forEach(atlas => {
            this.addAnimFromAtlas(atlas.name, atlas.frameRate);
        });
    }

    public addAnimFromAtlas(atlas: string, rate: number) {
        const frameNames: string[] = this.scene.textures.get(atlas).getFrameNames().map(e=>e.replace(/-\d+$/, ''));
        const counts: CountKey = {};
        frameNames.forEach((x: string) => { counts[x] = Number(counts[x] || 0) + 1; });        
        Object.entries(counts).forEach(e => this.addAnimation(e[0], atlas, e[1] - 1, rate));
    }
    
    public addAnimation(key: string, atlas: string, numFrames: number, frameRate: number) : void {
        this.scene.anims.create({
            key: key,
            frames: this.scene.anims.generateFrameNames(atlas, {
              prefix: `${key}-`,
              end: numFrames,
            }),
            frameRate: frameRate,
        });
    }

    public changeFrameRate(key: string, rate: number): void {
        this.scene.anims.get(key).frameRate = rate;        
    }
}