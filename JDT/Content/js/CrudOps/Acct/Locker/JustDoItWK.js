
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

                //    //console.log('key: ' + value.name());
                //    //console.log('value: ' + JSON.stringify(value));
                    var key
                    for (key in value)
                    {


                    initializeDataTable(key, value[key], function (tableid) {
                        $('#stopwatch_' + tableid).runner();
                        $('.stopwatch_startstop_' + tableid).on('click', function (event) {
                    event.preventDefault();
                    $('.stopwatch_startstop_' + tableid).toggle();
                    $('#stopwatch_' + tableid).runner('toggle');

                    $('.txtwght_' + key).each(function () {
                        console.log('weight');
                        if (!$('#txtWght_' + key + '_Set' + (index + 1)).val()) {
                            console.log('weight empty');
                            $('.wght_' + key + '_Set' + (index + 1)).toggle();
                            
                            return false;
                        }
                    })

                    $('.txtreps_' + key).each(function () {
                        console.log('reps');
                        if (!$('#txtReps_' + key + '_Set' + (index + 1)).val()) {
                            console.log('Reps empty');
                            $('.reps_' + key + '_Set' + (index + 1)).toggle();
                            return false;
                        }
                    });

                    $('.act_' + key).each(function () {

                        if ($('#txtReps_' + key + '_Set' + (index + 1)).val()!="" ||
                            $('#txtWght_' + key + '_Set' + (index + 1)).val()!="") {
                            
                            $('.act_' + key + '_Set' + (index + 1)).toggle();
                            return false;
                        }
                        
                    });
                   

                    $('#stopwatch_reset_' + tableid).on('click', function (event) {
                        event.preventDefault();
                        $('#stopwatch_' + tableid).runner('reset');

                    });

                    $.each(value[key], function (i, v) {
                        $('.act_' + key + '_Set' + (i + 1)).on('click', function (event) {
                            event.preventDefault();
                            //alert('ffjfjf');
                            $('.act_' + key + '_Set' + (i + 1)).toggle();
                            $('.wght_' + key + '_Set' + (i + 1)).toggle();
                            $('.reps_' + key + '_Set' + (i + 1)).toggle();
                        });
                    });
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
            o.Action = "Save";
        }
        else {

            o.cssStyle = "badge badge-warning";
            o.Action = "Edit";
        }
        o.DT_RowId = dataTableId + "_Set" + (i + 1);
        o.ExerciseId = dataTableId;
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

            //console.log('locker id ' + lockersRef.child(snapShot.val().LockerId + '/Active/').child(workOutName).toString());
            
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
                    + "<div class=\"row\">"
                    + "<div class=\"col-md-9\">"
                    + "<h4>"
                        + "<i class=\"fa fa-list-alt\"></i>"
                        + exerciseName + " | Rep Target: " + target
                    + "</h4>"
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
                    + "</div>"
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
        sDefaultContent: "<input type=\"text\" class=\"wght_\" id=\"txtWeight_\" disabled=\"disabled\" size=\"2\" maxlength=\"2\" width=\"20px\" />",
        mRender: function (data, type, row) {
            var returnVal = "<div class=\"wght_" + row.ExerciseId + " wght_" + row.DT_RowId + "\"  style=\"display: none\">"
                + "<input type=\"text\" class=\"txtwght_" + row.ExerciseId + "\" id=\"txtWeight_" + row.DT_RowId + "\" size=\"2\" maxlength=\"2\" width=\"20px\" /></div>"
             + "<div class=\"wght_" + row.ExerciseId + " wght_" + row.DT_RowId + "\"\">0</div>";
            return returnVal;
        },
        "aTargets": [1]
    },
    {
        sDefaultContent: "<input type=\"text\" class=\"reps_\" disabled=\"disabled\" id=\"txtReps_\" size=\"2\" maxlength=\"2\" width=\"20px\" />",
        mRender: function (data, type, row) {
            var returnVal = "<div class=\"reps_" + row.ExerciseId + " reps_" + row.DT_RowId + "\"  style=\"display: none\">"
                + "<input type=\"text\" class=\"txtreps_" + row.ExerciseId + "\"  disabled=\"disabled\" id=\"txtReps" + row.DT_RowId + "\" size=\"2\" maxlength=\"2\" width=\"20px\" /></div>"
            + "<div class=\"reps_" + row.ExerciseId + " reps_" + row.DT_RowId + "\">0</div>";
            return returnVal;
        },
        "aTargets": [2]
    },
     { mData: "RestTime", sTitle: "RestTime", sClass: "hidden-xs" },
    { mData: "Trend", sTitle: "Trend", sClass: "hidden-xs" },
    {
        

        sDefaultContent: "<div class=\"" + + "\"<a id=\"act_Set_\" data-action=\"\" href=\"\">"
        + "<span class=\"badge badge-success\" id=\"status_\">Save</span>"
        + "</a>",
        mRender: function (data, type, row) {
            var returnVal;
            //if (row.Weight == null || row.Reps == null) {
            //    returnVal = "<div class=\"act_" + row.DT_RowId + "\"><a href=\"\">"
            //           + "<span class=\"badge badge-success\">Save</span>"
            //           + "</a></div>"
            //           + "<div class=\"act_" + row.DT_RowId + "\" style=\"display:none\"><a href=\"\">"
            //           + "<span class=\"badge badge-warning\">Edit</span>"
            //           + "</a></div>";

            //}
            //else {
            //    returnVal = "<div class=\"act_" + row.DT_RowId + "\" style=\"display:none\"><a href=\"\">"
            //           + "<span class=\"badge badge-success\">Save</span>"
            //           + "</a></div>"
            //           + "<div class=\"act_" + row.DT_RowId + "\"><a href=\"\">"
            //           + "<span class=\"badge badge-warning\">Edit</span>"
            //           + "</a></div>"
            //}
             
            returnVal = "<div class=\"act_" + row.DT_RowId + " act_" + row.ExerciseId + "\" style=\"display:none\"><a href=\"\">"
                       + "<span class=\"badge badge-success\">Save</span>"
                       + "</a></div>"
                       + "<div class=\"act_" + row.DT_RowId + "\"><a href=\"\">"
                       + "<span class=\"badge badge-warning\">Edit</span>"
                       + "</a></div>"
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



