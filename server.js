const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':method Request :url status code :status  res-time :response-time ms'));


let mentors_list = [];
let students_list = [];
let mentorId = 0;
let studentId = 0;


app.post('/create-mentor', (req,res) => {
    const rd = req.body;

    if ((rd['name'] == '') || (rd['age'] == '') || (rd['subject'] == '') || (rd['email']) == ''){
        res.status(400).json({
            message: "Missing Details"
        })
    }

    else{
        mentors_list.push({
            id: mentorId++,
            name: rd['name'],
            age: rd['age'],
            subject: rd['subject'],
            email: rd['email'],
            students: []
        })

        res.status(200).json({
            message: "Mentor Created Successfully!"
        })
    }

})



app.post('/create-student', (req,res) => {
    const rd = req.body;

    if ((rd['name'] == '') || (rd['age'] == '') || (rd['subject'] == '') || (rd['email']) == ''){
        res.status(400).json({
            message: "Missing Details"
        })
    }

    else{
        students_list.push({
            id: studentId++,
            name: rd['name'],
            age: rd['age'],
            subject: rd['subject'],
            email: rd['email'],
            mentor: "NONE"
        })

        res.status(200).json({
            message: "Student Created Successfully!"
        })
    }

})


app.post('/student-mentor-assign', (req,res) => {

    let rd = req.body;
    
    if (rd['id'] == undefined || rd['students'].length == 0){
        res.status(400).json({
            message: "Please Create a mentor and a student to assign"
        })
    }
    else{
        let id = rd['id'];
        for(let student_id of rd['students']){
            students_list[student_id].mentor = JSON.parse(JSON.stringify(mentors_list[id]));
            mentors_list[id]['students'].push(JSON.parse(JSON.stringify(students_list[student_id])));
        }
        res.status(200).json({
        message: 'Successfully assigned a Student to a Mentor!'
        })
    }
})


app.post('/update-mentor', (req,res) => {
    let rd = req.body;
    if (rd['mentorId'] == undefined || rd['studentId'] === undefined){
        res.status(400).json({
            message: "Please select a student and a mentor to update"
        })
    }
    else{
        let mentor_id = rd['mentorId'];
        let student_id = rd['studentId'];
        
            if(students_list[student_id].mentor != ''){
                let prev_id = students_list[student_id].mentor['id']
                for (let i=0; i< mentors_list[prev_id]['students'].length; i++){
                    if(mentors_list[prev_id]['students'][i]['id'] == student_id){
                        mentors_list[prev_id]['students'].splice(i,1);
                        break;
                    }
                }
            }
       
           
            students_list[student_id].mentor = JSON.parse(JSON.stringify(mentors_list[mentor_id]));
            mentors_list[mentor_id]['students'].push(JSON.parse(JSON.stringify(students_list[student_id])))
    
           

            res.status(200).json({
                message: 'Successfully updated a Mentor to a Student!'
                })
    }
})


app.get('/students-list', (req,res)=>{
    res.json({students: students_list})
})
app.get('/mentors-list', (req,res)=>{
    res.json({mentors: mentors_list})
})

app.listen(port, () =>{
    console.log('port running at'+ port)
})