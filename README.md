# Bomber Garage

Sito di BomberGarage, officina moto in via Umberto Biancamano 34 a Roma.

Una pagina sola, HTML e CSS statici. Nessun framework, nessun build step,
nessuna libreria esterna, **zero JavaScript**. Il carattere è Inter e sta
dentro `fonts/`, non viene da Google Fonts: quindi niente richieste a
terzi, niente cookie e niente banner da mettere. Si carica su GitHub
Pages così com'è e funziona subito.

## Cosa c'è dentro

    index.html                  tutta la pagina
    style.css                   unico foglio di stile
    fonts/InterVariable.woff2   il carattere, caricato da qui
    img/                        le foto e il logo, in webp
    CNAME.txt                   il dominio, da attivare quando c'è

Le icone non sono una libreria: sono disegnate a mano in uno sprite SVG
in cima alla pagina e richiamate con `<use>`. Anche la mappa della zona è
un disegno SVG dentro alla pagina, non una mappa di Google: per questo il
sito non fa nessuna chiamata esterna.

## Da dove vengono i dati

Nome, indirizzo, telefono, orari e coordinate sono presi dalla scheda
Google dell'attività. Le foto vengono dalla pagina Facebook
(`bombersmotorcycle`) e dalla scheda Google. Il logo è la foto profilo
Facebook, ritagliata in tondo con lo sfondo trasparente.

L'oro usato in tutto il sito (`--oro: #e8c888`) è campionato dal logo.

## Da sistemare prima di darlo per buono

1. **Partita IVA.** Nel piede di pagina c'è scritto `DA INSERIRE`.
2. **Il dominio.** Adesso gli indirizzi dentro la pagina puntano a
   `vxlyps.github.io/bomber-garage`, che è dove sta online oggi. Quando
   si compra un dominio vanno cambiati in tre punti di `index.html`:
   il `<link rel="canonical">`, il tag `og:url` e i campi `url`, `@id`,
   `image` e `logo` dentro al JSON-LD in fondo.
3. **Email.** Non ne è stata trovata una pubblica, quindi in pagina non
   c'è. Se ce l'ha, si aggiunge nel blocco contatti accanto a Instagram e
   Facebook, e come `"email"` nel JSON-LD.
4. **Le targhe.** Nelle foto dell'officina si leggono le targhe di alcune
   moto dei clienti. Sono già pubbliche su Google, ma se si preferisce si
   possono sfocare prima di pubblicare.

Il voto di Google (5,0) è scritto in pagina e rimanda alla scheda, ma
**non** è marcato nel JSON-LD: marcare le recensioni di Google sul
proprio sito è contro le loro linee guida e si rischia una penalizzazione.

## Come si cambiano le cose

**Gli orari** stanno in due posti: la scheda "Orari" dentro la sezione
"Dove siamo", e il blocco `openingHoursSpecification` nel JSON-LD in
fondo. Vanno cambiati in tutti e due.

**Le foto** stanno in `img/`. Per sostituirne una basta salvare quella
nuova con lo stesso nome, in webp, e aggiornare i numeri `width` e
`height` nel tag `img` che la usa.

**I colori e le spaziature** stanno tutti in cima a `style.css`, nel
blocco delle variabili. Il file è diviso in sezioni numerate.

## Mettere un dominio su GitHub Pages

Nel pannello DNS del dominio servono:

**Quattro record A** per il dominio senza www, host vuoto (o `@`):

    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153

**Un record CNAME** per il www:

    host: www        valore: vxlyps.github.io

### Attenzione ai record MX

**Non toccare i record MX** e il record TXT che comincia con `v=spf1`:
sono quelli della posta. Se si cancellano, la casella smette di
ricevere. Si cambiano solo i record A e il CNAME del www.

### Il file CNAME

In questa cartella c'è `CNAME.txt`. **Va rinominato in `CNAME`, senza
estensione, solo quando i record DNS sopra sono a posto.** Se lo si
attiva prima, GitHub manda tutti sul dominio nuovo e il sito non si apre
più nemmeno dall'indirizzo github.io. Dentro va scritto il dominio
scelto, uno solo, senza `http://`.

Poi, nelle impostazioni del repository su GitHub, sezione **Pages**, si
mette il dominio come dominio personalizzato e si spunta **Enforce
HTTPS** quando il certificato è pronto.
