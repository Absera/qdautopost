require('dotenv').config()
const {Telegraf} = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
const ChannelUsername = process.env.CHANNEL_USERNAME

bot.start((ctx) => {
    ctx.reply('Started! /help -- help')
})

bot.help((ctx) => {
    ctx.reply('/t, /test --- testin\n/p, /post --- to post')
})

bot.settings((ctx) => {

})

bot.command(['test', 't'], (ctx) => {
    ctx.reply("The bot is up and running!")
})

bot.command(['post', 'p'], (ctx) => {
    try {
        let newTextMessage = ctx.message.text
        let newTextMessageArray = newTextMessage.split(' ')
        if (newTextMessageArray.length > 1) {
            let commandRemovedMessage = newTextMessageArray.slice(1).join(' ')
            let newPostArray = commandRemovedMessage.split('\n\n')

            if (newPostArray.length >= 3) {
                let question = newPostArray.slice(0, 1)[0]
                let options = newPostArray.slice(1, 2)[0].split(' .. ')
                let answer = newPostArray.slice(2, 3)[0]
                let explanation = newPostArray.slice(3, 4)[0]

                if (question && options && answer) {
                    ctx.telegram.sendQuiz(
                        ChannelUsername,
                        question,
                        options,
                        {
                            correct_option_id: answer - 1,
                            explanation: explanation
                        }
                    ).then((response) => {
                        ctx.reply('Poll Sent: ' + response.poll.id)
                    }, (err) => {
                        ctx.reply(err.message)
                    })
                } else {
                    sendRequired(ctx)
                }
            } else {
                sendRequired(ctx)
            }
        } else {
            sendRequired(ctx)
        }
    } catch (e) {
        ctx.reply(e.message)
    }
})

function sendRequired(ctx) {
    ctx.reply('Send all required fields!')
}


bot.launch()
