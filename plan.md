# EcoPulse — işlək frontend üçün plan

## Məqsəd və əhatə

Azərbaycan dilində, NASA Space Apps Challenge 2026 (Gəncə) üçün təqdimat səviyyəsində görünən, şagird və tələbələrə yönəlmiş interaktiv EcoPulse prototipi hazırlanır. Bu buraxılış React/TypeScript layihəsində müştəri tərəfində işləyən demo olacaq; hesab sistemi, məlumat bazası, serverə tapşırıq göndərmə, canlı NASA GIBS/Earthdata məlumatı və studiya keyfiyyətli İbrahim bəy səs yazısı təchiz edilməyib. Xəritə göstəriciləri və müqayisə vizualları demo/maket məlumatı kimi açıq işarələnəcək; istifadəçi əsas qarşılıqlı axınları brauzerdə sınaya biləcək. Sonrakı inteqrasiyalar üçün UI sərhədləri aydın saxlanılacaq.

## İcra yanaşması

- Mövcud React 19, TypeScript, Vite və Tailwind starter-i saxla; verilən işlək `pnpm dev:static`, `pnpm check` və `pnpm build:static` axınlarından istifadə et. Bu prototipə login, server və ya verilənlər bazası əlavə etmə.
- Tək, lövbərlərlə naviqasiya olunan ana səhifə yarat. Mövcud `client/src/pages/Home.tsx` bölmələri birləşdirsin; təkrar istifadə olunan UI-ni `client/src/components/ecopulse/` daxilində ayrıca modullara böl; məkan və demo metrikalarını ayrıca statik data modulunda saxla. Səhifə marşrutu `/` olaraq qalır.
- Hero üçün WebGL kitabxanasız, Canvas-da sferik koordinatların 3D proyeksiyası ilə yüngül fırlanan və sürüklənə bilən qlobus qur; Qarabağ markerini göstər. Əsas Eko-Nəbz xəritəsini Topxana, Kəlbəcər və Laçın nöqtələri ilə stilizə edilmiş, responsiv vektor/topoqrafik xəritə kimi hazırla. Bu, CesiumJS-də canlı peyk qatı deyil; real 3D xəritə/NASA GIBS bağlantısı sonrakı mərhələdir.
- Məkan seçimi, əvvəl/sonra sürgüsü, Web Audio API ilə istifadəçinin aktivləşdirdiyi demo təbiət səsləri və brauzer nitqi ilə nümunə hekayə axınını əlaqələndir. Real audio faylı olmadığından səslərin sintetik/demo olduğu interfeysdə bildirilsin.
- Tədris bölməsində “Şagird” və “Universitet tələbəsi” görünüşləri, müşahidə qeyd formu, lokal demo tapşırıq göndərişi, ölçmə/statistika paneli və müəllim qiymətləndirməsində dörd kriteriya olsun. Biologiya, Coğrafiya, İnformatika (3D) və Musiqi üzrə kliklənən dərs kartları əlavə et.
- Beş suallıq interaktiv quiz, nəticəyə əsaslanan sertifikat ekranı, ad və sertifikat növü seçimi, PNG yükləməsi və nümunə liderlər lövhəsi qur. İstifadəçi məlumatlarını serverə göndərmə; yalnız cari demo sessiyasında saxla.
- Komanda, elmi əsas, laboratoriya və sahə işi bölmələri təqdim edilən adlar və kontekstlə tamamla. Mobil/desktop naviqasiya, klaviatura ilə idarə, semantik etiketlər və azaldılmış hərəkət seçiminə hörmət təmin et.

## Layihə strukturu

