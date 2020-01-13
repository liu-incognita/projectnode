let router = require('express').Router();
let open = require('../../utils/mgdb').open;
let jwt = require('../../utils/jwt')

router.get('/', (req, res, next) => {

  //1.获取token
  let token = req.headers.token || req.body.token || req.query.token;

  //2 校验token
  jwt.verify(token).then(
    decode => {//成功
      // console.log('token',decode)

      //抓取用户信息

      open({//链接库
        dbName: 'my1911',
        collectionName: 'users'
      }).then(
        ({ collection, client, ObjectId }) => {
          //查询
          collection.find({
            username: decode.username, _id: ObjectId(decode.id)
          }, {}).toArray((err, result) => {//obj->arr

            if (err) {
              res.send({ err: 1, msg: '集合操作失败3' })
            } else {

              //3. 判断用户是否存在，存在数组的长度就有了
              if (result.length > 0) {

                delete result[0].username;
                delete result[0].password;

                res.send({ err: 0, msg: '登录成功', data: result[0] });//返回的数据是个对象

              } else {
                res.send({ err: 1, msg: '登录失败' });//返回的数据是个对象
              }

            }
            client.close()

          })

        }
      )

    }
  ).catch(
    message => res.send({
      err: 1,
      msg: '未登录'
    })
  )

  //2. 兜库 校验


})
module.exports = router;