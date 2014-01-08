var pathname;
var planName;
var editor;
var oTable;



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

    var obj = {};
    var x;
        var data= [];
        var columns = [
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

        //$("form").attr("data_validate", "parsley");

        
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
                    initializeAuth(function (email) {
                        if (email) {
                            getUserIdByEmail(email, function (uid) {

                                //
                                //oTable.fnClearTable();
                                //oTable.fnDraw();
                    var name = data.data.Name;
                    var description = data.data.Description;
                    
              
                    obj.Name = name;
                    obj.Description = description;
                    obj.DateCreated = getTodaysDate();
                    obj.DateModified = getTodaysDate();
                    url = 'https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/'
                    var f = new Firebase(url);
                    id = f.push(obj).name();
                    x = obj;
                    
                    console.log('id ' + id);
                    successCallback({ "id": 'xxx' });
                    //oTable.fnDestroy();
                            });
                        }
                    });
        
                }
                else if (data.action === 'edit') {
                    id = data.id;
                    console.log('edit id' + data.id);
                    initializeAuth(function (email) {
                        getUserIdByEmail(email, function (uid) {
                            var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + data.id);
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
                            console.log('remove ' + JSON.stringify(data));
                    var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + data.data[0]);

                    //console.log('id ' + data.data[0]);
                    fb.remove();
                    console.log('id ' + data.data[0]);
                    

                        })
                    })
                    successCallback({ "id": null });
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
        
            editor.on('onCreate', function (json,data) {

                var nRow = $('#xxx')[0];

                oTable.fnDeleteRow(nRow);
            });
           
        
       

        getUserIdByEmail(email, function (uid) {
            var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/');
            dataRef.on('value', function (snapshot) {
               
                data = [];
                snapshot.forEach(function (childSnapshot) {
                    var o = $.extend({}, childSnapshot.val()); 
                    o.DT_RowId = childSnapshot.name();
                    data.push(o);

                });
              
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
                        "bDestroy": true,

                       
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

   

       

