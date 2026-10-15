const fs=require('fs');
let html=fs.readFileSync('index.html','utf8').replaceAll('10.00 WITA','11.00 WITA');
const icons=`      <symbol id="i-gift" viewBox="0 0 24 24"><path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12"/><path d="M12 9H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z"/></symbol>
      <symbol id="i-expand" viewBox="0 0 24 24"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></symbol>
      <symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6"/></symbol>
`;
if(!html.includes('id="i-gift"'))html=html.replace('    </defs>',icons+'    </defs>');
const gallery=`      <section id="galeri" class="gallery-section section-pad section-anchor" aria-labelledby="gallery-title">
        <div class="section-heading reveal">
          <span class="eyebrow">A LITTLE GLIMPSE OF US</span>
          <h2 id="gallery-title" class="section-title">Kepingan cerita,<br><em>satu selamanya.</em></h2>
          <p class="body-copy">Bersamamu, hal sederhana<br>menjadi begitu berarti.</p>
        </div>
        <div class="photo-grid">
          <figure class="photo-feature reveal">
            <button type="button" class="photo-button" data-gallery-item data-caption="Lili & Parhan · Bersama dalam kehangatan" aria-label="Perbesar foto Lili dan Parhan dengan busana bernuansa krem">
              <img src="assets/moment-01.webp" width="1122" height="1402" loading="lazy" decoding="async" alt="Lili berhijab krem bersandar di bahu Parhan yang mengenakan jas krem, dengan latar taman">
              <span class="photo-expand" aria-hidden="true"><svg class="icon"><use href="#i-expand"/></svg></span>
            </button>
            <figcaption><span>LILI & PARHAN</span><span>01 / 03</span></figcaption>
          </figure>
          <figure class="photo-small reveal">
            <button type="button" class="photo-button" data-gallery-item data-caption="Lili & Parhan · Dalam setiap kebersamaan" aria-label="Perbesar foto Lili dan Parhan dengan busana hitam dan putih">
              <img src="assets/moment-02.webp" width="1374" height="1145" loading="lazy" decoding="async" alt="Lili dan Parhan duduk berdampingan dengan busana hitam dan putih di antara dekorasi bunga">
              <span class="photo-expand" aria-hidden="true"><svg class="icon"><use href="#i-expand"/></svg></span>
            </button>
            <figcaption>02 / 03</figcaption>
          </figure>
          <figure class="photo-small reveal">
            <button type="button" class="photo-button" data-gallery-item data-caption="Lili & Parhan · Sebuah janji, selamanya" aria-label="Perbesar foto Lili dan Parhan tersenyum bersama di taman">
              <img src="assets/moment-03.webp" width="1122" height="1402" loading="lazy" decoding="async" alt="Lili meletakkan tangan di bahu Parhan, keduanya tersenyum dalam busana bernuansa krem">
              <span class="photo-expand" aria-hidden="true"><svg class="icon"><use href="#i-expand"/></svg></span>
            </button>
            <figcaption>03 / 03</figcaption>
          </figure>
        </div>
        <p class="gallery-hint reveal"><svg class="icon" aria-hidden="true"><use href="#i-expand"/></svg>Sentuh foto untuk melihat lebih dekat</p>
      </section>

`;
if(!html.includes('id="galeri"'))html=html.replace('      <section class="promise-section section-pad">',gallery+'      <section class="promise-section section-pad">');
const gift=`      <section id="hadiah" class="gift-section section-pad section-anchor" aria-labelledby="gift-title">
        <div class="section-heading reveal">
          <span class="gift-ornament" aria-hidden="true"><svg class="icon"><use href="#i-gift"/></svg></span>
          <span class="eyebrow">WITH LOVE & GRATITUDE</span>
          <h2 id="gift-title" class="section-title">Tanda <em>kasih</em></h2>
          <p class="body-copy">Kehadiran dan doa restu Anda adalah hadiah terindah bagi kami. Jika ingin berbagi tanda kasih, Anda dapat mengirimkannya melalui rekening berikut.</p>
        </div>
        <article class="gift-card reveal" aria-label="Rekening hadiah pernikahan SeaBank atas nama M. Parhan Pawis">
          <div class="gift-card-top"><span class="bank-name">SeaBank<span class="bank-dot" aria-hidden="true"></span></span><svg class="icon" aria-hidden="true"><use href="#i-sparkle"/></svg></div>
          <div class="gift-account"><span class="account-label">NOMOR REKENING</span><p class="account-number" id="account-number">901891764225</p><span class="account-label">ATAS NAMA</span><p class="account-owner">M. Parhan Pawis</p></div>
          <button type="button" id="copy-account" class="button button-primary" aria-label="Salin nomor rekening SeaBank 901891764225"><svg class="icon" aria-hidden="true"><use href="#i-copy"/></svg>Salin Nomor Rekening</button>
        </article>
        <p class="gift-thanks reveal">Terima kasih untuk setiap doa dan tanda kasih.</p>
      </section>

`;
if(!html.includes('id="hadiah"'))html=html.replace('      <section id="penutup"',gift+'      <section id="penutup"');
const dialog=`    <dialog id="gallery-dialog" class="gallery-dialog" aria-labelledby="gallery-dialog-title">
      <div class="gallery-dialog-header"><span id="gallery-dialog-title">Lili & Parhan</span><button type="button" id="gallery-close" class="gallery-control" aria-label="Tutup foto" autofocus><svg class="icon" aria-hidden="true"><use href="#i-close"/></svg></button></div>
      <img id="gallery-full" alt="">
      <div class="gallery-dialog-footer"><button type="button" id="gallery-prev" class="gallery-control" aria-label="Foto sebelumnya"><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></button><p id="gallery-caption" aria-live="polite"></p><button type="button" id="gallery-next" class="gallery-control" aria-label="Foto berikutnya"><svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></button></div>
    </dialog>

`;
if(!html.includes('id="gallery-dialog"'))html=html.replace('    <canvas id="petals"',dialog+'    <canvas id="petals"');
html=html.replace('<span>Lokasi</span></a></nav>','<span>Lokasi</span></a><a href="#hadiah"><svg class="icon"><use href="#i-gift"/></svg><span>Hadiah</span></a></nav>');
fs.writeFileSync('index.html',html);
let pack=fs.readFileSync('qa/package.cjs','utf8');
pack=pack.replace("['garden.webp','couple.webp'","['moment-01.webp','moment-02.webp','moment-03.webp','garden.webp','couple.webp'");
fs.writeFileSync('qa/package.cjs',pack);
