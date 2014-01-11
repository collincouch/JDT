var pathname;
var planName;
var workOutName;
var editor;
var oTable;
var userRef = new Firebase('https://jdt.firebaseio.com/Users/user/');
var workOutsRef = new Firebase('https://jdt.firebaseio.com/WorkOuts/');
var userWorkOutsRef;
var records = [];
var columns;

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
        pathname = window.location.pathname.split("/");
        planName = pathname[pathname.length - 1];
        var obj = {};
        var url;
        var columns = [
		{ mData: "Name", sTitle: "Name" },
        { mData: "Description", sTitle: "Description", sClass:"hidden-xs" },
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
                        pathname = window.location.pathname.split("/");
                        planName = pathname[pathname.length - 1];
                        if (email) {
                            getUserIdByEmail(email, function (uid) {
                                var name = data.data.Name;
                                var description = data.data.Description;


                                obj.Name = name;
                                obj.Description = description;
                                obj.DateCreated = getTodaysDate();
                                obj.DateModified = getTodaysDate();
                                obj.CreatedBy = uid;
                                url1 = 'https://jdt.firebaseio.com/WorkOuts/';
                                var root = new Firebase("https://jdt.firebaseio.com");
                                var f = new Firebase(url1);
                                userWorkOutsRef.off('child_added', usersWorkOutsAdded);
                                id = f.push(obj, function (err) {

                                    if (!err) {
                                        root.child('/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + id).set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                            userWorkOutsRef.on('child_added', usersWorkOutsAdded);
                                            successCallback({ "id": 'xxx' });
                                        });

                                    }

                                }).name();



                            });
                        }

                    });

                }
                else if (data.action === 'edit') {
                    id = data.id;


                    initializeAuth(function (email) {
                        pathname = window.location.pathname.split("/");
                        planName = pathname[pathname.length - 1];

                        getUserIdByEmail(email, function (uid) {

                            var fb = new Firebase('https://jdt.firebaseio.com/WorkOuts/' + id);
                            var fbUser = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/');

                            var name = data.data.Name;

                            obj.Name = name;

                            var description = data.data.Description;
                            obj.Description = description;
                            obj.DateModified = getTodaysDate();

                            try {
                                userWorkOutsRef.off('child_changed', usersWorkOutsChanged);
                                fb.update(obj, function (err) {
                                    if (!err) {
                                        //console.log('setting ' + err);
                                        fbUser.set(Firebase.ServerValue.TIMESTAMP, function (err) {

                                            userWorkOutsRef.on('child_changed', usersWorkOutsChanged);
                                        });
                                    }
                                });


                            } catch (e) {
                                userWorkOutsRef.on('child_changed', usersWorkOutsChanged);
                                console.log(JSON.stringify(e));
                            }

                            successCallback({ "id": id });
                        });
                    });
                }
                else if (data.action === 'remove') {
                    pathname = window.location.pathname.split("/");
                    planName = pathname[pathname.length - 1];
                    initializeAuth(function (email) {
                        getUserIdByEmail(email, function (uid) {
                            //console.log('remove ' + JSON.stringify(data));
                            var fb = new Firebase('https://jdt.firebaseio.com/WorkOuts/' + data.data[0]);
                            var fbUser = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' +  data.data[0]);
                            var r = [];
                            userWorkOutsRef.off('child_removed', usersWorkOutsRemoved);
                            fb.remove(function (err) {
                                if (!err) {
                                    fbUser.remove(function (err) {
                                        if (!err) {
                                            r = jQuery.removeFromArray(data.data[0], records);
                                            records = r;
                                            userWorkOutsRef.on('child_removed', usersWorkOutsRemoved);
                                            successCallback({ "id": null });
                                        }
                                    });
                                }

                            });


                        })
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

        editor.on('onCreate', function (json, data) {

            var nRow = $('#xxx')[0];

            oTable.fnDeleteRow(nRow);
        });

        getUserIdByEmail(email, function (uid) {
            pathname = window.location.pathname.split("/");
            planName = pathname[pathname.length - 1];
           
            userWorkOutsRef = userRef.child(uid + '/Plans/' + planName + '/WorkOuts/');

            userWorkOutsRef.on('child_added', usersWorkOutsAdded);

            userWorkOutsRef.on('child_changed', usersWorkOutsChanged);

            userWorkOutsRef.on('child_removed', usersWorkOutsRemoved);

        });




    }

jQuery.removeFromArray = function (value, arr) {
    //console.log('object to be removed ' + JSON.stringify(value));
    return jQuery.grep(arr, function (elem, index) {
        //console.log(' removing ' + elem.DT_RowId);
        return elem.DT_RowId !== value;
    });
};

var usersWorkOutsAdded = function (snapShot) {

    workOutsRef.child(snapShot.name()).once("value", function (childSnapShot) {

        var o = childSnapShot.val();
        o.DT_RowId = childSnapShot.name();

        records.push(o);

        initializeDataTable();

    });
}

var usersWorkOutsChanged = function (snapShot) {
    //console.log('changed');
    var i = 0;

    workOutsRef.child(snapShot.name()).on("value", function (childSnapShot) {
        //console.log('plan changed ' + JSON.stringify(childSnapShot.val()));
        //console.log('record length ' + records.length);
        var o = childSnapShot.val();
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

jQuery.removeFromArray = function (value, arr) {
    //console.log('object to be removed ' + JSON.stringify(value));
    return jQuery.grep(arr, function (elem, index) {
        //console.log(' removing ' + elem.DT_RowId);
        return elem.DT_RowId !== value;
    });
};

var usersWorkOutsRemoved = function (snapShot) {
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

    function initDetailsAuth() {
        initializeAuth(function (email) {
            if (email) {
                setHeader(email);
                setSideNav(email);
                getUserIdByEmail(email, function (uid) {
                    pathname = window.location.pathname.split("/");
                    planName = pathname[pathname.length - 1];
                    workOutName = pathname[pathname.length - 2];
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('workout ' + workOutName + ' does not exist.');
                        } else {
                            $('#Name').text(snapshot.val().Name);
                            $('#Description').text(snapshot.val().Description);
                            $('#DateCreated').text(snapshot.val().DateCreated);
                            $('#DateModified').text(snapshot.val().DateModified);
                            $('#Exercises').val(dataRef.parent().child('Exercises').numChildren());


                        }

                    });


                });
            }

        });
    }

