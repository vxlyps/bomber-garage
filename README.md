# Bomber Garage

Sito di BomberGarage, officina moto in via Umberto Biancamano 34 a Roma.

> ## IL SITO È ONLINE SU https://bombergarage.it
>
> Dominio comprato su Aruba il 9 ottobre 2026, collegato a GitHub Pages.
> `www.bombergarage.it` e il vecchio `vxlyps.github.io/bomber-garage`
> rimandano da soli al dominio. HTTPS attivo e obbligatorio.
>
> **Da fare, in ordine di importanza:**
>
> 1. **Il sito sulla scheda Google dell'attività** deve essere
>    `https://bombergarage.it` (prima c'era l'indirizzo github.io). È la
>    cosa che porta più gente: quasi tutti arrivano da Maps.
> 2. **Google Search Console** sulla proprietà `bombergarage.it` (il
>    record TXT di verifica è già nei DNS), con la sitemap
>    `https://bombergarage.it/sitemap.xml`.
> 3. **Bing Webmaster Tools**, che si importa da Search Console con un
>    clic. Conta perché ChatGPT cerca su Bing.
>
> Resta fuori **Umami**: lo script è commentato, quindi il sito non
> raccoglie nessuna statistica.

Una pagina sola, HTML e CSS statici. Nessun framework, nessun build step,
nessuna libreria esterna. Il carattere è Inter e sta dentro `fonts/`, non
viene da Google Fonts. L'unica cosa che arriva da fuori è lo script delle
statistiche (vedi sotto), che non usa cookie: quindi niente banner. Si
carica su GitHub Pages così com'è e funziona subito.

Il menu del telefono è senza JavaScript: il pulsante punta a `#menu` e il
pannello compare con `:target`. Toccando una voce l'ancora cambia e il
pannello si chiude da solo.

### L'unico pezzo di JavaScript

Sta in cima a `index.html`, dentro alla testa, ed è commentato riga per
riga. Fa due cose, tutte e due comodità:

1. **Fa entrare la barra dei contatti quando si comincia a scorrere.**
   Così appena si apre la pagina la barra non copre niente e si vede
   subito la fascia oro con gli orari.
2. **Scrive se adesso l'officina è aperta o chiusa**, e se è chiusa dice
   quando riapre. Segna anche qual è la riga di oggi nella scheda degli
   orari.

Se non gira (JavaScript spento, browser vecchio, errore) non si rompe
niente: la barra resta sempre visibile, la pastiglia aperto/chiuso resta
nascosta e in pagina restano gli orari scritti, che sono la cosa
importante.

L'ora è presa sul **fuso di Roma**, non su quello del telefono di chi
guarda, così è giusta anche per chi apre il sito dall'estero.

## Cosa c'è dentro

    index.html                  la pagina principale
    privacy/index.html          la pagina privacy
    404.html                    pagina non trovata, si regge da sola
    style.css                   unico foglio di stile
    fonts/InterVariable.woff2   il carattere, caricato da qui
    img/                        le foto, il logo, le icone e l'anteprima
    CNAME                       pronto ma NON committato (vedi .gitignore)

Le icone non sono una libreria: sono disegnate a mano in uno sprite SVG
in cima alla pagina. Anche la mappa della zona è un disegno SVG dentro
alla pagina, non una mappa di Google: per questo il sito non fa nessuna
chiamata esterna.

## Da dove vengono i dati

Nome, indirizzo, telefono, orari e coordinate sono presi dalla scheda
Google dell'attività. Le foto sono il servizio fatto in officina il 16 e
17 settembre 2026 (cartella `BomberGarage_foto_settembre`, scatti Canon
con le targhe già sfocate). Il logo è la foto profilo Facebook,
ritagliata in tondo con lo sfondo trasparente.

L'oro usato in tutto il sito (`--oro: #e8c888`) è campionato dal logo.

**Le targhe** delle moto dei clienti sono sfocate già negli originali.

