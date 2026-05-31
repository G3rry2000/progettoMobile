Link alla cartella drive con la documentazione richiesta:https://drive.google.com/drive/folders/1Mm6AR_gUpt1b4JWYNnJQnMthlHBknvR-?usp=sharing

# 🚀 StudyPlanner Pro — Study Planner & Exam Tracker

[cite_start]**StudyPlanner Pro** è un'applicazione mobile cross-platform concepita per la gestione della carriera accademica e l'ottimizzazione dei flussi di studio[cite: 63]. [cite_start]Sviluppata interamente in **React Native** con **Expo (SDK 54)** e **TypeScript** [cite: 291][cite_start], l'app centralizza tutti gli strumenti utili a uno studente universitario (calendario, libretto, To-Do list e time-tracking), eliminando la frammentazione dei dati e contrastando la procrastinazione[cite: 65, 78].

[cite_start]Progetto realizzato dal **Gruppo 21** [cite: 38] [cite_start]per il corso di *Mobile Programming* [cite: 35] (Anno Accademico 2025/2026) [cite_start][cite: 53] [cite_start]dell'Università degli Studi di Salerno[cite: 26].

---

## 📌 Indice
* [✨ Funzionalità Principali](#-funzionalità-principali)
* [🌟 Feature Avanzate](#-feature-avanzate)
* [🛠️ Stack Tecnologico](#️-stack-tecnologico)
* [🏗️ Architettura e Gestione Dati](#️-architettura-e-gestione-dati)
* [🚀 Installazione e Avvio](#-installazione-e-avvio)
* [🗺️ Roadmap (Sviluppi Futuri)](#️-roadmap-sviluppi-futuri)
* [👥 Team di Sviluppo](#-team-di-sviluppo)

---

## ✨ Funzionalità Principali

[cite_start]L'applicazione si articola in 6 macro-aree interconnesse tramite una comoda barra di navigazione inferiore[cite: 239, 240]:

* [cite_start]**📊 Dashboard (Home):** L'hub centrale che offre un colpo d'occhio immediato sulla carriera con widget dinamici per esami imminenti, task in scadenza e metriche generali[cite: 244].
* [cite_start]**📚 Gestione Corsi:** Un sistema CRUD completo per monitorare gli insegnamenti, impostare i CFU e definire un voto target[cite: 103, 109].
* [cite_start]**📅 Esami e Scadenze:** Sezione per pianificare gli appelli (Scritti, Orali o Progetti) e registrarne l'esito (*Superato* o *Respinto*) con vincoli logici di business[cite: 132, 136, 137].
* [cite_start]**📝 Agenda e Task:** Una To-Do List interattiva supportata da un calendario a scorrimento orizzontale per pianificare le attività quotidiane micro-obiettivo per micro-obiettivo[cite: 248, 249].
* [cite_start]**⏱️ Timer Pomodoro:** Un modulo dedicato al *Deep Work* con controlli grafici per avviare e gestire sessioni di focus associate a specifici corsi[cite: 250].
* [cite_start]**📈 Statistiche e Analisi:** Un cruscotto analitico che calcola in tempo reale la media ponderata, i CFU acquisiti e la distribuzione oraria dello studio[cite: 251, 252].

---

## 🌟 Feature Avanzate

A differenza dei comuni tracker statici, StudyPlanner Pro integra funzionalità intelligenti:
1.  [cite_start]**🧠 Assistente di Studio Predittivo:** Una logica algoritmica che riorganizza le priorità quotidiane suggerendo su quale materia concentrarsi in base alla prossimità temporale degli esami[cite: 227].
2.  [cite_start]**🔗 Correlazione Attiva dei Dati:** Il tempo registrato tramite il timer Pomodoro incrementa e aggiorna dinamicamente le statistiche globali del corso a cui il task è associato[cite: 66].
3.  [cite_start]**📆 Calendario Mensile Interattivo:** Una vista completa per monitorare visivamente su base mensile appelli, scadenze e sessioni passate[cite: 225].

---

## 🛠️ Stack Tecnologico

[cite_start]L'ecosistema dell'applicazione è stato mantenuto leggero e performante, puntando su componenti custom nativi anziché pesanti UI kit esterni[cite: 295]:

* [cite_start]**Framework Core:** React Native (Expo SDK 54) con tipizzazione statica TypeScript[cite: 291].
* [cite_start]**Navigazione:** Expo Router (File-based routing) per una gestione pulita dei flussi tabulari e dei modali in sovrimpressione[cite: 254, 298, 299].
* [cite_start]**Persistenza Dati:** Operatività 100% offline tramite serializzazione JSON su `@react-native-async-storage/async-storage`[cite: 208, 337, 338].
* [cite_start]**Grafica e Icone:** `react-native-svg` per la renderizzazione fluida di grafiche vettoriali, affiancata da `@expo/vector-icons`[cite: 301, 302, 303].

### ⚡ Ottimizzazioni UX/UI e Performance
* [cite_start]**60 FPS Stabili:** Utilizzo del componente nativo `FlatList` con virtualizzazione dei nodi e *lazy loading* per le liste massive e dinamiche[cite: 205, 316, 317].
* [cite_start]**Layout Ottimizzato:** Approccio ibrido con mappaggio `.map()` JavaScript per evitare l'errore di liste virtualizzate annidate (*Nested VirtualizedLists*) negli scorrimenti locali[cite: 324, 325].
* [cite_start]**Gestione Tastiera Nativa:** Implementazione combinata di `KeyboardAvoidingView` differenziato per piattaforma (iOS/Android) e chiusura del form al tocco esterno tramite `TouchableWithoutFeedback`[cite: 211, 212, 309, 310, 311, 312].

---

## 🏗️ Architettura e Gestione Dati

[cite_start]L'applicazione adotta una filosofia **User-Centered Design**[cite: 238]. Mancando un backend remoto, la stabilità dell'architettura si poggia su:
* [cite_start]**Single Source of Truth:** Gestione dello stato globale centralizzata tramite **Context API** di React per sincronizzare all'istante tutte le schermate[cite: 209, 265].
* [cite_start]**Modello Relazionale Locale:** Struttura ad entità correlate tipizzata in TypeScript: `Corso` (Entità Padre) ➡️ `Task` / `Esame` / `Sessione di Studio` (Entità Figlie collegate tramite ID di riferimento)[cite: 264, 266, 274].

---

## 🚀 Installazione e Avvio

### Prerequisiti
Assicurati di avere installati sul tuo computer:
* [cite_start]**Node.js** (versione 18 o superiore) e il gestore pacchetti **npm**[cite: 367].
* [cite_start]L'applicazione **Expo Go** sul tuo smartphone (iOS o Android) oppure un emulatore configurato[cite: 368].

## 🚀 Installazione e Avvio

### 1. Ottieni il codice
Puoi clonare la repository o scaricare direttamente l'archivio ZIP da GitHub ed estrarlo sul tuo computer. 

Se usi Git, lancia il comando:
```bash
git clone [https://github.com/G3rry2000/progettoMobile.git](https://github.com/G3rry2000/progettoMobile.git)
cd progettoMobile





   
