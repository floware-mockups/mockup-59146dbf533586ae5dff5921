// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ChatUfficiEvento");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ChatUfficiEvento");
import { useState } from "react";
import { useTable, usePrototype, Card, Select, TextArea, Button, Badge } from "../floware";

export default function ChatUfficiEvento({ pageId }) {__mk();
  const corrente = useTable(pageId);
  const istanze = useTable("istanze");
  const atti = useTable("atti-e-scadenze");
  const chat = useTable("messaggi-uffici");
  const { notify } = usePrototype();
  const [scelto, setScelto] = useState("");
  const [testo, setTesto] = useState("");
  const [mittente, setMittente] = useState("Operatore demo A");
  const [ufficio, setUfficio] = useState("Segreteria");
  if (pageId !== "istanze" && pageId !== "atti-e-scadenze") return null;
  if (!corrente || !chat || corrente.column("Evento") < 0) return <p>Chat non disponibile: manca il registro o la colonna Evento.</p>;
  const colonne = ["Evento", "Mittente", "Ufficio", "Data e ora", "Messaggio"];
  if (colonne.some((nome) => (__mk(), chat.column(nome) < 0))) return <p>Ripristinare le colonne del registro messaggi per usare la chat.</p>;
  const eventi = [...new Set(corrente.rows.map((r) => (__mk(), corrente.value(r, "Evento"))).filter((v) => (__mk(), v.trim() !== "")))];
  const evento = eventi.includes(scelto) ? scelto : (eventi[0] || "");
  const messaggi = chat.rows.filter((r) => (__mk(), chat.value(r, "Evento") === evento)).map((r, i) => ((__mk(), { r, i, data: chat.value(r, "Data e ora") }))).sort((a, b) => (__mk(), a.data < b.data ? -1 : a.data > b.data ? 1 : a.i - b.i));
  function invia() {__mk();
    if (!evento || !testo.trim()) return;
    chat.addRow({ Evento: evento, Mittente: mittente, Ufficio: ufficio, "Data e ora": new Date().toISOString(), Messaggio: testo.trim() });
    setTesto("");
    notify("Messaggio aggiunto alla conversazione dimostrativa.");
  }
  return <Card title="Chat tra uffici">
    <div className="space-y-4 text-(--mk-text)">
      <p className="text-sm text-(--mk-muted)">Demo condivisa tra le pagine di questo prototipo, solo in memoria. Usare esclusivamente contenuti inventati.</p>
      <Select label="Conversazione per evento" value={evento} options={eventi} onChange={(v) => {__mk(); setScelto(v); setTesto(""); }} />
      {!evento ? <p>Nessun evento disponibile.</p> : <>
        <div className="grid gap-3 md:grid-cols-2">
          {[istanze, atti].map((tabella, indice) => {__mk();
            if (!tabella || tabella.column("Evento") < 0) return null;
            const righe = tabella.rows.filter((r) => (__mk(), tabella.value(r, "Evento") === evento));
            return <div key={indice} className="rounded-lg border border-(--mk-border) p-3">
              <h3 className="font-semibold">{tabella.title}</h3>
              {righe.length === 0 && <p className="text-sm">Evento non presente.</p>}
              {righe.map((r, i) => (__mk(), <div key={i} className="space-y-1 py-2 text-sm">
                <p>{evento}</p>
                <p>Referente: {tabella.column("Referente") >= 0 ? tabella.value(r, "Referente") : "Non disponibile"}</p>
                <Badge tone="neutral">{tabella.column("Stato") >= 0 ? tabella.value(r, "Stato") : "Stato non disponibile"}</Badge>
              </div>))}
            </div>;
          })}
        </div>
        <div className="max-h-80 overflow-y-auto space-y-3 rounded-lg border border-(--mk-border) p-3" aria-live="polite" aria-label="Messaggi in ordine cronologico">
          {messaggi.length === 0 && <p>Nessun messaggio: avvia la conversazione.</p>}
          {messaggi.map(({ r, i, data }) => {__mk();
            const giorno = new Date(data);
            const quando = Number.isNaN(giorno.getTime()) ? data : giorno.toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" });
            return <article key={i} className="rounded-lg bg-(--mk-subtle) p-3">
              <p className="font-semibold">{chat.value(r, "Mittente")} · {chat.value(r, "Ufficio")}</p>
              <p className="text-xs text-(--mk-muted)">{quando}</p>
              <p className="whitespace-pre-wrap break-words mt-2">{chat.value(r, "Messaggio")}</p>
            </article>;
          })}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Select label="Mittente dimostrativo" value={mittente} options={["Operatore demo A", "Operatore demo B", "Operatore demo C"]} onChange={setMittente} />
          <Select label="Ufficio mittente" value={ufficio} options={["Segreteria", "Ufficio tecnico", "Polizia locale", "Ufficio cultura"]} onChange={setUfficio} />
        </div>
        <TextArea label="Risposta" value={testo} onChange={setTesto} rows={3} />
        <Button onClick={invia} disabled={!testo.trim()}>Invia risposta</Button>
      </>}
    </div>
  </Card>;
}
