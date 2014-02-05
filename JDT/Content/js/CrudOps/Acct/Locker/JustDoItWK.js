
var editor;
var oTable;
var userLockersRef;
var pathname = window.location.pathname.split("/");
var workOutName = pathname[pathname.length - 1];
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
var numRecordedSets = 0;
var arrRecordedSets = [];
var recMaxSets;
var dateOfWorkOut;

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
                                if (recordedSetId == "0")
                                    createSet(key, set, weight, reps);
                                else
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
    console.log('testing');
    $.each(arrSets, function (i, v) {
        var set = (i + 1);
        $('.act_' + tableid + '_Set' + set).on('click', function (event) {
            event.preventDefault();
            var action = $(this).data("act").toUpperCase();
            if (action == "SAVE") {

                
                var reps = $('#txtReps_' + tableid + '_Set' + set).val();
                var weight = $('#txtWeight_' + tableid + '_Set' + set).val();


                var recordedSetId = $(this).data("recordedsetid");
                console.log('recordedSetId: ' + recordedSetId);
                //console.log('reps ' + $('#txtReps_' + key + '_Set' + (i + 1)).val());
                //console.log('act: ' + $(this).data("act"));
               
                updateSet(tableid, set, weight, reps, recordedSetId);
            }
            //console.log(tableid + ' Set: ' + set);
            $('.act_' + tableid + '_Set' + set).toggle();
            $('.wght_' + tableid + '_Set' + set).toggle();
            $('.reps_' + tableid + '_Set' + set).toggle();
        });
    });
}




function populateList(email, callback) {


    getUserIdByEmail(email, function(uid) {
        var numOfExercises = 0;
        
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


                                workOutSnap.
                                    child('Exercises').
                                    forEach(function(exerciseSnapShot) {
                                        //console.log(exerciseSnapShot.name());
                                        var r = [];
                                    exercisesRef.child(exerciseSnapShot.name()).
                                        on('value', function (exerciseChildSnapShot) { 
                                    recMaxSets = exerciseChildSnapShot.val().RecMaxSets;
                                            recMaxSets = exerciseChildSnapShot.val().RecMaxSets;
                                           
                                            var target = exerciseChildSnapShot.val().RecMinReps + ' - ' + exerciseChildSnapShot.val().RecMaxReps;
                                            $('#accordion3').
                                                append(renderTable(exerciseChildSnapShot.name(), exerciseChildSnapShot.val().Name, target));
                                            
                                            

                                            console.log('locker ' + lockerId);

  
                                            lockersRef.
                                               child(lockerId + '/JustDoThis/WorkOuts/' + workOutName + '/' + dateOfWorkOut + '/Exercises/' + exerciseChildSnapShot.name() + '/Sets/').
                                               on('child_added', recordedSetAdded);

                                            lockersRef.
                                                child(lockerId + '/JustDoThis/WorkOuts/' + workOutName + '/' + dateOfWorkOut + '/Exercises/' + exerciseChildSnapShot.name() + '/Sets/').
                                                on('child_changed', recordedSetChanged);

                                            });
                                           
                                            
                                    });
                                        
                                        

                                    //});
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
            child(dateOfWorkOut).
                child(recordedSetId).
                update(o, function(err) {
                    if (!err) {
                        console.log('recorded set id ' + recordedSetId);

                        lockersRef.
                            child(lockerId).
                            child('JustDoThis').
                            child('WorkOuts').
                            child(workOutName).
                            child(dateOfWorkOut).
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

function renderTable(exerciseId, exerciseName, target) {
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
            returnVal = "<div data-act=\"Save\" data-recordedsetid=\"" + row.RecordedSetId + "\" class=\"act_" + row.DT_RowId + " act_" + row.ExerciseId + "\" style=\"display:none\"><a href=\"\">"
                + "<span class=\"badge badge-success\">Save</span>"
                + "</a></div>"
                + "<div data-act=\"Edit\" class=\"act_" + row.DT_RowId + " act_" + row.ExerciseId + "\"><a href=\"\">"
                + "<span class=\"badge badge-warning\">Edit</span>"
                + "</a></div>";
            return returnVal;
        },
        "aTargets": [5]
    }
   
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
        "bAutoWidth":false,
        });

    if (oTable != null)
        callback(tableId);
}

function pushAndInitTable(obj,exerciseId) {
   

    arrRecordedSets.push(obj);
    //console.log('test');
    initializeDataTable(exerciseId,arrRecordedSets, function(snapper) {
        //console.log('data table initialized ' + exerciseId);
        setButtonAttributes(exerciseId, arrRecordedSets);
    });

}

var recordedSetAdded = function(recordedSetSnapShot,callback) {
    console.log('recorded set added');
    recordedSetsRef.
        child(dateOfWorkOut).
        child(recordedSetSnapShot.name()).
        once('value', function(recordedSetChildSnap) {
            //console.log('recordedSetSnapShotName ' + recordedSetSnapShot.name());
            var o= {};
            //console.log('fffffff');
            o = recordedSetChildSnap.val();
            //console.log('eeeee ' + JSON.stringify(o));
            o.RecordedSetId = recordedSetSnapShot.name();
            o.DT_RowId = o.ExerciseId + "_Set" + o.Set;
            //arrRecordedSets.push(o);
            //console.log('sdfsdf');
            callback(pushAndInitTable(o,o.ExerciseId));
        });
    
};

var recordedSetChanged = function (recordedSetSnapShot) {
    
    console.log('recorded set changed');
    //console.log('aadata ' + oTable.fnGetData());
    //console.log('exercise name ' + JSON.stringify(recordedSetSnapShot.val()));


    recordedSetsRef.
        child(dateOfWorkOut).
        child(recordedSetSnapShot.name()).
        once('value', function (recordedSetChildSnap) {
        //console.log('recordedSetSnapShotName ' + recordedSetSnapShot.name());
        var o;
        var arrRecSets = [];
        o = recordedSetChildSnap.val();
        o.RecordedSetId = recordedSetSnapShot.name();
        oTable = $('#tbl_' + o.ExerciseId).dataTable();
        //console.log('fsdf ' + JSON.stringify(o));

        var aData = oTable.fnGetData();
        $.each(aData, function (index, value) {

            if (value.RecordedSetId == recordedSetSnapShot.name()) {
                value.Weight = o.Weight;
                value.Reps = o.Reps;
               // console.log('found it');
            }
            arrRecSets.push(value);
            //console.log('value ' + JSON.stringify(value));
        });
        if (arrRecSets.length == aData.length) {
            initializeDataTable(o.ExerciseId, arrRecSets, function(x) {
                setButtonAttributes(x, arrRecSets);

            });
        }
        
    });

}