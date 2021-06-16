const TelegramApi = require('node-telegram-bot-api')

// const local = require('./local.json');

// const token = local.token

const token = "1806990129:AAFwG_rKrudokdZl5eQX7QcnlNN3771gQ8w"

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const gameOptions = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[{text: '1', callback_data: '1'},{text: '2', callback_data: '2'},{text: '3', callback_data: '3'}],
			[{text: '4', callback_data: '4'},{text: '5', callback_data: '5'},{text: '6', callback_data: '6'}],
			[{text: '7', callback_data: '7'},{text: '8', callback_data: '8'},{text: '9', callback_data: '9'}]
		]
	})
}

const start = () => {
	bot.setMyCommands([
		{command: '/info', description: 'Информация'},
		// {command: '/game', description: 'Сыграем?'}
	])

	bot.on('message', async msg => {

		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === '/start') {
			return bot.sendMessage(chatId, `Привет!`)
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Меня зовут Селлентисс`)
		}
		if (text === "/game") {
			await bot.sendMessage(chatId, `Я загадал цифру от 0 до 9, угадай ее`)
			const randomNumber = Math.floor(Math.random()*10)
			chats[chatId] = randomNumber;
			return bot.sendMessage(chatId, `Дело сделано, отгадывай!`, gameOptions)
		}
		return bot.sendMessage(chatId, `Я тебя не понимаю`)
		return bot.sendMessage(chatId, `${local}`)
	})

	bot.on('callback_query', async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data === chats[chatId]) {
			return await bot.sendMessage(chatId, `Ты выбрал цифру ${data}. И ты угадал!`)
		}
		else {
			return await bot.sendMessage(chatId, `Ты не угадал =( попробуй еще раз, бот загадал ${chats[chatId]}`)
		}
	})
}

start()