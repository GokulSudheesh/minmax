const ROWS = 6;
const COLUMNS = 7;
const players = ["X", "O"];
const colors = {"X": "yellow", "O": "red"};
let player1 = players[0]; //Minimizing
let player2 = players[1]; //Maximizing
let player_turn = true; //Delay to wait
let available = [true, true, true, true, true, true, true]; // False if that column is filled
// Board:
const mainBoard = new Array(ROWS).fill("_").map(() => new Array(COLUMNS).fill("_")); // "_" denotes holes, "*" playable spots
for (let col = 0; col < COLUMNS; col++){
    mainBoard[ROWS-1][col] = "*"; //Gravity (spots were the coins can be placed)
}  
let turn = 0;
let message = "Connect Four"; //To fix the god damn bug -> (Not displaying "You Won!" stupid shit)

function press_button(id){
    $("#AI-btn").prop("disabled", true);
    console.log(id);
    let column_id = id % COLUMNS;
    if(available[column_id]){
        //$("#header").text("Wait for your turn.");
        player_turn = false;
        let eta = 75 * (available_column(mainBoard, column_id)+1); // Lets say it takes .75 milli second for a ball to pass through a hole
        play_Audio("./sounds/coins.wav");
        animate(column_id, 0, 0);        
        setTimeout(function(){
            for(let row = 0; row < ROWS; row++){
                if(mainBoard[row][column_id] == "*"){
                    mainBoard[row][column_id] = players[turn%2];
                    $("#"+(row * COLUMNS + column_id)).addClass(colors[players[turn%2]]);
                    if(row == 0){
                        available[column_id] = false; //If we reached the top
                    }
                    else{
                        mainBoard[row-1][column_id] = "*"; //The next available spot will the one above
                    }
                    break;
                }
            }        
            turn++;
            display_board_debug();
            //$("#header").text("Connect Four");
            checkGameOver(mainBoard);
            player_turn = true;            
        }, eta);
        return true;
    }
    return false;
}

function display_board_debug(){
    for (let row = 0; row < ROWS; row++){
        console.log(mainBoard[row].toString());
    }
}

function animate(col_id, row){
    if (row == ROWS || (mainBoard[row][col_id] == "*")){
        return;
    }
    if (mainBoard[row][col_id] == "_"){
        $("#"+(row * COLUMNS + col_id)).addClass(colors[players[turn%2]]);
        setTimeout(function() {
            $("#"+(row * COLUMNS + col_id)).removeClass(colors[players[turn%2]]);
            animate(col_id, row+1);
        }, 75);
    }
}

function play_Audio(file){
    let audio = new Audio(file);
    audio.play();
}

function available_column(board, col_id){
    // Returns the holes left in a column
    let spots = 0;
    for(let row = 0; row < ROWS; row++){
        if(board[row][col_id] == "_"){
            spots++;
        }        
    }
    return spots;
}

function available_moves(board){
    let moves = 0;
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLUMNS; col++){
            if(board[row][col] == "*"){
                moves++;
            }
        }
    }
    return moves;
}

function check_equal(a, b, c, d) {
    return a == b && b == c && c == d;
}

function draw_winner(ids){
    ids.forEach(function(item, index, array){
        $("#"+array[index]).addClass("won");
    });
}

