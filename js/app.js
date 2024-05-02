//import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

import {enableMasca} from "@blockchain-lab-um/masca-connector";

const connetti = document.getElementById("connettiMasca");
var mascaApi;
connetti.addEventListener("click", async function() {
  window.ethereum.request({
    method: 'eth_requestAccounts',
  }).then(async accounts => {
    const address = accounts[0];
    alert("ADDRESS: " + address);

    const enableResult = await enableMasca(address);
    mascaApi = await enableResult.data.getMascaApi();
  }).catch(error => {
    console.error("ERRORE CON METAMASK " + error);
  })

});


const verifica = document.getElementById("verificaVP");

verifica.addEventListener("click", async function () {
  const vpText = document.getElementById("vpText").value;
  if (vpText.length === 0) alert("Inserisci una VP");
  else {
    alert("Hai inserito: " + vpText);

    const vp = mascaCreatePresentation(vpText);

    const vpRes = await mascaApi.verifyData({presentation: vp, verbose: true});

    /*if (vpRes) {
      alert("La VP è corretta");
    } else {
      alert("La VP è sbagliata");
    }*/

  }
});

async function mascaCreatePresentation(vpText) {
  const vc = mascaCreateCredential(vpText)
  alert("VC creata con successo");
  return await mascaApi.createPresentation({
    vcs: vc,
    proofFormat: 'jwt',
  });
}

function mascaCreateCredential(payload) {
  alert("Creazione credenziale verificabile...");
  return mascaApi.createCredential({
    minimalUnsignedCredential: payload,
    proofFormat: 'jwt',
    options: {
      save: 'true',
      store: ['snap'],
    },
  });
}
