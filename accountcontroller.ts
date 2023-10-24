import { deleteKeysByPattern, querycache } from "./queryconcept"
import {transporter} from './mailer'

const getAccount = (req:any,res:any) =>{
    let str =''
    const cachekey = 'getAccount:search:'+req.body.search
    if(req.body.search !=undefined || req.body.search !=''){
        str= " where (Account.name like '%"+req.body.search+"%' or Account.username like '%"+req.body.search+"%' or Department.departmentname like '%"+req.body.search+"%' or Role.rolename like '%"+req.body.search+"%')"
       
    }else{
        str=''
    }
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
     querycache(cachekey,'SELECT * FROM (SELECT  Account.id, username,name, Department.departmentname,Role.rolename, ROW_NUMBER() OVER (ORDER BY Account.id DESC) AS rn FROM  ( SELECT id, deptid, roleid,username, name FROM   Account ) AS Account LEFT JOIN  Department   ON Department.id = Account.deptid LEFT JOIN   Role  ON  Role.id = Account.roleid '+str+') AS taskopt WHERE taskopt.rn>=? and  taskopt.rn<=? ORDER BY taskopt.rn ',[startItem,endItem])
     ?.then((data)=>{
        res.json(data)
    })
    }

const gettotalaccount = (req:any,res:any) =>{
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
    const cachekey = 'gettotalaccount:search:'+req.body.search
    if(req.body.search !='' && req.body.search!=undefined){
        str= " where (Account.name like '%"+req.body.search+"%' or Account.username like '%"+req.body.search+"%' or Department.departmentname like '%"+req.body.search+"%' or Role.rolename like '%"+req.body.search+"%')"
    }else{
        str=''
    }
 querycache(cachekey,'SELECT count(*) as total FROM (SELECT  Account.id FROM ( SELECT id, deptid, roleid,username, name FROM   Account ) AS Account LEFT JOIN  Department   ON Department.id = Account.deptid LEFT JOIN   Role  ON  Role.id = Account.roleid '+str+') AS taskopt ',[])
 ?.then((data)=>{
    res.json(data[0].total)
})

}

const getDepartmentList = (req:any,res:any) =>{
    const cachekey = 'getDepartmentList:'
     querycache(cachekey,' SELECT * from Department',[])
     ?.then((data)=>{
        res.json(data)
    })
}
const allemp = (req:any,res:any) =>{
    const cachekey = 'allemp:'
    return querycache(cachekey,'SELECT id,email from Account',[])
}
const getRoleList = (req:any,res:any) =>{
    // const cachekey = 'getRoleList:'
     querycache('','SELECT * from Role where deptid=?',[req.body.deptId])
     ?.then((data)=>{
        res.json(data)
    })
}
const addAccount = (req:any,res:any) =>{
    // deleteKeysByPattern('user='+req.body.userid)
    return querycache('','INSERT INTO Account (username, name,deptid,roleid,password,email) VALUES (?,?,?,?,md5(?),?)',[req.body.username,req.body.name,req.body.deptid,req.body.roleid,req.body.password,req.body.email])
    ?.then((data)=>{
        deleteKeysByPattern('*Account:*')
        transporter.sendMail({
            from: "delikad1o2023@gmail.com",
            to: req.body.email,
            subject: 'Credentials',
            text: 'Your now have your credentials to login'
          }, function(error:any, info:any){
            if (error) {
         
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
         return data
    }) 
}

export{
    getAccount,
    gettotalaccount,
    getDepartmentList,
    allemp,
    getRoleList,
    addAccount
}