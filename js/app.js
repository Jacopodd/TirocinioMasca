import { enableMasca, isError } from '/@blockchain-lab-um/masca-connector';

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
