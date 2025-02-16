//Connessione
connetti.addEventListener("click", async function() {
    window.ethereum.request({
      method: 'eth_requestAccounts',
    }).then(async accounts => {
      address = accounts[0];
  
      const enableResult = await enableMasca(address);
  
      api = await enableResult.data.getMascaApi();

      const didData = await api.getDID();
      did = didData.data;
      const switchDidMethodResult = await api.switchDIDMethod("did:key");
      did = switchDidMethodResult.data;
    }).catch(error => {
      console.error("ERRORE CON METAMASK " + error);
    })
}); 

//Creazione VC
const creaVC = document.getElementById("creaVC");
creaVC.addEventListener("click", async function() {
  const jsonVC = getDatiVC();
  const startTime = Date.now();
  //console.log("JSON: " + JSON.stringify(jsonVC));
  console.log("Creazione VC...");
  const vc = await api.createCredential({
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

//Creazione VP
async function createVP(vc) {
    const vp = await api.createPresentation({
      vcs: [vc.data], // -> Array here
      proofFormat: 'jwt',
    });
    console.log("VP: " + JSON.stringify(vp));
    console.log("Presentazione verificabile creata con successo!"); //AGGIUNGERE CONTROLLO
    verificaVP(vp);
}


//Verifica VP
async function verificaVP(vp) {
  
    var tempi = [];
    for(var i = 0; i < 5; i++) {
      const startTime = Date.now();
      var vpRes = await api.verifyData({ presentation: vp.data, verbose: true });
      const endTime = Date.now();
      const time = (endTime - startTime) / 1000;
      tempi.push(time);
    }
      
    
    for(var i = 0; i < 5; i++) {
      console.log("Tempo " + i + ": " + tempi[i]);
    }
  
    console.log("vpRes: " + JSON.stringify(vpRes));
  
    getDatiVP(vpRes.data);
    mostra('ricetta', 'flex');
    nascondi('vc');
  }




  async function createCredential(params) {
    await validateAndSetCeramicSession.bind(this)();
    const result = await sendSnapMethod(
      this,
      {
        method: "createCredential",
        params
      },
      this.snapId
    );
    const vcResult = result;
    if (isError(vcResult)) {
      return vcResult;
    }
    if (vcResult.data.proof) {
      return vcResult;
    }
    const signedResult = ResultObject.success(
      await signVerifiableCredential.bind(this)(vcResult.data, params)
    );
    return signedResult;
  }




















