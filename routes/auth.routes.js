// роутер
const { Router } = require('express') // подключаем роутер из экспреса
const config = require('config')
const bcrypt = require('bcryptjs') // подключаем модуль шифрования
const jwt = require('jsonwebtoken') // подключаем модуль jwt
const { check, validationResult } = require('express-validator') // подключаем пакет для валидации
const User = require('../models/User') // импортировали модель пользователя
const router = Router()

// /api/auth - это то, что уже есть, но мы можем дописать 
// /register Первый параметр
// второй параметр функция логики обработки запроса
// 

// запрос POST, но могут быть и другие.

router.post(
  '/register', // добавляем массив мидлверов для валидации полей запроса
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req) //! а тут можно/нужно написать await
 
    if(!errors.isEmpty()) {
      return res.status(400).json({ message:'Некоректные данные при регистрации', errors: errors.array() })
    }
    const { email, password } = req.body
    // нужно проверить есть ли такой пользователь уже в системе
    const candidate = await User.findOne({ email })
    if (candidate) {
      return res.status(400).json({ message: 'Такой пользователь уже есть' }) // если пользователь уже есть
    }

    const hashedPassword = await bcrypt.hash(password, 12) // шифрую пароль, ждем

    const user = new User ({ email, password: hashedPassword }) // создаем пользователя и передаем параметры
    await user.save() // ждем пока пользователь сохраняется
    res.status(201).json({ message: 'Пользователь создан' }) // отправляем статус и сообщение
    
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
  }
})

router.post('/login',
[
  check('email', 'Введите корректный email').normalizeEmail().isEmail(),
  check('password', 'Введите пароль').exists()
],
async (req, res) => {
  try {
    const errors = validationResult(req) //! а тут можно/нужно написать await

    if(!errors.isEmpty()) {
      return res.status(400).json({ message:'Некоректные данные при входе в систему', errors: errors.array() })
    }

    const { email, password } = req.body
// нужно проверить есть ли такой пользователь уже в системе
    const user = await User.findOne({ email }) 
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' }) // если пользователь не найден
    }

    const isMatch = await bcrypt.compare(password, user.password) // проверяем пароль
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '24h' }
    )

    res.json({ token, userId: user.id })
    
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" })
  }
})

module.exports = router // экспортировал роутер