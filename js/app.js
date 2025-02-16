import {enableMasca} from "@blockchain-lab-um/masca-connector";

var mascaApi;
var address;
var did;

var farmaci = [];

const successo = document.getElementById("success");
const error = document.getElementById("error");

// CONNESSIONE 
const connetti = document.getElementById("connettiMasca");
connetti.addEventListener("click", async function() {
  mostra('caricamento', 'block');
  //mostraCaricamento();

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
    const didData = await mascaApi.getDID();
    did = didData.data;
    const switchDidMethodResult = await mascaApi.switchDIDMethod("did:key");
    did = switchDidMethodResult.data;
    nascondi('connessione');
    mostra('vc', 'block');
  }).catch(error => {
    console.error("ERRORE CON METAMASK " + error);
  })
});


// CREAZIONE CV 
const creaVC = document.getElementById("creaVC");
creaVC.addEventListener("click", async function() {
  const jsonVC = getDatiVC();
  const startTime = Date.now();
  //console.log("JSON: " + JSON.stringify(jsonVC));
  console.log("Creazione VC...");
  const vc = await mascaApi.createCredential({
    minimalUnsignedCredential: jsonVC,
    proofFormat: 'jwt',
  });

  const endTime = Date.now();
  console.log("VC: " + JSON.stringify(vc));
  const time = (endTime - startTime) / 1000;
  console.log("Tempo Impiegato " + time);

  if(vc.success) {
    console.log("Credenziale creata con successo!");
    console.log(JSON.stringify(vc));
    console.log("Creazione Presentazione verificabile...");
    createVP(vc);
    //verificaVC(vc);
  } else {
    console.log("Errore creazione credenziale");
  }
});

// CREAZIONE VP 
async function createVP(vc) {
  const vp = await mascaApi.createPresentation({
    vcs: [vc.data], // -> Array here
    proofFormat: 'jwt',
  });
  console.log("VP: " + JSON.stringify(vp));
  console.log("Presentazione verificabile creata con successo!"); //AGGIUNGERE CONTROLLO
  verificaVP(vp);
}

// VERIFICA VP
async function verificaVP(vp) {
  
  var tempi = [];
  for(var i = 0; i < 5; i++) {
    const startTime = Date.now();
    var vpRes = await mascaApi.verifyData({ presentation: vp.data, verbose: true });
    const endTime = Date.now();
    const time = (endTime - startTime);
    
    console.log(time);
  }

  console.log("vpRes: " + JSON.stringify(vpRes));

  getDatiVP(vpRes.data);
  mostra('ricetta', 'flex');
  nascondi('vc');
}

// Utilities crea CV 
const aggiungiFarmaco = document.getElementById("aggiungiFarmaco");
aggiungiFarmaco.addEventListener("click", function() {
  const nomeFarmaco = document.getElementById("nomeFarmaco").value;
  const dosaggio = document.getElementById("dosaggio").value;
  
  console.log("Hai inserito: " + nomeFarmaco + " - " + dosaggio);
  
  var farmaco = {"nomeFarmaco": nomeFarmaco, "dosaggio": dosaggio};
  farmaci.push(farmaco);
  document.getElementById("nomeFarmaco").value = "";
  document.getElementById("dosaggio").value = "";

  printFarmaci();
});