function checkWinner(board, draw){
    // returns -1 if player1 wins
    // returns +1 if player 2 wins
    // returns 0 if its a tie *Mama-mia thats a lot of loopsa*

    //Rows
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < 4; col++){
            if (check_equal(board[row][col], board[row][col+1], board[row][col+2], board[row][col+3])){
                if(board[row][col] == player1){
                    if (draw){
                        draw_winner([((row)*COLUMNS +(col)), ((row)*COLUMNS +(col+1)), ((row)*COLUMNS +(col+2)), ((row)*COLUMNS +(col+3))]);
                    }
                    return -1;
                }
                if(board[row][col] == player2){
                    if (draw){
                        draw_winner([((row)*COLUMNS +(col)), ((row)*COLUMNS +(col+1)), ((row)*COLUMNS +(col+2)), ((row)*COLUMNS +(col+3))]);
                    }
                    return 1;
                }
            }
        }
    }
    //Columns
    for(let col = 0; col < COLUMNS; col++){    
        for(let row = 0; row < 3; row++){
            if (check_equal(board[row][col], board[row+1][col], board[row+2][col], board[row+3][col])){
                if(board[row][col] == player1){
                    if (draw){
                        draw_winner([((row)*COLUMNS +(col)), ((row+1)*COLUMNS +(col)), ((row+2)*COLUMNS +(col)), ((row+3)*COLUMNS +(col))]);
                    }
                    return -1;
                }
                if(board[row][col] == player2){
                    if (draw){
                        draw_winner([((row)*COLUMNS +(col)), ((row+1)*COLUMNS +(col)), ((row+2)*COLUMNS +(col)), ((row+3)*COLUMNS +(col))]);
                    }
                    return 1;
                }
            }
        }
    }

    //Minor Diagonals /
    let diags = 4;
    while (diags <= 8){
        if(diags <= 6){    
            let col = diags-1;
            for(let row = 0; row < diags; row++){ 
                if (check_equal(board[row][col], board[row+1][col-1], board[row+2][col-2], board[row+3][col-3])){
                    if(board[row][col] == player1){
                        if (draw){
                            draw_winner([((row)*COLUMNS +(col)), ((row+1)*COLUMNS +(col-1)), ((row+2)*COLUMNS +(col-2)), ((row+3)*COLUMNS +(col-3))]);
                        }
                        return -1;
                    }
                    if(board[row][col] == player2){
                        if (draw){
                            draw_winner([((row)*COLUMNS +(col)), ((row+1)*COLUMNS +(col-1)), ((row+2)*COLUMNS +(col-2)), ((row+3)*COLUMNS +(col-3))]);
                        }
                        return 1;
                    }
                }
                //console.log("("+(row)+", "+(col)+") ("+(row+1)+", "+(col-1)+") ("+(row+2)+", "+(col-2)+") ("+(row+3)+", "+(col-3)+")");
                col--;
                if(col == 2) {
                    break;
                }
            }   
        }
        if(diags >= 6){
            let row = diags-6;
            for(let col = 6; col >= 0; col--){ 
                if (check_equal(board[row][col], board[row+1][col-1], board[row+2][col-2], board[row+3][col-3])){
                    if(board[row][col] == player1){
                        if (draw){
                            draw_winner([((row)*COLUMNS +(col)), ((row+1)*COLUMNS +(col-1)), ((row+2)*COLUMNS +(col-2)), ((row+3)*COLUMNS +(col-3))]);
                        }
                        return -1;
                    }
                    if(board[row][col] == player2){
                        if (draw){
                            draw_winner([((row)*COLUMNS +(col)), ((row+1)*COLUMNS +(col-1)), ((row+2)*COLUMNS +(col-2)), ((row+3)*COLUMNS +(col-3))]);
                        }
                        return 1;
                    }
                }
                //console.log("("+(row)+", "+(col)+") ("+(row+1)+", "+(col-1)+") ("+(row+2)+", "+(col-2)+") ("+(row+3)+", "+(col-3)+")");
                row++;
                if(row == 3) {
                    break;
                }
            }   
        }
        diags++;
    }
    //Major Diagonals \
    diags = 4;
    while (diags <= 8){
        if(diags <= 6){    
            let col = 7-diags;
            for(let row = 0; row < diags; row++){
                if (check_equal(board[row][col], board[row+1][col+1], board[row+2][col+2], board[row+3][col+3])){
                    if(board[row][col] == player1){
                        if (draw){
                            draw_winner([((row)*COLUMNS +(col)), ((row+1)*COLUMNS +(col+1)), ((row+2)*COLUMNS +(col+2)), ((row+3)*COLUMNS +(col+3))]);
                        }
                        return -1;
                    }
                    if(board[row][col] == player2){
                        if (draw){
                            draw_winner([((row)*COLUMNS +(col)), ((row+1)*COLUMNS +(col+1)), ((row+2)*COLUMNS +(col+2)), ((row+3)*COLUMNS +(col+3))]);
                        }
                        return 1;
                    }
                } 
                //console.log("("+(row)+", "+(col)+") ("+(row+1)+", "+(col+1)+") ("+(row+2)+", "+(col+2)+") ("+(row+3)+", "+(col+3)+")");
                col++;
                if(col == 4) {
                    break;
                }
            }   
        }
        if(diags >= 6){
            let row = diags-6;
            for(let col = 0; col < diags; col++){
                if (check_equal(board[row][col], board[row+1][col+1], board[row+2][col+2], board[row+3][col+3])){
                    if(board[row][col] == player1){
                        if (draw){
                            draw_winner([((row)*COLUMNS +(col)), ((row+1)*COLUMNS +(col+1)), ((row+2)*COLUMNS +(col+2)), ((row+3)*COLUMNS +(col+3))]);
                        }
                        return -1;
                    }
                    if(board[row][col] == player2){
                        if (draw){
                            draw_winner([((row)*COLUMNS +(col)), ((row+1)*COLUMNS +(col+1)), ((row+2)*COLUMNS +(col+2)), ((row+3)*COLUMNS +(col+3))]);
                        }
                        return 1;
                    }
                }  
                //console.log("("+(row)+", "+(col)+") ("+(row+1)+", "+(col+1)+") ("+(row+2)+", "+(col+2)+") ("+(row+3)+", "+(col+3)+")");
                row++;
                if(row == 3) {
                    break;
                }
            }   
        }
        diags++;
    }

    if(available_moves(board) == 0){
        //Tie
        return 0;
    }

}

