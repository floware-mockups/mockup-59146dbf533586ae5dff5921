// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ChatUfficiEvento");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ChatUfficiEvento");
import { useState } from "react";
import { useTable, usePrototype, Card, Select, TextArea, Button, Badge, Checkbox } from "../floware";

export default function ChatUfficiEvento({ pageId }) {__mk();
  const corrente = useTable(pageId);
  const istanze = useTable("istanze");
  const atti = useTable("atti-e-scadenze");
  const chat = useTable("messaggi-uffici");
  const { notify } = usePrototype();
  const [scelto, setScelto] = useState("");
  const [testo, setTesto] = useState("");
  const [mittente, setMittente] = useState("Operatore demo A");
  const [destinatari, setDestinatari] = useState(["Segreteria"]);
  if (!["istanze", "atti-e-scadenze", "messaggi-uffici"].includes(pageId)) return null;
  if (!corrente || !chat || corrente.column("Evento") < 0) return <p>Chat non disponibile: manca il registro o la colonna Evento.</p>;
  const colonne = ["Evento", "Mittente", "Ufficio", "Data e ora", "Messaggio"];
  if (colonne.some((nome) => (__mk(), chat.column(nome) < 0))) return <p>Ripristinare le colonne del registro messaggi per usare la chat.</p>;
  const nomiEventi = [];
  for (const tabella of [corrente, istanze, atti]) {__mk();
    if (tabella && tabella.column("Evento") >= 0) {
      for (const r of tabella.rows) {__mk();
        const nome = tabella.value(r, "Evento").trim();
        if (nome && !nomiEventi.includes(nome)) nomiEventi.push(nome);
      }
    }
  }
  const evento = nomiEventi.includes(scelto) ? scelto : (nomiEventi[0] || "");
  const uffici = ["Segreteria", "Ufficio tecnico", "Polizia locale", "Ufficio cultura"];
  for (const r of chat.rows) {__mk();
    for (const nome of chat.value(r, "Ufficio").split(";")) {__mk();
      const ufficio = nome.trim();
      if (ufficio && !uffici.includes(ufficio)) uffici.push(ufficio);
    }
  }
  const messaggi = chat.rows.filter((r) => (__mk(), chat.value(r, "Evento") === evento)).map((r, i) => ((__mk(), { r, i, data: chat.value(r, "Data e ora") }))).sort((a, b) => (__mk(), a.data < b.data ? -1 : a.data > b.data ? 1 : a.i - b.i));
  function invia() {__mk();
    if (!evento || !testo.trim() || !destinatari.length) return;
    chat.addRow({ Evento: evento, Mittente: mittente, Ufficio: destinatari.join("; "), "Data e ora": new Date().toISOString(), Messaggio: testo.trim() });
    setTesto("");
    notify("Messaggio dimostrativo aggiunto con tutti gli uffici destinatari.");
  }
  return <Card title="Chat tra uffici">
    <div className="space-y-4 text-(--mk-text)">
      <p className="text-sm text-(--mk-muted)">Conversazioni condivise, solo in memoria. Usare esclusivamente contenuti inventati. La colonna Ufficio rappresenta i destinatari.</p>
      <Select label="Conversazione per evento" value={evento} options={nomiEventi} onChange={(v) => {__mk(); setScelto(v); setTesto(""); }} />
      {!evento ? <p>Nessun evento disponibile.</p> : <>
        <div className="grid gap-3 md:grid-cols-2">
          {[istanze, atti].map((tabella, indice) => {__mk();
            if (!tabella || tabella.column("Evento") < 0) return null;
            const righe = tabella.rows.filter((r) => (__mk(), tabella.value(r, "Evento") === evento));
            return <div key={indice} className="rounded-lg border border-(--mk-border) p-3">
              <h3 className="font-semibold">{tabella.title}</h3>
              {!righe.length && <p>Evento non presente.</p>}
              {righe.map((r, i) => (__mk(), <div key={i} className="space-y-1 py-2 text-sm">
                <p>{evento}</p>
                <p>Referente: {tabella.column("Referente") >= 0 ? tabella.value(r, "Referente") : "Non disponibile"}</p>
                <Badge tone="neutral">{tabella.column("Stato") >= 0 ? tabella.value(r, "Stato") : "Stato non disponibile"}</Badge>
              </div>))}
            </div>;
          })}
        </div>
        <div className="max-h-80 overflow-y-auto space-y-3 rounded-lg border border-(--mk-border) p-3" aria-live="polite" aria-label="Messaggi in ordine cronologico">
          {!messaggi.length && <p>Nessun messaggio: avvia la conversazione.</p>}
          {messaggi.map(({ r, i, data }) => {__mk();
            const giorno = new Date(data);
            const quando = Number.isNaN(giorno.getTime()) ? data : giorno.toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" });
            const nomi = chat.value(r, "Ufficio").split(";").map((n) => (__mk(), n.trim())).filter(Boolean);
            return <article key={i} className="rounded-lg bg-(--mk-subtle) p-3 space-y-2">
              <p className="font-semibold">{chat.value(r, "Mittente")}</p>
              <div className="flex flex-wrap gap-2"><span>Destinatari:</span>{nomi.map((nome, n) => (__mk(), <Badge key={n} tone="primary">{nome}</Badge>))}{!nomi.length && <span>Non indicati</span>}</div>
              <p className="text-xs text-(--mk-muted)">{quando}</p>
              <p className="whitespace-pre-wrap break-words">{chat.value(r, "Messaggio")}</p>
            </article>;
          })}
        </div>
        <Select label="Mittente dimostrativo" value={mittente} options={["Operatore demo A", "Operatore demo B", "Operatore demo C"]} onChange={setMittente} />
        <div className="rounded-lg border border-(--mk-border) p-3 space-y-2" role="group" aria-label="Uffici destinatari: selezione multipla">
          <h3 className="font-semibold">Uffici destinatari · selezione multipla</h3>
          {uffici.map((nome) => (__mk(), <Checkbox key={nome} label={nome} checked={destinatari.includes(nome)} onChange={(si) => (__mk(), setDestinatari((prima) => (__mk(), si ? (prima.includes(nome) ? prima : [...prima, nome]) : prima.filter((n) => (__mk(), n !== nome)))))} />))}
          <p className="text-sm text-(--mk-muted)">{destinatari.length ? "Selezionati: " + destinatari.join(", ") : "Seleziona almeno un ufficio."}</p>
        </div>
        <TextArea label="Messaggio" value={testo} onChange={setTesto} rows={3} />
        <Button onClick={invia} disabled={!testo.trim() || !destinatari.length}>Invia messaggio</Button>
      </>}
    </div>
  </Card>;
}
