// غيّر الرقم إلى رقم واتسابك بمفتاح العراق 964 بدون علامة +
const WHATSAPP_NUMBER = "9640000000000";
// هذه منتجات تجريبية؛ استبدلها بأسماء وأسعار عطورك الحقيقية.
const products = [
{name:"مسك طهارة",size:"10 مل",price:"—",notes:"مسك ناعم"},
{name:"ليلة مسك",size:"35 مل",price:"—",notes:"مسك دافئ"},
{name:"مسك دوف وايت",size:"10 مل",price:"—",notes:"رائحة بودرية"},
{name:"عود مركز",size:"35 مل",price:"—",notes:"أخشاب وعود"},
{name:"عنبر ومسك",size:"60 مل",price:"—",notes:"عنبر دافئ"},
{name:"عطر حمضيات",size:"60 مل",price:"—",notes:"حمضيات منعشة"}
];
const root=document.getElementById("products"),search=document.getElementById("search");
function safe(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function render(){const term=search.value.trim().toLowerCase();root.innerHTML="";products.filter(p=>(p.name+" "+p.notes+" "+p.size).toLowerCase().includes(term)).forEach(p=>{const el=document.createElement("article");el.className="card";el.innerHTML=`<div class="visual">✦</div><div class="details"><h3>${safe(p.name)}</h3><div class="notes">${safe(p.notes)}</div><div>${safe(p.size)}</div><div class="price">${p.price==="—"?"السعر يحدد عند الطلب":safe(p.price+" د.ع")}</div><button class="order">اطلب عبر واتساب</button></div>`;el.querySelector("button").onclick=()=>{if(WHATSAPP_NUMBER==="9640000000000"){alert("ضع رقم واتساب الصحيح في app.js أولاً.");return;}window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(`السلام عليكم، أريد ${p.name} حجم ${p.size}`),"_blank");};root.appendChild(el);});}
search.addEventListener("input",render);render();