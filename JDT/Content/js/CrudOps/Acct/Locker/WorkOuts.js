
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
var workOutExercisesRef;
var userPlansRef;
var rows = [];
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
    initializeAuth(function (email) {
        setHeader(email);
        setSideNav(email);
        
        populateList(email, function (dataTableId) {
            
            populateInitArray(dataTableId, function () {
                
                initializeDataTable(dataTableId);
                
            });

            
           

        });
        
    })
}


function populateInitArray(dataTableId, callback) {
    workOutExercisesRef = workOutsRef.child(dataTableId).child('/Exercises/');
    var numChild;
    workOutExercisesRef.once('value', function (snap) {
        if (snap.val() == null)
            callback();

        numChild = snap.numChildren();
    });
    
   
        workOutExercisesRef.on('child_added', function (snapShot) {

            exercisesRef.child(snapShot.name()).on('value', function (childSnapShot) {
                var o = childSnapShot.val();
                o.DT_RowId = childSnapShot.name();
                rows.push(o);

                if (rows.length == numChild)
                    callback();

            });


        });
    
       
}


function populateRows(callback) {
    
    $.each(workOutEx, function (index, value) {
        console.log('value ' + value);
        exercisesRef.child(value).once('value', function (childSnapShot) {
            var o = childSnapShot.val();
            o.DT_RowId = childSnapShot.name();
            rows.push(o);

            console.log('adding object to rows: ' + JSON.stringify(o));
          
            workOutEx = [];
           
        });
        
        if (index == rows.length - 1) {
            console.log('workoutex ' + workOutEx.length);
            

            callback();

        }
        
    })
    
}

function countProperties(obj) {
    var prop;
    var propCount = 0;

    for (prop in obj) {
        propCount++;
    }
    return propCount;
}



function populateList(email, callback) {

    //populateDataTable

    getUserIdByEmail(email, function (uid) {

        userRef.child(uid).once('value', function (snapShot) {

            console.log('locker id ' + snapShot.val().LockerId);
            lockersRef.child(snapShot.val().LockerId + '/JustDoThis/WorkOuts/').once('value', function (lockerSnapShot) {
                populateDataTable();
                lockerSnapShot.forEach(function (childSnapShot) {
                    //console.log('workOut ' + childSnapShot.name());
                    workOutsRef.child(childSnapShot.name()).once('value', function (workOutSnapShot) {
                        //workOutExercises.on('child_added', workOutsExercisesAdded);
                        //workOutName = 
                        $('#accordion3').append(renderAccordion(childSnapShot.name(), workOutSnapShot.val().Name));

                        //rows = [];
                        //initializeDataTable(childSnapShot.name());
                        
                        callback(childSnapShot.name());
                        
                        
                    })
                    
                })
                
            });
        });
        

        
        

    });
    
    }




function renderAccordion(collapseId, workOutName) {
    var s = "<div class=\"panel\">"
            + "<div class=\"panel-heading\">"
                + "<a class=\"accordion-toggle\" data-toggle=\"collapse\" href=\"#" + collapseId + "\">"
                  + workOutName
                + "</a>"
            + "</div>"
            + "<div id=\"" + collapseId + "\" class=\"panel-collapse collapse\" style=\"height: 0px;\">"
                + "<div class=\"panel-body\">"
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
                                + "<th class=\"hidden-xs\">"
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
    { mData: "RecDuration", sTitle: "Duration" }
    ];



   

}



function initializeDataTable(tableId, callback) {

    //console.log('rows length ' + rows.length);
    oTable = $('#tbl_' + tableId).dataTable({
        "aaData": rows,
            "aoColumns": columns,
            "bDestroy": true,
            "fnDrawCallback": function (oSettings) {
                alert('DataTables has redrawn the table');
            }
        });

   
}



var workOutsExercisesAdded = function (snapShot) {
    console.log('added ' + snapShot.name());
    //var y = "2";
    exercisesRef.child(snapShot.name()).once("value", function (childSnapShot) {
        console.log('tset ' + childSnapShot.val().Name);
        var o = childSnapShot.val();
        o.DT_RowId = childSnapShot.name();

        rows.push(o);
        
        initializeDataTable();
       
    });
   
    
    
} 

