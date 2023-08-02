document.addEventListener("DOMContentLoaded", ()=>{
    const grid = document.querySelector('.grid')
    let divs = Array.from(document.querySelectorAll('.grid div'))
    const width = 10;
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    let nextRandom = 0;
    let timerId;
    let score = 0;

    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];
    const lFigure = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];
    const zFigure = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ];
    const tFigure = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];
    const oFigure = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];
    const iFigure = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];
    const Figures = [lFigure, zFigure, tFigure, oFigure, iFigure];
    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random()*Figures.length);
    let current = Figures[random][currentRotation];

    function draw() {
        current.forEach(index => {
            divs[currentPosition + index].classList.add('tetromino');
            divs[currentPosition + index].style.backgroundColor = colors[random];
        })
    }

    function undraw() {
        current.forEach(index => {
            divs[currentPosition + index].classList.remove('tetromino');
            divs[currentPosition + index].style.backgroundColor = '';

        })
    }

    function control(e) {
        if(e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if(current.some(index => divs[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => divs[currentPosition + index].classList.add('taken'))   ;
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * Figures.length);
            current = Figures[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if(!isAtLeftEdge) currentPosition -=1;
        if(current.some(index => divs[currentPosition + index].classList.contains('taken'))) {
            currentPosition +=1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);
        if(!isAtRightEdge) currentPosition +=1;
        if(current.some(index => divs[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1;
        }
        draw();
    }

    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0);
    }

    function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0);
    }

    function checkRotatedPosition(P){
        P = P || currentPosition;
        if ((P+1) % width < 4) {
            if (isAtRight()){
                currentPosition += 1;
                checkRotatedPosition(P);
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()){
                currentPosition -= 1;
                checkRotatedPosition(P);
            }
        }
    }

    function rotate() {
        undraw();
        currentRotation ++;
        if(currentRotation === current.length) {
            currentRotation = 0;
        }
        current = Figures[random][currentRotation]
        checkRotatedPosition();
        draw();
    }
    const displayDivs = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    //without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //l
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //z
        [1, displayWidth, displayWidth+1, displayWidth+2], //t
        [0, 1, displayWidth, displayWidth+1], //o
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i
    ];

    function displayShape() {
        displayDivs.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displayDivs[displayIndex + index].classList.add('tetromino');
            displayDivs[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            // note основная запускающая функция
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*Figures.length);
            displayShape();
        }
    })

     function addScore() {
        for (let i = 0; i < 199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(index => divs[index].classList.contains('taken'))) {
                score +=10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    divs[index].classList.remove('taken');
                    divs[index].classList.remove('tetromino');
                    divs[index].style.backgroundColor = '';
                })
                const divsRemoved = divs.splice(i, width);
                divs = divsRemoved.concat(divs);
                divs.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if(current.some(index => divs[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timerId);
        }
    }

})
