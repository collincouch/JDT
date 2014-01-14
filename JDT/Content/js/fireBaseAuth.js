var fbUsers = new Firebase("https://jdt.firebaseio.com/Users/");
var jdtRef = new Firebase('https://jdt.firebaseio.com');

var lockerRef = new Firebase('https://jdt.firebaseio.com/Lockers/');
var auth;

function LogOut()
{
    auth = new Firebase(jdtRef);
        auth.unauth();
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

function initializeSimpleLogin(callback)
{
    try {
        //console.log('initializeSimpleLogin()');
        auth = new FirebaseSimpleLogin(jdtRef, function (error, user) {
            if (error) {
                switch (error.code) {
                    case 'INVALID_EMAIL':
                        console.log(error.code);
                       
                    case 'INVALID_PASSWORD':
                        console.log(error.code);
                    default:
                        console.log(error.code);

                }
                callback(error.code);
            } else if (user) {
                // user authenticated with Firebase
                //email = user.email;
                //console.log('User is authorized: User ID: ' + user.id + ', Email: ' + user.email + ', Provider: ' + user.provider);

                callback(user.email);


            } else {
                //console.log('invalid uid/pwd');
                callback(null);
            }

        });
    }
    catch (e)
    {
        console.log('error is ' + e);
    }
   
    }


/**
 * Looks up a user id by email address and invokes callback with the id or null if not found
 * return {Object|null} the object contains the key/value hash for one user
 */
function getUserIdByEmail(emailAddress, callback) {
    fbUsers.child('emails_to_ids/' + emailToKey(emailAddress)).once('value', function (snap) {
        callback(snap.val());
    });
}

/**
 * Creates a new user record and also updates the index
 */
function createNewUser(userRecord,email, password, callback) {
    //console.log('createNewUser ' + email + ' '  + password);
    
    var userEmail = email;
    var userPwd = password;
    try {
        //console.log('fbUsers Path ' + fbUsers.toString());
        //console.log('userRecord ' + JSON.stringify(userRecord));
        var uid = fbUsers.child('user').push(userRecord, function (err) {

            if (!err) {
                //console.log('fbUsers Path ' + fbUsers.toString());
                fbUsers.child('emails_to_ids/' + emailToKey(userRecord.Email)).set(uid, function (err) {
                    if (!err) {
                        //console.log('createNewUser ' + userEmail + ' ' + userPwd);
                        auth.login('password', {
                            email: userEmail,
                            password: userPwd
                        });
                        callback(uid);
                        
                    }
                });
            }


        }).name();
            
        
        
    
    }
    catch(e)
    {
        console.log(e);
    }
    
}

function createLocker(uid) {
    //console.log('uid ' + uid);
    var userLockerRef = fbUsers.child('user/' + uid);
    try {

        var obj = {
            "DateCreated": getTodaysDate(),
            "DateModified": getTodaysDate(),
            "Name": "Your Locker Name",
        };
        var id = lockerRef.push(obj,function (err) {
            if (!err) {
                obj = { "LockerId": id };
                userLockerRef.update(obj);
            }

        }).name();


    } catch (e) {

        console.log('An error occured ' + JSON.stringify(e));
    }
}

/**
 * Firebase keys cannot have a period (.) in them, so this converts the emails to valid keys
 */
function emailToKey(emailAddress) {
    return emailAddress.replace('.', ',');
}