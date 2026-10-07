/* ==================================================================
   D.S.D. — main.js
   Logica Vanilla JS: onboarding, categorie Tennis, Roster con 
   anagrafica espandibile, avatar, tasto foto e scadenziario.
   ================================================================== */

// 1. CATEGORIE SPORT (TENNIS INCLUSO)
const categorieDefault = {
  calcio: ["Primi Calci", "Pulcini", "Esordienti", "Giovanissimi", "Allievi", "Juniores", "Prima Squadra"],
  pallavolo: ["Minivolley", "Under 12", "Under 14", "Under 16", "Under 18", "Prima Squadra"],
  basket: ["Minibasket", "Under 13", "Under 15", "Under 17", "Under 19", "Prima Squadra"],
  tennis: ["Minitennis (Red/Orange)", "Under 12 Green", "Under 14", "Under 16", "Under 18", "Senior / Open", "Master / Over"],
};

const nomiDemo = [
  "Marco Rossi", "Giulia Bianchi", "Luca Ferrari", "Sara Colombo", "Davide Ricci",
  "Elena Marino", "Andrea Greco", "Chiara Conti", "Matteo Bruno", "Alice Galli",
  "Simone De Luca", "Francesca Villa", "Tommaso Serra", "Giorgia Fontana", "Riccardo Costa",
  "Beatrice Rinaldi", "Alessio Farina", "Martina Longo", "Federico Basso", "Camilla Moretti"
];

const cittaDemo = ["Brescia (BS)", "Cremona (CR)", "Milano (MI)", "Bergamo (BG)", "Verona (VR)"];

let sportScelto = null;

// 2. ONBOARDING
function initOnboarding() {
  const bottoniSport = document.querySelectorAll(".sport-option");

  bottoniSport.forEach(function (bottone) {
    bottone.onclick = function (event) {
      const targetBtn = event.target.closest("[data-sport]");
      if (targetBtn) {
        const sport = targetBtn.getAttribute("data-sport");
        selezionaSport(sport);
      }
    };
  });

  const btnBack = document.getElementById("ob-back");
  const btnSubmit = document.getElementById("ob-submit");
  const btnAdd = document.getElementById("btn-aggiungi-categoria");

  if (btnBack) btnBack.onclick = tornaStep1;
  if (btnSubmit) btnSubmit.onclick = confermaOnboarding;
  if (btnAdd) btnAdd.onclick = aggiungiCategoriaManuale;
}

