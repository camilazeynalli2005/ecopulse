# EcoPulse — çıxış meyarları

## Azərbaycan dilli təqdimat frontend-i
- [x] React/TypeScript frontend işlək olsun, mobil/desktop ölçülərə uyğunlaşsın və əsas bölmələrə naviqasiya versin.
- [x] Hero-da Qarabağa fokuslanan, sürükləyərək fırladıla bilən demo 3D Yer kürəsi, “İnteraktiv ekoloji məlumat və səsli tədris platforması” şüarı və “Platformanı Sına (Demo)” düyməsi olsun.
- [x] Problem/həll bölməsi statik vizuallardan və mürəkkəb NASA rəqəmlərindən 3D planetarium, zaman maşını və səsli hekayələrə keçidi qısa izah etsin.

## Qarabağın Eko-Nəbzi: xəritə, zaman maşını və səsli hekayə
- [x] İnteraktiv xəritədə Topxana meşəsi, Kəlbəcər və Laçın üçün seçilə bilən aktiv nöqtələr var; seçim bölgənin izahı və demo göstəricilərini yeniləyir.
- [x] Əvvəl/Sonra sürgüsü 2020-ci ildən əvvəl və sonrakı illəri müqayisə edən demo maketlərini göstərir; hər üç bölgə üçün müqayisə təqdim olunur.
- [x] Səs pleyerində seçilmiş bölgəyə uyğun sintetik demo təbiət səsi və brauzer nitqi ilə nümunə hekayə işə salınıb dayandırıla bilir. Şagird müşahidəsindən brauzer nitqi ilə qısa səsli hekayə önbaxışı qurmaq olur.
- [x] Demo göstəriciləri, maket peyk üslublu görünüşlər və sintetik səslər interfeysdə aydın işarələnib; canlı NASA müşahidəsi və real dublyaj kimi təqdim edilmir.
- [ ] CESIUMJS/GIBS əsaslı canlı/arxiv xəritə qatları və hər bölgə üçün real peyk arxivi şəkilləri qoşulmalıdır; İbrahim Qurbanovun real səsləndirməsi demo audio əvəzinə əlavə edilməlidir. Bu resurslar hazırkı frontend prototipinə daxil deyil.

## Tədris laboratoriyası və fənlərarası modul
- [x] Orta məktəb şagirdi rejimində müşahidə qeydi, ərazi seçimi və səsli hekayə qurma/önbaxış vasitələri var; pilot konteksti 20 şagird kimi göstərilir.
- [x] Universitet tələbəsi rejimində temperatur, yanğın və rütubət üzrə demo statistik təhlil, ölçmə cədvəli, yaşıllıq qrafiki və elmi əsaslandırma sahəsi var; pilot konteksti 15 tələbə kimi göstərilir.
- [x] Şagird və tələbə tapşırıq formaları brauzerdə demo sessiyasında işləyir; demo formaları serverə ötürülmür.
- [x] Müəllim qiymətləndirmə paneli “Elmi müşahidə”, “Məlumatdan istifadə”, “Nəticənin əsaslandırılması”, “Komanda işi” meyarlarını göstərir; hər meyar üzrə 1–5 bal demo qaydada dəyişir və ümumi nəticə yenilənir.
- [x] Biologiya, Coğrafiya, İnformatika (3D) və Musiqi dərslərinin kəsişməsi kliklənən tədris kartlarında göstərilir.

## Eco-Quiz, sertifikat və liderlər lövhəsi
- [x] Eco-Quiz beş sualdan ibarətdir; cavab seçimi, irəliləyiş, izah və nəticə görünür.
- [x] İstifadəçi adını və “Qarabağ Çevrəçisi” və ya “Yaşıl Planet Müdafiəçisi” sertifikatını seçib fərdiləşmiş PNG nüsxəsini endirə bilir.
- [x] Sinif və komanda nəticələrini müqayisə edən nümunə liderlər lövhəsi göstərilir.

## Haqqımızda, elmi əsas və mərhələli yol xəritəsi
- [x] Komanda təqdimatında Günay Sadıqova (Layihə rəhbər), İsfəndiyar Alverdiyev (Layihə pedaqoqu), Prof. Dr. Harun Yalçın (Layihə eksperti), İbrahim Qurbanov (Layihə səs montajçısı), Fidan Sadıqova (Layihənin İT dəstəyi), İkbal Aygün (Layihə pedaqoqu), Günel Mocan (Layihə iştirakçısı), Hakan Adanacıoğlu (Elmi məsləhətçi) və Cəmilə Zeynallı (Layihənin proqramçısı) adları/rolları yer alır.
- [x] GDU biologiya-kimya fakültəsində laboratoriya hazırlığı, Qarabağ sahə müşahidələri və GDU/Ege Universiteti tərəfdaşlığı göstərilir.
- [x] Mərhələ 1 (14–15 noyabr 2026) üçün demo UI üç məkanı, müqayisə sürgüsünü, səsli hekayə pleyerini, 5 suallıq Eco-Quiz-i və sertifikat dizaynını təqdim edir.
- [ ] Mərhələ 1-in tam texniki hədəfləri — CesiumJS-də üç məkan və hər məkan üzrə real peyk arxiv müqayisəsi, eləcə də İbrahim bəyin səsləndirdiyi nümunəvi səsli hekayə — canlı inteqrasiya və təqdim ediləcək media faylları ilə tamamlanmalıdır.
- [ ] Mərhələ 2 (MVP – 1700 AZN) üçün tapşırıqların serverə göndərilməsi və müəllim qiymətləndirməsinin yadda saxlanması/idarə olunması ayrıca backend işi kimi tamamlanmalıdır; hazır UI bu məlumatları yalnız demo sessiyasında saxlayır.
- [ ] Mərhələ 3 (6 ay, 55000 AZN texniki büdcə): NASA GIBS/Earthdata canlı avtomatlaşdırılmış inteqrasiyası, 35 nəfərlik pilot qrup (20 şagird, 15 tələbə) üçün şəxsi kabinetlər və komanda paylaşımı qurulmalıdır. Bu imkanlar hazırkı prototipdə mövcud deyil.

## Gələcək canlı xidmət inteqrasiyası
- [ ] NASA GIBS API ilə peyk qatlarının canlı/arxiv xəritə qatları, NASA Earthdata & Giovanni ilə temperatur/rütubət/yanğın statistikalarının avtomatlaşdırılmış qoşulması ayrıca mərhələdə qurulmalıdır.
- [ ] 35 nəfərlik pilot qrup üçün şəxsi kabinetlər və komanda paylaşımı server, autentifikasiya və davamlı məlumat saxlanması ilə qurulmalıdır.
