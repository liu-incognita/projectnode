let mongodb = require('mongodb');//1.引入模块
//2.创建客户端	
let mongoCt = mongodb.MongoClient;
let ObjectId = mongodb.ObjectId;


let mgdb = {

  open: function ({
    dbName,
    collectionName,
    url = 'mongodb://127.0.0.1:27017'
  }) {
    return new Promise((resolve, reject) => {
      mongoCt.connect(url, { useUnifiedTopology: true }, (err, client) => {
  
        if (err) {//err 链接失败后的信息
          console.log('库链接失败', err)
          reject(err)
        } else {//client 链接体
          //4. 链库 		
          let db = client.db(dbName);
  
          //5. 链接集合
          let collection = db.collection(collectionName);
  
          //6. 返回集合
  
          resolve({ collection, client, ObjectId })
  
        }
  
      })
    })
  },


  //查询  列表|详情
  find: function({ 
    collectionName, 
    dbName = "my1911", 
    _id = null, 
    _page,_limit,q,_sort 
  }){

    //检索规则，生成find 的条件 {}
    let rule = q ? { title: eval('/' + q + '/') } : {};

    return new Promise((resolve, reject) => {
      if (_id) {//有id 查详情
        mgdb.open({//链库
          dbName,
          collectionName
        }).then(
          ({ collection, client, ObjectId }) => {
            if(_id.length===24){//需要判断id的长度
              collection.find({
                _id: ObjectId(_id)//mongodb的id是一个ObjectId类型，字符需要被包装
              }, { projection: { _id: 0 } }).toArray((err, result) => {
                if(err){
                  reject({
                    err: 1,
                    mess: '集合操作失败1'
                  })
                  client.close()
                }
                resolve({
                  err: 0,
                  data: result[0]//详情页，需要返回一个对象便可
                })
                client.close()
              })
            }else{
              reject({
                err:1,
                mess:'id有误'
              })
            }
            
          }
        )
      } else {
        //查列表
        mgdb.open({
          dbName,
          collectionName
        }).then(
          ({ collection, client }) => {
            collection.find(rule, {
              projection: {}, //指定显示的列
              limit: _limit, //限定条数
              skip: _page * _limit, //跳过的条数
              sort: { [_sort]: 1 } //排序
            }).toArray((err, result) => {
              resolve({//对象->数组后 返回给promise的调用方
                err: 0,
                data: result
              })
              client.close()
            })
          }
        ).catch(
          err => {
            reject({
              err: 1,
              mess: '集合操作失败2'
            })
            client.close()
          }
        )
      }
    })


  }

  
}

module.exports = mgdb;

/* module.exports = ({
  dbName,
  collectionName,
  url='mongodb://127.0.0.1:27017'
}) => new Promise((resolve,reject)=>{
  mongoCt.connect(url, { useUnifiedTopology: true }, (err, client) => {

    if (err) {//err 链接失败后的信息
      // console.log('库链接失败', err)
      reject(err)
    } else {//client 链接体
      //4. 链库
      let db = client.db(dbName);

      //5. 链接集合
      let collection = db.collection(collectionName);

      //6. 返回集合

      resolve({collection,client,ObjectId})

    }

  })
}) */

/* module.exports = ({ dbName, collectionName, success, error, url='mongodb://127.0.0.1:27017' }) => {
  return new Promise((resolve,reject)=>{
    mongoCt.connect(url, { useUnifiedTopology: true }, (err, client) => {

      if (err) {//err 链接失败后的信息
        // console.log('库链接失败', err)
        reject(err)
      } else {//client 链接体
        //4. 链库
        let db = client.db(dbName);

        //5. 链接集合
        let collection = db.collection(collectionName);

        //6. 返回集合

        resolve({collection,client})

      }

    })
  })
} */


/* module.exports = ({ dbName, collectionName, success, error, url='mongodb://127.0.0.1:27017' }) => {

  //3.创建链接
  mongoCt.connect(url, { useUnifiedTopology: true }, (err, client) => {

    if (err) {//err 链接失败后的信息
      console.log('库链接失败', err)
      error && error(err)
    } else {//client 链接体
      //4. 链库
      let db = client.db(dbName);

      //5. 链接集合
      let collection = db.collection(collectionName);

      //6. 返回集合

      success && success({collection,client})

    }

  })

} */



