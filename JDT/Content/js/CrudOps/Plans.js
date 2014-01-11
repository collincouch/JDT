var pathname;
var planName;
var editor;
var oTable;
var userRef = new Firebase('https://jdt.firebaseio.com/Users/user/');
var plansRef = new Firebase('https://jdt.firebaseio.com/Plans/');
var userPlansRef;
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
                //console.log(JSON.stringify(row));
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
                    //userPlansRef.off('child_changed', usersPlansChanged);
                    initializeAuth(function (email) {
                        getUserIdByEmail(email, function (uid) {
                            
                            var fb = new Firebase('https://jdt.firebaseio.com/Plans/');
                            var fbUser = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/');

                            var name = data.data.Name;

                            var description = data.data.Description;
                            
                            obj.Name = name;
                            obj.Description = description;
                            obj.DateModified = getTodaysDate();
                            obj.DateCreated = getTodaysDate();
                            //console.log('asdfasdf');
                            try {
                                //console.log('asdfasdf');
                                //userPlansRef.off('child_added', usersPlansAdded);
                                userPlansRef.off('child_changed', usersPlansChanged);
                                id = fb.push(obj, function (err) {
                                    if (!err) {
                                        //console.log('id ' + id);
                                            fbUser.child(id).set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                                if (!err) {
                                                    //userPlansRef.on('child_added', usersPlansAdded);
                                                    userPlansRef.on('child_changed', usersPlansChanged);
                                                    successCallback({ "id": id });
                                                }
                                            });
                                    }
                                    
                                }).name();
                               

                            } catch (e) {
                                //userPlansRef.on('child_added', usersPlansAdded);
                                console.log(JSON.stringify(e));
                            }
                            
                            
                        });
                    });
                }
                else if (data.action === 'edit') {
                    id = data.id;
                    
                   
                    initializeAuth(function (email) {
                        getUserIdByEmail(email, function (uid) {
                            
                            var fb = new Firebase('https://jdt.firebaseio.com/Plans/' + id);
                            var fbUser = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + id);
                            
                            var name = data.data.Name;
                            
                            obj.Name = name;
                            
                            var description = data.data.Description;
                            obj.Description = description;
                            obj.DateModified = getTodaysDate();
                            
                            try {
                                userPlansRef.off('child_changed', usersPlansChanged);
                                fb.update(obj, function (err) {
                                    if (!err) {
                                        //console.log('setting ' + err);
                                        fbUser.set(Firebase.ServerValue.TIMESTAMP, function (err) {
                                            
                                            if (!err) {
                                                userPlansRef.on('child_changed', usersPlansChanged);
                                                successCallback({ "id": id });
                                                //initializeDataTable();
                                            }
                                        });
                                    }
                                });
                                
                                
                            } catch (e) {
                                //userPlansRef.on('child_changed', usersPlansChanged);
                                console.log(JSON.stringify(e));
                            }
                            
                            
                        });
                    });

                   
                    
                }
                else if (data.action === 'remove') {
                    
                    initializeAuth(function (email) {
                        getUserIdByEmail(email, function (uid) {
                            //console.log('remove ' + JSON.stringify(data));
                    var fb = new Firebase('https://jdt.firebaseio.com/Plans/' + data.data[0]);
                    var fbUser = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + data.data[0]);
                    var r = [];
                    userPlansRef.off('child_removed', usersPlansRemoved);
                    fb.remove(function (err) {
                        if (!err) {
                            fbUser.remove(function (err) {
                                if (!err) {
                                    r = jQuery.removeFromArray(data.data[0], records);
                                    records = r;
                                    userPlansRef.on('child_removed', usersPlansRemoved);
                                    successCallback({ "id": null });
                                }
                            });
                        }

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
        
            //editor.on('onPreCreate', function (json, data) {
            //    userPlansRef.off('child_added', usersPlansAdded);
            //    //userPlansRef.off('child_changed', usersPlansChanged);
            //});

            //editor.on('onPostCreate', function (json, data) {
            //    userPlansRef.on('child_added', usersPlansAdded);
            //    //userPlansRef.on('child_changed', usersPlansChanged);
            //});

            //editor.on('onPreEdit', function (json, data) {
            //    userPlansRef.off('child_changed', usersPlansChanged);
            //});

            //editor.on('onPostEdit', function (json, data) {
            //    userPlansRef.on('child_changed', usersPlansChanged);
            //});

        getUserIdByEmail(email, function (uid) {
          
            initializeDataTable();
            userPlansRef = userRef.child(uid + '/Plans/');
            
            userPlansRef.on('child_added', usersPlansAdded);
           
            userPlansRef.on('child_changed', usersPlansChanged);

            userPlansRef.on('child_removed', usersPlansRemoved);

        });

}

jQuery.removeFromArray = function (value, arr) {
    //console.log('object to be removed ' + JSON.stringify(value));
    return jQuery.grep(arr, function (elem, index) {
        //console.log(' removing ' + elem.DT_RowId);
        return elem.DT_RowId !== value;
    });
};



var usersPlansAdded = function (snapShot) {
    console.log('usersPlansAdded executing');
    plansRef.child(snapShot.name()).once("value", function (childSnapShot) {

        var o = childSnapShot.val();
        o.DT_RowId = childSnapShot.name();

        records.push(o);

        initializeDataTable();

    });
}



var usersPlansChanged = function (snapShot) {
    console.log('changed');
    var i = 0;
    
    plansRef.child(snapShot.name()).on("value", function (childSnapShot) {
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

var usersPlansRemoved = function (snapShot) {
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
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('plan ' + planName + ' does not exist.');
                        } else {
                           // $('#Name').text(snapshot.val().Name);
                           // $('#Description').text(snapshot.val().Description);
                           // $('#DateCreated').text(snapshot.val().DateCreated);
                           // $('#DateModified').text(snapshot.val().DateModified);
                           // $('#Exercises').val(dataRef.parent().child('Exercises').numChildren());


                        }

                    });


                });
            }

        });
    }

   

       

