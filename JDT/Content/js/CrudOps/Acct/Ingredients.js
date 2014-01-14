var pathname;
var planName;
var dietName;
var recipeName;
var ingredientName;

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
                    ingredientName = pathname[pathname.length - 4];
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/' + recipeName + '/Ingredients/' + ingredientName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('ingredient ' + ingredientName + ' does not exist.');
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
            recipeName = pathname[pathname.length - 3];
            var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/' + recipeName + '/Ingredients/');
            dataRef.on('value', function (snapshot) {
                if (snapshot.val() === null) {
                    console.log('Ingredients for recipe ' + recipeName + ' do not exist.');
                } else {
                    
                    var tr;
                    var count = 1;
                    $('tbody').empty();
                    snapshot.forEach(function (childSnapshot) {
                        var ingredient = childSnapshot.val();
                        tr = $('<tr/>');
                        tr.append("<td class='hidden-xs-portrait'>" + count + "</td>");
                        tr.append("<td>" + ingredient.Name + "</td>");
                        tr.append("<td class='hidden-xs'>" + ingredient.Description + "</td>");
                        tr.append("<td class='hidden-xs'>" + ingredient.DateCreated + "</td>");
                        tr.append("<td>"
                            + "<button class='btn btn-sm btn-primary' onclick=\"location.href='/Ingredients/Edit/" + childSnapshot.name() + "/" + recipeName + '/' + dietName + "/" + planName + "'\">Edit</button>"
                            + "<button class='btn btn-sm btn-inverse' onclick=\"location.href='/Ingredients/Details/" + childSnapshot.name() + "/" + recipeName + '/' + dietName + "/" + planName + "'\">Details</button>"
                            + "<button class='btn btn-sm btn-warning' onclick=\"location.href='/Ingredients/Delete/" + childSnapshot.name() + "/" + recipeName + '/' + dietName + "/" + planName + "'\">Delete</button>"
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
        window.location.replace("/Ingredients/Create/" + recipeName + '/' + dietName + "/" + planName);
    });

    $(document).on("click", "#EditDetails", function () {
        //console.log('asdfsdf')
        window.location.replace("/Ingredients/Edit/" + ingredientName + '/' + recipeName + "/" + dietName + '/' + planName);
    });

    $(document).on("click", "#List", function () {
        //console.log('asdfsdf')
        window.location.replace("/Ingredients/Index/" + recipeName + '/' + dietName + '/' + planName);
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

               

                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/' + recipeName + '/Ingredients/' + ingredientName);
                var name = $("#Name").val();
                var description = $("#elastic-textarea").val();
                fb.update({
                    "Name": name,
                    "Description": description,
                    "DateModified": output
                });

                window.location.replace('/Ingredients/Index/' + recipeName + '/' + dietName + '/' + planName);
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
                    recipeName = pathname[pathname.length - 3];
                    var d = new Date();
                    var month = d.getMonth() + 1;
                    var day = d.getDate();
                    var output = d.getFullYear() + '/' +
                        (month < 10 ? '0' : '') + month + '/' +
                        (day < 10 ? '0' : '') + day;
                    //console.log('uid: ' + uid + ' planname ' + planName + ' workout ' + dietName);
                    var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/' + recipeName + '/Ingredients/');
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
                    window.location.replace('/Ingredients/Index/' + recipeName + '/' + dietName + '/' + planName);
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
                var ingredientName = pathname[pathname.length - 4];
                var fb = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/' + recipeName + '/Ingredients/' + ingredientName);

                fb.remove();

                window.location.replace('/Ingredients/Index/' + recipeName + '/' + dietName + '/' + planName);
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
                    ingredientName = pathname[pathname.length - 4];
                    //console.log(uid);
                    var dataRef = new Firebase('https://jdt.firebaseio.com/Users/user/' + uid + '/Plans/' + planName + '/Diets/' + dietName + '/Recipes/' + recipeName + '/Ingredients/' + ingredientName);
                    dataRef.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            alert('Ingredient ' + ingredientName + ' does not exist.');
                        } else {
                            $('#Name').text(snapshot.val().Name);
                            $('#Description').text(snapshot.val().Description);



                        }

                    });


                });
            }

        });
    }

