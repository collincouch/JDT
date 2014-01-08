var pathname;
var planName;
var workOutName;
var exerciseName;
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
 
    var columns = [
    { mData: "Name", sTitle: "Name" },
    { mData: "Description", sTitle: "Description", sClass:"hidden-xs" },
    { mData: "DateCreated", sTitle: "Date Created", sClass:"hidden-xs" },
     {
         "aTargets": [3],
         mData:"RecMaxSets",
         mRender: function (data, type, row) {

                 var returnVal = row.RecMinSets + ' - ' + row.RecMaxSets;
                 return returnVal;
             
         }
     },
     {
         "aTargets": [4],
         mData:"RecMaxReps",
         mRender: function (data, type, row) {

                 var returnVal = row.RecMinReps + ' - ' + row.RecMaxReps;
                 return returnVal;

         },

     },
    { mData: "RecDuration", sTitle: "Duration" }
    ];

    editor = new $.fn.dataTable.Editor({
        "domTable": "#datatable-table",
        "fields": [{
            "label": "Name:",
            "name": "Name",
            "attr": { "class": "form-control parsley-validated required", "placeholder": "Name your exercises", "required": "required", "parsley-required": "true" },
        }, {
            "label": "Description:",
            "name": "Description",
            "type":"textarea",
        }, {
            "label": "Date Created:",
            "name": "DateCreated",
            "type": "hidden",
            "default": getTodaysDate()
        },
        {
            "label": "Min Sets:",
            "name": "RecMinSets",
            "attr": { "class": "form-control parsley-validated required", "id":"minsets", "data-trigger":"change","data-validation-minlength":"1","required":"required","data-range":"[1,100]"},
        },
        {
            "label": "Max Sets:",
            "name": "RecMaxSets",
            "attr": { "class": "form-control parsley-validated required", "id": "maxsets", "data-trigger": "change", "data-validation-minlength": "1", "required": "required", "data-range": "[1,100]" },
        },
         {
             "label": "Min Reps:",
             "name": "RecMinReps",
             "attr": { "class": "form-control parsley-validated required", "id": "minreps", "data-trigger": "change", "data-validation-minlength": "1", "required": "required", "data-range": "[1,100]" },
         },
        {
            "label": "Max Reps:",
            "name": "RecMaxReps",
            "attr": { "class": "form-control parsley-validated required", "id": "maxreps", "data-trigger": "change", "data-validation-minlength": "1", "required": "required", "data-range": "[1,100]" },
        },
         {
             "label": "Duration:",
             "name": "RecDuration",
            
         },
        
        ],
            "i18n": {
                "create": {
                    "title": "<h4>Give your exercise a name, description, set range, rep range, duration, and click 'Create'</h4>",
                    },
                "edit": {
                    "title": "<h4>Edit your exercises and click 'Update'</h4>",
                    },
                "remove": {
                    "title": "<h4>Delete your exercise.</h4>",
                    "confirm": {"1":"Are you sure you wish to delete this exercise?"}
                },
            },
        "ajax": function (method, url, data, successCallback, errorCallback) {

            var id = null;
            var obj = {};
            var url;
            if (data.action === 'create') {
                initializeAuth(function (email) {
                    if (email) {
                        getUserIdByEmail(email, function (uid) {
                            pathname = window.location.pathname.split("/");
                            planName = pathname[pathname.length - 2];
                            workOutName = pathname[pathname.length - 1];
                            obj.Name = data.data.Name;
                            obj.Description = data.data.Description;
                            obj.DateCreated = getTodaysDate();
                            obj.DateModified = getTodaysDate();
                            obj.RecMinSets = data.data.RecMinSets;
                            obj.RecMaxSets = data.data.RecMaxSets;
                            obj.RecMinReps = data.data.RecMinReps;
                            obj.RecMaxReps = data.data.RecMaxReps;
                            obj.RecDuration = data.data.RecDuration;
                            url = 'https://jdt.firebaseio.com/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/';
                            var root = new Firebase("https://jdt.firebaseio.com");
                            var f = new Firebase(url);
                            id = f.push(obj, function (err) {
                                if (!err) {
                                    root.child('/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/' + id).set(true);
                                }
                                else {
                                    console.log('error ' + err);
                                }
                            }).name();
                            successCallback({ "id": 'xxx' });
                        });
                    }
                });

            }
            else if (data.action === 'edit') {
                id = data.id;
                //console.log('edit id' + data.id);
                initializeAuth(function (email) {
                    getUserIdByEmail(email, function (uid) {

                        var fb = new Firebase('https://jdt.firebaseio.com/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/' + data.id);
                        obj.Name = data.data.Name;
                        obj.Description = data.data.Description;
                        obj.DateModified = getTodaysDate();
                        obj.RecMinSets = data.data.RecMinSets;
                        obj.RecMaxSets = data.data.RecMaxSets;
                        obj.RecMinReps = data.data.RecMinReps;
                        obj.RecMaxReps = data.data.RecMaxReps;
                        obj.RecDuration = data.data.RecDuration;
                        //console.log('exercise name ' + fb.name());
                        console.log('obj ' + JSON.stringify(obj));
                        try {
                            fb.update(obj);
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

                        var fb = new Firebase('https://jdt.firebaseio.com/Plans/' + planName + "/WorkOuts/" + workOutName + '/Exercises/' +  data.data[0]);

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
            planName = pathname[pathname.length - 2];
            workOutName = pathname[pathname.length - 1];
            var userRef = new Firebase('https://jdt.firebaseio.com/Users/user/');
            var workOutsExercisesRef = new Firebase('https://jdt.firebaseio.com/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/');
            //console.log('asdfasfd' + planName)
            var userPlansWorkOutsExercisesRef = userRef.child(uid + '/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/');
            //console.log('fjfjfjfj');
            //data = [];
            userPlansWorkOutsExercisesRef.on('child_added', function (snapshot) {
                //console.log('child ');
                //
                workOutsExercisesRef.child(snapshot.name()).once("value", function (childSnapshot) {

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

            if (typeof oTable != undefined) {
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
            }
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
                    exerciseName = pathname[pathname.length - 3];
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/' + exerciseName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('exercises ' + exerciseName + ' does not exist.');
                        } else {
                            $('#Name').text(snapshot.val().Name);
                            $('#Description').text(snapshot.val().Description);
                            $('#DateCreated').text(snapshot.val().DateCreated);
                            $('#DateModified').text(snapshot.val().DateModified);
                            $('#MinMaxSets').text(snapshot.val().MinSets + ' ' + snapshot.val().MaxSets);
                            $('#MinMaxReps').text(snapshot.val().MinReps + ' ' + snapshot.val().MaxReps);
                            $('#Duration').text(snapshot.val().Duration);




                            $('#Exercises').val(dataRef.parent().child('Exercises').numChildren());


                        }

                    });


                });
            }

        });
    }

