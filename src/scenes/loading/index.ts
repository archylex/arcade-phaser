import { Scene } from 'phaser';
import { AnimationLoader } from '../../AnimationLoader';

export class LoadingScene extends Scene {
    private animationLoader: AnimationLoader;

    constructor() {
        super('scene_loading');

        this.animationLoader = new AnimationLoader(this);
    }

    preload() : void {
        this.load.baseURL = 'assets/';

        this.animationLoader.load('atlas_player', 'spritesheets/Girl-Sheet.png', 'spritesheets/Girl-Sheet.json', 12);
        this.animationLoader.load('atlas_bee_fly', 'spritesheets/bee/Fly-Sheet.png', 'spritesheets/bee/Fly-Sheet.json', 16);
        this.animationLoader.load('atlas_bee_hit', 'spritesheets/bee/Hit-Sheet.png', 'spritesheets/bee/Hit-Sheet.json', 16);
        this.animationLoader.load('atlas_bee_attack', 'spritesheets/bee/Attack-Sheet.png', 'spritesheets/bee/Attack-Sheet.json', 16);

        this.load.image({
            key: 'crystal',
            url: 'spritesheets/crystal.png',
        });

        // MAP LOADING
        this.load.image({
            key: 'tiles',
            url: 'tilemaps/tiles/Tileset-Terrain2.png',
        });
        this.load.tilemapTiledJSON('terrain2', 'tilemaps/json/level1.json');
    }

    create(): void {
        this.animationLoader.createAllAnimations();

        this.scene.start('scene_level1');    
        this.scene.start('ui_scene');    
    }
}