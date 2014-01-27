
var editor;
var oTable;
var userLockersRef;
var pathname = window.location.pathname.split("/");
var workOutName = pathname[pathname.length - 1];
//var rootRef = new Firebase('https://jdt.firebaseio.com/');
var recordedSetsRef = new Firebase('https://jdt.firebaseio.com/RecordedSets/');
var userRef = new Firebase('https://jdt.firebaseio.com/Users/user/');
var workOutsRef = new Firebase('https://jdt.firebaseio.com/WorkOuts/');

var lockersRef = new Firebase('https://jdt.firebaseio.com/Lockers/');
var exercisesRef = new Firebase('https://jdt.firebaseio.com/Exercises/');
var workOutExercisesRef;
var userPlansRef;
var lockerId;
var arrMaster = [];
var columns;
var workOutEx = [];


function initListAuth() {
    
    initializeAuth(function (email) {
        setHeader(email);
        setSideNav(email);


        populateList(email, function (dataTableId) {
            
         
           
           // console.log('master arr: ' + arrMaster.length);

            $.each(arrMaster, function (index, value) {

                //    //console.log('key: ' + value.name());
                //    //console.log('value: ' + JSON.stringify(value));
                var key;
                    for (key in value)
                    {


                    initializeDataTable(key, value[key], function (tableid) {
                        $('#stopwatch_' + tableid).runner({ milliseconds: false });
                        $('.stopwatch_startstop_' + tableid).on('click', function (event) {
                            event.preventDefault();
                            $('.stopwatch_startstop_' + tableid).toggle();
                            $('#stopwatch_' + tableid).runner('toggle');

                            $('.txtwght_' + key).each(function() {
                                //console.log('weight');
                                if (!$('#txtWeight_' + key + '_Set' + (index + 1)).val()) {
                                    //console.log('weight empty');
                                    $('.wght_' + key + '_Set' + (index + 1)).toggle();

                                    return false;
                                }
                            });

                            $('.txtreps_' + key).each(function () {
                                //console.log('reps');
                                if (!$('#txtReps_' + key + '_Set' + (index + 1)).val()) {
                                    //console.log('Reps empty');
                                    $('.reps_' + key + '_Set' + (index + 1)).toggle();
                                    return false;
                                }
                            });

                            $('.act_' + key).each(function () {
                                //console.log('testing ' + index + $('#txtReps_' + key + '_Set' + (index + 1)).val());
                                var reps = $('#txtReps_' + key + '_Set' + (index + 1)).val();
                                var weight = $('#txtWeight_' + key + '_Set' + (index + 1)).val();
                                if (reps.length == 0 ||
                                    weight.length == 0) {
                                    //console.log('ffffffff');
                                    $('.act_' + key + '_Set' + (index + 1)).toggle();
                                    return false;
                                }
                        
                            });
                   

                            $('#stopwatch_reset_' + tableid).on('click', function (event) {
                                event.preventDefault();
                                $('#stopwatch_' + tableid).runner('reset');

                            });

                            
                        });
                    });
                    $.each(value[key], function (i, v) {
                        $('.act_' + key + '_Set' + (i + 1)).on('click', function (event) {
                            event.preventDefault();
                            var set = (i + 1);
                            var reps = $('#txtReps_' + key + '_Set' + (i + 1)).val();
                            var weight = $('#txtWeight_' + key + '_Set' + (i + 1)).val();


                            var recordedSetId = $(this).data("recordedsetid");
                            console.log('recordedSetId: ' + recordedSetId);
                            //console.log('reps ' + $('#txtReps_' + key + '_Set' + (i + 1)).val());
                            //console.log('act: ' + $(this).data("act"));
                            if(recordedSetId=="0")
                                createSet(key, set, weight, reps);
                            else
                                updateSet(key, set, weight, reps, recordedSetId);

                            $('.act_' + key + '_Set' + (i + 1)).toggle();
                            $('.wght_' + key + '_Set' + (i + 1)).toggle();
                            $('.reps_' + key + '_Set' + (i + 1)).toggle();
                        });
                    });
                    }
                });
              });
    });
    
    
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




function populateInitArray(exerciseId, uid, targetSets,arrRecSets, callback) {
   
    //workOutExercisesRef = workOutsRef.child(dataTableId).child('/Exercises/');
    //var numChild;
    //var z = [];
    var rows = [];
    var k = {};
    //console.log('datatableid ' + arrRecSets.length);

    var arrGrepResult = [];
    
        
       
   
    for (var i = 0; i < targetSets; i++) {
        
        arrGrepResult = $.grep(arrRecSets, function (n, index) {
            return (n.ExerciseId == exerciseId && n.Set==(i+1));

        });

        var o = {};
       
        o.SetNum = i + 1;
        o.Time = "";
        o.Trend = "";

        o.Weight = "";
        o.Reps = "";

        o.RecordedSetId = "0";

        if (arrGrepResult.length == 1) {
            console.log('arrvalue ' + JSON.stringify(arrGrepResult[0]));

            o.Weight = arrGrepResult[0].Weight;
            o.Reps = arrGrepResult[0].Reps;
            o.RecordedSetId = arrGrepResult[0].RecordedSetId;
        }
        
        o.DT_RowId = exerciseId + "_Set" + (i + 1);
        o.ExerciseId = exerciseId;
        rows.push(o);
        //console.log('rows length ' + rows.length);
    }

    if (rows.length == targetSets) {
        //console.log('equal');
        k[exerciseId] = rows;
        callback(k);
    }
       
}



function populateList(email, callback) {

    
    getUserIdByEmail(email, function (uid) {

        userRef.
            child(uid).
            once('value', function (snapShot) {

            //console.log('locker id ' + lockersRef.child(snapShot.val().LockerId + '/Active/').child(workOutName).toString());

            lockerId = snapShot.val().LockerId;
            lockersRef.
                child(lockerId + '/JustDoThis/WorkOuts/' + workOutName).
                on('value', function(lockerWorkOutSnapShot) {
                    populateDataTable();
                var numOfExercises = 0;
                    
                    var description;
                    //console.log('num ex ' + workOutsRef.child(activeWorkOutSnapShot.name()).child('Exercises').toString());
                    workOutsRef.
                        child(lockerWorkOutSnapShot.name()).
                        on('value', function(workOutSnap) {
                            description = workOutSnap.val().Description != null ? workOutSnap.val().Description : "";
                            $('#workOutTitle').append(workOutSnap.val().Name + '<small>' + description + '</small>');
                        });
                    var arrRecSets = [];
                    lockersRef.
                        child(lockerId + '/JustDoThis/WorkOuts/' + workOutName + '/RecordedSets/').
                        on('child_added', function(recordedSetSnapShot) {
                        recordedSetsRef.
                            child(recordedSetSnapShot.name()).
                            on('value', function (recordedSetChildSnap) {
                                var o;
                                o = recordedSetChildSnap.val();
                                o.RecordedSetId = recordedSetSnapShot.name();
                                arrRecSets.push(o);

                        });
                        
                    });
                   

                    workOutsRef.
                        child(lockerWorkOutSnapShot.name()).
                        child('Exercises').
                        on('child_added', function (exerciseSnap) {
                        numOfExercises += 1;
                                exercisesRef.
                                    child(exerciseSnap.name()).
                                    on('value', function (snap) {
                                    //console.log('snap value: ' + JSON.stringify(snap.val()));
                                    var setNum = snap.val().RecMaxSets;
                                    var targetMinReps = snap.val().RecMinReps;
                                    var targetMaxReps = snap.val().RecMaxReps;
                                    var target = targetMinReps + '-' + targetMaxReps;
                                        

                                    $('#accordion3').
                                        append(renderTable(snap.name(), snap.val().Name, target));
                                    populateInitArray(exerciseSnap.name(),uid, setNum, arrRecSets, function (x) {
                                    
                                    arrRecSets = [];
                                    arrMaster.push(x);
                                    if (arrMaster.length == numOfExercises) {
                                        console.log('callback');
                                        callback(snap.name());
                                    }
                                });
                            });
                        
                });   
            });
        });
    });
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

function createSet(exerciseId, set, weight, reps)
{
    var recordedSetId = null;
    var date = getTodaysDate();
    var o = {};
    o.Date = date;
    o.WorkOutId = workOutName;
    o.ExerciseId = exerciseId;
    o.Set = set;
    o.Weight = weight;
    o.Reps = reps;
    console.log('createSet');
    initializeAuth(function (email) {
        getUserIdByEmail(email, function (uid) {
            recordedSetId = recordedSetsRef.
            push(o, function (err) {
                if (!err)
                {
                    lockersRef.
                    child(lockerId).
                    child('JustDoThis').
                    child('WorkOuts').
                    child(workOutName).
                    child('RecordedSets').
                    child(recordedSetId).
                    set(Firebase.ServerValue.TIMESTAMP);
                }
            }).name();

        });
    });
}

function updateSet(exerciseId, set, weight, reps,recordedSetId) {
    
    var date = getTodaysDate();
    var o = {};
    o.Date = date;
    o.WorkOutId = workOutName;
    o.ExerciseId = exerciseId;
    o.Set = set;
    o.Weight = weight;
    o.Reps = reps;

    initializeAuth(function (email) {
        getUserIdByEmail(email, function (uid) {
            recordedSetsRef.
            child(recordedSetId).
            update(o, function (err) {
                if (!err) {
                    lockersRef.
                    child(lockerId).
                    child('JustDoThis').
                    child('WorkOuts').
                    child(workOutName).
                    child('RecordedSets').
                    child(recordedSetId).
                    set(Firebase.ServerValue.TIMESTAMP);
                }
            });

        });
    });
}

function renderTable(exerciseId, exerciseName, target) {
    console.log(target);
    var s = "<div class=\"panel\">"
            + "<div class=\"row panel-heading\">"
                + "<div class=\"col-md-9\">"
                    + "<div class=\"panel-heading\">"
                        + "<a class=\"accordion-toggle\" id=\"acc_" + exerciseId + "\" data-toggle=\"collapse\" href=\"#" + exerciseId + "\">"
                          + exerciseName + " | Rep Target: " + target
                        + "</a>"
                    + "</div>"
                + "</div>"
                + "<div class=\"col-md-3\">"
                    + "<div id=\"stopwatch_" + exerciseId + "\"/>"
                    + "<div class=\"row\">"
                        + "<div class=\"col-xs-3\">"
                            + "<div class=\"stopwatch_startstop_" + exerciseId + "\">"
                            + "<a data-action=\"\" href=\"\">"
                            + "<span class=\"badge badge-success\">Start</span>"
                            + "</a>"
                        + "</div>"
                        + "<div class=\"stopwatch_startstop_" + exerciseId + "\" style=\"display: none\">"
                            + "<a data-action=\"\" href=\"\">"
                            + "<span class=\"badge badge-danger\">Stop</span>"
                            + "</a>"
                        + "</div>"
                    + "</div>"
                    + "<div class=\"col-xs-3\">"
                        + "<div id=\"stopwatch_reset_" + exerciseId + "\">"
                            + "<a data-action=\"\" href=\"#\">"
                            + "<span class=\"badge badge-info\">Reset</span>"
                            + "</a>"
                        + "</div>"
                    + "</div>"
                + "</div>"
            + "</div>"
            + "</div>"
            + "<div id=\"" + exerciseId + "\" class=\"panel-collapse collapse\" style=\"height: 0px;\">"
                + "<div class=\"panel-body\">"
                    + "<section class=\"widget\">"
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
                                        + "Time"
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
                    + "</section>"
                + "</div>"
            + "</div>"
        + "</div>";
    return s;
}

function populateDataTable()
{

    var obj = {};
    columns = [
    { mData: "SetNum", sTitle: "Set #" },
    {
        //sDefaultContent: "<input type=\"text\" class=\"wght_\" id=\"txtWeight_\" disabled=\"disabled\" size=\"2\" maxlength=\"2\" width=\"20px\" />",
        mData: null,
        mRender: function (data, type, row) {
            var returnVal = "<div class=\"wght_" + row.ExerciseId + " wght_" + row.DT_RowId + "\"  style=\"display: none\">"
                + "<input type=\"text\" class=\"txtwght_" + row.ExerciseId + "\" id=\"txtWeight_" + row.DT_RowId + "\" value=\"" + row.Weight + "\" size=\"2\" maxlength=\"2\" width=\"20px\" /></div>"
             + "<div class=\"wght_" + row.ExerciseId + " wght_" + row.DT_RowId + "\"\">" + row.Weight + "</div>";
            return returnVal;
        },
        "aTargets": [1]
    },
    {
        //sDefaultContent: "<input type=\"text\" class=\"reps_\" disabled=\"disabled\" id=\"txtReps_\" size=\"2\" maxlength=\"2\" width=\"20px\" />",
        mData: null,
        mRender: function (data, type, row) {
            var returnVal = "<div class=\"reps_" + row.ExerciseId + " reps_" + row.DT_RowId + "\"  style=\"display: none\">"
                + "<input type=\"text\" class=\"txtreps_" + row.ExerciseId + "\" id=\"txtReps_" + row.DT_RowId + "\" value=\"" + row.Reps + "\"  size=\"2\" maxlength=\"2\" width=\"20px\" /></div>"
            + "<div class=\"reps_" + row.ExerciseId + " reps_" + row.DT_RowId + "\">" + row.Reps +"</div>";
            return returnVal;
        },
        "aTargets": [2]
    },
     { mData: "Time", sTitle: "Time", sClass: "hidden-xs" },
    { mData: "Trend", sTitle: "Trend", sClass: "hidden-xs" },
    {
        

        mData:null,
        mRender: function (data, type, row) {
            var returnVal;
            returnVal = "<div data-recordedsetid=\"" + row.RecordedSetId + "\" class=\"act_" + row.DT_RowId + " act_" + row.ExerciseId + "\" style=\"display:none\"><a href=\"\">"
                + "<span class=\"badge badge-success\">Save</span>"
                + "</a></div>"
                + "<div data-act=\"Edit\" class=\"act_" + row.DT_RowId + " act_" + row.ExerciseId + "\"><a href=\"\">"
                + "<span class=\"badge badge-warning\">Edit</span>"
                + "</a></div>";
            return returnVal;
        },
        "aTargets": [5]
    },
   
    ];



   

}



function initializeDataTable(tableId, rows, callback) {
    //initializeStopWatch(tableId);
    //console.log('rows length ' + rows.length);
    oTable = $('#tbl_' + tableId).dataTable({
        "aaData": rows,
            "aoColumns": columns,
            "bDestroy": true,
            "bFilter": false,
            "bLengthChange": false,
        });

    if (oTable != null)
        callback(tableId);
}



