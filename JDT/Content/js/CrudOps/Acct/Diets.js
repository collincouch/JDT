var pathname;
var planName;
var dietName;
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
                    dietName = pathname[pathname.length - 2];
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName);
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
            var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/');
            dataRef.on('value', function (snapshot) {
                if (snapshot.val() === null) {
                    console.log('Diets for plan ' + planName + ' do not exist.');
                } else {
                    
                    var tr;
                    var count = 1;
                    $('tbody').empty();
                    snapshot.forEach(function (childSnapshot) {
                        var diet = childSnapshot.val();
                        tr = $('<tr/>');
                        tr.append("<td class='hidden-xs-portrait'>" + count + "</td>");
                        tr.append("<td>" + diet.Name + "</td>");
                        tr.append("<td class='hidden-xs'>" + diet.Description + "</td>");
                        tr.append("<td class='hidden-xs'>" + diet.DateCreated + "</td>");
                        tr.append("<td><a href=\"/Recipes/Index/" + childSnapshot.name() + "/" + planName + "\">" + childSnapshot.child('Recipes').numChildren() + "</a></td>");
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
        window.location.replace("/Diets/Create/" + planName);
    });

    $(document).on("click", "#EditDetails", function () {
        //console.log('asdfsdf')
        window.location.replace("/Diets/Edit/" + dietName + "/" + planName);
    });

    $(document).on("click", "#List", function () {
        //console.log('asdfsdf')
        window.location.replace("/Diets/Index/" + planName);
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

                console.log(dietName);

                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName);
                var name = $("#Name").val();
                var description = $("#elastic-textarea").val();
                fb.update({
                    "Name": name,
                    "Description": description,
                    "DateModified": output
                });

                window.location.replace('/Diets/Index/' + planName);
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

                    var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/');
                    var name = $("#Name").val();
                    var description = $("#elastic-textarea").val();
                    fb.push({
                        "Name": name,
                        "Description": description,
                        "DateCreated": output,
                        "DateModified": output
                    });

                    window.location.replace('/Diets/Index/' + planName);
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
                var dietName = pathname[pathname.length - 2];
                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName);

                fb.remove();

                window.location.replace('/Diets/Index/' + planName);
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
                    dietName = pathname[pathname.length - 2];
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('diet ' + dietName + ' does not exist.');
                        } else {
                            $('#Name').text(snapshot.val().Name);
                            $('#Description').text(snapshot.val().Description);
                            $('#DateCreated').text(snapshot.val().DateCreated);
                            $('#DateModified').text(snapshot.val().DateModified);




                            $('#Recipes').val(dataRef.parent().child('Recipes').numChildren());


                        }

                    });


                });
            }

        });
    }

