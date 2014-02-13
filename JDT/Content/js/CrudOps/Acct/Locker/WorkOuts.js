var editor;
var oTable;
var userLockersRef;
var pathname = window.location.pathname.split("/");
var planName = pathname[pathname.length - 1];
var userRef = new Firebase('https://jdt.firebaseio.com/Users/user/');
var workOutsRef = new Firebase('https://jdt.firebaseio.com/WorkOuts/');
var plansRef = new Firebase('https://jdt.firebaseio.com/Plans/');
var planWorkOutsRef = plansRef.child(planName + '/WorkOuts/');
var lockersRef = new Firebase('https://jdt.firebaseio.com/Lockers/');
var exercisesRef = new Firebase('https://jdt.firebaseio.com/Exercises/');
var setsRef = new Firebase('https://jdt.firebaseio.com/Sets/');
var workOutExercisesRef;
var userPlansRef;
var columns;
var dateOfMostReceientWO;


function initListAuth() {

    initializeAuth(function(email) {
        setHeader(email);
        setSideNav(email);
      
        populateList(email);


    });


}

function getTodaysDate(delimiter) {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + delimiter +
        (month < 10 ? '0' : '') + month + delimiter +
        (day < 10 ? '0' : '') + day;

    return output;
}

function populateList(email) {
    
  
    getUserIdByEmail(email, function (uid) {

        userRef.child(uid).once('value', function (snapShot) {

            var lockerWorkOutsRef = lockersRef.child(snapShot.val().LockerId + '/JustDoThis/WorkOuts/');
            lockerWorkOutsRef.once('value', function (lockerSnapShot) {
                populateDataTable();
                lockerWorkOutsRef.on('child_added', workOutsAdded);

            }); 
        });
    }); 
}

function updateWorkOutStatus(action,workOutId, callback) {
    console.log(action);
    initializeAuth(function (email) {
        getUserIdByEmail(email, function (uid) {
            userRef.child(uid).once('value', function (snapShot) {
                var o1 = {
                    'DateModified': getTodaysDate('/'),

                };
                var lockerId = snapShot.val().LockerId;
                var lockerWorkOutRef = lockersRef.child(snapShot.val().LockerId).child('JustDoThis').child('WorkOuts').child(workOutId);
                var setsExist=false;
                switch (action.toUpperCase()) {
                    case 'START':
                        o1.Status = 'ACTIVE';
                        break;
                    case 'REMOVE':
                        o1.Status = 'REMOVED';
                        break;
                    case 'CONTINUE':
                        o1.Status = 'ACTIVE';
                        break;
                }

                
                lockerWorkOutRef.child(getTodaysDate(':')).on('value', function(snap) {
                    setsExist = snap.hasChildren();

                });

                lockerWorkOutRef.update(o1, function () {
                    //console.log('status: ' + o1.Status.toUpperCase());
                    //console.log('setExists: ' + setsExist);
                    if (o1.Status.toUpperCase() === "ACTIVE" && setsExist===false) {
                        //console.log('true');
                        var todaysDate = getTodaysDate(':');
                        workOutsRef.
                            child(workOutId).
                            child("Exercises").
                            on('child_added', function(snap) {
                            //console.log('added');
                                exercisesRef.child(snap.name()).once('value', function (childSnapShot) {
                                    //console.log('testing');
                                    var numSets = childSnapShot.val().RecMaxSets;
                                    //console.log('numSets ' + numSets);
                                    for (var i = 0; i < numSets; i++) {
                                        //var o; //= childSnap.val();
                                        
                                        var o = {};
                                        o.Set = (i + 1);
                                        //console.log('fjfjfj');
                                        o.ExerciseId = childSnapShot.name();
                                        o.WorkOutId = workOutId;
                                        o.Weight = "";
                                        o.Reps = "";
                                        o.Time = "";
                                        o.Trend = "";
                                        //console.log('o ' + JSON.stringify(o));
                                        var setId = setsRef.
                                            child(todaysDate).
                                            push(o).name();
                                        lockersRef.
                                            child(lockerId).
                                            child("JustDoThis").
                                            child("WorkOuts").
                                            child(workOutId).
                                            child(todaysDate).
                                            child("Exercises").
                                            child(childSnapShot.name()).
                                            child("Sets").
                                            child(setId).
                                            set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                            if(!err)
                                                callback();
                                        });
                                    }
                                });

                        });


                    } else {
                        callback();
                    }
                });
                
            });

            });
           

    });

}

function renderStatusButton(workOutName, currentStatus) {
    var action="";
    var cssStyle="";
    var text="";
    var s;
    //console.log(currentStatus);
    switch (currentStatus.toUpperCase()) {
        case 'NEW':
            action = "Start";
            cssStyle = "badge badge-success";
            text = "Start";
            break;
        case 'ACTIVE':
            action = "Continue";
            cssStyle = "badge badge-warning";
            text = "Continue";
            break;
        case 'STOPPED':
            action = "Start";
            cssStyle = "badge badge-success";
            text = "Start";
            break;
    }

    s = "<a id=\"bdg_" + workOutName + "\" data-action=\"" + action + "\" href=\"#\">"
        + "<span class=\"" + cssStyle + "\" id=\"status_" + workOutName + "\">" + text + "</span>"
        + "</a>";



    return s;
}

