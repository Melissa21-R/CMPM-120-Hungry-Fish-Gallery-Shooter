// Melissa Rosales
// Created: 4/23/2024
// Phaser: 3.70.0
//
// 1-D Movement
//
// An example of putting sprites on the screen using Phaser and getting them to move/emit other objects
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 800,
    height: 600,
    backgroundColor: 0x4682B4,
    scene: [Enimies, Movement, GameOver],
    fps: { forceSetTimeOut: true, target: 30 }
}

// Global variable to hold sprites
var my = {sprite: {}};

const game = new Phaser.Game(config);
