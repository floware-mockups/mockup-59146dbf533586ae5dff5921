// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ImportazioneMda");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ImportazioneMda");
import { useState } from "react";
import { useTable, Card, Dialog, Button, TextInput, Select, Badge } from "../floware";

export default function ImportazioneMda({ pageId }) {__mk();
 const table = useTable(pageId);
 const registro = useTable("registro-mda");
 const [file, setFile] = useState("Aggiornamenti giugno.mda");
 const [aperto, setAperto] = useState(false);
 const [bozza, setBozza] = useState<Record<string,string>[]>([]);
 const [esito, setEsito] = useState<string[]>([]);
 const campi = ["Evento","Tipo","Luogo","Data","Referente","Stato","Dal","Al"];
 if (!table || !registro) return <p>Registro MDA non disponibile.</p>;
 if (campi.some((c) => (__mk(), table.column(c) < 0)) || registro.column("ID istanza") < 0 || registro.column("Impronta") < 0) return <p>Ripristinare le colonne previste per la simulazione MDA.</p>;
 function impronta(r) {__mk(); return campi.map((c) => (__mk(), r[c] || "")).join(" ¦ "); }
 function avvia() {__mk();
  const giugno = [
   {ID:"IST-2026-001",Evento:"Festa delle Lanterne",Tipo:"Manifestazione",Luogo:"Piazza delle Vele",Data:"2026-06-18",Referente:"Nubi",Stato:"In attesa di valutazione",Dal:"15/06/2026",Al:"18/06/2026"},
   {ID:"IST-2026-002",Evento:"Mercato dei Giardini",Tipo:"Mercato",Luogo:"Parco delle Vele",Data:"2026-06-21",Referente:"Vela",Stato:"Ordinanza da preparare",Dal:"20/06/2026",Al:"22/06/2026"}
  ];
  const luglio = [
   {ID:"IST-2026-006",Evento:"Cinema tra le Fronde",Tipo:"Proiezione",Luogo:"Giardino dei Nembi",Data:"2026-07-04",Referente:"Lumo",Stato:"Istanza ricevuta",Dal:"03/07/2026",Al:"05/07/2026"},
   {ID:"IST-2026-007",Evento:"Laboratorio delle Vele",Tipo:"Laboratorio",Luogo:"Sala delle Rive",Data:"2026-07-08",Referente:"Nubi",Stato:"Istanza ricevuta",Dal:"08/07/2026",Al:"08/07/2026"}
  ];
  setBozza(file === "Aggiornamenti giugno.mda" ? giugno : luglio);
  setAperto(true);
 }
 function correggi(i,c,v) {__mk();
  setBozza((prima) => (__mk(), prima.map((r,n) => {__mk(); const copia = {...r}; if (n === i) copia[c] = c === "ID" ? v.trim() : v; return copia; })));
 }
 const piani = bozza.map((r) => {__mk();
  const ids = registro.findRows("ID istanza",r.ID);
  const firma = ids.length === 1 ? registro.value(ids[0],"Impronta") : "";
  const trovate = table.rows.map((rr,i) => ((__mk(), {i,f:campi.map((c) => (__mk(), table.value(rr,c))).join(" ¦ ")}))).filter((x) => (__mk(), x.f === firma));
  const indice = ids.length === 1 && trovate.length === 1 ? trovate[0].i : -1;
  const cambi = campi.filter((c) => (__mk(), indice < 0 ? Boolean(r[c]) : table.value(indice,c) !== r[c]));
  let errore = "";
  if (!r.ID || !r.Evento.trim()) errore = "ID ed Evento obbligatori.";
  else if (bozza.filter((b) => (__mk(), b.ID === r.ID)).length > 1 || ids.length > 1) errore = "Identificativo duplicato.";
  else if (ids.length === 1 && trovate.length !== 1) errore = "Collegamento non riconoscibile: istanza modificata, rimossa o duplicata. Escludere questa voce.";
  else if (campi.some((c) => (__mk(), r[c].includes(" ¦ ")))) errore = "Il separatore del registro non è ammesso nei campi.";
  return {r,ids,indice,cambi,errore};
 });
 const invalido = !piani.length || piani.some((p) => (__mk(), p.errore));
 function applica() {__mk();
  if (invalido) return;
  const rapporto: string[] = [];
  for (const p of piani) {__mk();
   const dettagli = p.cambi.map((c) => (__mk(), c + ": «" + (p.indice < 0 ? "vuoto" : table.value(p.indice,c) || "vuoto") + "» → «" + (p.r[c] || "vuoto") + "»")).join("; ");
   if (!p.ids.length) {
    const nuova: Record<string,string> = {};
    for (const c of campi) {__mk();nuova[c] = p.r[c];}
    table.addRow(nuova);
    registro.addRow({"ID istanza":p.r.ID,Impronta:impronta(p.r)});
   } else {
    for (const c of p.cambi) {__mk();table.setCell(p.indice,c,p.r[c]);}
    registro.setCell(p.ids[0],"Impronta",impronta(p.r));
   }
   rapporto.push(p.r.ID + (!p.ids.length ? " — Creata. " : p.cambi.length ? " — Aggiornata. " : " — Invariata. ") + dettagli);
  }
  setEsito(rapporto); setAperto(false); setBozza([]);
 }
 return <Card title="Importazione MDA simulata"><div className="space-y-3 text-(--mk-text)">
  <p>File dimostrativi predefiniti, nessun caricamento reale. Dati inventati e modifiche solo in memoria.</p>
  <Select label="File dimostrativo" value={file} options={["Aggiornamenti giugno.mda","Nuove istanze luglio.mda"]} onChange={setFile} />
  <p className="text-sm text-(--mk-muted)">{file === "Aggiornamenti giugno.mda" ? "Due istanze esistenti: aggiornamento di stato, luogo e periodo." : "Due nuove istanze di luglio."}</p>
  <Button onClick={avvia}>Prepara anteprima MDA</Button>
  {!!esito.length && <div aria-live="polite"><h3 className="font-semibold">Modifiche applicate</h3>{esito.map((e,i) => (__mk(), <p key={i} className="text-sm py-2 break-words">{e}</p>))}</div>}
  {aperto && <Dialog title="Anteprima MDA correggibile" onClose={() => (__mk(), setAperto(false))} footer={<><Button variant="secondary" onClick={() => (__mk(), setAperto(false))}>Annulla</Button><Button disabled={invalido} onClick={applica}>Applica importazione</Button></>}>
   <div className="space-y-4"><p>{file} · {piani.filter((p) => (__mk(), !p.ids.length)).length} da creare · {piani.filter((p) => (__mk(), p.indice >= 0 && p.cambi.length)).length} da aggiornare</p><p>Correggi gli otto campi prima di confermare. Data: AAAA-MM-GG; Dal e Al: GG/MM/AAAA. Nessuna scrittura fino alla conferma. I campi vuoti cancellano il valore precedente; cambiare ID cambia la corrispondenza.</p>
   {piani.map((p,i) => (__mk(), <div key={i} className="border border-(--mk-border) rounded-lg p-3 space-y-3"><Badge tone={p.errore ? "danger" : "primary"}>{p.errore ? "Da correggere" : !p.ids.length ? "Da creare" : p.cambi.length ? "Da aggiornare" : "Invariata"}</Badge>{p.errore && <p className="text-(--mk-danger)">{p.errore}</p>}<TextInput label="ID istanza" value={p.r.ID} onChange={(v) => (__mk(), correggi(i,"ID",v))} /><div className="grid gap-3 md:grid-cols-2">{campi.map((c) => (__mk(), <div key={c}><TextInput label={c} value={p.r[c]} onChange={(v) => (__mk(), correggi(i,c,v))} />{p.indice >= 0 && p.cambi.includes(c) && <p className="text-sm text-(--mk-muted)">Prima: {table.value(p.indice,c) || "vuoto"}</p>}</div>))}</div><Button variant="secondary" onClick={() => (__mk(), setBozza(bozza.filter((r,n) => (__mk(), n !== i))))}>Escludi istanza</Button></div>))}
   </div></Dialog>}
 </div></Card>;
}
