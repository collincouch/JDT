var pathname;
var planName;

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
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName);
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
            var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/');
            dataRef.on('value', function (snapshot) {
                if (snapshot.val() === null) {
                    console.log('Plans for user ' + uid + ' do not exist.');
                } else {
                    var tr;
                    var count = 1;
                    $('tbody').empty();
                    snapshot.forEach(function (childSnapshot) {
                        var plan = childSnapshot.val();
                        tr = $('<tr/>');
                        tr.append("<td class='hidden-xs-portrait'>" + count + "</td>");
                        tr.append("<td>" + plan.Name + "</td>");
                        tr.append("<td class='hidden-xs'>" + plan.Description + "</td>");
                        tr.append("<td class='hidden-xs'>" + plan.DateCreated + "</td>");
                        tr.append("<td><a href=\"/WorkOuts/Index/" + childSnapshot.name() + "\">" + childSnapshot.child('WorkOuts').numChildren() + "</a></td>");
                        tr.append("<td><a href=\"/Diets/Index/" + childSnapshot.name() + "\">" + childSnapshot.child('Diets').numChildren() + "</a></td>");
                        tr.append("<td>"
                            + "<button class='btn btn-sm btn-primary' onclick=\"location.href='/Plans/Edit/" + childSnapshot.name() + "'\">Edit</button>"
                            + "<button class='btn btn-sm btn-inverse' onclick=\"location.href='/Plans/Details/" + childSnapshot.name() + "'\">Details</button>"
                            + "<button class='btn btn-sm btn-warning' onclick=\"location.href='/Plans/Delete/" + childSnapshot.name() + "'\">Delete</button>"
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
        window.location.replace("../Create/" + planName);
    });

    $(document).on("click", "#EditDetails", function () {
        //console.log('asdfsdf')
        window.location.replace("../Edit/" + planName);
    });

    $(document).on("click", "#List", function () {
        //console.log('asdfsdf')
        window.location.replace("../Index/");
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

              
                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName);
                var name = $("#Name").val();
                var description = $("#elastic-textarea").val();
                fb.update({
                    "Name": name,
                    "Description": description,
                    "DateModified": output
                });

                window.location.replace('/Plans/Index/' + planName);
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

                    var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/');
                    var name = $("#Name").val();
                    var description = $("#elastic-textarea").val();
                    fb.push({
                        "Name": name,
                        "Description": description,
                        "DateCreated": output,
                        "DateModified": output
                    });

                    window.location.replace('/Plans/Index/' + planName);
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
                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName);

                fb.remove();

                window.location.replace('/Plans/Index/');
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
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('plan ' + planName + ' does not exist.');
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

