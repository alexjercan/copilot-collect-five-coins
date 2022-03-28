// Create a class that will represent a map. The map will be characterized by a width and a height.
// The map will contain an array of bombs. Each bomb will be characterized by a position. The bombs is a dictionary with the x y keys.
// The map will also contain an array of coins. Each coin will be characterized by a position. The coins is a dictionary with the x y keys.
// Lastly, the map will contain the player position. The player object should also contain the number of coins.
class Map {
    // Create a constructor that will take as parameters the width and the height of the map, the number of bombs and the number of coins.
    constructor(width, height, numberOfBombs, numberOfCoins) {
        this.width = width;
        this.height = height;
        this.numberOfBombs = numberOfBombs;
        this.numberOfCoins = numberOfCoins;
        this.bombs = [];
        this.coins = [];
        this.player = {
            x: 0,
            y: 0,
            coins: 0
        }
        this.generateMap();
    }

    // Create a method that will generate the map. The bombs, coins and player should not be generated in the same position.
    generateMap() {
        // Create a list with all possible positions.
        let possiblePositions = [];
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                possiblePositions.push({
                    x: i,
                    y: j
                });
            }
        }

        // Shuffle the list of possible positions. Using the Fisher-Yates shuffle algorithm.
        for (let i = possiblePositions.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [possiblePositions[i], possiblePositions[j]] = [possiblePositions[j], possiblePositions[i]];
        }

        // Extract the bomb positions from the possible positions.
        for (let i = 0; i < this.numberOfBombs; i++) {
            this.bombs.push(possiblePositions.pop());
        }

        // Extract the coin positions from the possible positions.
        for (let i = 0; i < this.numberOfCoins; i++) {
            this.coins.push(possiblePositions.pop());
        }

        // Extract the player position from the possible positions.
        this.player = possiblePositions.pop();
        this.player.coins = 0;
    }

    // Create a method that will take as input a direction and will move the player in that direction.
    // If the player steps on a bomb, the player will die. If the player steps on a coin, the player will get a coin.
    // If the player moves out of the map, the player does not move. The function returns a boolean that will indicate 
    // if the player is alive or not and the number of coins the player has as a dictionary.
    movePlayer(direction) {
        let player = {
            x: this.player.x,
            y: this.player.y
        }

        // Move the player in the direction.
        switch (direction) {
            case 'up':
                player.y--;
                break;
            case 'down':
                player.y++;
                break;
            case 'left':
                player.x--;
                break;
            case 'right':
                player.x++;
                break;
        }

        // Check if the player is alive.
        if (player.x < 0 || player.x >= this.width || player.y < 0 || player.y >= this.height) {
            return {
                alive: true,
                coins: this.player.coins
            }
        }

        // Check if the player steps on a bomb.
        for (let i = 0; i < this.bombs.length; i++) {
            if (this.bombs[i].x === player.x && this.bombs[i].y === player.y) {
                return {
                    alive: false,
                    coins: this.player.coins
                }
            }
        }

        // Check if the player steps on a coin.
        for (let i = 0; i < this.coins.length; i++) {
            if (this.coins[i].x === player.x && this.coins[i].y === player.y) {
                this.player.coins++;
                this.coins.splice(i, 1);
            }
        }

        // Update the player position.
        this.player.x = player.x;
        this.player.y = player.y;

        // Return the player status.
        return {
            alive: true,
            coins: this.player.coins
        }
    }

    // Create a function that will return the map as a string, using the following format:
    // The empty spaces will be represented by a dot.
    // The bombs will be represented by a #.
    // The coins will be represented by a $.
    // The player will be represented by a @.
    toString() {
        let map = '';
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let found = false;
                for (let k = 0; k < this.bombs.length; k++) {
                    if (this.bombs[k].x === j && this.bombs[k].y === i) {
                        map += '#';
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    for (let k = 0; k < this.coins.length; k++) {
                        if (this.coins[k].x === j && this.coins[k].y === i) {
                            map += '$';
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    if (this.player.x === j && this.player.y === i) {
                        map += '@';
                    } else {
                        map += '.';
                    }
                }
            }
            map += '\n';
        }
        return map;
    }
}

