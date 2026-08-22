// DEMO RESTO visual/currency overrides. Core ordering flow remains unchanged.
(() => {
  const USD_RATE = 35; // demo conversion from previous B values to USD
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

  // Keep original numeric values for calculations, only change presentation.
  window.renderMenu = function renderMenuUSD() {
    const q = $('search').value.trim().toLowerCase();
    const items = menu.filter(m => q ? m.name.toLowerCase().includes(q) : m.cat === active);
    $('categoryTitle').textContent = q ? 'Hasil Pencarian' : active;
    $('grid').innerHTML = items.map(m => `
      <article class="card">
        <div class="photo"><img src="${photoFor(m)}" alt="${m.name}" loading="lazy" referrerpolicy="no-referrer"></div>
        <div class="body"><h3>${m.name}</h3>${m.note ? `<div class="note">${m.note.replace(/(\d+)B/g,(_,v)=>usd(v))}</div>` : ''}
        <div class="bottom"><span class="price">${m.price ? usd(m.price) : 'Tanya Harga'}</span><button class="add" onclick="addItem(${m.id})">+ TAMBAH</button></div></div>
      </article>`).join('') || '<p>Menu tidak ditemukan.</p>';
  };

  window.renderCart = function renderCartUSD() {
    const l = lines();
    $('count').textContent = l.reduce((s,x)=>s+x.qty,0);
    $('cartItems').innerHTML = l.length ? l.map(x => `
      <div class="cart-item"><img src="${photoFor(x)}" alt="${x.name}" referrerpolicy="no-referrer"><div><b>${x.name}</b><div>${x.price ? usd(x.price) : 'Tanya Harga'}</div></div>
      <div class="qty"><button onclick="qty(${x.id},-1)">−</button><b>${x.qty}</b><button onclick="qty(${x.id},1)">+</button></div></div>`).join('') : 'Belum ada pesanan.';
    const s = subtotal(), p = promoQty();
    $('subtotal').textContent = usd(s);
    $('total').textContent = usd(s);
    $('promoBox').innerHTML = p ? `<div class="promo-ok">PROMO: GRATIS ${p}x menu bonus</div>` : '';
    updatePreview();
  };

  window.message = function messageUSD() {
    const l = lines(), photo = $('photo').files?.[0]?.name || 'Belum dilampirkan';
    return `ORDER DEMO MENU DIGITAL RESTO\n\nTipe : ${$('type').value}\nLokasi : ${$('location').value.trim()||'-'}\nFoto lokasi : ${photo}\nNomor Telepon/WhatsApp/Username Telegram : ${$('contact').value.trim()||'-'}\nPembayaran : ${$('payment').value}\nInfo jumlah jika kembalian : ${$('cashInfo').value.trim()||'-'}\n\nPesanan :\n${l.length?l.map((x,i)=>`${i+1}. ${x.name} x${x.qty} — ${usd(x.price*x.qty)}`).join('\n'):'-'}\n\nSubtotal : ${usd(subtotal())}\nPromo : ${promoQty()?`Gratis ${promoQty()} menu bonus`:'-'}\nTotal : ${usd(subtotal())}\n\nCatatan :\n${$('notes').value.trim()||'-'}`;
  };

  // Telegram must go directly to KH Digital instead of the generic share dialog.
  window.sendTG = function sendTelegramKH() {
    if (!lines().length) return alert('Tambahkan pesanan terlebih dahulu.');
    window.open('https://t.me/kh_digital', '_blank');
  };

  // WhatsApp destination requested by owner.
  window.sendWA = function sendWhatsAppKH() {
    if (!lines().length) return alert('Tambahkan pesanan terlebih dahulu.');
    window.open(`https://wa.me/855964065246?text=${encodeURIComponent(message())}`, '_blank');
  };

  // Remove old restaurant/location branding from any remaining visible text.
  const cleanText = root => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      node.nodeValue = node.nodeValue
        .replace(/BANDHA\s*RESTO/gi, 'DEMO RESTO')
        .replace(/POIPET/gi, '');
    }
  };
  cleanText(document.body);

  // Convert static demo promo/voucher displays from B to USD.
  document.querySelectorAll('.rule, .vc, .voucher p').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/(\d[\d.]*)B/g, (_,v) => {
      const n = Number(String(v).replace(/\./g,''));
      return usd(n);
    });
  });

  // Explicitly reinforce generic demo identity.
  document.title = 'DEMO MENU DIGITAL RESTO • Premium Digital Menu';
  const brand = document.querySelector('.brand');
  if (brand) brand.innerHTML = 'DEMO <span>Menu Digital Resto</span>';

  // Render again using the new visual layer.
  renderMenu();
  renderCart();
})();
