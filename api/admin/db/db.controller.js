
'use strict';

const config = require('../../../config/env.json')[process.env.NODE_ENV || 'development'];
const instance = require('../../axios')({
  baseURL: config['PROD_SERVER']
});
const user = require('../../../mongodb')('user');
const exec = require('child_process').exec;


module.exports = {
  add: add,
  get: get,
  getFullScoreList:getFullScoreList,
  buildcsv:buildcsv
};

const sumQuestion = 25;
const times =10;
const correctAnswer=[2,2,2,1,1,2,2,2,3,2,2,2,1,1,3,3,2,1,2,2,2,3,3,3,2];


function buildcsv(req, res){
  //  /usr/local/mongodbbin/mongoexport -d wj -c user -f name,tel,score,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,q15,q16,q17,q18,q19,q20,q21,q22,q23,q24,q25 --csv -o /User/wangyang/work/sh/wj/wen/user.csv
  exec('/root/mongodb-linux-x86_64-3.0.6/bin/mongoexport -d wj -c users -f name,tel,score,q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,q15,q16,q17,q18,q19,q20,q21,q22,q23,q24,q25 --type=csv -o /root/wj_node/public/user.csv', (error, stdout, stderr) =>{
///usr/local/mongodb/bin/mongoexport -d wj -c users --csv -f name,tel,score -o /User/wangyang/work/sh/wj/web/user.csv
    if(error){
      res.json({
        flag:1,
        msg:error
      })
    }
    else{
      res.json({
        flag:0
      })
    }
  })
}

function getFullScoreList(req,res){
  user.find({'score': 10 }, (err, result)=>{
    res.json({
      flag:0,
      data:result
    })
  })
}


function get(req, res){
  let sumArray =[];
  let selectArray = [];
  let count = sumQuestion;
  let selectAnswer =[];
  for(let i=1; i<=sumQuestion; i++){
    sumArray.push(i);
  }
  for(let j =0; j<times; j++){
    selectArray.push(+sumArray.splice(parseInt(Math.random()*(count)),1));
    count--;
  }

  selectArray.map((value,index)=>{
    selectAnswer.push(correctAnswer[value-1]);
  })

  res.json({
    question:selectArray,
    answer:selectAnswer
  })
}


// {
//   name:'',
//     tel:'',
//   question:[1,2,5,7,3],
//   answer:[1,4,6,23,45,6],
//
// }

function add(req, res){
  if(!req.body.name ||!req.body.tel){
    return res.json({
      flag:1,
      msg:"未输入姓名, 或者电话"
    })
  }
  let score = 0 ;
  let queryQ= {};
  let question = JSON.parse(req.body.question);
  let answer = JSON.parse(req.body.answer);
  question.map((value, index)=>{
    queryQ[`q${value}`] = answer[index];
      if(correctAnswer[value] == answer[index]){
        score++;
      }
  })


  let data ={
      name:req.body.name,
      tel:req.body.tel+"",
      score: score
    }
  data = Object.assign(data,queryQ);
  user.create(data, function(err, doc1){
      if(err) return res.json({
        flag:1,
        err:err
      });
      res.json({
        flag:0,
        data:{
          score:score,
          doc:doc1
        }
      });
  })
}