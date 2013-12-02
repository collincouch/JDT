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
                    exerciseName = pathname[pathname.length - 3];
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/WorkOuts/' + workOutName + '/Exercises/' + exerciseName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('exercise ' + exerciseName + ' does not exist.');
                        } else {
                            $('#Name').val(snapshot.val().Name);
                            $('#elastic-textarea').val(snapshot.val().Description);
                            $('#minsets').val(snapshot.val().MinSets);
                            $('#maxsets').val(snapshot.val().MaxSets);
                            $('#minreps').val(snapshot.val().MinReps);
                            $('#maxreps').val(snapshot.val().MaxReps);
                            $('#RecDuration').val(snapshot.val().Duration);


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
                        var exercise = childSnapshot.val();
                        tr = $('<tr/>');
                        tr.append("<td class='hidden-xs-portrait'>" + count + "</td>");
                        tr.append("<td>" + exercise.Name + "</td>");
                        tr.append("<td class='hidden-xs'>" + exercise.Description + "</td>");
                        tr.append("<td class='hidden-xs'>" + exercise.DateCreated + "</td>");
                        tr.append("<td>" + exercise.MinSets + " - " + exercise.MaxSets + "</td>");
                        tr.append("<td>" + exercise.MinReps + " - " + exercise.MaxReps + "</td>");
                        tr.append("<td>" + exercise.Duration + " - " + exercise.Duration + "</td>");
                        tr.append("<td>"
                            + "<button class='btn btn-sm btn-primary' onclick=\"location.href='/Exercises/Edit/" + childSnapshot.name() + "/" + workOutName + "/" + planName + "'\">Edit</button>"
                            + "<button class='btn btn-sm btn-inverse' onclick=\"location.href='/Exercises/Details/" + childSnapshot.name() + "/" + workOutName + "/" + planName + "'\">Details</button>"
                            + "<button class='btn btn-sm btn-warning' onclick=\"location.href='/Exercises/Delete/" + childSnapshot.name() + "/" + workOutName + "/" + planName + "'\">Delete</button>"
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
        window.location.replace("/Exercises/Create/" + workOutName + "/" + planName);
    });

    $(document).on("click", "#EditDetails", function () {
        //console.log('asdfsdf')
        window.location.replace("/Exercises/Edit/" + exerciseName + "/" + workOutName + '/' + planName);
    });

    $(document).on("click", "#List", function () {
        //console.log('asdfsdf')
        window.location.replace("/Exercises/Index/" + workOutName + '/' + planName);
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

