import type { Locale } from "./config";

// Human-reviewed result/metric phrases that cannot be translated reliably word-by-word.
const rows = [
["Absolute error","error absoluto","erreur absolue","absoluter Fehler","erro absoluto","абсолютная ошибка","绝对误差","絶対誤差","الخطأ المطلق"],
["Acceleration","aceleración","accélération","Beschleunigung","aceleração","ускорение","加速度","加速度","التسارع"],
["Active capacity","capacidad activa","capacité active","aktive Kapazität","capacidade ativa","активная способность","主动运输能力","能動輸送能力","القدرة على النقل النشط"],
["Alignment","alineación","alignement","Ausrichtung","alinhamento","выравнивание","对齐程度","整列","المحاذاة"],
["Ampere-turns","amperio-vueltas","ampère-tours","Amperewindungen","ampère-espiras","ампер-витки","安匝数","アンペアターン","أمبير-لفة"],
["Aphelion","afelio","aphélie","Aphel","afélio","афелий","远日点","遠日点","الأوج الشمسي"],
["Atoms","átomos","atomes","Atome","átomos","атомы","原子数","原子数","الذرات"],
["Attraction","atracción","attraction","Anziehung","atração","притяжение","吸引力","引力","التجاذب"],
["Beats/min","latidos/min","battements/min","Schläge/min","batimentos/min","уд./мин","次/分钟","拍/分","نبضة/دقيقة"],
["Bed shear stress","esfuerzo cortante del lecho","contrainte de cisaillement du lit","Sohlschubspannung","tensão de cisalhamento do leito","касательное напряжение дна","河床剪切应力","河床せん断応力","إجهاد القص على القاع"],
["Bond character","carácter del enlace","caractère de la liaison","Bindungscharakter","caráter da ligação","характер связи","化学键性质","結合の性質","طبيعة الرابطة"],
["Cardiac output","gasto cardíaco","débit cardiaque","Herzzeitvolumen","débito cardíaco","минутный объём сердца","心输出量","心拍出量","النتاج القلبي"],
["Circulation index","índice de circulación","indice de circulation","Zirkulationsindex","índice de circulação","индекс циркуляции","环流指数","循環指数","مؤشر الدوران"],
["Classification","clasificación","classification","Klassifikation","classificação","классификация","分类","分類","التصنيف"],
["Concave","cóncava","concave","konkav","côncava","вогнутая","凹透镜","凹面","مقعرة"],
["Controls","controles","commandes","Steuergrößen","controles","параметры управления","控制变量","操作項目","عناصر التحكم"],
["Coverage proxy","indicador de cobertura","indicateur de couverture","Näherungswert der Bedeckung","indicador de cobertura","показатель покрытия","覆盖度指标","被覆率の指標","مؤشر التغطية"],
["Cube","cubo","cube","Würfel","cubo","куб","立方体","立方体","مكعب"],
["DNA copied?","¿ADN copiado?","ADN copié ?","DNA kopiert?","DNA copiado?","ДНК скопирована?","DNA 是否复制完成？","DNA は複製済み？","هل تم نسخ DNA؟"],
["Defense strength","intensidad de defensa","intensité de la défense","Abwehrstärke","força de defesa","сила защиты","防御强度","防御力","قوة الدفاع"],
["Demand index","índice de demanda","indice de demande","Bedarfsindex","índice de demanda","индекс потребности","需求指数","需要指数","مؤشر الطلب"],
["Design trend","tendencia de diseño","tendance de conception","Konstruktionstrend","tendência do projeto","тенденция конструкции","设计趋势","設計傾向","اتجاه التصميم"],
["Determinant","determinante","déterminant","Determinante","determinante","определитель","行列式","行列式","المحدد"],
["Direction","dirección","direction","Richtung","direção","направление","方向","方向","الاتجاه"],
["Divergent","divergente","divergente","divergent","divergente","дивергентная","离散型","発散型","متباعد"],
["Dominant driver","factor dominante","facteur dominant","dominierender Einfluss","fator dominante","доминирующий фактор","主导因素","支配要因","العامل المهيمن"],
["Dominant pathway","vía dominante","voie dominante","dominierender Transportweg","via dominante","преобладающий путь","主导途径","主要経路","المسار السائد"],
["Down-slope acceleration","aceleración cuesta abajo","accélération vers le bas de la pente","Hangabwärtsbeschleunigung","aceleração ladeira abaixo","ускорение вниз по склону","沿斜面向下加速度","斜面下向き加速度","التسارع إلى أسفل المنحدر"],
["Element","elemento","élément","Element","elemento","элемент","元素","元素","العنصر"],
["Equation","ecuación","équation","Gleichung","equação","уравнение","方程式","方程式","المعادلة"],
["Equivalence volume","volumen de equivalencia","volume à l’équivalence","Äquivalenzvolumen","volume de equivalência","объём в точке эквивалентности","当量点体积","当量点体積","حجم نقطة التكافؤ"],
["Erosion tendency","tendencia a la erosión","tendance à l’érosion","Erosionsneigung","tendência à erosão","склонность к эрозии","侵蚀趋势","侵食傾向","ميل التعرية"],
["Eruption index","índice de erupción","indice d’éruption","Eruptionsindex","índice de erupção","индекс извержения","喷发指数","噴火指数","مؤشر الثوران"],
["Escape/orbit ratio","relación escape/órbita","rapport échappement/orbite","Verhältnis Flucht/Orbit","relação escape/órbita","отношение скорости убегания к орбитальной","逃逸/轨道速度比","脱出速度/軌道速度比","نسبة سرعة الإفلات إلى السرعة المدارية"],
["Evaporation index","índice de evaporación","indice d’évaporation","Verdunstungsindex","índice de evaporação","индекс испарения","蒸发指数","蒸発指数","مؤشر التبخر"],
["Evidence","evidencia","preuves","Beobachtungsdaten","evidência","наблюдаемые данные","证据","観察データ","الأدلة"],
["Excess","exceso","excès","Überschuss","excesso","избыток","过量","過剰量","الفائض"],
["Excess units","unidades en exceso","unités en excès","Überschusseinheiten","unidades em excesso","избыточные единицы","过量单位","余剰単位","الوحدات الزائدة"],
["Experimental probability","probabilidad experimental","probabilité expérimentale","experimentelle Wahrscheinlichkeit","probabilidade experimental","экспериментальная вероятность","实验概率","実験確率","الاحتمال التجريبي"],
["Field trend","tendencia del campo","tendance du champ","Feldtrend","tendência do campo","изменение поля","场强趋势","磁場の傾向","اتجاه المجال"],
["Formula","fórmula","formule","Formel","fórmula","формула","公式","式","الصيغة"],
["Front strength","intensidad del frente","intensité du front","Frontstärke","intensidade da frente","интенсивность фронта","锋面强度","前線の強さ","قوة الجبهة الهوائية"],
["Geometry","geometría","géométrie","Geometrie","geometria","геометрия","几何形状","幾何形状","الهندسة"],
["Hemisphere season","estación del hemisferio","saison de l’hémisphère","Jahreszeit der Hemisphäre","estação do hemisfério","сезон в полушарии","半球季节","半球の季節","فصل نصف الكرة"],
["Hypotenuse c","hipotenusa c","hypoténuse c","Hypotenuse c","hipotenusa c","гипотенуза c","斜边 c","斜辺 c","الوتر c"],
["Ideal B field","campo B ideal","champ B idéal","ideales B-Feld","campo B ideal","идеальное поле B","理想磁场 B","理想磁場 B","المجال B المثالي"],
["Ideal input force","fuerza de entrada ideal","force d’entrée idéale","ideale Eingangskraft","força de entrada ideal","идеальная входная сила","理想输入力","理想入力力","قوة الإدخال المثالية"],
["Illuminated","fracción iluminada","fraction éclairée","beleuchteter Anteil","fração iluminada","освещённая доля","照明比例","照明率","الجزء المضاء"],
["Image","imagen","image","Bild","imagem","изображение","像的类型","像","الصورة"],
["Image distance","distancia de imagen","distance de l’image","Bildweite","distância da imagem","расстояние до изображения","像距","像距離","بعد الصورة"],
["Intensity index","índice de intensidad","indice d’intensité","Intensitätsindex","índice de intensidade","индекс интенсивности","强度指数","強度指数","مؤشر الشدة"],
["Interference","interferencia","interférence","Interferenz","interferência","интерференция","干涉类型","干渉","التداخل"],
["Jupiter","Júpiter","Jupiter","Jupiter","Júpiter","Юпитер","木星","木星","المشتري"],
["Landing outlook","resultado del aterrizaje","issue de l’atterrissage","Landeprognose","resultado do pouso","прогноз посадки","着陆结果","着陸判定","توقع الهبوط"],
["Left Riemann sum","suma de Riemann izquierda","somme de Riemann à gauche","linke Riemann-Summe","soma de Riemann à esquerda","левая сумма Римана","左端点黎曼和","左リーマン和","مجموع ريمان الأيسر"],
["Likely section","sección probable","section probable","wahrscheinlicher Querschnitt","seção provável","вероятное сечение","可能的截面","予想される断面","المقطع المتوقع"],
["Likely style","estilo probable","style probable","wahrscheinlicher Typ","estilo provável","вероятный тип","可能的类型","予想される型","النمط المتوقع"],
["Limiting factor","factor limitante","facteur limitant","limitierender Faktor","fator limitante","лимитирующий фактор","限制因素","制限要因","العامل المحدد"],
["Limiting reagent","reactivo limitante","réactif limitant","limitierender Reaktant","reagente limitante","лимитирующий реагент","限量反应物","限界反応物","المتفاعل المحدد"],
["Load/member","carga por elemento","charge par élément","Last pro Stab","carga por elemento","нагрузка на элемент","每杆件载荷","部材あたり荷重","الحمل لكل عنصر"],
["Lunar age","edad lunar","âge lunaire","Mondalter","idade lunar","возраст Луны","月龄","月齢","عمر القمر"],
["Magnification","aumento","grandissement","Vergrößerung","ampliação","увеличение","放大率","倍率","التكبير"],
["Mars","Marte","Mars","Mars","Marte","Марс","火星","火星","المريخ"],
["Model scale","escala del modelo","échelle du modèle","Modellmaßstab","escala do modelo","масштаб модели","模型尺度","モデル尺度","مقياس النموذج"],
["Molecular shape","geometría molecular","géométrie moléculaire","Molekülgestalt","geometria molecular","форма молекулы","分子构型","分子形状","الشكل الجزيئي"],
["Neptune","Neptuno","Neptune","Neptun","Netuno","Нептун","海王星","海王星","نبتون"],
["Net accel proxy","indicador de aceleración neta","indicateur d’accélération nette","Näherungswert der Nettobeschleunigung","indicador de aceleração líquida","оценка результирующего ускорения","净加速度指标","正味加速度の指標","مؤشر التسارع الصافي"],
["Net pathogen change","cambio neto de patógenos","variation nette des agents pathogènes","Nettoänderung der Krankheitserreger","mudança líquida de patógenos","чистое изменение патогенов","病原体净变化","病原体の正味変化","التغير الصافي في مسببات المرض"],
["Net tendency","tendencia neta","tendance nette","Nettotendenz","tendência líquida","итоговая тенденция","净变化趋势","正味の傾向","الاتجاه الصافي"],
["Noon sun altitude","altura solar al mediodía","hauteur du Soleil à midi","Sonnenhöhe am Mittag","altura do Sol ao meio-dia","высота Солнца в полдень","正午太阳高度角","正午の太陽高度","ارتفاع الشمس وقت الظهر"],
["Object 1 after","objeto 1 después","objet 1 après","Objekt 1 danach","objeto 1 depois","объект 1 после","碰撞后物体 1","衝突後の物体 1","الجسم 1 بعد التصادم"],
["Object 2 after","objeto 2 después","objet 2 après","Objekt 2 danach","objeto 2 depois","объект 2 после","碰撞后物体 2","衝突後の物体 2","الجسم 2 بعد التصادم"],
["Offset","desplazamiento","décalage","Versatz","deslocamento","смещение","偏移量","オフセット","الإزاحة"],
["Opens","apertura","ouverture","Öffnung","abertura","направление ветвей","开口方向","開く向き","اتجاه الفتحة"],
["Orientation","orientación","orientation","Orientierung","orientação","ориентация","方向性","向き","الاتجاه"],
["Outlook","resultado previsto","résultat prévu","Prognose","resultado previsto","прогноз","预测结果","予測結果","النتيجة المتوقعة"],
["O₂ saturation","saturación de O₂","saturation en O₂","O₂-Sättigung","saturação de O₂","насыщение O₂","O₂ 饱和度","O₂ 飽和度","تشبع O₂"],
["Particle regime","régimen de partículas","régime des particules","Teilchenzustand","regime de partículas","режим частиц","粒子状态","粒子状態","حالة الجسيمات"],
["Passive flux proxy","indicador de flujo pasivo","indicateur de flux passif","Näherungswert des passiven Flusses","indicador de fluxo passivo","оценка пассивного потока","被动通量指标","受動輸送フラックスの指標","مؤشر التدفق السلبي"],
["Perihelion","perihelio","périhélie","Perihel","periélio","перигелий","近日点","近日点","الحضيض الشمسي"],
["Phase","fase","phase","Phase","fase","фаза","相位","位相","الطور"],
["Planet A","planeta A","planète A","Planet A","planeta A","планета A","行星 A","惑星 A","الكوكب A"],
["Planet B","planeta B","planète B","Planet B","planeta B","планета B","行星 B","惑星 B","الكوكب B"],
["Point","punto","point","Punkt","ponto","точка","点","点","النقطة"],
["Polarity","polaridad","polarité","Polarität","polaridade","полярность","极性","極性","القطبية"],
["Precipitation index","índice de precipitación","indice de précipitation","Niederschlagsindex","índice de precipitação","индекс осадков","降水指数","降水指数","مؤشر الهطول"],
["Radians","radianes","radians","Radiant","radianos","радианы","弧度","ラジアン","الراديان"],
["Radius A","radio A","rayon A","Radius A","raio A","радиус A","半径 A","半径 A","نصف القطر A"],
["Radius B","radio B","rayon B","Radius B","raio B","радиус B","半径 B","半径 B","نصف القطر B"],
["Reaction units","unidades de reacción","unités de réaction","Reaktionseinheiten","unidades de reação","единицы реакции","反应单位","反応単位","وحدات التفاعل"],
["Replication time","tiempo de replicación","temps de réplication","Replikationszeit","tempo de replicação","время репликации","复制时间","複製時間","زمن التضاعف"],
["Runoff index","índice de escorrentía","indice de ruissellement","Abflussindex","índice de escoamento","индекс стока","径流指数","流出指数","مؤشر الجريان السطحي"],
["Saturn","Saturno","Saturne","Saturn","Saturno","Сатурн","土星","土星","زحل"],
["Shear effect","efecto de la cizalladura","effet du cisaillement","Scherungseffekt","efeito do cisalhamento","эффект сдвига","风切变影响","シアの影響","تأثير القص"],
["Small-angle model","modelo de ángulo pequeño","modèle des petits angles","Kleinwinkelnäherung","modelo de pequeno ângulo","модель малых углов","小角度模型","小角近似","نموذج الزاوية الصغيرة"],
["Solar declination","declinación solar","déclinaison solaire","Sonnendeklination","declinação solar","солнечное склонение","太阳赤纬","太陽赤緯","الميل الشمسي"],
["Solution status","estado de la disolución","état de la solution","Lösungszustand","estado da solução","состояние раствора","溶液状态","溶液の状態","حالة المحلول"],
["Stage","etapa","étape","Stufe","etapa","стадия","阶段","段階","المرحلة"],
["Stream power proxy","indicador de potencia de la corriente","indicateur de puissance du cours d’eau","Näherungswert der Flussleistung","indicador de potência do fluxo","оценка мощности потока","水流功率指标","流水力の指標","مؤشر قدرة الجريان"],
["Successes","éxitos","réussites","Erfolge","sucessos","успехи","成功次数","成功回数","النجاحات"],
["System","sistema","système","System","sistema","система","系统","システム","النظام"],
["Time proxy","indicador de tiempo","indicateur de temps","Zeitindikator","indicador de tempo","оценка времени","时间指标","時間指標","مؤشر الزمن"],
["Timescale","escala temporal","échelle de temps","Zeitskala","escala de tempo","временной масштаб","时间尺度","時間尺度","المقياس الزمني"],
["Total momentum","momento total","quantité de mouvement totale","Gesamtimpuls","momento total","полный импульс","总动量","全運動量","الزخم الكلي"],
["Total throughput","producción total","débit total","Gesamtdurchsatz","produção total","общая производительность","总产出量","総処理量","الإنتاج الكلي"],
["Transform","transformante","transformante","Transformstörung","transformante","трансформная","转换型","横ずれ型","تحويلي"],
["Transformed vector","vector transformado","vecteur transformé","transformierter Vektor","vetor transformado","преобразованный вектор","变换后的向量","変換後のベクトル","المتجه بعد التحويل"],
["Translation","traslación","translation","Verschiebung","translação","перенос","平移","平行移動","الإزاحة"],
["Transpiration index","índice de transpiración","indice de transpiration","Transpirationsindex","índice de transpiração","индекс транспирации","蒸腾指数","蒸散指数","مؤشر النتح"],
["Travel time","tiempo de viaje","temps de parcours","Laufzeit","tempo de percurso","время распространения","传播时间","伝播時間","زمن الانتقال"],
["Turn contribution","contribución del giro","contribution de la déviation","Beitrag der Ablenkung","contribuição do desvio","вклад поворота","转向贡献","偏向による寄与","مساهمة الانحراف"],
["Uranus","Urano","Uranus","Uranus","Urano","Уран","天王星","天王星","أورانوس"],
["Valence demand","demanda de valencia","besoin de valence","Valenzbedarf","demanda de valência","потребность в валентности","价键需求","原子価要求量","متطلبات التكافؤ"],
["Venus","Venus","Vénus","Venus","Vênus","Венера","金星","金星","الزهرة"],
["Volume ratio B:A","relación de volumen B:A","rapport de volume B:A","Volumenverhältnis B:A","relação de volume B:A","отношение объёмов B:A","体积比 B:A","体積比 B:A","نسبة الحجم B:A"],
["Width","anchura","largeur","Breite","largura","ширина","宽度","幅","العرض"],
["Will slide?","¿se deslizará?","va-t-il glisser ?","Rutscht es?","vai deslizar?","будет скользить?","是否会滑动？","滑る？","هل سينزلق؟"],
["pH (ideal strong/strong)","pH (ácido fuerte/base fuerte ideal)","pH (acide fort/base forte idéal)","pH (ideal starke Säure/starke Base)","pH (ácido forte/base forte ideal)","pH (идеальные сильная кислота/сильное основание)","pH（理想强酸/强碱）","pH（理想的な強酸/強塩基）","الرقم الهيدروجيني (حمض قوي/قاعدة قوية مثالية)"],
["y at test x","y para el x de prueba","y pour la valeur test de x","y beim Testwert x","y para o x de teste","y при тестовом x","测试 x 对应的 y","テスト x における y","قيمة y عند x الاختبار"],
["y-intercept","intersección con el eje y","ordonnée à l’origine","y-Achsenabschnitt","intercepto em y","пересечение с осью y","y 轴截距","y 切片","المقطع الصادي"],
["Δ electronegativity","Δ electronegatividad","Δ électronégativité","Δ Elektronegativität","Δ eletronegatividade","Δ электроотрицательность","电负性差 Δ","電気陰性度差 Δ","فرق السالبية الكهربائية Δ"]
,["Anaphase","anafase","anaphase","Anaphase","anáfase","анафаза","后期","後期","الطور الانفصالي"]
,["Animal cell","célula animal","cellule animale","Tierzelle","célula animal","животная клетка","动物细胞","動物細胞","خلية حيوانية"]
,["Balanced","equilibrada","équilibrée","ausgeglichen","balanceada","сбалансировано","已配平","平衡","موزون"]
,["Balanced ✓","equilibrada ✓","équilibrée ✓","ausgeglichen ✓","balanceada ✓","сбалансировано ✓","已配平 ✓","平衡 ✓","موزون ✓"]
,["Bent","angular","coudée","gewinkelt","angular","угловая","折线形","折れ線形","منحنٍ"]
,["Bidirectional forks","horquillas bidireccionales","fourches bidirectionnelles","bidirektionale Replikationsgabeln","forquilhas bidirecionais","двунаправленные репликационные вилки","双向复制叉","双方向複製フォーク","شوكات تضاعف ثنائية الاتجاه"]
,["Cancels ideally","se cancela idealmente","s’annule idéalement","hebt sich ideal auf","cancela idealmente","в идеале взаимно компенсируется","理想情况下相消","理想的には打ち消し合う","يتلاشى مثاليًا"]
,["Cancels in ideal model","se cancela en el modelo ideal","s’annule dans le modèle idéal","hebt sich im Idealmodell auf","cancela no modelo ideal","в идеальной модели компенсируется","在理想模型中相消","理想モデルでは打ち消し合う","يتلاشى في النموذج المثالي"]
,["Circle","círculo","cercle","Kreis","círculo","круг","圆","円","دائرة"]
,["Clearing infection","la infección está disminuyendo","l’infection régresse","Infektion wird eingedämmt","a infecção está diminuindo","инфекция подавляется","感染正在清除","感染を排除中","تتم السيطرة على العدوى"]
,["Comfortable","cómodo","confortable","günstig","confortável","комфортный режим","适宜","良好","مريح"]
,["Cytokinesis","citocinesis","cytocinèse","Zytokinese","citocinese","цитокинез","胞质分裂","細胞質分裂","الانقسام السيتوبلازمي"]
,["Deep turn","giro pronunciado","forte déviation","starke Ablenkung","desvio acentuado","сильный поворот","大幅转向","大きな偏向","انحراف كبير"]
,["Denser / sinks","más densa / se hunde","plus dense / coule","dichter / sinkt","mais densa / afunda","плотнее / опускается","密度更大 / 下沉","高密度 / 沈む","أعلى كثافة / يهبط"]
,["Disruptive","disruptiva","diversifiante","disruptiv","disruptiva","дизруптивный","分裂选择","分断選択","انتخاب تمزيقي"]
,["Effusive","efusiva","effusive","effusiv","efusiva","эффузивное","溢流式","穏やかな噴火","انسيابي"]
,["Ellipse / rectangle-like depending orientation","elipse / similar a rectángulo según la orientación","ellipse / forme proche d’un rectangle selon l’orientation","Ellipse / je nach Orientierung rechteckähnlich","elipse / semelhante a retângulo conforme a orientação","эллипс / близко к прямоугольнику в зависимости от ориентации","椭圆 / 取决于方向时近似矩形","楕円 / 向きによっては長方形に近い形","قطع ناقص / قريب من المستطيل حسب الاتجاه"]
,["Explore arrangement","explora la disposición","explorez la disposition","Anordnung untersuchen","explore o arranjo","исследуйте расположение","探索排列方式","配置を調べる","استكشف الترتيب"]
,["Explosive","explosiva","explosive","explosiv","explosiva","взрывное","爆炸式","爆発的","انفجاري"]
,["Favorable","favorable","favorable","günstig","favorável","благоприятно","有利","有利","ملائم"]
,["First-quarter region","zona de cuarto creciente","région du premier quartier","Bereich des ersten Viertels","região de quarto crescente","область первой четверти","上弦月区域","上弦の月付近","منطقة التربيع الأول"]
,["Full-moon region","zona de luna llena","région de pleine lune","Vollmondbereich","região de lua cheia","область полнолуния","满月区域","満月付近","منطقة البدر"]
,["Gas-like","similar a gas","de type gazeux","gasartig","semelhante a gás","газообразный режим","气态","気体状","شبيه بالغاز"]
,["Golgi apparatus","aparato de Golgi","appareil de Golgi","Golgi-Apparat","complexo de Golgi","аппарат Гольджи","高尔基体","ゴルジ体","جهاز غولجي"]
,["Good","bueno","bon","gut","bom","хорошо","良好","良好","جيد"]
,["Hard","duro","dur","hart","duro","жёсткий","较硬","硬い","قاسٍ"]
,["High","alto","élevé","hoch","alto","высокий","高","高い","مرتفع"]
,["High risk","riesgo alto","risque élevé","hohes Risiko","alto risco","высокий риск","高风险","高リスク","خطر مرتفع"]
,["In progress","en progreso","en cours","läuft","em andamento","в процессе","进行中","進行中","قيد التنفيذ"]
,["Interactive","interactivo","interactif","interaktiv","interativo","интерактивно","互动","インタラクティブ","تفاعلي"]
,["Interphase","interfase","interphase","Interphase","interfase","интерфаза","间期","間期","الطور البيني"]
,["Inward","hacia dentro","vers l’intérieur","nach innen","para dentro","внутрь","向内","内向き","إلى الداخل"]
,["Keep adjusting","sigue ajustando","continuez à ajuster","weiter anpassen","continue ajustando","продолжайте настраивать","继续调整","調整を続ける","واصل الضبط"]
,["Last-quarter region","zona de cuarto menguante","région du dernier quartier","Bereich des letzten Viertels","região de quarto minguante","область последней четверти","下弦月区域","下弦の月付近","منطقة التربيع الأخير"]
,["Less accurate","menos preciso","moins précis","weniger genau","menos preciso","менее точно","精度较低","精度が低い","أقل دقة"]
,["Lighter / rises","menos densa / asciende","moins dense / monte","leichter / steigt","menos densa / sobe","легче / поднимается","密度更小 / 上升","低密度 / 上昇","أقل كثافة / يرتفع"]
,["Limited","limitado","limité","begrenzt","limitado","ограничено","受限","制限あり","محدود"]
,["Linear","lineal","linéaire","linear","linear","линейная","直线形","直線形","خطي"]
,["Liquid-like","similar a líquido","de type liquide","flüssigkeitsartig","semelhante a líquido","жидкоподобный режим","液态","液体状","شبيه بالسائل"]
,["Live","en tiempo real","en direct","live","ao vivo","в реальном времени","实时","リアルタイム","مباشر"]
,["Lower","menor","plus faible","niedriger","menor","ниже","较低","低い","أقل"]
,["Lysosome","lisosoma","lysosome","Lysosom","lisossomo","лизосома","溶酶体","リソソーム","الجسيم الحال"]
,["Melting/igneous","fusión / proceso ígneo","fusion / processus magmatique","Schmelzen / magmatischer Prozess","fusão / processo ígneo","плавление / магматический процесс","熔融 / 火成过程","融解 / 火成過程","انصهار / عملية نارية"]
,["Metamorphism","metamorfismo","métamorphisme","Metamorphose","metamorfismo","метаморфизм","变质作用","変成作用","التحول الصخري"]
,["Metaphase","metafase","métaphase","Metaphase","metáfase","метафаза","中期","中期","الطور الاستوائي"]
,["Mitochondrion","mitocondria","mitochondrie","Mitochondrium","mitocôndria","митохондрия","线粒体","ミトコンドリア","الميتوكوندريا"]
,["Mixed","mixto","mixte","gemischt","misto","смешанный","混合","混合","مختلط"]
,["Mostly constructive","principalmente constructiva","principalement constructive","überwiegend konstruktiv","principalmente construtiva","преимущественно конструктивная","以相长干涉为主","主に強め合う干渉","تداخل بنّاء غالبًا"]
,["Mostly destructive","principalmente destructiva","principalement destructive","überwiegend destruktiv","principalmente destrutiva","преимущественно деструктивная","以相消干涉为主","主に弱め合う干渉","تداخل هدّام غالبًا"]
,["Mostly nonpolar covalent","principalmente covalente no polar","principalement covalente apolaire","überwiegend unpolare kovalente Bindung","principalmente covalente apolar","преимущественно неполярная ковалентная","主要为非极性共价键","主に無極性共有結合","تساهمية غير قطبية غالبًا"]
,["Narrower","más estrecha","plus étroite","schmaler","mais estreita","уже","更窄","より狭い","أضيق"]
,["Near central","casi central","presque central","nahezu zentral","quase central","почти центральное","接近中心","中心付近","قريب من المركز"]
,["New / crescent","luna nueva / creciente","nouvelle lune / croissant","Neumond / Sichel","lua nova / crescente","новолуние / серп","新月 / 娥眉月","新月 / 三日月","محاق / هلال"]
,["Northern summer tendency","tendencia al verano boreal","tendance vers l’été boréal","Tendenz zum Nordsommer","tendência ao verão do hemisfério norte","тенденция к лету в Северном полушарии","北半球夏季趋势","北半球の夏傾向","ميل نحو صيف النصف الشمالي"]
,["Northern winter tendency","tendencia al invierno boreal","tendance vers l’hiver boréal","Tendenz zum Nordwinter","tendência ao inverno do hemisfério norte","тенденция к зиме в Северном полушарии","北半球冬季趋势","北半球の冬傾向","ميل نحو شتاء النصف الشمالي"]
,["Nucleus","núcleo","noyau","Zellkern","núcleo","ядро","细胞核","核","النواة"]
,["Octahedral","octaédrica","octaédrique","oktaedrisch","octaédrica","октаэдрическая","八面体","正八面体形","ثماني السطوح"]
,["Outward","hacia fuera","vers l’extérieur","nach außen","para fora","наружу","向外","外向き","إلى الخارج"]
,["Parent width","anchura de la función base","largeur de la fonction de référence","Breite der Grundfunktion","largura da função-base","ширина базовой функции","与母函数同宽","親関数と同じ幅","عرض الدالة الأم"]
,["Partial / miss","parcial / sin eclipse","partiel / éclipse manquée","partiell / keine Bedeckung","parcial / sem eclipse","частично / без полного затмения","偏食 / 错过","部分食 / 外れる","جزئي / لا يحدث كسوف كامل"]
,["Pathogens growing","los patógenos aumentan","les agents pathogènes augmentent","Krankheitserreger nehmen zu","os patógenos aumentam","число патогенов растёт","病原体正在增加","病原体が増加中","مسببات المرض تتزايد"]
,["Polar covalent","covalente polar","covalente polaire","polare kovalente Bindung","covalente polar","полярная ковалентная","极性共价键","極性共有結合","تساهمية قطبية"]
,["Polygon","polígono","polygone","Polygon","polígono","многоугольник","多边形","多角形","مضلع"]
,["Prophase","profase","prophase","Prophase","prófase","профаза","前期","前期","الطور التمهيدي"]
,["Saturated","saturada","saturée","gesättigt","saturada","насыщенный","饱和","飽和","مشبع"]
,["Sediment pathway","ruta de sedimentos","trajet des sédiments","Sedimentpfad","rota dos sedimentos","путь осадочного материала","沉积物路径","堆積物の経路","مسار الرواسب"]
,["Seesaw","balancín","bascule","Wippenform","gangorra","форма качелей","跷跷板形","シーソー形","شكل الأرجوحة"]
,["Shallow turn","giro suave","faible déviation","geringe Ablenkung","desvio suave","небольшой поворот","小幅转向","小さな偏向","انحراف بسيط"]
,["Soft","suave","doux","weich","suave","мягкий","较软","柔らかい","ناعم"]
,["Solid-like","similar a sólido","de type solide","festkörperartig","semelhante a sólido","твёрдоподобный режим","固态","固体状","شبيه بالصلب"]
,["Square","cuadrado","carré","Quadrat","quadrado","квадрат","正方形","正方形","مربع"]
,["Square planar","cuadrada plana","plan carré","quadratisch-planar","quadrado planar","квадратно-плоская","平面正方形","正方形平面形","مربع مستوٍ"]
,["Square pyramidal","piramidal cuadrada","pyramide à base carrée","quadratisch-pyramidal","piramidal quadrada","квадратно-пирамидальная","四方锥形","四角錐形","هرمي مربع"]
,["Stressed","estresado","contraint","belastet","sob tensão","напряжённый","受压较大","応力が高い","مجهد"]
,["Strong","fuerte","fort","stark","forte","сильный","强","強い","قوي"]
,["Strongly ionic tendency","fuerte tendencia iónica","forte tendance ionique","stark ionischer Charakter","forte tendência iônica","сильная ионная тенденция","强离子性倾向","強いイオン性","ميل أيوني قوي"]
,["Supersaturated / excess solid","sobresaturada / exceso de sólido","sursaturée / solide en excès","übersättigt / Feststoffüberschuss","supersaturada / excesso de sólido","пересыщенный / избыток твёрдого вещества","过饱和 / 有多余固体","過飽和 / 固体が過剰","فوق مشبع / مادة صلبة زائدة"]
,["T-shaped","en forma de T","en T","T-förmig","em forma de T","Т-образная","T 形","T 字形","على شكل T"]
,["Telophase","telofase","télophase","Telophase","telófase","телофаза","末期","終期","الطور النهائي"]
,["Tetrahedral","tetraédrica","tétraédrique","tetraedrisch","tetraédrica","тетраэдрическая","四面体","正四面体形","رباعي السطوح"]
,["Trigonal bipyramidal","bipiramidal trigonal","bipyramide trigonale","trigonal-bipyramidal","bipiramidal trigonal","тригонально-бипирамидальная","三角双锥形","三方両錐形","ثنائي هرمي ثلاثي"]
,["Trigonal planar","trigonal plana","trigonale plane","trigonal-planar","trigonal planar","треугольно-плоская","平面三角形","平面三角形","مثلث مستوٍ"]
,["Trigonal pyramidal","piramidal trigonal","pyramide trigonale","trigonal-pyramidal","piramidal trigonal","треугольно-пирамидальная","三角锥形","三角錐形","هرمي ثلاثي"]
,["Unsafe","inseguro","dangereux","unsicher","inseguro","небезопасно","不安全","危険","غير آمن"]
,["Unsaturated","insaturada","insaturée","ungesättigt","insaturada","ненасыщенный","不饱和","不飽和","غير مشبع"]
,["Viscosity traps gas","la viscosidad atrapa gas","la viscosité retient le gaz","Viskosität hält Gas zurück","a viscosidade retém gás","вязкость удерживает газ","高黏度困住气体","粘性がガスを閉じ込める","اللزوجة تحبس الغاز"]
,["Weak–moderate","débil–moderado","faible à modéré","schwach–mäßig","fraco–moderado","слабый–умеренный","弱至中等","弱〜中程度","ضعيف–متوسط"]
,["Wider","más ancha","plus large","breiter","mais larga","шире","更宽","より広い","أوسع"]

] as const;

const localeIndex: Record<Exclude<Locale,"en">, number> = { es:1, fr:2, de:3, pt:4, ru:5, zh:6, ja:7, ar:8 };
const map = new Map<string, readonly string[]>(rows.map(row => [row[0], row]));

export function translatedPhrase(locale: Locale, text: string): string | undefined {
  if (locale === "en") return text;
  const row = map.get(text);
  return row?.[localeIndex[locale]];
}
