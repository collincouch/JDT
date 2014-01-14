
var editor;
var oTable;
var userPlansRef;
var userLockerRef;
var root = new Firebase('https://jdt.firebaseio.com');
var userRef = new Firebase('https://jdt.firebaseio.com/Users/user/');
var lockersRef = new Firebase('https://jdt.firebaseio.com/Lockers/');
var plansRef = new Firebase('https://jdt.firebaseio.com/Plans/');

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
    })
}

function countProperties(obj) {
    //console.log('counting props');
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
    var id = null;
    var url;
    var url1;

    var obj = {};
    var x;
        
        columns = [
		{ mData: "Name", sTitle: "Name" },
        { mData: "Description", sTitle: "Description",sClass:"hidden-xs" },
        { mData: "DateCreated", sTitle: "Date Created", sClass:"hidden-xs" },
        {
            sDefaultContent: "0",
            mRender: function (data, type, row) {
                if(type=="display"){
                    console.log(JSON.stringify(row));
                    //console.log(data[3]);
                var returnVal = row.WorkOuts == null ? "<a href=\"/WorkOuts/Index/" + row.DT_RowId + "\">0</a>" : "<a href=\"/WorkOuts/Index/" + row.DT_RowId + "\">" + countProperties(row.WorkOuts) + "</a>";
                return returnVal;
                }
            },
            "aTargets": [3]
        }
        ];

        editor = new $.fn.dataTable.Editor({
            "domTable": "#datatable-table",
            "fields": [{
                "label": "Name:",
                "name": "Name",
                "attr":  { "class":"form-control parsley-validated required","placeholder":"Name your plan","required":"required", "parsley-required":"true"},
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
            }
            ],
            "i18n": {
                "create": {
                    "title": "<h4>Give your fitness plan a name and description and click 'Create'</h4>",
                },
                "edit": {
                    "title": "<h4>Edit your fitness plan's name and description and click 'Update'</h4>",
                },
                "remove": {
                    "title": "<h4>Delete your fitness plan and all assocated workouts and exercises.</h4>",
                    "confirm": { "1": "Are you sure you wish to delete this fitness plan?  All assocated workouts and exercises will be deleted, too." },

                },
                },
            "ajax": function (method, url, data, successCallback, errorCallback) {

                
                if (data.action === 'create') {

                    initializeAuth(function (email) {
                        getUserIdByEmail(email, function (uid) {
                            userRef.child(uid).once('value', function (snapShot) {

                                var lockerPlansRef = lockersRef.child(snapShot.val().LockerId + '/ContentCreated/Plans/');

                                    var name = data.data.Name;
                                    var description = data.data.Description;
                                    obj.Name = name;
                                    obj.Description = description;
                                    obj.DateModified = getTodaysDate();
                                    obj.DateCreated = getTodaysDate();
                                    lockerPlansRef.off('child_changed', lockersPlansChanged);
                                    var planId = plansRef.push(obj, function (err) {
                                        if (!err) {
                                            lockerPlansRef.child(planId).set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                                if (!err) {
                                                    lockerPlansRef.on('child_changed', lockersPlansChanged);
                                                    successCallback({ "id": planId });
                                                }

                                            })
                                        }

                                   }).name();

                            })           
                            
                        });
                    });
                }
                else if (data.action === 'edit') {
                   
                    id = data.id;
                    initializeAuth(function (email) {
                        getUserIdByEmail(email, function (uid) {
                            userRef.child(uid).once('value', function (snapShot) {

                                var lockerPlansRef = lockersRef.child(snapShot.val().LockerId + '/ContentCreated/Plans/' + id);
                                var name = data.data.Name;
                                var description = data.data.Description;
                                obj.Name = name;
                                obj.Description = description;
                                obj.DateModified = getTodaysDate();

                                try {
                                    lockerPlansRef.parent().off('child_changed', lockersPlansChanged);
                                    //console.log('userPlansRef.parent() is ' + userPlansRef.parent().toString());
                                    plansRef.child(id).update(obj, function (err) {
                                        if (!err) {
                                            //console.log('setting ' + err);
                                            lockerPlansRef.set(Firebase.ServerValue.TIMESTAMP, function (err) {

                                                lockerPlansRef.parent().on('child_changed', lockersPlansChanged);
                                                successCallback({ "id": id });



                                            });

                                        }
                                        else {
                                            lockerPlansRef.parent().on('child_changed', lockersPlansChanged);
                                            console.log('error occured editing plans ');
                                            successCallback({ "id": id });
                                        }


                                    });


                                } catch (e) {
                                    lockerPlansRef.parent().on('child_changed', lockersPlansChanged);
                                    console.log('an error ocured ' + JSON.stringify(e));
                                }

                            });

                           
                           
                            
                            
                        });
                    });

                    
                    
                }
                else if (data.action === 'remove') {
                    
                    initializeAuth(function (email) {
                        getUserIdByEmail(email, function (uid) {
                            userRef.child(uid).once('value', function (snapShot) {

                                var lockerPlansRef = lockersRef.child(snapShot.val().LockerId + '/ContentCreated/Plans/');
                                var r = [];
                                lockerPlansRef.parent().off('child_removed', lockersPlansRemoved);
                                plansRef.child(data.data[0]).remove(function (err) {
                                    if (!err) {
                                        lockerPlansRef.child(data.data[0]).remove(function (err) {
                                            if (!err) {
                                                r = jQuery.removeFromArray(data.data[0], records);
                                                records = r;
                                                lockerPlansRef.parent().on('child_removed', lockersPlansRemoved);
                                                successCallback({ "id": null });
                                            }
                                        });
                                    }

                                });

                            });
                           
                   

                        })
                    })
                    
                }
               
               
            },
           
        });

       
        
            editor.on('onOpen', function () {
                //console.log('parsley ' + JSON.stringify(data));
                $("div.DTE_Body_Content form").attr("parsley-validate", "");
                $("div.DTE_Body_Content form").attr("novalidate", "novalidate");
                $("div.DTE_Body_Content form").parsley();
            });

            editor.on('onPreSubmit', function () {
                var f = $('form');
                if (f.css('display') != 'none') {
                    var valid = f.parsley('validate');
                    if (valid == false)
                        return false;
                }
            });

            


        getUserIdByEmail(email, function (uid) {
          
            initializeDataTable();
            userRef.child(uid).once('value', function (snapShot) {

                lockerPlansRef = lockersRef.child(snapShot.val().LockerId + '/ContentCreated/Plans/');

                //userPlansRef = userRef.child(uid + '/Plans/');

                lockerPlansRef.on('child_added', lockersPlansAdded);

                lockerPlansRef.on('child_changed', lockersPlansChanged);

                lockerPlansRef.on('child_removed', lockersPlansRemoved);
            });

        });

}




var lockersPlansAdded = function (snapShot) {
    console.log('lockersPlansAdded executing');
    plansRef.child(snapShot.name()).once("value", function (childSnapShot) {

        var o = childSnapShot.val();
        o.DT_RowId = childSnapShot.name();

        records.push(o);

        initializeDataTable();

    });
}



var lockersPlansChanged = function (snapShot) {
    console.log('changed');
    
    
    plansRef.child(snapShot.name()).on("value", function (childSnapShot) {
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
        //console.log
        initializeDataTable();

    });

}

var lockersPlansRemoved = function (snapShot) {
   //console.log('record length before ' + records.length);
   var r = [];
    
    
        plansRef.child(snapShot.name()).on("value", function (childSnapShot) {
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



       