// Create a function that will take as input a map as a string with the following characters:
// The empty spaces will be represented by a dot.
// The bombs will be represented by a #.
// The coins will be represented by a $.
// The player will be represented by a @.
// The lines are separated by new lines '\n'.
// The function will create a canvas and draw the map on it as a grid.
// The empty spaces will be represented by a white rectangle.
// The bombs will be represented by a red rectangle.
// The coins will be represented by a yellow rectangle.
// The player will be represented by a green rectangle.
// The function will return the canvas.
function drawMap(map, scale=50) {
    let canvas = document.createElement('canvas');

    // Split the map by newlines
    let lines = map.split('\n');

    // Get the width and height of the map
    let width = lines[0].length;
    let height = lines.length;

    // Set the canvas size
    canvas.width = width * scale;
    canvas.height = height * scale;

    // Get the context
    let ctx = canvas.getContext('2d');

    // Draw the map
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let char = lines[i][j];
            switch (char) {
                case '#':
                    ctx.fillStyle = 'red';
                    break;
                case '$':
                    ctx.fillStyle = 'yellow';
                    break;
                case '@':
                    ctx.fillStyle = 'green';
                    break;
                default:
                    ctx.fillStyle = 'white';
            }
            ctx.fillRect(j * scale, i * scale, scale, scale);
        }
    }

    // Draw borders around the squares
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            ctx.strokeRect(j * scale, i * scale, scale, scale);
        }
    }
    
    return canvas;
}

// ranodmly set the number of bombs between 5 and 15
let numberOfBombs = Math.floor(Math.random() * 15) + 5;
let numberOfCoins = Math.floor(Math.random() * 15) + 5;

let map = new Map(15, 15, numberOfBombs, numberOfCoins);
canvas = drawMap(map.toString());
document.body.appendChild(canvas);

document.addEventListener('keydown', function(event) {
    // Get the pressed key
    let key = event.key;

    // depending on the key (wasd) move the player convert the key pressed to a direction and save it as variable direction
    let direction = null;
    switch (key) {
        case 'w':
            direction = 'up';
            break;
        case 'a':
            direction = 'left';
            break;
        case 's':
            direction = 'down';
            break;
        case 'd':
            direction = 'right';
            break;
    }
            
    // the movePlayer function returns a dictionary with the player status, save it in a variable
    let playerStatus = map.movePlayer(direction);

    // Update the element with the id 'coins' from the DOM with the playerStatus.coins and the text '# Coins' where '#' is the number of coins
    document.getElementById('coins').innerHTML = playerStatus.coins + ' Coins';

    // update the canvas
    newCanvas = drawMap(map.toString());
    canvas.parentNode.replaceChild(newCanvas, canvas);
    canvas = newCanvas;

    // check if the player is alive
    if (!playerStatus.alive) {
        alert('You lost! You have ' + playerStatus.coins + ' coins.');

        // restart the game
        map = new Map(15, 15, numberOfBombs, numberOfCoins);
        newCanvas = drawMap(map.toString());
        canvas.parentNode.replaceChild(newCanvas, canvas);
        canvas = newCanvas;
    }

    // if the player has more or equal than 5 coins they win.
    if (playerStatus.coins >= 5) {
        alert('You won! You have ' + playerStatus.coins + ' coins.');

        // restart the game
        map = new Map(15, 15, numberOfBombs, numberOfCoins);
        newCanvas = drawMap(map.toString());
        canvas.parentNode.replaceChild(newCanvas, canvas);
        canvas = newCanvas;

        document.getElementById('coins').innerHTML = '0 Coins';
    }
});