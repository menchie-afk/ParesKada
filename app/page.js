"use client";

import { useMemo, useState } from "react";

const initialBranches = [
  { id: "main", name: "ParesKada · Main Branch", location: "Santa Rosa, Laguna" },
  { id: "balibago", name: "ParesKada · Balibago", location: "Balibago, Santa Rosa" },
  { id: "canlubang", name: "ParesKada · Canlubang", location: "Canlubang, Laguna" }
];
const initialEmployees = [
  { id: 1, name: "Mark Dela Cruz", role: "Cook", branch: "main", shift: "Day", status: "On duty", in: "06:02 AM" },
  { id: 2, name: "Ana Reyes", role: "Cashier", branch: "main", shift: "Day", status: "On duty", in: "06:10 AM" },
  { id: 3, name: "John Santos", role: "Kitchen staff", branch: "balibago", shift: "Night", status: "On duty", in: "06:04 PM" },
  { id: 4, name: "Mia Flores", role: "Cashier", branch: "canlubang", shift: "Night", status: "Off duty", in: "—" },
  { id: 5, name: "Carlo Mendoza", role: "Utility", branch: "main", shift: "Night", status: "Off duty", in: "—" }
];
const initialStock = [
  { id: 1, item: "Beef brisket", category: "Meat", unit: "kg", stock: 18, minimum: 10, cost: 320 },
  { id: 2, item: "Rice", category: "Dry goods", unit: "kg", stock: 42, minimum: 20, cost: 58 },
  { id: 3, item: "Garlic", category: "Produce", unit: "kg", stock: 3, minimum: 5, cost: 160 },
  { id: 4, item: "Pares sauce", category: "Ingredients", unit: "L", stock: 12, minimum: 5, cost: 95 },
  { id: 5, item: "Eggs", category: "Supplies", unit: "pcs", stock: 24, minimum: 30, cost: 9 },
  { id: 6, item: "Takeout containers", category: "Packaging", unit: "pcs", stock: 85, minimum: 40, cost: 3.5 }
];
const peso = n => "₱" + Number(n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = new Date().toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });

