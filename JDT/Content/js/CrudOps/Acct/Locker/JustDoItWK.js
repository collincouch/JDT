
var editor;
var oTable;
var userLockersRef;
var pathname = window.location.pathname.split("/");
var workOutName = pathname[pathname.length - 1];
var userRef = new Firebase('https://jdt.firebaseio.com/Users/user/');
var workOutsRef = new Firebase('https://jdt.firebaseio.com/WorkOuts/');

var lockersRef = new Firebase('https://jdt.firebaseio.com/Lockers/');
var exercisesRef = new Firebase('https://jdt.firebaseio.com/Exercises/');
var workOutExercisesRef;
var userPlansRef;

var arrMaster = [];
var columns;
var workOutEx = [];


function initListAuth() {
    
    initializeAuth(function (email) {
        setHeader(email);
        setSideNav(email);


        populateList(email, function (dataTableId) {
            
            populateInitArray(dataTableId, function (tableId) {
                
                
                
            });
           
            console.log('master arr: ' + arrMaster.length);

            $.each(arrMaster, function (index, value) {

                //console.log('key: ' + value.name());
                //console.log('value: ' + JSON.stringify(value));
                var key
                for (key in value)
                {
                    initializeDataTable(key,value[key]);
                }

               

            });
            //
        });

        
       
        
    })
    
    
}

function getTodaysDate() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + '/' +
        (month < 10 ? '0' : '') + month + '/' +
        (day < 10 ? '0' : '') + day;

    return output;
}

function getCurrentWeekAndDay() {

    
}


function populateInitArray(dataTableId, targetSets, weight, reps, set, callback) {
    workOutExercisesRef = workOutsRef.child(dataTableId).child('/Exercises/');
    var numChild;
    //var z = [];
    var rows = [];
   
    console.log('datatableid ' + dataTableId);
    
    for (var i = 0; i < targetSets; i++)
    {
        var k = {};
        var o = {};
        o.SetNum = i + 1;
        o.RestTime = "";
        o.Trend = "";
        o.Weight = weight;
        o.Reps = reps;
        if (o.Weight == null || o.Reps == null) {
            o.cssStyle = "badge badge-success";
            o.Action = "Update";
        }
        else {

            o.cssStyle = "badge badge-important";
            o.Action = "Edit";
        }
        o.DTRow_Id = dataTableId + "_Set" + (i + 1);
        rows.push(o);
    }
        
    if (rows.length == targetSets)
    {
        k[dataTableId] = rows;
        callback(k);
    }
       
}


function populateList(email, callback) {
    
  
    getUserIdByEmail(email, function (uid) {

        userRef.child(uid).once('value', function (snapShot) {

            console.log('locker id ' + lockersRef.child(snapShot.val().LockerId + '/Active/').child(workOutName).toString());
            
            lockersRef.child(snapShot.val().LockerId + '/Active/').child(workOutName).once('value', function (activeWorkOutSnapShot) {
                populateDataTable();
                var numOfExercises = 0;
                var numOfSets = 0;
                var weight;
                var reps;
                var description;
                //console.log('num ex ' + workOutsRef.child(activeWorkOutSnapShot.name()).child('Exercises').toString());
                workOutsRef.child(activeWorkOutSnapShot.name()).once('value', function (workOutSnap) {
                    description = workOutSnap.val().Description != null ? workOutSnap.val().Description : "";
                    $('#workOutTitle').append(workOutSnap.val().Name + '<small>' + description + '</small>');
                });
                workOutsRef.child(activeWorkOutSnapShot.name()).child('Exercises').once('value', function (s) {
                    weight = s.val().Weight;
                    reps = s.val().Reps;
                    set = s.val().Set;
                    s.forEach(function (snap) {

                        numOfExercises++;
                    });
                    workOutsRef.child(activeWorkOutSnapShot.name()).child('Exercises').on('child_added', function (exerciseSnap) {
                        console.log('exercise ' + exerciseSnap.name());
                        exercisesRef.child(exerciseSnap.name()).once('value', function (snap) {

                            var setNum = snap.val().RecMaxSets;
                            var targetMinReps = snap.val().RecMinReps;
                            var targetMaxReps = snap.val().RecMaxReps;
                            var target = targetMinReps + '-' + targetMaxReps;

                            $('#exContainer').append(renderTable(snap.name(), snap.val().Name,target));
                            populateInitArray(exerciseSnap.name(), setNum, weight,reps, set, function (x) {
                                //console.log('push 1');
                                arrMaster.push(x);
                                if (arrMaster.length == numOfExercises) {
                                    //console.log('asdfsdfsdf');
                                    callback(snap.name());
                                }
                                //console.log('push 2');
                            });
                        });
                    });
                });
                
            });
            
           
        });
        

        
        

    });
    
    }



