const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    
    const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN" так примерно выглядит, поэтому сплитим и забираем второй элемент
    if (!token) {
      return res.status(401).json({ message: 'Нет токена' })
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'))

    req.user = decoded

    next()

  } catch (e) {
    res.status(401).json({ message: 'Нет авторизации' })
  }

}