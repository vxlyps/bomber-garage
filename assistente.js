/* =========================================================================
   Bomber Garage - l'assistente del preventivo

   Una chat in una finestra sopra la pagina. Parte da un piccolo menu:
   un preventivo (tre domande: mezzo, modello, cosa serve; poi la
   richiesta pronta, a cui si puo' aggiungere una nota prima di inviarla),
   i prezzi delle gomme in promo, se l'officina e' aperta, una domanda
   libera. Alla fine del preventivo c'e' la richiesta gia' scritta, da
   inviare a Daniele su WhatsApp. Si apre col pulsante "Preventivo
   veloce" (e con la voce del menu), si chiude con la X o con Esc;
   chiudendo, la conversazione resta dov'era. Su desktop sta nell'angolo
   in basso a destra, sul telefono prende tutto lo schermo.

   NON E' UN'INTELLIGENZA ARTIFICIALE. Alle domande scritte risponde solo
   con i testi che stanno gia' nella pagina:
     - le domande frequenti e le schede dei servizi che hanno l'attributo
       data-parole (le parole chiave stanno li', accanto al testo);
     - aperto o chiuso adesso, preso dalla pastiglia sotto l'apertura;
     - la promo gomme, letta dal listino, solo finche' e' visibile.
   Se non trova niente non inventa: propone di chiedere a Daniele e gli
   prepara il messaggio con la domanda dentro.

   Niente librerie, niente cookie, niente richieste a server esterni. Se
   questo file non parte, il pulsante "Preventivo" porta dritto a WhatsApp.
   ========================================================================= */

