Link alla cartella drive con la documentazione richiesta:https://drive.google.com/drive/folders/1Mm6AR_gUpt1b4JWYNnJQnMthlHBknvR-?usp=sharing

# 🚀 StudyPlanner Pro — Study Planner & Exam Tracker

**StudyPlanner Pro** è un'applicazione mobile cross-platform concepita per la gestione della carriera accademica e l'ottimizzazione dei flussi di studio. Sviluppata interamente in **React Native** con **Expo (SDK 54)** e **TypeScript**, l'app centralizza tutti gli strumenti utili a uno studente universitario (calendario, libretto, To-Do list e time-tracking), eliminando la frammentazione dei dati e contrastando la procrastinazione.

Progetto realizzato dal **Gruppo 21** per il corso di *Mobile Programming* (Anno Accademico 2025/2026) dell'Università degli Studi di Salerno.

---

## 📌 Indice
* [✨ Funzionalità Principali](#-funzionalità-principali)
* [🌟 Feature Avanzate](#-feature-avanzate)
* [🛠️ Stack Tecnologico](#️-stack-tecnologico)
* [🏗️ Architettura e Gestione Dati](#️-architettura-e-gestione-dati)
* [🚀 Installazione e Avvio](#-installazione-e-avvio)
* [👥 Team di Sviluppo](#-team-di-sviluppo)

---

## ✨ Funzionalità Principali

L'applicazione si articola in 6 macro-aree interconnesse tramite una comoda barra di navigazione inferiore:

* **📊 Dashboard (Home):** L'hub centrale che offre un colpo d'occhio immediato sulla carriera con widget dinamici per esami imminenti, task in scadenza e metriche generali.
* **📚 Gestione Corsi:** Un sistema CRUD completo per monitorare gli insegnamenti, impostare i CFU e definire un voto target.
* **📅 Esami e Scadenze:** Sezione per pianificare gli appelli (Scritti, Orali o Progetti) e registrarne l'esito (*Superato* o *Respinto*) con vincoli logici di business.
* **📝 Agenda e Task:** Una To-Do List interattiva supportata da un calendario a scorrimento orizzontale per pianificare le attività quotidiane micro-obiettivo per micro-obiettivo.
* **⏱️ Timer Pomodoro:** Un modulo dedicato al *Deep Work* con controlli grafici per avviare e gestire sessioni di focus associate a specifici corsi.
* **📈 Statistiche e Analisi:** Un cruscotto analitico che calcola in tempo reale la media ponderata, i CFU acquisiti e la distribuzione oraria dello studio.

---

## 🌟 Feature Avanzate

A differenza dei comuni tracker statici, StudyPlanner Pro integra funzionalità intelligenti:
1.  **🧠 Assistente di Studio Predittivo:** Una logica algoritmica che riorganizza le priorità quotidiane suggerendo su quale materia concentrarsi in base alla prossimità temporale degli esami.
2.  **🔗 Correlazione Attiva dei Dati:** Il tempo registrato tramite il timer Pomodoro incrementa e aggiorna dinamicamente le statistiche globali del corso a cui il task è associato.
3.  **📆 Calendario Mensile Interattivo:** Una vista completa per monitorare visivamente su base mensile appelli, scadenze e sessioni passate.

---

## 🛠️ Stack Tecnologico

L'ecosistema dell'applicazione è stato mantenuto leggero e performante, puntando su componenti custom nativi anziché pesanti UI kit esterni:

* **Framework Core:** React Native (Expo SDK 54) con tipizzazione statica TypeScript.
* **Navigazione:** Expo Router (File-based routing) per una gestione pulita dei flussi tabulari e dei modali in sovrimpressione.
* **Persistenza Dati:** Operatività 100% offline tramite serializzazione JSON su `@react-native-async-storage/async-storage`.
* **Grafica e Icone:** `react-native-svg` per la renderizzazione fluida di grafiche vettoriali, affiancata da `@expo/vector-icons`.

### ⚡ Ottimizzazioni UX/UI e Performance
* **60 FPS Stabili:** Utilizzo del componente nativo `FlatList` con virtualizzazione dei nodi e *lazy loading* per le liste massive e dinamiche.
* **Layout Ottimizzato:** Approccio ibrido con mappaggio `.map()` JavaScript per evitare l'errore di liste virtualizzate annidate (*Nested VirtualizedLists*) negli scorrimenti locali.
* **Gestione Tastiera Nativa:** Implementazione combinata di `KeyboardAvoidingView` differenziato per piattaforma (iOS/Android) e chiusura del form al tocco esterno tramite `TouchableWithoutFeedback`.

---

## 🏗️ Architettura e Gestione Dati

L'applicazione adotta una filosofia **User-Centered Design**. Mancando un backend remoto, la stabilità dell'architettura si poggia su:
* **Single Source of Truth:** Gestione dello stato globale centralizzata tramite **Context API** di React per sincronizzare all'istante tutte le schermate.
* **Modello Relazionale Locale:** Struttura ad entità correlate tipizzata in TypeScript: `Corso` (Entità Padre) ➡️ `Task` / `Esame` / `Sessione di Studio` (Entità Figlie collegate tramite ID di riferimento).

---

## 🚀 Installazione e Avvio

### Prerequisiti
Assicurati di avere installati sul tuo computer:
* **Node.js** (versione 18 o superiore) e il gestore pacchetti **npm**.
* L'applicazione **Expo Go** sul tuo smartphone (iOS o Android) oppure un emulatore configurato.

### 1. Ottieni il codice
È possibile clonare la repository tramite Git oppure scaricare direttamente l'archivio ZIP da GitHub ed estrarlo sul computer. 

Se usi il terminale Git, lancia il comando:
```bash
git clone [https://github.com/G3rry2000/progettoMobile.git](https://github.com/G3rry2000/progettoMobile.git)
cd progettoMobile
```

### 2. Configura ed Esegui
Una volta all'interno della cartella del progetto tramite terminale, esegui i seguenti comandi per installare i moduli e avviare Expo:

```bash
# Installa tutte le dipendenze necessarie
npm install

# Avvia il server di sviluppo di Expo
npm start
```

## 👥 Team di Sviluppo

Il progetto è stato sviluppato in modalità Agile tramite controllo versione Git su branch dedicate, dai membri del **Gruppo 21**:

* **Gerardo Carino** — Matricola: 0612710164
* **Donato Finiello** — Matricola: 0612709377
* **Mara Mariano** — Matricola: 0612709247
* **Cataldo Sabato** — Matricola: 0612709472
* **Daniel Vita** — Matricola: 0612709007



