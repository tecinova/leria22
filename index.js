'use strict';
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { google } = require('googleapis');
const axios = require('axios');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function Gravardados(agent) {
    const id = 2;
    const status = 'Ativo';
    const url = "https://sheet.best/api/sheets/b705ed6d-15e8-4399-a59c-f199971c5c76/tabs/cadastro";
    const { nome, telefone, email } = agent.parameters;

    const data = [{
      Nome: nome,
      Telefone: telefone,
      Email: email
    }];
    axios.post(url, data);
    
    agent.add(`Obrigada, seu pré-cadastro foi realizado com sucesso ✅ Agora basta aguardar o contato de nossa equipe.`);
  }

  function LerDados(agent) {
    var consulta = request.body.queryResult.parameters.consulta;
    return axios.get("https://sheet.best/api/sheets/b705ed6d-15e8-4399-a59c-f199971c5c76/tabs/cadastro").then(res => {
      res.data.map(coluna => {
        if (coluna.Id === consulta)
          response.json({
            "fulfillmentText": "Encontrei estes registros em nosso CRM:" + "\n" +
              "*Status*-" + coluna.Status + "\n" + "*Descrição*-" + coluna.Descricao
          });
      });
    });

  }

  let intentMap = new Map();
  intentMap.set('gravar', Gravardados);
  intentMap.set('ler', LerDados);
  agent.handleRequest(intentMap);
});
