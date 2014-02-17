
var editor;
var oTable;
var userLockersRef;
var pathname = window.location.pathname.split("/");
var workOutName = pathname[pathname.length - 2];
var selectedDate = pathname[pathname.length - 1];
//var rootRef = new Firebase('https://jdt.firebaseio.com/');
var recordedSetsRef = new Firebase('https://jdt.firebaseio.com/Sets/');
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
var numSets = 0;
var numExercises = 0;
var arrRecordedSets = [];
var recMaxSets;
var dateOfWorkOut;
var parsedDate;

function initListAuth() {
    
    initializeAuth(function (email) {
        setHeader(email);
        setSideNav(email);


        dateOfWorkOut =  getTodaysDate(':');
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
                            var action = $(this).data("act").toUpperCase();
                            if (action == "SAVE") {

                                var set = (i + 1);
                                var reps = $('#txtReps_' + key + '_Set' + (i + 1)).val();
                                var weight = $('#txtWeight_' + key + '_Set' + (i + 1)).val();


                                var recordedSetId = $(this).data("recordedsetid");
                                //console.log('recordedSetId: ' + recordedSetId);
                                //console.log('reps ' + $('#txtReps_' + key + '_Set' + (i + 1)).val());
                                //console.log('act: ' + $(this).data("act"));
                                updateSet(key, set, weight, reps, recordedSetId);
                            }
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

function getTodaysDate(demlimiter) {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + demlimiter +
        (month < 10 ? '0' : '') + month + demlimiter +
        (day < 10 ? '0' : '') + day;

    return output;
}


function setButtonAttributes(tableid,arrSets) {
    
    $('#stopwatch_' + tableid).runner({ milliseconds: false });
    $('.stopwatch_startstop_' + tableid).on('click', function (event) {
        event.preventDefault();
        $('.stopwatch_startstop_' + tableid).toggle();
        $('#stopwatch_' + tableid).runner('toggle');

        $('.txtwght_' + tableid).each(function (index, value) {
            //console.log('weight');
            if (!$('#txtWeight_' + tableid + '_Set' + (index + 1)).val()) {
                //console.log('weight empty');
                $('.wght_' + tableid + '_Set' + (index + 1)).toggle();

                return false;
            }
        });

        $('.txtreps_' + tableid).each(function (index, value) {
            //console.log('reps');
            if (!$('#txtReps_' + tableid + '_Set' + (index + 1)).val()) {
                //console.log('Reps empty');
                $('.reps_' + tableid + '_Set' + (index + 1)).toggle();
                return false;
            }
        });

        $('.act_' + tableid).each(function (index, value) {
            //console.log('testing ' + index + $('#txtReps_' + key + '_Set' + (index + 1)).val());
            var reps = $('#txtReps_' + tableid + '_Set' + (index + 1)).val();
            var weight = $('#txtWeight_' + tableid + '_Set' + (index + 1)).val();
            if (reps.length == 0 ||
                weight.length == 0) {
                //console.log('ffffffff');
                $('.act_' + tableid + '_Set' + (index + 1)).toggle();
                return false;
            }

        });


        $('#stopwatch_reset_' + tableid).on('click', function (event) {
            event.preventDefault();
            $('#stopwatch_' + tableid).runner('reset');

        });


    });
    //console.log('testing');
    $.each(arrSets, function (i, v) {
        var set = (i + 1);
        $('.act_' + v.DT_RowId).on('click', function (event) {
            event.preventDefault();
            //console.log('DT_RowId ' + v.DT_RowId);
            var action = $(this).data("act").toUpperCase();
            var reps;
            var weight;
            if (action == "SAVE") {

                
                reps = $('#txtReps_' + v.DT_RowId).val();
                weight = $('#txtWeight_' + v.DT_RowId).val();


                var recordedSetId = v.DT_RowId;
                //console.log('recordedSetId: ' + recordedSetId);
                //console.log('reps ' + $('#txtReps_' + key + '_Set' + (i + 1)).val());
                //console.log('act: ' + $(this).data("act"));
               
                updateSet(tableid, set, weight, reps, recordedSetId);
            }
            if (action == "CANCEL") {

                reps = $('#reps_' + v.DT_RowId).text();
                weight = $('#wght_' + v.DT_RowId).text();
                

                $('#txtReps_' + v.DT_RowId).val(reps);
                $('#txtWeight_' + v.DT_RowId).val(weight);


                //console.log('recordedSetId: ' + recordedSetId);
                //console.log('reps ' + $('#txtReps_' + key + '_Set' + (i + 1)).val());
                //console.log('act: ' + $(this).data("act"));

                
            }
            //console.log(tableid + ' Set: ' + set);
            $('.act_' + v.DT_RowId).toggle();
            $('.wght_' + v.DT_RowId).toggle();
            $('.reps_' + v.DT_RowId).toggle();
        });
    });
}




function populateList(email, callback) {


    getUserIdByEmail(email, function(uid) {
   
        userRef.
            child(uid).
            once('value', function(snapShot) {
                populateDataTable();
                //console.log('locker id ' + lockersRef.child(snapShot.val().LockerId + '/Active/').child(workOutName).toString());

                lockerId = snapShot.val().LockerId;
                

                        var description;
                        //console.log('num ex ' + workOutsRef.child(activeWorkOutSnapShot.name()).child('Exercises').toString());
                        workOutsRef.
                            child(workOutName).
                            once('value', function(workOutSnap) {
                                description = workOutSnap.val().Description != null ? workOutSnap.val().Description : "";
                                $('#workOutTitle').append(workOutSnap.val().Name + '<small>' + description + '</small>');


                                var workOutExRef = workOutsRef.
                                    child(workOutName).
                                    child('Exercises');

                                parsedDate = selectedDate.replace(/_/g, ':');
                            //console.log('parsed Date ' + parsedDate);
                            workOutExRef.once('value', function(snap) {
                                populateDataTable();
                                workOutExRef.on('child_added', exerciseAdded);

                            });

      
                        });

                           
                    });



    });
}




function updateSet(exerciseId, set, weight, reps,recordedSetId) {
    console.log('update set');
    //var z = lockersRef.child(lockerId + '/JustDoThis/WorkOuts/' + workOutName + '/RecordedSets/');
    var o = {};

    o.WorkOutId = workOutName;
    o.ExerciseId = exerciseId;
    o.Set = $.trim(set);
    o.Weight = $.trim(weight);
    o.Reps = reps;

    initializeAuth(function (email) {
       
            //z.off('child_changed', recordedSetChanged);
        recordedSetsRef.
            child(parsedDate).
                child(recordedSetId).
                update(o, function(err) {
                    if (!err) {
                        console.log('recorded set id ' + recordedSetId);

                        lockersRef.
                            child(lockerId).
                            child('JustDoThis').
                            child('WorkOuts').
                            child(workOutName).
                            child(parsedDate).
                            child('Exercises').
                            child(exerciseId).
                            child('Sets').
                            child(recordedSetId).
                            set(Firebase.ServerValue.TIMESTAMP, function(err) {
                            if (!err) {
                                //z.on('child_changed', recordedSetChanged);
                                console.log('success');
                               
                                
                            }

                        });
                        
                    }
    });

 
    });
}

function renderAccordion(exerciseId, exerciseName, target) {
   // console.log(target);
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
    { mData: "Set", sTitle: "Set #" },
    {
        //sDefaultContent: "<input type=\"text\" class=\"wght_\" id=\"txtWeight_\" disabled=\"disabled\" size=\"2\" maxlength=\"2\" width=\"20px\" />",
        mData: null,
        mRender: function (data, type, row) {
            var returnVal = "<div class=\"wght_" + row.DT_RowId + "\"  style=\"display: none\">"
                + "<input type=\"text\" class=\"txtwght_" + row.ExerciseId + "\" id=\"txtWeight_" + row.DT_RowId + "\" value=\"" + row.Weight + "\" size=\"2\" maxlength=\"2\" width=\"20px\" /></div>"
             + "<div class=\"wght_" + row.DT_RowId + "\" id=\"wght_" + row.DT_RowId + "\">" + row.Weight + "</div>";
            return returnVal;
        },
        "aTargets": [1]
    },
    {
        //sDefaultContent: "<input type=\"text\" class=\"reps_\" disabled=\"disabled\" id=\"txtReps_\" size=\"2\" maxlength=\"2\" width=\"20px\" />",
        mData: null,
        mRender: function (data, type, row) {
            var returnVal = "<div class=\"reps_" + row.DT_RowId + "\"  style=\"display: none\">"
                + "<input type=\"text\" class=\"txtreps_" + row.ExerciseId + "\" id=\"txtReps_" + row.DT_RowId + "\" value=\"" + row.Reps + "\"  size=\"2\" maxlength=\"2\" width=\"20px\" /></div>"
            + "<div class=\"reps_" + row.DT_RowId + "\" id=\"reps_" + row.DT_RowId + "\">" + row.Reps +"</div>";
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
            returnVal = "<div data-act=\"Save\" class=\"act_" + row.DT_RowId + "\" style=\"display:none\"><a href=\"\">"
                + "<span class=\"badge badge-success\">Save</span>"
                + "</a></div>"
                + "<div data-act=\"Cancel\" class=\"act_" + row.DT_RowId + "\" style=\"display:none\"><a href=\"\">"
                + "<span class=\"badge badge-information\">Cancel</span>"
                + "</a></div>"
                + "<div data-act=\"Edit\" class=\"act_" + row.DT_RowId + "\"><a href=\"\">"
                + "<span class=\"badge badge-warning\">Edit</span>"
                + "</a></div>";
            return returnVal;
        },
        "aTargets": [5]
    }
   
    ];



   

}

function initializeDataTable(tableId, rows,callback) {
    //initializeStopWatch(tableId);
    //console.log('rows length ' + rows.length);
    oTable = $('#tbl_' + tableId).dataTable({
        "aaData": rows,
            "aoColumns": columns,
        "bDestroy": true,

            "bFilter": false,
            "bLengthChange": false,
        "bAutoWidth":false,
    });

    if (oTable != null)
        callback();

}



var exerciseAdded = function(snapShot) {
    var exerciseId = snapShot.name();
    var rows = [];
    var numSets = 0;

    
    exercisesRef.child(exerciseId).once('value', function(childSnapShot) {
        var target = childSnapShot.val().RecMinReps + ' - ' + childSnapShot.val().RecMaxReps;
        $('#accordion3').
            append(renderAccordion(childSnapShot.name(),
            childSnapShot.val().Name, target));

        var exerciseSetsRef = lockerRef.
        child(lockerId).
            child("JustDoThis").
            child("WorkOuts").
            child(workOutName).
            child(parsedDate).
            child("Exercises").
            child(exerciseId).
            child("Sets");

        //console.log(exerciseSetsRef.toString());
            
            //query exercises node to get number of sets 
        exerciseSetsRef.
            once('value', function (snap) {
                numSets = snap.numChildren();
                //console.log('num of sets ' + numSets);
            });


        
        exerciseSetsRef.on('child_added', function (setSnap) {
            recordedSetsRef.
                child(parsedDate).
                child(setSnap.name()).
                once('value', function (childSnap) {
                var o;
                o = childSnap.val();
                //console.log(JSON.stringify(o));
                o.DT_RowId = childSnap.name();
                rows.push(o);
                
                if (rows.length === numSets) {
                    //console.log('numSets ' + numSets + ' exerciseId ' + exerciseId);
                    initializeDataTable(exerciseId, rows, function() {
                        setButtonAttributes(exerciseId, rows);
                    });
                }
            });
           
        });

        exerciseSetsRef.on('child_changed', function (setSnap) {
            recordedSetsRef.
                child(parsedDate).
                child(setSnap.name()).
                once('value', function(childSnap) {
                    var o = childSnap.val();
                    var i = 0;

                    var table = $('#tbl_' + exerciseId).dataTable();
                    rows = table.fnGetData();
                console.log('rows length ' + rows.length);
                    $.each(rows, function() {
                        if (this.DT_RowId == childSnap.name()) {
                            console.log('found it');
                            o = childSnap.val();
                            o.DT_RowId = childSnap.name();
                            return false;

                        }
                        console.log('asdfsdaf ' + i);
                        i++;
                    });

                    rows[i] = o;

                    initializeDataTable(exerciseId, rows, function() {
                        setButtonAttributes(exerciseId, rows);
                    });
                });

        });


    });
};

