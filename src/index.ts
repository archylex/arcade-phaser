import { Game, Scale, Types, WEBGL } from 'phaser';
import { EVENTS_NAME } from './GameEvents';

import { Level1, LoadingScene, UIScene } from './scenes';

import StateMachine from './StateMachine/StateMachine';

export const gameConfig : Types.Core.GameConfig = {
    title: 'Monster Among Us',
    type: WEBGL,
    parent: 'game-canvas',
    backgroundColor: '#000000',
    scale: {
        mode: Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    render: {
        antialiasGL: false,
        pixelArt: true
    },
    callbacks: {
        postBoot: () => { window.sizeChanged(); }
    },
    canvasStyle: 'display: block; width: 100%; height: 100%;',
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    scene: [LoadingScene, Level1, UIScene]
}

window.sizeChanged = () => {
    if (window.game.isBooted) {
        setTimeout(() => {
            window.game.scale.resize(window.innerWidth, window.innerHeight);  
            window.game.canvas.setAttribute(
                'style',
                `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
            );
        }, 100);
    }
};

window.onresize = () => window.sizeChanged();

document.body.classList.add('root');

window.game = new Game(gameConfig);

const stateMachine = new StateMachine(this, 'game');
stateMachine.addState(EVENTS_NAME.inGame,{
    onEnter: () => {
      console.log('[ in game ]');
    }
}).addState(EVENTS_NAME.gameOver,{
    onEnter: () => {
      console.log('[ game over ]');
    }
});
stateMachine.setState(EVENTS_NAME.inGame);

window.game.events.on(EVENTS_NAME.gameOver, () => {
    window.game.scene.getScene('scene_level1').scene.pause();
    stateMachine.setState(EVENTS_NAME.gameOver);
  });
