const {MongoClient} = require('mongodb')
const TelegramApi = require('node-telegram-bot-api')

// const local = require('./local.json');

// const token = local.token

const client = new MongoClient('mongodb+srv://Sellentis:sellentis@sellentis-telegram-bot.9bhpv.mongodb.net/Sellentis-tg-bot?retryWrites=true&w=majority')

const token = "1806990129:AAFwG_rKrudokdZl5eQX7QcnlNN3771gQ8w"

const bot = new TelegramApi(token, {polling: true})


const start = async () => {

	bot.setMyCommands([
		{command: '/info', description: 'Информация'},
	])

	bot.on('message', async msg => {

		const text = msg.text;
		const chatId = msg.chat.id;
		const username = msg.chat.username

		if (text === '/start') {

			try {
				await client.connect()
				console.log("-----------Соединение установлено-----------")
				const users = client.db().collection('users')
				const chatIdDb = await users.findOne({id: chatId})
				if (chatIdDb) {

				}
				else {
					await users.insertOne({name: username, id: chatId})
				}
			}
			catch (e) {
				console.log(e)
			}

			return bot.sendMessage(chatId, `Привет, ${username}`)
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Меня зовут Селлентисс`)
		}
		console.log()
		return bot.sendMessage(chatId, `Я тебя не понимаю`)
	})

}

start()