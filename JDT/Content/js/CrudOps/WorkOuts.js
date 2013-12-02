var pathname;
var planName;
var workOutName;
function initListAuth() {
    initializeAuth(function (email) {
        setHeader(email);
        setSideNav(email);
        populateList(email);
    })
}

function initCreateAuth() {
    initializeAuth(function (email) {
        setHeader(email);
        setSideNav(email);
        
    })
}
    
    function initEditAuth() {
        initializeAuth(function (email) {
            if (email) {
                getUserIdByEmail(email, function (uid) {
                    pathname = window.location.pathname.split("/");
                    planName = pathname[pathname.length - 1];
                    workOutName = pathname[pathname.length - 2];
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('plan ' + planName + ' does not exist.');
                        } else {
                            $('#Name').val(snapshot.val().Name);
                            $('#elastic-textarea').val(snapshot.val().Description);

                        }

                    });


                });

                setHeader(email);
                setSideNav(email);
            }

        });
    }

    function populateList(email) {
        getUserIdByEmail(email, function (uid) {
            pathname = window.location.pathname.split("/");
            planName = pathname[pathname.length - 1];
            var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/');
            dataRef.on('value', function (snapshot) {
                if (snapshot.val() === null) {
                    console.log('Workouts for plan ' + planName + ' do not exist.');
                } else {
                    
                    var tr;
                    var count = 1;
                    $('tbody').empty();
                    snapshot.forEach(function (childSnapshot) {
                        var workOut = childSnapshot.val();
                        tr = $('<tr/>');
                        tr.append("<td class='hidden-xs-portrait'>" + count + "</td>");
                        tr.append("<td>" + workOut.Name + "</td>");
                        tr.append("<td class='hidden-xs'>" + workOut.Description + "</td>");
                        tr.append("<td class='hidden-xs'>" + workOut.DateCreated + "</td>");
                        tr.append("<td><a href=\"/Exercises/Index/" + childSnapshot.name() + "/" + planName + "\">" + childSnapshot.child('Exercises').numChildren() + "</a></td>");
                        tr.append("<td>" + childSnapshot.child('Diets').numChildren() + "</td>");
                        tr.append("<td>"
                            + "<button class='btn btn-sm btn-primary' onclick=\"location.href='../Edit/" + childSnapshot.name() + "/" + planName + "'\">Edit</button>"
                            + "<button class='btn btn-sm btn-inverse' onclick=\"location.href='../Details/" + childSnapshot.name() + "/" + planName + "'\">Details</button>"
                            + "<button class='btn btn-sm btn-warning' onclick=\"location.href='../Delete/" + childSnapshot.name() + "/" + planName + "'\">Delete</button>"
                            + "</td>");
                        $('tbody').append(tr);
                        count++;
                    });
                }

            });


        });
    }

    $(document).on("click", "#AddNew", function () {
        //console.log('asdfsdf')
        window.location.replace("/WorkOuts/Create/" + planName);
    });

    $(document).on("click", "#EditDetails", function () {
        //console.log('asdfsdf')
        window.location.replace("/WorkOuts/Edit/" + workOutName + "/" + planName);
    });

    $(document).on("click", "#List", function () {
        //console.log('asdfsdf')
        window.location.replace("/WorkOuts/Index/" + planName);
    });
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

                console.log(workOutName);

                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName);
                var name = $("#Name").val();
                var description = $("#elastic-textarea").val();
                fb.update({
                    "Name": name,
                    "Description": description,
                    "DateModified": output
                });

                window.location.replace('/WorkOuts/Index/' + planName);
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
                    var d = new Date();
                    var month = d.getMonth() + 1;
                    var day = d.getDate();
                    var output = d.getFullYear() + '/' +
                        (month < 10 ? '0' : '') + month + '/' +
                        (day < 10 ? '0' : '') + day;

                    var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/');
                    var name = $("#Name").val();
                    var description = $("#elastic-textarea").val();
                    fb.push({
                        "Name": name,
                        "Description": description,
                        "DateCreated": output,
                        "DateModified": output
                    });

                    window.location.replace('/WorkOuts/Index/' + planName);
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
                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName);

                fb.remove();

                window.location.replace('/WorkOuts/Index/' + planName);
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

