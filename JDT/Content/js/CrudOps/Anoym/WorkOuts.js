var oTable;
var userLockerRef;
var workOutsRef = new Firebase('https://jdt.firebaseio.com/WorkOuts/');
var userRef = new Firebase('https://jdt.firebaseio.com/Users/user/');
var lockersRef = new Firebase('https://jdt.firebaseio.com/Lockers/');

var records = [];
var columns;
var userId;
var lockerId;
var email;

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
        populateList(email);
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

function getTodaysDate() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + '/' +
        (month < 10 ? '0' : '') + month + '/' +
        (day < 10 ? '0' : '') + day;

    return output;
}


function populateList(email) {
    
    var obj = {};
    columns = [
    { mData: "Name", sTitle: "Name" },
    { mData: "Description", sTitle: "Description", sClass: "hidden-xs" },
    { mData: "CreatedByUserName", sTitle: "Created By"},
    { mData: "DateCreated", sTitle: "Date Created", sClass: "hidden-xs" },
    {
        sDefaultContent: "0",
        mRender: function (data, type, row) {
            //console.log(row);
            var returnVal = row.Exercises == null ? "<a href=\"/Exercises/Index/" + row.DT_RowId + "\">0</a>" : "<a href=\"/Exercises/Index/" + row.DT_RowId + "\">" + countProperties(row.Exercises) + "</a>";
            return returnVal;
        },
        "aTargets": [4]
    },
        {
            sDefaultContent:"<input type=\"checkbox\" id=\"chkAdRmLocker_\" />",
            mRender: function (data, type, row) {
                console.log('in locker: ' + row.InLocker);
                var checked = row.InLocker == true ? "checked" : "";
                var returnVal = "<input type=\"checkbox\" " + checked + " id=\"chkAdRmLocker_" + row.DT_RowId + "\" />";
                return returnVal;
            },
            "aTargets": [5]
        },
    ];

    getUserIdByEmail(email, function (uid) {
        //console.log('asdfsadf');
        //initializeDataTable();
        //console.log('asdfsadf');
        //planWorkOutsRef = plansRef.child(planName + '/WorkOuts/');
        //console.log('planWorkOutRef ' + planWorkOutsRef.toString());
        userId = uid;
        userRef.child(uid).once('value', function (snapShot) {

            lockerId = snapShot.val().LockerId;
        });
        workOutsRef.on('child_added', workOutsAdded);

        workOutsRef.on('child_changed', workOutsChanged);

        workOutsRef.on('child_removed', workOutsRemoved);

    });




}


var workOutsAdded = function (snapShot) {
    console.log('work out added');
    workOutsRef.child(snapShot.name()).once("value", function (childSnapShot) {

        var o = childSnapShot.val();
        //console.log
        o.DT_RowId = childSnapShot.name();

        //console.log('locker id ' + snapShot.val().LockerId);
        lockersRef.child(lockerId + '/JustDoThis/WorkOuts/' + childSnapShot.name()).once('value', function (lockerSnapShot) {
           
            if (lockerSnapShot.val().Status != "Removed")
                    o.InLocker = true;

            records.push(o);
            initializeDataTable();
        });

        

    });
    
    //console.log('records length ' + records.length);
}

var workOutsChanged = function (snapShot) {
    console.log('changed');


    workOutsRef.child(snapShot.name()).on("value", function (childSnapShot) {
        //console.log('plan changed ' + JSON.stringify(childSnapShot.val()));
        //console.log('record length ' + records.length);
        var o = childSnapShot.val();
        var i = 0;
        $.each(records, function () {
            //console.log('this dtrowid ' + this.DT_RowId + ' snap ' + childSnapShot.name());
            //console.log('snap name ' + childSnapshot.name());
            if (this.DT_RowId == childSnapShot.name()) {

                o = childSnapShot.val();
                o.DT_RowId = childSnapShot.name();
                return false;
            }
            i++;
        });
        records[i] = o;

        initializeDataTable();

    });

}

var workOutsRemoved = function (snapShot) {
    //console.log('record length before ' + records.length);
    var r = [];


    workOutsRef.child(snapShot.name()).on("value", function (childSnapShot) {
        //console.log('value ' + childSnapShot.name());

        r = jQuery.removeFromArray(childSnapShot.name(), records);
        //console.log('record length after ' + r.length);
        records = r;
        initializeDataTable();
    });

}

function initializeDataTable() {
    oTable = $('#datatable-table').dataTable({
        "aaData": records,
        "aoColumns": columns,
        "bDestroy": true,


    });

    $('input:checkbox').on('change', function (event) {
        // State has changed to checked/unchecked.
        var arr = this.id.split('_');
        var uid = userId
        var workOutId = arr[1];
        var o = {};
        o.Status = this.checked == true ? "New" : "Removed";

        userRef.child(uid).once('value', function (snapShot) {
            
            if(o.Status.toUpperCase()=="NEW")
                o.DateCreated = getTodaysDate();

            o.DateModified = getTodaysDate();
            
           
            var lockerRegisteredWorkOutRef = lockersRef.child(snapShot.val().LockerId + '/JustDoThis/WorkOuts/');
            try {

                lockerRegisteredWorkOutRef.child(workOutId).set(o);

            } catch (e) {

                console.log('An error occured ' + JSON.stringify(e));
            }
        });
        



    });
}



