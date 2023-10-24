
import {querycache,deleteKeysByPattern} from "./queryconcept"

import file_system from 'node:fs'
import path from 'node:path'
const admz = require('adm-zip')
const excelJS = require("exceljs");
const {transporter} =require('./mailer.ts')


const getschedule = (req:any,res:any) =>{
    const cachekey ='getschedule:user='+req.body.user+':search:'+req.body.search+':page='+ (isNaN(req.body.page)?1:req.body.page)
    let str =''
    const page = req.body.page;
    const pageSize = 20; 
    let startItem, endItem;
    
    if (page === 1) {
        startItem = 1;
        endItem = 20;
    } else {
        startItem = (page - 1) * pageSize + 1;
        endItem = startItem + pageSize - 1;
    }
    if(req.body.search!=''){
        str=" AND (name like '%"+req.body.search+"%' or description like '%"+req.body.search+"%') "
    }else{
        str=''
    }
    // return querycache('','select name,description,id from taskscheduled WHERE (part COLLATE utf8mb4_bin LIKE \'%,1,%\' OR userid = 1) '+str+' AND rn <= '+20+' ORDER BY rn DESC LIMIT 20;')
    return querycache(cachekey,'SELECT task1.rn,task1.name, task1.description, task1.id FROM (SELECT name, description, id, projid, userid, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM task WHERE status=1 and donedate IS NULL AND date = CURRENT_DATE and userid =? '+str+') AS task1  left JOIN (SELECT projid FROM Projectpartcipants where userid =1) AS Projectpartcipants ON task1.projid = Projectpartcipants.projid WHERE task1.rn>=? and  task1.rn<=? ORDER BY task1.rn ',[req.body.user,startItem,endItem])
    ?.then((data)=>{
        res.json(data)
     
    })
}
const gettotalschedule = (req:any,res:any) =>{
    const cachekey ='gettotalschedule:user='+req.body.user+':search:'+req.body.search+':page='+ (isNaN(req.body.page)?1:req.body.page)
    let str =''
    if(req.body.search !='' && req.body.search!=undefined){
        str=" AND (name like '%"+req.body.search+"%' or description like '%"+req.body.search+"%')"
    }else{
        str=''
    }
    
     querycache(cachekey,' SELECT count(*) as total FROM (SELECT projid FROM task WHERE status=1 and donedate IS NULL AND date = CURRENT_DATE and userid =?'+str+' ) AS task1  LEFT JOIN (SELECT projid FROM  Projectpartcipants where userid =?  ) AS Projectpartcipants  ON task1.projid = Projectpartcipants.projid',[req.body.user,+req.body.user])
    ?.then((data)=>{
        res.json(data[0].total)
    })
}

const getDone = (req:any,res:any) =>{
    const cachekey ='getDone:user='+req.body.user+':search:'+req.body.search+':page='+ (isNaN(req.body.page)?1:req.body.page)
    let str =''
    
    if(req.body.search !=undefined ){
        str=" AND (name like '%"+req.body.search+"%' or description like '%"+req.body.search+"%') "
    }else{
        str=''
    }
    const pageSize = 20; 
    let startItem, endItem;
    const page = req.body.page;
    if (page === 1) {
        startItem = 1;
        endItem = 20;
    } else {
        startItem = (page - 1) * pageSize + 1;
        endItem = startItem + pageSize - 1;
    }
    return querycache(cachekey,'SELECT task1.name,task1.rn, task1.description, task1.id FROM (SELECT name, description, id, projid, userid, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM task WHERE donedate is not null and userid =? '+str+') AS task1  left JOIN (SELECT projid FROM Projectpartcipants where userid =1) AS Projectpartcipants ON task1.projid = Projectpartcipants.projid WHERE task1.rn>=? and  task1.rn<=? ORDER BY task1.rn ',[req.body.user,startItem,endItem])
    ?.then((data)=>{
        res.json(data)
     
    })
}


const gettotaldone = (req:any,res:any) =>{
    const cachekey ='gettotaldone:user='+req.body.user+':search:'+req.body.search+':page='+ (isNaN(req.body.page)?1:req.body.page)
    let str =''
  
    if(req.body.search !='' && req.body.search!=undefined){
        str=" AND (name like '%"+req.body.search+"%' )"
    }else{
        str=''
    }
    querycache(cachekey,' SELECT count(*) as total FROM (SELECT projid FROM task WHERE donedate is not null and userid =? '+str+' ) AS task1  LEFT JOIN (SELECT projid FROM  Projectpartcipants where userid =?  ) AS Projectpartcipants  ON task1.projid = Projectpartcipants.projid',[req.body.user,+req.body.user])
    ?.then((data)=>{
        res.json(data[0].total)
    })
}