```text
client/src/
  pages/Home.tsx                 Ana səhifə və bölmələrin kompozisiyası
  components/ecopulse/           Naviqasiya, hero, qlobus, xəritə, sürgü, səs,
                                 laboratoriya, quiz, sertifikat, liderlər, komanda
  data/ecopulse.ts               Məkanlar, demo metrikaları, quiz və komanda məzmunu
  index.css                      EcoPulse dizayn tokenləri, responsive və motion qaydaları
public/logo.svg                    Əsas loqo faylı
plan.md                          Təsdiqlənmiş icra və dizayn planı
TODO.md                          Təsdiqdən sonra yaradılacaq çıxış meyarları
```

## Dizayn istiqaməti

Üç fərqli istiqamət nəzərdən keçirilən üslub namizədləridir (ehtimal dəyərləri hər biri 0.10-dan aşağıdır): **Editorial Atlas / sahə gündəliyi** — 0.07; **Digital Observatory / qaranlıq kosmik panel** — 0.04; **Civic Nature / minimal ekoloji hesabat** — 0.06. Seçim: **Editorial Atlas / sahə gündəliyi**.

- **Dizayn hərəkatı:** Müasir kartoqrafik jurnal və elmi ekspedisiya gündəliyi.
- **Əsas prinsiplər:** Məlumat hekayələndirmə ilə oxunaqlı qalsın; xəritə əsas vizual lövbər olsun; hərəkət sakit və məqsədli olsun; demo ilə elmi fakt aydın fərqlənsin.
- **Rəng fəlsəfəsi:** İsti fil sümüyü kağız fonu araşdırma dəftəri hissi yaradır; şam yaşılı meşəni, mineral mavi suyu, günəşvari kəhrəba isə diqqət/ölçmə nöqtələrini ifadə edir.
- **Düzülüş:** Mərkəzləşdirilmiş kart şəbəkəsindən qaçan, növbələşən geniş vizual və redaksiya sütunları; xəritə bölməsində xəritə ilə yan panel arasında açıq kontrast.
- **İmza elementləri:** Topoqrafik kontur xətləri; koordinat/etiket nişanları; tünd şam-yaşıl böyük tipli başlıqlar.
- **Qarşılıqlı əlaqə:** Pin seçimi bütün ekoloji məlumatları yeniləyir; sürgü və dərs tabları nəticəni dərhal göstərir; CTA-lar müvafiq alətə sürüşdürür.
- **Animasiya:** Qlobus yavaş fırlanır, sürükləmə ilə idarə olunur; xəritə markerləri qısa yumşaq vurğu alır; bölmələr kiçik fade/translate keçidi ilə açılır; `prefers-reduced-motion` zamanı animasiyalar dayanır.
- **Tipoqrafiya:** Başlıqlarda `DM Serif Display`, interfeys və bədən mətnində `Manrope` (yükləmə mümkün olmazsa serif/system sans-serif ehtiyatı); böyük başlıqlar və ölçü vahidləri güclü iyerarxiya yaradır.
- **Brend mahiyyəti:** Qarabağın dəyişən ekosistemini şagird və tələbələr üçün xəritə, məlumat və səs hekayəsində birləşdirən tədris platforması; **araşdırıcı, qayğıkeş, aydın**.
- **Brend səsi:** Dəqiq, dəvətkar, elmi marağı təşviq edən. Nümunə: “Qarabağın nəbzini xəritədə izlə.” / “Müşahidə et. Müqayisə et. Öz hekayəni danış.”
- **Loqo/wordmark:** Sadə konsentrik konturlardan yaranan yarpaq+nəbz nişanı və ayrıca EcoPulse söz nişanı.
- **İmza brend rəngi:** Dərin şam yaşılı.

## Məhdudiyyətlər

Bu frontend canlı NASA görüntüsü, NASA Earthdata analitikası, həqiqi peyk “əvvəl/sonra” təsdiqi, real dublyaj, autentifikasiya, məlumatın davamlı saxlanması və serverə tapşırıq ötürülməsi kimi göstərilməyəcək. Müvafiq yerlərdə “Demo məlumatı” qeydi görünəcək. Bu imkanlar təqdim edilən mərhələli yol xəritəsindəki gələcək işlərdir.