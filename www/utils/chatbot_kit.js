const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });

manager.load('./model.nlp');

function callModel() {
    return new Promise(async resolve=> {
        const response = await manager.process('en', 'Hello, I miss you');
        return resolve({ response });
    });
}

callModel()
    .then(resp => console.log({ resp }))
    .catch(err => console.log(err));