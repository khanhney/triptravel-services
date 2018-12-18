const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });

manager.load('./model.nlp');

const CHATBOT_COLL = require('../database/chatbot-coll');

exports.chatBotKit = (message) => {
    return new Promise(async resolve=> {
        const response = await manager.process('en', message);
        const dataChat = new CHATBOT_COLL({ message: message, answer: response.answer });
        const saveChat = await dataChat.save();
        return resolve({ response });
    });
}