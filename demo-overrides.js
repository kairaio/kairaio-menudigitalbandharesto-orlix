// DEMO RESTO visual/currency overrides. Core ordering flow remains unchanged.
(() => {
  const USD_RATE = 35;
  const usd = value => '$' + (Number(value) / USD_RATE).toFixed(2);

  const photos = {
    friedChicken: 'https://images.unsplash.com/photo-1560963859-dfce1f2a1252?auto=format&fit=crop&w=900&q=82',
    spicyDish: 'https://images.unsplash.com/photo-1766567461692-32c352d198d4?auto=format&fit=crop&w=900&q=82',
    chickenRice: 'https://images.unsplash.com/photo-1769558688700-c81621702130?auto=format&fit=crop&w=900&q=82',
    noodles: 'https://images.unsplash.com/photo-1740377015940-825eb1564902?auto=format&fit=crop&w=900&q=82',
    fish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=82',
    rice: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=82',
    soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=82',
    snack: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=82',
    drink: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=82',
    seafood: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=82'
  };

  function photoFor(item) {
    const n = `${item.name} ${item.cat}`.toLowerCase();
    if (/indomie|mie |mietiaw|bihun|ifumie|cha-cha/.test(n)) return photos.noodles;
    if (/udang|cumi|seafood/.test(n)) return photos.seafood;
    if (/nila|lele|gembung|tongkol|ikan/.test(n)) return photos.fish;
    if (/sop|sup|bubur|gulai/.test(n)) return photos.soup;
    if (/teh|thai tea|wedang|minum/.test(n)) return photos.drink;
    if (/tahu|tempe|bakwan|risol|pisang|sosis|bakso|perkedel|cemilan/.test(n)) return photos.snack;
    if (/rendang|balado|tempong|geprek|mercon|sarden|dencis|ampela/.test(n)) return photos.spicyDish;
    if (/ayam/.test(n)) return /krispi|crispy|goreng/.test(n) ? photos.friedChicken : photos.chickenRice;
    if (/nasi|lontong|pecal|ketoprak|urap|uduk/.test(n)) return photos.rice;
    return photos.rice;
  }

  window.renderMenu = function renderMenuUSD() {
    const q = $('search').value.trim().toLowerCase();
    const items = menu.filter(m => q ? m.name.toLowerCase().includes(q) : m.cat === active);
    $('categoryTitle').textContent = q ? 'Hasil Pencarian' : active;
    $('grid').innerHTML = items.map(m => `<article class="card"><div class="photo"><img src="${photoFor(m)}" alt="${m.name}" loading="lazy" referrerpolicy="no-referrer"></div><div class="body"><h3>${m.name}</h3>${m.note ? `<div class="note">${m.note.replace(/(\d+)B/g,(_,v)=>usd(v))}</div>` : ''}<div class="bottom"><span class="price">${m.price ? usd(m.price) : 'Tanya Harga'}</span><button class="add" onclick="addItem(${m.id})">+ TAMBAH</button></div></div></article>`).join('') || '<p>Menu tidak ditemukan.</p>';
  };

  window.renderCart = function renderCartUSD() {
    const l = lines(); $('count').textContent = l.reduce((s,x)=>s+x.qty,0);
    $('cartItems').innerHTML = l.length ? l.map(x => `<div class="cart-item"><img src="${photoFor(x)}" alt="${x.name}" referrerpolicy="no-referrer"><div><b>${x.name}</b><div>${x.price ? usd(x.price) : 'Tanya Harga'}</div></div><div class="qty"><button onclick="qty(${x.id},-1)">−</button><b>${x.qty}</b><button onclick="qty(${x.id},1)">+</button></div></div>`).join('') : 'Belum ada pesanan.';
    const s=subtotal(),p=promoQty(); $('subtotal').textContent=usd(s); $('total').textContent=usd(s); $('promoBox').innerHTML=p?`<div class="promo-ok">PROMO: GRATIS ${p}x menu bonus</div>`:''; updatePreview();
  };

  window.message = function messageUSD() {
    const l=lines(),photo=$('photo').files?.[0]?.name||'Belum dilampirkan';
    return `ORDER DEMO MENU DIGITAL RESTO\n\nTipe : ${$('type').value}\nLokasi : ${$('location').value.trim()||'-'}\nFoto lokasi : ${photo}\nNomor Telepon/WhatsApp/Username Telegram : ${$('contact').value.trim()||'-'}\nPembayaran : ${$('payment').value}\nInfo jumlah jika kembalian : ${$('cashInfo').value.trim()||'-'}\n\nPesanan :\n${l.length?l.map((x,i)=>`${i+1}. ${x.name} x${x.qty} — ${usd(x.price*x.qty)}`).join('\n'):'-'}\n\nSubtotal : ${usd(subtotal())}\nPromo : ${promoQty()?`Gratis ${promoQty()} menu bonus`:'-'}\nTotal : ${usd(subtotal())}\n\nCatatan :\n${$('notes').value.trim()||'-'}`;
  };

  window.sendTG=()=>{if(!lines().length)return alert('Tambahkan pesanan terlebih dahulu.');window.open(`https://t.me/kh_digital?text=${encodeURIComponent(message())}`,'_blank');};
  window.sendWA=()=>{if(!lines().length)return alert('Tambahkan pesanan terlebih dahulu.');window.open(`https://wa.me/855964065246?text=${encodeURIComponent(message())}`,'_blank');};

  const cleanText=root=>{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode()))node.nodeValue=node.nodeValue.replace(/BANDHA\s*RESTO/gi,'DEMO RESTO').replace(/POIPET/gi,'');}; cleanText(document.body);
  document.querySelectorAll('.rule, .vc, .voucher p').forEach(el=>{el.innerHTML=el.innerHTML.replace(/(\d[\d.]*)B/g,(_,v)=>usd(Number(String(v).replace(/\./g,''))));});
  document.title='DEMO MENU DIGITAL RESTO • Premium Digital Menu';
  const brand=document.querySelector('.brand'); if(brand)brand.innerHTML='DEMO <span>Menu Digital Resto</span>';

  // Replace the legacy branded hero asset completely: real restaurant photo + cute chef character.
  const style=document.createElement('style');
  style.textContent=`
    .hero{background:linear-gradient(90deg,rgba(0,0,0,.96) 0%,rgba(0,0,0,.72) 58%,rgba(0,0,0,.25)),url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85') center/cover no-repeat!important;}
    .hero:before{content:'👨‍🍳';position:absolute;left:26px;bottom:22px;width:118px;height:118px;border-radius:50%;display:grid;place-items:center;font-size:72px;background:rgba(255,255,255,.94);border:5px solid #fff;box-shadow:0 14px 38px #0009;z-index:2;}
    .chef-strip{background:linear-gradient(90deg,#050505 0%,rgba(17,17,17,.9) 58%,rgba(0,0,0,.35)),url('https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=82') center/cover no-repeat!important;position:relative;}
    .chef-strip:after{content:'👨‍🍳';position:absolute;right:28px;top:28px;font-size:82px;filter:drop-shadow(0 8px 12px #000);}
    @media(max-width:650px){.hero:before{width:84px;height:84px;font-size:52px;left:18px;bottom:auto;top:126px}.chef-strip:after{font-size:58px;right:14px;top:16px}}
  `;
  document.head.appendChild(style);

  renderMenu(); renderCart();
})();