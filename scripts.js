document.addEventListener('DOMContentLoaded', function() {

    const galleryGrid = document.getElementById('galleryGrid');
    const categoryButtons = document.querySelectorAll('.category-buttons button');

    // Link CSV Google Sheet
    const sheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRboqZEBiUEQHouonAd-xBZzI2H56JYmK0L4KapC6hThYXidsl2JIB_A9kTiFJHKlVl5fG43-LMz_Ge/pub?output=csv';

    let galleryData = [];

    // ===== FETCH CSV & RENDER =====
    if(galleryGrid && categoryButtons.length > 0) {

        fetch(sheetCsvUrl)
        .then(res => res.text())
        .then(csvText => {
            const lines = csvText.split('\n').filter(l => l.trim() !== '');
            const headers = lines.shift().split(','); // Kategori,Judul,Deskripsi,URL Foto,Pencipta,TanggalUpload

            galleryData = lines.map(line => {
                const cols = line.split(',');
                return {
                    kategori: cols[0]?.trim() || '',
                    judul: cols[1]?.trim() || '',
                    deskripsi: cols[2]?.trim() || '',
                    url: cols[3]?.trim() || '',
                    pencipta: cols[4]?.trim() || '-',
                    tanggalUpload: cols[5]?.trim() || '-'
                };
            });

            renderGallery('all'); // tampil awal semua
        })
        .catch(err => console.error('Fetch CSV error:', err));

        // ===== RENDER GALLERY =====
        function renderGallery(filter) {
            const f = filter.trim().toLowerCase();
            galleryGrid.innerHTML = '';

            galleryData.forEach(item => {
                const itemCategory = item.kategori.trim().toLowerCase();
                if(f === 'all' || itemCategory === f) {
                    const card = document.createElement('div');
                    card.classList.add('gallery-card');
                    card.innerHTML = `
                        <img src="${item.url}" alt="${item.judul}">
                        <h3>${item.judul}</h3>
                        <p>${item.deskripsi}</p>
                    `;

                    // ===== MODAL FOTO =====
                    const modal = document.getElementById('galleryModal');
                    const modalImg = document.getElementById('modalImage');
                    const modalTitle = document.getElementById('modalTitle');
                    const modalDesc = document.getElementById('modalDesc');
                    const modalCreator = document.getElementById('modalCreator');
                    const modalDate = document.getElementById('modalDate');

                    card.querySelector('img').addEventListener('click', () => {
                        modal.style.display = 'block';
                        modalImg.src = item.url;
                        modalTitle.textContent = item.judul || '-';
                        modalDesc.textContent = item.deskripsi || '-';
                        modalCreator.textContent = item.pencipta || '-';
                        modalDate.textContent = item.tanggalUpload || '-';
                    });

                    galleryGrid.appendChild(card);
                }
            });
        }

        // ===== FILTER KATEGORI =====
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category').trim();
                renderGallery(category);
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // ===== TUTUP MODAL =====
    const modal = document.getElementById('galleryModal');
    const closeBtn = document.querySelector('.close');
    if(closeBtn){
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => { 
            if(e.target === modal) modal.style.display = 'none'; 
        });
    }

    // ===== POPUP WARNING =====
    function showWarning(msg) {
        const popup = document.getElementById("warnPopup");
        if(!popup) return;
        popup.textContent = msg;
        popup.classList.add("show");

        setTimeout(() => {
            popup.classList.remove("show");
        }, 500); // 0.5 detik
    }

    // ===== ANTI INSPECT =====
    document.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        showWarning("Stop trying to get into my mind!");
    });

    document.onkeydown = function(e) {
        // F12
        if(e.keyCode === 123){ showWarning("Stop trying to get into my mind!"); return false; }
        // CTRL+SHIFT+I
        if(e.ctrlKey && e.shiftKey && e.keyCode === 73){ showWarning("Stop trying to get into my mind!"); return false; }
        // CTRL+SHIFT+J
        if(e.ctrlKey && e.shiftKey && e.keyCode === 74){ showWarning("Stop trying to get into my mind!"); return false; }
        // CTRL+U → tampil foto fullscreen random
        if(e.ctrlKey && e.keyCode === 85){ 
            e.preventDefault();
            if(galleryData.length > 0){
                const randomItem = galleryData[Math.floor(Math.random() * galleryData.length)];
                showFullScreenImage('https://i.postimg.cc/8kw0bkYX/image.png');
            }
            return false;
        }
    };

    // ===== FULLSCREEN FOTO UNTUK CTRL+U =====
    function showFullScreenImage(url){
        let fullScreenDiv = document.createElement('div');
        fullScreenDiv.style.position = 'fixed';
        fullScreenDiv.style.top = 0;
        fullScreenDiv.style.left = 0;
        fullScreenDiv.style.width = '100%';
        fullScreenDiv.style.height = '100%';
        fullScreenDiv.style.background = 'rgba(0,0,0,0.95)';
        fullScreenDiv.style.display = 'flex';
        fullScreenDiv.style.alignItems = 'center';
        fullScreenDiv.style.justifyContent = 'center';
        fullScreenDiv.style.zIndex = 9999;

        const img = document.createElement('img');
        img.src = url;
        img.style.maxWidth = '95%';
        img.style.maxHeight = '95%';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 0 30px rgba(255,0,0,0.7)';

        fullScreenDiv.appendChild(img);
        document.body.appendChild(fullScreenDiv);

        // Klik anywhere → tutup
        fullScreenDiv.addEventListener('click', () => {
            document.body.removeChild(fullScreenDiv);
        });
    }

});
