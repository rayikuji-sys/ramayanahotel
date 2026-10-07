import {type Locale} from './locales.ts';
import {guestTranslationRows} from './guest-translations.ts';
import {mediaCopy} from './media-copy.ts';
// Columns: English | Indonesian | Chinese | Japanese | Korean | Arabic | German | French | Dutch | Spanish | Russian.
// Complete phrases only: never translate fragments inside names, prices, URLs or form values.
const rows=`
Home|Beranda|首页|ホーム|홈|الرئيسية|Startseite|Accueil|Home|Inicio|Главная
Rooms|Kamar|客房|客室|객실|الغرف|Zimmer|Chambres|Kamers|Habitaciones|Номера
Photos & Videos|Foto & Video|照片与视频|写真と動画|사진 및 동영상|الصور والفيديو|Fotos & Videos|Photos et vidéos|Foto’s en video’s|Fotos y vídeos|Фото и видео
Facilities|Fasilitas|设施|施設|시설|المرافق|Ausstattung|Équipements|Faciliteiten|Instalaciones|Удобства
Dining|Kuliner|餐饮|お食事|다이닝|المطاعم|Gastronomie|Restauration|Dineren|Gastronomía|Рестораны
Hotel info|Informasi hotel|酒店信息|ホテル情報|호텔 안내|معلومات الفندق|Hotelinformationen|Infos pratiques|Hotelinformatie|Información del hotel|Об отеле
Explore|Jelajahi|探索周边|周辺観光|주변 여행|استكشف|Entdecken|Découvrir|Ontdekken|Explorar|Окрестности
Events|Acara|会议与活动|イベント|행사|الفعاليات|Veranstaltungen|Événements|Evenementen|Eventos|Мероприятия
Contact|Kontak|联系我们|お問い合わせ|문의|اتصل بنا|Kontakt|Contact|Contact|Contacto|Контакты
Reserve|Reservasi|预订|予約|예약|احجز|Reservieren|Réserver|Reserveren|Reservar|Забронировать
Contact Reservations|Hubungi Reservasi|联系预订部|予約のお問い合わせ|예약 문의|تواصل مع قسم الحجز|Reservierung anfragen|Contacter les réservations|Reservering aanvragen|Contactar con reservas|Связаться с отделом бронирования
Find what you need|Cari informasi|查找所需信息|必要な情報を探す|필요한 정보 찾기|ابحث عما تحتاجه|Informationen finden|Trouver une information|Vind wat u zoekt|Encuentre lo que necesita|Найти информацию
Open navigation|Buka navigasi|打开菜单|メニューを開く|메뉴 열기|افتح القائمة|Menü öffnen|Ouvrir le menu|Menu openen|Abrir menú|Открыть меню
Skip to content|Ke konten utama|跳至正文|本文へ移動|본문으로 이동|انتقل إلى المحتوى|Zum Inhalt|Aller au contenu|Naar inhoud|Ir al contenido|Перейти к содержимому
Language|Bahasa|语言|言語|언어|اللغة|Sprache|Langue|Taal|Idioma|Язык
Choose your language|Pilih bahasa Anda|选择您的语言|言語を選択|언어 선택|اختر لغتك|Sprache wählen|Choisissez votre langue|Kies uw taal|Elija su idioma|Выберите язык
Close|Tutup|关闭|閉じる|닫기|إغلاق|Schließen|Fermer|Sluiten|Cerrar|Закрыть
All|Semua|全部|すべて|전체|الكل|Alle|Tout|Alles|Todo|Все
All rooms|Semua kamar|所有客房|すべての客室|모든 객실|جميع الغرف|Alle Zimmer|Toutes les chambres|Alle kamers|Todas las habitaciones|Все номера
Spaces|Ruang hotel|酒店空间|ホテルの空間|호텔 공간|مساحات الفندق|Hotelbereiche|Espaces|Ruimtes|Espacios|Пространства
Meetings & Events|Meeting & Acara|会议与活动|会議・イベント|회의 및 행사|الاجتماعات والفعاليات|Tagungen & Events|Réunions et événements|Vergaderingen en evenementen|Reuniones y eventos|Встречи и мероприятия
Films|Video|视频|動画|동영상|الفيديو|Filme|Vidéos|Video’s|Vídeos|Видео
Our gallery|Galeri kami|酒店图库|ギャラリー|갤러리|معرض الصور|Unsere Galerie|Notre galerie|Onze galerij|Nuestra galería|Наша галерея
Guest questions|Pertanyaan tamu|常见问题|よくあるご質問|자주 묻는 질문|أسئلة الضيوف|Häufige Fragen|Questions fréquentes|Veelgestelde vragen|Preguntas frecuentes|Вопросы гостей
Privacy|Privasi|隐私|プライバシー|개인정보 보호|الخصوصية|Datenschutz|Confidentialité|Privacy|Privacidad|Конфиденциальность
Staff access|Akses staf|员工入口|スタッフ専用|직원 전용|دخول الموظفين|Mitarbeiterzugang|Accès au personnel|Personeel|Acceso del personal|Вход для сотрудников
Back to top|Kembali ke atas|返回顶部|ページ上部へ|맨 위로|العودة للأعلى|Nach oben|Haut de page|Naar boven|Volver arriba|Наверх
Call|Telepon|致电|電話|전화|اتصل|Anrufen|Appeler|Bellen|Llamar|Позвонить
Call us|Telepon kami|致电我们|お電話ください|전화 문의|اتصل بنا|Rufen Sie uns an|Appelez-nous|Bel ons|Llámenos|Позвоните нам
Directions|Petunjuk arah|路线|アクセス|오시는 길|الاتجاهات|Anfahrt|Itinéraire|Route|Cómo llegar|Как добраться
Visit|Kunjungi|到访|所在地|방문|زيارة|Besuchen|Nous rendre visite|Bezoek|Visítenos|Адрес
Write|Email kami|邮件联系|メール|이메일|راسلنا|Schreiben|Nous écrire|Schrijf ons|Escríbanos|Написать
Stay connected|Tetap terhubung|保持联系|つながる|소식 받기|ابق على تواصل|In Verbindung bleiben|Restons en contact|Blijf verbonden|Manténgase en contacto|Оставайтесь на связи
Find your way to us|Temukan lokasi kami|找到我们|アクセスのご案内|호텔 찾아오기|طريقك إلينا|So finden Sie uns|Nous trouver|Vind ons|Encuéntrenos|Как нас найти
Come as a guest.|Datang sebagai tamu.|以宾客的身份到来。|ゲストとして訪れ、|손님으로 찾아와|تعال ضيفاً.|Als Gast ankommen.|Arrivez en invité.|Kom als gast.|Llegue como huésped.|Приезжайте в гости.
Feel at home.|Merasa seperti di rumah.|感受家的温暖。|わが家のように。|집처럼 편안하게.|واشعر كأنك في بيتك.|Sich zu Hause fühlen.|Sentez-vous chez vous.|Voel u thuis.|Siéntase como en casa.|Чувствуйте себя как дома.
Where you feel homey & happy.|Tempat Anda merasa nyaman dan bahagia.|温馨与快乐相伴的地方。|心地よさと幸せを感じる場所。|편안함과 행복이 함께하는 곳.|حيث تشعر بالراحة والسعادة.|Wo Sie sich wohl und zu Hause fühlen.|Là où vous vous sentez bien, comme chez vous.|Waar u zich thuis en gelukkig voelt.|Donde se siente cómodo y feliz.|Место, где уютно и радостно.
The room collection|Koleksi kamar|客房系列|客室コレクション|객실 컬렉션|مجموعة الغرف|Unsere Zimmer|La collection de chambres|Onze kamers|Nuestra colección de habitaciones|Коллекция номеров
Rest beautifully.|Beristirahat dengan nyaman.|惬意休憩。|心地よい休息を。|아름다운 휴식.|استرح براحة.|Stilvoll entspannen.|Reposez-vous en douceur.|Kom heerlijk tot rust.|Descanse con estilo.|Отдыхайте с комфортом.
Stay your way.|Menginap sesuai gaya Anda.|自在入住。|あなたらしい滞在を。|나만의 방식으로 머물다.|وأقم كما تحب.|Auf Ihre Art wohnen.|Séjournez à votre façon.|Verblijf op uw manier.|Alójese a su manera.|Живите в своём ритме.
Discover your room|Temukan kamar Anda|探索您的客房|客室を探す|객실 둘러보기|اكتشف غرفتك|Ihr Zimmer entdecken|Découvrez votre chambre|Ontdek uw kamer|Descubra su habitación|Найдите свой номер
Your kind of comfort|Kenyamanan pilihan Anda|您的舒适之选|お好みの心地よさ|나에게 맞는 편안함|الراحة التي تناسبك|Komfort nach Ihrem Geschmack|Votre idée du confort|Uw soort comfort|Su idea del confort|Комфорт на ваш вкус
Room size|Luas kamar|客房面积|客室面積|객실 크기|مساحة الغرفة|Zimmergröße|Superficie|Kamergrootte|Superficie|Площадь номера
Your rest|Tempat tidur|床型|ベッドタイプ|침대 구성|نوع السرير|Betten|Literie|Bedden|Camas|Тип кровати
Free Wi-Fi|Wi-Fi gratis|免费无线网络|無料Wi-Fi|무료 Wi-Fi|واي فاي مجاني|Kostenloses WLAN|Wi-Fi gratuit|Gratis wifi|Wifi gratuito|Бесплатный Wi-Fi
Room-only promo|Promo kamar saja|仅客房优惠|素泊まりプラン|룸 온리 프로모션|عرض الغرفة فقط|Angebot ohne Frühstück|Offre sans petit-déjeuner|Aanbieding zonder ontbijt|Oferta de solo alojamiento|Предложение без завтрака
Request a stay|Ajukan reservasi|申请预订|宿泊を問い合わせる|숙박 문의|اطلب إقامة|Aufenthalt anfragen|Demander un séjour|Verblijf aanvragen|Solicitar estancia|Запросить проживание
Explore this room|Jelajahi kamar ini|了解此客房|この客室を見る|객실 자세히 보기|استكشف هذه الغرفة|Zimmer ansehen|Découvrir cette chambre|Bekijk deze kamer|Explore esta habitación|Подробнее о номере
View photograph|Lihat foto|查看照片|写真を見る|사진 보기|عرض الصورة|Foto ansehen|Voir la photo|Foto bekijken|Ver fotografía|Посмотреть фото
Room|Kamar|客房|客室|객실|الغرفة|Zimmer|Chambre|Kamer|Habitación|Номер
Size|Luas|面积|広さ|크기|المساحة|Größe|Superficie|Grootte|Superficie|Площадь
Bed arrangement|Susunan tempat tidur|床铺配置|ベッド配置|침대 배치|ترتيب الأسرّة|Bettenanordnung|Disposition des lits|Bedopstelling|Distribución de camas|Расположение кроватей
King bed|Tempat tidur king|特大床|キングベッド|킹사이즈 침대|سرير كينغ|Kingsize-Bett|Lit king-size|Kingsizebed|Cama king|Кровать king-size
Twin beds|Dua tempat tidur single|双床|ツインベッド|싱글 침대 2개|سريران منفصلان|Zwei Einzelbetten|Deux lits simples|Twee eenpersoonsbedden|Dos camas individuales|Две односпальные кровати
Room only|Kamar saja|仅客房|素泊まり|객실만|الغرفة فقط|Nur Zimmer|Chambre seule|Alleen kamer|Solo alojamiento|Только номер
With breakfast|Dengan sarapan|含早餐|朝食付き|조식 포함|مع الإفطار|Mit Frühstück|Avec petit-déjeuner|Met ontbijt|Con desayuno|С завтраком
Breakfast not included|Tidak termasuk sarapan|不含早餐|朝食は含まれません|조식 불포함|الإفطار غير مشمول|Frühstück nicht enthalten|Petit-déjeuner non compris|Ontbijt niet inbegrepen|Desayuno no incluido|Завтрак не включён
Breakfast for two guests|Sarapan untuk dua tamu|双人早餐|2名様分の朝食|2인 조식|إفطار لشخصين|Frühstück für zwei|Petit-déjeuner pour deux|Ontbijt voor twee|Desayuno para dos|Завтрак для двоих
Choose your stay|Pilih paket menginap|选择住宿方案|宿泊プランを選ぶ|숙박 옵션 선택|اختر إقامتك|Aufenthalt wählen|Choisissez votre séjour|Kies uw verblijf|Elija su estancia|Выберите проживание
Request this room|Ajukan kamar ini|申请此客房|この客室を問い合わせる|이 객실 문의|اطلب هذه الغرفة|Dieses Zimmer anfragen|Demander cette chambre|Deze kamer aanvragen|Solicitar esta habitación|Запросить этот номер
night|malam|晚|泊|박|ليلة|Nacht|nuit|nacht|noche|ночь
Check-in|Check-in|入住|チェックイン|체크인|تسجيل الوصول|Check-in|Arrivée|Inchecken|Entrada|Заезд
Check-out|Check-out|退房|チェックアウト|체크아웃|تسجيل المغادرة|Check-out|Départ|Uitchecken|Salida|Выезд
Make yourself at home.|Buat diri Anda nyaman.|像在家一样自在。|どうぞごゆっくり。|집처럼 편안하게 쉬세요.|أقم كأنك في منزلك.|Fühlen Sie sich wie zu Hause.|Faites comme chez vous.|Voel u helemaal thuis.|Siéntase como en casa.|Чувствуйте себя как дома.
Just ask us|Cukup hubungi kami|随时询问|お気軽にどうぞ|편하게 문의하세요|ما عليك إلا السؤال|Fragen Sie uns|Il suffit de demander|Vraag het ons|Solo tiene que preguntar|Просто спросите нас
Available on request|Tersedia sesuai permintaan|可应要求提供|ご要望に応じて|요청 시 제공|متاح عند الطلب|Auf Anfrage erhältlich|Sur demande|Op aanvraag|Disponible bajo petición|По запросу
In selected rooms|Di kamar tertentu|部分客房提供|一部の客室にて|일부 객실에 제공|في غرف مختارة|In ausgewählten Zimmern|Dans certaines chambres|In geselecteerde kamers|En algunas habitaciones|В отдельных номерах
Air conditioning|AC|空调|エアコン|에어컨|تكييف الهواء|Klimaanlage|Climatisation|Airconditioning|Aire acondicionado|Кондиционер
Work desk|Meja kerja|书桌|デスク|업무용 책상|مكتب للعمل|Schreibtisch|Bureau|Bureau|Escritorio|Письменный стол
Bathroom amenities|Perlengkapan mandi|洗浴用品|バスアメニティ|욕실 어메니티|مستلزمات الحمام|Badartikel|Articles de toilette|Toiletartikelen|Artículos de aseo|Банные принадлежности
Mineral water|Air mineral|矿泉水|ミネラルウォーター|생수|مياه معدنية|Mineralwasser|Eau minérale|Mineraalwater|Agua mineral|Минеральная вода
Coffee / tea facilities|Fasilitas kopi / teh|咖啡与茶设施|コーヒー・紅茶セット|커피 및 차 시설|مرافق القهوة والشاي|Kaffee- und Teezubehör|Nécessaire à thé et café|Koffie- en theefaciliteiten|Café y té|Принадлежности для чая и кофе
Hair dryer|Pengering rambut|吹风机|ヘアドライヤー|헤어드라이어|مجفف شعر|Haartrockner|Sèche-cheveux|Haardroger|Secador de pelo|Фен
Iron|Setrika|熨斗|アイロン|다리미|مكواة|Bügeleisen|Fer à repasser|Strijkijzer|Plancha|Утюг
Telephone|Telepon|电话|電話|전화|هاتف|Telefon|Téléphone|Telefoon|Teléfono|Телефон
Complimentary Wi-Fi|Wi-Fi gratis|免费无线网络|無料Wi-Fi|무료 Wi-Fi|واي فاي مجاني|Kostenloses WLAN|Wi-Fi gratuit|Gratis wifi|Wifi gratuito|Бесплатный Wi-Fi
Gym access|Akses gym|健身房使用|ジム利用|피트니스 이용|دخول النادي الرياضي|Zugang zum Fitnessraum|Accès à la salle de sport|Toegang tot fitnessruimte|Acceso al gimnasio|Посещение спортзала
24-hour reception|Resepsionis 24 jam|24小时前台|24時間フロント|24시간 프런트|استقبال على مدار الساعة|24-Stunden-Rezeption|Réception 24 h/24|24-uursreceptie|Recepción 24 horas|Круглосуточная стойка регистрации
Another way to stay.|Pilihan menginap lainnya.|更多住宿选择。|もうひとつの滞在。|또 다른 숙박 선택.|طريقة أخرى للإقامة.|Weitere Möglichkeiten.|Une autre façon de séjourner.|Een andere manier van verblijven.|Otra forma de alojarse.|Другие варианты проживания.
Look a little closer.|Lihat lebih dekat.|细看每一处。|もう少し近くで。|조금 더 가까이.|ألقِ نظرة أقرب.|Schauen Sie genauer hin.|Regardez de plus près.|Kijk wat dichterbij.|Mire un poco más de cerca.|Присмотритесь поближе.
Feel a little more.|Rasakan lebih dalam.|感受更多美好。|もっと感じて。|조금 더 깊이 느껴보세요.|واشعر بالمزيد.|Erleben Sie mehr.|Ressentez un peu plus.|Beleef net wat meer.|Sienta un poco más.|Почувствуйте чуть больше.
The complete collection|Seluruh koleksi|完整图库|すべての写真|전체 컬렉션|المجموعة كاملة|Die gesamte Sammlung|Toute la collection|De hele collectie|La colección completa|Полная коллекция
Select a frame to explore|Pilih foto untuk menjelajahi|选择照片以探索|写真を選んで見る|사진을 선택해 둘러보세요|اختر صورة للاستكشاف|Bild zum Erkunden auswählen|Choisissez une photo|Kies een foto om te verkennen|Seleccione una imagen|Выберите фотографию
Find your room|Temukan kamar Anda|寻找您的客房|客室を探す|객실 찾기|اعثر على غرفتك|Ihr Zimmer finden|Trouvez votre chambre|Vind uw kamer|Encuentre su habitación|Найдите свой номер
Photographed at Ramayana|Foto di Ramayana|摄于 Ramayana|Ramayanaで撮影|Ramayana에서 촬영|صور من رامايانا|Fotografiert im Ramayana|Photographié au Ramayana|Gefotografeerd in Ramayana|Fotografiado en Ramayana|Снято в Ramayana
Select a photograph to explore the details.|Pilih foto untuk melihat detail.|选择照片查看细节。|写真を選んで詳細をご覧ください。|사진을 선택해 자세히 살펴보세요.|اختر صورة لمشاهدة التفاصيل.|Wählen Sie ein Foto für die Details.|Choisissez une photo pour voir les détails.|Kies een foto om de details te bekijken.|Seleccione una foto para ver los detalles.|Выберите фото, чтобы рассмотреть детали.
Overview|Ringkasan|概览|概要|개요|نظرة عامة|Übersicht|Présentation|Overzicht|Resumen|Обзор
Venues|Ruang acara|场地|会場|행사장|القاعات|Veranstaltungsräume|Espaces événementiels|Locaties|Espacios|Площадки
Packages|Paket|套餐|プラン|패키지|الباقات|Pakete|Forfaits|Arrangementen|Paquetes|Пакеты
Corporate|Perusahaan|商务|法人向け|기업|الشركات|Firmen|Entreprises|Zakelijk|Empresas|Корпоративные
Government|Instansi|政务|官公庁向け|기관|الجهات الحكومية|Behörden|Institutions|Overheid|Instituciones|Государственные
Wedding|Pernikahan|婚礼|ウェディング|웨딩|حفلات الزفاف|Hochzeit|Mariage|Bruiloft|Bodas|Свадьба
Seasonal|Musiman|季节活动|季節のイベント|시즌 행사|الفعاليات الموسمية|Saisonales|Saisonnier|Seizoensaanbod|De temporada|Сезонные
Request proposal|Minta proposal|索取方案|提案を依頼|제안 요청|اطلب عرضاً|Angebot anfragen|Demander une proposition|Voorstel aanvragen|Solicitar propuesta|Запросить предложение
Discuss with our team|Diskusi dengan tim|与团队沟通|スタッフに相談|팀과 상담|تحدث مع فريقنا|Mit unserem Team sprechen|Échanger avec notre équipe|Overleg met ons team|Hable con nuestro equipo|Обсудить с командой
Schedule a visit|Jadwalkan kunjungan|预约参观|見学を予約|방문 예약|حدد موعد زيارة|Besichtigung vereinbaren|Planifier une visite|Bezoek plannen|Programar una visita|Запланировать визит
Explore the venue|Jelajahi ruang|探索场地|会場を見る|행사장 둘러보기|استكشف القاعة|Raum entdecken|Découvrir l’espace|Bekijk de locatie|Explore el espacio|Посмотреть площадку
Package details|Detail paket|套餐详情|プラン詳細|패키지 상세|تفاصيل الباقة|Paketdetails|Détails du forfait|Details arrangement|Detalles del paquete|Описание пакета
Request current rates|Minta harga terbaru|查询最新价格|最新料金を問い合わせる|최신 요금 문의|اطلب الأسعار الحالية|Aktuelle Preise anfragen|Demander les tarifs actuels|Actuele prijzen opvragen|Consultar tarifas actuales|Узнать актуальные цены
Compare|Bandingkan|比较|比較|비교|قارن|Vergleichen|Comparer|Vergelijken|Comparar|Сравнить
Event type|Jenis acara|活动类型|イベントの種類|행사 유형|نوع الفعالية|Veranstaltungsart|Type d’événement|Soort evenement|Tipo de evento|Тип мероприятия
Date|Tanggal|日期|日付|날짜|التاريخ|Datum|Date|Datum|Fecha|Дата
Number of guests|Jumlah peserta|人数|人数|참석 인원|عدد الضيوف|Gästezahl|Nombre d’invités|Aantal gasten|Número de invitados|Количество гостей
Room layout|Susunan ruang|场地布局|会場レイアウト|행사장 배치|ترتيب القاعة|Raumaufteilung|Disposition de la salle|Zaalopstelling|Distribución de la sala|Планировка зала
Duration|Durasi|时长|時間|이용 시간|المدة|Dauer|Durée|Duur|Duración|Продолжительность
Overnight stay?|Menginap?|需要住宿？|宿泊をご希望ですか？|숙박이 필요한가요?|هل تحتاج إلى إقامة؟|Übernachtung?|Hébergement ?|Overnachting?|¿Necesita alojamiento?|Нужно проживание?
Yes|Ya|是|はい|예|نعم|Ja|Oui|Ja|Sí|Да
No|Tidak|否|いいえ|아니요|لا|Nein|Non|Nee|No|Нет
Discuss|Diskusikan|待商议|要相談|상담 필요|للمناقشة|Besprechen|À discuter|Bespreken|Consultar|Обсудить
View options|Lihat pilihan|查看选项|選択肢を見る|옵션 보기|عرض الخيارات|Optionen ansehen|Voir les options|Bekijk opties|Ver opciones|Посмотреть варианты
Theatre|Teater|剧院式|シアター形式|극장식|ترتيب مسرحي|Theaterbestuhlung|Théâtre|Theateropstelling|Teatro|Театр
Classroom|Kelas|课桌式|スクール形式|강의식|ترتيب دراسي|Klassenzimmer|Classe|Schoolopstelling|Escuela|Класс
Round tables|Meja bundar|圆桌式|円卓形式|원형 테이블|طاولات مستديرة|Runde Tische|Tables rondes|Ronde tafels|Mesas redondas|Круглые столы
U-shape|Bentuk U|U形|U字形式|U자형|على شكل U|U-Form|En U|U-vorm|En U|П-образная
Boardroom|Rapat direksi|董事会式|会議形式|이사회식|طاولة اجتماعات|Besprechungstisch|Salle de conseil|Vergadertafel|Junta|Переговорная
Custom|Kustom|自定义|カスタム|사용자 지정|مخصص|Individuell|Personnalisé|Op maat|Personalizado|Индивидуальная
Banquet|Jamuan|宴会|宴会|연회|مأدبة|Bankett|Banquet|Banket|Banquete|Банкет
Lounge|Lounge|休息厅|ラウンジ|라운지|الاستراحة|Lounge|Salon|Lounge|Salón|Лаунж
Birthday|Ulang tahun|生日|誕生日|생일|عيد ميلاد|Geburtstag|Anniversaire|Verjaardag|Cumpleaños|День рождения
Gathering|Pertemuan|聚会|集い|모임|تجمع|Zusammenkunft|Rencontre|Bijeenkomst|Encuentro|Встреча
Meeting|Rapat|会议|会議|회의|اجتماع|Tagung|Réunion|Vergadering|Reunión|Совещание
Dinner|Makan malam|晚餐|ディナー|저녁 식사|عشاء|Abendessen|Dîner|Diner|Cena|Ужин
Download floor plan|Unduh denah|下载平面图|図面をダウンロード|평면도 다운로드|تنزيل مخطط القاعة|Grundriss herunterladen|Télécharger le plan|Plattegrond downloaden|Descargar plano|Скачать план
Plan This Room|Atur ruang ini|规划此空间|この会場をレイアウト|이 공간 배치하기|خطط لهذه القاعة|Diesen Raum planen|Aménager cet espace|Plan deze ruimte|Diseñar esta sala|Спланировать зал
Try Room Layout|Coba susunan ruang|尝试场地布局|レイアウトを試す|배치해 보기|جرّب ترتيب القاعة|Raumplanung ausprobieren|Essayer le plan de salle|Probeer een zaalopstelling|Probar distribución|Попробовать планировку
Arrival|Kedatangan|抵达|到着|도착|الوصول|Anreise|Arrivée|Aankomst|Llegada|Прибытие
Departure|Keberangkatan|离店|出発|출발|المغادرة|Abreise|Départ|Vertrek|Salida|Отъезд
Guests|Tamu|宾客人数|宿泊人数|투숙 인원|الضيوف|Gäste|Voyageurs|Gasten|Huéspedes|Гости
Your name|Nama Anda|您的姓名|お名前|이름|اسمك|Ihr Name|Votre nom|Uw naam|Su nombre|Ваше имя
Phone / WhatsApp|Telepon / WhatsApp|电话 / WhatsApp|電話 / WhatsApp|전화 / WhatsApp|الهاتف / واتساب|Telefon / WhatsApp|Téléphone / WhatsApp|Telefoon / WhatsApp|Teléfono / WhatsApp|Телефон / WhatsApp
Email|Email|电子邮件|メールアドレス|이메일|البريد الإلكتروني|E-Mail|E-mail|E-mail|Correo electrónico|Электронная почта
Anything we should know?|Ada permintaan khusus?|有其他需求吗？|ご要望はございますか？|알려주실 사항이 있나요?|هل لديك طلبات خاصة؟|Besondere Wünsche?|Des demandes particulières ?|Bijzondere wensen?|¿Alguna petición especial?|Есть особые пожелания?
Privacy information|Informasi privasi|隐私信息|個人情報について|개인정보 안내|معلومات الخصوصية|Datenschutzhinweise|Informations de confidentialité|Privacyinformatie|Información de privacidad|Информация о конфиденциальности
Send request|Kirim permintaan|发送请求|リクエストを送信|요청 보내기|إرسال الطلب|Anfrage senden|Envoyer la demande|Aanvraag versturen|Enviar solicitud|Отправить запрос
Sending…|Mengirim…|正在发送…|送信中…|전송 중…|جارٍ الإرسال…|Wird gesendet…|Envoi en cours…|Verzenden…|Enviando…|Отправка…
Request received|Permintaan diterima|请求已收到|リクエストを受け付けました|요청 접수 완료|تم استلام الطلب|Anfrage erhalten|Demande reçue|Aanvraag ontvangen|Solicitud recibida|Запрос получен
This is a request, not a confirmed reservation or quotation.|Ini merupakan permintaan, bukan konfirmasi reservasi atau penawaran.|这是一项请求，并非已确认的预订或报价。|これはお問い合わせであり、予約や見積もりの確定ではありません。|이는 요청이며 확정된 예약이나 견적이 아닙니다.|هذا طلب وليس حجزاً أو عرض سعر مؤكداً.|Dies ist eine Anfrage, keine bestätigte Buchung oder ein verbindliches Angebot.|Il s’agit d’une demande, et non d’une réservation ou d’un devis confirmé.|Dit is een aanvraag, geen bevestigde boeking of offerte.|Es una solicitud, no una reserva ni un presupuesto confirmado.|Это запрос, а не подтверждённое бронирование или предложение.
Follow up on WhatsApp|Tindak lanjuti lewat WhatsApp|通过 WhatsApp 跟进|WhatsAppで確認|WhatsApp으로 문의|تابع عبر واتساب|Über WhatsApp nachfragen|Suivre sur WhatsApp|Navragen via WhatsApp|Consultar por WhatsApp|Уточнить в WhatsApp
I agree that Ramayana Hotel may use these details to respond to my request.|Saya setuju Ramayana Hotel menggunakan data ini untuk menanggapi permintaan saya.|我同意 Ramayana Hotel 使用这些信息回复我的请求。|Ramayana Hotelがこの情報を問い合わせへの回答に利用することに同意します。|Ramayana Hotel이 요청에 답변하기 위해 이 정보를 사용하는 데 동의합니다.|أوافق على استخدام فندق رامايانا لهذه البيانات للرد على طلبي.|Ich stimme zu, dass das Ramayana Hotel diese Angaben zur Beantwortung meiner Anfrage nutzt.|J’accepte que le Ramayana Hotel utilise ces informations pour répondre à ma demande.|Ik ga ermee akkoord dat Ramayana Hotel deze gegevens gebruikt om mijn aanvraag te beantwoorden.|Acepto que Ramayana Hotel utilice estos datos para responder a mi solicitud.|Я согласен на использование этих данных отелем Ramayana для ответа на мой запрос.
Send your dates and our team will confirm availability and rates.|Kirim tanggal menginap; tim kami akan mengonfirmasi ketersediaan dan harga.|请提供日期，我们的团队将确认空房情况和价格。|日程をお知らせください。空室と料金をご案内します。|일정을 알려주시면 객실 이용 가능 여부와 요금을 안내해 드립니다.|أرسل تواريخ إقامتك ليؤكد فريقنا التوفر والأسعار.|Teilen Sie Ihre Reisedaten mit. Unser Team bestätigt Verfügbarkeit und Preise.|Indiquez vos dates. Notre équipe confirmera les disponibilités et les tarifs.|Geef uw data door. Ons team bevestigt beschikbaarheid en tarieven.|Envíe sus fechas y nuestro equipo confirmará disponibilidad y tarifas.|Укажите даты, и наша команда подтвердит наличие номеров и стоимость.
Share your dates. Our team will confirm the final rate, room configuration, and availability.|Sampaikan tanggal Anda. Tim kami mengonfirmasi harga final, susunan kamar, dan ketersediaan.|请提供日期。我们将确认最终价格、客房配置及空房情况。|日程をお知らせください。料金・客室の構成・空室を確認します。|일정을 알려주세요. 최종 요금, 객실 구성 및 이용 가능 여부를 확인해 드립니다.|شارك تواريخك. سيؤكد فريقنا السعر النهائي وترتيب الغرفة والتوفر.|Teilen Sie Ihre Daten mit. Wir bestätigen Endpreis, Zimmerausstattung und Verfügbarkeit.|Indiquez vos dates. Nous confirmerons le tarif final, la configuration et la disponibilité.|Deel uw data. Wij bevestigen de definitieve prijs, kamerindeling en beschikbaarheid.|Comparta sus fechas. Confirmaremos el precio final, la configuración y la disponibilidad.|Сообщите даты. Мы подтвердим итоговую стоимость, конфигурацию и наличие номера.
Promotional offer · subject to availability|Penawaran promo · tergantung ketersediaan|优惠价格 · 视供应情况而定|特別プラン・空室状況による|프로모션 · 이용 가능 여부에 따라 다름|عرض ترويجي · حسب التوفر|Aktionsangebot · nach Verfügbarkeit|Offre promotionnelle · selon disponibilité|Aanbieding · op basis van beschikbaarheid|Oferta promocional · sujeta a disponibilidad|Акция · при наличии мест
Meetings, celebrations.|Pertemuan, perayaan.|会议与庆典。|会議、そしてお祝い。|회의와 축하의 순간.|اجتماعات واحتفالات.|Tagungen, Feiern.|Réunions, célébrations.|Vergaderen, vieren.|Reuniones, celebraciones.|Встречи, торжества.
Moments that matter.|Momen yang berarti.|珍贵的时刻。|大切なひとときを。|소중한 순간들.|لحظات تستحق الاهتمام.|Momente, die zählen.|Des moments qui comptent.|Momenten die ertoe doen.|Momentos que importan.|Моменты, которые важны.
Good company.|Kebersamaan yang hangat.|美好相聚。|素敵な仲間と。|좋은 사람들과.|صحبة طيبة.|Gute Gesellschaft.|En bonne compagnie.|Goed gezelschap.|Buena compañía.|Приятная компания.
A beautiful occasion.|Acara yang berkesan.|难忘的盛会。|素晴らしい時間を。|아름다운 행사.|ومناسبة جميلة.|Ein schöner Anlass.|Une belle occasion.|Een bijzondere gelegenheid.|Una ocasión especial.|Прекрасный повод.
Thoughtfully hosted|Dilayani sepenuh hati|用心款待|心を込めたおもてなし|세심한 환대|ضيافة بعناية|Aufmerksam betreut|Un accueil attentionné|Met aandacht ontvangen|Atención en cada detalle|Заботливый приём
Subject to hotel confirmation|Perlu konfirmasi hotel|须由酒店确认|ホテルへの確認が必要です|호텔 확인 필요|يخضع لتأكيد الفندق|Bestätigung durch das Hotel erforderlich|Sous réserve de confirmation par l’hôtel|Onder voorbehoud van hotelbevestiging|Sujeto a confirmación del hotel|Требуется подтверждение отеля
What do you need?|Apa yang Anda butuhkan?|您需要什么？|何をお探しですか？|무엇이 필요하신가요?|كيف يمكننا مساعدتك؟|Was benötigen Sie?|De quoi avez-vous besoin ?|Wat zoekt u?|¿Qué necesita?|Что вы ищете?
Search hotel information|Cari informasi hotel|搜索酒店信息|ホテル情報を検索|호텔 정보 검색|ابحث في معلومات الفندق|Hotelinformationen suchen|Rechercher des informations|Hotelinformatie zoeken|Buscar información del hotel|Поиск информации об отеле
No matching information.|Informasi tidak ditemukan.|未找到匹配的信息。|該当する情報はありません。|일치하는 정보가 없습니다.|لم يتم العثور على معلومات مطابقة.|Keine passenden Informationen.|Aucune information correspondante.|Geen overeenkomende informatie.|No se encontraron resultados.|Информация не найдена.
Ask our team|Tanyakan tim kami|咨询我们的团队|スタッフに相談|팀에 문의|اسأل فريقنا|Fragen Sie unser Team|Demandez à notre équipe|Vraag ons team|Pregunte a nuestro equipo|Спросите нашу команду
Your stay starts here|Perjalanan menginap dimulai di sini|您的住宿之旅从这里开始|ここから始まるご滞在|여기서 시작되는 여행|إقامتك تبدأ هنا|Ihr Aufenthalt beginnt hier|Votre séjour commence ici|Uw verblijf begint hier|Su estancia empieza aquí|Ваш отдых начинается здесь
Let’s make you|Mari buat Anda|让您|心から|편안하게|دعنا نجعلك|Wir möchten, dass Sie sich|Pour que vous vous sentiez|Wij laten u|Queremos que se sienta|Мы хотим, чтобы вы
feel at home.|merasa seperti di rumah.|感到宾至如归。|くつろげる場所へ。|머무실 수 있도록.|تشعر كأنك في بيتك.|wie zu Hause fühlen.|comme chez vous.|thuis voelen.|como en casa.|чувствовали себя как дома.
Room categories|Kategori kamar|客房类别|客室タイプ|객실 유형|أنواع الغرف|Zimmerkategorien|Catégories de chambres|Kamertypes|Tipos de habitación|Категории номеров
Your own little world, in the heart of Makassar.|Ruang pribadi Anda di jantung Makassar.|您在望加锡中心的专属小天地。|マカッサルの中心に、あなただけの空間を。|마카사르 중심에서 만나는 나만의 공간.|عالمك الخاص في قلب ماكاسار.|Ihre eigene kleine Welt im Herzen von Makassar.|Votre petit univers au cœur de Makassar.|Uw eigen plekje in het hart van Makassar.|Su pequeño mundo en el corazón de Makassar.|Ваш собственный уголок в сердце Макассара.
Settle in, slow down|Beristirahat, nikmati waktu|安顿下来，放慢脚步|くつろいで、ゆっくりと|편안히 머물며 쉬어가세요|استقر واستمتع بالهدوء|Ankommen und entschleunigen|Installez-vous, ralentissez|Kom aan en ontspan|Instálese y relájese|Устройтесь и замедлитесь
Comfort, with|Kenyamanan, dengan|舒适相伴，|心地よさと、|편안함과 함께|راحة مع|Komfort mit|Du confort, avec|Comfort met|Comodidad, con|Комфорт и
room to be you.|ruang untuk menjadi diri sendiri.|尽享自在空间。|自分らしく過ごす空間。|나만의 공간.|مساحة لتكون على طبيعتك.|Raum für Sie.|de la place pour être vous-même.|ruimte om uzelf te zijn.|espacio para ser usted mismo.|пространство для себя.
Considered in every detail|Setiap detail diperhatikan|每个细节都用心|細部まで心を配って|세심하게 준비한 디테일|عناية بكل التفاصيل|Durchdacht bis ins Detail|Chaque détail compte|Elk detail doordacht|Cada detalle pensado|Продумано до мелочей
Let us match your preferences|Sampaikan pilihan Anda|让我们满足您的偏好|ご希望をお聞かせください|원하시는 사항을 알려주세요|دعنا نلبي تفضيلاتك|Teilen Sie Ihre Wünsche mit|Faites-nous part de vos préférences|Vertel ons uw voorkeuren|Cuéntenos sus preferencias|Расскажите о своих предпочтениях
The little extras|Sentuhan tambahan|贴心服务|ちょっとした心配り|작은 특별함|لمسات إضافية|Die kleinen Extras|Les petits plus|De kleine extra’s|Los pequeños detalles|Приятные дополнения
Every stay.|Setiap masa menginap.|每次入住。|いつもの滞在を。|매번의 숙박.|كل إقامة.|Jeder Aufenthalt.|Chaque séjour.|Elk verblijf.|Cada estancia.|Каждое проживание.
A little more special.|Sedikit lebih istimewa.|更多特别体验。|少し特別に。|조금 더 특별하게.|أكثر تميزاً.|Ein wenig besonderer.|Un peu plus spécial.|Net wat specialer.|Un poco más especial.|Чуть более особенное.
Everything about your stay|Informasi lengkap menginap|住宿实用信息|ご滞在について|투숙 안내 전체 보기|كل ما يخص إقامتك|Alles zu Ihrem Aufenthalt|Tout sur votre séjour|Alles over uw verblijf|Todo sobre su estancia|Всё о вашем проживании
Your next chapter|Cerita Anda berikutnya|您的下一段旅程|次の旅の始まり|다음 여행 이야기|فصلك القادم|Ihr nächstes Kapitel|Votre prochain chapitre|Uw volgende hoofdstuk|Su próximo capítulo|Ваша следующая глава
Breakfast, your way.|Sarapan sesuai pilihan Anda.|随心享用早餐。|お好みの朝食を。|취향에 맞는 조식.|إفطار على طريقتك.|Frühstück nach Ihrem Geschmack.|Le petit-déjeuner à votre façon.|Ontbijt op uw manier.|Desayuno a su manera.|Завтрак на ваш вкус.
Available separately. Ask about your preferred package.|Tersedia terpisah. Tanyakan paket pilihan Anda.|可单独购买。请咨询您喜欢的套餐。|別途ご利用いただけます。プランについてご相談ください。|별도 이용 가능합니다. 원하시는 패키지를 문의해 주세요.|متاح بشكل منفصل. اسأل عن الباقة التي تفضلها.|Separat erhältlich. Fragen Sie nach Ihrem Wunschpaket.|Disponible séparément. Renseignez-vous sur le forfait de votre choix.|Apart verkrijgbaar. Vraag naar uw gewenste arrangement.|Disponible por separado. Consulte su paquete preferido.|Оплачивается отдельно. Уточните интересующий вас пакет.
Learn more|Pelajari selengkapnya|了解更多|詳しく見る|자세히 보기|اعرف المزيد|Mehr erfahren|En savoir plus|Meer informatie|Más información|Подробнее
Next|Berikutnya|下一项|次へ|다음|التالي|Weiter|Suivant|Volgende|Siguiente|Далее
Previous|Sebelumnya|上一项|前へ|이전|السابق|Zurück|Précédent|Vorige|Anterior|Назад
`; 
const codes:Locale[]=['en','id','zh','ja','ko','ar','de','fr','nl','es','ru'];
export const normalizeText=(text:string)=>text.replace(/\s+/g,' ').trim().toLocaleLowerCase('en');
const catalog=new Map<string,string[]>();
const mediaCatalog=new Map(mediaCopy.flatMap(pair=>[[normalizeText(pair[0]),pair],[normalizeText(pair[1]),pair]] as const));
export const translationRows=[...rows.trim().split('\n').map(row=>row.split('|')),...guestTranslationRows];
for(const row of translationRows){catalog.set(normalizeText(row[0]),row);catalog.set(normalizeText(row[1]),row);}
// Existing bilingual event copy maps to complete curated phrases, not word substitutions.
const aliases:Record<string,string>={
 'Diskusi dengan tim':'Discuss with our team','Jadwalkan kunjungan':'Schedule a visit','Jelajahi ruang':'Explore the venue',
 'Minta harga terbaru':'Request current rates','Lihat pilihan':'View options','Unduh denah':'Download floor plan',
 'Angka panduan; susunan final dikonfirmasi hotel.':'Subject to hotel confirmation',
 'Complimentary mineral water':'Mineral water','Coffee / tea making facilities':'Coffee / tea facilities','Internal telephone':'Telephone','Bed configuration':'Bed arrangement',
 'Rooms & Suites':'Rooms','Room categories':'Room categories','room category':'Room categories',
 'Lantai 1':'Floor 1','Lantai 2':'Floor 2','Lantai 3':'Floor 3','Lantai 4':'Floor 4',
};
export function translateText(text:string,locale:Locale):string{
 const core=text.trim();if(!core)return text;
 const key=normalizeText(core),alias=Object.entries(aliases).find(([source])=>normalizeText(source)===key)?.[1];
 const row=catalog.get(normalizeText(alias||core));
 const value=row?.[codes.indexOf(locale)];
 if(value)return text.slice(0,text.indexOf(core))+value+text.slice(text.indexOf(core)+core.length);
 const media=mediaCatalog.get(key);const editorial=locale==='id'?media?.[1]:locale==='en'?media?.[0]:undefined;
 if(editorial)return text.slice(0,text.indexOf(core))+editorial+text.slice(text.indexOf(core)+core.length);
 // Preserve unknown editorial copy and all factual values instead of guessing a translation.
 return text;
}
