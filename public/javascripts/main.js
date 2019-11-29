
function rand(max) {
    return Math.floor(Math.random() * max);
}

function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function changeBrightness(factor, sprite) {
    var canvasElement = document.createElement("canvas");
    canvasElement.width = 500;
    canvasElement.height = 500;
    var context = canvasElement.getContext("2d");
    context.drawImage(sprite, 0, 0, 500, 500);

    var img = context.getImageData(0, 0, 500, 500);

    for (var i = 0; i < img.data.length; i += 4) {
        img.data[i] = img.data[i] * factor;
        img.data[i + 1] = img.data[i + 1] * factor;
        img.data[i + 2] = img.data[i + 2] * factor;
    }
    context.putImageData(img, 0, 0);

    var spriteOutput = new Image();
    spriteOutput.src = canvasElement.toDataURL();
    canvasElement.remove();
    return spriteOutput;
}

function displayVictoryMess(moves) {
}

function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
        n: {
            y: -1,
            x: 0,
            o: "s"
        },
        s: {
            y: 1,
            x: 0,
            o: "n"
        },
        e: {
            y: 0,
            x: 1,
            o: "w"
        },
        w: {
            y: 0,
            x: -1,
            o: "e"
        }

    };

    this.map = function() {
        return mazeMap;
    };
    this.startCoord = function() {
        return startCoord;
    };
    this.endCoord = function() {
        return endCoord;
    };

    function genMap() {
        mazeMap = new Array(height);
        for (y = 0; y < height; y++) {
            mazeMap[y] = new Array(width);
            for (x = 0; x < width; ++x) {
                mazeMap[y][x] = {
                    n: false,
                    s: false,
                    e: false,
                    w: false,
                    visited: false,
                    priorPos: null
                };
            }
        }
    }

    function defineMaze() {
        var isComp = false;
        var move = false;
        var cellsVisited = 1;
        var numLoops = 0;
        var maxLoops = 0;
        var pos = {
            x: 0,
            y: 0
        };
        var numCells = width * height;
        while (!isComp) {
            move = false;
            mazeMap[pos.x][pos.y].visited = true;

            if (numLoops >= maxLoops) {
                shuffle(dirs);
                maxLoops = Math.round(rand(height / 8));
                numLoops = 0;
            }
            numLoops++;
            for (index = 0; index < dirs.length; index++) {
                var direction = dirs[index];
                var nx = pos.x + modDir[direction].x;
                var ny = pos.y + modDir[direction].y;

                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    //Check if the tile is already visited
                    if (!mazeMap[nx][ny].visited) {
                        //Carve through walls from this tile to next
                        mazeMap[pos.x][pos.y][direction] = true;
                        mazeMap[nx][ny][modDir[direction].o] = true;

                        //Set Currentcell as next cells Prior visited
                        mazeMap[nx][ny].priorPos = pos;
                        //Update Cell position to newly visited location
                        pos = {
                            x: nx,
                            y: ny
                        };
                        cellsVisited++;
                        //Recursively call this method on the next tile
                        move = true;
                        break;
                    }
                }
            }

            if (!move) {
                //  If it failed to find a direction,
                //  move the current position back to the prior cell and Recall the method.
                pos = mazeMap[pos.x][pos.y].priorPos;
            }
            if (numCells == cellsVisited) {
                isComp = true;
            }
        }
    }

    function defineStartEnd() {
        switch (rand(4)) {
            case 0:
                startCoord = {
                    x: 0,
                    y: 0
                };
                endCoord = {
                    x: height - 1,
                    y: width - 1
                };
                break;
            case 1:
                startCoord = {
                    x: 0,
                    y: width - 1
                };
                endCoord = {
                    x: height - 1,
                    y: 0
                };
                break;
            case 2:
                startCoord = {
                    x: height - 1,
                    y: 0
                };
                endCoord = {
                    x: 0,
                    y: width - 1
                };
                break;
            case 3:
                startCoord = {
                    x: height - 1,
                    y: width - 1
                };
                endCoord = {
                    x: 0,
                    y: 0
                };
                break;
        }
    }

    genMap();
    defineStartEnd();
    defineMaze();
}

