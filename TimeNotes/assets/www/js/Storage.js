/**
 * @author Elan
 */

$(function(){
    var db = connectDB();
    db.transaction(populateDB, errorCB, successCB);
});

function connectDB(){
    var db = window.openDatabase("TimeNotes", "1.0", "TimeNotes DB", 2 * 1024 * 1024);
    return db;
}

function populateDB(tx) {
    //tx.executeSql('DROP TABLE IF EXISTS TimeNotes');
    tx.executeSql('CREATE TABLE IF NOT EXISTS TimeNotes (ID unique, Content text, AddDate text, AddTime text)');
    //tx.executeSql('INSERT INTO TimeNotes (id, data) VALUES (1, "First row")');
    //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

// Query the database
//
function queryDB(tx) {
    tx.executeSql('SELECT * FROM TimeNotes', [], querySuccess, errorCB);
}

// Query the success callback
//
function querySuccess(tx, results) {
    var len = results.rows.length;
    console.log("DEMO table: " + len + " rows found.");
    for (var i = 0; i < len; i++) {
        console.log("Row = " + i + " ID = " + results.rows.item(i).ID + " Data =  " + results.rows.item(i).Content);
        //alert("Row = " + i + " ID = " + results.rows.item(i).ID + " Data =  " + results.rows.item(i).Content);
        $("#notes").prepend(results.rows.item(i).Content + "<br/>" + results.rows.item(i).AddDate + results.rows.item(i).AddTime+ "<hr>");
    }
}

// Transaction error callback
//
function errorCB(err) {
    console.log("Error processing SQL: " + err.code);
}

// Transaction success callback
//
function successCB() {
    var db = connectDB();
    db.transaction(queryDB, errorCB);
}

function Insert(content) {
    var db = connectDB();
    db.transaction(function (tx) {
        var id = new Date().getTime();
        var adddate = new Date().toLocaleDateString();
        var addtime = new Date().toLocaleTimeString();
        tx.executeSql("INSERT INTO TimeNotes (ID, Content,AddDate,AddTime) values(?,?,?,?)", [id, content, adddate, addtime], null, null);
        $("#notes").prepend(content + "<br/>" + adddate + addtime + "<hr>");
    });
}

function Select() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM test", [],
         function (tx, result) {
             for (var i = 0; i < result.rows.length; i++) {
                 document.write('<b>' + result.rows.item(i)['mytitle'] + '</b><br />');
             }
         }, function () {
             alert("error");
         });
    });
}
