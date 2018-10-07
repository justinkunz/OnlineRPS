// Initialize Firebase
var config = {
    apiKey: "AIzaSyC1pmT8nzU706K4Pgs_ZDxvlgajPTbLd-g",
    authDomain: "rpsgame-50775.firebaseapp.com",
    databaseURL: "https://rpsgame-50775.firebaseio.com",
    projectId: "rpsgame-50775",
    storageBucket: "rpsgame-50775.appspot.com",
    messagingSenderId: "437476549334"
};
firebase.initializeApp(config);
database = firebase.database();

//opens modal
function callModal() {
    $('.modal').modal();
    $('#modal1').modal('open');
    $('.trigger-modal').modal();
}

//when quit button is selected (from modal)
$(document).on('click', '.quit', function () {

    //stop modal countdown
    clearInterval(cdInterval)

    //reset modal
    quitErase()

    //reset database values
    reset()
});

//when play again button is selected call quitErase 
$(document).on('click', '.playA', function () {
    quitErase()
});

//resets modal
function quitErase() {
    $("#modalLine1").empty()
    $("#modalLine2").empty()
    $("#modalTop").empty()
    $("#modalLine1").removeClass('redAlert')
    console.log('calling reset')
}

//who are you variable is used to define your character as player 1 or player 2
var whoAreYou

//user's choice (rock, paper, or scissors)
var choice

//document ready parent function -- images sometimes dont load before scripts loads
$(document).ready(function () {

    //when a choice (rock, paper, or scissors) is clicked
    $('.choices').on('click', function () {

        //store the value of the choice
        choice = $(this).attr('value')

        //if player 1 space is database is empty declare user as player 1
        if (p1 === 'empty') {

            //push choice to player1 in firebase db
            database.ref().update({
                player1: choice
            })
            whoAreYou = 'Player1'

            //set modal info waiting for other player
            $("#modalTop").text("Waiting on Opponent.")
            $("#loader").addClass("active")
            $("#modalBtn").addClass('quit')
            $("#modalBtn").text("Quit Waiting")

            //countdown from ten, after 10 seconds with no opponent, disconnect
            countdown = 10
            cdInterval = setInterval(countdownFunc, 1000)

            //call function to open modal
            callModal()
        }
        //else declare user as player 2
        else {

            //push choice to player2 in firebase db
            database.ref().update({
                player2: choice
            })
            whoAreYou = 'Player2'

            //call function to determine winner / display results
            makeDecision()
        }
    });

});

//function for countdown (while waiting for other opponent) --called every second
function countdownFunc() {

    //-1 from countdown
    countdown--

    //if countdown is 5 or below, show as red, give disconnect msg
    if (countdown < 6) {
        $("#modalLine1").addClass('redAlert')
        $("#modalLine1").text("This session will auto disconnect in " + countdown + " seconds")
    }

    //if countdown reaches 0,
    if (countdown === 0) {

        //stop countdown
        clearInterval(cdInterval)

        //call reset function to reset database values
        reset()

        //customize modal
        $("#modalTop").text("Timed Out! :(")
        $("#modalLine1").text("Looks like no ones available to play right now. Click the Play Again button to start a new round")
        $("#modalBtn").text("Play Again")
        $("#modalBtn").addClass("playA")
        $("#loader").removeClass("active")
    }
}
//when value changes in database
database.ref().on("value", function (snapshot) {

    //store player 1 and player 2 values
    p1 = snapshot.val().player1
    p2 = snapshot.val().player2

    //if both players values do not equal empty and the users choice is not undefined
    if (p1 !== 'empty' && p2 !== 'empty' && choice !== undefined) {

        //stop countdown interval
        clearInterval(cdInterval)

        //call function to determine/display winner
        makeDecision()
    }

});
//function to determine/display winner
function makeDecision() {
    //set up modal
    $("#modalLine1").removeClass('redAlert')
    $("#loader").removeClass("active")
    $("#modalBtn").text("Play Again")
    $("#modalBtn").removeClass('quit')
    $("#modalBtn").addClass('playA')

    //if you are player one
    if (whoAreYou === 'Player1') {

        //call whoWon function to determine winner,
        //change text to you won, you lost, or you tied
        if (whoWon(p1, p2) === 'p1') {
            $("#modalTop").text("You won!")
        }
        if (whoWon(p1, p2) === 'p2') {
            $("#modalTop").text("You lost!")
        }
        if (whoWon(p1, p2) === 'Tied') {
            $("#modalTop").text("You tied!")
        }
        $("#modalLine1").text('You choose ' + p1)
        $("#modalLine2").text('Your opponent choose ' + p2)
        callModal()
    }

    //if you are player 2
    if (whoAreYou === 'Player2') {

        //call whoWon function to determine winner,
        //change text to you won, you lost, or you tied
        if (whoWon(p1, p2) === 'p1') {
            $("#modalTop").text("You lost!")
        }
        if (whoWon(p1, p2) === 'p2') {
            $("#modalTop").text("You won!")
        }
        if (whoWon(p1, p2) === 'Tied') {
            $("#modalTop").text("You tied!")
        }
        $("#modalLine1").text('You choose ' + p2)
        $("#modalLine2").text('Your opponent choose ' + p1)
        callModal()
    }
    //wait one second and call reset function
    setTimeout(reset, 1000)
}

//function for determining winner
function whoWon(p1, p2) {
    if (p1 === p2) {
        return "Tied"
    }
    if (p1 === 'rock' && p2 === 'paper') {
        return "p2"
    }
    if (p1 === 'rock' && p2 === 'scissors') {
        return 'p1'
    }
    if (p1 === 'paper' && p2 === 'rock') {
        return 'p1'
    }
    if (p1 === 'paper' && p2 === 'scissors') {
        return 'p2'
    }
    if (p1 === 'scissors' && p2 === 'rock') {
        return 'p2'
    }
    if (p1 === 'scissors' && p2 === 'paper') {
        return 'p1'
    }
}

//function to reset database values & whoAreYou
function reset() {
    database.ref().set({
        player1: 'empty',
        player2: 'empty'
    })
    whoAreYou = ''
}
