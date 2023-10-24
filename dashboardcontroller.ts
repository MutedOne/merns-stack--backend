
import {querycache} from "./queryconcept"
const topAch = (req:any,res:any) =>{
  querycache('topAch:',  'SELECT Account.id, Account.name, Department.departmentname, Role.rolename, COUNT(*) as total FROM ( SELECT userid FROM task WHERE donedate IS NOT NULL AND task.donedate BETWEEN DATE_FORMAT(CURDATE(), \'%Y-%m-01\')  AND DATE_ADD(DATE_FORMAT(CURDATE(), \'%Y-%m-01\'), INTERVAL 1 MONTH) ) AS task LEFT JOIN Account ON Account.id = task.userid LEFT JOIN Department ON Department.id = Account.deptid LEFT JOIN Role ON Role.id = Account.roleid GROUP BY Account.id, Account.name, Department.departmentname, Role.rolename ORDER BY total LIMIT 3;',[])
 .then((data)=>{
  res.json(data)
 })
}
const projectStatus = (req:any,res:any) =>{
   querycache( 'projectStatus:',  'SELECT Project.projectname, Project.id, SUM(COALESCE(finished, 0) - COALESCE(unfinished, 0)) AS total FROM ( SELECT COUNT(task.projid) AS finished, task.projid  FROM task WHERE donedate IS NOT NULL GROUP BY task.projid order by projid desc limit 3 )  AS test LEFT JOIN  (SELECT COUNT(task.projid) AS unfinished, task.projid FROM task WHERE donedate IS NULL GROUP BY task.projid order by projid desc limit 3 ) AS test1 ON test.projid = test1.projid LEFT JOIN Project ON test.projid = Project.id GROUP BY Project.id, Project.projectname;',[])
  .then((data)=>{
    res.json(data)
   })
}
const projectView = (req:any,res:any) =>{

   querycache('projectView:user:'+req.query.user+':projid'+req.body.projid,' SELECT SUM(CASE WHEN task.status = 1 AND task.donedate IS NOT NULL THEN 1 ELSE 0 END) AS totaldone,  SUM(CASE WHEN task.status = 1 AND task.donedate IS NULL and date =  Current_date  THEN 1 ELSE 0 END) AS totalsched, SUM(CASE WHEN task.status = 3 THEN 1 ELSE 0 END) AS totalprio,SUM(CASE WHEN task.donedate IS NULL and date <  Current_date THEN 1 ELSE 0 END) AS totaldelay FROM task WHERE projid = ?',[req.body.projid])
   .then((data)=>{
    res.json(data)
   })
}

export{
    topAch,
    projectStatus,
    projectView,
 
}