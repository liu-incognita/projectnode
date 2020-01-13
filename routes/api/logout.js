let router = require('express').Router();

//注销  
//思想: session 需要一个注销接口，由服务端删除cookie和session
//思想2: token 后端可以不作为， 客户端删除token的信息，做一个跳转

//session 清除
router.delete('/',(req,res,next)=>{
  console.log('logout')

  // req.session.key = undefined

})
module.exports=router;