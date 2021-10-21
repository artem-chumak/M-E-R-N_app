const express = require('express') // подключаем express
const config = require('config') // подключаем конфиг, где храняться переменные
const path = require('path')
const mongoose = require('mongoose') // подключаем mongoose для работы с mongoDB

const authRouter = require('./routes/auth.routes') // импортирую роутер
const linkRouter = require('./routes/link.routes')

const app = express(); // будующий сервер

app.use(express.json({ extended: true })) //? кажется, что это для сборки пакетов, нужно будет проверить

// регистрируем роуты для API запросов
app.use('/api/auth', authRouter) // роутер аутентификации
app.use('/api/link', linkRouter) // роутер линков
app.use('/t', require('./routes/redirect.routs'))


// чтобы работал фронт и бек в одно время. НОДА за всё ответит)))
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000
const URI = config.get('mongooseUri')

// подключение к базе данных
// т.к. возвращается промис, то оборачиваем в async
async function start() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
//      useCreateIndex: true эта настройка не запустилась
    }); // если все хорошо, то подключаемся к серверу
    // а теперь запускаем
    app.listen(5000, ()=> { console.log(`App has been started on port >>> ${PORT} <<<`) }) // закпустили на порте 5000 и вывели сообщение
  } catch(e) {
    console.log('Server error >>>', e.message) // если будет ошибка то выведем ее и сообщение
    process.exit(1) // и закроем процесс, тут не понятно. (code: 1) пришлось убрать добавил ('code:1')
  }
}

start() // вызываем эту функцию