function getDatiVC() {
  //Aggiunta medico
  const nomeMedico = document.getElementById("nomeMedico").value;
  const numeroRegistrazione = document.getElementById("numeroRegistrazione").value;
  const autoritaLicenza = document.getElementById("autoritaLicenza").value;
  console.log(nomeMedico + " - " + numeroRegistrazione + " - " + autoritaLicenza);

  //Aggiunta paziente
  const nomePaziente = document.getElementById("nomePaziente").value;
  const codiceFiscale = document.getElementById("codiceFiscaleVC").value;
  console.log(nomePaziente + " - " + codiceFiscale);

  //Aggiunta ricetta
  const idRicetta = document.getElementById("idRicetta").value;
  const dataScadenza = document.getElementById("dataScadenza").value;
  const dataAttuale = getDataAttuale();
  
  console.log(idRicetta + " - " + dataAttuale + " - " + dataScadenza);


  var farmaciJSON = {
    "farmaciPrescritti": farmaci
  }

  console.log("FARMACI JSON: " + JSON.stringify(farmaciJSON));
  //Crea JSON
  var jsonVC = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1"
    ],
    "type": "VerifiableCredential",
    "credentialSchema": {
      "id": "http://json-schema.org/draft-07/schema#",
      "title": "HealthCareVerifiableCredential",
      "properties": {
        "id": { "type": "string" },
        "issuer": {
          "type": "object",
          "properties": {
            "nomeMedico": { "type": "string" },
            "numeroRegistrazioneMedica": { "type": "string" },
            "autoritaLicenza": { "type": "string" }
          },
          "required": ["nomeMedico", "numeroRegistrazioneMedica", "autoritaLicenza"]
        },
        "subject": {
          "type": "object",
          "properties": {
            "nome": { "type": "string" },
            "codiceFiscale": { "type": "string" }
          },
          "required": ["nome", "codiceFiscale"]
        },
        "prescrizione": {
          "type": "object",
          "properties": {
            "idPrescrizione": { "type": "string" },
            "farmaciPrescritti": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "nomeFarmaco": { "type": "string" },
                  "dosaggio": { "type": "string" }
                },
                "required": ["nomeFarmaco", "dosaggio"]
              },
              "minItems": 1
            },
            "dataEmissione": { "type": "string", "format": "date-time" },
            "dataScadenza": { "type": "string", "format": "date-time" }
          },
          "required": ["idPrescrizione", "farmaciPrescritti", "dataEmissione"]
        }
      },
      "required": ["id", "issuer", "subject", "prescrizione"]
    },
    "id": "identifier",
    "issuer": {
      "id": did,
      "nomeMedico": nomeMedico,
      "numeroRegistrazioneMedica": numeroRegistrazione,
      "autoritaLicenza": autoritaLicenza
    },
    "issuanceDate": dataAttuale,
    "expirationDate": dataScadenza,
    "credentialSubject": {
      "id": "did:example:subject",
      "nome": nomePaziente,
      "codiceFiscale": codiceFiscale,
      "prescrizione": {
        "idPrescrizione": idRicetta,
        "farmaciPrescritti": farmaci,
        "dataEmissione": dataAttuale,
        "dataScadenza": dataScadenza
      }
    }
  }

  return jsonVC;
  
  
}

function getDatiVP(vp) {
  const nomePaziente = vp.verifiablePresentation.verifiableCredential[0].credentialSubject.nome; 
  const idPrescrizione = vp.verifiablePresentation.verifiableCredential[0].credentialSubject.prescrizione.idPrescrizione;
  const farmaciP = vp.verifiablePresentation.verifiableCredential[0].credentialSubject.prescrizione.farmaciPrescritti;
  const dataEmissione = vp.verifiablePresentation.verifiableCredential[0].credentialSubject.prescrizione.dataEmissione;
  const dataScadenza = vp.verifiablePresentation.verifiableCredential[0].credentialSubject.prescrizione.dataScadenza;


  document.getElementById('idPrescrizione').innerHTML = idPrescrizione;
  document.getElementById('data-emissione').innerHTML = dataEmissione;
  document.getElementById('data-scadenza').innerHTML = dataScadenza;
  document.getElementById('paziente').innerHTML = nomePaziente;

  insertFarmaci(farmaciP);  
}

function insertFarmaci(farmaciP) {
  var container = document.getElementById('farmaci-ricetta');

  for(var i = 0; i < farmaciP.length; i++) {
    var divFarmaco = document.createElement("div");
    divFarmaco.className = "farmaco";

    var paragrafoId = document.createElement("p");
    paragrafoId.textContent = i + 1;
    divFarmaco.appendChild(paragrafoId);

    var paragrafoNome = document.createElement("p");
    paragrafoNome.textContent = farmaciP[i].nomeFarmaco;
    divFarmaco.appendChild(paragrafoNome);

    var paragrafoDosaggio = document.createElement("p");
    paragrafoDosaggio.textContent = farmaciP[i].dosaggio + "mg";
    divFarmaco.appendChild(paragrafoDosaggio);

    container.appendChild(divFarmaco);
  }
}

function getDataAttuale() {
  var oggi = new Date();
  var anno = oggi.getFullYear(); // Ottieni l'anno aaaa
  var mese = (oggi.getMonth() + 1).toString().padStart(2, '0'); // Ottieni il mese mm (i mesi partono da 0)
  var giorno = oggi.getDate().toString().padStart(2, '0'); // Ottieni il giorno gg
  return anno + "-" + mese + "-" + giorno;
}

function printFarmaci() {
  for (var i = 0; i < farmaci.length; i++) {
    console.log(i + "-" + farmaci[i].nomeFarmaco);
  }
}

// Cambio card
function mostra(id, type) {
  document.getElementById(id).style.display = type;
}

function nascondi(id) {
  document.getElementById(id).style.display = 'none';
}