function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    ctx.lineWidth = cellSize / 40;

    this.redrawMaze = function(size) {
        cellSize = size;
        ctx.lineWidth = cellSize / 50;
        drawMap();
        drawEndMethod();
    };

    function drawCell(xCord, yCord, cell) {
        var x = xCord * cellSize;
        var y = yCord * cellSize;

        if (cell.n == false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
        }
        if (cell.s === false) {
            ctx.beginPath();
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (cell.e === false) {
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (cell.w === false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        }
    }

    function drawMap() {
        for (x = 0; x < map.length; x++) {
            for (y = 0; y < map[x].length; y++) {
                drawCell(x, y, map[x][y]);
            }
        }
    }

    function drawEndSprite() {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        var coord = Maze.endCoord();
        ctx.drawImage(
            endSprite,
            2,
            2,
            endSprite.width,
            endSprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    function clear() {
        var canvasSize = cellSize * map.length;
        ctx.clearRect(0, 0, canvasSize, canvasSize);
    }

    if (endSprite != null) {
        drawEndMethod = drawEndSprite;
    } else {
        drawEndMethod = drawEndFlag;
    }
    clear();
    drawMap();
    drawEndMethod();
}

function Player(maze, c, _cellsize, onComplete, sprite = null) {
    var ctx = c.getContext("2d");
    var drawSprite;
    var moves = 0;
    drawSprite = drawSpriteCircle;
    if (sprite != null) {
        drawSprite = drawSpriteImg;
    }
    var player = this;
    var map = maze.map();
    var cellCoords = {
        x: maze.startCoord().x,
        y: maze.startCoord().y
    };
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;

    this.redrawPlayer = function(_cellsize) {
        cellSize = _cellsize;
        drawSpriteImg(cellCoords);
    };

    function drawSpriteCircle(coord) {
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(
            (coord.x + 1) * cellSize - halfCellSize,
            (coord.y + 1) * cellSize - halfCellSize,
            halfCellSize - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function drawSpriteImg(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.drawImage(
            sprite,
            0,
            0,
            sprite.width,
            sprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function removeSprite(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.clearRect(
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    function check(e) {
        var cell = map[cellCoords.x][cellCoords.y];
        moves++;
        switch (e.keyCode) {
            case 65:
            case 37: // west
                if (cell.w == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x - 1,
                        y: cellCoords.y
                    };
                    drawSprite(cellCoords);
                }
                break;
            case 87:
            case 38: // north
                if (cell.n == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x,
                        y: cellCoords.y - 1
                    };
                    drawSprite(cellCoords);
                }
                break;
            case 68:
            case 39: // east
                if (cell.e == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x + 1,
                        y: cellCoords.y
                    };
                    drawSprite(cellCoords);
                }
                break;
            case 83:
            case 40: // south
                if (cell.s == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x,
                        y: cellCoords.y + 1
                    };
                    drawSprite(cellCoords);
                }
                break;
        }
    }

    this.bindKeyDown = function() {
        window.addEventListener("keydown", check, false);

        $("#view").swipe({
            swipe: function(
                event,
                direction
            ) {
                console.log(direction);
                switch (direction) {
                    case "up":
                        check({
                            keyCode: 38
                        });
                        break;
                    case "down":
                        check({
                            keyCode: 40
                        });
                        break;
                    case "left":
                        check({
                            keyCode: 37
                        });
                        break;
                    case "right":
                        check({
                            keyCode: 39
                        });
                        break;
                }
            },
            threshold: 0
        });
    };

    this.unbindKeyDown = function() {
        window.removeEventListener("keydown", check, false);
        $("#view").swipe("destroy");
    };

    drawSprite(maze.startCoord());

    this.bindKeyDown();
}

var mazeCanvas = document.getElementById("canvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;
// sprite.src = 'media/sprite.png';

window.onload = function() {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }

    //Load and edit sprites
    var completeOne = false;
    var completeTwo = false;
    var isComplete = () => {
        if(completeOne === true && completeTwo === true)
        {
            console.log("Runs");
            setTimeout(function(){
                makeMaze();
            }, 500);
        }
    };
    sprite = new Image();
    sprite.src =
        "https://fjan.eu/jan/gamejam/can.png";
    sprite.onload = function() {
        sprite = changeBrightness(1.2, sprite);
        completeOne = true;
        console.log(completeOne);
        isComplete();
    };

    finishSprite = new Image();
    finishSprite.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBAQEA8NDg8PDw8NEA8NDQ8NDw0NFREWFhURExUYHSggGBolGxMVITEhJSkrOi4uFx8zODM4NygtLjcBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOcA2wMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAABAMFBgIBB//EAC8QAAIBAwMEAAUEAQUAAAAAAAABAgMEEQUhMRJBUWETInGBkRShsfAyI2LB0eH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+0gAAAAAAAAAAAAAAAAAHjkB6B51BkD0DzIZA9AMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAB42RyqASdRw5kXUeNgSOZ5khqVkiCVyA71B8RFTVvku4u9Q8bgXjrI8+OU0bmT9HcZvyBbxqkimVdObJo1GBYqR0JQqsmhVAnA5UjoAAAAAAAAAAAAAAAAAA5lI8nLAtUqAdzqEbkRSkcyqgSyngWrXSQndXqWd9iivdV8AXFe/S5ZU3WsPhFHc3zfcioNze4FvG8cvLG6NR+BSgkhuNRAOUqz7InjWl4EFcqJ07td3sBaRuCWneoplfRzjJOrheUBeU7uLJ4VYsoIVkxqkwLuMiWMirozl5G4VvIDgEUZkqAAAAAAAAAAADmUj1sXqzA4rVCBSCoyCVTCAK1bBVX9/hYyeX94opmZvLhttvvwB3qGoOXDKivc+We3M8L6lTUq9csANyuc/8IesprllUkkyV1ulbfgDQ0btJPgTvNSfbt3KtXqXLEZ3+W0uALaF5Vm9ngZ6aj5k/sUtG6x3JpaxhYTQF3bpp7tlpSpezJ0dXeUWtDW13W4F/RqSh9CytrxPuZuGpwl6+o3SqLZpgaulWGqc8meta785LS2rp+mBaRJqcxSEmvaJ4SyA0BxBnYAAAAABzNgcyYpJ8smnLYUqyxECGpPkrq1xs/A1XeI/Uo9TuOlY7gI31Vzl6RTXdf58PhFm5Yi2zPXlXM2wINRudn+EJ2z6Y57sWva2ZY9hWrpRAkrXqWV/WQfrc75K2tW2yVkrpptfcC9qXSZArpLgqadw5bt4wSKe6/uQGZ30m+TxXbi98sUdVJ5ePR7GpkC9tL70PRvXnOEZ6hWS223H6dZefsBpLe+6luljyX2m1V0rfPpmRsJqRe28MbxYGqoNdnh+Cyt5J7PZmVpXc44yi6sdRjNYfKA0VGo487ochLuiqtq3ZscpSw/QFlSnkmQlTkNQkBIAAAEVVkovVYEdV7CV3LCQ1UexXXs/lAXuZ8GZ1mf+pH0y6r1d0Z/Vnv1ewF9TrpRMrdXOG2XuqyzTRjb2q+pr2BBeV2pJkFW7y/QvqVfj2QqXkD27uMbexXr792RXM1nnk5lUxsB06uDv4r8iMqmcnUqu2AGJT7tnbuJbLgTjLcmi87/gB63l5e49QS8lLCW/O5PTrSXsDQUblxaLqx1R+dzI215vuy1t33TyBu7HUFPZljKitpR2a/cx9jWax4NPp10msMDR2Fx1JJ88FvazeNzK0K3RL0zSWNZPHsC0hIcoyEEhmgwHkB5FnoHjF63AxIWrcMBab2Ku9lsOuoV2oS+VgVVepvkpdVqfK37LGq/lfkzV9N9Mm/PAEVzVThz2Mlev5tvuW1ets0mUl3PD34Aq79PPohdXZfgYvVlFfOWEBFcoh6+DuUhbAHTe542ctngEkZHfxHxwQpnqAbpfkdov6fcq4Sfknp1JZ42AtJU09+PoN20pLjf0J0Kudixs1h+QLiwuWsZ+6LuhPjpe5SKjlbcjlhcYeHygNPa121iXKNHo1fKx4MhCtnEkX2i1d/TA2dvPYZp8idrwhqID1NkhFSZKBzMWl3GZire4FZXeJMrr2eUy11CGNyovIZTx4ArFHKMzqq6JSXaRo4TxlMpteScc9wMdcxw3tsVl68rGPoXN7PK9oz1SrlteAEK9TsJsfrQ6l4ZXzWNufYEFaC5RA0MVP2F5AcHh0eACPUeHSAkg0N0v2FIxGLeWAGKccNNFxayX0foqOpYHbJTyv7sBorKrnbuM1YcSXIpp0WuSxb29ANWlXY0ehVfmwZWzX7mj0T/JAfQLB5ih9FdpzLNIBiiTENEmA8kJV9mOsVroBS63iVMy0k+whcLAGZ1X5W2irk1NP2ai+oqSaa5MpdU3Qn/tb2Azep2kk3/cozVeOJN4N7qDUt9sGX1K0zxsBQ1YRku//QlUpNey1lS6e35F60PsBVTpC04jtZPgXnTf/oCzR5gmcMEeOwHiR0onShhr2TfDAKOzGIwRFCO43bICWNFNb/ks7GnjAqoP7MsaKawBbWqxv24H50W1xseWNDKT8/yXFvb4WGsgVFKGMF9on+QpcWfSsljoUPmQG20zsW0OCtsFui0QEtJEpxTR2AC9VDBxNAVFxsxO4WV9C2uqOSprfLs/sAo2mt+UUurWXXFotK8t8kNTdegMNVoNNxZXXdvLtujbXVnGSe25TXVFR2QGLq0c5ymVlynHhZRqrqluU99QSTAzyi3lvb0cTiO/pHnLTI6lk36yBW1lhLAU6P7lirbyHwMLH3yBXOnuiVxzsS9O+EhqnbYWQFLeGXuN29JJv2SUKHJ3KLWyW4HlJPqX1L+hb7Ir7K1fUsmrtbPK4A8s9sfZGqtaeYr2ZuyoN1enGUbC3odMUAje0vlwTaJb4kievT6mvQ7plHEgNBZwHsEFrDYaigJY8HoIAA8Z6AEM4lbe2+S2kiCrDIGPvKbjnJWOv0vDezNdeWieTM6ppzWWlsApWqprZlVdTi/qFeEo+UIVs7/yBFUw8/yVtzaqQ1U2fOx46ke4FP8ApZENS0aXsuJVYC9WpnhAZ+rSceRZ05yeEti9dk5PL3PZUMcLHsCqtrXHIzOjnZbD9Cyc3uiyWmYWQKmFskklyT29jl5HZWz7IeoWcliPeQCdnZ5lt5NFJdEMehm00xRSeNwqWrk8ASaHZ7dXds0PwsRIbC3SitsD3R1NLsgF4UNslhp1D9zxw7FlZ0sJAN0o4RPBHMUSAAAAAAAAMhkiY8lHICtSnkrbq39bFtKOCOUcgZDUdMT4RnbvT3HsfRq1smVt1p6fKA+b1rbyhd2SfY2d5o63wVdbTnECihpvpHjtEuUXKt/Z1CxWd3kCllbtrCWDyOnN9ss08aEF4OpdEV29AVNvpygssJ0XPZLYsYUZVHw8D9O0SXgDOqz6GsrLLOws9+uS+i8D7ornBJCk29kBxUaSJbG27sZp2fdjVKlgApw7IchTwd21r3ZP0Z2Ahp0sssqEMI4pUsDMIgdRR6AAAAAAAAAAAAeNEUoEx40ArJEUoIblTIZUwEqtBPsI17GL7FvJEbgBn6mlxfYXekr2aZ0kRyprwBnXpy4PY6ZHPHBdyt0z2NNLsBXwoYXyxOZ2/ktOhvhYOo2qW73YFZC1z2whqnbJcIcVEk6MIBKVMmtbffLJ6dvl5Yyo9kBHLwjulSJIUyZRA5UTsAAAAAAAAAAAAAAAAAAAPHE9ACKVMhlSGzxoBGVM4+GWDgcuACXwwUF4G/hnqpgKqL8YOlTGHE86AIcHUKROqZ0ogRqB0oHYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z";
    finishSprite.onload = function() {
        finishSprite = changeBrightness(1.2, finishSprite);
        completeTwo = true;
        isComplete();
    };

};

window.onresize = function() {
    var viewWidth = $("#view").width();
    var viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }
    cellSize = mazeCanvas.width / difficulty;
    if (player != null) {
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);
    }
};

function makeMaze() {
    document.getElementById("canvas").classList.add("border");
    if (player != undefined) {
        player.unbindKeyDown();
        player = null;
    }
    var e = document.getElementById("diffSelect");
    cellSize = mazeCanvas.width / 8;
    maze = new Maze(8, 8);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
    if (document.getElementById("mazeContainer").style.opacity < "100") {
        document.getElementById("mazeContainer").style.opacity = "100";
    }
}

