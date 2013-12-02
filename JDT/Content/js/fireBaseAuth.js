var fbUsers = new Firebase("https://jdt.firebaseio.com/Users/");
var jdtRef = new Firebase('https://jdt.firebaseio.com');
var auth;

function initializeSimpleLogin(callback)
{
    try {
        console.log('initializeSimpleLogin()');
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
                console.log('User is authorized: User ID: ' + user.id + ', Email: ' + user.email + ', Provider: ' + user.provider);

                callback(user.email);


            } else {
                console.log('invalid uid/pwd');
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
function createNewUser(userRecord) {
    console.log('createNewUser' + userRecord);
    var id = 0;
    try {
    id = fbUsers.child('user').push(userRecord).name();
    fbUsers.child('emails_to_ids/' + emailToKey(userRecord.Email)).set(id);
    }
    catch(e)
    {
        console.log(e);
    }
    return id;
}

/**
 * Firebase keys cannot have a period (.) in them, so this converts the emails to valid keys
 */
function emailToKey(emailAddress) {
    return emailAddress.replace('.', ',');
}