**Le recensioni** in pagina sono vere, lasciate su Google. Sono citate
brevi e firmate con nome e iniziale del cognome, non con nome e cognome
per esteso, e senza le foto profilo delle persone. Il voto è scritto in
pagina e rimanda alla scheda, ma **non** è marcato nel JSON-LD: marcare
le recensioni di Google sul proprio sito è contro le loro linee guida e
si rischia una penalizzazione.

## Il dominio su Aruba

Pannello Aruba, dominio `bombergarage.it`, **Gestione DNS e Redirect**:

- quattro record **A** sul dominio senza www: `185.199.108.153`,
  `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
- un **CNAME** `www` verso `vxlyps.github.io`;
- un **TXT** `google-site-verification=...`: è la verifica di Search
  Console, non va tolto.

**Non toccare i record MX** né il TXT `v=spf1`, se ci sono: fanno
funzionare la posta del dominio.

Il file `CNAME` nella cartella contiene `bombergarage.it` ed è
committato: è quello che dice a GitHub Pages quale dominio servire. Se
si toglie, il sito torna su github.io.

Il certificato HTTPS lo rinnova da solo GitHub (Let's Encrypt). Se un
giorno `www` desse errore di certificato, la cura è togliere e rimettere
il dominio nelle impostazioni Pages del repository: GitHub ne chiede uno
nuovo che copre tutti e due i nomi.

## La promo a tempo (gomme, fino al 30 novembre 2026)

Tre pezzi in `index.html`, tutti con `data-promo-fine="2026-12-01T00:00:00+01:00"`:
la striscia sottile in cima (`.barra-promo`), il link oro nella scheda
"Sostituzione pneumatici" (`.link-promo`) e la sezione listino `#promo`,
subito dopo i servizi. Il CSS sta nella sezione 25 di `style.css`.

Sono **nascosti di partenza** (`hidden`): lo script in testa li mostra
solo se adesso è prima di quella data. Dal 1° dicembre spariscono da soli,
senza toccare niente; senza JavaScript non si vedono mai, quindi non resta
in giro una promo scaduta. La X della striscia la chiude per tutta la
visita (sessionStorage).

I prezzi sono "a partire da", come sui volantini di Daniele: non c'è
scritto se sono per la coppia né se il montaggio è compreso. Se lui lo
conferma, si aggiunge una riga sotto al titolo della sezione.

**Per la prossima promo**: si cambiano le righe del listino, i testi con
la data ("fino al 30 novembre", in tre punti) e `data-promo-fine` in tutti
e tre gli elementi. La data va scritta con il fuso di Roma: `+01:00`
d'inverno, `+02:00` d'estate. Finita una promo, i tre pezzi si possono
anche lasciare dove sono: restano nascosti.

## Farsi trovare: Google e le AI

- **Titolo e descrizione** puntano su "officina moto Roma" e "meccanico
  moto", con San Giovanni e l'indirizzo.
- **Dati strutturati** (JSON-LD nella testa): l'officina come
  `MotorcycleRepair` con indirizzo, coordinate, orari, servizi, titolare,
  scheda Maps e social; il sito come `WebSite`; le domande frequenti come
  `FAQPage`. Il voto delle recensioni **non** è marcato apposta (vedi
  "Le recensioni").
- **Domande frequenti** in pagina: le risposte ripetono solo cose già
  scritte nel resto del sito. Sono il tipo di testo che gli assistenti AI
  citano quando qualcuno chiede "un meccanico per lo scooter a San
  Giovanni". Se ne cambi una, cambiala anche nel JSON-LD.
- **`robots.txt`** apre tutto a tutti e nomina uno per uno i crawler
  delle AI (ChatGPT, Claude, Perplexity, Gemini, Apple, Bing, Meta).
- **`llms.txt`**: scheda in testo semplice per gli assistenti AI, con
  contatti, orari e servizi. Va tenuta allineata alla pagina.
