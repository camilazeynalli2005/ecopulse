# EcoPulse — yalnızca 3D Dünya

Bu paket **yalnızca interaktif 3D Dünya bileşenini**, çalıştırmak için gereken minimal React/Vite dosyalarını ve NASA Blue Marble tekstürünü içerir. EcoPulse sitesinin diğer bölümleri pakete dahil değildir.

## Çalıştırma

Node.js ve pnpm yüklüyken klasörde:

```bash
pnpm install
pnpm dev
```

Vite adresini tarayıcıda açın. Küreyi fareyle veya dokunmatik ekranda sürükleyerek döndürebilirsiniz. Qarabağ işareti Dünya üzerindeki noktayı izler; azaltılmış hareket tercihi etkin olduğunda otomatik dönüş durur.

Üretim çıktısını oluşturmak için `pnpm build` kullanın.

## İçerik ve kaynak

- `src/GlobeCanvas.tsx`: Three.js sferası, kamera, ışıklandırma, atmosfer efekti ve döndürme kontrolü.
- `src/globe.css`: Yalnızca Dünya demosunun görünümü.
- `public/assets/earth-blue-marble.jpg`: NASA/GSFC SVS Blue Marble equirectangular Dünya dokusu.
- `public/assets/earth-blue-marble-credits.txt`: Kaynak ve kredi bilgisi.

Doku statik NASA kompozitidir; canlı veya güncel uydu görüntüsü değildir. Kaynak: [NASA/Goddard SVS](https://svs.gsfc.nasa.gov/3615/).
