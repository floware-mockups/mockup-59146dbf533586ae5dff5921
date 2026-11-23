// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("CalendarioSale");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("CalendarioSale");
import { useState } from "react";
import { useTable, usePrototype, Card, Button, Dialog, TextInput, Select } from "../floware";

function iso(t) {__mk();
 const p = t.split("/");
 return p.length === 3 ? p[2]+"-"+p[1]+"-"+p[0] : t;
}
function locale(t) {__mk(); return t.split("-").reverse().join("/"); }
function vuota(data) {__mk(); return {Richiedente:"",Sala:"Sala 1",Data:data,Ora:"09:00",Evento:"",Stato:"In attesa"}; }

export default function CalendarioSale({pageId}) {__mk();
 const table = useTable(pageId);
 const {notify} = usePrototype();
 const [mese,setMese] = useState("2026-06-01");
 const [modo,setModo] = useState("");
 const [indice,setIndice] = useState(-1);
 const [bozza,setBozza] = useState(vuota("2026-06-18"));
 const [voci,setVoci] = useState([]);
 const [rimuovi,setRimuovi] = useState(false);
 const campi = ["Richiedente","Sala","Data","Ora","Evento","Stato"];
 const documento = "Associazione delle Nuvole|Sala 1|2026-06-23|10:00|Laboratorio delle idee|In attesa\nCircolo dei Petali|Sala 2|2026-06-26|15:30|Incontro culturale|Confermata\nGruppo delle Foglie|Sala 1|2026-06-30|11:00|Riunione organizzativa|In attesa";
 if (!table || campi.some(c => (__mk(), table.column(c) < 0))) return <p>Calendario non disponibile: ripristinare le colonne delle prenotazioni.</p>;
 const righe = table.rows.map((r,i) => ((__mk(), {i,Richiedente:table.value(r,"Richiedente"),Sala:table.value(r,"Sala"),Data:iso(table.value(r,"Data")),Ora:table.value(r,"Ora"),Evento:table.value(r,"Evento"),Stato:table.value(r,"Stato")})));
 const primo = new Date(mese+"T12:00:00");
 const offset = (primo.getDay()+6)%7;
 const giorni = Array.from({length:42}, (_,i) => {__mk();
  const d = new Date(primo.getFullYear(),primo.getMonth(),i-offset+1,12);
  const data = String(d.getFullYear())+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  return {data,n:d.getDate(),attivo:d.getMonth()===primo.getMonth()};
 });
 function sposta(n) {__mk();
  const d = new Date(primo.getFullYear(),primo.getMonth()+n,1,12);
  setMese(String(d.getFullYear())+"-"+String(d.getMonth()+1).padStart(2,"0")+"-01");
 }
 function apri(data,r) {__mk();
  setIndice(r ? r.i : -1); setBozza(r || vuota(data)); setRimuovi(false); setModo("manuale");
 }
 function cambia(c,v) {__mk(); setBozza(b => {__mk();const nuova = {...b}; nuova[c]=v; return nuova;}); }
 function errore(r,escluso) {__mk();
  if (!r.Richiedente.trim() || !r.Evento.trim() || !r.Data || !r.Ora) return "Compilare tutti i campi.";
  const ore = r.Ora.split(":");
  if (ore.length!==2 || ore[0].length!==2 || ore[1].length!==2 || !Number.isInteger(Number(ore[0])) || !Number.isInteger(Number(ore[1])) || Number(ore[0])<0 || Number(ore[0])>23 || Number(ore[1])<0 || Number(ore[1])>59) return "Usare un orario HH:MM valido.";
  const d = new Date(r.Data+"T12:00:00");
  if (Number.isNaN(d.getTime())) return "Data non valida.";
  if (righe.some(x => (__mk(), x.i!==escluso && x.Data===r.Data && x.Sala===r.Sala && x.Ora===r.Ora))) return "Sala già prenotata alla stessa data e ora.";
  return "";
 }
 function aggiungi(r) {__mk(); table.addRow({Richiedente:r.Richiedente.trim(),Sala:r.Sala,Data:locale(r.Data),Ora:r.Ora,Evento:r.Evento.trim(),Stato:r.Stato}); }
 const problema = errore(bozza,indice);
 const problemi = voci.map(r => (__mk(), errore(r,-1) || (voci.filter(x => (__mk(), x.Data===r.Data && x.Sala===r.Sala && x.Ora===r.Ora)).length>1 ? "Orario ripetuto nel documento." : "")));
 function salva() {__mk();
  if (problema) return;
  if (indice<0) aggiungi(bozza);
  else for (const c of campi) {__mk();table.setCell(indice,c,c==="Data" ? locale(bozza.Data) : bozza[c].trim());}
  setModo(""); notify("Prenotazione salvata in memoria.");
 }
 return <Card title="Calendario delle prenotazioni"><div className="space-y-4 text-(--mk-text)">
  <p className="text-sm text-(--mk-muted)">Dati inventati, solo in memoria. Seleziona un giorno per aggiungere o un appuntamento per modificarlo. Il controllo rileva orari iniziali identici, non la durata degli incontri.</p>
  <div className="flex flex-wrap items-center gap-2"><Button variant="secondary" onClick={() => (__mk(), sposta(-1))}>Mese precedente</Button><h3 className="font-semibold">{primo.toLocaleDateString("it-IT",{month:"long",year:"numeric"})}</h3><Button variant="secondary" onClick={() => (__mk(), sposta(1))}>Mese successivo</Button><Button onClick={() => (__mk(), apri(mese,null))}>Nuova prenotazione</Button><Button variant="secondary" onClick={() => {__mk();setVoci(documento.split("\n").map(l => {__mk();const p=l.split("|"); return {Richiedente:p[0],Sala:p[1],Data:p[2],Ora:p[3],Evento:p[4],Stato:p[5]};}));setModo("importa");}}>Anteprima documento demo</Button></div>
  <div className="overflow-x-auto"><div className="grid grid-cols-7 gap-1" style={{minWidth:"49rem"}}>
   {["Lun","Mar","Mer","Gio","Ven","Sab","Dom"].map(g => (__mk(), <div key={g} className="p-2 font-semibold">{g}</div>))}
   {giorni.map(g => (__mk(), <div key={g.data} className={"min-h-28 rounded border border-(--mk-border) p-2 space-y-2 "+(g.attivo ? "bg-(--mk-surface)" : "bg-(--mk-subtle)")}><Button variant="link" onClick={() => (__mk(), apri(g.data,null))}>{String(g.n)}</Button>{righe.filter(r => (__mk(), r.Data===g.data)).sort((a,b) => (__mk(), a.Ora.localeCompare(b.Ora))).map(r => (__mk(), <div key={r.i} className="rounded bg-(--mk-subtle) p-1 text-xs"><Button variant="link" onClick={() => (__mk(), apri(r.Data,r))}>{r.Ora+" · "+r.Richiedente}</Button><p>{r.Sala} · {locale(r.Data)}</p><p>{r.Evento}</p><p>{r.Stato}</p></div>))}</div>))}
  </div></div>
  {modo==="manuale" && <Dialog title={indice<0 ? "Nuova prenotazione" : "Gestisci prenotazione"} onClose={() => (__mk(), setModo(""))} footer={<><Button variant="secondary" onClick={() => (__mk(), setModo(""))}>Annulla</Button><Button disabled={Boolean(problema)} onClick={salva}>Salva</Button></>}><div className="space-y-3"><p>Usare solo nominativi di fantasia.</p>{campi.map(c => (__mk(), c==="Sala" || c==="Stato" ? <Select key={c} label={c} value={bozza[c]} options={c==="Sala" ? ["Sala 1","Sala 2"] : ["In attesa","Confermata","Da verificare"]} onChange={v => (__mk(), cambia(c,v))} /> : <TextInput key={c} label={c==="Ora" ? "Ora (HH:MM)" : c} type={c==="Data" ? "date" : "text"} value={bozza[c]} onChange={v => (__mk(), cambia(c,v))} />))}{problema && <p role="status" className="text-(--mk-danger)">{problema}</p>}{indice>=0 && <Button variant="danger" onClick={() => {__mk();if (!rimuovi) {setRimuovi(true);return;} table.removeRow(indice);setModo("");notify("Prenotazione rimossa.");}}>{rimuovi ? "Conferma rimozione" : "Rimuovi prenotazione"}</Button>}</div></Dialog>}
  {modo==="importa" && <Dialog title="Anteprima documento sale giugno.demo" onClose={() => (__mk(), setModo(""))} footer={<><Button variant="secondary" onClick={() => (__mk(), setModo(""))}>Annulla</Button><Button disabled={!voci.length || problemi.some(Boolean)} onClick={() => {__mk();for (const r of voci) {__mk();aggiungi(r);}setModo("");notify("Prenotazioni importate in memoria.");}}>Importa {voci.length} prenotazioni</Button></>}><div className="space-y-3"><p>Documento dimostrativo precaricato: nessun file reale. Nessuna modifica fino alla conferma. Puoi escludere le voci in conflitto.</p>{voci.map((r,i) => (__mk(), <div key={i} className="rounded border border-(--mk-border) p-3 space-y-2"><p className="font-semibold">{r.Richiedente}</p><p>{r.Sala} · {locale(r.Data)} · {r.Ora}</p><p>{r.Evento} · {r.Stato}</p>{problemi[i] && <p className="text-(--mk-danger)">{problemi[i]}</p>}<Button variant="secondary" onClick={() => (__mk(), setVoci(voci.filter((x,n) => (__mk(), n!==i))))}>Escludi voce</Button></div>))}</div></Dialog>}
 </div></Card>;
}
