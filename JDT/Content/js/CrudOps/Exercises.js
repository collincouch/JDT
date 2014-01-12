var editor;
var oTable;
var pathname = window.location.pathname.split("/");
var planName = pathname[pathname.length - 2];
var workOutName = pathname[pathname.length - 1];
var workOutExercisesRef = new Firebase('https://jdt.firebaseio.com/WorkOuts/' + workOutName + '/Exercises/');
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
                            workOutExercisesRef.off('value', workOutExercisesChanged);
                            id = workOutExercisesRef.push(obj, function (err) {
                                
                                    workOutExercisesRef.on('value', workOutExercisesChanged);
                                    successCallback({ "id": id });
                                

                            }).name();
                        } catch (e) {
                            workOutExercisesRef.on('value', workOutExercisesChanged);
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
                        workOutExercisesRef.off('value', workOutExercisesChanged);
                        workOutExercisesRef.child(id).update(obj, function (err) {
                     
                                workOutExercisesRef.on('value', workOutExercisesChanged);
                                successCallback({ "id": id });
                        
                        });
                    } catch (e) {
                        workOutExercisesRef.on('value', workOutExercisesChanged);
                            console.log(JSON.stringify(e));
                        }
                    
                });
                
            }
            else if (data.action === 'remove') {

                initializeAuth(function (email) {
                    try {
                        var r = [];
                        workOutExercisesRef.off('child_removed', workOutExercisesRefRemoved);
                        workOutExercisesRef.child(data.data[0]).remove(function () {
                            r = jQuery.removeFromArray(data.data[0], records);
                            records = r;
                            workOutExercisesRef.on('child_removed', workOutExercisesRefRemoved);
                            successCallback({ "id": id });
                        });
                    } catch (e) {
                        workOutExercisesRef.on('child_removed', workOutExercisesRefRemoved);
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

        workOutExercisesRef.on('child_added', workOutExercisesAdded);

        workOutExercisesRef.on('child_changed', workOutExercisesChanged);

        workOutExercisesRef.on('child_removed', workOutExercisesRefRemoved);

    });

    }


var workOutExercisesAdded = function (snapShot) {

    workOutExercisesRef.child(snapShot.name()).once("value", function (childSnapShot) {

        var o = childSnapShot.val();
        o.DT_RowId = childSnapShot.name();

        records.push(o);

        initializeDataTable();

    });
}

var workOutExercisesChanged = function (snapShot) {
    //console.log('changed');
    

    workOutExercisesRef.child(snapShot.name()).on("value", function (childSnapShot) {
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

var workOutExercisesRefRemoved = function (snapShot) {
    //console.log('record length before ' + records.length);
    var r = [];


    workOutExercisesRef.child(snapShot.name()).on("value", function (childSnapShot) {
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

    
