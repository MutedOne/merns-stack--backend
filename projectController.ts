
import {querycache} from "./queryconcept"
const getProjects = (req:any,res:any) =>{
    let str =''
    const cachekey = 'getProjects:search:'+req.body.search
    if(req.body.search!=''){
        str=" where  (projectname like '%"+req.body.search+"%')"
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
     querycache(cachekey,'select * from (SELECT *, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM Project '+str+') as taskopt WHERE taskopt.rn>=? and  taskopt.rn<=? ORDER BY taskopt.rn ',[startItem,endItem])
     .then((done)=>{
        res.json(done) 
    })
}
const allProjects = (req:any,res:any) =>{
    
     querycache('','SELECT * from Project order by id desc',[])
     .then((done)=>{
        res.json(done) 
    })
}
const gettotalProjects = (req:any,res:any) =>{
    const cachekey = 'gettotalProjects:search:'+req.body.search
    let str =''

    if(req.body.search !='' && req.body.search!=undefined){
        str=" where (projectname like '%"+req.body.search+"%' )"
    }else{
        str=''
    }
     querycache(cachekey,'SELECT count(id) as total from Project '+ str,[])
    .then((done)=>{
        res.json(done[0].total) 
    })
}
const getProjid = (req:any,res:any) =>{
    return querycache('','SELECT * from Project where id=?',[req.query.id])
    .then((done)=>{
        res.json(done) 
    })
}

const getProjcust = (req:any,res:any) =>{
    return querycache('','SELECT * from CustomerEmail where proid=?',[req.query.id])
    .then((done)=>{
        res.json(done) 
    })
}
const getProjpp = (req:any,res:any) =>{
    return querycache('','select name from ( SELECT * from Projectpartcipants where projid=?) as pp left join Account on pp.userid = Account.id',[req.query.id])
    .then((done)=>{
        res.json(done) 
    })
    
}
export{
    getProjects,
    gettotalProjects,
    allProjects,
    getProjid,
    getProjcust,
    getProjpp
}