function selezionaSport(sport) {
  sportScelto = sport;
  renderStep2(sport);

  document.getElementById("ob-step-1").classList.add("hidden");
  document.getElementById("ob-step-2").classList.remove("hidden");
  document.getElementById("ob-step-label").textContent = "Passo 2 di 2";
  document.getElementById("ob-progress").style.width = "100%";

  if (!motionRidotto() && typeof gsap !== "undefined") {
    gsap.fromTo("#ob-step-2", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" });
  }
}

function tornaStep1() {
  document.getElementById("ob-step-2").classList.add("hidden");
  document.getElementById("ob-step-1").classList.remove("hidden");
  document.getElementById("ob-step-label").textContent = "Passo 1 di 2";
  document.getElementById("ob-progress").style.width = "50%";
}

function renderStep2(sport) {
  const lista = document.getElementById("categorie-form-list");
  lista.innerHTML = "";

  const categorie = sport === "altro" ? [] : (categorieDefault[sport] || []);

  categorie.forEach(function (categoria, indice) {
    lista.appendChild(creaRigaCategoria(categoria, indice));
  });

  const inputAltro = document.getElementById("altro-sport-input");
  if (inputAltro) {
    inputAltro.classList.toggle("hidden", sport !== "altro");
  }
}

function creaRigaCategoria(nomeCategoria, indice) {
  const riga = document.createElement("div");
  riga.className = "flex items-center gap-3 border border-[#E7EBEC] rounded-md px-3 py-2 bg-white";
  riga.innerHTML = `
    <input type="checkbox" checked data-index="${indice}" class="categoria-checkbox accent-[#4E9EAF] cursor-pointer">
    <input type="text" value="${nomeCategoria}" data-index="${indice}" class="categoria-nome flex-1 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[#4E9EAF] rounded-xs">
    <button type="button" class="btn-rimuovi-cat text-[#7A8285] hover:text-[#C94141] font-bold text-xs px-2 py-1 transition-colors cursor-pointer" title="Rimuovi categoria">✕</button>
  `;

  const btnRimuovi = riga.querySelector(".btn-rimuovi-cat");
  btnRimuovi.onclick = function () {
    riga.remove();
  };

  return riga;
}

function aggiungiCategoriaManuale() {
  const input = document.getElementById("nuova-categoria");
  if (!input) return;
  const valore = input.value.trim();
  if (valore === "") return;

  const lista = document.getElementById("categorie-form-list");
  const indice = lista.children.length;

  lista.appendChild(creaRigaCategoria(valore, indice));
  input.value = "";
  input.focus();
}

function confermaOnboarding() {
  const righe = document.querySelectorAll("#categorie-form-list > div");
  const categorieFinali = [];

  righe.forEach(function (riga) {
    const checkbox = riga.querySelector(".categoria-checkbox");
    const campoNome = riga.querySelector(".categoria-nome");

    if (checkbox && checkbox.checked && campoNome && campoNome.value.trim() !== "") {
      categorieFinali.push(campoNome.value.trim());
    }
  });

  if (categorieFinali.length === 0) {
    alert("Seleziona o aggiungi almeno una categoria prima di continuare.");
    return;
  }

  const configurazione = {
    sport: sportScelto || "calcio",
    categorie: categorieFinali,
    atleti: generaAtletiDemo(categorieFinali),
  };

  localStorage.setItem("dsd_config", JSON.stringify(configurazione));
  avviaApp(configurazione);
}

function etichettaSport(sport) {
  if (sport === "calcio") return "Calcio";
  if (sport === "pallavolo") return "Pallavolo";
  if (sport === "basket") return "Basket";
  if (sport === "tennis") return "Tennis";
  return "ASD";
}

// 3. GENERAZIONE ATLETI DEMO
function generaAtletiDemo(categorie) {
  const atleti = [];
  let contatore = 0;

  categorie.forEach(function (categoria) {
    for (let j = 0; j < 2; j++) {
      const nome = nomiDemo[contatore % nomiDemo.length];
      const luogo = cittaDemo[contatore % cittaDemo.length];
      const annoNascita = 2002 + (contatore % 14);
      const mese = String((contatore % 12) + 1).padStart(2, "0");
      const giorno = String((contatore % 25) + 1).padStart(2, "0");
      const dataNascitaDemo = `${annoNascita}-${mese}-${giorno}`;
      const cfDemo = `RSSMRA${String(annoNascita).slice(2)}A01B157${contatore}X`;

      const documenti = [
        { tipo: "Visite Mediche", scadenza: calcolaDataDemo(contatore, 0) },
        { tipo: "Tesseramento Atleta", scadenza: calcolaDataDemo(contatore, 1) },
        { tipo: "CI", scadenza: calcolaDataDemo(contatore, 2) },
      ];

      atleti.push({
        id: `atl-${contatore}`,
        nome: nome,
        annoNascita: annoNascita,
        dataNascita: dataNascitaDemo,
        luogoNascita: luogo,
        residenza: `Via Roma ${contatore + 12}, ${luogo}`,
        codiceFiscale: cfDemo,
        categoria: categoria,
        documenti: documenti,
      });
      contatore++;
    }
  });

  return atleti;
}

function calcolaDataDemo(indiceAtleta, indiceDocumento) {
  const chiave = (indiceAtleta + indiceDocumento) % 3;
  let offsetGiorni;

  if (chiave === 0) {
    offsetGiorni = -(3 + (indiceAtleta % 25));
  } else if (chiave === 1) {
    offsetGiorni = 5 + (indiceAtleta % 20);
  } else {
    offsetGiorni = 45 + (indiceAtleta % 200);
  }

  const data = new Date();
  data.setDate(data.getDate() + offsetGiorni);
  return data.toISOString().slice(0, 10);
}

// 4. STATO DOCUMENTI E FORMATTAZIONE DATE
function calcolaStatoDocumento(dataScadenzaStr) {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);

  const scadenza = new Date(dataScadenzaStr);
  const giorniMancanti = Math.ceil((scadenza - oggi) / (1000 * 60 * 60 * 24));

  const stato = giorniMancanti < 0 ? "scaduto" : giorniMancanti <= 30 ? "in-scadenza" : "valido";

  return { stato: stato, giorniMancanti: giorniMancanti };
}

