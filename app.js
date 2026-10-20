// ضع Project URL و publishable/anon key من Supabase بعد إعداد المشروع.
// لا تضع كلمة مرور قاعدة البيانات أو service_role key هنا.
const SUPABASE_URL = "https://oamhaowshxmkdswcfroe.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_9MvB2kiLiGHzr1wezguF6g_sAZO4HiQ";
const WHATSAPP_NUMBER = "9647733551257"; // رقم المتجر بصيغة دولية دون +
const DEFAULT_PRICES = {5:2000,10:4000,35:10000,60:20000,100:35000};
const DEMO_PRODUCTS = [
 {id:"d1",name:"Creed Absolute Aventus",notes:"فاكهية منعشة، أخشاب دافئة، عنبر ومسك",prices:{...DEFAULT_PRICES,35:25000,60:40000,100:65000},tag:"اختيار مميز"},
 {id:"d2",name:"Sauvage",notes:"حمضيات، أخشاب وتوابل منعشة",prices:{...DEFAULT_PRICES,35:20000,60:35000,100:55000},tag:"الأكثر طلباً"},
 {id:"d3",name:"Bleu de Chanel",notes:"أخشاب عطرية، حمضيات ولمسة بخورية",prices:DEFAULT_PRICES,tag:"أنيق"},
 {id:"d4",name:"Versace Eros",notes:"نعناع، حمضيات، فانيلا وأخشاب",prices:DEFAULT_PRICES,tag:"جريء"},
 {id:"d5",name:"عطر زهري أنيق",notes:"زهور ناعمة، مسك أبيض ولمسة عنبر",prices:DEFAULT_PRICES,tag:"زهري"},
 {id:"d6",name:"عطر خشبي دافئ",notes:"أخشاب، توابل وعنبر دافئ",prices:DEFAULT_PRICES,tag:"خشبي"}
];
let products=[...DEMO_PRODUCTS], client=null, loggedIn=false;
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('en-US').format(Number(n)||0)+" د.ع";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function isConfigured(){return window.supabase && /^https:\/\/.+/.test(SUPABASE_URL) && !SUPABASE_URL.includes("PASTE_") && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("PASTE_");}
if(isConfigured()) client=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
function price(p,s){return Number((p.prices||{})[s]??0)}
function waLink(p,s){let msg=`السلام عليكم، أريد طلب ${p.name} حجم ${s} مل بسعر ${money(price(p,s))}. يرجى تأكيد التوفر والشحن.`;return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`}
function card(p){let sizes=[5,10,35,60,100].filter(s=>price(p,s)>0);if(!sizes.length)sizes=[35];let selected=sizes.includes(35)?35:sizes[0];
return `<article class="product-card" data-name="${esc(p.name.toLowerCase())}" data-sizes="${sizes.join(',')}"><div class="product-image">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">`:`<div class="mini-bottle">FP</div>`}</div><div class="product-body"><div class="product-title-row"><h3>${esc(p.name)}</h3><span class="product-tag">${esc(p.tag||"FURY")}</span></div><p>${esc(p.notes||"عطر مركز من FURY PERFUME")}</p><div class="product-bottom"><strong class="price">${money(price(p,selected))}</strong><select class="size-select" aria-label="حجم ${esc(p.name)}">${sizes.map(s=>`<option value="${s}" ${s===selected?'selected':''}>${s} مل</option>`).join('')}</select></div><a class="order-btn" href="${waLink(p,selected)}" target="_blank" rel="noopener">◉ اطلب عبر واتساب</a></div></article>`}
function render(){const grid=$('productGrid');grid.innerHTML=products.map(card).join('');grid.querySelectorAll('.product-card').forEach((c,i)=>{const p=products[i],sel=c.querySelector('.size-select');sel.addEventListener('change',()=>{c.querySelector('.price').textContent=money(price(p,Number(sel.value)));c.querySelector('.order-btn').href=waLink(p,Number(sel.value));});});filterProducts();}
function filterProducts(){let term=$('search').value.trim().toLowerCase(),size=$('sizeFilter').value,count=0;document.querySelectorAll('.product-card').forEach(c=>{let ok=c.dataset.name.includes(term)&&(!size||c.dataset.sizes.split(',').includes(size));c.classList.toggle('hidden',!ok);if(ok)count++;});$('emptyState').classList.toggle('hidden',count>0);}
$('search').addEventListener('input',filterProducts);$('sizeFilter').addEventListener('change',filterProducts);
$('adminOpen').addEventListener('click',()=>{$('adminDialog').showModal();});
$('closeAdmin').addEventListener('click',()=>$('adminDialog').close());
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();let msg=$('loginMessage');msg.textContent='';if(!client){msg.textContent='يلزم إدخال Project URL و publishable/anon key في app.js. راجع SETUP_AR.txt.';return;}let {data,error}=await client.auth.signInWithPassword({email:$('adminEmail').value,password:$('adminPassword').value});if(error){msg.textContent='تعذر تسجيل الدخول: '+error.message;return;}loggedIn=true;$('loginForm').classList.add('hidden');$('setupNotice').classList.add('hidden');$('adminPanel').classList.remove('hidden');await loadProducts();});
async function loadProducts(){let {data,error}=await client.from('products').select('*').order('created_at',{ascending:false});if(error){$('productMessage').textContent='تعذر تحميل المنتجات. راجع إعداد الجدول والسياسات في SETUP_AR.txt. '+error.message;return;}products=(data||[]).map(p=>({id:p.id,name:p.name,notes:p.notes||'',image_url:p.image_url||'',tag:'FURY',prices:{5:p.price_5||0,10:p.price_10||0,35:p.price_35||0,60:p.price_60||0,100:p.price_100||0}}));render();renderAdmin();}
function renderAdmin(){$('adminProducts').innerHTML=products.map(p=>`<div class="admin-product"><div><b>${esc(p.name)}</b><small>${esc(p.notes)}</small></div><div><button class="admin-open" data-edit="${esc(p.id)}">تعديل</button><button class="admin-open" data-delete="${esc(p.id)}">حذف</button></div></div>`).join('');$('adminProducts').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.edit));$('adminProducts').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>removeProduct(b.dataset.delete));}
function edit(id){let p=products.find(p=>String(p.id)===String(id));if(!p)return;$('productId').value=p.id;$('productName').value=p.name;$('productNotes').value=p.notes||'';$('productImage').value=p.image_url||'';[5,10,35,60,100].forEach(s=>$('price'+s).value=price(p,s)||'');$('productMessage').textContent='عدّل البيانات ثم اضغط حفظ المنتج.';}
$('productForm').addEventListener('submit',async e=>{e.preventDefault();if(!client||!loggedIn)return;let msg=$('productMessage');msg.textContent='جارٍ الحفظ...';let row={name:$('productName').value.trim(),notes:$('productNotes').value.trim(),image_url:$('productImage').value.trim()||null,price_5:Number($('price5').value)||null,price_10:Number($('price10').value)||null,price_35:Number($('price35').value)||null,price_60:Number($('price60').value)||null,price_100:Number($('price100').value)||null,updated_at:new Date().toISOString()};let id=$('productId').value;let r=id?await client.from('products').update(row).eq('id',id):await client.from('products').insert(row);if(r.error){msg.textContent='تعذر الحفظ: '+r.error.message;return;}msg.textContent='تم الحفظ.';$('productForm').reset();$('productId').value='';await loadProducts();});
$('cancelEdit').addEventListener('click',()=>{$('productForm').reset();$('productId').value='';$('productMessage').textContent='';});
async function removeProduct(id){if(!confirm('متأكد تريد حذف هذا العطر؟'))return;let {error}=await client.from('products').delete().eq('id',id);if(error){$('productMessage').textContent='تعذر الحذف: '+error.message;return;}await loadProducts();}
$('logoutBtn').addEventListener('click',async()=>{if(client)await client.auth.signOut();loggedIn=false;$('adminPanel').classList.add('hidden');$('loginForm').classList.remove('hidden');});
render();
