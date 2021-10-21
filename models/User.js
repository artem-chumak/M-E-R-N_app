const { Schema, model, Types } = require ('mongoose') // импортируем из монгуста

// создаем схему
const schema = new Schema({
  email: { type: String, required: true, unique: true, },
  password: { type: String, required: true, },
  links: [{ type: Types.ObjectId, ref: 'Link' }] // ссылка к моделе линков, тип Массив []
})

module.exports = model('User', schema) // экспортируем схему