function checkGameOver(board){
    let lookUp = {"-1" : player1, "1" : player2};
    let lookUp2 = {"-1" : "You won! Wow!", "1" : "C'mon, you got this!"};
    let sound = {"-1" : "./sounds/win.wav", "1" : "./sounds/game-over.wav"};;
    let winner = checkWinner(board, true);
    if(winner == 0){
        console.log("Tie!");
        $("#header").text("Tie!");
    }
    else if(winner != null){
        play_Audio(sound[winner]);
        console.log(lookUp[winner]+" won!");
        message = lookUp2[winner];
        $("#header").text(message);
        // Disable other buttons
        available.forEach(function(item, index, array){
            array[index] = false;
        });
    }
}

function minimax(board, maximizingPlayer, depth, alpha, beta){
    if(depth == 9){
        return 0;
    }
    let eval = checkWinner(board, false);
    if (eval != null){
        return eval;
    }
    if (maximizingPlayer){
        let maxEval = -Infinity;
        for(let row = 0; row < ROWS; row++){
            for(let col = 0; col < COLUMNS; col++){
                if (board[row][col]=="*"){
                    board[row][col] = player2;
                    if(row != 0){
                        board[row-1][col] = "*";
                    }
                    let evaluation = minimax(board, false, depth+1, alpha, beta);
                    board[row][col] = "*";
                    if(row != 0){
                        board[row-1][col] = "_";
                    }
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
        for(let row = 0; row < ROWS; row++){
            for(let col = 0; col < COLUMNS; col++){
                if (board[row][col]=="*"){
                    board[row][col] = player1;
                    if(row != 0){
                        board[row-1][col] = "*";
                    }
                    let evaluation = minimax(board, true, depth+1, alpha, beta);
                    board[row][col] = "*";
                    if(row != 0){
                        board[row-1][col] = "_";
                    }
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
    if (board[5][3] == "*"){
        return [5, 3]; //If Ai starts first, put in the middle
    }

    let optimalPosition = [null, null];
    let optimalScore = -Infinity;

    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLUMNS; col++){
            if (board[row][col] == "*"){
                board[row][col] = player2;
                if(row != 0){
                    board[row-1][col] = "*";
                }
                moveScore = minimax(board, false, 0, -Infinity, +Infinity);
                board[row][col] = "*";
                if(row != 0){
                    board[row-1][col] = "_";
                }                
                if(moveScore > optimalScore){
                    optimalScore = moveScore;
                    optimalPosition = [row, col];
                }
            }
        }   
    }
    return optimalPosition;
}

function AI_move(){
    //player_turn = false;
    $("#header").text("Wait for your turn.");
    setTimeout(function() {
        let move = get_bestMove(mainBoard);
        let pos = (move[0]*COLUMNS + move[1]);
        console.log(move.toString()+" "+ pos);
        press_button(pos);
        $("#header").text(message);
        //player_turn = true;
    }, 700);      
}

$(".holes").on("click", function(){
    if (player_turn){
        let btn_id =  this.getAttribute("id"); 
        if (press_button(btn_id)){
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
