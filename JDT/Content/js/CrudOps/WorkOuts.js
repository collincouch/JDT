var pathname;
var planName;
var workOutName;
var editor;
var oTable;
var data = [];

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
                        if (email) {
                            getUserIdByEmail(email, function (uid) {
                                pathname = window.location.pathname.split("/");
                                planName = pathname[pathname.length - 1];
                                var name = data.data.Name;
                                var description = data.data.Description;
                                obj.Name = name;
                                obj.Description = description;
                                obj.DateCreated = getTodaysDate();
                                obj.DateModified = getTodaysDate();
                                url = 'https://jdt.firebaseio.com/Plans/' + planName + '/WorkOuts/';
                                var root = new Firebase("https://jdt.firebaseio.com");
                                var f = new Firebase(url);
                                id = f.push(obj, function (err) {
                                    if (!err) {
                                        root.child('/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' +id).set(true);
                                        
                                    }
                                    else {
                                        console.log('error ' + err);
                                    }
                                    successCallback({ "id": 'xxx' });
                                }).name();
                                
                            });
                        }
                    });

                }
                else if (data.action === 'edit') {
                    id = data.id;
                    //console.log('edit id' + data.id);
                    initializeAuth(function (email) {
                        getUserIdByEmail(email, function (uid) {
                            var fb = new Firebase('https://jdt.firebaseio.com/Plans/' + planName + '/WorkOuts/' + data.id);
                            var name = data.data.Name;
                            //console.log('data ' + JSON.stringify(data) + ' DateCreated ' + output + ' uid ' + uid);
                            var description = data.data.Description;
                            try {
                                fb.update({
                                    "Name": name,
                                    "Description": description,
                                    "DateModified": getTodaysDate()
                                });
                            } catch (e) {
                                console.log(JSON.stringify(e));
                            }
                        });
                    });
                    successCallback({ "id": id });
                }
                else if (data.action === 'remove') {

                    initializeAuth(function (email) {
                        getUserIdByEmail(email, function (uid) {
                            //console.log('workout id ' + data.data[0]);
                            var fb = new Firebase('https://jdt.firebaseio.com/Plans/' + planName + '/WorkOuts/' + data.data[0]);

                            fb.remove();
                        })
                    })
                    successCallback({ "id": id });
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
            var userRef = new Firebase('https://jdt.firebaseio.com/Users/user/');
            var plansWorkOutsRef = new Firebase('https://jdt.firebaseio.com/Plans/' + planName + '/WorkOuts/');
            //console.log('asdfasfd' + planName)
            var userPlansWorkOutsRef = userRef.child(uid + '/Plans/' + planName + '/WorkOuts/');
            //console.log('fjfjfjfj');
            //data = [];
            userPlansWorkOutsRef.on('child_added', function (snapshot) {
                //console.log('child ');
                //
                plansWorkOutsRef.child(snapshot.name()).on("value", function (childSnapshot) {

                    var o = childSnapshot.val();
                    o.DT_RowId = childSnapshot.name();

                    data.push(o);
               
                    oTable = $('#datatable-table').dataTable({
                        "sDom": "<'row'<'col-xs-6'T><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
                        "aaData": data,
                        "aoColumns": columns,
                        "oTableTools": {
                            "sRowSelect": "single",
                            "aButtons": [
                                { "sExtends": "editor_create", "editor": editor, "sButtonClass": "btn btn-primary" },
                                { "sExtends": "editor_edit", "editor": editor, "sButtonClass": "btn btn-primary" },
                                { "sExtends": "editor_remove", "editor": editor, "sButtonClass": "btn btn-warning" }
                            ]
                        },
                        bDestroy: true,

                    });

                });

                
               


            });
           
            plansWorkOutsRef.on('child_removed', function (snapshot) {
               
                oTable = $('#datatable-table').dataTable({
                    "sDom": "<'row'<'col-xs-6'T><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
                    "aaData": data,
                    "aoColumns": columns,
                    "oTableTools": {
                        "sRowSelect": "single",
                        "aButtons": [
                            { "sExtends": "editor_create", "editor": editor, "sButtonClass": "btn btn-primary" },
                            { "sExtends": "editor_edit", "editor": editor, "sButtonClass": "btn btn-primary" },
                            { "sExtends": "editor_remove", "editor": editor, "sButtonClass": "btn btn-warning" }
                        ]
                    },
                    bDestroy: true,
                });
            });
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