function etichettaGiorni(giorni) {
  if (giorni < 0) return `Scaduto da ${Math.abs(giorni)} giorni`;
  if (giorni === 0) return "Scade oggi";
  return `Tra ${giorni} giorni`;
}

function formattaData(dataStr) {
  if (!dataStr) return "Non specificata";
  const data = new Date(dataStr);
  return data.toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
}

// 5. RENDERING SEZIONI
function renderCategorie(categorie, atleti) {
  const contenitore = document.getElementById("categorie-grid");
  if (!contenitore) return;
  let htmlAccumulato = "";

  categorie.forEach(function (categoria, index) {
    let conteggio = 0;
    atleti.forEach(function (atleta) {
      if (atleta.categoria === categoria) conteggio++;
    });

    htmlAccumulato += `
      <div class="categoria-card border border-[#E7EBEC] rounded-md p-4 bg-white shadow-xs">
        <p class="font-mono text-[11px] text-[#7A8285] mb-2">${String(index + 1).padStart(2, "0")}</p>
        <p class="text-base font-bold leading-tight mb-1 text-[#12181B]">${categoria}</p>
        <p class="text-xs text-[#7A8285]">${conteggio} ${conteggio === 1 ? "atleta" : "atleti"}</p>
      </div>
    `;
  });

  contenitore.innerHTML = htmlAccumulato;
  const countEl = document.getElementById("categorie-count");
  if (countEl) countEl.textContent = categorie.length;
}

