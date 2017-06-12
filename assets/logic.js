
  $(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAer8OMM_-tzRU8exO3mMrAnOCg7OgYP6U",
    authDomain: "trainscheduler-f1771.firebaseapp.com",
    databaseURL: "https://trainscheduler-f1771.firebaseio.com",
    projectId: "trainscheduler-f1771",
    storageBucket: "trainscheduler-f1771.appspot.com",
    messagingSenderId: "1079740164709"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#addBtn").on("click", function(event) {
    event.preventDefault();

    var train = $("#trainName").val().trim();
    var trainDestination = $("#destination").val().trim();
    var firstTimeInput = moment($("#firstTrainTime").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var frequency = $("#frequencyMinutes").val().trim();

    console.log(train);
    console.log(trainDestination);
    console.log(firstTimeInput);
    console.log(frequency);

    database.ref().push({
      trainName: train,
      destination: trainDestination,
      firstTrain: firstTimeInput,
      frequencyMinutes: frequency
    });

    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequencyMinutes").val("");

  });

  database.ref().on("child_added", function(childSnapshot) {

    console.log(childSnapshot.val());
    // Store everything into a variable.
    var trainID = childSnapshot.val().trainName;
    var trainFinalPlace = childSnapshot.val().destination;
    var trainFirstTime = childSnapshot.val().firstTrain;
    var trainFrequency= childSnapshot.val().frequencyMinutes;
    // Employee Info
    console.log(trainID);
    console.log(trainFinalPlace);
    console.log(trainFirstTime);
    console.log(trainFrequency);

    var diffTime = moment().diff(moment.unix(trainFirstTime), "minutes");//when moment() does not have argument, current time is referenced
    var timeRemainder = moment().diff(moment.unix(trainFirstTime), "minutes") % trainFrequency ;
    var minutes = trainFrequency - timeRemainder;

    var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
    
    // Test for correct times and info
    console.log(minutes);
    console.log(nextTrainArrival);
    console.log(moment().format("hh:mm A"));
    console.log(nextTrainArrival);
    console.log(moment().format("X"));// time in unixtimestamp

    // Append train info to table on page
    $(".table > tbody").append("<tr class='singleTrainItem' id='" + childSnapshot.key + "'><td class='text-center'>" + trainID + "</td><td class='text-center'>" + trainFinalPlace + 
      "</td><td class='text-center'>" + trainFrequency + " mins" + "</td><td class='text-center'>" + nextTrainArrival + 
      "</td><td class='text-center'>" + minutes + "<td><button type='submit' class='removeButton' data-key='" + childSnapshot.key + "'>Remove</button>" + "</td></tr>");

  });

//remove train on click
  $("#currentTrainScheduleBody").on("click", '.removeButton', function() {
    console.log("inside click");

    // var $thisRow = $(this).parent().parent();
    database.ref().child($(this).attr("data-key")).remove();

    // console.log("$this", $this);
    // var singleItem = $(".singleTrainItem");
    // var singleTrainLine = $this.parent(singleItem);
    // console.log("singleTrainLine", singleTrainLine);
  
    // database.ref().child($thisRow.remove());

  });

//watcher for child removed
database.ref().on("child_removed", function(childSnapshot) {
  //save the key as a variable
  // var key_value = childSnapshot.key;
  //remove row with id that matches key of child that was removed
  $("#"+childSnapshot.key).remove();
  });

}); 