(function () {
  'use strict';

  var NUMERO = '393931087444';

  /* Le cose tra cui si sceglie. "testo" e' come finisce nel messaggio. */
  var SERVIZI = [
    { id: 'tagliando',  etichetta: 'Tagliando',              testo: 'tagliando' },
    { id: 'gomme',      etichetta: 'Gomme',                  testo: 'cambio gomme' },
    { id: 'revisione',  etichetta: 'Revisione',              testo: 'revisione' },
    { id: 'guasto',     etichetta: 'Guasto o rumore',        testo: 'un guasto da far vedere' },
    { id: 'centralina', etichetta: 'Centralina o modifiche', testo: 'centralina o modifiche' },
    { id: 'cid',        etichetta: 'Incidente e CID',        testo: 'pratica CID dopo un incidente' },
    { id: 'ritiro',     etichetta: 'Ritiro del mezzo',       testo: 'ritiro del mezzo' },
    { id: 'usato',      etichetta: 'Parere su un usato',     testo: 'parere su un usato' },
    { id: 'altro',      etichetta: 'Altro',                  testo: 'altro, vedi note' }
  ];

  var box = document.querySelector('.assistente');
  if (!box) return;

  var chat = box.querySelector('.assistente-chat');
  var form = box.querySelector('.assistente-scrivi');
  var campo = form.querySelector('input');
  var ricomincia = box.querySelector('.assistente-ricomincia');
  var chiudi = box.querySelector('.assistente-chiudi');
  var aprono = document.querySelectorAll('[data-apri-assistente]');
  var radice = document.documentElement;
  var largo = window.matchMedia ? matchMedia('(min-width: 56em)') : { matches: true };

  var calma = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAUSA = calma ? 0 : 260;   /* un attimo prima che "risponda" */

  var stato = null;       /* null finche' la chat non e' mai stata aperta */
  var toccato = false;
  var daDove = null;      /* chi l'ha aperta: ci torna il fuoco alla chiusura */


  /* ---------------------------------------------------------------------
     Attrezzi
     --------------------------------------------------------------------- */

  /* minuscolo, senza accenti e senza punteggiatura: "Perché?" -> "perche" */
  function piano(t) {
    return String(t || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function attaccato(t) { return piano(t).replace(/ /g, ''); }

  function nodo(tag, classe, testo) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (testo != null) n.textContent = testo;
    return n;
  }

  function linkWhatsApp(messaggio) {
    return 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(messaggio);
  }

  /* scorre solo la conversazione, dentro la finestra: la pagina non si muove */
  function inFondo() {
    chat.scrollTop = chat.scrollHeight;
  }

  function aggiungi(n) {
    chat.appendChild(n);
    inFondo();
    return n;
  }

  function bot(testo) { return aggiungi(nodo('p', 'bolla bolla-bot', testo)); }
  function tu(testo) { return aggiungi(nodo('p', 'bolla bolla-tu', testo)); }

  function dopo(fai) { setTimeout(fai, PAUSA); }

  /* toglie i pulsanti di scelta ancora aperti: una domanda alla volta */
  function chiudiScelte() {
    var aperte = chat.querySelectorAll('.scelte');
    for (var i = 0; i < aperte.length; i++) aperte[i].parentNode.removeChild(aperte[i]);
  }

  function scelte(voci) {
    chiudiScelte();
    var riga = nodo('div', 'scelte');
    voci.forEach(function (v) {
      var b = nodo('button', 'scelta' + (v.classe ? ' ' + v.classe : ''), v.etichetta);
      b.type = 'button';
      b.addEventListener('click', function () { toccato = true; v.fai(b); });
      riga.appendChild(b);
    });
    return aggiungi(riga);
  }

  function suggerimento(testo) { campo.placeholder = testo; }

  function mettiFuoco() {
    /* sul telefono il fuoco apre la tastiera: solo quando serve scrivere */
    if (toccato && !box.hidden) campo.focus({ preventScroll: true });
  }


  /* ---------------------------------------------------------------------
     Quello che la pagina sa gia'
     --------------------------------------------------------------------- */

  function promoAttiva() {
    var p = document.getElementById('promo');
    return p && !p.hidden ? p : null;
  }

  /* "fino al 30 novembre", preso dall'etichetta della sezione promo */
  function scadenzaPromo(p) {
    var e = p.querySelector('.etichetta');
    var t = e ? e.textContent.split('·') : [];
    return t.length > 1 ? t[1].trim() : '';
  }

  function voceListino(li) {
    var v = li.querySelector('.voce');
    return v ? v.firstChild.textContent.trim() : '';
  }

  function prezzoListino(li) {
    var p = li.querySelector('.prezzo');
    return p ? p.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  /* la riga del listino che corrisponde al modello scritto, se c'e' */
  function rigaPromo(modello) {
    var p = promoAttiva();
    if (!p || !modello) return null;
    var scritto = attaccato(modello);
    var righe = p.querySelectorAll('li[data-cerca]');
    for (var i = 0; i < righe.length; i++) {
      var nomi = righe[i].getAttribute('data-cerca').split('|');
      for (var k = 0; k < nomi.length; k++) {
        if (scritto.indexOf(attaccato(nomi[k])) !== -1) return righe[i];
      }
    }
    return null;
  }

  /* "scooter da 120 €, moto da 230 €": il prezzo piu' basso di ogni colonna */
  function riassuntoPromo(p) {
    var pezzi = [];
    p.querySelectorAll('.listino').forEach(function (col) {
      var minimo = null, testo = '';
      col.querySelectorAll('li').forEach(function (li) {
        var n = parseInt(prezzoListino(li).replace(/[^0-9]/g, ''), 10);
        if (!isNaN(n) && (minimo === null || n < minimo)) { minimo = n; testo = prezzoListino(li); }
      });
      var titolo = col.querySelector('h3');
      if (titolo && testo) pezzi.push(titolo.textContent.trim().toLowerCase() + ' ' + testo);
    });
    return pezzi.join(', ');
  }

  function apertoAdesso() {
    var s = document.querySelector('.fascia-orari .stato');
    var o = document.querySelector('.fascia-orari .orario');
    var orario = o ? o.textContent.replace(/\s+/g, ' ').trim() : '';
    orario = orario.charAt(0).toLowerCase() + orario.slice(1);
    if (!s || s.hidden) return orario ? 'Gli orari sono ' + orario + '.' : null;
    var parola = s.querySelector('b').textContent;
    var resto = s.querySelector('.dettaglio').textContent;
    return parola + ', ' + resto + '. Gli orari sono ' + orario + '.';
  }

  /* domande frequenti prima, poi le schede dei servizi: a parita' di
     punteggio vince la domanda frequente, che e' scritta come risposta */
  function sapere() {
    var elenco = [];
    var fonti = document.querySelectorAll('.domanda[data-parole], .lavoro[data-parole]');
    fonti.forEach(function (f) {
      var risposta = f.querySelector('p');
      if (!risposta) return;
      var testo = risposta.textContent.replace(/\s+/g, ' ').trim();
      /* le schede dei servizi sono descrizioni, non risposte: "Si': ..." */
      if (!f.classList.contains('domanda')) testo = 'Sì: ' + testo.charAt(0).toLowerCase() + testo.slice(1);
      elenco.push({
        faq: f.classList.contains('domanda'),
        parole: f.getAttribute('data-parole').split(/\s+/).filter(Boolean).map(function (w) {
          return { peso: w.charAt(0) === '~' ? 0.5 : 1, pezzo: w.replace(/^~/, '').replace(/\+/g, ' ') };
        }),
        risposta: testo
      });
    });
    elenco.sort(function (a, b) { return (b.faq ? 1 : 0) - (a.faq ? 1 : 0); });
    return elenco;
  }

  function punteggio(voce, testo, parole) {
    var tot = 0;
    voce.parole.forEach(function (w) {
      var c = w.pezzo.indexOf(' ') !== -1
        ? (' ' + testo + ' ').indexOf(' ' + w.pezzo) !== -1
        : parole.some(function (p) { return p.indexOf(w.pezzo) === 0; });
      if (c) tot += w.peso;
    });
    return tot;
  }

  /* La risposta a una domanda scritta, o null se non la sa. */
  function rispondi(domanda) {
    var t = piano(domanda);
    var parole = t.split(' ');
    var p = promoAttiva();

    if (parole.length <= 3 && /^(ciao|salve|buongiorno|buonasera|hey|ehi)\b/.test(t)) {
      return 'Ciao! Scrivi pure la domanda, oppure rispondi qui sopra e ti preparo il messaggio per Daniele.';
    }
    if (parole.length <= 4 && /\bgrazie\b/.test(t)) {
      return 'Figurati! Se ti serve altro, scrivi pure.';
    }
    /* tempi di consegna e disponibilita': li sa solo Daniele */
    if (/quanto tempo|quanti giorni|tempi|quando e pronta|quando sara pronta|posto libero|disponibilita/.test(t)) {
      return null;
    }
    if (/\b(adesso|ora|oggi|ancora|momento)\b/.test(t) && /(apert|chius)/.test(t)) {
      return apertoAdesso();
    }
    if (/(telefon|numero|cellular|chiamar)/.test(t)) {
      return 'Il numero è 393 108 7444, lo stesso anche su WhatsApp.';
    }
    if (/\b(e ?mail|mail|posta)\b/.test(t)) {
      var m = document.querySelector('a[href^="mailto:"]');
      if (m) return 'L’email è ' + m.getAttribute('href').replace('mailto:', '') + '. Per fare prima, però, scrivi su WhatsApp.';
    }
    /* prezzo delle gomme con la promo attiva: si risponde col listino */
    if (p && /(gomm|pneumatic)/.test(t) && /(cost|prezz|quant)/.test(t)) {
      var r = rigaPromo(domanda);
      return r
        ? 'Per ' + voceListino(r) + ' c\u2019è la promo gomme ' + scadenzaPromo(p) + ': ' + prezzoListino(r) + '. Il prezzo esatto dipende dalla gomma che scegli.'
        : 'Con la promo gomme ' + scadenzaPromo(p) + ': ' + riassuntoPromo(p) + '. Il prezzo esatto dipende da modello e misura: scrivili e te lo dice Daniele.';
    }
    if (p && /(promo|offert|scont)/.test(t)) {
      return 'C’è la promo gomme ' + scadenzaPromo(p) + ': ' + riassuntoPromo(p) + '. Tutti i prezzi per modello e misura sono nella sezione Promo gomme, qui sopra.';
    }

    var migliore = null, max = 0;
    sapere().forEach(function (v) {
      var s = punteggio(v, t, parole);
      if (s > max) { max = s; migliore = v; }
    });
    /* basta anche solo una marca ("riparate le Ducati?"): vale mezzo punto */
    if (!migliore || max < 0.5) return null;

    var risposta = migliore.risposta;
    /* si parla di gomme e la promo e' attiva: lo si dice */
    if (p && /(gomm|pneumatic)/.test(t)) {
      var riga = rigaPromo(domanda);
      risposta += riga
        ? ' Per ' + voceListino(riga) + ' c’è la promo ' + scadenzaPromo(p) + ': ' + prezzoListino(riga) + '.'
        : ' E c’è la promo gomme ' + scadenzaPromo(p) + ': ' + riassuntoPromo(p) + '.';
    }
    return risposta;
  }


  /* ---------------------------------------------------------------------
     La conversazione

     Si parte da un piccolo menu (preventivo, prezzi gomme, aperti?,
     domanda). Il preventivo fa quattro domande e salta quelle a cui si
     e' gia' risposto: chi arriva dai prezzi delle gomme ha gia' detto
     il modello e cosa gli serve. WhatsApp compare solo alla fine, come
     il modo di inviare la richiesta a Daniele.
     --------------------------------------------------------------------- */

  function nuovoPreventivo() {
    stato.mezzo = null;
    stato.modello = null;
    stato.servizi = [];
    stato.serviziFatti = false;
    stato.note = '';
    stato.promo = '';
    richiesta = [];
  }

  function avvia() {
    chat.textContent = '';
    stato = { passo: 'menu' };
    nuovoPreventivo();
    ricomincia.hidden = !toccato;
    bot('Ciao! Sono l’assistente di Bomber Garage.');
    menu('Cosa ti serve?');
  }

  /* un pulsante che, toccato, diventa la tua risposta e fa qualcosa */
  function voce(etichetta, fai) {
    return { etichetta: etichetta, fai: function () {
      chiudiScelte();
      ricomincia.hidden = false;
      tu(etichetta);
      dopo(fai);
    } };
  }

  function menu(testo) {
    stato.passo = 'menu';
    bot(testo);
    var voci = [voce('Un preventivo', function () { nuovoPreventivo(); avanti(); })];
    if (promoAttiva()) voci.push(voce('Prezzi gomme', prezziGomme));
    voci.push(voce('Siete aperti?', aperti));
    voci.push(voce('Ho una domanda', unaDomanda));
    scelte(voci);
    suggerimento('Oppure scrivi qui la tua domanda');
  }

  function altro() { menu('Ti serve altro?'); }

  /* --- le scorciatoie del menu ------------------------------------------ */

  function aperti() {
    var a = document.querySelector('.fascia-orari a[href="#dove"]');
    var dove = a ? a.textContent.replace(/\s+/g, ' ').trim().replace(/,\s*Roma$/, '') : '';
    bot((apertoAdesso() || '') + (dove ? ' Siamo in ' + dove + ', a San Giovanni.' : ''));
    dopo(altro);
  }

  function unaDomanda() {
    stato.passo = 'domanda';
    bot('Scrivila qui sotto. Rispondo con quello che so; se non lo so, ti metto in contatto con Daniele.');
    suggerimento('Es. riparate anche le Vespa?');
    mettiFuoco();
  }

  function prezziGomme() {
    stato.passo = 'gomme';
    bot('Che modello hai? Ti dico subito il prezzo della promo.');
    scelte([{ etichetta: 'Ho una moto', fai: function () { chiudiScelte(); tu('Ho una moto'); dopo(gommeMoto); } }]);
    suggerimento('Es. Honda SH 150, X-ADV 350');
    mettiFuoco();
  }

  function gommeMoto() {
    var p = promoAttiva();
    if (!p) return altro();
    var righe = [];
    p.querySelectorAll('.listino').forEach(function (col) {
      var h = col.querySelector('h3');
      if (!h || piano(h.textContent) !== 'moto') return;
      col.querySelectorAll('li').forEach(function (li) { righe.push(voceListino(li) + ': ' + prezzoListino(li)); });
    });
    bot('Per le moto, ' + scadenzaPromo(p) + ': ' + righe.join('; ') + '. Dipende dalla misura delle gomme.');
    nuovoPreventivo();
    stato.mezzo = 'moto';
    stato.servizi = ['gomme'];
    stato.serviziFatti = true;
    stato.promo = 'Ho visto la promo gomme sul sito.';
    dopoGomme();
  }

  function rispostaGomme(testo) {
    tu(testo);
    dopo(function () {
      var p = promoAttiva();
      nuovoPreventivo();
      stato.modello = testo.replace(/\s+/g, ' ').trim();
      stato.servizi = ['gomme'];
      stato.serviziFatti = true;
      var riga = rigaPromo(testo);
      if (p && riga) {
        bot('Per ' + voceListino(riga) + ': ' + prezzoListino(riga) + ', con la promo ' + scadenzaPromo(p) + '. Il prezzo esatto dipende dalla gomma che scegli.');
        var col = riga.closest('.listino');
        var h = col && col.querySelector('h3');
        if (h) stato.mezzo = piano(h.textContent) === 'moto' ? 'moto' : 'scooter';
        stato.promo = 'Ho visto la promo gomme: ' + voceListino(riga) + ' ' + prezzoListino(riga) + '.';
      } else {
        bot('Per questo modello non ho il prezzo in listino. La promo parte da ' + (p ? riassuntoPromo(p) : '') + ': quello giusto dipende dalla misura, e te lo dice Daniele.');
        stato.promo = 'Ho visto la promo gomme sul sito.';
      }
      dopoGomme();
    });
  }

  function dopoGomme() {
    stato.passo = 'menu';
    scelte([
      voce('Prenota il cambio gomme', function () { avanti(); }),
      voce('Altro', altro)
    ]);
    suggerimento('Oppure scrivi qui la tua domanda');
  }

  /* --- il preventivo: chiede solo quello che manca ---------------------- */

  function avanti() {
    if (stato.mezzo === null) chiediMezzo();
    else if (stato.modello === null) chiediModello();
    else if (!stato.serviziFatti) chiediServizi();
    else mostraRichiesta('Domande finite: ecco la tua richiesta.');
  }

  function chiediMezzo() {
    stato.passo = 'mezzo';
    bot('Partiamo dal mezzo: scooter o moto?');
    scelte([
      { etichetta: 'Scooter', fai: function () { rispondiMezzo('scooter'); } },
      { etichetta: 'Moto', fai: function () { rispondiMezzo('moto'); } }
    ]);
    suggerimento('Oppure scrivi qui la tua domanda');
  }

  function rispondiMezzo(m) {
    chiudiScelte();
    ricomincia.hidden = false;
    stato.mezzo = m;
    tu(m.charAt(0).toUpperCase() + m.slice(1));
    dopo(avanti);
  }

  function chiediModello() {
    stato.passo = 'modello';
    bot('Che modello è? Se li sai, aggiungi anno e chilometri.');
    scelte([{ etichetta: 'Non lo so', fai: function () { rispondiModello(''); } }]);
    suggerimento(stato.mezzo === 'scooter' ? 'Es. Honda SH 150 del 2019' : 'Es. Yamaha Ténéré 700, 30.000 km');
    mettiFuoco();
  }

  function rispondiModello(t) {
    chiudiScelte();
    stato.modello = t.replace(/\s+/g, ' ').trim();
    tu(stato.modello || 'Non lo so');
    dopo(avanti);
  }

  function chiediServizi() {
    stato.passo = 'servizi';
    bot('Cosa c’è da fare? Puoi sceglierne più di uno.');

    var avantiBtn;
    var voci = SERVIZI.map(function (s) {
      return {
        etichetta: s.etichetta,
        fai: function (b) {
          var i = stato.servizi.indexOf(s.id);
          if (i === -1) stato.servizi.push(s.id); else stato.servizi.splice(i, 1);
          b.setAttribute('aria-pressed', i === -1 ? 'true' : 'false');
          avantiBtn.disabled = stato.servizi.length === 0;
        }
      };
    });
    voci.push({ etichetta: 'Continua', classe: 'scelta-avanti', fai: rispondiServizi });

    var riga = scelte(voci);
    var pulsanti = riga.querySelectorAll('.scelta');
    SERVIZI.forEach(function (s, i) {
      pulsanti[i].setAttribute('aria-pressed', stato.servizi.indexOf(s.id) !== -1 ? 'true' : 'false');
    });
    avantiBtn = riga.querySelector('.scelta-avanti');
    avantiBtn.disabled = stato.servizi.length === 0;
    suggerimento('Oppure scrivi qui la tua domanda');
  }

  function scelti(campoNome) {
    return SERVIZI.filter(function (s) { return stato.servizi.indexOf(s.id) !== -1; })
      .map(function (s) { return s[campoNome]; });
  }

  function rispondiServizi() {
    if (!stato.servizi.length) return;
    chiudiScelte();
    stato.serviziFatti = true;
    tu(scelti('etichetta').join(', '));

    dopo(function () {
      var p = promoAttiva();
      if (p && stato.servizi.indexOf('gomme') !== -1 && !stato.promo) {
        var riga = rigaPromo(stato.modello);
        if (riga) {
          bot('Per ' + voceListino(riga) + ' c’è la promo gomme ' + scadenzaPromo(p) + ': ' + prezzoListino(riga) + '. La aggiungo alla richiesta.');
          stato.promo = 'Ho visto la promo gomme: ' + voceListino(riga) + ' ' + prezzoListino(riga) + '.';
        } else {
          bot('C’è anche la promo gomme ' + scadenzaPromo(p) + ': ' + riassuntoPromo(p) + ', dipende dalla misura.');
          stato.promo = 'Ho visto la promo gomme sul sito.';
        }
      }
      avanti();
    });
  }

  function componi() {
    var righe = ['Ciao! Vi scrivo dal sito.'];
    righe.push('*Mezzo:* ' + (stato.mezzo || '') + (stato.modello ? ' ' + stato.modello : ''));
    righe.push('*Mi serve:* ' + scelti('testo').join(', '));
    if (stato.note) righe.push('*Note:* ' + stato.note);
    if (stato.promo) righe.push(stato.promo);
    return righe.join('\n');
  }

  /* l'anteprima mostra il grassetto come lo mostrera' WhatsApp */
  function anteprima(messaggio) {
    var carta = nodo('div', 'anteprima');
    messaggio.split('\n').forEach(function (r) {
      var riga = nodo('p');
      var m = r.match(/^\*(.+?)\*\s?(.*)$/);
      if (m) {
        riga.appendChild(nodo('strong', null, m[1]));
        riga.appendChild(document.createTextNode(' ' + m[2]));
      } else {
        riga.textContent = r;
      }
      carta.appendChild(riga);
    });
    return carta;
  }

  function pulsanteWhatsApp(testo, messaggio, classi, evento) {
    var a = nodo('a', classi);
    a.href = linkWhatsApp(messaggio);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('data-umami-event', evento);
    a.innerHTML = '<svg class="icona icona-piena"><use href="#i-whatsapp"></use></svg>';
    a.appendChild(document.createTextNode(testo));
    var riga = nodo('div', 'assistente-azioni');
    riga.appendChild(a);
    return aggiungi(riga);
  }

  /* L'invito sotto la richiesta: cosa conviene aggiungere, a seconda del
     lavoro. Per il ritiro serve sapere dove sta il mezzo. */
  function invitoNota() {
    var s = stato.servizi;
    if (stato.note) {
      return ['Se vuoi aggiungere altro, scrivilo qui sotto. Altrimenti è tutto pronto: premi Invia a Daniele.', 'Aggiungi altro (facoltativo)'];
    }
    if (s.indexOf('ritiro') !== -1) {
      return ['Per il ritiro serve sapere dove si trova il mezzo: scrivilo qui sotto e lo aggiungo alla richiesta.', 'Es. Via Tuscolana 100, non parte da ieri'];
    }
    if (s.indexOf('guasto') !== -1 || s.indexOf('altro') !== -1) {
      return ['Se vuoi, scrivi qui sotto cosa fa (rumori, spie accese, quando succede) e lo aggiungo. Altrimenti è pronta da inviare.', 'Es. a freddo fa fatica a partire'];
    }
    if (s.indexOf('gomme') !== -1) {
      return ['Se sai la misura delle gomme (è sul fianco, tipo 120/70-17) o quando passeresti, scrivilo qui sotto e lo aggiungo. Altrimenti è pronta da inviare.', 'Es. 120/70-15, passerei giovedì'];
    }
    return ['Se vuoi aggiungere qualcosa, tipo quando passeresti, scrivilo qui sotto e lo aggiungo. Altrimenti è pronta da inviare.', 'Es. potrei passare martedì mattina'];
  }

  /* La richiesta finita, con un solo pulsante per inviarla. Quando si
     aggiunge una nota, la versione vecchia sparisce e compare quella
     nuova: in chat c'e' sempre una richiesta sola, quella giusta. */
  var richiesta = [];

  function mostraRichiesta(titolo) {
    stato.passo = 'fine';
    richiesta.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    var messaggio = componi();
    var invito = invitoNota();
    richiesta = [
      bot(titolo),
      aggiungi(anteprima(messaggio)),
      pulsanteWhatsApp('Invia a Daniele', messaggio, 'btn btn-oro', 'whatsapp-assistente'),
      bot(invito[0])
    ];
    suggerimento(invito[1]);
  }

  function aggiungiNota(t) {
    t = t.replace(/\s+/g, ' ').trim();
    stato.note = stato.note ? stato.note + '. ' + t : t;
    tu(t);
    dopo(function () {
      mostraRichiesta('Aggiunto. Ecco la richiesta aggiornata: se è tutto, inviala.');
    });
  }

  /* --- le domande scritte ----------------------------------------------- */

  /* dopo una domanda si torna dove si era: nel preventivo si riprende
     dalla domanda lasciata, altrimenti si ripropone il menu */
  function riprendi() {
    if (stato.passo === 'fine') return;
    if (/^(mezzo|modello|servizi)$/.test(stato.passo)) {
      bot('Riprendiamo da dove eravamo.');
      avanti();
    } else {
      altro();
    }
  }

  function domandaLibera(testo) {
    tu(testo);
    ricomincia.hidden = false;
    dopo(function () {
      var r = rispondi(testo);
      if (r) {
        bot(r);
      } else {
        bot('Questa la sa solo Daniele: chiediglielo direttamente, la domanda è già scritta.');
        pulsanteWhatsApp('Chiedi a Daniele', 'Ciao! Vi scrivo dal sito, ho una domanda: ' + testo,
          'btn btn-velo btn-piccolo', 'whatsapp-domanda');
      }
      dopo(riprendi);
    });
  }

  /* nelle risposte a modello e note si scrive di tutto: e' una domanda
     solo se lo sembra davvero (punto interrogativo o parola da domanda) */
  function sembraDomanda(t) {
    return /\?\s*$/.test(t) ||
      /^(quanto|quanti|quando|come|dove|perche|fate|riparate|cambiate|avete|siete|potete|posso|si puo|aprite|lavorate|accettate|che orari)\b/.test(piano(t));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = campo.value.trim();
    if (!t) return;
    campo.value = '';
    toccato = true;
    var p = stato.passo;

    /* "ho uno scooter" dal menu o alla prima domanda: si parte col preventivo */
    if ((p === 'menu' || p === 'domanda' || p === 'mezzo') && !sembraDomanda(t)) {
      var m = /\b(scooter|motorino|vespa)\b/.test(piano(t)) ? 'scooter' : (/\bmoto\b/.test(piano(t)) ? 'moto' : '');
      if (m) {
        if (p !== 'mezzo') nuovoPreventivo();
        chiudiScelte();
        ricomincia.hidden = false;
        stato.mezzo = m;
        tu(t);
        return dopo(avanti);
      }
    }
    if (p === 'modello' && !sembraDomanda(t)) return rispondiModello(t);
    if (p === 'gomme' && !sembraDomanda(t)) { chiudiScelte(); return rispostaGomme(t); }
    /* a richiesta pronta, quello che si scrive e' per Daniele: va nella richiesta */
    if (p === 'fine') return aggiungiNota(t);
    chiudiScelte();
    domandaLibera(t);
  });

  ricomincia.addEventListener('click', function () {
    toccato = true;
    avvia();
  });


  /* ---------------------------------------------------------------------
     La finestra: apri, chiudi, e sul telefono la tastiera
     --------------------------------------------------------------------- */

  /* Sul telefono la finestra prende lo schermo visibile: quando esce la
     tastiera si accorcia, cosi' il campo per scrivere resta sopra i tasti. */
  function adatta() {
    if (box.hidden || largo.matches || !window.visualViewport) {
      box.style.top = '';
      box.style.height = '';
      return;
    }
    var vv = window.visualViewport;
    box.style.top = vv.offsetTop + 'px';
    box.style.height = vv.height + 'px';
    inFondo();
  }

  function apri(e) {
    if (e) e.preventDefault();
    daDove = e && e.currentTarget ? e.currentTarget : null;
    /* dal menu del telefono: prima si chiude il menu */
    if (location.hash === '#menu') location.hash = 'chiudi';

    box.hidden = false;
    radice.classList.add('assistente-aperto');
    if (!stato) avvia();
    adatta();
    inFondo();
    /* su desktop si puo' scrivere subito; sul telefono no, la tastiera
       coprirebbe le domande: il fuoco va sulla X */
    if (largo.matches) campo.focus({ preventScroll: true });
    else chiudi.focus({ preventScroll: true });
  }

  function chiudiFinestra() {
    box.hidden = true;
    radice.classList.remove('assistente-aperto');
    adatta();
    if (daDove && daDove.offsetParent !== null) daDove.focus({ preventScroll: true });
  }

  for (var i = 0; i < aprono.length; i++) aprono[i].addEventListener('click', apri);
  chiudi.addEventListener('click', chiudiFinestra);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !box.hidden) chiudiFinestra();
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', adatta);
    window.visualViewport.addEventListener('scroll', adatta);
  }
})();
