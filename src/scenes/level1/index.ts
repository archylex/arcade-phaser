import { Scene } from "phaser";
import { Player } from "../../pawns/player/Player";
import { Enemy } from "../../pawns/enemy/Enemy";
import { EVENTS_NAME } from "../../GameEvents";


export class Level1 extends Scene {
    private player!: Player;
    private enemies!: Enemy[];
    
    private map!: Phaser.Tilemaps.Tilemap;
    private tileset!: Phaser.Tilemaps.Tileset;
    private wallsLayer!: Phaser.Tilemaps.TilemapLayer;
    private groundLayer!: Phaser.Tilemaps.TilemapLayer;
    private stairsLayer!:Phaser.Tilemaps.TilemapLayer;
    private crystals!: Phaser.GameObjects.Sprite[];

    constructor() {
        super('scene_level1');
    }

    create(): void {
        this.initMap();
        this.player = new Player(this, 100, 100);

        this.physics.add.collider(this.player, this.wallsLayer);

        // test enemy
        this.enemies = [];
        const enemy = new Enemy(this, 230, 230, 'atlas_bee_fly', this.player);
        this.enemies.push(enemy);

        this.physics.add.overlap(
            this.player,
            enemy,
            (obj1, obj2) => {
              (obj1 as Player).getDamage(0.1);
              console.log((obj1 as Player).getHP());
            },
            undefined,
            this,
          );

        
        this.initCrystals();
        this.initCamera();
        this.showDebugWalls();          
    }
    
    update(time: number, delta: number): void {
        this.player.update(delta);

        this.enemies.forEach(enemy => {
            enemy.update(delta);
        });
    }

    private initCrystals(): void {
      const crystalPoints: Phaser.Types.Tilemaps.TiledObject[] = 
        this.map.filterObjects('Crystals', (obj) => obj.name === 'crystal_point');
      
  
      this.crystals = crystalPoints.map((crystal) =>
        this.physics.add.sprite(crystal.x!, crystal.y!, 'crystal').setScale(0.5),
      );
  
      this.crystals.forEach((crystal) => {
        this.physics.add.overlap(this.player, crystal, (obj1, obj2) => {
          this.game.events.emit(EVENTS_NAME.getCrystal);
          obj2.destroy();
        });
      });
    }

    private initMap(): void {
        this.map = this.make.tilemap({ key: 'terrain2', tileWidth: 32, tileHeight: 32 });        
        this.tileset = this.map.addTilesetImage('terrain2', 'tiles');
        this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0);
        this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0);
        this.stairsLayer = this.map.createLayer('Stairs', this.tileset, 0, 0);
        this.wallsLayer.setCollisionByProperty({ collides: true });
    
        this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height);
    }

    private initCamera(): void {
      this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
      this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
      this.cameras.main.setZoom(2);
    }

    private showDebugWalls(): void {
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.wallsLayer.renderDebug(debugGraphics, {
          tileColor: null,
          collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        });
      }
}