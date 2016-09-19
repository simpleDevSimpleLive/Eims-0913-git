/**
 * Created by mooner00 on 9/19/2016.
 */
// this file is only used for test. Have not insert into system.
// Please ignore this file when you need debug the whole application.



var db = require('./../comm/database');
var empDAO = require('./emp');
var dtLogicService = require('./../service/dtLogicService')

var sql = {
    insertColProgress: {
        name:'insertColProgress',
        text:'ALTER TABLE employee_info ADD COLUMN progress int;'
    },

    removeColpayrise_precentage:{
        name:'removeColpayrise_precentage',
        text:'ALTER TABLE employee_info DROP COLUMN payrise_precentage;',
    },

    updateEveryProgress:{
        name:"updateEveryProgress",
        text:"UPDATE employee_info SET progress = $1 where emp_id = $2"
    },

    removeCol_remibursement:{
        name:'removeCol_remibursement',
        text:'ALTER TABLE employee_info DROP COLUMN remibursement;',
    },


    removeCol_p_citty:{
        name:'removeCol_p_citty',
        text:'ALTER TABLE employee_info DROP COLUMN p_citty;',
    },

    checkTableColType:{
        name:'checkTableColType',
        text:"select column_name, data_type from information_schema.columns where table_name = 'employee_info';"

    },

    checkEduColType:{
        name:'checkTableColType',
        text:"select column_name, data_type from information_schema.columns where table_name = 'education_info';"

    },

    checkWorkColType:{
        name:'checkTableColType',
        text:"select column_name, data_type from information_schema.columns where table_name = 'work_info';"

    },

    checkColType:{
        name:'checkTableColType',
        text:"select column_name, data_type from information_schema.columns where table_name = $1;",
        values: 'order_info',
    }
}

//removeCol();
//updateProgress();
//checkTableColType();
checkTableColTypeBySql('order_info');

function removeCol(){
    db.queryPres(sql['removeCol_p_citty'], function (e, o) {
        if (e) {
            console.log(e);
        } else {
            console.log(o);
        }
    })
    //console.log();
}


function updateProgress(){
    dtLogicService.getAllBySql(function(e,o){
        if(o){
            o.rows.forEach(function(element,index){
                var id = element.emp_id;
                var progress = 0;
                progress =calculateProgress(element);
                console.log(progress);
                db.queryPresValue(sql['updateEveryProgress'],[progress,id],function(e,o){
                    if(e){
                        console.log(e);
                    }else{

                    }
                })

            })
        }else{
            console.log(e);
        }
    })
}

//
function calculateProgress(emp){
    var all = 0;
    var none = 0;
    for(value in emp){
        if(emp[value] == null){
            none ++;
        }
        all++;
    }
    return parseInt((all - none)/all * 100);
}


function insertCol() {
    db.queryPres(sql['insertColProgress'], function (e, o) {
        if (e) {
            console.log(e);
        } else {
            console.log(o);
        }
    })
}

function checkTableColType (){
    db.queryPres(sql['checkTableColType'], function (e, o) {
        if (e) {
            console.log(e);
        } else {
            console.log(o);
        }
    })
}

function checkTableColTypeBySql (tableName){
    sql['checkColType'].values = [tableName];
    db.queryPres(sql['checkColType'], function (e, o) {
        if (e) {
            console.log(e);
        } else {
            console.log(o);
        }
    })
}

