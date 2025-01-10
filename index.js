// const express = require('express');
 const { Telegraf } = require('telegraf');
const axios = require('axios');
 require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
// bot.start((ctx)=>ctx.reply('Welcome'))
// API for translation
const translate = async (text) => {
    try {
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'ar', // Source language (Arabic)
                tl: 'en', // Target language (English)
                dt: 't',
                q: text,
            },
        });

        // The translation result is in the first element of the response array
        const translatedText = response.data[0][0][0];
        return translatedText;
    } catch (error) {
        console.error(error);
        return 'Error: Unable to translate.';
    }
};

const getSynonyms = async (word, topic = '') => {
    try {
        const response = await axios.get('https://api.datamuse.com/words', {
            params: {
                rel_syn: word, // Find synonyms
                topics: topic, // Provide a topic for better results
            },
        });

        if (response.data.length === 0) {
            return `No synonyms found for "${word}".`;
        }

        // Extract synonyms from the response
        var result='\u202Aمرادفات الكلمة :\u202C \n';
        const synonyms = response.data.map((item) =>result+=item.word+"\n");
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        return 'Error: Unable to fetch synonyms.';
    }
};

// Bot command
bot.start((ctx) => ctx.reply('\u202A' +'المبرمج هاني يرحب بكم! أرسل لي كلمة عربية لترجمتها إلى الإنجليزية'+ "\u202C"));

bot.on('text', async (ctx) => {
    const word = ctx.message.text;
    const translation = await translate(word);
    ctx.reply(`${translation} \u202A:الترجمة \u202C`);
    const synonyms=await getSynonyms(translation);
    ctx.reply(synonyms);
});




bot.launch();

// // Keep the bot alive using Express
// const app = express();
// app.get('/', (req, res) => res.send('Bot is running!'));
// app.listen(3000, () => console.log('Express server running...'));