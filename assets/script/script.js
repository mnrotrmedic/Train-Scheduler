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

    // Put the details of the new train in Firebase
    database.ref().push({
        trainNameDB: trainName,
        trainDestinationDB: trainDestination,
        firstTrainTimeDB: firstTrainTime,
        trainFreqDB: trainFreq,
        addedDB: moment().format("LT"),
    })

    $("form").trigger("reset")
});

database.ref().on("child_added", function (trainDBinfo) {
    // Time of first arrival 
    var converted = moment(trainDBinfo.val().firstTrainTimeDB, "hh:mm").subtract(1, "years");
    // Convert first arrival to minute value for easier calc
    var thaDiff = moment().diff(moment(converted), "minutes");
    // calc minutes away of next train based on current time
    var minsAway = trainDBinfo.val().trainFreqDB - (thaDiff % trainDBinfo.val().trainFreqDB);
    // Next train arrival time is now plus minsAway
    var nextArr = moment().add(minsAway, "minutes");

    // Add to table...
    $("tbody").append(
        '<tr>' +
        '<td>' + '<img src="assets/images/train.png"> ' + trainDBinfo.val().trainNameDB + '</td>' +
        '<td>' + trainDBinfo.val().trainDestinationDB + '</td>' +
        '<td>' + trainDBinfo.val().trainFreqDB + " min(s)" + '</td>' +
        '<td>' + (moment(nextArr).format("LT")) + '</td>' +
        '<td>' + minsAway + '</td>' +
        '</tr>'
    )

});


$(document).ready(function () {
    $("#timeNow").text(moment().format("LTS"));
    setInterval(function () {
        $("#timeNow").text(moment().format("LTS"));
    }, 1000);
});


// This is busted. Idea is to get db info every minute (or more?) and update table. Look into it and don't break nuthin

// function dbRefresh() {
//     setInterval(function () {
//         database.ref().on("val", function (updateDBinfo) {
//             // $("tbody").
//             $("tbody").append(
//                 '<tr>' +
//                 '<td>' + '<img src="assets/images/train.png"> ' + updateDBinfo.val().trainNameDB + '</td>' +
//                 '<td>' + updateDBinfo.val().trainDestinationDB + '</td>' +
//                 '<td>' + updateDBinfo.val().trainFreqDB + " min(s)" + '</td>' +
//                 '<td>' + (moment(nextArr).format("LT")) + '</td>' +
//                 '<td>' + minsAway + '</td>' +
//                 '</tr>'
//             )
//         }, 1000 * 60)
//     })
// };
// dbRefresh();

