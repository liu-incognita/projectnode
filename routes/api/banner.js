let router = require('express').Router();
let mgdb = require('../../utils/mgdb');

//列表|详情
router.get('/',(req,res,next)=>{
  
  //获取id，有id 抓详情,没有id抓列表
  let _id = req.query._id;

  if(!_id){
    mgdb.find({
      collectionName:'banner',
      ...req.query
    }).then(
      result=>res.send(result)
    ).catch(
      err=>res.send(err)
    )
  }else{//抓详情
    mgdb.find({collectionName:'banner',_id:_id}).then(
      result=>res.send(result)
    ).catch(
      err=>res.send(err)
    )
  }
})

//详情
router.get('/:_id',(req,res,next)=>{
  mgdb.find({collectionName:'banner',_id:req.params._id}).then(
    result=>res.send(result)
  ).catch(
    err=>res.send(err)
  )
})



module.exports=router;