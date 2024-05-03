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

    console.log("EnableResult " + enableResult.success);

    if (enableResult != null) {
      console.log("CONNESSO CON API");
    } else {
      console.log("CONNESSO SENZA API");
    }

    mascaApi = await enableResult.data.getMascaApi();
    nascondiCaricamento();
    mostraForm();
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
      inserisciDati(jsonPresentation)
    } else mostraErrore();

  } else console.log("Non hai inserito nulla");
})

function inserisciDati(vp) {
  var vcId = vp.verifiableCredential[0].vc.id;
  var issuer = vp.verifiableCredential[0].vc.issuer;
  var issuanceDate = vp.verifiableCredential[0].vc.issuanceDate;
  var expirationDate = vp.verifiableCredential[0].vc.expirationDate;
  var type = vp.verifiableCredential[0].type[2];
  var holder = vp.holder
  var proof = vp.proof.type;
  
  document.getElementById('vc-id').innerHTML = vcId; 
  document.getElementById('issuer').innerHTML = issuer;
  document.getElementById('issuance-date').innerHTML = issuanceDate;
  document.getElementById('expiration-date').innerHTML = expirationDate;
  document.getElementById('type').innerHTML = type;
  document.getElementById('holder').innerHTML = holder;
  document.getElementById('proof').innerHTML = proof;
}

function mostraForm() {
  document.getElementById('vp').style.display = 'flex';
}

function mostraCaricamento() {
  document.getElementById('caricamento').style.display = 'block'; 
}

function nascondiCaricamento() {
  document.getElementById('caricamento').innerText = "Connesso con Metamask!";
}

function mostraBanner() {
  document.getElementById('risultati').style.visibility = 'visible';
  document.getElementById('risultati').style.display = 'block'
}

function mostraSuccesso() {
  mostraBanner();
  successo.style.display = 'block';
  error.style.display = 'none';
  mostraResult();
}

function mostraErrore() {
  mostraBanner();
  error.style.display = 'block';
  success.style.display = 'none';
}

function nascondiRisultati() {
  error.style.display = 'none';
  successo.style.display = 'none';
  document.getElementById('risultati').style.display = 'none';
  document.getElementById('risultati').style.visibility = 'hidden';
}

function mostraResult() {
  document.getElementById('result').style.display = 'flex';
  document.getElementById('vp').style.display = 'none';
  document.getElementById('connessione').style.display = 'none';
}


const rip = document.getElementById('riprova');
rip.addEventListener('click', function() {
  riprova();
}); 
function riprova() {
  document.getElementById('result').style.display = 'none';
  document.getElementById('connessione').style.display = 'flex';
  nascondiRisultati();
}