export default function Home() {
  const [section, setSection] = useState("Overview");
  const [branch, setBranch] = useState("all");
  const [shift, setShift] = useState("Day");
  const [stock, setStock] = useState(initialStock);
  const [employees, setEmployees] = useState(initialEmployees);
  const [sales, setSales] = useState([{ id: 1, branch: "main", shift: "Day", amount: 8450, date: today, by: "Ana Reyes", note: "Opening to afternoon sales" }, { id: 2, branch: "balibago", shift: "Night", amount: 6120, date: today, by: "John Santos", note: "Dinner shift sales" }]);
  const [expenses, setExpenses] = useState([{ id: 1, branch: "main", amount: 650, category: "Ingredients", detail: "Fresh vegetables", date: today, by: "Mark Dela Cruz" }, { id: 2, branch: "balibago", amount: 250, category: "Utilities", detail: "Water refill", date: today, by: "John Santos" }]);
  const [modal, setModal] = useState("");
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({});
  const [attendanceFilter, setAttendanceFilter] = useState("All");
  const [employeeId, setEmployeeId] = useState(1);
  const [dutyReports, setDutyReports] = useState([]);
  const [employeePurchases, setEmployeePurchases] = useState([]);

  const branchName = id => initialBranches.find(b => b.id === id)?.name.replace("ParesKada · ", "") || "—";
  const filteredEmployees = employees.filter(e => (branch === "all" || e.branch === branch) && (attendanceFilter === "All" || e.shift === attendanceFilter));
  const onDuty = employees.filter(e => e.status === "On duty" && (branch === "all" || e.branch === branch));
  const branchSales = sales.filter(s => branch === "all" || s.branch === branch);
  const branchExpenses = expenses.filter(e => branch === "all" || e.branch === branch);
  const totalSales = branchSales.reduce((a, s) => a + Number(s.amount), 0);
  const totalExpenses = branchExpenses.reduce((a, e) => a + Number(e.amount), 0);
  const lowStock = stock.filter(s => s.stock <= s.minimum).length;
  const stockValue = stock.reduce((a, s) => a + s.stock * s.cost, 0);
  const nav = [
    { title: "WORKSPACE", items: [["Overview", "▦"], ["Inventory", "▤"], ["Sales & cash-up", "₱"], ["Daily expenses", "↗"]] },
    { title: "PEOPLE & PLACES", items: [["Attendance", "◷"], ["Branches", "⌖"], ["Employees", "♙"]] },
    { title: "INSIGHTS", items: [["Reports", "▥"]] }
  ];
  function notify(message) { setToast(message); window.setTimeout(() => setToast(""), 2400); }
  function openModal(type) { setForm({ branch: branch === "all" ? "main" : branch, shift, date: today }); setModal(type); }
  function saveForm() {
    if (modal === "sale") {
      if (!form.amount || Number(form.amount) <= 0) return notify("Enter a valid sales amount.");
      const saleRecord = { id: Date.now(), branch: form.branch, shift: form.shift, amount: Number(form.amount), date: form.date || today, by: form.by || "Branch manager", note: form.note || "Shift sales" };
      setSales(v => [saleRecord, ...v]);
      const matchedEmployee = employees.find(e => e.name === saleRecord.by);
      if (matchedEmployee) setDutyReports(v => [{ ...saleRecord, employeeId: matchedEmployee.id }, ...v]);
    }
    if (modal === "expense") {
      if (!form.amount || Number(form.amount) <= 0) return notify("Enter a valid expense amount.");
      setExpenses(v => [{ id: Date.now(), branch: form.branch, amount: Number(form.amount), category: form.category || "Other", detail: form.detail || "Daily expense", date: form.date || today, by: form.by || "Branch manager" }, ...v]);
    }
    if (modal === "purchase") {
      if (!form.item || !form.quantity || Number(form.quantity) <= 0) return notify("Select an item and enter quantity.");
      setStock(v => v.map(s => s.id === Number(form.item) ? { ...s, stock: s.stock + Number(form.quantity) } : s));
    }
    if (modal === "deduct") {
      if (!form.item || !form.quantity || Number(form.quantity) <= 0) return notify("Select an item and enter quantity.");
      const chosen = stock.find(s => s.id === Number(form.item));
      if (Number(form.quantity) > chosen.stock) return notify("Not enough stock to deduct.");
      setStock(v => v.map(s => s.id === Number(form.item) ? { ...s, stock: s.stock - Number(form.quantity) } : s));
      const usedItem = stock.find(s => s.id === Number(form.item));
      const reportingEmployee = employees.find(e => e.name === form.employee);
      if (reportingEmployee && usedItem) setEmployeePurchases(v => [{ id: Date.now(), employeeId: reportingEmployee.id, item: usedItem.item, quantity: Number(form.quantity), unit: usedItem.unit, date: today }, ...v]);
    }
    if (modal === "employee") {
      if (!form.name) return notify("Enter employee name.");
      setEmployees(v => [...v, { id: Date.now(), name: form.name, role: form.role || "Staff", branch: form.branch, shift: form.shift, status: "Off duty", in: "—" }]);
    }
    setModal(""); notify("Saved successfully. Preview data only.");
  }
  function clockAction(id) {
    setEmployees(v => v.map(e => e.id === id ? { ...e, status: e.status === "On duty" ? "Off duty" : "On duty", in: e.status === "On duty" ? "—" : new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }) } : e));
    notify("Attendance updated.");
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="logo" href="#"><span className="logo-mark">PK</span><span>Pares<span>Kada</span><small>BRANCH MANAGEMENT</small></span></a>
      <div className="side-label">MAIN MENU</div>
      {nav.map(group => <div className="nav-group" key={group.title}><div className="nav-heading">{group.title}</div>{group.items.map(([name, icon]) => <button key={name} className={"nav-link " + (section === name ? "selected" : "")} onClick={() => setSection(name)}><span className="nav-icon">{icon}</span>{name}{name === "Inventory" && lowStock > 0 && <i className="nav-count">{lowStock}</i>}</button>)}</div>)}
      <div className="sidebar-bottom"><div className="help-card"><span>✦</span><b>Need a hand?</b><small>Keep your branches running smoothly.</small><button onClick={() => notify("Help center is coming soon.")}>Help & support ↗</button></div><div className="profile"><div className="profile-avatar">MV</div><div><b>Store Owner</b><small>Administrator</small></div><span>•••</span></div></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="crumb">ParesKada <span>/</span> <b>{section}</b></div><div className="top-actions"><button className="employee-view-btn" onClick={() => setSection(section === "Employee Portal" ? "Overview" : "Employee Portal")}>{section === "Employee Portal" ? "Owner dashboard" : "Employee portal"} ↗</button><span className="today-label">◷ &nbsp;{today}</span><button className="icon-button" onClick={() => notify("You're all caught up!")}>♧<i></i></button><div className="top-avatar">MV</div></div></header>
      <div className="content">
        <div className="welcome-row"><div><div className="overline">SUNDAY, NOVEMBER 1, 2026 · OWNER WORKSPACE</div><h1>{section === "Overview" ? "Good day, Owner! 👋" : section}</h1><p>{section === "Overview" ? "Here's what's happening across your paresan branches today." : "Manage your paresan operations in one place."}</p></div><div className="header-controls"><label className="select-wrap"><span>BRANCH</span><select value={branch} onChange={e => setBranch(e.target.value)}><option value="all">All branches</option>{initialBranches.map(b => <option key={b.id} value={b.id}>{b.name.replace("ParesKada · ", "")}</option>)}</select></label><label className="select-wrap shift-select"><span>SHIFT VIEW</span><select value={shift} onChange={e => setShift(e.target.value)}><option>Day</option><option>Night</option></select></label></div></div>

        {section === "Employee Portal" && (() => {
          const me = employees.find(e => e.id === Number(employeeId)) || employees[0];
          const mySales = dutyReports.filter(r => r.employeeId === me.id);
          const myPurchases = employeePurchases.filter(r => r.employeeId === me.id);
          const startSale = () => { setForm({ branch: me.branch, shift: me.shift, date: today, by: me.name, note: "Duty sales report" }); setModal("sale"); };
          const startDeduct = () => { setForm({ branch: me.branch, shift: me.shift, employee: me.name }); setModal("deduct"); };
          return <div className="employee-workspace">
            <div className="employee-welcome"><div><span className="overline">EMPLOYEE WORKSPACE</span><h2>Hello, {me.name.split(" ")[0]}! 👋</h2><p>Record your attendance and submit your shift report here.</p></div><label className="select-wrap employee-picker"><span>DEMO EMPLOYEE LOGIN</span><select value={employeeId} onChange={e=>setEmployeeId(Number(e.target.value))}>{employees.map(e=><option key={e.id} value={e.id}>{e.name} · {branchName(e.branch)}</option>)}</select></label></div>
            <div className="employee-identity panel"><div className="employee-big-avatar">{me.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div className="employee-identity-info"><b>{me.name}</b><span>{me.role} · {branchName(me.branch)}</span><span className={"shift-pill "+(me.shift==="Day"?"day":"night")}>{me.shift==="Day"?"☀ Day shift · 6 AM–6 PM":"☾ Night shift · 6 PM–6 AM"}</span></div><span className={"status-pill "+(me.status==="On duty"?"status-good":"status-muted")}>{me.status}</span></div>
            <div className="employee-action-grid">
              <section className="panel timeclock-panel"><div className="panel-head"><div><h2>My attendance</h2><p>Clock in when your duty starts and clock out when it ends.</p></div><span className="clock-face">◷</span></div><div className="clock-time">{new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit"})}</div><div className="clock-date">{today}</div><div className="clock-status">{me.status==="On duty"?"You are currently clocked in.":"You are currently off duty."}</div><button className={"clock-action "+(me.status==="On duty"?"clock-out":"clock-in")} onClick={()=>clockAction(me.id)}>{me.status==="On duty"?"Time out":"Time in"} <span>→</span></button><div className="clock-foot">Assigned schedule: {me.shift==="Day"?"6:00 AM – 6:00 PM":"6:00 PM – 6:00 AM"}</div></section>
              <section className="panel employee-report-panel"><div className="panel-head"><div><h2>End-of-shift report</h2><p>Submit your sales collection for this duty.</p></div><span className="quick-icon orange-bg">₱</span></div><div className="report-instructions">Enter the total sales you collected during your shift. The owner can review this under Sales & Cash-up.</div><button className="action-btn full-action" onClick={startSale}>＋ Report duty sales</button><button className="outline-btn full-action" onClick={startDeduct}>− Report items used / purchased</button></section>
            </div>
            <div className="bottom-grid employee-history-grid"><section className="panel"><div className="panel-head"><div><h2>My submitted sales reports</h2><p>Sales entries submitted from this employee view.</p></div><b className="history-total">{peso(mySales.reduce((a,s)=>a+s.amount,0))}</b></div>{mySales.length?mySales.map(s=><div className="employee-history-row" key={s.id}><div><b>{s.date} · {s.shift} shift</b><small>{s.note}</small></div><strong>{peso(s.amount)}</strong></div>):<div className="empty-state">No duty sales reports submitted yet.</div>}</section><section className="panel"><div className="panel-head"><div><h2>My stock / purchase reports</h2><p>Items you reported as used or taken from stock.</p></div></div>{myPurchases.length?myPurchases.map(s=><div className="employee-history-row" key={s.id}><div><b>{s.item}</b><small>{s.date} · {s.quantity} {s.unit}</small></div><strong>Reported</strong></div>):<div className="empty-state">No item usage reports submitted yet.</div>}</section></div>
            <p className="demo-note">Demo employee selector only. Individual employee accounts, secure login, database saving, and manager approval will be connected in the backend phase.</p>
          </div>;
        })()}
        {section === "Overview" && <>
          <div className="stats-grid">
            <Stat icon="₱" label="TOTAL SALES TODAY" value={peso(totalSales)} change="Across selected branches" tone="orange"/>
            <Stat icon="↗" label="DAILY EXPENSES" value={peso(totalExpenses)} change="Recorded operating costs" tone="blue"/>
            <Stat icon="▤" label="INVENTORY ITEMS" value={stock.length} change={lowStock + " items need restocking"} tone="purple"/>
            <Stat icon="♙" label="EMPLOYEES ON DUTY" value={onDuty.length} change="Across selected branches" tone="green"/>
          </div>
          <div className="overview-grid"><section className="panel sales-panel"><div className="panel-head"><div><h2>Sales overview</h2><p>Recorded sales by branch and shift</p></div><button className="subtle-btn" onClick={() => setSection("Sales & cash-up")}>View records ↗</button></div><div className="sales-highlight"><div><small>GROSS SALES RECORDED</small><strong>{peso(totalSales)}</strong><span className="positive">● Live preview figures</span></div><div className="sales-bars">{[35,55,43,72,60,88,66,96,70,82,57,100].map((n,i)=><i key={i} style={{height:n+"%"}} />)}</div></div><div className="mini-legend"><span><i className="dot orange-dot"/> Day shift</span><span><i className="dot brown-dot"/> Night shift</span></div><div className="shift-summary"><div><span className="shift-pill day">☀ Day shift</span><b>{peso(branchSales.filter(s=>s.shift==="Day").reduce((a,s)=>a+s.amount,0))}</b><small>{branchSales.filter(s=>s.shift==="Day").length} sales entries</small></div><div><span className="shift-pill night">☾ Night shift</span><b>{peso(branchSales.filter(s=>s.shift==="Night").reduce((a,s)=>a+s.amount,0))}</b><small>{branchSales.filter(s=>s.shift==="Night").length} sales entries</small></div></div></section>
          <section className="panel"><div className="panel-head"><div><h2>Inventory alerts</h2><p>Items at or below minimum stock</p></div><button className="subtle-btn" onClick={()=>setSection("Inventory")}>See all ↗</button></div>{stock.filter(s=>s.stock<=s.minimum).map(s=><div className="alert-row" key={s.id}><div className="item-symbol">▤</div><div className="alert-info"><b>{s.item}</b><small>{s.category}</small></div><span className="stock-low">{s.stock} {s.unit} left</span></div>)}{lowStock===0&&<div className="empty-state">All stock levels look good.</div>}<div className="stock-footer"><span>Estimated inventory value</span><b>{peso(stockValue)}</b></div></section></div>
          <div className="bottom-grid"><section className="panel"><div className="panel-head"><div><h2>Who's on duty?</h2><p>Employees currently clocked in</p></div><button className="subtle-btn" onClick={()=>setSection("Attendance")}>Attendance ↗</button></div>{onDuty.map(e=><div className="duty-row" key={e.id}><div className="person-avatar">{e.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div className="duty-info"><b>{e.name}</b><small>{e.role} · {branchName(e.branch)}</small></div><div className="duty-time"><i/> {e.shift} · {e.in}</div></div>)}{onDuty.length===0&&<div className="empty-state">No employees clocked in for this selection.</div>}</section><section className="panel quick-panel"><div className="panel-head"><div><h2>Quick actions</h2><p>Common daily tasks</p></div></div><div className="quick-actions"><button onClick={()=>openModal("sale")}><span className="quick-icon orange-bg">₱</span><span><b>Record shift sales</b><small>Enter sales for day or night duty</small></span><i>→</i></button><button onClick={()=>openModal("expense")}><span className="quick-icon blue-bg">↗</span><span><b>Add daily expense</b><small>Log purchases and operating costs</small></span><i>→</i></button><button onClick={()=>openModal("deduct")}><span className="quick-icon purple-bg">−</span><span><b>Deduct inventory</b><small>Record items used or taken</small></span><i>→</i></button></div></section></div>
        </>}

        {section === "Inventory" && <><div className="section-toolbar"><div className="inventory-summary"><b>{stock.length} items</b><span>·</span><span>{lowStock} low stock alerts</span></div><div><button className="outline-btn" onClick={()=>openModal("deduct")}>− Deduct / used</button><button className="action-btn" onClick={()=>openModal("purchase")}>＋ Add stock purchase</button></div></div><div className="panel table-panel"><div className="panel-head"><div><h2>Inventory list</h2><p>Track available ingredients, supplies, and packaging.</p></div><span className="table-date">Updated today</span></div><div className="table-scroll"><table><thead><tr><th>ITEM NAME</th><th>CATEGORY</th><th>ON HAND</th><th>MINIMUM</th><th>UNIT COST</th><th>STOCK VALUE</th><th>STATUS</th></tr></thead><tbody>{stock.map(s=><tr key={s.id}><td><b>{s.item}</b></td><td>{s.category}</td><td><b>{s.stock} {s.unit}</b></td><td>{s.minimum} {s.unit}</td><td>{peso(s.cost)}</td><td>{peso(s.stock*s.cost)}</td><td><span className={"status-pill "+(s.stock<=s.minimum?"status-low":"status-good")}>{s.stock<=s.minimum?"Low stock":"In stock"}</span></td></tr>)}</tbody></table></div><div className="table-foot">Inventory value: <b>{peso(stockValue)}</b><span>Sample data · Changes stay in this preview session.</span></div></div></>}

        {section === "Sales & cash-up" && <><div className="section-toolbar"><div className="inventory-summary"><b>Shift sales records</b><span>·</span><span>Day and night cash-up</span></div><button className="action-btn" onClick={()=>openModal("sale")}>＋ Record sales</button></div><div className="stats-grid compact-stats"><Stat label="GROSS SALES" value={peso(totalSales)} icon="₱"/><Stat label="DAY SHIFT" value={peso(branchSales.filter(s=>s.shift==="Day").reduce((a,s)=>a+s.amount,0))} icon="☀"/><Stat label="NIGHT SHIFT" value={peso(branchSales.filter(s=>s.shift==="Night").reduce((a,s)=>a+s.amount,0))} icon="☾"/><Stat label="ENTRIES" value={branchSales.length} icon="▤"/></div><RecordsTable title="Sales & cash-up history" columns={["DATE","BRANCH","SHIFT","RECORDED BY","NOTES","SALES AMOUNT"]}>{branchSales.map(s=><tr key={s.id}><td>{s.date}</td><td>{branchName(s.branch)}</td><td><span className={"shift-pill "+(s.shift==="Day"?"day":"night")}>{s.shift==="Day"?"☀":"☾"} {s.shift}</span></td><td>{s.by}</td><td>{s.note}</td><td><b>{peso(s.amount)}</b></td></tr>)}</RecordsTable></>}

        {section === "Daily expenses" && <><div className="section-toolbar"><div className="inventory-summary"><b>Daily expense log</b><span>·</span><span>Purchases and operating expenses</span></div><button className="action-btn" onClick={()=>openModal("expense")}>＋ Add expense</button></div><div className="stats-grid compact-stats"><Stat label="TOTAL EXPENSES" value={peso(totalExpenses)} icon="↗"/><Stat label="EXPENSE ENTRIES" value={branchExpenses.length} icon="▤"/><Stat label="NET AFTER EXPENSES" value={peso(totalSales-totalExpenses)} icon="₱"/><Stat label="DATE" value={today} icon="◷"/></div><RecordsTable title="Expense history" columns={["DATE","BRANCH","CATEGORY","DETAILS","RECORDED BY","AMOUNT"]}>{branchExpenses.map(e=><tr key={e.id}><td>{e.date}</td><td>{branchName(e.branch)}</td><td>{e.category}</td><td>{e.detail}</td><td>{e.by}</td><td><b>{peso(e.amount)}</b></td></tr>)}</RecordsTable></>}

        {section === "Attendance" && <><div className="section-toolbar"><div className="inventory-summary"><b>Employee attendance</b><span>·</span><span>Time in / time out monitoring</span></div><div className="filters"><button className={"filter "+(attendanceFilter==="All"?"active":"")} onClick={()=>setAttendanceFilter("All")}>All shifts</button><button className={"filter "+(attendanceFilter==="Day"?"active":"")} onClick={()=>setAttendanceFilter("Day")}>☀ Day</button><button className={"filter "+(attendanceFilter==="Night"?"active":"")} onClick={()=>setAttendanceFilter("Night")}>☾ Night</button></div></div><div className="stats-grid compact-stats"><Stat label="ON DUTY" value={filteredEmployees.filter(e=>e.status==="On duty").length} icon="♙"/><Stat label="OFF DUTY" value={filteredEmployees.filter(e=>e.status==="Off duty").length} icon="◷"/><Stat label="DAY SHIFT STAFF" value={employees.filter(e=>e.shift==="Day").length} icon="☀"/><Stat label="NIGHT SHIFT STAFF" value={employees.filter(e=>e.shift==="Night").length} icon="☾"/></div><div className="panel table-panel"><div className="panel-head"><div><h2>Today's attendance</h2><p>Clock-in and clock-out records by branch and shift.</p></div><span className="table-date">{today}</span></div><div className="table-scroll"><table><thead><tr><th>EMPLOYEE</th><th>BRANCH</th><th>ROLE</th><th>SHIFT</th><th>TIME IN</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>{filteredEmployees.map(e=><tr key={e.id}><td><b>{e.name}</b></td><td>{branchName(e.branch)}</td><td>{e.role}</td><td><span className={"shift-pill "+(e.shift==="Day"?"day":"night")}>{e.shift==="Day"?"☀":"☾"} {e.shift}</span></td><td>{e.in}</td><td><span className={"status-pill "+(e.status==="On duty"?"status-good":"status-muted")}>{e.status}</span></td><td><button className="small-action" onClick={()=>clockAction(e.id)}>{e.status==="On duty"?"Time out":"Time in"}</button></td></tr>)}</tbody></table></div><div className="table-foot">Day shift: 6:00 AM – 6:00 PM <span>Night shift: 6:00 PM – 6:00 AM</span></div></div></>}

        {section === "Branches" && <div className="branch-grid">{initialBranches.map((b,i)=><div className="panel branch-card" key={b.id}><div className="branch-top"><span className="branch-icon">⌖</span><span className="status-pill status-good">Active</span></div><h2>{b.name}</h2><p>{b.location}</p><div className="branch-metrics"><div><b>{employees.filter(e=>e.branch===b.id).length}</b><small>Employees</small></div><div><b>{employees.filter(e=>e.branch===b.id&&e.status==="On duty").length}</b><small>On duty now</small></div><div><b>{peso(sales.filter(s=>s.branch===b.id).reduce((a,s)=>a+s.amount,0))}</b><small>Sales recorded</small></div></div><button className="subtle-btn" onClick={()=>{setBranch(b.id);setSection("Overview")}}>View branch dashboard ↗</button></div>)}</div>}

        {section === "Employees" && <><div className="section-toolbar"><div className="inventory-summary"><b>Employee directory</b><span>·</span><span>Assigned branch and shift schedules</span></div><button className="action-btn" onClick={()=>openModal("employee")}>＋ Add employee</button></div><div className="panel table-panel"><div className="panel-head"><div><h2>Team members</h2><p>Manage employee assignments and duty schedules.</p></div></div><div className="table-scroll"><table><thead><tr><th>EMPLOYEE</th><th>ROLE</th><th>BRANCH</th><th>ASSIGNED SHIFT</th><th>STATUS</th></tr></thead><tbody>{employees.filter(e=>branch==="all"||e.branch===branch).map(e=><tr key={e.id}><td><b>{e.name}</b></td><td>{e.role}</td><td>{branchName(e.branch)}</td><td><span className={"shift-pill "+(e.shift==="Day"?"day":"night")}>{e.shift==="Day"?"☀":"☾"} {e.shift}</span></td><td><span className={"status-pill "+(e.status==="On duty"?"status-good":"status-muted")}>{e.status}</span></td></tr>)}</tbody></table></div></div></>}

        {section === "Reports" && <><div className="stats-grid"><Stat label="TOTAL SALES" value={peso(totalSales)} icon="₱"/><Stat label="TOTAL EXPENSES" value={peso(totalExpenses)} icon="↗"/><Stat label="NET SALES LESS EXPENSES" value={peso(totalSales-totalExpenses)} icon="▥"/><Stat label="INVENTORY VALUE" value={peso(stockValue)} icon="▤"/></div><div className="panel report-panel"><div className="panel-head"><div><h2>Branch performance snapshot</h2><p>Sales and expense summary based on recorded preview data.</p></div></div>{initialBranches.filter(b=>branch==="all"||b.id===branch).map(b=>{const s=sales.filter(x=>x.branch===b.id).reduce((a,x)=>a+x.amount,0);const ex=expenses.filter(x=>x.branch===b.id).reduce((a,x)=>a+x.amount,0);return <div className="report-row" key={b.id}><div><b>{b.name.replace("ParesKada · ","")}</b><small>{b.location}</small></div><span>Sales <b>{peso(s)}</b></span><span>Expenses <b>{peso(ex)}</b></span><span>Net <b>{peso(s-ex)}</b></span></div>})}<p className="demo-note">Report export and historical date filters can be added in the next development phase.</p></div></>}
      </div>
    </main>

    {modal && <div className="modal-overlay" onClick={()=>setModal("")}><div className="form-modal" onClick={e=>e.stopPropagation()}><div className="modal-heading"><div><span className="overline">PARESKADA MANAGEMENT</span><h2>{modal==="sale"?"Record shift sales":modal==="expense"?"Add daily expense":modal==="purchase"?"Add stock purchase":modal==="deduct"?"Deduct inventory": "Add employee"}</h2></div><button onClick={()=>setModal("")}>×</button></div>
      {(modal==="sale"||modal==="expense")&&<><Field label="Branch"><select value={form.branch||"main"} onChange={e=>setForm({...form,branch:e.target.value})}>{initialBranches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></Field>{modal==="sale"&&<Field label="Duty shift"><select value={form.shift||"Day"} onChange={e=>setForm({...form,shift:e.target.value})}><option>Day</option><option>Night</option></select></Field>}{modal==="expense"&&<Field label="Expense category"><select value={form.category||"Ingredients"} onChange={e=>setForm({...form,category:e.target.value})}>{["Ingredients","Utilities","Transportation","Supplies","Salary","Rent","Other"].map(x=><option key={x}>{x}</option>)}</select></Field>}<Field label="Amount (₱)"><input type="number" min="0" value={form.amount||""} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0.00"/></Field><Field label={modal==="sale"?"Recorded by":"Expense details"}><input value={modal==="sale"?(form.by||""):(form.detail||"")} onChange={e=>setForm({...form,[modal==="sale"?"by":"detail"]:e.target.value})} placeholder={modal==="sale"?"Employee name":"What was purchased or paid?"}/></Field><Field label="Date"><input value={form.date||today} onChange={e=>setForm({...form,date:e.target.value})}/></Field>{modal==="sale"&&<Field label="Notes (optional)"><input value={form.note||""} onChange={e=>setForm({...form,note:e.target.value})} placeholder="e.g. Cash + GCash collection"/></Field>}</>}
      {(modal==="purchase"||modal==="deduct")&&<><Field label="Inventory item"><select value={form.item||""} onChange={e=>setForm({...form,item:e.target.value})}><option value="">Choose item</option>{stock.map(s=><option key={s.id} value={s.id}>{s.item} · {s.stock} {s.unit} available</option>)}</select></Field><Field label="Quantity"><input type="number" min="0" value={form.quantity||""} onChange={e=>setForm({...form,quantity:e.target.value})} placeholder="Enter quantity"/></Field>{modal==="deduct"&&<Field label="Reported by (employee)"><select value={form.employee||""} onChange={e=>setForm({...form,employee:e.target.value})}><option value="">Owner / manager</option>{employees.map(e=><option key={e.id}>{e.name}</option>)}</select></Field>}<p className="form-hint">{modal==="purchase"?"Purchased stock will be added to the inventory count.":"Items used, taken, or issued will be deducted from the available stock."}</p></>}
      {modal==="employee"&&<><Field label="Employee full name"><input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Enter employee name"/></Field><Field label="Position / role"><input value={form.role||""} onChange={e=>setForm({...form,role:e.target.value})} placeholder="e.g. Cook, Cashier"/></Field><Field label="Assigned branch"><select value={form.branch||"main"} onChange={e=>setForm({...form,branch:e.target.value})}>{initialBranches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></Field><Field label="Assigned shift"><select value={form.shift||"Day"} onChange={e=>setForm({...form,shift:e.target.value})}><option>Day</option><option>Night</option></select></Field></>}
      <div className="modal-actions"><button className="outline-btn" onClick={()=>setModal("")}>Cancel</button><button className="action-btn" onClick={saveForm}>Save record</button></div>
    </div></div>}
    {toast&&<div className="toast">{toast}</div>}
  </div>;
}

function Stat({icon,label,value,change,tone="orange"}){return <div className="stat-card"><div className={"stat-icon "+tone}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div>{change&&<div className="stat-change">{change}</div>}</div>}
function Field({label,children}){return <label className="form-field"><span>{label}</span>{children}</label>}
function RecordsTable({title,columns,children}){return <div className="panel table-panel"><div className="panel-head"><div><h2>{title}</h2><p>Recent records for the selected branch filter.</p></div></div><div className="table-scroll"><table><thead><tr>{columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{children}</tbody></table></div></div>}
