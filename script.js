const grid = document.querySelector('.grid');
const score = document.querySelector('#score');
const display = document.querySelector('#display');

const blockWidth = 10;
const blockHeight = 2;
const boardWidth = 56;
const boardHeight = 30;
const ballDiameter = 2;
const userWidth = 10;
const userHeight = 1.5;
 
const userStart = [23,0.5];
let currentPosition = userStart;
const ballStart = [27,2];
let ballCurrentPosition = ballStart;

let xVelocity = 0.2;
let yVelocity = 0.2;
let counter=0;
let scoreValue=0;

//create block
class Block{
    constructor(xAxis, yAxis)
    {
        this.bottomLeft = [xAxis,yAxis];
        this.bottomRight = [xAxis + blockWidth,yAxis];
        this.topLeft = [xAxis,yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth,yAxis + blockHeight];
    }
}


//all my blocks
const blocks = 
[
    new Block(1,27),
    new Block(12,27),
    new Block(23,27),
    new Block(34,27),
    new Block(45,27),

    new Block(1,24),
    new Block(12,24),
    new Block(23,24),
    new Block(34,24),
    new Block(45,24),

    new Block(1,21),
    new Block(12,21),
    new Block(23,21),
    new Block(34,21),
    new Block(45,21)
]




//draw all my blocks
function addBlocks()
{
    for (let i=0;i<blocks.length;i++)
    {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = `${blocks[i].bottomLeft[0]}vw`;
        block.style.bottom = `${blocks[i].bottomLeft[1]}vw`;
        grid.appendChild(block);
    }
}
addBlocks();


//add user
const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);






function drawUser()
{
    user.style.left = currentPosition[0] + 'vw';
    user.style.bottom = currentPosition[1] + 'vw';
}


function drawBall()
{
    ball.style.left = ballCurrentPosition[0] + 'vw';
    ball.style.bottom = ballCurrentPosition[1] + 'vw';
}





function moveUser(evt)
{
    if (counter===0) {
        timerId = setInterval(moveBall,15);
        counter = 1;
    }
    switch (evt.key)
    {
        case 'ArrowLeft':
            if (currentPosition[0]>0)
            {
                currentPosition[0] -= 1;
                drawUser();
            }
            break;

        case 'a':
            if (currentPosition[0]>0)
            {
                currentPosition[0] -= 1;
                drawUser();
            }
            break;

        case 'ArrowRight':
            if (currentPosition[0]<46)
            {
                currentPosition[0] += 1;
                drawUser();
            }
            break;

        case 'd':
            if (currentPosition[0]<46)
            {
                currentPosition[0] += 1;
                drawUser();
            }
            break;
    }
}
document.addEventListener('keydown',moveUser);






//add Ball
const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);





//move Ball
function moveBall()
{
    ballCurrentPosition[0] += xVelocity;
    ballCurrentPosition[1] += yVelocity;
    drawBall();
    checkForCollisions();
}





function isBtwn(value, lowerBound, upperBound) {
    return value >= lowerBound && value <= upperBound;
}



//Check for collisions
function checkForCollisions()
{
    //check for wall collisions 
    if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0)
    {
        changeDirection('wall');
        return;
    }
    if (ballCurrentPosition[1] >= (boardHeight - ballDiameter))
    {
        changeDirection('ceiling');
        return;
    }

    //check for block collisions
    for (let i=0;i<blocks.length;i++)
    {
        if(
            (ballCurrentPosition[0]+ballDiameter >= blocks[i].bottomLeft[0] && ballCurrentPosition[0] <= blocks[i].bottomRight[0]) &&
            ((ballCurrentPosition[1]+ballDiameter) >= blocks[i].bottomLeft[1] && ballCurrentPosition[1] <= blocks[i].topLeft[1]) 
        )
        {          
            const allBlocks = document.querySelectorAll('.block');
            allBlocks[i].classList.remove('block');
            let string = 'ceiling';

            if (isBtwn(ballCurrentPosition[0],blocks[i].bottomLeft[0]-ballDiameter,blocks[i].bottomLeft[0]-ballDiameter+0.2) && 
                isBtwn(ballCurrentPosition[1],blocks[i].bottomLeft[1]-ballDiameter,blocks[i].topLeft[1]))
            {
                // right side collision
                string = 'wall';
            } 
            else if (isBtwn(ballCurrentPosition[0],blocks[i].bottomRight[0]-0.2,blocks[i].bottomRight[0]) && 
                     isBtwn(ballCurrentPosition[1],blocks[i].bottomRight[1]-ballDiameter,blocks[i].topRight[1]))
            {
                // left side collision
                string = 'wall';
            }
            blocks.splice(i, 1);
            changeDirection(string);
            scoreValue++;
            score.textContent = scoreValue;


            //check for win
            if (blocks.length === 0)
            {
                display.textContent = 'You WON !!!';
                clearInterval(timerId);
                document.removeEventListener('keydown',moveUser);
            }
            
        }

    }



    //check for user collisions
    if (isBtwn(ballCurrentPosition[0],currentPosition[0]-ballDiameter,currentPosition[0]+userWidth) &&
        isBtwn(ballCurrentPosition[1],currentPosition[1]+userHeight-1.5,currentPosition[1]+userHeight))
    {
        let string = 'ceiling';

        if (isBtwn(ballCurrentPosition[0],currentPosition[0]-ballDiameter,currentPosition[0]-ballDiameter+0.2) && 
            isBtwn(ballCurrentPosition[1],currentPosition[1]-ballDiameter,currentPosition[1]+userHeight))
        {
            // right side collision
            string = 'wall';
        } 
        else if (isBtwn(ballCurrentPosition[0],currentPosition[0]+userWidth-0.2,currentPosition[0]+userWidth) && 
                    isBtwn(ballCurrentPosition[1],currentPosition[1]-ballDiameter,currentPosition[1]+userHeight))
        {
            // left side collision
            string = 'wall';
        }
        if (string == 'ceiling'){
            ballCurrentPosition[1] = currentPosition[1] + userHeight;
        }
        changeDirection(string);
    }


    //check for gameover 
    if (ballCurrentPosition[1] <= 0)
    {
        clearInterval(timerId);
        display.textContent = 'Game Over !!!';
        document.removeEventListener('keydown',moveUser);
    }
}





function changeDirection(str)
{
    if (str === 'wall')
    {
        xVelocity = -(xVelocity);
        increaseSpeed();
        return;
    }
    if (str === 'ceiling')
    {
        yVelocity = -(yVelocity);
        increaseSpeed();
        return;
    }
}



function increaseSpeed()
{
    let newMagnitudeX = Math.abs(xVelocity) + 0.0025;
    let newMagnitudeY = Math.abs(yVelocity) + 0.0025 ;
    xVelocity = Math.sign(xVelocity) * newMagnitudeX;
    yVelocity = Math.sign(yVelocity) * newMagnitudeY;
}



