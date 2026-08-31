import type { CPSubject } from '../types';

export const initialCpSubjects: CPSubject[] = [
  // ── 1. PENDIDIKAN PANCASILA (FASE D - SMP) ──
  {
    id: 'cp-pancasila',
    subjectName: 'Pendidikan Pancasila',
    phase: 'Fase D',
    skNumber: 'Keputusan BSKAP No. 032/H/KR/2024',
    generalDescription:
      'Pada akhir Fase D, peserta didik memahami sejarah kelahiran Pancasila; menerapkan nilai-nilai Pancasila dalam kehidupan sehari-hari; menganalisis hak dan kewajiban warga negara; memahami struktur norma dan hukum; melestarikan budaya bangsa; serta memiliki komitmen terhadap keutuhan NKRI dan Bhinneka Tunggal Ika.',
    elements: [
      {
        id: 'pancasila-elem-1',
        name: 'Pancasila',
        description:
          'Peserta didik memahami sejarah kelahiran Pancasila; mengaji secara kritis ideologi Pancasila; menganalisis kedudukan Pancasila sebagai dasar negara, pandangan hidup bangsa, dan ideologi negara; serta menerapkan nilai-nilai Pancasila dalam kehidupan bermasyarakat, berbangsa, dan bernegara.',
        tpList: [
          {
            code: 'TP-PAN-01',
            title: 'Menganalisis kronologi sejarah kelahiran Pancasila dan penetapannya sebagai dasar negara oleh BPUPK dan PPKI.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Dapat menjelaskan peran tokoh bangsa dan perumusan Pancasila secara runtut.',
          },
          {
            code: 'TP-PAN-02',
            title: 'Mengidentifikasi dan membiasakan penerapan nilai-nilai Pancasila dalam kehidupan keluarga, sekolah, dan masyarakat.',
            jp: 10,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Memberikan contoh perilaku sesuai 5 sila Pancasila.',
          },
          {
            code: 'TP-PAN-03',
            title: 'Menganalisis kedudukan Pancasila sebagai dasar negara, pandangan hidup bangsa, dan ideologi negara.',
            jp: 12,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Mampu membedakan fungsi Pancasila sebagai dasar negara dan pandangan hidup.',
          },
          {
            code: 'TP-PAN-04',
            title: 'Mengorientasikan pembiasaan perilaku yang mencerminkan nilai-nilai luhur Pancasila dalam kehidupan berbangsa dan bernegara.',
            jp: 10,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Menunjukkan komitmen moral dan keteladanan Pancasila.',
          },
          {
            code: 'TP-PAN-05',
            title: 'Menganalisis dinamika penerapan Pancasila dari masa ke masa serta tantangan keterbukaan ideologi Pancasila di era global.',
            jp: 12,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Mampu mengevaluasi ancaman ideologi asing dan menguatkan ideologi Pancasila.',
          },
          {
            code: 'TP-PAN-06',
            title: 'Merancang dan melaksanakan proyek aksi nyata pengamalan nilai-nilai Pancasila untuk memperkokoh karakter bangsa.',
            jp: 10,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Menghasilkan karya/aksi sosial berbasis nilai Pancasila.',
          },
        ],
      },
      {
        id: 'pancasila-elem-2',
        name: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
        description:
          'Peserta didik memahami periodisasi konstitusi Indonesia; menganalisis norma dan aturan yang berlaku dalam masyarakat; serta memahami hak dan kewajiban warga negara berdasarkan UUD NRI Tahun 1945.',
        tpList: [
          {
            code: 'TP-UUD-01',
            title: 'Memahami bentuk norma (agama, kesusilaan, kesopanan, dan hukum) serta pentingnya keadilan dalam kehidupan bermasyarakat.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Mampu mengidentifikasi sanksi dan pentingnya menaati norma.',
          },
          {
            code: 'TP-UUD-02',
            title: 'Menganalisis hak dan kewajiban warga negara sesuai pasal-pasal UUD NRI Tahun 1945 dalam kehidupan sehari-hari.',
            jp: 10,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Mampu memetakan hak pendidikan, kesehatan, dan membela negara.',
          },
          {
            code: 'TP-UUD-03',
            title: 'Menganalisis kedudukan UUD NRI Tahun 1945 dan tata urutan peraturan perundang-undangan di Indonesia.',
            jp: 12,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Menjelaskan hirarki hukum menurut UU No. 12 Tahun 2011.',
          },
          {
            code: 'TP-UUD-04',
            title: 'Menunjukkan kesadaran hukum dan ketaatan terhadap aturan sekolah, daerah, dan nasional.',
            jp: 10,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Mematuhi tata tertib dan peraturan perundang-undangan.',
          },
          {
            code: 'TP-UUD-05',
            title: 'Menganalisis pokok-pokok pikiran Pembukaan UUD NRI Tahun 1945 dan sejarah amandemen konstitusi.',
            jp: 12,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Menjelaskan hubungan Pembukaan UUD 1945 dengan Proklamasi Kemerdekaan.',
          },
          {
            code: 'TP-UUD-06',
            title: 'Memahami struktur sistem pemerintahan dan peran lembaga-lembaga negara menurut UUD NRI Tahun 1945.',
            jp: 10,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Memetakan tugas eksekutif, legislatif, dan yudikatif.',
          },
        ],
      },
      {
        id: 'pancasila-elem-3',
        name: 'Bhinneka Tunggal Ika',
        description:
          'Peserta didik mengidentifikasi keberagaman suku, agama, ras, dan antargolongan (SARA); melestarikan budaya bangsa; serta mempromosikan toleransi, gotong royong, dan kearifan lokal.',
        tpList: [
          {
            code: 'TP-BTI-01',
            title: 'Mengidentifikasi bentuk keragaman budaya, suku, agama, dan adat istiadat di Indonesia dalam bingkai Bhinneka Tunggal Ika.',
            jp: 10,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Menghargai perbedaan dan menolak perilaku diskriminasi.',
          },
          {
            code: 'TP-BTI-02',
            title: 'Menerapkan sikap toleransi, melestarikan budaya bangsa, dan kerja sama dalam masyarakat multikultural.',
            jp: 10,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Menunjukkan kepedulian dan penghargaan atas keragaman budaya.',
          },
          {
            code: 'TP-BTI-03',
            title: 'Menganalisis pentingnya melestarikan budaya bangsa, kebudayaan daerah, dan pemajuan kebudayaan nasional.',
            jp: 12,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Menjelaskan strategi pelestarian warisan budaya dan kearifan lokal.',
          },
          {
            code: 'TP-BTI-04',
            title: 'Mengidentifikasi ragam tradisi dan budaya nusantara serta perannya dalam memperkuat kebanggaan nasional.',
            jp: 10,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Menunjukkan aksi bangga memakai/mempromosikan budaya daerah.',
          },
          {
            code: 'TP-BTI-05',
            title: 'Menganalisis strategi melestarikan dan mengaktualisasikan budaya bangsa di era globalisasi.',
            jp: 12,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Merumuskan inovasi kreatif pelestarian seni budaya nusantara secara digital.',
          },
          {
            code: 'TP-BTI-06',
            title: 'Mengembangkan sikap gotong royong dan apresiasi terhadap karya seni budaya nusantara untuk mencegah konflik sosial.',
            jp: 10,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Merumuskan solusi musyawarah atas konflik sosial budaya.',
          },
        ],
      },
      {
        id: 'pancasila-elem-4',
        name: 'Negara Kesatuan Republik Indonesia (NKRI)',
        description:
          'Peserta didik memahami wilayah NKRI, batas wilayah, kedaulatan, serta komitmen menjaga keutuhan NKRI dan bela negara.',
        tpList: [
          {
            code: 'TP-NKRI-01',
            title: 'Memahami wilayah NKRI, batas-batas geografis, serta karakteristik daerah dalam konteks Wawasan Nusantara.',
            jp: 10,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Mampu menjelaskan keutuhan wilayah darat, laut, dan udara Indonesia.',
          },
          {
            code: 'TP-NKRI-02',
            title: 'Menunjukkan perilaku menjaga kelestarian lingkungan dan keharmonisan masyarakat sekitar.',
            jp: 8,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Aktif dalam kegiatan sosial dan lingkungan di daerahnya.',
          },
          {
            code: 'TP-NKRI-03',
            title: 'Menganalisis makna kedaulatan rakyat dan peran daerah dalam kerangka Negara Kesatuan Republik Indonesia.',
            jp: 12,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Menjelaskan konsep otonomi daerah dan tata kelola pemerintahan.',
          },
          {
            code: 'TP-NKRI-04',
            title: 'Mengkaji prinsip kedaulatan NKRI dan partisipasi warga negara dalam menjaga persatuan nasional.',
            jp: 10,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Menganalisis dampak integrasi dan ancaman disintegrasi bangsa.',
          },
          {
            code: 'TP-NKRI-05',
            title: 'Menganalisis semangat Sumpah Pemuda 1928 dan jiwa patriotisme dalam mempertahankan keutuhan NKRI.',
            jp: 12,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Menjelaskan peranan pemuda dalam sejarah perjuangan bangsa.',
          },
          {
            code: 'TP-NKRI-06',
            title: 'Menerapkan konsep bela negara dan cinta tanah air untuk mengantisipasi ancaman non-militer di era modern.',
            jp: 10,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Membuat aksi nyata kepedulian sosial dan partisipasi membela negara.',
          },
        ],
      },
    ],
  },

  // ── 2. BAHASA INDONESIA (FASE D - SMP) ──
  {
    id: 'cp-indonesia',
    subjectName: 'Bahasa Indonesia',
    phase: 'Fase D',
    skNumber: 'Keputusan BSKAP No. 032/H/KR/2024',
    generalDescription:
      'Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar sesuai dengan tujuan, konteks sosial, dan akademis. Peserta didik mampu memahami, mengolah, dan menginterpretasi informasi paparan tentang topik yang beragam.',
    elements: [
      {
        id: 'bind-elem-1',
        name: 'Menyimak',
        description:
          'Peserta didik mampu menganalisis dan mengevaluasi informasi berupa gagasan, pikiran, perasaan, atau pesan dari teks lisan (deskripsi, narasi, puisi, eksplanasi, eksposisi).',
        tpList: [
          {
            code: 'TP-BIN-01',
            title: 'Menganalisis gagasan utama dan gagasan penjelas dari teks deskripsi lisan yang disimak.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Mampu mencatat poin penting dan menyimpulkan isi simakan.',
          },
          {
            code: 'TP-BIN-02',
            title: 'Mengevaluasi informasi dan ide pokok dalam teks laporan hasil observasi (LHO) yang diperdengarkan.',
            jp: 12,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Mengidentifikasi fakta vs opini dalam paparan LHO.',
          },
          {
            code: 'TP-BIN-03',
            title: 'Menganalisis pesan moral dan unsur pembangun teks puisi/pantun dari simakan audio-visual.',
            jp: 10,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Menjelaskan makna kiasan dan suasana yang terpancar.',
          },
          {
            code: 'TP-BIN-04',
            title: 'Mengevaluasi akurasi data dan kelogisan argumen dalam teks diskusi lisan di media informasi.',
            jp: 12,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Menilai keberimbangan argumen pro dan kontra.',
          },
        ],
      },
      {
        id: 'bind-elem-2',
        name: 'Membaca dan Memirsa',
        description:
          'Peserta didik memahami informasi berupa gagasan, pikiran, pandangan, atau pesan dari berbagai jenis teks visual dan multimodal.',
        tpList: [
          {
            code: 'TP-BIN-05',
            title: 'Memahami kata-kata kunci dan makna tersurat/tersirat dari teks cerita fantasi dan narasi visual.',
            jp: 14,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Mengidentifikasi alur cerita, watak tokoh, dan latar.',
          },
          {
            code: 'TP-BIN-06',
            title: 'Mengevaluasi struktur dan kaidah kebahasaan teks prosedur dan teks eksplanasi kompleks.',
            jp: 16,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Menemukan kesalahan logika atau urutan langkah dalam teks.',
          },
          {
            code: 'TP-BIN-07',
            title: 'Menganalisis ragam bahasa dan unsur intrinsik/ekstrinsik dalam teks novel/cerpen Indonesia.',
            jp: 14,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Menganalisis sudut pandang dan konflik utama.',
          },
          {
            code: 'TP-BIN-08',
            title: 'Mengkaji kritis teks artikel ilmiah populer untuk menemukan relevansi isu sosial di sekitar.',
            jp: 14,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Menilai keabsahan fakta dan bukti pendukung pengarang.',
          },
        ],
      },
      {
        id: 'bind-elem-3',
        name: 'Berbicara dan Mempresentasikan',
        description:
          'Peserta didik mampu menyampaikan gagasan, pikiran, dan pandangan secara lisan dengan santun, logis, dan kritis.',
        tpList: [
          {
            code: 'TP-BIN-09',
            title: 'Mempresentasikan teks laporan hasil observasi (LHO) menggunakan media presentasi yang menarik.',
            jp: 14,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Lancar, intonasi jelas, dan menguasai materi observasi.',
          },
          {
            code: 'TP-BIN-10',
            title: 'Berdiskusi dan menyampaikan pendapat secara santun dalam forum musyawarah atau debat ilmiah siswa.',
            jp: 12,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Menyampaikan sanggahan berdasar bukti tanpa menyerang pribadi.',
          },
          {
            code: 'TP-BIN-11',
            title: 'Pementasan drama pendek atau musikalisasi puisi dengan penghayatan dan vocal ekspresif.',
            jp: 14,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Ekspresi, artikulasi, dan tata panggung selaras.',
          },
        ],
      },
      {
        id: 'bind-elem-4',
        name: 'Menulis',
        description:
          'Peserta didik mampu menulis berbagai teks (deskripsi, narasi, eksposisi, diskusi, dan cerpen) untuk menyampaikan hasil gagasan secara sistematis.',
        tpList: [
          {
            code: 'TP-BIN-12',
            title: 'Menulis teks cerita imajinasi/fantasi dengan memperhatikan struktur narasi dan unsur kebahasaan.',
            jp: 16,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Mengembangkan alur cerita, penokohan, dan latar secara kreatif.',
          },
          {
            code: 'TP-BIN-13',
            title: 'Menulis surat pribadi dan surat resmi dengan bahasa yang santun dan format tata tulis standar.',
            jp: 12,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Format bagian surat lengkap dan penggunaan ejaan (PUEBI/EYD) benar.',
          },
          {
            code: 'TP-BIN-14',
            title: 'Menulis teks persuasi/iklan/slogan untuk mengampanyekan isu lingkungan atau kesehatan.',
            jp: 14,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Pilihan kata menggugah dan layout media persuasif rapi.',
          },
          {
            code: 'TP-BIN-15',
            title: 'Menulis karya cerita pendek (cerpen) orisinal berdasarkan pengalaman pribadi atau fakta masyarakat.',
            jp: 16,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Konflik cerita runtut, dialog hidup, dan puncaknya berkesan.',
          },
        ],
      },
    ],
  },

  // ── 3. MATEMATIKA (FASE D - SMP) ──
  {
    id: 'cp-matematika',
    subjectName: 'Matematika',
    phase: 'Fase D',
    skNumber: 'Keputusan BSKAP No. 032/H/KR/2024',
    generalDescription:
      'Pada akhir Fase D, peserta didik mampu mengoperasikan bilangan bulat, rasional, dan berpangkat; menggunakan aljabar untuk memecahkan masalah; memahami konsep pengukuran, geometri bidang dan ruang; serta menganalisis data statistik dan peluang.',
    elements: [
      {
        id: 'mtk-elem-1',
        name: 'Bilangan',
        description:
          'Peserta didik membaca, menulis, dan membandingkan bilangan bulat, bilangan rasional, irasional, bilangan berpangkat, dan bentuk akar.',
        tpList: [
          {
            code: 'TP-MTK-01',
            title: 'Menerapkan operasi aritmetika pada bilangan bulat dan pecahan dalam menyelesaikan masalah sehari-hari.',
            jp: 18,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Tepat dalam perhitungan dan penerapan sifat distributif/komutatif.',
          },
          {
            code: 'TP-MTK-02',
            title: 'Memahami konsep rasio (skala, perbandingan senilai dan berbalik nilai) pada pemetaan dan resep.',
            jp: 16,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Tepat menghitung perbandingan senilai dan berbalik nilai.',
          },
          {
            code: 'TP-MTK-03',
            title: 'Memahami dan mengoperasikan bilangan berpangkat (eksponen) serta bentuk akar dalam kehidupan.',
            jp: 14,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Mampu menyederhanakan bentuk akar dan perkalian eksponen.',
          },
        ],
      },
      {
        id: 'mtk-elem-2',
        name: 'Aljabar',
        description:
          'Peserta didik mengenali dan menyederhanakan ekspresi aljabar, menyelesaikan persamaan dan pertidaksamaan linier satu variabel, serta sistem persamaan linier dua variabel (SPLDV).',
        tpList: [
          {
            code: 'TP-MTK-04',
            title: 'Menyederhanakan bentuk aljabar dan menyelesaikan persamaan linear satu variabel (PLSV).',
            jp: 16,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Dapat memodelkan soal cerita ke bentuk persamaan aljabar.',
          },
          {
            code: 'TP-MTK-05',
            title: 'Menyelesaikan Sistem Persamaan Linear Dua Variabel (SPLDV) dengan metode eliminasi dan substitusi.',
            jp: 20,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Menentukan titik potong dan nilai variabel x dan y.',
          },
          {
            code: 'TP-MTK-06',
            title: 'Memahami persamaan kuadrat, menentukan akar-akar persamaan, dan fungsi kuadrat sederhana.',
            jp: 18,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Mampu memfaktorkan dan menggunakan rumus kuadratik (abc).',
          },
        ],
      },
      {
        id: 'mtk-elem-3',
        name: 'Geometri & Pengukuran',
        description:
          'Peserta didik menentukan luas permukaan dan volume bangun ruang (prisma, tabung, limas, kerucut, bola) serta menerapkan Teorema Pythagoras.',
        tpList: [
          {
            code: 'TP-MTK-07',
            title: 'Menganalisis hubungan antar sudut yang terbentuk oleh dua garis sejajar yang dipotong garis transversal.',
            jp: 14,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Menentukan sudut sehadap, berseberangan, dan sepihak.',
          },
          {
            code: 'TP-MTK-08',
            title: 'Membuktikan dan menerapkan Teorema Pythagoras untuk menyelesaikan masalah bangun datar.',
            jp: 16,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Mampu menghitung hipotenusa dan triple Pythagoras.',
          },
          {
            code: 'TP-MTK-09',
            title: 'Menghitung luas permukaan dan volume bangun ruang sisi datar (kubus, balok, prisma, limas).',
            jp: 18,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Tepat menggunakan rumus volume dan jaring-jaring bangun datar.',
          },
          {
            code: 'TP-MTK-10',
            title: 'Menganalisis konsep kesebangunan dan kekongruenan pada bangun datar segitiga dan segiempat.',
            jp: 16,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Menentukan panjang sisi belum diketahui menggunakan perbandingan kesebangunan.',
          },
        ],
      },
      {
        id: 'mtk-elem-4',
        name: 'Analisis Data dan Peluang',
        description:
          'Peserta didik merumuskan pertanyaan, mengumpulkan, menyajikan, dan menganalisis data dalam bentuk diagram batang, garis, lingkaran, serta menentukan nilai pemusatan data (mean, median, modus).',
        tpList: [
          {
            code: 'TP-MTK-11',
            title: 'Menseleksi dan menyajikan data tunggal dalam bentuk tabel, diagram batang, garis, dan lingkaran.',
            jp: 12,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Mampu membaca dan membuat diagram data secara akurat.',
          },
          {
            code: 'TP-MTK-12',
            title: 'Menganalisis ukuran pemusatan data (Mean, Median, Modus) dan ukuran penyebaran dari sekumpulan data.',
            jp: 16,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Tepat menghitung nilai rata-rata dan menafsirkan grafik data.',
          },
          {
            code: 'TP-MTK-13',
            title: 'Menentukan peluang teoritis dan peluang empiris dari suatu kejadian majemuk atau percobaan acak.',
            jp: 14,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Menghitung ruang sampel dan titik sampel kejadian.',
          },
        ],
      },
    ],
  },

  // ── 4. ILMU PENGETAHUAN ALAM / IPA (FASE D - SMP) ──
  {
    id: 'cp-ipa',
    subjectName: 'Ilmu Pengetahuan Alam (IPA)',
    phase: 'Fase D',
    skNumber: 'Keputusan BSKAP No. 032/H/KR/2024',
    generalDescription:
      'Pada akhir Fase D, peserta didik memahami konsep sel, sistem organ, interaksi makhluk hidup dengan lingkungan, sifat zat, wujud zat, energi, gelombang, tata surya, dan pemanasan global.',
    elements: [
      {
        id: 'ipa-elem-1',
        name: 'Pemahaman IPA',
        description:
          'Peserta didik memahami struktur sel, sistem organisasi kehidupan, wujud zat, perubahan fisika dan kimia, gaya dan gerak, energi, magnet, dan tata surya.',
        tpList: [
          {
            code: 'TP-IPA-01',
            title: 'Menganalisis perbedaan sel hewan dan sel tumbuhan melalui pengamatan mikroskop/simulasi.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Menjelaskan organel sel dan fungsinya dengan benar.',
          },
          {
            code: 'TP-IPA-02',
            title: 'Menganalisis konsep suhu, pemuaian, dan kalor serta perpindahannya dalam kehidupan sehari-hari.',
            jp: 14,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Tepat menghitung konversi skala termometer dan rumus kalor.',
          },
          {
            code: 'TP-IPA-03',
            title: 'Menganalisis interaksi antar komponen ekosistem dan jaring-jaring makanan dalam menjaga keseimbangan alam.',
            jp: 14,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Memetakan produsen, konsumen, dan pengurai.',
          },
          {
            code: 'TP-IPA-04',
            title: 'Menganalisis hubungan antara struktur dan fungsi organ pada sistem pencernaan dan pernapasan manusia.',
            jp: 16,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Memetakan proses enzimatis dan pertukaran gas O2/CO2.',
          },
          {
            code: 'TP-IPA-05',
            title: 'Menganalisis konsep gaya, Hukum Newton tentang gerak, dan prinsip kerja pesawat sederhana.',
            jp: 16,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Tepat menghitung keuntungan mekanis katrol dan pengungkit.',
          },
          {
            code: 'TP-IPA-06',
            title: 'Menganalisis konsep getaran, gelombang, bunyi, dan mekanisme pendengaran serta alat optik.',
            jp: 16,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Menghitung frekuensi, periode, dan cepat rambat gelombang.',
          },
          {
            code: 'TP-IPA-07',
            title: 'Menganalisis struktur atom, unsur, senyawa, campuran, serta sifat larutan asam-basa.',
            jp: 14,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Membedakan perubahan fisika dan kimia dengan indikator asam basa.',
          },
          {
            code: 'TP-IPA-08',
            title: 'Menganalisis konsep listrik statis, hukum Coulomb, dan rangkaian listrik dinamis seri/paralel.',
            jp: 16,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Menghitung hambatan pengganti dan Hukum Ohm V=I*R.',
          },
          {
            code: 'TP-IPA-09',
            title: 'Menganalisis konsep kemagnetan, induksi elektromagnetik, serta penerapannya pada teknologi.',
            jp: 14,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Menjelaskan prinsip kerja trafo dan motor listrik.',
          },
          {
            code: 'TP-IPA-10',
            title: 'Menganalisis sistem tata surya, rotasi/revolusi bumi-bulan, serta dampaknya pada fenomena gerhana dan iklim.',
            jp: 12,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Menjelaskan posisi bulan bumi saat gerhana dan pasang surut air laut.',
          },
        ],
      },
      {
        id: 'ipa-elem-2',
        name: 'Keterampilan Proses',
        description:
          'Peserta didik melakukan penyelidikan ilmiah meliputi mengamati, mempertanyakan, merencanakan percobaan, mengumpulkan data, dan mengomunikasikan hasil.',
        tpList: [
          {
            code: 'TP-IPA-11',
            title: 'Merancang percobaan ilmiah sederhana tentang pengaruh suhu terhadap laju reaksi/perubahan wujud zat.',
            jp: 16,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Laporan praktikum memuat variabel bebas, terikat, dan kontrol.',
          },
          {
            code: 'TP-IPA-12',
            title: 'Mengomunikasikan hasil penyelidikan ilmiah tentang isu pencemaran lingkungan dan solusi kearifan lokal.',
            jp: 12,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Menghasilkan poster digital atau laporan percobaan yang komunikatif.',
          },
        ],
      },
    ],
  },

  // ── 5. INFORMATIKA (FASE D - SMP) ──
  {
    id: 'cp-informatika',
    subjectName: 'Informatika',
    phase: 'Fase D',
    skNumber: 'Keputusan BSKAP No. 032/H/KR/2024',
    generalDescription:
      'Peserta didik Mampu menerapkan Berpikir Komputasional (BK), menggunakan Teknologi Informasi dan Komunikasi (TIK), memahami Sistem Komputer (SK), Jaringan Komputer/Internet (JKI), Analisis Data (AD), Algoritma & Pemrograman (AP), Dampak Sosial Informatika (DSI), dan Praktik Lintas Bidang (PLB).',
    elements: [
      {
        id: 'inf-elem-1',
        name: 'Berpikir Komputasional (BK)',
        description:
          'Menerapkan pola dekomposisi, pengenalan pola, abstraksi, dan algoritma untuk menyelesaikan persoalan komputasi.',
        tpList: [
          {
            code: 'TP-INF-01',
            title: 'Menerapkan algoritma pencarian (search) dan pengurutan (sort) pada himpunan data tersusun.',
            jp: 10,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Memahami metode bubble sort, insertion sort, dan binary search.',
          },
          {
            code: 'TP-INF-02',
            title: 'Menerapkan pola struktur data tumpukan (stack) dan antrean (queue) dalam pemecahan masalah sehari-hari.',
            jp: 10,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Mampu membedakan prinsip LIFO dan FIFO pada masalah teknologis.',
          },
        ],
      },
      {
        id: 'inf-elem-2',
        name: 'Teknologi Informasi & Komunikasi (TIK)',
        description:
          'Menggunakan aplikasi perkantoran (pengolah kata, lembar kerja, presentasi) secara terintegrasi untuk mengolah data.',
        tpList: [
          {
            code: 'TP-INF-03',
            title: 'Menggunakan integrasi antar-aplikasi perkantoran (Word, Excel, PowerPoint) dengan fitur Mail Merge dan Object Linking.',
            jp: 12,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Mampu membuat surat massal dan grafik terhubung secara sistematis.',
          },
        ],
      },
      {
        id: 'inf-elem-3',
        name: 'Sistem Komputer & Jaringan (SK & JKI)',
        description:
          'Memahami komponen perangkat keras, lunak, interaksi manusia-komputer, konektivitas internet, dan keamanan data.',
        tpList: [
          {
            code: 'TP-INF-04',
            title: 'Menganalisis mekanisme kerja perangkat keras (hardware), perangkat lunak (software), dan siklus pemrosesan CPU.',
            jp: 10,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Memetakan unit input, proses, output, dan penyimpanan.',
          },
          {
            code: 'TP-INF-05',
            title: 'Memahami jaringan komputer lokal (LAN), Wi-Fi, enkripsi data, dan praktik keamanan siber dasar.',
            jp: 10,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Menjelaskan bahaya phishing, malware, dan pentingnya kata sandi kuat.',
          },
        ],
      },
      {
        id: 'inf-elem-4',
        name: 'Algoritma dan Pemrograman (AP)',
        description:
          'Mengenali objek, variabel, instruksi kondisional (if-then-else), dan perulangan (loop) dalam lingkungan pemrograman visual (Scratch/Blockly).',
        tpList: [
          {
            code: 'TP-INF-06',
            title: 'Membuat program visual interaktif dengan struktur kontrol percabangan dan perulangan menggunakan Scratch/Blockly.',
            jp: 18,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Program berjalan tanpa bug dan menghasilkan luaran yang sesuai.',
          },
          {
            code: 'TP-INF-07',
            title: 'Mengembangkan fungsi/prosedur modular dan penggunaan variabel array pada program komputer sederhana.',
            jp: 16,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Kode modular, rapi, dan efisien.',
          },
        ],
      },
      {
        id: 'inf-elem-5',
        name: 'Analisis Data & Dampak Sosial (AD & DSI)',
        description:
          'Pengumpulan data, pembersihan data, visualisasi data, serta etika kewargaan digital dan etika kecerdasan buatan (AI).',
        tpList: [
          {
            code: 'TP-INF-08',
            title: 'Melakukan pembersihan data (data cleaning), pengelompokan data, dan visualisasi diagram dengan Excel/Google Sheets.',
            jp: 12,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Tepat menggunakan rumus VLOOKUP, Pivot Table, dan diagram visual.',
          },
          {
            code: 'TP-INF-09',
            title: 'Menganalisis dampak sosial informatika, etika kewargaan digital, jejak digital, serta pemanfaatan AI secara bertanggung jawab.',
            jp: 10,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Membuat refleksi kritis etika bermedia sosial dan perlindungan UU ITE.',
          },
        ],
      },
    ],
  },

  // ── 6. ILMU PENGETAHUAN SOSIAL / IPS (FASE D - SMP) ──
  {
    id: 'cp-ips',
    subjectName: 'Ilmu Pengetahuan Sosial (IPS)',
    phase: 'Fase D',
    skNumber: 'Keputusan BSKAP No. 032/H/KR/2024',
    generalDescription:
      'Peserta didik memahami pemahaman konsep ruang dan waktu; interaksi sosial; kegiatan ekonomi dan pemenuhan kebutuhan; serta perubahan sosial budaya dalam dinamika kebangsaan Indonesia.',
    elements: [
      {
        id: 'ips-elem-1',
        name: 'Pemahaman Konsep IPS',
        description:
          'Peserta didik memahami kondisi geografis Indonesia, keanekaragaman sumber daya alam, potensi maritim, kegiatan ekonomi produsen-konsumen-distributor, serta sejarah pergerakan nasional.',
        tpList: [
          {
            code: 'TP-IPS-01',
            title: 'Menganalisis pengaruh letak astronomis dan geografis Indonesia terhadap iklim dan keragaman flora-fauna.',
            jp: 14,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Mampu membaca peta tematis dan menjelaskan garis Wallace-Weber.',
          },
          {
            code: 'TP-IPS-02',
            title: 'Menganalisis peran interaksi sosial dan lembaga sosial dalam menjaga keteraturan kehidupan masyarakat.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Menjelaskan fungsi lembaga keluarga, agama, ekonomi, dan pendidikan.',
          },
          {
            code: 'TP-IPS-03',
            title: 'Memahami konsep kelangkaan, permintaan, penawaran, dan mekanisme pembentukan harga di pasar.',
            jp: 14,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Menjelaskan kurva permintaan-penawaran dan peran teknologi e-commerce.',
          },
          {
            code: 'TP-IPS-04',
            title: 'Menganalisis mobilitas sosial, keanekaragaman etnis, dan integrasi sosial dalam masyarakat Indonesia.',
            jp: 14,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Memetakan faktor pendorong/penghambat mobilitas sosial.',
          },
          {
            code: 'TP-IPS-05',
            title: 'Menganalisis latar belakang kedatangan bangsa barat, perlawanan daerah, dan pergerakan nasional Indonesia.',
            jp: 16,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Menjelaskan organisasi pergerakan (Budi Utomo, Sarekat Islam, PNI).',
          },
          {
            code: 'TP-IPS-06',
            title: 'Menganalisis perubahan sosial budaya, modernisasi, dan globalisasi terhadap gaya hidup masyarakat.',
            jp: 14,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Mampu menyaring dampak positif dan negatif globalisasi.',
          },
          {
            code: 'TP-IPS-07',
            title: 'Menganalisis ketergantungan antarruang dan konsep ekonomi kreatif dalam meningkatkan kesejahteraan bangsa.',
            jp: 14,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Merumuskan ide inovasi produk unggulan daerah.',
          },
        ],
      },
    ],
  },

  // ── 7. BAHASA INGGRIS (FASE D - SMP) ──
  {
    id: 'cp-inggris',
    subjectName: 'Bahasa Inggris',
    phase: 'Fase D',
    skNumber: 'Keputusan BSKAP No. 032/H/KR/2024',
    generalDescription:
      'At the end of Phase D, students use English to interact and communicate in a range of predictable social and classroom situations (Listening, Speaking, Reading, Viewing, Writing, Presenting).',
    elements: [
      {
        id: 'bing-elem-1',
        name: 'Listening and Speaking',
        description:
          'Students use English to interact and exchange ideas, experiences, feelings, and opinions on familiar topics in formal and informal contexts.',
        tpList: [
          {
            code: 'TP-BIG-01',
            title: 'Identify main ideas and specific information from short spoken interpersonal and transactional texts.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Demonstrate comprehension through answering guided WH-questions.',
          },
          {
            code: 'TP-BIG-02',
            title: 'Interact orally using express greeting, thanking, apologizing, and asking for/giving personal information.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Perform confident classroom dialogues with acceptable pronunciation.',
          },
          {
            code: 'TP-BIG-03',
            title: 'Express feelings, state opinion, agreement/disagreement in short group discussion topics.',
            jp: 14,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Fluently give reasons using "I think...", "In my opinion...", "I agree...".',
          },
        ],
      },
      {
        id: 'bing-elem-2',
        name: 'Reading and Viewing',
        description:
          'Students independently read and respond to familiar and unfamiliar texts (descriptive, recount, narrative, procedure).',
        tpList: [
          {
            code: 'TP-BIG-04',
            title: 'Comprehend explicit and implicit information from descriptive texts about people, places, and animals.',
            jp: 14,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Identify adjectives, identification, and description parts accurately.',
          },
          {
            code: 'TP-BIG-05',
            title: 'Comprehend explicit and implicit information from recount texts and procedure texts.',
            jp: 16,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Analyze text structure, time connectives, and past tense verbs.',
          },
          {
            code: 'TP-BIG-06',
            title: 'Analyze moral values, character motives, and plot development in narrative folklores and fables.',
            jp: 16,
            classGrade: 'IX',
            semester: 1,
            rubrikSingkat: 'Summarize orientation, complication, and resolution clearly.',
          },
        ],
      },
      {
        id: 'bing-elem-3',
        name: 'Writing and Presenting',
        description:
          'Students write multimodal texts using appropriate grammar, vocabulary, and paragraph organization to convey ideas.',
        tpList: [
          {
            code: 'TP-BIG-07',
            title: 'Write short descriptive paragraphs using simple present tense and correct mechanics.',
            jp: 12,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Well-structured draft with subject-verb agreement.',
          },
          {
            code: 'TP-BIG-08',
            title: 'Compose a simple recount text or cooking procedure recipe with visual infographics.',
            jp: 14,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Clear steps, imperative sentences, and attractive layout.',
          },
          {
            code: 'TP-BIG-09',
            title: 'Present a short report or persuasive speech on environmental issues using visual slides.',
            jp: 14,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Clear eye contact, good intonation, and organized slides.',
          },
        ],
      },
    ],
  },

  // ── 8. PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI (PAI - FASE D) ──
  {
    id: 'cp-pai',
    subjectName: 'Pendidikan Agama Islam (PAI)',
    phase: 'Fase D',
    skNumber: 'Keputusan BSKAP No. 032/H/KR/2024',
    generalDescription:
      'Pada akhir Fase D, peserta didik membaca Al-Qur’an dengan tajwid; memahami rukun iman; menerapkan norma akhlak mahmudah; memahami ketentuan fikih ibadah dan muamalah; serta mengelaborasi sejarah peradaban Islam.',
    elements: [
      {
        id: 'pai-elem-1',
        name: 'Al-Qur’an dan Hadis',
        description:
          'Membaca, menghafal, dan menganalisis kandungan ayat Al-Qur’an dan Hadis tentang toleransi, pemaaf, dan semangat menuntut ilmu.',
        tpList: [
          {
            code: 'TP-PAI-01',
            title: 'Membaca dan menghafal QS. An-Nisa/4: 59 dan QS. An-Nahl/16: 64 sesuai hukum bacaan tajwid.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Tartil membaca dan hafal dengan lancar.',
          },
          {
            code: 'TP-PAI-02',
            title: 'Menganalisis kandungan QS. Al-Anbiya/21: 30 dan QS. Al-A’raf/7: 54 tentang penciptaan alam semesta.',
            jp: 12,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Menjelaskan bukti keagungan Allah SWT lewat tadabbur alam.',
          },
        ],
      },
      {
        id: 'pai-elem-2',
        name: 'Akidah & Akhlak',
        description:
          'Memahami Asmaul Husna, rukun iman kepada Malaikat, Kitab, Rasul, Hari Akhir, Qada-Qadar, dan membiasakan akhlak mulia.',
        tpList: [
          {
            code: 'TP-PAI-03',
            title: 'Menganalisis makna Asmaul Husna (Al-Alim, Al-Khabir, As-Sami, Al-Basir) dan penerapannya dalam kejujuran.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Menunjukkan teladan hidup jujur dan tekun belajar.',
          },
          {
            code: 'TP-PAI-04',
            title: 'Menerapkan perilaku mawas diri dan optimis berdasarkan iman kepada Kitab-kitab Allah dan Hari Akhir.',
            jp: 12,
            classGrade: 'VIII',
            semester: 2,
            rubrikSingkat: 'Menjauhi perilaku dusta dan senantiasa beramal saleh.',
          },
        ],
      },
      {
        id: 'pai-elem-3',
        name: 'Fikih & Sejarah Peradaban Islam',
        description:
          'Memahami thaharah, salat berjamaah, salat sunnah, puasa, zakat, serta sejarah masa Daulah Umayyah, Abbasiyah, dan Nusantara.',
        tpList: [
          {
            code: 'TP-PAI-05',
            title: 'Menganalisis ketentuan thaharah (bersuci) dari hadas kecil/besar serta salat berjamaah.',
            jp: 12,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Praktik wudu/tayamum dan tata cara salat benar.',
          },
          {
            code: 'TP-PAI-06',
            title: 'Menganalisis peran ilmuwan muslim pada masa kemajuan Daulah Abbasiyah dan Walisongo di Nusantara.',
            jp: 14,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Meneladani semangat literasi dan strategi dakwah santun.',
          },
        ],
      },
    ],
  },

  // ── 9. PJOK (PENDIDIKAN JASMANI, OLAHRAGA, DAN KESEHATAN) ──
  {
    id: 'cp-pjok',
    subjectName: 'PJOK',
    phase: 'Fase D',
    skNumber: 'Keputusan BSKAP No. 032/H/KR/2024',
    generalDescription:
      'Pada akhir Fase D, peserta didik mempraktikkan keterampilan gerak spesifik permainan dan olahraga; menganalisis konsep latihan kebugaran jasmani; serta menerapkan pola hidup sehat.',
    elements: [
      {
        id: 'pjok-elem-1',
        name: 'Keterampilan & Pengetahuan Gerak',
        description:
          'Mempraktikkan dan menganalisis teknik dasar permainan bola besar (sepak bola, bola voli, basket) dan bola kecil (bulu tangkis, kasti/rounders).',
        tpList: [
          {
            code: 'TP-PJK-01',
            title: 'Mempraktikkan variasi dan kombinasi teknik dasar menendang, mengumpan, dan menghentikan bola pada permainan sepak bola.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Gerakan koordinasi kaki dan penguasaan bola baik.',
          },
          {
            code: 'TP-PJK-02',
            title: 'Menganalisis variasi dan kombinasi teknik servis, passing bawah, dan passing atas permainan bola voli.',
            jp: 12,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Akurasi umpan dan posisi tubuh seimbang.',
          },
        ],
      },
      {
        id: 'pjok-elem-2',
        name: 'Pemanfaatan Gerak & Kesehatan',
        description:
          'Menganalisis komponen kebugaran jasmani (kekuatan, kelenturan, daya tahan) dan pencegahan bahaya pergaulan bebas/narkoba.',
        tpList: [
          {
            code: 'TP-PJK-03',
            title: 'Merancang dan mempraktikkan program latihan kebugaran jasmani terkait kesehatan (push-up, sit-up, lari sirkuit).',
            jp: 12,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Menunjukkan peningkatan daya tahan dan ketahanan fisik.',
          },
          {
            code: 'TP-PJK-04',
            title: 'Memahami prinsip gizi seimbang, pencegahan penyakit menular, serta dampak buruk narkoba dan pergaulan bebas.',
            jp: 10,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Mampu menyusun menu makanan sehat seimbang.',
          },
        ],
      },
    ],
  },

  // ── 10. SENI BUDAYA / SENI RUPA (FASE D) ──
  {
    id: 'cp-seni',
    subjectName: 'Seni Budaya (Seni Rupa/Musik)',
    phase: 'Fase D',
    skNumber: 'Keputusan BSKAP No. 032/H/KR/2024',
    generalDescription:
      'Pada akhir Fase D, peserta didik mampu mengamati, merefleksikan, dan menghasilkan karya seni rupa/musik dengan mengeksplorasi garis, bentuk, warna, dan ritme budaya nusantara.',
    elements: [
      {
        id: 'seni-elem-1',
        name: 'Mengalami & Menciptakan',
        description:
          'Eksplorasi medium, teknik, dan unsur seni rupa (menggambar ilustrasi, rupa ragam hias, perspektif, desain grafis) atau seni musik.',
        tpList: [
          {
            code: 'TP-SEN-01',
            title: 'Menggambar flora, fauna, dan alam benda dengan menerapkan prinsip komposisi, proporsi, dan pencahayaan.',
            jp: 12,
            classGrade: 'VII',
            semester: 1,
            rubrikSingkat: 'Karya gambar memiliki arsir gradasi dan proporsi presisi.',
          },
          {
            code: 'TP-SEN-02',
            title: 'Merancang motif ragam hias daerah nusantara pada media kain/kertas dengan pola simetris.',
            jp: 12,
            classGrade: 'VII',
            semester: 2,
            rubrikSingkat: 'Kreativitas kontur garis dan harmoni warna daerah.',
          },
          {
            code: 'TP-SEN-03',
            title: 'Menggambar perspektif satu dan dua titik hilang pada objek arsitektur atau ruangan.',
            jp: 14,
            classGrade: 'VIII',
            semester: 1,
            rubrikSingkat: 'Garis horison dan titik lenyap tepat secara geometris.',
          },
        ],
      },
      {
        id: 'seni-elem-2',
        name: 'Merefleksikan & Berdampak',
        description:
          'Mengapresiasi karya seni daerah, mengevaluasi fungsi seni rupa dalam kehidupan masyarakat, dan memamerkan karya.',
        tpList: [
          {
            code: 'TP-SEN-04',
            title: 'Merancang dan menyelenggarakan pameran karya seni rupa kelas/sekolah secara kolaboratif.',
            jp: 12,
            classGrade: 'IX',
            semester: 2,
            rubrikSingkat: 'Katalog pameran, penataan display, dan publikasi rapi.',
          },
        ],
      },
    ],
  },
];

export function findCpSubjectId(subjects: CPSubject[], subjectName?: string): string {
  if (!subjectName) return subjects[0]?.id || '';
  const query = subjectName.toLowerCase().trim();
  const found = subjects.find((s) => {
    const sName = s.subjectName.toLowerCase();
    return (
      sName === query ||
      sName.includes(query) ||
      query.includes(sName) ||
      (query.includes('ipa') && sName.includes('ilmu pengetahuan alam')) ||
      (query.includes('ips') && sName.includes('ilmu pengetahuan sosial')) ||
      (query.includes('pancasila') && sName.includes('pancasila')) ||
      (query.includes('pai') && sName.includes('agama islam')) ||
      (query.includes('pjok') && sName.includes('pjok')) ||
      (query.includes('matematika') && sName.includes('matematika')) ||
      (query.includes('inggris') && sName.includes('inggris')) ||
      (query.includes('indonesia') && sName.includes('indonesia')) ||
      (query.includes('informatika') && sName.includes('informatika'))
    );
  });
  return found?.id || subjects[0]?.id || '';
}
