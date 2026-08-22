# Bomber Garage

Sito di BomberGarage, officina moto in via Umberto Biancamano 34 a Roma.

> ## ⚠️ AL LANCIO: TRE COSE, IN QUEST'ORDINE
>
> **1. Togliere il noindex.**
> Cancellare la riga `<meta name="robots" content="noindex, nofollow">`
> (e il commento sopra) da **tutte e tre** le pagine: `index.html`,
> `privacy/index.html`, `404.html`. Finché c'è, Google non indicizza.
>
> **2. Cambiare l'indirizzo del sito.**
> Dalla cartella del sito, un comando solo:
> ```
> sed -i '' 's|https://vxlyps.github.io/bomber-garage|https://IL-TUO-DOMINIO.it|g' index.html privacy/index.html 404.html
> ```
> Tutti gli indirizzi assoluti stanno nel blocco marcato
> "INDIRIZZO DEL SITO" nella testa di `index.html` (più due link nella
> 404): non ce ne sono altri sparsi in giro.
>
> **3. Committare il CNAME.**
> Scrivere il dominio dentro al file `CNAME` (adesso c'è un segnaposto),
> togliere la riga `/CNAME` da `.gitignore`, e committare.
> **Solo dopo che i record DNS sono già a posto**, mai prima.
>
> Extra, quando ci sono: riaccendere Umami (togliere i commenti attorno
> allo script e mettere l'id vero, su tre pagine), la partita IVA e
> l'email.

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
Google dell'attività. Le foto vengono dalla pagina Facebook
(`bombersmotorcycle`) e dalla scheda Google. Il logo è la foto profilo
Facebook, ritagliata in tondo con lo sfondo trasparente.

L'oro usato in tutto il sito (`--oro: #e8c888`) è campionato dal logo.

**Le targhe** delle moto dei clienti nella foto dell'officina sono state
sfocate.

**Le recensioni** in pagina sono vere, lasciate su Google. Sono citate
brevi e firmate con nome e iniziale del cognome, non con nome e cognome
per esteso, e senza le foto profilo delle persone. Il voto è scritto in
pagina e rimanda alla scheda, ma **non** è marcato nel JSON-LD: marcare
le recensioni di Google sul proprio sito è contro le loro linee guida e
si rischia una penalizzazione.

## Da sistemare

1. **Partita IVA.** Nel piede di pagina c'è un segnaposto tratteggiato.
2. **Email.** Non ne è stata trovata una pubblica, quindi nel blocco
   contatti c'è un segnaposto. Quando c'è, nell'HTML sopra al segnaposto
   c'è già pronto il commento con il pezzo di codice da usare, e va
   aggiunto anche `"email"` nel JSON-LD in fondo.
3. **Il dominio.** Vedi sotto.

## Il dominio su Aruba

Quando il dominio è comprato, nel pannello Aruba si apre il dominio e si
va su **Gestione DNS e Redirect**.

**Record A** per il dominio senza www. Host vuoto (o `@`), quattro
record, uno per riga:

    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153

Se Aruba ha già messo un record A che punta al suo hosting, va
sostituito con questi quattro.

**Record CNAME** per il www:

    host: www        valore: vxlyps.github.io

(con il punto finale, se il pannello Aruba lo richiede)

### Attenzione ai record MX

**Non toccare i record MX.** Sono quelli che fanno arrivare la posta
della casella del dominio. Se si cancellano o si modificano, la posta
smette di funzionare. Vale anche per il record TXT che comincia con
`v=spf1`: si lascia dov'è.

Si cambiano **solo** i record A e il CNAME del www. Tutto il resto resta
com'è.

### Il file CNAME

In questa cartella c'è `CNAME.txt` con dentro un dominio di esempio.
Vanno fatte due cose, **in quest'ordine**:

1. Scriverci dentro il dominio vero, uno solo, senza `http://`.
2. Rinominarlo in `CNAME`, senza estensione, **solo quando i record DNS
   sopra sono già a posto.** Se lo si attiva prima, GitHub manda tutti
   sul dominio nuovo e il sito non si apre più nemmeno dall'indirizzo
   github.io.

Poi, nelle impostazioni del repository su GitHub, sezione **Pages**, si
mette il dominio come dominio personalizzato e si spunta **Enforce
HTTPS** quando il certificato è pronto (da qualche minuto a qualche ora).

La propagazione del DNS di Aruba di solito ci mette da un'ora a un
giorno.

### E gli indirizzi dentro la pagina

Adesso puntano a `vxlyps.github.io/bomber-garage`, che è dove sta online
oggi. Quando il dominio è attivo vanno cambiati in `index.html`: il
`<link rel="canonical">`, il tag `og:url`, `og:image`, e i campi `url`,
`@id`, `image` e `logo` dentro al JSON-LD in fondo. Sono tutti in due
punti soli del file, la testa e il fondo.

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

## Le foto messe da parte

In `img/` ci sono cinque foto che al momento non sono usate in pagina:
`carburatore`, `motore-prima`, `motore-dopo`, `yamaha-xjr`, `forcella`.
Erano di una sezione "Il lavoro" con il prima e dopo del motore, tolta
perché troppo specifica per una pagina di presentazione. Sono rimaste
nella cartella: quando si vorrà fare una pagina dei lavori sono già
pronte e ritagliate.

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
    instagram          facebook

I link `wa.me` hanno `target="_blank" rel="noopener"`: la pagina non si
scarica, quindi l'evento fa in tempo a partire. I `tel:` invece navigano
normalmente, perché aprono il telefono e la pagina resta dov'è.

## L'anteprima quando si manda il link

`img/anteprima-whatsapp.jpg`, JPEG vero 1200x630, 120 KB (WhatsApp salta
la miniatura sopra i 300 KB circa). Stemma, nome grande e foto
dell'officina sotto, leggibile anche a francobollo. È in JPEG e non in
webp perché l'anteprima di WhatsApp e Facebook col webp non è
affidabile. Ci puntano sia `og:image` sia `twitter:image`, con
`og:image:type`, `width`, `height` e `alt`.

## Le cose da riempire

Si trovano tutte con un grep solo:

    grep -rn "DA-COMPILARE" .

Sono la partita IVA e l'email. In pagina si vedono come riquadri
tratteggiati in oro, così non passano inosservati.
