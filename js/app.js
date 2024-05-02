//import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

import {enableMasca} from "@blockchain-lab-um/masca-connector";

var mascaApi;
var address;

const successo = document.getElementById("success");
const error = document.getElementById("error");

const connetti = document.getElementById("connettiMasca");
connetti.addEventListener("click", async function() {

  mostraCaricamento();

  window.ethereum.request({
    method: 'eth_requestAccounts',
  }).then(async accounts => {
    address = accounts[0];

    const enableResult = await enableMasca(address);
    nascondiCaricamento();

    console.log("EnableResult " + enableResult.success);

    if (enableResult != null) {
      console.log("CONNESSO CON API");
    } else {
      console.log("CONNESSO SENZA API");
    }

    mascaApi = await enableResult.data.getMascaApi();
  }).catch(error => {
    console.error("ERRORE CON METAMASK " + error);
  })

});

const verifica = document.getElementById("verificaVP");
verifica.addEventListener("click", async function() {
  var text = document.getElementById("vpText").value;
  
  if (text.trim() !== "") {
    console.log("Hai inserito " + text);

    const jsonPresentation = JSON.parse(text);
    console.log(jsonPresentation);

    const vpRes = await mascaApi.verifyData({ presentation: jsonPresentation, verbose: true });
    console.log("vpRes: " + JSON.stringify(vpRes));

    console.log("RESULT: " + vpRes.success);
    if (vpRes.success) {
      mostraSuccesso();
    } else mostraErrore();

  } else console.log("Non hai inserito nulla");

})

function mostraCaricamento() {
  document.getElementById('caricamento').style.display = 'block'; 
}

function nascondiCaricamento() {
  document.getElementById('caricamento').innerText = "Connesso con Metamask!";
}

function mostraSuccesso() {
  successo.style.display = 'block';
  error.style.display = 'none';
}

function mostraErrore() {
  error.style.display = 'block';
  success.style.display = 'none';
}

function nascondiRisultati() {
  error.style.display = 'none';
  successo.style.display = 'none';
}