function renderAccordion(collapseId, workOutName, status) {
    //console.log('collapseId ' + collapseId);
    var statusButton = renderStatusButton(collapseId, status);
    //console.log('collapseId ' + collapseId);
    var s = "<div class=\"panel\">"
            + "<div class=\"row panel-heading\">"
                + "<div class=\"col-md-10\">"
                    + "<div class=\"panel-heading\">"
                        + "<a class=\"accordion-toggle\" id=\"acc_" + collapseId + "\" data-toggle=\"collapse\" href=\"#" + collapseId + "\">"
                          + workOutName
                        + "</a>"
                    + "</div>"
                + "</div>"
                + "<div class=\"col-md-2\">"
                     + statusButton
                + "</div>"
            + "</div>"
            + "<div id=\"" + collapseId + "\" class=\"panel-collapse collapse\" style=\"height: 0px;\">"
                + "<div class=\"panel-body\">"
                        + "<header>"
                        + "<h4>"
                        + "<i class=\"fa fa-list-alt\"></i>"
                        + "Exercises"
                        + "</h4>"
                        + "</header>"
                  + "<table class=\"table table-striped table-bordered dataTable\" id=\"tbl_" + collapseId +"\">"
                    +"<thead>"
                        +"<tr>"
                                +"<th>"
                                    + "Name"
                                + "</th>"
                                + "<th class=\"hidden-xs\">"
                                    + "Description"
                                + "</th>"
                                + "<th class=\"hidden-xs\">"
                                    + "Date Created"
                                + "</th>"
                                +"<th>"
                                    + "Set Range"
                                + "</th>"
                                + "<th>"
                                    + "Rep Range"
                                + "</th>"
                                + "<th class=\"hidden-xs\">"
                                    + "Duration"
                                + "</th>"
                            + "</tr>"
                        + "</thead>"
                    + "</table>"
                + "</div>"
            + "</div>"
        + "</div>";

    return s;
}

function populateDataTable()
{

    var obj = {};
    columns = [
    { mData: "Name", sTitle: "Name" },
    { mData: "Description", sTitle: "Description", sClass: "hidden-xs" },
    { mData: "DateCreated", sTitle: "Date Created", sClass: "hidden-xs" },
     {
         "aTargets": [3],
         mData: "RecMaxSets",
         mRender: function (data, type, row) {
             //console.log(data);
             var returnVal = row.RecMinSets + ' - ' + row.RecMaxSets;
             return returnVal;

         }
     },
     {
         "aTargets": [4],
         mData: "RecMaxReps",
         mRender: function (data, type, row) {

             var returnVal = row.RecMinReps + ' - ' + row.RecMaxReps;
             return returnVal;

         },

     },
    { mData: "RecDuration", sTitle: "Duration", sClass: "hidden-xs" }
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

    
}

var addSets = function(snapShot) {

    exercisesRef.child(snapShot.name).once('value', function(childSnapShot) {
        var numSets = childSnapShot.val().RecMaxSets;
        for (var i = 0; i < numSets; i++) {
            //var o; //= childSnap.val();
            var todaysDate = getTodaysDate(':');
            var o = {};
            o.Set = (i + 1);
            //console.log('fjfjfj');
            o.ExerciseId = childSnapShot.name();
            //o.WorkOutId = workOutId;
            o.Weight = "";
            o.Reps = "";
            o.Time = "";
            o.Trend = "";
            //console.log('o ' + JSON.stringify(o));
            var setId = setsRef.
                child(todaysDate).
                child("Lockers").
                child(lockerId).
                child("Exercises").
                child(childSnapShot.name()).
                child("Set").//TODO: need to verify set being submitted is from an unfinished workout from another day
                push(o).name();
            lockersRef.
                child(lockerId).
                child("JustDoThis").
                child("WorkOuts").
                child(workOutId).
                child(todaysDate).
                child("Exercises").
                child(childSnapShot.name()).
                child("Sets").
                child(setId).
                set(Firebase.ServerValue.TIMESTAMP, function (err) {
                    console.log("success");
                });
        }
    });

    

};

var workOutsAdded = function (snapShot) {
    //console.log('added ' + snapShot.name());
    var workOutId = snapShot.name();
    var rows = [];
    var numExercises = 0;
    workOutsRef.child(workOutId).once("value", function (childSnapShot) {
        //console.log('workout ' + JSON.stringify(childSnapShot.val()));
        //console.log('receient workout date ' + snapShot.val().DateOfReceientnWorkOut);
        //var dateOfLastWo = snapShot.val().DateOfLastWorkOut == "undefined" ? todaysDate : snapShot.val().DateOfLastWorkOut;
        //console.log('dateOfReceientWo ' + dateOfLastWo);
        $('#accordion3').append(renderAccordion(childSnapShot.name(),
                                childSnapShot.val().Name, snapShot.val().Status));
        //console.log('workoutname ' + childSnapShot.name());

        var todaysDate = getTodaysDate('_');

        $('#bdg_' + childSnapShot.name()).on('click', function () {
            console.log('clicked');
            updateWorkOutStatus($(this).data('action'), childSnapShot.name(), function () {
                //var res = dateOfReceientWO.replace(":", "_");
                //console.log('res ' + dateOfReceientWo);
                window.location = "/Locker/JustDoItWK/" + childSnapShot.name() + '/' + todaysDate;

            });
        });

        workOutExercisesRef = workOutsRef.child(childSnapShot.name()).child('/Exercises/');
        workOutExercisesRef.once('value', function (snap) {
            numExercises = snap.numChildren();
        });

        workOutExercisesRef.on('child_added', function(snap) {
            exercisesRef.child(snap.name()).once("value", function(childSnapShot1) {
                //console.log('tset ' + childSnapShot1.val().Name);
                var o = childSnapShot1.val();
                o.DT_RowId = childSnapShot1.name();
                
                rows.push(o);

                if (rows.length === numExercises) {
                    //console.log('numExercises ' + numExercises + ' workOutId ' + workOutId);
                    initializeDataTable(workOutId, rows);
                }

            });
        });

    });


};

