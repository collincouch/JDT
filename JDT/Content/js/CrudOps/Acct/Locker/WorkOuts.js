
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
var lockerId;
var arrMaster = [];
var columns;
var workOutEx = [];

jQuery.removeFromArray = function (value, arr) {
    //console.log('object to be removed ' + JSON.stringify(value));
    return jQuery.grep(arr, function (elem, index) {
        //console.log(' removing ' + elem.DT_RowId);
        return elem.DT_RowId !== value;
    });
};

function initListAuth() {

    initializeAuth(function(email) {
        setHeader(email);
        setSideNav(email);
        var statusClickEvent = false;
        updateStatus(email, function() {
            //console.log('updateStatus');
        });

        var date = getTodaysDate(':');
        populateList(email, date ,function(dataTableId) {

            populateInitArray(dataTableId, function(tableId) {


            });

            //console.log('master arr: ' + arrMaster.length);

            $.each(arrMaster, function(index, value) {

                //console.log('key: ' + value.name());
                //console.log('value: ' + JSON.stringify(value));
                var key;
                for (key in value) {
                    initializeDataTable(key, value[key]);
                }


            });
            //
        });


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

function populateInitArray(dataTableId, callback) {
    workOutExercisesRef = workOutsRef.child(dataTableId).child('/Exercises/');
    var numChild;
    //var z = [];
    var rows = [];
    //console.log('populateInitArray');
    workOutExercisesRef.once('value', function (snap) {
        if (snap.val() == null)
            callback(z);
            //numChild = 0;

        numChild = snap.numChildren();
        //console.log('number of Children ' + numChild);
    });
    
   
        workOutExercisesRef.on('child_added', function (snapShot) {

            exercisesRef.child(snapShot.name()).on('value', function (childSnapShot) {
                var k = {};
                
                var o = childSnapShot.val();
                o.DT_RowId = childSnapShot.name();
                rows.push(o);
                
                if (rows.length == numChild) {
                    k[dataTableId] = rows;
                    callback(k);
                }

            });

            
        });
    
       
}



function countProperties(obj) {
    var prop;
    var propCount = 0;

    for (prop in obj) {
        propCount++;
    }
    return propCount;
}

function updateStatus(email, date, callback)
{
    getUserIdByEmail(email, function (uid) {

        userRef.child(uid).once('value', function (snapShot) {
            var userLock = lockersRef.child(snapShot.val().LockerId + '/JustDoThis/WorkOuts/' + date);
            userLock.on('value', function (lockerSnapShot) {
                //console.log('iiiii');
                lockerSnapShot.forEach(function (childSnapShot) {
                    //console.log('fffffffff');
                    workOutsRef.child(childSnapShot.name()).on('value', function (workOutSnapShot) {
                        //console.log('ffjfjfj');
                        var s = renderStatusButton(childSnapShot.name(), childSnapShot.val().Status);
                        //console.log(s);
                        $('#bdg_' + childSnapShot.name()).replaceWith(s);
                        $('#bdg_' + childSnapShot.name()).on('click', function () {
                            updateWorkOutStatus($(this).data('action'), childSnapShot.name(), function()
                            {
                                window.location = "/Locker/JustDoItWK/" + childSnapShot.name();
                        });
                        });
                        callback();
                    });
                });

            });

        });
    });
}

function populateList(email, date, callback) {
    
  
    getUserIdByEmail(email, function (uid) {

        userRef.child(uid).once('value', function (snapShot) {

            console.log('locker id ' + snapShot.val().LockerId);
            lockerId = snapShot.val().LockerId;
            lockersRef.child(snapShot.val().LockerId + '/JustDoThis/WorkOuts/'
               ).once('value', function (lockerSnapShot) {
                populateDataTable();
                var numOfWorkOuts = 0;
                lockerSnapShot.forEach(function(childSnapShot) {
                    if (childSnapShot.val().Status.toUpperCase() != "REMOVED")
                        numOfWorkOuts++;
                });
                lockerSnapShot.forEach(function(childSnapShot) {
                    console.log('workOut ' + childSnapShot.name());
                    if (lockerSnapShot.child(childSnapShot.name()).
                        val().Status.toUpperCase() != "REMOVED") {
                        workOutsRef.child(childSnapShot.name()).once('value', function(workOutSnapShot) {

                            $('#accordion3').append(renderAccordion(childSnapShot.name(), workOutSnapShot.val().Name, childSnapShot.val().Status));

                            $('#bdg_' + childSnapShot.name()).on('click', function() {
                                updateWorkOutStatus($(this).data('action'), childSnapShot.name(), function() {
                                    window.location = "/Locker/JustDoItWK/" + childSnapShot.name();

                                });
                            });

                            populateInitArray(childSnapShot.name(), function(x) {
                                //console.log('push 1');
                                arrMaster.push(x);
                                if (arrMaster.length == numOfWorkOuts) {
                                    //console.log('asdfsdfsdf');
                                    callback(childSnapShot.name());
                                }
                                //console.log('push 2');
                            });

                            //console.log('arrMaster length' + arrMaster.length);


                        });
                    }

                });


            });
            
           
        });
        

        
        

    });
    
    }


function updateWorkOutStatus(action,workOutId,callback) {
    console.log(action);
    initializeAuth(function (email) {
        getUserIdByEmail(email, function (uid) {
            userRef.child(uid).once('value', function (snapShot) {
                var o1 = {
                    'DateModified': getTodaysDate('/'),

                };
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
                    console.log('status: ' + o1.Status.toUpperCase());
                    if (o1.Status.toUpperCase() == "ACTIVE" && !setsExist) {

                        userRef.child(uid).once('value', function (snapShot) {

                            workOutsRef.
                                child(workOutId).
                                child("Exercises").
                                on('value', function (sapper) {
                                    sapper.forEach(function (exSnap) {
                                        exercisesRef.
                                        child(exSnap.name())
                                        .on('value', function (childSnap) {
                                            //console.log('exercise ' + JSON.stringify(childSnap.val()));
                                            var numSets = childSnap.val().RecMaxSets;
                                            //console.log('num sets ' + numSets);
                                            for (var i = 0; i < numSets; i++) {
                                                //var o; //= childSnap.val();
                                                var todaysDate = getTodaysDate(':');
                                                var o = {};
                                                o.Set = (i + 1);
                                                //console.log('fjfjfj');
                                                o.ExerciseId = childSnap.name();
                                                o.WorkOutId = workOutId;
                                                o.Weight = "";
                                                o.Reps = "";
                                                o.Time = "";
                                                o.Trend = "";
                                                //console.log('o ' + JSON.stringify(o));
                                                var setId = setsRef.
                                                child(todaysDate) //TODO: need to verify set being submitted is from an unfinished workout from another day
                                                    .push(o).name();
                                                lockersRef.
                                                    child(lockerId).
                                                    child("JustDoThis").
                                                    child("WorkOuts").
                                                    child(workOutId).
                                                    child(todaysDate).
                                                    child("Exercises").
                                                    child(exSnap.name()).
                                                    child("Sets").
                                                    child(setId).
                                                    set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                                        console.log("success");
                                                    });
                                            }

                                            callback();
                                        });
                                    });


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
    var action;
    var cssStyle;
    var text;
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
    var statusButton = renderStatusButton(collapseId, status);
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

//function checkIfWorkOutStarted()


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


var workOutsExercisesAdded = function(snapShot) {
    //console.log('added ' + snapShot.name());
    //var y = "2";
    exercisesRef.child(snapShot.name()).once("value", function(childSnapShot) {
        //console.log('tset ' + childSnapShot.val().Name);
        var o = childSnapShot.val();
        o.DT_RowId = childSnapShot.name();

        rows.push(o);

        initializeDataTable();


    });


};

