const {MongoClient} = require('mongodb')
const fetch = require("node-fetch")
const TelegramApi = require('node-telegram-bot-api')

// const local = require('./local.json');

// const token = local.token

const client = new MongoClient('mongodb+srv://Sellentis:sellentis@sellentis-telegram-bot.9bhpv.mongodb.net/Sellentis-tg-bot?retryWrites=true&w=majority')

const token = "1806990129:AAFwG_rKrudokdZl5eQX7QcnlNN3771gQ8w"

const bot = new TelegramApi(token, {polling: true})

const API_WEATHER = "48364d8a9ecebac5c043e4c9f94d08d0"

const start = async () => {

	bot.setMyCommands([
		{command: '/info', description: 'Информация'},
		{command: '/update', description: 'Обновить информацию о себе'},
		{command: '/weather', description: 'Узнать погоду на сегодня'}
	])

	bot.on('message', async msg => {

		const text = msg.text
		const chatId = msg.chat.id
		const username = msg.chat.username
		const firstName = msg.chat.first_name
		const lastName = msg.chat.last_name
		let today = new Date();
		let dd = String(today.getDate()).padStart(2, '0')
		let mm = String(today.getMonth() + 1).padStart(2, '0')
		let yyyy = today.getFullYear()
		today = mm + '/' + dd + '/' + yyyy;
		// console.log(msg)

		try {
			await client.connect()
			console.log("-----------Соединение установлено-----------")
		}
		catch (e) {
			console.log("-----------Соединение с БД не установлено-----------")
			return bot.sendMessage(chatId, `Бот временно недоступен`)
		}

		if (text === '/start') {
			try {

				const users = client.db().collection('users')
				const chatIdDb = await users.findOne({id: chatId})
				if (chatIdDb) {

				}
				else {
					await users.insertOne({name: username, id: chatId, firstName: firstName,
						lastName: lastName,
						lastActivity: today})
				}
			}
			catch (e) {
				console.log(e)
			}
			if (username) {
				return bot.sendMessage(chatId, `Привет, ${username}`)
			}
			else {
				return bot.sendMessage(chatId, `Привет, ${firstName}`)
			}
		}
		if (text === '/update') {
			try {
				const users = client.db().collection('users')
				const chatIdDb = await users.findOne({id: chatId})

				if (chatIdDb) {
					await users.updateOne({id: chatId}, {$set: {
							name: username,
							firstName: firstName,
							lastName: lastName,
							lastActivity: today
					}})
				}
				return bot.sendMessage(chatId, `Информация обновлена!`)
			}
			catch (e) {
				return bot.sendMessage(chatId, `Произошла какая-то ошибка, попробуй позже.`)
			}
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Меня зовут Селлентисс`)
		}
		if (text === '/weather') {
			city = "Sloviansk,ua"
			const api_url = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_WEATHER}&units=metric`)
			const data = await api_url.json()
			let temp = data.main.temp
			let weather = data.weather[0].main
			let weatherSmile
			switch (weather) {
				case "Clouds":
					weatherSmile = "☁️"
					break;
				case "Clear":
					weatherSmile = "☀️"
					break;
				case "Rain":
					weatherSmile = "🌧"
					break;
				case "Snow":
					weatherSmile = "🌨"
					break;
			}
			return bot.sendMessage(chatId, `Текущая температура по городу Славянск: ${Math.round(temp)} градуса ${weatherSmile}`)
		}
		console.log(msg)
		return bot.sendMessage(chatId, `Я тебя не понимаю`)
	})
}
start()