// const updateUser = (req:any,res:any) =>{
   
//     return db.none('UPDATE "Task" set name=${name} WHERE id=${id}' ,req.body)
//     .then((data) => {
       
        
//         // res.redirect("/aasda")
//     })
  
// }


const getPrio = (req:any,res:any) =>{
    const cachekey ='getPrio:user='+req.body.user+':search:'+req.body.search+':page='+ (isNaN(req.body.page)?1:req.body.page)
    let str =''
   
    if(req.body.search !=undefined){
        str=" AND (name like '%"+req.body.search+"%' )"
    }else{
        str=''
    }

    const page = req.body.page;
    const pageSize = 20; 
    let startItem, endItem;
       
       if (page === 1) {
           startItem = 1;
           endItem = 20;
       } else {
           startItem = (page - 1) * pageSize + 1;
           endItem = startItem + pageSize - 1;
       }
    return querycache(cachekey,'SELECT task1.name,task1.rn, task1.description, task1.id FROM (SELECT name, description, id, projid, userid, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM task WHERE donedate is  null and status=3 and userid =? '+str+') AS task1  left JOIN (SELECT projid FROM Projectpartcipants where userid =1) AS Projectpartcipants ON task1.projid = Projectpartcipants.projid WHERE task1.rn>=? and  task1.rn<=? ORDER BY task1.rn ',[req.body.user,startItem,endItem])
    ?.then((data)=>{
        res.json(data)
     
    })
}
const gettotalPrio = (req:any,res:any) =>{
    const cachekey ='gettotalPrio:user='+req.body.user+':search:'+req.body.search+':page='+ (isNaN(req.body.page)?1:req.body.page)
    let str =''
  
    if(req.body.search !='' && req.body.search!=undefined){
        str=" AND (name like '%"+req.body.search+"%' )"
    }else{
        str=''
    }
     querycache(cachekey,' SELECT count(*) as total FROM (SELECT projid FROM task WHERE donedate is  null and status=3 and userid =?'+str+' ) AS task1  LEFT JOIN (SELECT projid FROM  Projectpartcipants where userid =?  ) AS Projectpartcipants  ON task1.projid = Projectpartcipants.projid',[req.body.user,+req.body.user])
   ?.then((data)=>{
    res.json(data[0].total)
})
}





const getDelay = async (req:any,res:any) =>{
    const cachekey ='getDelay:user='+req.body.user+':search:'+req.body.search+':page='+ (isNaN(req.body.page)?1:req.body.page)
    let str =''
   
    const page = req.body.page; // Assuming body.page contains the current page number

    const pageSize = 20; // Number of items per page
    
    let startItem, endItem;
    
    if (page === 1) {
        startItem = 1;
        endItem = 20;
    } else {
        startItem = (page - 1) * pageSize + 1;
        endItem = startItem + pageSize - 1;
    }

    if(req.body.search !=''){
        str=" AND (name like '%"+req.body.search+"%' )"
    }else{
        str=''
    }
     querycache(cachekey,'SELECT task1.name, task1.description, task1.id,task1.rn FROM (SELECT name, description, id, projid, userid, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM task WHERE donedate is  null  and date<CURRENT_DATE and userid =? '+str+') AS task1  left JOIN (SELECT projid FROM Projectpartcipants where userid =1) AS Projectpartcipants ON task1.projid = Projectpartcipants.projid WHERE task1.rn>=? and  task1.rn<=? ORDER BY task1.rn ',[req.body.user,startItem,endItem])
     ?.then((data)=>{
        res.json(data)
    })
}
const gettotaldelay = (req:any,res:any) =>{
    const cachekey ='gettotaldelay:user='+req.body.user+':search:'+req.body.search+':page='+ (isNaN(req.body.page)?1:req.body.page)
    let str =''
  
    if(req.body.search !='' && req.body.search!=undefined){
        str=" AND (name like '%"+req.body.search+"%')"
    }else{
        str=''
    }
    
     querycache( cachekey,' SELECT count(*) as total FROM (SELECT projid FROM task WHERE donedate is  null  and date<CURRENT_DATE and userid =? '+str+' ) AS task1  LEFT JOIN (SELECT projid FROM  Projectpartcipants where userid =?  ) AS Projectpartcipants  ON task1.projid = Projectpartcipants.projid',[req.body.user,+req.body.user])
  ?.then((data)=>{
    res.json(data[0].total)
})
}




const getdashboard = (req:any,res:any) =>{
    return {name:"test"}

}