function renderAtleti(atleti) {
  const contenitore = document.getElementById("atleti-list");
  if (!contenitore) return;
  let htmlAccumulato = "";

  atleti.forEach(function (atleta, i) {
    let badgeHtml = "";

    atleta.documenti.forEach(function (doc) {
      const infoStato = calcolaStatoDocumento(doc.scadenza);
      const stato = infoStato.stato;

      badgeHtml += `
        <span class="cartellino cartellino--${stato}">
          <span class="cartellino__tipo">${doc.tipo}</span>
          <span class="cartellino__data">${formattaData(doc.scadenza)}</span>
        </span>
      `;
    });

    const annoVisualizzato = atleta.annoNascita || (atleta.dataNascita ? new Date(atleta.dataNascita).getFullYear() : "N/D");

    htmlAccumulato += `
      <div class="roster-card border border-[#E7EBEC] rounded-md bg-white shadow-xs overflow-hidden">
        
        <div class="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3 md:w-60 shrink-0">
            <div class="w-8 h-8 rounded-full bg-[#12181B] text-white font-mono text-xs flex items-center justify-center shrink-0">
              ${String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <p class="font-bold text-[#12181B] text-sm leading-tight">${atleta.nome}</p>
              <p class="text-xs text-[#7A8285]">${atleta.categoria} • Anno ${annoVisualizzato}</p>
            </div>
          </div>

          <!-- Documenti e Freccia a destra -->
          <div class="flex items-center justify-between md:justify-end gap-3 flex-1">
            <div class="flex flex-wrap gap-2">${badgeHtml}</div>
            
            <button type="button" class="btn-toggle-dettagli flex items-center justify-center w-8 h-8 rounded-md bg-[#F2F4F4] hover:bg-[#D8F0F3] text-[#12181B] font-bold cursor-pointer shrink-0 transition-all" title="Dettagli atleta">
              <span class="freccia-icona inline-block text-xs text-[#4E9EAF]">▼</span>
            </button>
          </div>
        </div>

        <!-- Pannello Anagrafica con Avatar, Tasto Aggiungi Foto e Dati -->
        <div class="pannello-dettagli-atleta hidden border-t border-[#E7EBEC] bg-[#F2F4F4]/50 p-5">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            <div class="flex flex-col items-center gap-2 shrink-0">
              <!-- Avatar Silhouette Grigio -->
              <div class="w-20 h-20 bg-[#CFD5D6] border-2 border-[#E7EBEC] rounded-full flex items-center justify-center text-[#7A8285] overflow-hidden shadow-inner">
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>

              <!-- Tasto Carica Foto -->
              <label class="text-[11px] font-medium text-[#12181B] bg-white border border-[#E7EBEC] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[#F2F4F4] shadow-xs">
                + Aggiungi Foto
                <input type="file" accept="image/*" class="hidden" />
              </label>
            </div>

            <!-- Dati anagrafici -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs w-full">
              <div class="border-b sm:border-b-0 border-[#E7EBEC] pb-1 sm:pb-0">
                <span class="text-[#7A8285] font-mono uppercase text-[10px] block mb-0.5">Anno e Data di Nascita</span>
                <span class="font-bold text-[#12181B] text-sm">${formattaData(atleta.dataNascita)} (Anno ${annoVisualizzato})</span>
              </div>
              <div class="border-b sm:border-b-0 border-[#E7EBEC] pb-1 sm:pb-0">
                <span class="text-[#7A8285] font-mono uppercase text-[10px] block mb-0.5">Luogo di Nascita</span>
                <span class="font-bold text-[#12181B] text-sm">${atleta.luogoNascita || "Non specificato"}</span>
              </div>
              <div class="border-b sm:border-b-0 border-[#E7EBEC] pb-1 sm:pb-0">
                <span class="text-[#7A8285] font-mono uppercase text-[10px] block mb-0.5">Residenza</span>
                <span class="font-bold text-[#12181B] text-sm">${atleta.residenza || "Non specificata"}</span>
              </div>
              <div>
                <span class="text-[#7A8285] font-mono uppercase text-[10px] block mb-0.5">Codice Fiscale</span>
                <span class="font-mono font-bold text-[#12181B] text-sm">${atleta.codiceFiscale || "Non specificato"}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
  });

  contenitore.innerHTML = htmlAccumulato;
  const countEl = document.getElementById("atleti-count");
  if (countEl) countEl.textContent = atleti.length;

  initAccordionAtleti();
}

function initAccordionAtleti() {
  const bottoniFreccia = document.querySelectorAll(".btn-toggle-dettagli");

  bottoniFreccia.forEach(function (bottone) {
    bottone.onclick = function () {
      const card = bottone.closest(".roster-card");
      if (!card) return;

      const pannello = card.querySelector(".pannello-dettagli-atleta");
      const icona = bottone.querySelector(".freccia-icona");

      if (pannello) {
        pannello.classList.toggle("hidden");
      }

      if (icona) {
        if (icona.style.transform === "rotate(180deg)") {
          icona.style.transform = "rotate(0deg)";
        } else {
          icona.style.transform = "rotate(180deg)";
        }
      }
    };
  });
}

function renderScadenziario(atleti) {
  const scadenze = [];

  atleti.forEach(function (atleta) {
    atleta.documenti.forEach(function (doc) {
      scadenze.push({
        atleta: atleta.nome,
        categoria: atleta.categoria,
        tipo: doc.tipo,
        scadenza: doc.scadenza,
      });
    });
  });

  scadenze.sort(function (a, b) {
    return new Date(a.scadenza) - new Date(b.scadenza);
  });

  const contenitore = document.getElementById("scadenziario-list");
  if (!contenitore) return;
  let htmlAccumulato = "";

  scadenze.forEach(function (voce) {
    const infoStato = calcolaStatoDocumento(voce.scadenza);
    const stato = infoStato.stato;
    const giorniMancanti = infoStato.giorniMancanti;

    htmlAccumulato += `
      <div class="scadenziario-riga scadenziario-riga--${stato} flex items-center justify-between gap-4 px-4 py-3 bg-white">
        <div class="flex items-center gap-4">
          <span class="stato-pallino stato-pallino--${stato} w-2 h-2 rounded-full shrink-0"></span>
          <div>
            <p class="text-sm font-bold text-[#12181B]">${voce.tipo} — ${voce.atleta}</p>
            <p class="text-xs text-[#7A8285]">${voce.categoria}</p>
          </div>
        </div>
        <div class="text-right shrink-0">
          <p class="font-mono text-sm font-semibold">${formattaData(voce.scadenza)}</p>
          <p class="text-[11px] text-[#7A8285]">${etichettaGiorni(giorniMancanti)}</p>
        </div>
      </div>
    `;
  });

  contenitore.innerHTML = htmlAccumulato;
}

function renderStatistiche(categorie, atleti) {
  const statCat = document.getElementById("stat-categorie");
  const statAtl = document.getElementById("stat-atleti");
  const statSca = document.getElementById("stat-scadenze");

  if (statCat) statCat.textContent = String(categorie.length).padStart(2, "0");
  if (statAtl) statAtl.textContent = String(atleti.length).padStart(2, "0");

  let daRinnovare = 0;

  atleti.forEach(function (atleta) {
    atleta.documenti.forEach(function (doc) {
      const infoStato = calcolaStatoDocumento(doc.scadenza);
      if (infoStato.stato !== "valido") daRinnovare++;
    });
  });

  if (statSca) statSca.textContent = String(daRinnovare).padStart(2, "0");
}

function popolaSelectCategorieModal(categorie) {
  const select = document.getElementById("nuova-cat-atleta");
  if (!select) return;

  select.innerHTML = "";
  categorie.forEach(function (cat) {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function aggiungiNuovoAtleta(nome, dataNascita, luogoNascita, residenza, cf, categoria, scadVisita, scadTess, scadCI) {
  const config = caricaConfigurazioneSalvata();
  if (!config) return;

  const annoNascita = dataNascita ? new Date(dataNascita).getFullYear() : null;

  const nuovoAtleta = {
    id: `atl-${Date.now()}`,
    nome: nome,
    annoNascita: annoNascita,
    dataNascita: dataNascita,
    luogoNascita: luogoNascita,
    residenza: residenza,
    codiceFiscale: cf,
    categoria: categoria,
    documenti: [
      { tipo: "Visite Mediche", scadenza: scadVisita },
      { tipo: "Tesseramento Atleta", scadenza: scadTess },
      { tipo: "CI", scadenza: scadCI },
    ],
  };

  config.atleti.push(nuovoAtleta);
  localStorage.setItem("dsd_config", JSON.stringify(config));
  avviaApp(config);
}

function motionRidotto() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animaIngressoApp() {
  if (motionRidotto() || typeof gsap === "undefined") return;

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  tl.from("#app header", { y: -15, opacity: 0, duration: 0.4 })
    .from("#hero-title", { opacity: 0, y: 15, duration: 0.4 }, "-=0.2")
    .fromTo("#scoreboard", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
}

function avviaApp(config) {
  const onboarding = document.getElementById("onboarding");
  const app = document.getElementById("app");

  if (onboarding) onboarding.classList.add("hidden");
  if (app) app.classList.remove("hidden");

  const labelSport = document.getElementById("app-sport-label");
  const heroSport = document.getElementById("hero-sport-name");

  if (labelSport) labelSport.textContent = etichettaSport(config.sport);
  if (heroSport) heroSport.textContent = etichettaSport(config.sport);

  popolaSelectCategorieModal(config.categorie);
  renderCategorie(config.categorie, config.atleti);
  renderAtleti(config.atleti);
  renderScadenziario(config.atleti);
  renderStatistiche(config.categorie, config.atleti);

  animaIngressoApp();
}

function caricaConfigurazioneSalvata() {
  const salvato = localStorage.getItem("dsd_config");
  if (!salvato) return null;

  try {
    return JSON.parse(salvato);
  } catch (errore) {
    console.error("Configurazione non valida.", errore);
    localStorage.removeItem("dsd_config");
    return null;
  }
}

function resetConfigurazione() {
  localStorage.removeItem("dsd_config");
  window.location.reload();
}

// 6. AVVIO
document.addEventListener("DOMContentLoaded", function () {
  initOnboarding();

  const btnReset = document.getElementById("btn-reset-onboarding");
  if (btnReset) {
    btnReset.onclick = function (event) {
      event.preventDefault();
      resetConfigurazione();
    };
  }

  const btnApriModal = document.getElementById("btn-apri-modal-atleta");
  const btnChiudiModal = document.getElementById("btn-chiudi-modal");
  const modalAtleta = document.getElementById("modal-atleta");
  const btnSalvaAtleta = document.getElementById("btn-salva-atleta");

  if (btnApriModal && modalAtleta) {
    btnApriModal.onclick = function () {
      modalAtleta.classList.remove("hidden");
    };
  }

  if (btnChiudiModal && modalAtleta) {
    btnChiudiModal.onclick = function () {
      modalAtleta.classList.add("hidden");
    };
  }

  if (btnSalvaAtleta) {
    btnSalvaAtleta.onclick = function (e) {
      e.preventDefault();
      const nome = document.getElementById("nuovo-nome-atleta").value.trim();
      const dataNascita = document.getElementById("nuova-data-nascita").value;
      const luogoNascita = document.getElementById("nuovo-luogo-nascita").value.trim();
      const residenza = document.getElementById("nuova-residenza").value.trim();
      const cf = document.getElementById("nuovo-cf").value.trim();
      const categoria = document.getElementById("nuova-cat-atleta").value;
      const scadVisita = document.getElementById("scad-visita").value;
      const scadTess = document.getElementById("scad-tesseramento").value;
      const scadCI = document.getElementById("scad-ci").value;

      if (nome === "" || !dataNascita || !scadVisita || !scadTess || !scadCI) {
        alert("Compila tutti i campi obbligatori (Nome, Data di Nascita e Scadenze Documenti).");
        return;
      }

      aggiungiNuovoAtleta(nome, dataNascita, luogoNascita, residenza, cf, categoria, scadVisita, scadTess, scadCI);
      
      modalAtleta.classList.add("hidden");
      document.getElementById("nuovo-nome-atleta").value = "";
      document.getElementById("nuova-data-nascita").value = "";
      document.getElementById("nuovo-luogo-nascita").value = "";
      document.getElementById("nuova-residenza").value = "";
      document.getElementById("nuovo-cf").value = "";
    };
  }

  const configurazioneSalvata = caricaConfigurazioneSalvata();

  if (configurazioneSalvata) {
    avviaApp(configurazioneSalvata);
  } else if (!motionRidotto() && typeof gsap !== "undefined") {
    gsap.from("#onboarding-card", { opacity: 0, y: 20, duration: 0.4, ease: "power2.out" });
  }
});