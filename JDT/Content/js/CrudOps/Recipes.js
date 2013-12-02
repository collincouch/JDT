var pathname;
var planName;
var dietName;
var recipeName;

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
                    recipeName = pathname[pathname.length - 3];
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/' + recipeName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('recipe ' + recipeName + ' does not exist.');
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
            dietName = pathname[pathname.length - 2];
            var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/');
            dataRef.on('value', function (snapshot) {
                if (snapshot.val() === null) {
                    console.log('Recipes for diet ' + dietName + ' do not exist.');
                } else {
                    
                    var tr;
                    var count = 1;
                    $('tbody').empty();
                    snapshot.forEach(function (childSnapshot) {
                        var recipe = childSnapshot.val();
                        tr = $('<tr/>');
                        tr.append("<td class='hidden-xs-portrait'>" + count + "</td>");
                        tr.append("<td>" + recipe.Name + "</td>");
                        tr.append("<td class='hidden-xs'>" + recipe.Description + "</td>");
                        tr.append("<td class='hidden-xs'>" + recipe.DateCreated + "</td>");
                        tr.append("<td><a href=\"/Ingredients/Index/" + childSnapshot.name() + "/" + dietName + "/" + planName + "\">" + childSnapshot.child('Ingredients').numChildren() + "</a></td>");
                        tr.append("<td>"
                            + "<button class='btn btn-sm btn-primary' onclick=\"location.href='/Recipes/Edit/" + childSnapshot.name() + "/" + dietName + "/" + planName + "'\">Edit</button>"
                            + "<button class='btn btn-sm btn-inverse' onclick=\"location.href='/Recipes/Details/" + childSnapshot.name() + "/" + dietName + "/" + planName + "'\">Details</button>"
                            + "<button class='btn btn-sm btn-warning' onclick=\"location.href='/Recipes/Delete/" + childSnapshot.name() + "/" + dietName + "/" + planName + "'\">Delete</button>"
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
        window.location.replace("/Recipes/Create/" + dietName + "/" + planName);
    });

    $(document).on("click", "#EditDetails", function () {
        //console.log('asdfsdf')
        window.location.replace("/Recipes/Edit/" + recipeName + "/" + dietName + '/' + planName);
    });

    $(document).on("click", "#List", function () {
        //console.log('asdfsdf')
        window.location.replace("/Recipes/Index/" + dietName + '/' + planName);
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

               

                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/' + recipeName);
                var name = $("#Name").val();
                var description = $("#elastic-textarea").val();
                fb.update({
                    "Name": name,
                    "Description": description,
                    "DateModified": output
                });

                window.location.replace('/Recipes/Index/' + dietName + '/' + planName);
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
                    dietName = pathname[pathname.length - 2];
                    var d = new Date();
                    var month = d.getMonth() + 1;
                    var day = d.getDate();
                    var output = d.getFullYear() + '/' +
                        (month < 10 ? '0' : '') + month + '/' +
                        (day < 10 ? '0' : '') + day;
                    //console.log('uid: ' + uid + ' planname ' + planName + ' workout ' + dietName);
                    var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/');
                    var name = $("#Name").val();
                    var description = $("#elastic-textarea").val();
                    //console.log('name: ' + name + ' des: ' + ' minSets: ' + minSets + ' maxSets: ' + maxSets);
                    fb.push({
                        "Name": name,
                        "Description": description,
                        "DateCreated": output,
                        "DateModified": output

                    });
                    //console.log('asdfasdf');
                    window.location.replace('/Recipes/Index/' + dietName + '/' + planName);
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
                var recipeName = pathname[pathname.length - 3];
                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/' + recipeName);

                fb.remove();

                window.location.replace('/Recipes/Index/' + dietName + '/' + planName);
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
                    recipeName = pathname[pathname.length - 3];
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/' + recipeName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('Recipes ' + recipeName + ' does not exist.');
                        } else {
                            $('#Name').text(snapshot.val().Name);
                            $('#Description').text(snapshot.val().Description);





                            $('#Ingredients').val(dataRef.parent().child('Ingredients').numChildren());


                        }

                    });


                });
            }

        });
    }

