//import { enableMasca, isError } from '@blockchain-lab-um/masca-connector';

const connetti = document.getElementById("connettiMasca");

connetti.addEventListener("click", async function() {
  window.ethereum.request({
    method: 'eth_requestAccounts',
  }).then(async accounts => {
    const address = accounts[0];
    alert("ADDRESS: " + address);

    const enableResult = await enableMasca(address);

  }).catch(error => {
    console.error("ERRORE CON METAMASK " + error);
  })

});


const verifica = document.getElementById("verificaVP");

verifica.addEventListener("click", async function () {
  const vp = document.getElementById("vpText").value;
  if (vp.length === 0) alert("Inserisci una VP");
  else {
    const vpRes = await api.verifyData({presentation: vp, verbose: true});

    if (vpRes) {
      alert("La VP è corretta");
    } else {
      alert("La VP è sbagliata");
    }

  }
});
