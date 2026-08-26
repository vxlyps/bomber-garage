# Bomber Garage

Sito di BomberGarage, officina moto in via Umberto Biancamano 34 a Roma.

> ## IL SITO È PUBBLICO
>
> Il `noindex` è stato tolto: Google può indicizzarlo. L'indirizzo è
> `vxlyps.github.io/bomber-garage`, il dominio arriverà dopo.
>
> **Da fare adesso, in ordine di importanza:**
>
> 1. **Mettere l'indirizzo del sito sulla scheda Google dell'attività.**
>    Nella scheda c'è ancora "Aggiungi sito web". È la cosa che porta più
>    gente di qualunque altra: quasi tutti arrivano da Maps, non da una
>    ricerca su Google.
> 2. **Google Search Console.** Gratis, nessuno script da mettere in
>    pagina, nessun banner. Dice con quali ricerche lo trovano.
>
> **Quando arriva il dominio:**
>
> 1. Cambiare l'indirizzo, un comando solo dalla cartella del sito:
>    ```
>    sed -i '' 's|https://vxlyps.github.io/bomber-garage|https://IL-TUO-DOMINIO.it|g' index.html privacy/index.html 404.html
>    ```
> 2. Scrivere il dominio dentro al file `CNAME`, togliere la riga
>    `/CNAME` da `.gitignore`, e committare. **Solo a record DNS già a
>    posto**, mai prima.
>
> Cambiare dominio dopo non brucia niente: appena GitHub Pages vede il
> `CNAME`, manda da solo un redirect permanente dal vecchio indirizzo
> `github.io` a quello nuovo, quindi quel poco che Google ha già
> indicizzato si sposta senza perdersi.
>
> Resta fuori anche **Umami**: lo script è commentato, quindi in questo
> momento il sito non raccoglie nessuna statistica.

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

1. **Email.** Non ne è stata trovata una pubblica, quindi nel blocco
   contatti c'è un segnaposto. Quando c'è, nell'HTML sopra al segnaposto
   c'è già pronto il commento con il pezzo di codice da usare, e va
   aggiunto anche `"email"` nel JSON-LD in fondo.
2. **Il dominio.** Vedi sotto.

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
    instagram          facebook           email

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

Non è rimasto niente. La partita IVA (18635281001) sta nel piede di
pagina, nella pagina privacy e nel JSON-LD come `vatID`. L'email
(bombersmotorcycle.info@gmail.com) sta nel blocco contatti e nel JSON-LD
come `email`.

## Attenzione se metti mano ai commenti HTML

Dentro a un commento HTML non si possono scrivere i due segni che aprono
e chiudono un commento: se li scrivi, il commento si chiude davvero in
quel punto e tutto il testo che segue finisce visibile in cima alla
pagina. È già successo una volta con le istruzioni di Umami.

## Le recensioni che avanzano

Da desktop ne stanno tre in vista: restano ferme sei secondi e mezzo,
poi il nastro scatta di una posizione e ne entra una nuova da destra.
Giro completo in 24 secondi. Sul telefono si scorrono col dito come
prima, senza nessun movimento automatico.

Le tre schede sono scritte **due volte** in `index.html`: la seconda
serie ha `aria-hidden="true"`, serve solo a far ripartire il giro senza
che si veda il salto, ed è nascosta quando il nastro non è attivo.

Per cambiare il ritmo si tocca solo la durata in `style.css`, sezione
24: `animation: passo-recensioni 24s infinite`. Le percentuali dentro ai
keyframe sono la sosta e lo scatto, e restano proporzionate da sole.

**Se aggiungi o togli una recensione, fallo in tutte e due le serie**,
altrimenti il giro non si chiude e si vede il salto.

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
