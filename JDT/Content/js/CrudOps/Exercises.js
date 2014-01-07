var pathname;
var planName;
var workOutName;
var exerciseName;

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
    var data = [];
    var columns = [
    { mData: "Name", sTitle: "Name" },
    { mData: "Description", sTitle: "Description" },
    { mData: "DateCreated", sTitle: "Date Created" },
    { mData: "RecMaxSets", sTitle: "Set Range" },
    { mData: "RecMinSets", sTitle: "Rep Range" },
    { mData: "RecMinReps", sTitle: "Rep Range" },
    { mData: "RecMaxReps", sTitle: "Rep Range" },
    { mData: "Duration", sTitle: "Duration" }
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
        "ajax": function (method, url, data, successCallback, errorCallback) {

            var id = null;
            var obj = {};
            if (data.action === 'create') {
                initializeAuth(function (email) {
                    if (email) {
                        getUserIdByEmail(email, function (uid) {
                            pathname = window.location.pathname.split("/");
                            planName = pathname[pathname.length - 1];
                            workOutName = pathname[pathname.length - 2];
                            obj.Name = data.data.Name;
                            obj.Description = data.data.Description;
                            obj.RecMinSets = data.data.RecMinSets;
                            obj.RecMaxSets = data.data.RecMaxSets;
                            obj.RecMinReps = data.data.RecMinReps;
                            obj.RecMaxReps = data.data.RecMaxReps;
                            obj.RecDuration = data.data.RecDuration;
                            
                           
                            var keyName = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/').push(
                                 obj).name();
                            id = keyName;
                            successCallback({ "id": id });
                        });
                    }
                });

            }
            else if (data.action === 'edit') {
                id = data.id;
                //console.log('edit id' + data.id);
                initializeAuth(function (email) {
                    getUserIdByEmail(email, function (uid) {
                        pathname = window.location.pathname.split("/");
                        planName = pathname[pathname.length - 1];
                        workOutName = pathname[pathname.length - 2];
                        var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + "/WorkOuts/" + workOutName + 'Exercises/' + data.id);
                        obj.Name = data.data.Name;
                        obj.Description = data.data.Description;
                        obj.RecMinSets = data.data.RecMinSets;
                        obj.RecMaxSets = data.data.RecMaxSets;
                        obj.RecMinReps = data.data.RecMinReps;
                        obj.RecMaxReps = data.data.RecMaxReps;
                        obj.RecDuration = data.data.RecDuration;
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
                        pathname = window.location.pathname.split("/");
                        planName = pathname[pathname.length - 1];
                        workOutName = pathname[pathname.length - 2];
                        var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + "/WorkOuts/" + workOutName + '/Exercises/' +  data.data[0]);

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
        var valid = f.parsley('validate');
        if (valid == false)
            return false;
    });
        getUserIdByEmail(email, function (uid) {
            pathname = window.location.pathname.split("/");
            planName = pathname[pathname.length - 1];
            workOutName = pathname[pathname.length - 2];
            var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/');
            dataRef.on('value', function (snapshot) {
                if (snapshot.val() === null) {
                    console.log('Exercises for workout ' + workOutName + ' do not exist.');
                } else {
                    
                    var tr;
                    var count = 1;
                    $('tbody').empty();
                    snapshot.forEach(function (childSnapshot) {
                        var o = $.extend({}, childSnapshot.val()); // does childSnapshot.val() need to be $.parseJSON()'ed? It if it s JSON string it will.
                        o.DT_RowId = childSnapshot.name();
                        data.push(o);
                    });
                }
                $('#datatable-table').dataTable({
                    "sDom": "<'row'<'col-xs-6'T><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
                    "aaData": data,
                    "aoColumns": columns,
                    "oTableTools": {
                        "sRowSelect": "single",
                        "aButtons": [
                            { "sExtends": "editor_create", "editor": editor, "sButtonClass": "btn btn-primary" },
                            { "sExtends": "editor_edit", "editor": editor, "sButtonClass": "btn btn-primary" },
                            { "sExtends": "editor_remove", "editor": editor }
                        ]
                    },
                    bRetrieve: true,
                });

            });


        });
    }

    $("#Edit").submit(function (event) {
        event.preventDefault();
        initializeAuth(function (email) {
            getUserIdByEmail(email, function (uid) {
                var d = new Date();
                var month = d.getMonth() + 1;
                var day = d.getDate();
                var output = d.getFullYear() + '/' +
                    (month < 10 ? '0' : '') + month + '/' +
                    (day < 10 ? '0' : '') + day;

               

                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/' + exerciseName);
                var name = $("#Name").val();
                var description = $("#elastic-textarea").val();
                var minSets = $("#minsets").val();
                var maxSets = $("#maxsets").val();
                var minReps = $("#minreps").val();
                var maxReps = $("#maxreps").val();
                var duration = $("#RecDuration").val();
                fb.update({
                    "Name": name,
                    "Description": description,
                    "DateModified": output,
                    "MinSets": minSets,
                    "MaxSets": maxSets,
                    "MinReps": minReps,
                    "MaxReps": maxReps,
                    "Duration": duration
                });

                window.location.replace('/Exercises/Index/' + workOutName + '/' + planName);
            });
        });
    });
    $("#Create").submit(function (event) {
        event.preventDefault();
        initializeAuth(function (email) {
            if (email) {
                getUserIdByEmail(email, function (uid) {
                    pathname = window.location.pathname.split("/");
                    planName = pathname[pathname.length - 1];
                    workOutName = pathname[pathname.length - 2];
                    var d = new Date();
                    var month = d.getMonth() + 1;
                    var day = d.getDate();
                    var output = d.getFullYear() + '/' +
                        (month < 10 ? '0' : '') + month + '/' +
                        (day < 10 ? '0' : '') + day;
                    //console.log('uid: ' + uid + ' planname ' + planName + ' workout ' + workOutName);
                    var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/');
                    var name = $("#Name").val();
                    var description = $("#elastic-textarea").val();
                    var minSets = $("#minsets").val();
                    var maxSets = $("#maxsets").val();
                    var minReps = $("#minreps").val();
                    var maxReps = $("#maxreps").val();
                    var duration = $("#RecDuration").val();
                    //console.log('name: ' + name + ' des: ' + ' minSets: ' + minSets + ' maxSets: ' + maxSets);
                    fb.push({
                        "Name": name,
                        "Description": description,
                        "DateCreated": output,
                        "DateModified": output,
                        "MinSets": minSets,
                        "MaxSets": maxSets,
                        "MinReps": minReps,
                        "MaxReps": maxReps,
                        "Duration": duration
                    });
                    //console.log('asdfasdf');
                    window.location.replace('/Exercises/Index/' + workOutName + '/' + planName);
                });
            }

        });
    });
    $("#Delete").submit(function (event) {
        event.preventDefault();
        initializeAuth(function (email) {
            getUserIdByEmail(email, function (uid) {
                var d = new Date();
                var month = d.getMonth() + 1;
                var day = d.getDate();
                var output = d.getFullYear() + '/' +
                    (month < 10 ? '0' : '') + month + '/' +
                    (day < 10 ? '0' : '') + day;

                var pathname = window.location.pathname.split("/");
                var planName = pathname[pathname.length - 1];
                var workOutName = pathname[pathname.length - 2];
                var exerciseName = pathname[pathname.length - 3];
                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/' + exerciseName);

                fb.remove();

                window.location.replace('/Exercises/Index/' + workOutName);
            });
        });
    });

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