function renderTable(exerciseId, exerciseName, target) {
    console.log(target);
    var s = "<section class=\"widget\">"
                + "<header>"
                    + "<h4>"
                        + "<i class=\"fa fa-list-alt\"></i>"
                        + exerciseName + " | Rep Target: " + target
                    + "</h4>"
                    + "<div id=\"stopwatch_" + exerciseId + "\"/>"
                + "</header>"
           + "<table class=\"table table-striped table-bordered dataTable\" id=\"tbl_" + exerciseId + "\">"
            + "<thead>"
                + "<tr>"
                        + "<th>"
                            + "Set #"
                        + "</th>"
                        + "<th>"
                            + "Weight(lb)"
                        + "</th>"
                        + "<th>"
                            + "Reps"
                        + "</th>"
                        + "<th class=\"hidden-xs\">"
                            + "Rest Time"
                        + "</th>"
                        + "<th class=\"hidden-xs\">"
                            + "Trend"
                        + "</th>"
                        + "<th>"
                            + "Action"
                        + "</th>"
                    + "</tr>"
                + "</thead>"
            + "</table>"
          + "</section>";

    return s;
}

function populateDataTable()
{

    var obj = {};
    columns = [
    { mData: "SetNum", sTitle: "Set #" },
    {
        sDefaultContent: "<input type=\"text\" id=\"txtWeight_\" size=\"2\" maxlength=\"2\" width=\"20px\" />",
        mRender: function (data, type, row) {
            var returnVal = "<input type=\"text\" id=\"txtWeight_" + row.DT_RowId + "\" size=\"2\" maxlength=\"2\" width=\"20px\" />";
            return returnVal;
        },
        "aTargets": [1]
    },
    {
        sDefaultContent: "<input type=\"text\" id=\"txtReps_\" size=\"2\" maxlength=\"2\" width=\"20px\" />",
        mRender: function (data, type, row) {
            var returnVal = "<input type=\"text\" id=\"txtReps" + row.DT_RowId + "\" size=\"2\" maxlength=\"2\" width=\"20px\" />";
            return returnVal;
        },
        "aTargets": [2]
    },
     { mData: "RestTime", sTitle: "RestTime", sClass: "hidden-xs" },
    { mData: "Trend", sTitle: "Trend", sClass: "hidden-xs" },
    {
        

        sDefaultContent: "<a id=\"act_Set_\" data-action=\"\" href=\"#\">"
        + "<span class=\"badge badge-success\" id=\"status_\">Edit</span>"
        + "</a>",
        mRender: function (data, type, row) {
            var returnVal = "<a id=\"act_Set_" + row.SetNum + "\" data-action=\"" + row.Action + "\" href=\"#\">"
        + "<span class=\"" + row.cssStyle + "\">" + row.Action + "</span>"
        + "</a>";
            return returnVal;
        },
        "aTargets": [5]
    },
   
    ];



   

}



function initializeDataTable(tableId, rows) {

    //console.log('rows length ' + rows.length);
    oTable = $('#tbl_' + tableId).dataTable({
        "aaData": rows,
            "aoColumns": columns,
            "bDestroy": true,
            "bFilter": false,
            "bLengthChange": false,
        });

    initializeStopWatch(tableId);
}

function initializeStopWatch(exerciseId) {
    var wkStopWatch = new (function (exerciseId) {
        console.log('exercise id ' + exerciseId);
        var $stopwatch, // Stopwatch element on the page

            incrementTime = 70, // Timer speed in milliseconds

            currentTime = 0, // Current time in hundredths of a second

            updateTimer = function () {

                $stopwatch.html(formatTime(currentTime));

                currentTime += incrementTime / 10;

            },

            init = function () {

                $stopwatch = $('#stopwatch_' + exerciseId);

                wkStopWatch.Timer = $.timer(updateTimer, incrementTime, true);

            };

        this.resetStopwatch = function () {

            currentTime = 0;

            this.Timer.stop().once();

        };

        $(init);

    });
}

// Common functions

function pad(number, length) {

    var str = '' + number;

    while (str.length < length) { str = '0' + str; }

    return str;

}

function formatTime(time) {

    var min = parseInt(time / 6000),

        sec = parseInt(time / 100) - (min * 60),

        hundredths = pad(time - (sec * 100) - (min * 6000), 2);

    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;

}

