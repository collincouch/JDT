var editor;
var oTable;
var pathname = window.location.pathname.split("/");
var planName = pathname[pathname.length - 2];
var workOutName = pathname[pathname.length - 1];
var exercisesRef = new Firebase('https://jdt.firebaseio.com/Exercises/');
var workOutExercises = new Firebase('https://jdt.firebaseio.com/WorkOuts/' + workOutName + '/Exercises/');
var records = [];
var columns;
var numExercises=0;

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
 
    columns = [
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
            
         }, {
             "name": "DT_RowId",
             "type": "hidden",
         }
        
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
            
            if (data.action === 'create') {
                initializeAuth(function (email) {
                    if (email) {
                      
                            obj.Name = data.data.Name;
                            obj.Description = data.data.Description;
                            obj.DateCreated = getTodaysDate();
                            obj.DateModified = getTodaysDate();
                            obj.RecMinSets = data.data.RecMinSets;
                            obj.RecMaxSets = data.data.RecMaxSets;
                            obj.RecMinReps = data.data.RecMinReps;
                            obj.RecMaxReps = data.data.RecMaxReps;
                            obj.RecDuration = data.data.RecDuration;
                            try {
                            workOutExercises.off('child_changed', workOutsExercisesChanged);
                            id = exercisesRef.push(obj, function (err) {
                                if (!err) {
                                    
                                    
                                            //console.log(workOutExercises.parent().toString());
                                            //workOutExercises.parent().set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                                workOutExercises.child(id).set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                                    if (!err)
                                                    {
                                                        workOutExercises.on('child_changed', workOutsExercisesChanged);
                                                        successCallback({ "id": id });
                                                    }
                                                });
                                                
                                          
                                        
                                    
                                    
                                }

                            }).name();

                            } catch (e) {
                            workOutExercisesRef.on('child_changed', workOutsExercisesChanged);
                            }
                        
                    }
                });

            }
            else if (data.action === 'edit') {
                id = data.id;
                //console.log('edit id' + data.id);
                initializeAuth(function (email) {
                      obj.Name = data.data.Name;
                        obj.Description = data.data.Description;
                        obj.DateModified = getTodaysDate();
                        obj.RecMinSets = data.data.RecMinSets;
                        obj.RecMaxSets = data.data.RecMaxSets;
                        obj.RecMinReps = data.data.RecMinReps;
                        obj.RecMaxReps = data.data.RecMaxReps;
                        obj.RecDuration = data.data.RecDuration;

                    try {
                        //console.log(exercisesRef.child(id).toString());
                        workOutExercises.off('child_changed', workOutsExercisesChanged);
                        exercisesRef.child(id).update(obj, function (err) {
                            //console.log('test');
                            workOutExercises.child(id).set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                if (!err) {
                                    workOutExercises.on('child_changed', workOutsExercisesChanged);
                                    successCallback({ "id": id });
                                }
                            });
                            
                        
                        });
                    } catch (e) {
                        workOutExercises.off('child_changed', workOutsExercisesChanged);
                            console.log(JSON.stringify(e));
                        }
                    
                });
                
            }
            else if (data.action === 'remove') {

                initializeAuth(function (email) {
                    try {
                        var r = [];
                        workOutExercises.off('child_removed', workOutsExercisesRemoved);
                        exercisesRef.child(data.data[0]).remove(function () {
                            workOutExercises.child(data.data[0]).remove(function (err) {
                                if (!err) {
                                    r = jQuery.removeFromArray(data.data[0], records);
                                    records = r;
                                    workOutExercises.on('child_removed', workOutsExercisesRemoved);
                                    successCallback({ "id": id });
                                }
                            });
                           
                        });
                    } catch (e) {
                        workOutExercises.on('child_removed', workOutsExercisesRemoved);
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

        workOutExercises.once('value', function (snap) {
            numExercises = snap.numChildren();
            //console.log('numExercises ' + numExercises);
            if (numExercises === 0)
                initializeDataTable();
        });

        workOutExercises.on('child_added', workOutsExercisesAdded);

        workOutExercises.on('child_changed', workOutsExercisesChanged);

        workOutExercises.on('child_removed', workOutsExercisesRemoved);

    });

    }


var workOutsExercisesAdded = function(snapShot) {
    console.log('added');
    exercisesRef.child(snapShot.name()).once("value", function(childSnapShot) {

        var o = childSnapShot.val();
        o.DT_RowId = childSnapShot.name();

        records.push(o);

        if(numExercises===records.length)
            initializeDataTable();

    });
};

var workOutsExercisesChanged = function (snapShot) {
    console.log('changed');
    

    exercisesRef.child(snapShot.name()).on("value", function (childSnapShot) {
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

var workOutsExercisesRemoved = function (snapShot) {
    //console.log('record length before ' + records.length);
    var r = [];


    exercisesRef.child(snapShot.name()).on("value", function (childSnapShot) {
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

    
