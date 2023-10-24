import {querycache} from "./queryconcept"
const login = (req: any, res: any) => {
   
    querycache('','select * from Account where username=? and password=?',[req.body.username,req.body.password])
    ?.then((data)=>{
      if(data.length!=0){
        // if(data[0].status == 1){
          res.json(data[0]) 
        // }else{
        //  res.send({status:'Account is not active'})
        // }
      }else{
         res.send({status:'No Account'})
      }
    }) 
  }

export {
    login
}