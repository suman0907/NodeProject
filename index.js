const mysql = require('mysql');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const chalk = require('chalk')


// mysql connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'student'
});

db.connect(function(err){
    if(!err)
    console.log("db connection establised");
    else
    console.log("db connection failed"+JSON.stringify(err));
});


// express server connection
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log(chalk.redBright("Example app listening at http://%s:%s", host, port))
 })



// body parser for JSON data
app.use(bodyParser.json());



// API to fetch all the data
app.get('/student_info',function(req,res){

    db.query('select * from basicInfo',function(err,fields){
        if(!err)
        res.send(fields);
        else
        console.log(err);


    });

});

// API to get student by id
app.get('/get_a_student',function(req,res){
    const id = req.query.id;
    const sql = 'select * from basicInfo where enrollment=?';
    db.query(sql,[id],function(err,fields){
        if(!err)
        res.send(fields);
        else
        console.log(err);

    });

});

// API to add student data
app.post('/add_student_data',function(req,res){
    const data = req.body;
    const sql = 'insert into basicInfo (name,enrollment,age) values (?,?,?)';
    db.query(sql,[data.name,data.enrollment,data.age],function(err,fileds){
        if(!err)
        res.send("student added suceesfully");
        else
        console.log(err);

    });
   
})

// API to alter table and adding columns
app.get('/alter_table',function(req,res){
    const sql='alter table basicInfo add column joining_year int';
    db.query(sql,function(err,fields){
        if(!err)
        res.send("column added to the table");
        else
        console.log(err);

    });

});

// API to get distinct data of any field
app.get('/get_distinct_data',function(req,res){
    const c=req.query.column;
    console.log(c);
    const sql ='select distinct age from basicInfo';
    db.query(sql,function(err,fields){
        if(!err)
        res.send(fields);
        else
        console.log(err);

    })

});

// API to delete any record from student table
app.delete('/delete_any_record',function(req,res){
    const id = req.query.id;
    const sql ='delete from basicInfo where enrollment=?';
    db.query(sql,[id],function(err,fields){
        if(!err)
        res.send("record deleted successfully");
        else
        console.log(err);
    });    
});

// API to get the maximum of any field
app.get('/get_max',function(req,res){
     const sql ='select max(age) As MaxAge from basicInfo';
     db.query(sql,function(err,fields){
         if(!err)
         res.send(fields);
         else
         console.log(err);
     });
});

// API for wildcard searches
app.get('/search_name',function(req,res){
    const sql ='select * from basicInfo where name like "a%" ';
  
    db.query(sql,function(err,fields){
        if(!err)
        res.send(fields);
        else
        console.log(err);

    });
});


// API to update student data
app.post('/update_student',function(req,res){
    const data =req.body;
    const sql ='update basicInfo set joining_year=?, year=? where enrollment=?';
    db.query(sql,[data.joining_year,data.year,data.id],function(err,fields){
        if(!err)
        res.send("Data updated successfully");
        else
        console.log(err);

    });

});

// API for range query
app.get('/range_query',function(req,res){
    const range1=req.query.range1;
    const range2=req.query.range2;
    const sql='select name from basicInfo where age in (?,?)';
    db.query(sql,[range1,range2],function(err,fields){
        if(!err)
        res.send(fields);
        else
        console.log(err);
    })
})
// ************************************************************************************************

// API for another table
app.get('/add_key',function(req,res){
    const sql ='alter table GradeReport add foreign key (studentId) references basicInfo(enrollment)';
    db.query(sql,function(err,fields){
        if(!err)
        res.send("foreign key added");
        else
        console.log(err);

    });
});

app.post('/add_semester_report',function(req,res){
    const data = req.body;
    const sql ='insert into GradeReport (id,semId,sgpa,cgpa,studentId) values (?,?,?,?,?)';
    db.query(sql,[data.id,data.semId,data.sgpa,data.cgpa,data.studentId],function(err,fields){
        if(!err)
        res.send("semester wise data added successfully");
        else
        console.log(err);

    });
});

app.get('/get_all_sem_report',function(req,res){
    const sql='select * from GradeReport';
    db.query(sql,function(err,fields){
        if(!err)
        res.send(fields);
        else
        console.log(err);
    });

});

app.get('/get_sem_wise_result',function(req,res){
    const sem = req.query.sem;
    const sql ='select * from GradeReport where semId=? ';
    db.query(sql,[sem],function(err,fields){
        if(!err)
        res.send(fields);
        else
        console.log(err);
    });
});

// API for joins
app.get('/get_semwise_result_of_particular_year',function(req,res){
    const year=req.query.year;
    const sem=req.query.sem;
    const sql ='select basicInfo.name, basicInfo.enrollment from basicInfo, GradeReport where  basicInfo.enrollment=GradeReport.studentId and  basicInfo.year=? and GradeReport.semId=? ';
    db.query(sql,[year,sem],function(err,fields){
        if(!err)
        res.send(fields);
        else
        console.log(err);
    });

});







