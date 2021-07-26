let available = [true, true, true,
    true, true, true,
    true, true, true];
let mainBoard = [['_', '_', '_'], 
    ['_', '_', '_'], 
    ['_', '_', '_']];
const players = ['X', 'O']
let player1 = players[0]; //Minimizing
let player2 = players[1]; //Maximizing
let turn = 0;
let player_turn = true;

function press_button(button, id){
$("#AI-btn").prop("disabled", true);
if(available[id]){
button.text(players[(turn)%2]+"");
mainBoard[Math.floor(id/3)][id%3] = players[(turn)%2];
available[id] = false;
turn++;
console.log(mainBoard.toString());
checkGameOver(mainBoard);
animate(id);
return true; // If u clicked on the available button
}
return false; //If u clicked on a button that's not available
}

function animate(id){
play_Audio("./sounds/touch.wav");
$("#"+id).addClass("pressed");
setTimeout(function() {
$("#"+id).removeClass("pressed");
}, 100);
}

function play_Audio(file){
let audio = new Audio(file);
audio.play();
}

function availabe_spots(board){
let count = 0;
for(let i = 0; i < 3; i++){
for(let j = 0; j < 3; j++){
if(board[i][j] == '_'){
    count++;
}
}
}
return count;
}

function checkWinner(board){
// returns 1 if player1 wins
// returns -1 if player 2 wins
// returnd 0 if its a tie
for (let row = 0; row < 3; row++){
if ((board[row][0] == board[row][1]) && (board[row][1] == board[row][2])){
if (board[row][2] == player1)
    return -1;
else if (board[row][2] == player2)
    return 1;
}
}
for (let col = 0; col < 3; col++){
if ((board[0][col] == board[1][col]) && (board[1][col] == board[2][col])){
if (board[2][col] == player1)
    return -1;
else if (board[2][col] == player2)
    return 1;
}
}

//Checking Diagonals
if ((board[0][0] == board[1][1]) && (board[1][1] == board[2][2])){
if (board[0][0] == player1)
return -1;
else if (board[0][0] == player2)
return 1;
}
if ((board[0][2] == board[1][1]) && (board[1][1] == board[2][0])){
if (board[0][2] == player1)
return -1;
else if (board[0][2] == player2)
return 1;
}
if(availabe_spots(board) == 0){
// Tie
return 0;
}
}

function checkGameOver(board){
let lookUp = {"-1" : player1, "1" : player2};
let lookUp2 = {"-1" : "You won! Wow!", "1" : "C'mon, you got this!"};
let winner = checkWinner(board);
if(winner == 0){
console.log("Tie!");
$(".header").text("Tie!");
}
else if(winner != null){
play_Audio("./sounds/game-over.wav");
console.log(lookUp[winner]+" won!");
$(".header").text(lookUp2[winner]);
// Disable other buttons
available.forEach(function(item, index, array){
array[index] = false;
});
}
}

function minimax(board, depth, maximizingPlayer, alpha, beta){
let eval = checkWinner(board);
if (eval != null){
return eval;
}
if (maximizingPlayer){
let maxEval = -Infinity;
for(let i = 0; i < 3; i++){
for(let j = 0; j < 3; j++){
    if (board[i][j]=='_'){
        board[i][j] = player2;
        let evaluation = minimax(board, depth-1, false, alpha, beta);
        board[i][j] = '_';
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(evaluation, alpha);
        if (beta <= alpha){
            return maxEval;
        }
    }
}
}   
return maxEval;
}
else{
let minEval = +Infinity;
for(let i = 0; i < 3; i++){
for(let j = 0; j < 3; j++){
    if (board[i][j]=='_'){
        board[i][j] = player1;
        let evaluation = minimax(board, depth-1, true, alpha, beta);
        board[i][j] = '_';
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(evaluation, beta);
        if (beta <= alpha){
            return minEval;
        }
    }
}
}   
return minEval;
}
}

function get_bestMove(board){
let optimalPosition = [null, null];
let optimalScore = -Infinity;
let spotsLeft = availabe_spots(board);

// if(available[4] && (spotsLeft >= 8)){
//     return [1, 1];
// }

for(let i = 0; i < 3; i++){
for(let j = 0; j < 3; j++){
if (board[i][j] == '_'){
    let board_copy = JSON.parse(JSON.stringify(board)); 
    board_copy[i][j] = player2;
    moveScore = minimax(board_copy, spotsLeft-1, false, -Infinity, +Infinity);
    if(moveScore > optimalScore){
        optimalScore = moveScore;
        optimalPosition = [i, j];
    }
}
}   
}
return optimalPosition;
}

function AI_move(){
player_turn = false;
setTimeout(function() {
let move = get_bestMove(mainBoard);
let pos = (move[0]*3 + move[1]);
console.log(move.toString()+" "+ pos);
console.log(mainBoard.toString());
press_button($("#"+pos), pos);
player_turn = true;
}, 500);    
}

$(".btn").on("click", function(){
let btn_id = this.getAttribute("id");
if(player_turn){
if(press_button($("#"+btn_id), btn_id)){
AI_move();      
}
}
});

$("#AI-btn").on("click", function(){
player1 = players[1];
player2 = players[0];
AI_move();
});

$("#refresh-btn").on("click", function(){
location.reload();
});