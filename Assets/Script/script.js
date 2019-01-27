//Using Firebase:
var config = {
    apiKey: "AIzaSyDwjy8NSU9Lrf25eDNOK7w1ATRuRHcMIbM",
    authDomain: "train-scheduler-assignme-c1fd7.firebaseapp.com",
    databaseURL: "https://train-scheduler-assignme-c1fd7.firebaseio.com",
    projectId: "train-scheduler-assignme-c1fd7",
    storageBucket: "",
    messagingSenderId: "931949793399"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submitButton").click(function (event) {
    // Don't reload the page on click event
    event.preventDefault();

    // Get form data from HTML
    var trainName = $("#trainName").val().trim();
    var trainDestination = $("#trainDestination").val().trim();
    var firstTrainTime = $("#trainTime").val().trim();
    var trainFreq = parseInt($("#trainFreq").val().trim());

    logIt();
    function logIt() {
        console.log("------------------------------------------")
        console.log("Train Name: " + trainName);
        console.log("Train Destination: " + trainDestination);
        console.log("First Train Time: " + firstTrainTime);
        console.log("Train Frequency: " + trainFreq);
        console.log("------------------------------------------")
    }

    // Put the details of the new train in Firebase
    database.ref().push({
        trainNameDB: trainName,
        trainDestinationDB: trainDestination,
        firstTrainTimeDB: firstTrainTime,
        trainFreqDB: trainFreq,
        addedDB: moment().format("LT"),
    })
});

database.ref().on("child_added", function (trainDBinfo) {

    console.log(trainDBinfo.val().firstTrainTimeDB);
    console.log(trainDBinfo.val().trainFreqDB + " minutes");

    $("tbody").append(
        '<tr>' +
        '<td>' + '<img src="assets/images/train.png"> ' + trainDBinfo.val().trainNameDB + '</td>' +
        '<td>' + trainDBinfo.val().trainDestinationDB + '</td>' +
        '<td>' + trainDBinfo.val().trainFreqDB + " min(s)" + '</td>' +
        // '<td>' + nextArrival + '</td>' +
        '</tr>'
    )
});


$(document).ready(function () {
    $("#timeNow").text(moment().format("LTS"));
    $("#timeUTC").text(moment.utc().format("LTS"));
    setInterval(function () {
        $("#timeNow").text(moment().format("LTS"));
        $("#timeUTC").text(moment.utc().format("LTS"));
    }, 1000);
});