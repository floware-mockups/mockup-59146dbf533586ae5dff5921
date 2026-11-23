// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("CalendarioIstanze");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("CalendarioIstanze");
import { useState } from "react";
import { useTable, usePrototype, Card, Button } from "../floware";

function leggiData(testo) {__mk();
 const t = testo.trim();
 const parti = t.includes("/") ? t.split("/").reverse() : t.split("-");
 if (parti.length !== 3) return null;
 const anno = Number(parti[0]);
 const mese = Number(parti[1]);
 const giorno = Number(parti[2]);
 if (!Number.isInteger(anno) || anno < 1000 || anno > 9999 || !Number.isInteger(mese) || !Number.isInteger(giorno)) return null;
 const d = new Date(anno, mese - 1, giorno, 12);
 return d.getFullYear() === anno && d.getMonth() === mese - 1 && d.getDate() === giorno ? d : null;
}
function chiave(d) {__mk();
 return String(d.getFullYear()) + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export default function CalendarioIstanze({ pageId }) {__mk();
 const table = useTable(pageId);
 const { openDetail } = usePrototype();
 const [meseScelto, setMeseScelto] = useState("");
 if (!table || table.column("Data") < 0) return <p>Calendario non disponibile: manca la colonna Data.</p>;
 const eventi = table.rows.map((r, i) => {__mk();
  const data = leggiData(table.value(r, "Data"));
  return { i, data, giorno: data ? chiave(data) : "", nome: table.column("Evento") >= 0 ? table.value(r, "Evento") || "Evento senza titolo" : "Istanza " + String(i + 1), luogo: table.column("Luogo") >= 0 ? table.value(r, "Luogo") : "" };
 });
 const valide = eventi.filter(e => (__mk(), e.data !== null)).sort((a, b) => (__mk(), a.giorno.localeCompare(b.giorno)));
 const riferimento = valide.length ? valide[0].data : new Date();
 const primo = meseScelto ? new Date(meseScelto + "T12:00:00") : new Date(riferimento.getFullYear(), riferimento.getMonth(), 1, 12);
 const offset = (primo.getDay() + 6) % 7;
 const giorni = Array.from({ length: 42 }, (_, i) => {__mk();
  const d = new Date(primo.getFullYear(), primo.getMonth(), i - offset + 1, 12);
  return { data: chiave(d), numero: d.getDate(), corrente: d.getMonth() === primo.getMonth() };
 });
 const nelMese = valide.filter(e => (__mk(), e.data.getFullYear() === primo.getFullYear() && e.data.getMonth() === primo.getMonth())).length;
 function sposta(delta) {__mk();
  const d = new Date(primo.getFullYear(), primo.getMonth() + delta, 1, 12);
  if (d.getFullYear() >= 1000 && d.getFullYear() <= 9999) setMeseScelto(chiave(d));
 }
 return <Card title="Calendario delle istanze">
  <div className="space-y-4 text-(--mk-text)">
   <p className="text-sm text-(--mk-muted)">Eventi distribuiti secondo la colonna Data, non secondo il periodo Dal–Al. Seleziona un evento per aprire il dettaglio. Le viste esistenti restano disponibili sotto.</p>
   <div className="flex flex-wrap items-center gap-3">
    <Button variant="secondary" onClick={() => (__mk(), sposta(-1))}>Mese precedente</Button>
    <h3 className="font-semibold" aria-live="polite">{primo.toLocaleDateString("it-IT", { month: "long", year: "numeric" })} · {nelMese} eventi</h3>
    <Button variant="secondary" onClick={() => (__mk(), sposta(1))}>Mese successivo</Button>
    <Button variant="secondary" onClick={() => {__mk(); const oggi = new Date(); setMeseScelto(chiave(new Date(oggi.getFullYear(), oggi.getMonth(), 1, 12))); }}>Mese attuale</Button>
   </div>
   {!nelMese && <p>Nessun evento nel mese selezionato.</p>}
   <div className="overflow-x-auto" aria-label="Calendario mensile delle istanze">
    <div className="grid grid-cols-7 gap-1" style={{ minWidth: "49rem" }}>
     {["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"].map(g => (__mk(), <div key={g} className="p-2 text-sm font-semibold">{g}</div>))}
     {giorni.map(g => (__mk(), <div key={g.data} className={"min-h-28 rounded border border-(--mk-border) p-2 space-y-2 " + (g.corrente ? "bg-(--mk-surface)" : "bg-(--mk-subtle)")}>
      <p className="text-sm font-semibold"><time dateTime={g.data}>{g.numero}{!g.corrente ? " · " + g.data.slice(5, 7) : ""}</time></p>
      {eventi.filter(e => (__mk(), e.giorno === g.data)).map(e => (__mk(), <div key={e.i} className="rounded border border-(--mk-border) bg-(--mk-subtle) p-2 text-xs break-words">
       <Button variant="link" onClick={() => (__mk(), openDetail(pageId, e.i))}>{e.nome}</Button>
       {e.luogo && <p>{e.luogo}</p>}
      </div>))}
     </div>))}
    </div>
   </div>
   {eventi.length > valide.length && <p className="text-sm text-(--mk-muted)">{eventi.length - valide.length} istanze senza data valida non mostrate nel calendario. Formati supportati: AAAA-MM-GG e GG/MM/AAAA.</p>}
  </div>
 </Card>;
}