const download =  (req:any,res:any) =>{
   
    if (file_system.existsSync(path.join(__dirname, '..', 'public/task/'+req.query.id))) {
        var to_zip = file_system.readdirSync(path.join(__dirname, '..', 'public/task/'+req.query.id+'/'))
        // Directory exists, so you can read its contents
    
        const zp = new admz();
        to_zip.forEach((item,index)=>{
            zp.addLocalFile(path.join(__dirname, '..', 'public/task/'+req.query.id+'/'+item))
        })
        const file_after_download = 'downloaded_file.zip';
         const data = zp.toBuffer();
         return new Response( data
            , {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition':`attachment; filename=${file_after_download}`,
                    'Content-Length': data.length
                }
            });
      } else {
        console.error('The directory does not exist:', path.join(__dirname, '..', 'public/task/'+req.query.id));
        return []
      
      }

}

const toexcel = (req:any,res:any) =>{
    var str =''
    if(req.query.status =='delay'){
        str='select name,description,date,donedate from task where donedate is  null and status!=2 and date<CURRENT_DATE'
    }else if (req.query.status =='done') {
        str='select name,description,date,donedate  from task where donedate is not null'

    }else if (req.query.status =='priority') {
        str='select name,description,date,donedate  from task where donedate is  null and status=3'
    }else if (req.query.status =='scheduled') {
        str='select name,description,date,donedate  from task where status=1  AND  donedate is  null and date=CURRENT_DATE'
    }
    
    return querycache('',str,[])?.then((data)=>{
       
        return data
    })
 }
 
const updateApprove = (req:any,res:any) =>{
   
     querycache('','INSERT INTO TaskApprove (taskid, userid, applevel, date) VALUES (?,?,?, DATE_FORMAT(NOW(), \'%Y-%m-%d %H:%i:%s\'));',[req.body.id,req.body.userid,req.body.applevel])
    ?.then((data)=>{
        if(req.body.lastapp != 'yes'){
           
             querycache('','SELECT userid FROM Projectpartcipants WHERE appnum=?',[parseInt(req.body.applevel +1)]).then((data1)=>{

                let emailarr:any = []
                data1.forEach((e:{email:string}) =>{
                    emailarr.push(e.email) 
                })
              
                transporter.sendMail({
                    from: "stephenrabor@gmail.com",
                   to: emailarr,
                   subject: 'Approve on task '+req.body.id + " by "+ req.body.user,
                   text:  req.body.applevel ==0?"Assigned Task Approved": req.body.lastapp == 'yes'?"Final Approved":"Approved "+ req.body.applevel
               }, function(error:any, info:any){
                   if (error) {


                   console.log(error );
                   } else {
                   console.log('Email sent: ' + info.response);
                   }
               });

               res.json({status:"Updated"})
            })
     
        }
 
        if(req.body.lastapp == 'yes'){
            deleteKeysByPattern('user='+req.body.userid)
            return querycache('','UPDATE Task set donedate=CURRENT_DATE WHERE id=?',[req.body.id])
        }
    })
}
const viewId = (req:any,res:any) =>{
    
    
     querycache('','SELECT task.name, task.description, task.date, Project.lapprove, Project.projectname, task.projid,Account.email FROM (select name,description,date,projid,userid from task where id=?) as task LEFT JOIN  (select email,id from Account) as Account ON task.userid = Account.id INNER JOIN  (select projectname,lapprove,id from Project) as Project ON task.projid = Project.id',[req.query.id])?.
    then((data)=>{
        res.json(data[0])
    })
 
}
const taskapprover = (req:any,res:any) =>{
     querycache('','SELECT Account.id, Account.name, Department.departmentname, TaskApprove.date, Role.rolename, TaskApprove.applevel FROM  (select date,applevel,taskid,userid from TaskApprove where taskid= ?) as TaskApprove  LEFT JOIN  (select id,name,roleid,deptid from Account) as Account ON Account.id = TaskApprove.userid LEFT JOIN Department ON Department.id = Account.deptid  LEFT JOIN  Role ON Role.id = Account.roleid ORDER BY  TaskApprove.applevel ASC;',[req.query.id])
     .then((data)=>{
        res.json(data)
    })
    }
 const approvelevel = (req:any,res:any) =>{
    if(req.query.appnum != 0){
       
         querycache('','Select * from Projectpartcipants where projid=? and appnum=? and userid=?',[req.query.id,req.query.appnum,req.query.useremail])
         .then((data)=>{
            res.json(data)
        })
    }else{
         querycache('','Select userid from task where id=?',[req.query.taskid])
         .then((data)=>{
            res.json(data)
        })
    }
  
}
export{
    viewId,
    download,

    getschedule,
    gettotalschedule,

    getDone,
    gettotaldone,
  
    getPrio,
    gettotalPrio,

    getDelay,
    gettotaldelay,

   

    getdashboard,
    toexcel,
    updateApprove,
    taskapprover,
    approvelevel
}