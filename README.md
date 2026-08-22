# Bomber Garage

Sito di BomberGarage, officina moto in via Umberto Biancamano 34 a Roma.

Una pagina sola, HTML e CSS statici. Nessun framework, nessun build step,
nessuna libreria esterna, **zero JavaScript**. Il carattere è Inter e sta
dentro `fonts/`, non viene da Google Fonts: quindi niente richieste a
terzi, niente cookie e niente banner da mettere. Si carica su GitHub
Pages così com'è e funziona subito.

Anche il menu del telefono è senza JavaScript: il pulsante punta a
`#menu` e il pannello compare con `:target`. Toccando una voce l'ancora
cambia e il pannello si chiude da solo.

## Cosa c'è dentro

    index.html                  tutta la pagina
    style.css                   unico foglio di stile
    fonts/InterVariable.woff2   il carattere, caricato da qui
    img/                        le foto e il logo, in webp
    CNAME.txt                   il dominio, da attivare quando c'è

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

**Gli orari** stanno in tre posti: la fascia oro sotto all'apertura, la
scheda "Orari" nella sezione "Dove siamo", e il blocco
`openingHoursSpecification` nel JSON-LD in fondo.

**Le foto** stanno in `img/`. Per sostituirne una basta salvare quella
nuova con lo stesso nome, in webp, e aggiornare i numeri `width` e
`height` nel tag `img` che la usa.

**I colori e le spaziature** stanno tutti in cima a `style.css`, nel
blocco delle variabili. Il file è diviso in sezioni numerate.
