let jwt = require('jsonwebtoken');

module.exports = {
  sign: ({ username, id }) => {
    return jwt.sign({
      username,
      id,
    }, '1911md5', {
      expiresIn: 60 * 60 * 24 //过期时间  以秒计算
    })
  },
  verify: (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, '1911md5', (err, decode) => {
        if (!err) {
          resolve(decode)
        } else {
          // console.log('jwt',err.message)
          reject(err.message)
        }
      })
    })
  }
}

