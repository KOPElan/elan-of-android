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
}

// Query the database
//
function queryDB(tx) {
    tx.executeSql('SELECT * FROM TimeNotes order by id asc LIMIT 35', [], querySuccess, errorCB);
}

// Query the success callback
//
function querySuccess(tx, results) {
    var len = results.rows.length;
    console.log("DEMO table: " + len + " rows found.");
    for (var i = 0; i < len; i++) {
        //console.log("Row = " + i + " ID = " + results.rows.item(i).ID + " Data =  " + results.rows.item(i).Content);
        //alert("Row = " + i + " ID = " + results.rows.item(i).ID + " Data =  " + results.rows.item(i).Content);
        addNote(results.rows.item(i).ID, results.rows.item(i).Content, results.rows.item(i).AddTime, results.rows.item(i).AddDate, $("#notes"));
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

//插入数据库记录
function Insert(content) {
    var db = connectDB();
    db.transaction(function (tx) {
        var id = new Date().getTime();
        var adddate = new Date().toLocaleDateString();
        var addtime = new Date().toLocaleTimeString();
        tx.executeSql("INSERT INTO TimeNotes (ID, Content,AddDate,AddTime) values(?,?,?,?)", [id, content, adddate, addtime], null, null);
        addNote(id, content, addtime, adddate, $("#notes"));
    });
}

//查询数据库记录
function Select(query, obj) {
    var db = connectDB();
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM TimeNotes "+query, [],
         function (tx, results) {
             for (var i = 0; i < results.rows.length; i++) {
                 //document.write('<b>' + result.rows.item(i)['mytitle'] + '</b><br />');
                 addNote(results.rows.item(i).ID, results.rows.item(i).Content, results.rows.item(i).AddTime, results.rows.item(i).AddDate,obj);
             }
         }, function () {
             alert("error");
         });
    });
}

//删除数据库记录
function delNote(id) {
    var db = connectDB();
    db.transaction(function (tx) {
        tx.executeSql("delete from TimeNotes where ID="+id);
    });
}


function addNote(id, content, addtime, adddate,obj) {
    var note = $("<div class='notelist' id='" + id + "'><div class='notedate'>" + adddate + "   " + addtime + "</div><div class='notetext'>" + content + "</div></div>");
    $(obj).prepend(note);
    $(note).bind("taphold",
            function (event) {
                if (confirm("删除本条笔记？")) {
                    delNote(id);
                    $(this).remove();
                }
            });
}