import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Building2, LayoutDashboard, Users, WalletCards, BarChart3, Settings, HelpCircle, Search, Download, Plus, Eye, FileUp, MoreVertical, Printer, Filter, Grid2X2, List, X, Upload, Save, Trash2, Edit3, LogOut, ShieldCheck, LockKeyhole, Mail, Database, ServerCog, TrendingUp, TrendingDown, CalendarDays, CheckCircle2, Info } from 'lucide-react';
import './styles.css';

const roles = {
  'operations@sarabalmadina.com': { name: 'Munir', designation: 'Operations Supervisor' },
  'info@sarabalmadina.com': { name: 'Rashid', designation: 'Head Office Staff' },
  'admin@sarabalmadina.com': { name: 'Arslan', designation: 'Head Office Staff' },
  'asamaashraf55@gmail.com': { name: 'Asama Ashraf', designation: 'Logistics Manager' },
  'muzafar@sarabalmadina.com': { name: 'Muzafar Iqbal', designation: 'General Manager' },
  'ashrafgill@hotmail.com': { name: 'Ch Ashraf', designation: 'Owner / CEO' }
};
const modules = [
  ['dashboard', LayoutDashboard, 'Dashboard'], ['camps', Building2, 'Camps & Rooms'], ['tenants', Users, 'Tenants'], ['finance', WalletCards, 'Finance'], ['reports', BarChart3, 'Reports'], ['settings', Settings, 'Settings'], ['support', HelpCircle, 'Support']
];
const money = n => `AED ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: Number(n || 0) % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const today = () => new Date().toISOString().slice(0, 10);
const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const prettyDate = d => { const x = new Date(d); return x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
const reportRangeMap = { 'jul-sep-2024': { label: 'Jul 1, 2024 - Sep 30, 2024', subtitle: 'Q3 2024' }, 'oct-dec-2024': { label: 'Oct 1, 2024 - Dec 31, 2024', subtitle: 'Q4 2024' }, 'jan-mar-2024': { label: 'Jan 1, 2024 - Mar 31, 2024', subtitle: 'Q1 2024' }, 'apr-jun-2024': { label: 'Apr 1, 2024 - Jun 30, 2024', subtitle: 'Q2 2024' }, 'jan-2024': { label: 'Jan 1, 2024 - Jan 31, 2024', subtitle: 'Jan 2024' }, 'feb-2024': { label: 'Feb 1, 2024 - Feb 29, 2024', subtitle: 'Feb 2024' }, 'mar-2024': { label: 'Mar 1, 2024 - Mar 31, 2024', subtitle: 'Mar 2024' }, 'year-2024': { label: 'Jan 1, 2024 - Dec 31, 2024', subtitle: '2024' } };

const getDateValue = (row, ...keys) => {
  const raw = keys.map(k => row?.[k]).find(Boolean) || row?.created_at;
  const d = raw ? new Date(raw) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
};
const isSameMonth = (d, y, m) => d && d.getFullYear() === y && d.getMonth() === m;
const sumInMonth = (rows, amountKey, y, m, ...dateKeys) =>
  rows.filter(r => isSameMonth(getDateValue(r, ...dateKeys), y, m)).reduce((a, r) => a + Number(r[amountKey] || 0), 0);
const getMonthTrend = (current, previous, noun = 'from last month') => {
  if (!previous && !current) return null;
  if (!previous && current) return 'New activity this month';
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}% ${noun}`;
};
const getTrendTone = (current, previous, lowerIsBetter = false) => {
  if (!previous && !current) return 'muted';
  const improved = lowerIsBetter ? current <= previous : current >= previous;
  return improved ? 'good' : 'danger';
};
const getTrendIcon = (current, previous) => current >= previous ? 'up' : 'down';
const normalize = v => String(v ?? '').toLowerCase();
const csvDownload = (filename, rows) => {
  const data = rows.length ? rows : [{ note: 'No records found' }];
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = filename; a.click(); URL.revokeObjectURL(a.href);
};
function Toast({ msg }) { return msg ? <div className="toast">{msg}</div> : null; }
function Badge({ children, type }) { return <span className={`badge ${type || normalize(children).replaceAll(' ', '-')}`}>{children}</span>; }
function Modal({ title, children, onClose, wide }) { return <div className="overlay"><div className={`modal ${wide ? 'wide' : ''}`}><div className="modalHead"><h2>{title}</h2><button className="iconBtn" onClick={onClose}><X size={20}/></button></div>{children}</div></div>; }
function Field({ label, children }) { return <label className="field"><span>{label}</span>{children}</label>; }

function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  async function login(e) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message);
  }
  return <div className="loginShell">
    <div className="loginBgOrb one" />
    <div className="loginBgOrb two" />
    <div className="loginPanel">
      <div className="loginHero">
        <div className="loginBrandMark"><Building2 size={34}/></div>
        <p className="eyebrow">Sarab Al Madina's Portal</p>
        <h1>LaborConnect</h1>
        <p className="heroCopy">Camp, tenant, rent, WiFi, expense, invoice, and reporting operations in one secure workspace.</p>
        <div className="heroStats">
          <div><strong>Real data</strong><span>Sarab Data powered</span></div>
          <div><strong>Secure login</strong><span>Auth required</span></div>
          <div><strong>Live records</strong><span>All real data</span></div>
        </div>
      </div>
      <div className="loginFormPanel">
        <div className="loginHeader">
          <div>
            <p className="eyebrow dark">Authorized Access</p>
            <h2>Sign in to your workspace</h2>
          </div>
          <div className="secureBadge"><ShieldCheck size={18}/> Secure</div>
        </div>
        {!isSupabaseConfigured && <div className="setupNotice">
          <ServerCog size={20}/>
          <div><strong>Database connection required</strong><span>Add the database URL and public key in your .env file, then restart npm run dev.</span></div>
        </div>}
        <form onSubmit={login} className="authForm">
          <label className="authField"><span>Email</span><div><Mail size={18}/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" autoComplete="email"/></div></label>
          <label className="authField"><span>Password</span><div><LockKeyhole size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password"/></div></label>
          {err && <p className="error clean">{err}</p>}
          <button className="loginButton" disabled={loading || !isSupabaseConfigured}>{loading ? 'Signing in...' : 'Login to ERP'}</button>
        </form>
        <div className="loginFoot">
          <span><Database size={15}/> Sarab Data powered</span>
          <span>v1.0</span>
        </div>
      </div>
    </div>
  </div>;
}