- **`sitemap.xml`**: quando si cambia la pagina si aggiorna `lastmod`.
- **IndexNow**: il file `513673f047bcd778397e8d1caff282e7.txt` nella
  radice è la chiave. Dopo una modifica importante si avvisa Bing (e da
  lì ChatGPT) con:
  ```
  curl "https://api.indexnow.org/indexnow?url=https://bombergarage.it/&key=513673f047bcd778397e8d1caff282e7"
  ```

La cosa che pesa di più per "officina moto Roma" resta comunque la
**scheda Google**: recensioni, foto, categoria giusta e il sito collegato.

## L'assistente del preventivo (`assistente.js`)

Il pulsante **Preventivo veloce** (in basso a destra, con la luce oro
che gira sul bordo, e la voce "Preventivo" nel menu) apre una piccola
chat sopra la pagina: su desktop una finestra nell'angolo, sul telefono
a schermo intero. La pagina sotto non si allunga e non si muove.

Si parte da un menu: **Un preventivo**, **Prezzi gomme** (solo mentre la
promo è attiva), **Siete aperti?**, **Ho una domanda**. Il preventivo fa
tre domande (scooter o moto, modello, cosa c'è da fare) e salta quelle a
cui si è già risposto. Poi dice "Domande finite" e mostra la richiesta
pronta con il pulsante **Invia a Daniele**: se si scrive qualcosa sotto
(la misura, dove sta il mezzo, quando si passa) la richiesta si aggiorna
lì. WhatsApp è solo il modo in cui la richiesta arriva a Daniele.
Chiudendo la finestra la conversazione resta dov'era.

**Non è un'AI** e non costa niente: niente server, niente cookie,
niente richieste esterne. Alle domande scritte risponde solo con i testi
che stanno già nella pagina:

- le **domande frequenti** e le **schede dei servizi** che hanno
  l'attributo `data-parole`. Le parole chiave stanno lì, accanto al
  testo: sono inizi di parola (`gomm` vale per gomma, gomme, gommista),
  `non+parte` è una frase intera, `~ducati` vale mezzo punto (basta per
  rispondere "qualunque marca", ma perde contro un argomento vero);
- **aperto o chiuso adesso**, letto dalla pastiglia sotto l'apertura;
- la **promo gomme**, letta dal listino e solo finché è visibile. Le
  righe con `data-cerca` riconoscono il modello scritto ("SH 150",
  "xadv 350") e il prezzo finisce anche nel messaggio.

Se non sa rispondere non inventa: dice di chiederlo a Daniele e prepara
il messaggio WhatsApp con la domanda dentro. Tempi di consegna,
pagamenti, disponibilità: li sa solo lui.

Per cambiare le voci tra cui si sceglie (tagliando, gomme...) si modifica
l'elenco `SERVIZI` in cima ad `assistente.js`. Se si cambia una domanda
frequente, l'assistente usa subito il testo nuovo.

Senza JavaScript il pulsante e la voce del menu portano dritti a
WhatsApp, quindi non resta mai un pulsante morto.

## Dopo ogni modifica al CSS: cambiare il numero di versione

GitHub Pages dice ai browser di tenere i file in memoria per 10 minuti.
Se si cambia `style.css` e l'HTML insieme, chi ha la pagina aperta può
vedere l'HTML nuovo con il CSS vecchio: pastiglie senza stile, link
sottolineati, pezzi fuori posto. Per evitarlo il link al foglio di stile
ha un numero di versione:

    <link rel="stylesheet" href="style.css?v=20261027">

Quando si cambia `style.css` o `assistente.js`, si cambia quel numero
(data più un contatore: `2026102705`) in `index.html` e in
`privacy/index.html`. Un comando solo:

    sed -i '' 's|?v=[0-9]*|?v=AAAAMMGGNN|g' index.html privacy/index.html

## Come si cambiano le cose

**Gli orari** stanno in quattro posti: la fascia oro sotto all'apertura,
la scheda "Orari" nella sezione "Dove siamo", il blocco
`openingHoursSpecification` nel JSON-LD in fondo, e le due righe `APRE`
e `CHIUDE` in cima allo script (che sono in minuti dalla mezzanotte:
`9 * 60` e `18 * 60`). Se cambiano, vanno cambiati in tutti e quattro.

**Le foto** stanno in `img/`. Per sostituirne una basta salvare quella
nuova con lo stesso nome, in webp, e aggiornare i numeri `width` e
`height` nel tag `img` che la usa.

**I colori e le spaziature** stanno tutti in cima a `style.css`, nel
blocco delle variabili. Il file è diviso in sezioni numerate.

## Le foto in pagina

Ogni foto ha due tagli: uno orizzontale per lo schermo largo e uno
verticale per il telefono, scelti con `<picture>`. I verticali vengono
dalle cartelle `storie_9x16` e `feed_4x5` del servizio, già ritagliati
dal fotografo; gli orizzontali da `alta_3000px`, rimpiccioliti.

- **Apertura**: la moto nera con la scritta oro. `apertura-nera.webp`
  (2000x1332) sugli schermi più larghi che alti, `apertura-nera-verticale.webp`
  (900x1600, coi fari accesi) sul telefono.
- **L'officina**: `daniele-al-banco.webp` (1080x1350).
- **Galleria**: sei foto, `galleria-<nome>.webp` (1600x1066) e
  `galleria-<nome>-4x5.webp` (900x1125). Si scorre col dito o con le
  frecce; lo script in testa la fa avanzare da sola ogni 6 secondi solo
  quando è sullo schermo, si mette in pausa col mouse sopra e si ferma
  appena qualcuno la tocca. Per aggiungere una foto basta copiare un
  blocco `<figure class="foto">`: il contatore si aggiorna da solo
  (va cambiato a mano solo il totale "/ 06" e l'`aria-label` "x di 6").

Le foto vecchie (prese da Facebook e Google) sono state tolte; restano
nella storia di git se mai servissero.

## Statistiche e privacy

Le statistiche sarebbero di **Umami Cloud**, ma **adesso lo script è
commentato**: il sito non fa nessuna richiesta a nessun server esterno,
zero. Carattere, icone, mappa e anteprima sono tutti serviti da qui.

Per riaccenderlo, su **tutte e tre le pagine**:

1. togliere i due segni di commento attorno al tag `<script>` di Umami
   nella testa (la riga `<!--` sopra e la riga `-->` sotto);
2. sostituire `UMAMI_WEBSITE_ID` con l'id vero preso dal pannello di
   Umami Cloud.

Umami non usa cookie né localStorage e non profila nessuno, quindi anche
da acceso non serve nessun banner.

Le marcature `data-umami-event` sui pulsanti sono rimaste nel markup:
non fanno niente a script spento, e quando torna acceso funzionano
subito senza toccare altro.

Tutti i pulsanti sono marcati con `data-umami-event`, con la posizione
dentro al nome, così dal pannello si vede quale converte:

    chiama-header      whatsapp-header
    chiama-hero        whatsapp-hero
    chiama-contatti    whatsapp-contatti
    chiama-sticky      whatsapp-sticky
    chiama-menu        whatsapp-menu      (menu del telefono)
    chiama-footer                         (numero nel piede)
    chiama-404         chiama-privacy
    mappa-google       recensioni-google
    instagram          facebook           email

I link `wa.me` hanno `target="_blank" rel="noopener"`: la pagina non si
scarica, quindi l'evento fa in tempo a partire. I `tel:` invece navigano
normalmente, perché aprono il telefono e la pagina resta dov'è.

## L'anteprima quando si manda il link

`img/anteprima-whatsapp.jpg`, JPEG vero 1200x630, 97 KB (WhatsApp salta
la miniatura sopra i 300 KB circa). Stemma e nome grande a sinistra sul
nero, a destra la moto nera con la scritta oro, leggibile anche a
francobollo. È in JPEG e non in
webp perché l'anteprima di WhatsApp e Facebook col webp non è
affidabile. Ci puntano sia `og:image` sia `twitter:image`, con
`og:image:type`, `width`, `height` e `alt`.

## Le cose da riempire

Si trovano tutte con un grep solo:

    grep -rn "DA-COMPILARE" .

Non è rimasto niente. La partita IVA (18635281001) sta nel piede di
pagina, nella pagina privacy e nel JSON-LD come `vatID`. L'email
(bombergarage34@gmail.com) sta nel blocco contatti e nel JSON-LD
come `email`.

## Attenzione se metti mano ai commenti HTML

Dentro a un commento HTML non si possono scrivere i due segni che aprono
e chiudono un commento: se li scrivi, il commento si chiude davvero in
quel punto e tutto il testo che segue finisce visibile in cima alla
pagina. È già successo una volta con le istruzioni di Umami.

## Le recensioni

Sono tutte vere, prese dalla scheda Google, e ultimo controllo il
27 ottobre 2026: **24 recensioni, media 5,0**. Di queste una dozzina hanno
un testo, le altre sono solo stelle. In pagina ce ne sono 8, le più
nuove per prima, accorciate e firmate con nome e iniziale.

Per aggiornarle: aprire la scheda su Google Maps, tab "Recensioni", e
ricopiare quelle che compaiono. Il conteggio sta in un posto solo, il
badge sopra le schede.

**Da desktop avanzano da sole**: ne stanno tre in vista, restano ferme
sei secondi e mezzo, poi il nastro scatta di una posizione e ne entra
una nuova da destra. Giro completo in 64 secondi (8 passi da 8). Sul
telefono si scorrono col dito, senza nessun movimento automatico.

Le schede sono scritte **due volte** in `index.html`: la seconda serie
ha `aria-hidden="true"`, serve solo a far ripartire il giro senza che si
veda il salto, ed è nascosta quando il nastro non è attivo.

**Se cambia il numero di recensioni** vanno aggiornate tre cose: le
schede in tutte e due le serie, e in `style.css` (sezione 23) la durata
`animation: passo-recensioni 64s infinite` e le percentuali dei
keyframe, che sono un passo ogni 1/N del giro (con 5 recensioni: 20%,
40%, 60%, 80%, 100%; con N recensioni, la durata è N × 8 secondi).

## I servizi

Stanno in `index.html`, sezione "Cosa si fa qui", divisi in tre gruppi
in ordine di come uno ci arriva:

1. **In officina** — quello per cui si porta la moto: tagliandi e
   riparazioni, pneumatici, revisioni.
2. **Elettronica e modifiche** — quello che si fa fare per scelta:
   centraline e personalizzazioni. Sono due schede più larghe apposta,
   così il gruppo non lascia un buco nella griglia.
3. **Pratiche e trasporti** — le rogne che si prende l'officina: CID e
   assicurazioni, ritiro e trasporto, consulenza sull'usato.

Per aggiungerne uno si copia un blocco `.lavoro`, si sceglie un'icona
dallo sprite in cima alla pagina e si aggiunge il servizio anche in
`makesOffer` nel JSON-LD.

## Il messaggio precompilato di WhatsApp

Quando uno tocca il pulsante WhatsApp, si apre la chat con già scritto:

> Ciao! Vi ho trovati sul sito. Avrei bisogno di un preventivo per la
> mia moto.

È una frase intera apposta: molta gente preme invio senza aggiungere
niente, e così arriva comunque un messaggio sensato che dice anche da
dove viene. Per cambiarlo si modifica la parte dopo `?text=` nei cinque
link `wa.me` di `index.html`, ricordandosi che va scritto in formato
URL (gli spazi diventano `%20`).

## I loghi degli altri

Nei contatti ci sono i marchi veri di **Instagram** e **Facebook**, nei
loro colori (`#e4405f` e `#1877f2`), e nelle recensioni la **G** di
Google a quattro colori. Sono lì per dire da dove arrivano le cose, non
per decorare: per questo tengono i colori loro e non entrano nella
tavolozza nero e oro del sito. Stanno tutti nello sprite delle icone in
cima alla pagina, e il colore si cambia da `style.css` (`.logo-social`).
