
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
var userPlansRef;
var records = [];
var columns;


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
        //{ mData: "CreatedByUserName", sTitle: "Created By"},
        { mData: "DateCreated", sTitle: "Date Created", sClass:"hidden-xs" },
        {
            sDefaultContent: "0",
            mRender: function (data, type, row) {
                //console.log(row);
                var returnVal = row.Exercises == null ? "<a href=\"/Exercises/Index/" + planName + "/" + row.DT_RowId + "\">0</a>" : "<a href=\"/Exercises/Index/" +planName + "/" + row.DT_RowId + "\">" + countProperties(row.Exercises) + "</a>";
                return returnVal;
            },
            "aTargets": [3]
        }
        ];
        editor = new $.fn.dataTable.Editor({
            "domTable": "#datatable-table",
            "fields": [{
                "label": "Name:",
                "name": "Name",
                "attr": { "class": "form-control parsley-validated required", "placeholder": "Name your work out", "required": "required", "parsley-required": "true" },
            }, {
                "label": "Description:",
                "name": "Description",
                "type": "textarea",
            }, {
                "label": "DateCreated:",
                "name": "DateCreated",
                "type": "hidden",
                "default": getTodaysDate()
            }, {
                "name": "DT_RowId",
                "type": "hidden",
            }, {
                "name": "Exercises",
                "type": "hidden",
            }
            ],
            "i18n": {
                "create": {
                    "title": "<h4>Give your workout a name and description and click 'Create'</h4>",
                },
                "edit": {
                    "title": "<h4>Edit your workout's name and description and click 'Update'</h4>",
                },
                "remove": {
                    "title": "<h4>Delete your workout and all assocated exercises.</h4>",
                    "confirm": {"1":"Are you sure you wish to delete this workout?  All assocated exercises will be deleted, too."}
                },
            },
            "ajax": function (method, url, data, successCallback, errorCallback) {

                var id = null;
                if (data.action === 'create') {
                    initializeAuth(function (email) {
                        if (email) {
                            getUserIdByEmail(email, function (uid) {
                                userRef.child(uid).once('value', function (snapShot) {
                                var lockerPlansRef = lockersRef.child(snapShot.val().LockerId + '/ContentCreated/Plans/');

                                
                                var name = data.data.Name;
                                var description = data.data.Description;
                                userPlansRef = userRef.child(uid).child('Plans');

                                obj.Name = name;
                                obj.Description = description;
                                obj.DateCreated = getTodaysDate();
                                obj.DateModified = getTodaysDate();
                                obj.CreatedBy = uid;
                                obj.CreatedByUserName = snapShot.val().UserName;
                                //console.log('userPlansRef Url ' + userPlansRef.child(planName).toString());
                                
                                planWorkOutsRef.off('child_changed', planWorkOutsChanged);
                                //userPlansRef.child(planName).off('child_changed');
                                //planWorkOutsRef.off('child_added', planWorkOutsAdded);
                                id = workOutsRef.push(obj, function (err) {
                                    if (!err) {
                                        //console.log('planWorkOutsRef inside create ' + planWorkOutsRef.toString());
                                        planWorkOutsRef.child(id).set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                            if (!err) {
                                                
                                                lockerPlansRef.child(planName).set(Firebase.ServerValue.TIMESTAMP);
                                                planWorkOutsRef.on('child_changed', planWorkOutsChanged);
                                                successCallback({ "id": id });
                                                
                                            }
                                        });
                                    }

                                }).name();


                                });
                            });
                        }

                    });

                }
                else if (data.action === 'edit') {
                    id = data.id;
                    initializeAuth(function (email) {

                            var name = data.data.Name;
                            var description = data.data.Description;
                            obj.Name = name;
                            obj.Description = description;
                            obj.DateModified = getTodaysDate();

                            try {
                                planWorkOutsRef.off('child_changed', planWorkOutsChanged);
                               
                                workOutsRef.child(id).update(obj, function (err) {
                                    if (!err) {
                                        //console.log('setting ' + err);
                                        planWorkOutsRef.child(id).set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                            planWorkOutsRef.on('child_changed', planWorkOutsChanged);
                                            successCallback({ "id": id });
                                        });
                                    }
                                });


                            } catch (e) {
                                planWorkOutsRef.on('child_changed', planWorkOutsChanged);
                                console.log(JSON.stringify(e));
                            }

                            
                        
                    });
                }
                else if (data.action === 'remove') {
                    initializeAuth(function (email) {
                        try {
                            var r = [];
                            planWorkOutsRef.off('child_removed', planWorkOutsRemoved);
                            workOutsRef.child(data.data[0]).remove(function (err) {
                                if (!err) {
                                    planWorkOutsRef.child(data.data[0]).remove(function (err) {
                                        
                                            r = jQuery.removeFromArray(data.data[0], records);
                                            records = r;
                                            planWorkOutsRef.on('child_removed', planWorkOutsRemoved);
                                            successCallback({ "id": null });
                                        
                                    });
                                }

                            });
                        } catch (e) {
                            planWorkOutsRef.on('child_removed', planWorkOutsRemoved);
                        }


                        })
                    
                }
                
            }
        });

        editor.on('onOpen', function () {

            $("div.DTE_Body_Content form").attr("parsley-validate", "");
            $("div.DTE_Body_Content form").attr("novalidate", "novalidate");
            $("div.DTE_Body_Content form").parsley();
        });

        editor.on('onPreSubmit', function () {
            var f = $('form');
            if (f.css('display') != 'none') {
                var valid = f.parsley('validate');
                console.log('valid ' + valid);
                if (valid == false)
                    return false;
            }
        });

    

        getUserIdByEmail(email, function (uid) {
            
            initializeDataTable();

            planWorkOutsRef = plansRef.child(planName + '/WorkOuts/');
            //console.log('planWorkOutRef ' + planWorkOutsRef.toString());
            planWorkOutsRef.on('child_added', planWorkOutsAdded);

            planWorkOutsRef.on('child_changed', planWorkOutsChanged);

            planWorkOutsRef.on('child_removed', planWorkOutsRemoved);

        });




    }


var planWorkOutsAdded = function (snapShot) {
    console.log('work out added');
    workOutsRef.child(snapShot.name()).once("value", function (childSnapShot) {

        var o = childSnapShot.val();
        //console.log
        o.DT_RowId = childSnapShot.name();
        
        records.push(o);

        initializeDataTable();

    });

    //console.log('records length ' + records.length);
};

var planWorkOutsChanged = function (snapShot) {
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

var planWorkOutsRemoved = function (snapShot) {
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
        "sDom": "<'row'<'col-xs-6'T><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
        "aaData": records,
        "aoColumns": columns,
        "oTableTools": {
            "sRowSelect": "single",
            "aButtons": [
                { "sExtends": "editor_create", "editor": editor, "sButtonClass": "btn btn-primary" },
                { "sExtends": "editor_edit", "editor": editor, "sButtonClass": "btn btn-primary" },
                { "sExtends": "editor_remove", "editor": editor, "sButtonClass": "btn btn-warning" }
            ]
        },
        "bDestroy": true,


    });
}

 