function App() {
  const [session, setSession] = useState(null); const [page, setPage] = useState('dashboard'); const [query, setQuery] = useState(''); const [toast, setToast] = useState(''); const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ camps: [], tenants: [], charges: [], payments: [], expenses: [], tickets: [] });
  const [modal, setModal] = useState(null); const [filters, setFilters] = useState({ campLocation: 'All', campStatus: 'All', tenantStatus: 'All', financeTab: 'rent', building: 'All', expenseCategory: 'All' });
  const profile = { name: 'Asama Ashraf', designation: 'Manager' };
  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''), 2200); };
  useEffect(()=>{ if(!supabase){setLoading(false);return;} supabase.auth.getSession().then(({data})=>{setSession(data.session); setLoading(false);}); const { data: sub } = supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); return ()=>sub.subscription.unsubscribe(); },[]);
  useEffect(()=>{ if(session) loadAll(); },[session]);
  async function loadAll(){ setLoading(true); const calls = await Promise.all(['camps','tenants','charges','payments','expenses','support_tickets'].map(t=>supabase.from(t).select('*').order('created_at',{ascending:false}))); setData({ camps:calls[0].data||[], tenants:calls[1].data||[], charges:calls[2].data||[], payments:calls[3].data||[], expenses:calls[4].data||[], tickets:calls[5].data||[] }); setLoading(false); }
  async function insert(table, payload){ const {error}=await supabase.from(table).insert(payload); if(error) return showToast(error.message); await loadAll(); setModal(null); showToast('Saved successfully'); }
  async function update(table, id, payload){ const {error}=await supabase.from(table).update(payload).eq('id',id); if(error) return showToast(error.message); await loadAll(); setModal(null); showToast('Updated successfully'); }
  async function remove(table, id){ if(!confirm('Delete this record?')) return; const {error}=await supabase.from(table).delete().eq('id',id); if(error) return showToast(error.message); await loadAll(); showToast('Deleted'); }
  const ctx = { data, filters, setFilters, query, setModal, showToast, insert, update, remove, loadAll, setPage };
  if(loading) return <div className="loader">Loading LaborConnect...</div>;
  if(!session) return <AuthScreen/>;
  const pageRows = getRowsForExport(page, data, filters, query);
  return <div className="app"><aside className="sidebar"><div className="logo">LaborConnect<small>Sarab Al Madina's Portal</small></div><nav>{modules.map(([key,Icon,label])=><button key={key} onClick={()=>setPage(key)} className={page===key?'active':''}><Icon size={18}/>{label}</button>)}</nav><div className="userCard"><div className="avatar">A</div><div><strong>{profile.name}</strong><small>{profile.designation}</small></div><button title="Logout" className="logoutBtn" onClick={()=>supabase.auth.signOut()}><LogOut size={15}/> Logout</button></div></aside><main><header className="topbar"><div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records, tenants, camps, receipts..."/></div><button className="ghost" onClick={()=>csvDownload(`${page}_export.csv`, pageRows)}><Download size={16}/> Export</button><button className="primary" onClick={()=>setModal({type:getNewEntryModal(page)})}><Plus size={17}/> New Entry</button></header><Content page={page} ctx={ctx}/></main>{page !== 'dashboard' && <button className="fab" onClick={()=>setModal({type:getNewEntryModal(page)})}><Plus/></button>}{modal && <DynamicModal modal={modal} setModal={setModal} ctx={ctx}/>}<Toast msg={toast}/></div>;
}

