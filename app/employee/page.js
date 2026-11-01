"use client";
import { useEffect, useState } from "react";
import "./employee.css";

const accounts = [
  { id:"1", name:"Mark Dela Cruz", branch:"Main Branch", shift:"Day", pin:"1234" },
  { id:"2", name:"Ana Reyes", branch:"Main Branch", shift:"Day", pin:"1234" },
  { id:"3", name:"John Santos", branch:"Balibago", shift:"Night", pin:"1234" },
  { id:"4", name:"Mia Flores", branch:"Canlubang", shift:"Night", pin:"1234" },
  { id:"5", name:"Carlo Mendoza", branch:"Main Branch", shift:"Night", pin:"1234" }
];
const today = () => new Date().toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"});
const readRecords = () => { try { return JSON.parse(localStorage.getItem("pareskada_employee_records") || "[]"); } catch { return []; } };

export default function EmployeePage(){
  const [employeeId,setEmployeeId] = useState("");
  const [pin,setPin] = useState("");
  const [employee,setEmployee] = useState(null);
  const [records,setRecords] = useState([]);
  const [amount,setAmount] = useState("");
  const [note,setNote] = useState("");
  const [message,setMessage] = useState("");
  useEffect(()=>{ if(employee) setRecords(readRecords().filter(r=>r.employeeId===employee.id)); },[employee]);
  const active = records.find(r=>r.type==="attendance"&&r.action==="time-in"&&!records.some(x=>x.type==="attendance"&&x.action==="time-out"&&x.sessionId===r.sessionId));
  function login(e){ e.preventDefault(); const found=accounts.find(a=>a.id===employeeId&&a.pin===pin); if(!found){setMessage("Incorrect employee account or PIN.");return;} setEmployee(found);setMessage(""); }
  function save(record){const all=readRecords();all.unshift(record);localStorage.setItem("pareskada_employee_records",JSON.stringify(all));setRecords(all.filter(r=>r.employeeId===employee.id));window.dispatchEvent(new Event("pareskada-records-updated"));setMessage("Saved successfully.");}
  function clock(action){const now=new Date();if(action==="time-in"){save({id:Date.now(),type:"attendance",action:"time-in",sessionId:String(Date.now()),employeeId:employee.id,employeeName:employee.name,branch:employee.branch,shift:employee.shift,date:today(),time:now.toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"}),timestamp:now.toISOString()});}else{save({id:Date.now(),type:"attendance",action:"time-out",sessionId:active.sessionId,employeeId:employee.id,employeeName:employee.name,branch:employee.branch,shift:employee.shift,date:today(),time:now.toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"}),timestamp:now.toISOString()});}}
  function submitSale(e){e.preventDefault();if(!amount||Number(amount)<=0){setMessage("Please enter a valid sales amount.");return;}const now=new Date();save({id:Date.now(),type:"sale",employeeId:employee.id,employeeName:employee.name,branch:employee.branch,shift:employee.shift,amount:Number(amount),note,date:today(),time:now.toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"}),timestamp:now.toISOString()});setAmount("");setNote("");}
  if(!employee)return <main className="emp-login-wrap"><section className="emp-login"><a className="emp-brand" href="/">PK <span>ParesKada</span></a><p className="emp-kicker">EMPLOYEE PORTAL</p><h1>Employee sign in</h1><p className="emp-muted">Access your attendance and duty sales report.</p><form onSubmit={login}><label>Employee account<select value={employeeId} onChange={e=>setEmployeeId(e.target.value)} required><option value="">Select your account</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.name} · {a.branch}</option>)}</select></label><label>PIN<input value={pin} onChange={e=>setPin(e.target.value)} type="password" inputMode="numeric" placeholder="Enter your PIN" required/></label><button className="emp-primary">Sign in</button></form>{message&&<p className="emp-message">{message}</p>}<p className="emp-demo">Preview demo accounts use PIN <b>1234</b>. Individual secure accounts will require backend authentication.</p><a className="emp-owner-link" href="/">← Owner dashboard</a></section></main>;
  const sales=records.filter(r=>r.type==="sale");
  return <main className="emp-page"><header className="emp-header"><a className="emp-brand" href="/">PK <span>ParesKada</span></a><button onClick={()=>{setEmployee(null);setPin("");setEmployeeId("");}}>Sign out</button></header><section className="emp-content"><p className="emp-kicker">EMPLOYEE WORKSPACE</p><h1>Hello, {employee.name.split(" ")[0]}!</h1><p className="emp-muted">{employee.branch} · {employee.shift} shift · {employee.shift==="Day"?"6:00 AM – 6:00 PM":"6:00 PM – 6:00 AM"}</p><section className="emp-card emp-attendance"><div><p className="emp-kicker">TODAY'S ATTENDANCE</p><h2>{active?"You're clocked in":"You're off duty"}</h2><p className="emp-muted">{today()} · {active?"Remember to clock out when your duty ends.":"Tap Time In when your shift starts."}</p></div><button className={active?"emp-out":"emp-primary"} onClick={()=>clock(active?"time-out":"time-in")}>{active?"Time Out":"Time In"}</button></section><section className="emp-card"><p className="emp-kicker">DUTY SALES</p><h2>Report your sales</h2><p className="emp-muted">Submit the total sales collected during this shift. The owner can see your report in Sales & Cash-up.</p><form className="emp-sales-form" onSubmit={submitSale}><label>Total sales amount (₱)<input type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} required/></label><label>Notes (optional)<input placeholder="Cash, GCash, other notes" value={note} onChange={e=>setNote(e.target.value)}/></label><button className="emp-primary">Submit sales report</button></form></section>{message&&<p className="emp-message">{message}</p>}<section className="emp-card"><div className="emp-history-head"><div><p className="emp-kicker">MY RECORDS</p><h2>Recent duty sales</h2></div><b>{sales.length} reports</b></div>{sales.length?sales.slice(0,6).map(r=><div className="emp-record" key={r.id}><span>{r.date} · {r.shift} shift</span><b>₱{Number(r.amount).toLocaleString("en-PH",{minimumFractionDigits:2})}</b></div>):<p className="emp-muted">No sales reports submitted yet.</p>}</section><p className="emp-demo">This is a UI preview. Records are saved in this browser only; secure accounts and cross-device syncing need a database and authentication.</p></section></main>;
}