function getNewEntryModal(page){ return page==='tenants'?'new-tenants':page==='finance'?'add-charge':page==='reports'?'log-expense':page==='support'?'new-support':'new-camps'; }
function Content({ page, ctx }) { return page==='dashboard'?<Dashboard ctx={ctx}/>:page==='camps'?<Camps ctx={ctx}/>:page==='tenants'?<Tenants ctx={ctx}/>:page==='finance'?<Finance ctx={ctx}/>:page==='reports'?<Reports ctx={ctx}/>:page==='settings'?<SettingsPage ctx={ctx}/>:<Support ctx={ctx}/>; }
function filtered(rows,q,fields){ if(!q) return rows; return rows.filter(r=>fields.some(f=>normalize(r[f]).includes(normalize(q)))); }
function Dashboard({ctx}){
  const {camps,tenants,expenses,payments}=ctx.data;
  const [period,setPeriod]=useState('Monthly');
  const now=new Date();
  const y=now.getFullYear(), m=now.getMonth();
  const prev=new Date(y,m-1,1);
  const activeTenants=tenants.filter(t=>t.status==='Active').length;
  const totalBeds=camps.reduce((a,c)=>a+Number(c.capacity||0),0);
  const maintenanceBeds=camps.reduce((a,c)=>a+Number(c.maintenance_count||0),0);
  const occupiedBeds=Math.min(activeTenants,totalBeds);
  const vacantBeds=Math.max(totalBeds-occupiedBeds-maintenanceBeds,0);
  const collectionTotal=payments.reduce((a,p)=>a+Number(p.amount||0),0);
  const expenseTotal=expenses.reduce((a,e)=>a+Number(e.amount||0),0);
  const currentCollection=sumInMonth(payments,'amount',y,m,'payment_date');
  const previousCollection=sumInMonth(payments,'amount',prev.getFullYear(),prev.getMonth(),'payment_date');
  const currentExpenses=sumInMonth(expenses,'amount',y,m,'expense_date');
  const previousExpenses=sumInMonth(expenses,'amount',prev.getFullYear(),prev.getMonth(),'expense_date');
  const currentProfit=currentCollection-currentExpenses;
  const previousProfit=previousCollection-previousExpenses;
  const occ=totalBeds?Math.round((occupiedBeds/totalBeds)*100):0;
  return <section>
    <div className="titleRow responsiveRow">
      <Title title="Operations Overview" sub="Real-time performance analytics for LaborConnect portfolio"/>
      <div className="tabs slim">
        {['Monthly','Quarterly','Yearly'].map(v=><button key={v} className={period===v?'on':''} onClick={()=>setPeriod(v)}>{v}</button>)}
      </div>
    </div>
    <div className="kpis">
      <Kpi label="Total Collection" value={money(collectionTotal)} trend={getMonthTrend(currentCollection,previousCollection,'from last month')} trendTone={getTrendTone(currentCollection,previousCollection)} trendIcon={getTrendIcon(currentCollection,previousCollection)}/>
      <Kpi label="Total Expenses" value={money(expenseTotal)} trend={getMonthTrend(currentExpenses,previousExpenses,'vs last month')} trendTone={getTrendTone(currentExpenses,previousExpenses,true)} trendIcon={getTrendIcon(currentExpenses,previousExpenses)}/>
      <Kpi label="Net Profit" value={money(collectionTotal-expenseTotal)} trend={getMonthTrend(currentProfit,previousProfit,'net growth')} trendTone={getTrendTone(currentProfit,previousProfit)} trendIcon={getTrendIcon(currentProfit,previousProfit)}/>
      <Kpi label="Occupancy Rate" value={`${occ}%`} helper={`${occupiedBeds.toLocaleString()} occupied / ${totalBeds.toLocaleString()} beds`} helperIcon="info" bar={occ}/>
    </div>
    <div className="grid two dashboardGrid">
      <Card title="Collection vs Expense Trend"><Bars payments={payments} expenses={expenses} period={period}/></Card>
      <Card title="Occupancy Analytics"><OccupancyAnalytics occupied={occupiedBeds} vacant={vacantBeds} maintenance={maintenanceBeds} total={totalBeds}/></Card>
    </div>
    <Card title="Top Performing Camps" action={<button onClick={()=>ctx.setPage('camps')}>View All Assets ›</button>}><CampTable camps={camps.slice(0,4)} compact/></Card>
  </section>
}
function Camps({ctx}){ const rows=filtered(ctx.data.camps,ctx.query,['name','location','status']).filter(c=>(ctx.filters.campLocation==='All'||c.location===ctx.filters.campLocation)&&(ctx.filters.campStatus==='All'||c.status===ctx.filters.campStatus)); const locs=['All',...new Set(ctx.data.camps.map(c=>c.location).filter(Boolean))]; return <section><Title title="Accommodation Management" sub="Overseeing residential clusters across Dubai and Abu Dhabi."/><div className="filterbar"><Select label="Location" value={ctx.filters.campLocation} options={locs} onChange={v=>ctx.setFilters({...ctx.filters,campLocation:v})}/><Select label="Status" value={ctx.filters.campStatus} options={['All','Operational','At Capacity','Maintenance']} onChange={v=>ctx.setFilters({...ctx.filters,campStatus:v})}/><button className="ghost" onClick={()=>ctx.setFilters({...ctx.filters,campLocation:'All',campStatus:'All'})}>Reset Filters</button></div><div className="kpis"><Kpi label="Total Capacity" value={ctx.data.camps.reduce((a,c)=>a+Number(c.capacity||0),0).toLocaleString()}/><Kpi label="Total Occupancy" value={ctx.data.tenants.filter(t=>t.status==='Active').length.toLocaleString()}/><Kpi label="Vacant Beds" value={Math.max(ctx.data.camps.reduce((a,c)=>a+Number(c.capacity||0),0)-ctx.data.tenants.filter(t=>t.status==='Active').length,0).toLocaleString()}/><Kpi label="Maintenance Required" value={ctx.data.camps.reduce((a,c)=>a+Number(c.maintenance_count||0),0)} bad/></div><Card title="Camp Roster"><CampTable camps={rows} actions ctx={ctx}/></Card></section> }
function Tenants({ctx}){ const rows=filtered(ctx.data.tenants,ctx.query,['name','company','emirates_id','room','camp_name']).filter(t=>ctx.filters.tenantStatus==='All'||t.status===ctx.filters.tenantStatus); return <section><div className="titleRow"><Title title="Tenants" sub="Tenant registry, lease status, documents and room allocation."/><div className="seg"><button className="on"><List size={18}/></button><button><Grid2X2 size={18}/></button></div></div><div className="filterbar"><Select label="Filter Status" value={ctx.filters.tenantStatus} options={['All','Active','Expiring','Checked-out']} onChange={v=>ctx.setFilters({...ctx.filters,tenantStatus:v})}/><button className="ghost" onClick={()=>ctx.setModal({type:'tenant-filters'})}><Filter size={16}/> Advanced Filters</button><button className="ghost" onClick={()=>csvDownload('tenants.csv', rows)}>Export Excel</button><button className="ghost" onClick={()=>window.print()}>PDF</button></div><Card><TenantTable rows={rows} ctx={ctx}/></Card><div className="kpis"><Kpi label="Total Occupants" value={ctx.data.tenants.length}/><Kpi label="Active Lease" value={ctx.data.tenants.filter(t=>t.status==='Active').length}/><Kpi label="Expiring (30 days)" value={ctx.data.tenants.filter(t=>t.status==='Expiring').length} bad/><Kpi label="Pending Docs" value={ctx.data.tenants.filter(t=>!t.docs_complete).length}/></div></section> }
function Finance({ctx}){
  const tab=ctx.filters.financeTab;
  const allCharges=filtered(ctx.data.charges,ctx.query,['tenant_name','company','room','receipt_no','charge_type','camp_name']);
  const rows=allCharges
    .filter(r=>tab==='rent'?r.charge_type==='Rent':tab==='wifi'?r.charge_type==='WiFi':Number(r.balance)>0)
    .filter(r=>ctx.filters.building==='All'||r.camp_name===ctx.filters.building);
  const paid=rows.reduce((a,r)=>a+Number(r.amount_paid||0),0), due=rows.reduce((a,r)=>a+Number(r.amount_due||0),0), bal=rows.reduce((a,r)=>a+Number(r.balance||0),0);
  const eff=due?Math.round((paid/due)*1000)/10:0;
  const unpaidTotal=allCharges.filter(r=>Number(r.amount_paid||0)===0 && Number(r.balance||0)>0).reduce((a,r)=>a+Number(r.balance||0),0);
  const partialTotal=allCharges.filter(r=>normalize(r.status)==='partial').reduce((a,r)=>a+Number(r.balance||0),0);
  const settledToday=ctx.data.payments.filter(p=>p.payment_date===today()).reduce((a,p)=>a+Number(p.amount||0),0);
  return <section>
    <div className="financeHead responsiveRow">
      <Title title="Rent & WiFi Collection" sub="Create dues, record collections, and track outstanding tenant balances."/>
      <div className="tabs">
        <button className={tab==='rent'?'on':''} onClick={()=>ctx.setFilters({...ctx.filters,financeTab:'rent'})}>Rent Collections</button>
        <button className={tab==='wifi'?'on':''} onClick={()=>ctx.setFilters({...ctx.filters,financeTab:'wifi'})}>WiFi Revenue</button>
        <button className={tab==='outstanding'?'on':''} onClick={()=>ctx.setFilters({...ctx.filters,financeTab:'outstanding'})}>Outstanding Balances</button>
      </div>
    </div>
    <div className="kpis three">
      <Kpi label="Total Outstanding" value={money(bal)} helper="Calculated from open charge balances" helperIcon="info" bar={due?Math.min(100,(bal/due)*100):0}/>
      <Kpi label="Collections Today" value={money(settledToday)} helper="Payments recorded today" helperIcon="check" bar={eff}/>
      <div className="bluePanel"><small>Collection Efficiency</small><h1>{eff}%</h1><p>{due?`${money(paid)} collected from ${money(due)} due`:'Add charges to calculate efficiency'}</p><button onClick={()=>ctx.setModal({type:'finance-analysis', rows})}>View Deep Analysis</button></div>
    </div>
    <Card title={`Payment Due Roster`} action={<><button onClick={()=>ctx.setModal({type:'add-charge'})} className="ghost"><Plus size={16}/> Add Charge/Due</button><button onClick={()=>ctx.setModal({type:'record-payment'})} className="primary"><WalletCards size={16}/> Record Payment</button><button onClick={()=>ctx.setModal({type:'building-filter'})} className="ghost"><Filter size={16}/> Filter By Building</button><button className="ghost" onClick={()=>csvDownload('bulk_receipts.csv', rows)}><Download size={16}/> Export</button></>}><FinanceTable rows={rows} ctx={ctx}/></Card>
    <div className="financeSummaryBar">
      <span className="sum unpaid"><i></i>Unpaid: {money(unpaidTotal)}</span>
      <span className="sum partial"><i></i>Partial: {money(partialTotal)}</span>
      <span className="sum settled"><i></i>Settled Today: {money(settledToday)}</span>
    </div>
  </section>
}
function Reports({ctx}){
  const rows=filtered(ctx.data.expenses,ctx.query,['category','vendor','invoice_no','status']).filter(e=>ctx.filters.expenseCategory==='All'||e.category===ctx.filters.expenseCategory);
  const [rangePreset,setRangePreset]=useState('jul-sep-2024');
  const rangeInfo=reportRangeMap[rangePreset]||reportRangeMap['jul-sep-2024'];
  const now=new Date();
  const y=now.getFullYear(), m=now.getMonth();
  const prev=new Date(y,m-1,1);
  const total=rows.reduce((a,e)=>a+Number(e.amount||0),0);
  const utilities=rows.filter(e=>['DEWA','Gas','Utilities'].includes(e.category)).reduce((a,e)=>a+Number(e.amount||0),0);
  const maintenanceReserve=rows.filter(e=>e.category==='Maintenance').reduce((a,e)=>a+Number(e.amount||0),0);
  const revenue=ctx.data.payments.reduce((a,p)=>a+Number(p.amount||0),0);
  const ratio=total?revenue/Math.max(total,1):0;
  const currentExpense=sumInMonth(rows,'amount',y,m,'expense_date');
  const previousExpense=sumInMonth(rows,'amount',prev.getFullYear(),prev.getMonth(),'expense_date');
  const utilityRows=rows.filter(e=>['DEWA','Gas','Utilities'].includes(e.category));
  const currentUtilities=sumInMonth(utilityRows,'amount',y,m,'expense_date');
  const previousUtilities=sumInMonth(utilityRows,'amount',prev.getFullYear(),prev.getMonth(),'expense_date');
  return <section>
    <div className="titleRow responsiveRow">
      <Title title="Expense Reports & Analytics" sub={`Comprehensive financial tracking for ${rangeInfo.subtitle}`}/>
      <div className="reportToolbar">
        <label className="dateSelect">
          <CalendarDays size={16}/>
          <select value={rangePreset} onChange={e=>setRangePreset(e.target.value)}>
            <option value="jul-sep-2024">Jul 1, 2024 - Sep 30, 2024</option>
            <option value="oct-dec-2024">Oct 1, 2024 - Dec 31, 2024</option>
            <option value="jan-mar-2024">Jan 1, 2024 - Mar 31, 2024</option>
            <option value="apr-jun-2024">Apr 1, 2024 - Jun 30, 2024</option>
            <option value="jan-2024">Jan 2024</option>
            <option value="feb-2024">Feb 2024</option>
            <option value="mar-2024">Mar 2024</option>
            <option value="year-2024">Full Year 2024</option>
          </select>
        </label>
      </div>
    </div>
    <div className="kpis reportKpis">
      <Kpi label="Total Expenses (MTD)" value={money(total)} trend={getMonthTrend(currentExpense,previousExpense,'vs last month')} trendTone={getTrendTone(currentExpense,previousExpense,true)} trendIcon={getTrendIcon(currentExpense,previousExpense)}/>
      <Kpi label="Utility Costs" value={money(utilities)} trend={getMonthTrend(currentUtilities,previousUtilities,'efficiency trend')} trendTone={getTrendTone(currentUtilities,previousUtilities,true)} trendIcon={getTrendIcon(currentUtilities,previousUtilities)}/>
      <Kpi label="Maintenance Reserve" value={money(maintenanceReserve)} helper={maintenanceReserve ? 'Based on logged maintenance expenses' : 'No maintenance expenses logged'} helperIcon="info"/>
      <Kpi label="Revenue / Expense Ratio" value={ratio?`${ratio.toFixed(2)}x`:'—'} helper={ratio ? 'Calculated from real collections and expenses' : 'Needs collection and expense data'} helperTone={ratio?'good':'muted'} helperIcon={ratio?'check':'info'}/>
    </div>
    <div className="reportLayout">
      <Card title="Expense Breakdown"><ExpenseBreak rows={rows}/></Card>
      <div className="reportSide">
        <div className="actionBanner">
          <div className="actionBannerIcon"><WalletCards size={28}/></div>
          <div className="actionBannerCopy">
            <h3>Log New Expense</h3>
            <p>Submit invoices for DEWA, Gas, Salaries, or Maintenance.</p>
          </div>
          <div className="actionBannerActions">
            <button className="ghost" onClick={()=>ctx.setModal({type:'upload-invoice'})}><Upload size={16}/> Upload Invoice</button>
            <button className="primary" onClick={()=>ctx.setModal({type:'log-expense'})}>Log Expense</button>
          </div>
        </div>
        <Card title="Reports Center" action={<button onClick={()=>ctx.setModal({type:'archive'})}>View All Archive</button>}>
          <div className="reportCards refined">
            {[
              ['Profit & Loss','Revenue, expenses, and net profit'],
              ['Collection Report','Rent, WiFi, partial, unpaid'],
              ['Occupancy Trends','Camp and room utilization']
            ].map(([title,desc])=><div key={title} className="reportCard"><FileUp size={22}/><b>{title}</b><span>{desc}</span><button className="ghost" onClick={()=>csvDownload(`${title}.csv`, title==='Collection Report' ? ctx.data.payments : title==='Occupancy Trends' ? ctx.data.tenants : rows)}><Download size={15}/> Download PDF</button></div>)}
          </div>
        </Card>
      </div>
    </div>
    <Card title="Recent Transactions" action={<Select label="" value={ctx.filters.expenseCategory} options={['All',...new Set(ctx.data.expenses.map(e=>e.category).filter(Boolean))]} onChange={v=>ctx.setFilters({...ctx.filters,expenseCategory:v})}/>}> 
      <ExpenseTable rows={rows} ctx={ctx}/>
    </Card>
  </section>
}
function SettingsPage({ctx}){ return <section><Title title="Settings" sub="Company settings and operating preferences."/><Card title="Company Profile"><form className="formGrid" onSubmit={e=>{e.preventDefault();ctx.showToast('Settings saved')}}><Field label="Company Name"><input defaultValue="Sarab Al Madina / LaborConnect"/></Field><Field label="Currency"><select defaultValue="AED"><option>AED</option><option>CAD</option></select></Field><Field label="Default VAT %"><input defaultValue="5"/></Field><Field label="Notification Email"><input defaultValue="operations@sarabalmadina.com"/></Field><button className="primary">Save Settings</button></form></Card></section> }
function Support({ctx}){
  const tickets=filtered(ctx.data.tickets,ctx.query,['subject','priority','status','description']);
  return <section>
    <Title title="Support" sub="Create and track internal support requests."/>
    <div className="supportLayout">
      <Card title="Create Support Ticket">
        <form className="supportForm" onSubmit={e=>{e.preventDefault(); const fd=new FormData(e.currentTarget); ctx.insert('support_tickets',{subject:fd.get('subject'),priority:fd.get('priority'),status:'Open',description:fd.get('description')}); e.currentTarget.reset();}}>
          <Field label="Subject"><input name="subject" placeholder="e.g. Missing payment receipt" required/></Field>
          <Field label="Priority"><select name="priority"><option>Normal</option><option>High</option><option>Urgent</option></select></Field>
          <Field label="Description"><textarea name="description" placeholder="Describe what needs support..."/></Field>
          <button className="primary">Submit Ticket</button>
        </form>
      </Card>
      <Card title="Support Queue">
        {tickets.length ? <div className="supportTable">
          <div className="supportHeader"><span>Ticket</span><span>Priority</span><span>Status</span></div>
          {tickets.map(t=><div className="supportRow" key={t.id}><div><b>{t.subject}</b><small>{t.description||'No description added'}</small></div><Badge>{t.priority}</Badge><Badge>{t.status}</Badge></div>)}
        </div> : <div className="emptyState compact"><b>No support tickets yet</b><span>Submitted tickets will appear here.</span></div>}
      </Card>
    </div>
  </section>
}
function DynamicModal({modal,setModal,ctx}){ const close=()=>setModal(null); if(modal.type==='new-camps')return <CampForm close={close} ctx={ctx}/>; if(modal.type==='new-tenants')return <TenantForm close={close} ctx={ctx}/>; if(modal.type==='new-finance'||modal.type==='record-payment')return <PaymentForm close={close} ctx={ctx} charge={modal.charge}/>; if(modal.type==='add-charge')return <ChargeForm close={close} ctx={ctx} charge={modal.charge}/>; if(modal.type==='new-reports'||modal.type==='log-expense'||modal.type==='upload-invoice')return <ExpenseForm close={close} ctx={ctx}/>; if(modal.type==='edit-tenant')return <TenantForm close={close} ctx={ctx} item={modal.item}/>; if(modal.type==='edit-camp')return <CampForm close={close} ctx={ctx} item={modal.item}/>; if(modal.type==='edit-expense')return <ExpenseForm close={close} ctx={ctx} item={modal.item}/>; if(modal.type==='view-tenant')return <Modal title="Tenant Profile" onClose={close} wide><Profile item={modal.item} ctx={ctx}/></Modal>; if(modal.type==='building-filter')return <Modal title="Filter By Building" onClose={close}><div className="optionList">{['All',...new Set(ctx.data.charges.map(c=>c.camp_name).filter(Boolean))].map(b=><button key={b} onClick={()=>{ctx.setFilters({...ctx.filters,building:b}); close();}}>{b}</button>)}</div></Modal>; if(modal.type==='finance-analysis')return <Modal title="Deep Finance Analysis" onClose={close} wide><div className="profile"><div className="kpis three"><Kpi label="Records" value={modal.rows.length}/><Kpi label="Outstanding" value={money(modal.rows.reduce((a,r)=>a+Number(r.balance||0),0))} bad/><Kpi label="Collected" value={money(modal.rows.reduce((a,r)=>a+Number(r.amount_paid||0),0))}/></div><p style={{padding:'0 4px 6px',margin:0,color:'#5d6676'}}>Live finance analysis generated from the current filtered records.</p></div></Modal>; if(modal.type==='archive')return <Modal title="Reports Archive" onClose={close}><div className="emptyState"><b>No archived reports yet</b><span>Downloaded reports will be generated from live records.</span></div></Modal>; if(modal.type==='new-support')return <Modal title="New Support Ticket" onClose={close}><form className="formGrid" onSubmit={e=>{e.preventDefault(); const fd=new FormData(e.currentTarget); ctx.insert('support_tickets',{subject:fd.get('subject'),priority:fd.get('priority'),status:'Open',description:fd.get('description')});}}><Field label="Subject"><input name="subject" required/></Field><Field label="Priority"><select name="priority"><option>Normal</option><option>High</option><option>Urgent</option></select></Field><Field label="Description"><textarea name="description"/></Field><button className="primary">Submit Ticket</button></form></Modal>; return null }
function CampForm({ctx, close, item}){ return <Modal title={item?'Edit Camp':'Add Camp'} onClose={close} wide><form className="formGrid" onSubmit={e=>{e.preventDefault(); const fd=new FormData(e.currentTarget); const payload=Object.fromEntries(fd); payload.capacity=Number(payload.capacity||0); payload.maintenance_count=Number(payload.maintenance_count||0); item?ctx.update('camps',item.id,payload):ctx.insert('camps',payload);}}><Field label="Camp Name"><input name="name" defaultValue={item?.name} required/></Field><Field label="Location"><input name="location" defaultValue={item?.location} required/></Field><Field label="Rooms"><input name="rooms" type="number" defaultValue={item?.rooms||0}/></Field><Field label="Capacity"><input name="capacity" type="number" defaultValue={item?.capacity||0}/></Field><Field label="Status"><select name="status" defaultValue={item?.status||'Operational'}><option>Operational</option><option>At Capacity</option><option>Maintenance</option></select></Field><Field label="Maintenance Count"><input name="maintenance_count" type="number" defaultValue={item?.maintenance_count||0}/></Field><button className="primary"><Save size={16}/> Save Camp</button></form></Modal> }
function TenantForm({ctx, close, item}){ return <Modal title={item?'Edit Tenant':'Add Tenant'} onClose={close} wide><form className="formGrid" onSubmit={e=>{e.preventDefault(); const fd=new FormData(e.currentTarget); const payload=Object.fromEntries(fd); payload.docs_complete=fd.get('docs_complete')==='on'; item?ctx.update('tenants',item.id,payload):ctx.insert('tenants',payload);}}><Field label="Tenant Name"><input name="name" defaultValue={item?.name} required/></Field><Field label="Company"><input name="company" defaultValue={item?.company}/></Field><Field label="Room"><input name="room" defaultValue={item?.room}/></Field><Field label="Camp"><input name="camp_name" defaultValue={item?.camp_name}/></Field><Field label="Emirates ID"><input name="emirates_id" defaultValue={item?.emirates_id}/></Field><Field label="Check-in Date"><input type="date" name="check_in_date" defaultValue={item?.check_in_date||today()}/></Field><Field label="Lease End"><input type="date" name="lease_end_date" defaultValue={item?.lease_end_date}/></Field><Field label="Status"><select name="status" defaultValue={item?.status||'Active'}><option>Active</option><option>Expiring</option><option>Checked-out</option></select></Field><label className="check"><input type="checkbox" name="docs_complete" defaultChecked={item?.docs_complete}/> Docs complete</label><button className="primary"><Save size={16}/> Save Tenant</button></form></Modal> }
function ChargeForm({ctx, close, charge}){
  const [tenantName,setTenantName]=useState(charge?.tenant_name||'');
  const tenant=ctx.data.tenants.find(t=>t.name===tenantName) || {};
  return <Modal title={charge?'Edit Charge / Due':'Add Charge / Due'} onClose={close} wide>
    <form className="formGrid" onSubmit={e=>{e.preventDefault(); const fd=new FormData(e.currentTarget); const amount=Number(fd.get('amount_due')||0); const payload={ tenant_name:fd.get('tenant_name'), company:fd.get('company'), room:fd.get('room'), camp_name:fd.get('camp_name'), charge_type:fd.get('charge_type'), period:fd.get('period'), amount_due:amount, amount_paid:Number(charge?.amount_paid||0), status:charge?.status||'Unpaid', receipt_no:charge?.receipt_no||'' }; charge?ctx.update('charges',charge.id,payload):ctx.insert('charges',payload); }}>
      <Field label="Tenant"><select name="tenant_name" value={tenantName} onChange={e=>setTenantName(e.target.value)} required><option value="">Select tenant</option>{ctx.data.tenants.map(t=><option key={t.id} value={t.name}>{t.name} — {t.room||'No room'} — {t.camp_name||'No camp'}</option>)}</select></Field>
      <Field label="Charge Type"><select name="charge_type" defaultValue={charge?.charge_type||'Rent'}><option>Rent</option><option>WiFi</option><option>Other</option></select></Field>
      <Field label="Company"><input name="company" value={tenant.company||charge?.company||''} readOnly/></Field>
      <Field label="Room"><input name="room" value={tenant.room||charge?.room||''} readOnly/></Field>
      <Field label="Camp"><input name="camp_name" value={tenant.camp_name||charge?.camp_name||''} readOnly/></Field>
      <Field label="Period"><input name="period" defaultValue={charge?.period||new Date().toLocaleString('en-US',{month:'long',year:'numeric'})}/></Field>
      <Field label="Amount Due"><input name="amount_due" type="number" step="0.01" defaultValue={charge?.amount_due||''} placeholder="e.g. 1200" required/></Field>
      <button className="primary"><Save size={16}/> Save Charge</button>
    </form>
  </Modal>
}
function PaymentForm({ctx, close, charge}){
  const [chargeId,setChargeId]=useState(charge?.id||'');
  const selectedCharge=ctx.data.charges.find(c=>String(c.id)===String(chargeId));
  const [tenantName,setTenantName]=useState(charge?.tenant_name||'');
  const currentTenantName=selectedCharge?.tenant_name || tenantName;
  const tenant=ctx.data.tenants.find(t=>t.name===currentTenantName) || {};
  return <Modal title="Record Payment" onClose={close} wide>
    <form className="formGrid" onSubmit={async e=>{e.preventDefault(); const fd=new FormData(e.currentTarget); const amount=Number(fd.get('amount')); const linkedChargeId=fd.get('charge_id'); const name=selectedCharge?.tenant_name || fd.get('tenant_name'); if(!name) return ctx.showToast('Select a tenant first'); if(!amount || amount<=0) return ctx.showToast('Enter payment amount'); await ctx.insert('payments',{ charge_id:linkedChargeId||null, tenant_name:name, amount, payment_date:fd.get('payment_date'), method:fd.get('method'), receipt_no:fd.get('receipt_no'), notes:fd.get('notes') }); if(linkedChargeId){ const ch=ctx.data.charges.find(c=>String(c.id)===String(linkedChargeId)); if(ch){ const paid=Number(ch.amount_paid||0)+amount; await ctx.update('charges', ch.id, { amount_paid: paid, status: paid>=Number(ch.amount_due||0)?'Fully Paid':'Partial', receipt_no: fd.get('receipt_no') }); }}}}>
      <Field label="Tenant"><select name="tenant_name" value={currentTenantName} onChange={e=>setTenantName(e.target.value)} disabled={!!selectedCharge} required={!selectedCharge}><option value="">Select tenant</option>{ctx.data.tenants.map(t=><option key={t.id} value={t.name}>{t.name} — {t.room||'No room'} — {t.camp_name||'No camp'}</option>)}</select></Field>
      <Field label="Link to Charge / Due"><select name="charge_id" value={chargeId} onChange={e=>setChargeId(e.target.value)}><option value="">No linked charge / direct payment</option>{ctx.data.charges.filter(c=>Number(c.balance||0)>0).map(c=><option key={c.id} value={c.id}>{c.tenant_name} — {c.charge_type} — Balance {money(c.balance)}</option>)}</select></Field>
      <Field label="Charge Type"><select name="charge_type" value={selectedCharge?.charge_type||'Rent'} disabled={!!selectedCharge}><option>Rent</option><option>WiFi</option><option>Other</option></select></Field>
      <Field label="Payment Date"><input name="payment_date" type="date" defaultValue={today()}/></Field>
      <Field label="Payment Method"><select name="method"><option>Cash</option><option>Bank Transfer</option><option>Cheque</option><option>Card</option></select></Field>
      <Field label="Amount Paid"><input name="amount" type="number" step="0.01" defaultValue={selectedCharge?.balance||''} placeholder="e.g. 1200" required/></Field>
      <Field label="Receipt No."><input name="receipt_no" defaultValue={`LC-${Date.now().toString().slice(-6)}`}/></Field>
      <Field label="Tenant Info"><input value={[tenant.company,tenant.room,tenant.camp_name].filter(Boolean).join(' · ') || 'Select tenant to populate'} readOnly/></Field>
      <Field label="Notes / Other Charges"><textarea name="notes" placeholder="Optional rent adjustment, other charge, reference..."/></Field>
      <button className="primary">Save Payment</button>
    </form>
  </Modal>
}
function ExpenseForm({ctx, close, item}){ const [file,setFile]=useState(null); return <Modal title={item?'Edit Expense':'Log Expense'} onClose={close} wide><form className="formGrid" onSubmit={async e=>{e.preventDefault(); const fd=new FormData(e.currentTarget); let invoice_path=item?.invoice_path||''; if(file){ const path=`${Date.now()}_${file.name}`; const {error}=await supabase.storage.from('invoices').upload(path,file,{upsert:true}); if(error) return ctx.showToast(error.message); invoice_path=path; } const payload={category:fd.get('category'),vendor:fd.get('vendor'),amount:Number(fd.get('amount')),expense_date:fd.get('expense_date'),status:fd.get('status'),invoice_no:fd.get('invoice_no'),invoice_path}; item?ctx.update('expenses',item.id,payload):ctx.insert('expenses',payload);}}><Field label="Category"><select name="category" defaultValue={item?.category||'DEWA'}><option>DEWA</option><option>Gas</option><option>Salaries</option><option>Maintenance</option><option>Landlord Rent</option><option>Other</option></select></Field><Field label="Vendor / Recipient"><input name="vendor" defaultValue={item?.vendor} required/></Field><Field label="Amount"><input name="amount" type="number" step="0.01" defaultValue={item?.amount||''} required/></Field><Field label="Date"><input name="expense_date" type="date" defaultValue={item?.expense_date||today()}/></Field><Field label="Status"><select name="status" defaultValue={item?.status||'Paid'}><option>Paid</option><option>Processed</option><option>Pending</option><option>Overdue</option></select></Field><Field label="Invoice No."><input name="invoice_no" defaultValue={item?.invoice_no}/></Field><Field label="Upload Invoice"><input type="file" onChange={e=>setFile(e.target.files[0])}/></Field><button className="primary">Save Expense</button></form></Modal> }
function Kpi({label,value,trend,bad,bar,trendTone,trendIcon,helper,helperTone,helperIcon}){
  const trendClass = trendTone || (bad ? 'danger' : 'good');
  const helperClass = helperTone || 'muted';
  const trendGlyph = trendIcon==='up' ? <TrendingUp size={16}/> : trendIcon==='down' ? <TrendingDown size={16}/> : trendIcon==='info' ? <Info size={15}/> : null;
  const helperGlyph = helperIcon==='info' ? <Info size={15}/> : helperIcon==='check' ? <CheckCircle2 size={15}/> : null;
  return <div className="kpi"><small>{label}</small><h2 className={bad?'danger':''}>{value}</h2>{trend&&<p className={`trendRow ${trendClass}`}>{trendGlyph}{trend}</p>}{helper&&<p className={`helperRow ${helperClass}`}>{helperGlyph}{helper}</p>}{bar!==undefined&&<div className="bar"><i style={{width:`${Math.min(100,bar)}%`}}/></div>}</div>
}
function Title({title,sub}){return <div className="pageTitle"><h1>{title}</h1><p>{sub}</p></div>}
function Card({title,action,children}){return <div className="card">{(title||action)&&<div className="cardHead"><div>{title&&<h3>{title}</h3>}</div><div className="actions">{action}</div></div>}{children}</div>}
function Select({label,value,options,onChange}){return <label className="miniSelect">{label&&<span>{label}</span>}<select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label>}
function CampTable({camps,ctx,actions}){return <table><thead><tr><th>Camp Detail</th><th>Location</th><th>Inventory</th><th>Occupancy</th><th>Status</th>{actions&&<th>Actions</th>}</tr></thead><tbody>{camps.map(c=><tr key={c.id}><td><b>{c.name}</b><br/><small>{c.cluster||'Residential Cluster'}</small></td><td>{c.location}</td><td><b>{c.rooms||0} Rooms</b><br/><small>{c.capacity||0} Max Capacity</small></td><td><div className="thinbar"><i style={{width:`${Math.min(100,Number(c.occupancy_rate||0))}%`}}/></div>{c.occupancy_rate||0}%</td><td><Badge>{c.status}</Badge></td>{actions&&<td className="rowActions"><button onClick={()=>ctx.setModal({type:'edit-camp',item:c})}><Edit3 size={16}/></button><button onClick={()=>ctx.remove('camps',c.id)}><Trash2 size={16}/></button></td>}</tr>)}</tbody></table>}
function TenantTable({rows,ctx}){return <table><thead><tr><th>Tenant Name</th><th>Company</th><th>Room / Camp</th><th>Emirates ID</th><th>Check-in Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map(t=><tr key={t.id}><td><b>{t.name}</b><br/><small>ID: {t.tenant_code||'—'}</small></td><td>{t.company}</td><td>{t.room}<br/><small>{t.camp_name}</small></td><td>{t.emirates_id}</td><td>{t.check_in_date}</td><td><Badge>{t.status}</Badge></td><td className="rowActions"><button onClick={()=>ctx.setModal({type:'view-tenant',item:t})}><Eye size={16}/></button><button onClick={()=>ctx.setModal({type:'edit-tenant',item:t})}><Edit3 size={16}/></button><button onClick={()=>ctx.update('tenants',t.id,{docs_complete:true})}><FileUp size={16}/></button><button onClick={()=>ctx.remove('tenants',t.id)}><MoreVertical size={16}/></button></td></tr>)}</tbody></table>}
function FinanceTable({rows,ctx}){
  if(!rows.length) return <div className="emptyState compact"><b>No dues found for this tab</b><span>Add a rent/WiFi charge first. Payments alone will show in collections, but the roster is built from tenant dues.</span><button className="primary" onClick={()=>ctx.setModal({type:'add-charge'})}><Plus size={16}/> Add Charge / Due</button></div>;
  return <table><thead><tr><th>Tenant Details</th><th>Room</th><th>Charge</th><th>Amount Due</th><th>Amount Paid</th><th>Balance</th><th>Status</th><th>Receipt No.</th><th>Actions</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td><b>{r.tenant_name}</b><br/><small>{r.company}</small></td><td>{r.room}</td><td>{r.charge_type}<br/><small>{r.period||'Current period'}</small></td><td>{money(r.amount_due)}</td><td className="good">{money(r.amount_paid)}</td><td className={Number(r.balance)>0?'danger':''}>{money(r.balance)}</td><td><Badge>{r.status}</Badge></td><td>{r.receipt_no||'Pending'}</td><td className="rowActions">{Number(r.balance)>0&&<button className="primary small" onClick={()=>ctx.setModal({type:'record-payment',charge:r})}>Record Payment</button>}<button onClick={()=>ctx.setModal({type:'add-charge',charge:r})}><Edit3 size={16}/></button><button onClick={()=>window.print()}><Printer size={16}/></button></td></tr>)}</tbody></table>
}
function ExpenseTable({rows,ctx}){return <table><thead><tr><th>Date</th><th>Category</th><th>Vendor / Recipient</th><th>Amount</th><th>Status</th><th>Invoice</th><th>Actions</th></tr></thead><tbody>{rows.map(e=><tr key={e.id}><td>{e.expense_date}</td><td><Badge>{e.category}</Badge></td><td>{e.vendor}</td><td>{money(e.amount)}</td><td>{e.status}</td><td>{e.invoice_no||e.invoice_path||'No File'}</td><td className="rowActions"><button onClick={()=>ctx.setModal({type:'edit-expense',item:e})}><Edit3 size={16}/></button><button onClick={()=>ctx.remove('expenses',e.id)}><Trash2 size={16}/></button></td></tr>)}</tbody></table>}
function OccupancyAnalytics({occupied=0,vacant=0,maintenance=0,total=0}){
  const safeTotal = total || occupied + vacant + maintenance;
  if(!safeTotal || occupied === 0) {
    return <div className="occupancyPanel empty">
      <div className="occupancyEmptyIcon">0%</div>
      <div className="occupancyEmptyCopy">
        <b>No occupied rooms yet</b>
        <span>Add tenant check-ins to activate the occupancy chart.</span>
      </div>
      <div className="occupancyStats">
        <div><span className="dot blue"></span><em>Occupied</em><b>{occupied.toLocaleString()}</b></div>
        <div><span className="dot grey"></span><em>Vacant</em><b>{vacant.toLocaleString()}</b></div>
        <div><span className="dot red"></span><em>Maintenance</em><b>{maintenance.toLocaleString()}</b></div>
      </div>
    </div>
  }
  return <div className="occupancyPanel">
    <Donut occupied={occupied} vacant={vacant} maintenance={maintenance} total={safeTotal}/>
    <div className="occupancyStats">
      <div><span className="dot blue"></span><em>Occupied</em><b>{occupied.toLocaleString()}</b></div>
      <div><span className="dot grey"></span><em>Vacant</em><b>{vacant.toLocaleString()}</b></div>
      <div><span className="dot red"></span><em>Maintenance</em><b>{maintenance.toLocaleString()}</b></div>
    </div>
  </div>
}
function Donut({occupied=0,vacant=0,maintenance=0,total=0}){
  const safeTotal = total || occupied + vacant + maintenance;
  const occPct = safeTotal?Math.round((occupied/safeTotal)*100):0;
  const occDeg = safeTotal ? (occupied / safeTotal) * 360 : 0;
  const vacDeg = safeTotal ? (vacant / safeTotal) * 360 : 0;
  const gradient = safeTotal ? `conic-gradient(var(--blue) 0deg ${occDeg}deg, #d9e1ef ${occDeg}deg ${occDeg + vacDeg}deg, var(--red) ${occDeg + vacDeg}deg 360deg)` : '#eef2f8';
  return <div className="donut" style={{background:gradient}}><div><b>{occPct}%</b><span>Occupied</span></div></div>
}
function Legend({items}){return <div className="legend">{items.map(([a,b],i)=><p key={a} className={`legend-${i}`}><span></span><em>{a}</em><b>{Number(b||0).toLocaleString()}</b></p>)}</div>}
function Bars({payments=[],expenses=[],period='Monthly'}){
  const activeYear = new Date().getFullYear();
  const group = [];
  if(period==='Quarterly'){
    for(let q=1;q<=4;q++){
      const months = [(q-1)*3, (q-1)*3+1, (q-1)*3+2];
      group.push({
        label:`Q${q}`,
        collections:payments.filter(p=>months.includes(new Date(p.payment_date||p.created_at).getMonth()) && new Date(p.payment_date||p.created_at).getFullYear()===activeYear).reduce((a,p)=>a+Number(p.amount||0),0),
        expenses:expenses.filter(e=>months.includes(new Date(e.expense_date||e.created_at).getMonth()) && new Date(e.expense_date||e.created_at).getFullYear()===activeYear).reduce((a,e)=>a+Number(e.amount||0),0)
      });
    }
  } else if(period==='Yearly'){
    const years = Array.from(new Set([...payments.map(p=>new Date(p.payment_date||p.created_at).getFullYear()), ...expenses.map(e=>new Date(e.expense_date||e.created_at).getFullYear())])).filter(Boolean).sort();
    const selectedYears = (years.length ? years : [activeYear]).slice(-4);
    selectedYears.forEach(y=>group.push({
      label:String(y),
      collections:payments.filter(p=>new Date(p.payment_date||p.created_at).getFullYear()===y).reduce((a,p)=>a+Number(p.amount||0),0),
      expenses:expenses.filter(e=>new Date(e.expense_date||e.created_at).getFullYear()===y).reduce((a,e)=>a+Number(e.amount||0),0)
    }));
  } else {
    for(let i=0;i<12;i++){
      group.push({
        label:monthShort[i],
        collections:payments.filter(p=>new Date(p.payment_date||p.created_at).getMonth()===i && new Date(p.payment_date||p.created_at).getFullYear()===activeYear).reduce((a,p)=>a+Number(p.amount||0),0),
        expenses:expenses.filter(e=>new Date(e.expense_date||e.created_at).getMonth()===i && new Date(e.expense_date||e.created_at).getFullYear()===activeYear).reduce((a,e)=>a+Number(e.amount||0),0)
      });
    }
  }
  const active = group.filter(d=>d.collections>0 || d.expenses>0);
  if(!active.length) return <div className="emptyState chartEmpty"><b>No collection or expense data yet</b><span>Record payments and log expenses to build this trend.</span></div>;
  const max=Math.max(...active.flatMap(d=>[d.collections,d.expenses]),1);
  return <div className="chartWrap"><div className="chartLegendHead"><span className="chartKey blue">Collections</span><span className="chartKey red">Expenses</span></div><div className="bars">{active.map(d=><div key={d.label}><i title={`Collections ${money(d.collections)}`} style={{height:Math.max(10,(d.collections/max)*140)}}/><em title={`Expenses ${money(d.expenses)}`} style={{height:Math.max(10,(d.expenses/max)*140)}}/><span>{d.label}</span></div>)}</div></div>
}
function ExpenseBreak({rows}){
  if(!rows.length) return <div className="emptyState compact"><b>No expenses logged yet</b><span>Log an expense or upload an invoice to generate this breakdown.</span></div>;
  const palette=['#0b32a0','#2748bf','#41c98c','#9bb8ff','#c42032'];
  const cats=[...new Set(rows.map(e=>e.category))].slice(0,5);
  const total=rows.reduce((a,e)=>a+Number(e.amount||0),0)||1;
  const segments=cats.map((c,i)=>({ name:c, value:rows.filter(e=>e.category===c).reduce((a,e)=>a+Number(e.amount||0),0), color:palette[i%palette.length] }));
  return <div className="expenseBreakWrap">
    <div className="expenseVisual">
      <div className="expenseVisualGrid">{segments.map(s=><i key={s.name} style={{background:s.color, flex:s.value}}></i>)}</div>
      <div className="expenseVisualCenter"><span>Total</span><b>100%</b></div>
    </div>
    <div className="expenseLegend">{segments.map(s=><p key={s.name}><span style={{background:s.color}}></span>{s.name}<b>{Math.round((s.value/total)*100)}%</b></p>)}</div>
  </div>
}
function Profile({item,ctx}){ const charges=ctx.data.charges.filter(c=>c.tenant_name===item.name); return <div className="profile"><h3>{item.name}</h3><p>{item.company} · {item.room} · {item.camp_name}</p><div className="kpis"><Kpi label="Status" value={item.status}/><Kpi label="Docs" value={item.docs_complete?'Complete':'Pending'}/><Kpi label="Balance" value={money(charges.reduce((a,c)=>a+Number(c.balance||0),0))}/></div><button className="primary" onClick={()=>ctx.setModal({type:'record-payment', charge:charges.find(c=>Number(c.balance)>0)})}>Record Payment</button></div>}
function getRowsForExport(page,data,filters,q){ if(page==='camps')return filtered(data.camps,q,['name','location','status']); if(page==='tenants')return filtered(data.tenants,q,['name','company','emirates_id']); if(page==='finance')return filtered(data.charges,q,['tenant_name','company','receipt_no']); if(page==='reports')return filtered(data.expenses,q,['category','vendor','invoice_no']); return [...data.camps,...data.tenants,...data.charges,...data.expenses].slice(0,100); }

createRoot(document.getElementById('root')).render(<App />);
