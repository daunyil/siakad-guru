import type { QuestionCardItem, AssessmentType, CognitiveLevel, QuestionType } from '../components/administrasi/AsesmenSoalGenerator';
import { masterBukuSiswaData, type BukuSiswaBab, type BukuSiswaSubBab } from './bukuSiswaData';

export interface AuthenticBabQuestions {
  babId: string;
  babNumber: number;
  classGrade: 'VII' | 'VIII' | 'IX';
  semester: 1 | 2;
  babTitle: string;
  questions: Omit<QuestionCardItem, 'id' | 'number'>[];
}

export const authenticPancasilaQuestionBank: AuthenticBabQuestions[] = [
  // ═══════════════════════════════════════════════════════════════════
  // KELAS 7 - BAB 1: SEJARAH KELAHIRAN PANCASILA (SEM 1)
  // ═══════════════════════════════════════════════════════════════════
  {
    babId: 'bab-1-pkn-7',
    babNumber: 1,
    classGrade: 'VII',
    semester: 1,
    babTitle: 'Bab I: Sejarah Kelahiran Pancasila',
    questions: [
      {
        tpCode: 'TP-7.1.A',
        tpTitle: 'Menganalisis latar sejarah awal dan nilai kearifan Nusantara sebagai cikal bakal nilai Pancasila',
        elementName: 'Pancasila',
        indicator: 'Disajikan fakta sejarah masa kerajaan Nusantara (Sriwijaya/Majapahit), peserta didik dapat mengidentifikasi nilai luhur ketuhanan dan persatuan bangsa dengan tepat.',
        cognitiveLevel: 'L2 (Penerapan)',
        questionType: 'PG',
        stemText: 'Perhatikan bukti sejarah masa kerajaan Nusantara berikut!\n\nDi masa Kerajaan Majapahit, Mpu Tantular menuliskan kalimat "Bhinneka Tunggal Ika tan hana dharma mangrwa" dalam Kitab Sutasoma untuk menggambarkan kerukunan antara pemeluk agama Hindu dan Buddha. Hal ini membuktikan bahwa nilai-nilai Pancasila...\n',
        options: {
          a: 'Merupakan kebiasaan baru yang baru diajarkan bangsa barat',
          b: 'Telah hidup, mengakar, dan dipraktikkan oleh nenek moyang bangsa sejak dahulu',
          c: 'Baru tercipta setelah berdirinya organisasi Boedi Oetomo',
          d: 'Hanya berlaku untuk kalangan keluarga kerajaan istana saja',
        },
        keyAnswer: 'B',
        scoringGuide: 'Jawaban benar bernilai skor 2, salah bernilai 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-7.1.B',
        tpTitle: 'Menelaah dinamika perumusan dasar negara dalam sidang BPUPK',
        elementName: 'Pancasila',
        indicator: 'Disajikan narasi sidang pertama BPUPK (29 Mei - 1 Juni 1945), peserta didik dapat membedakan gagasan dasar negara dari tokoh pendiri bangsa.',
        cognitiveLevel: 'L2 (Penerapan)',
        questionType: 'PG',
        stemText: 'Pada tanggal 1 Juni 1945 dalam sidang BPUPK pertama, Ir. Soekarno menyampaikan pidato tentang lima dasar negara merdeka yang beliau beri nama "Pancasila". Kelima asas tersebut diperas lagi menjadi "Trisila" dan akhirnya diperas menjadi satu prinsip inti ("Ekasila"), yaitu...\n',
        options: {
          a: 'Gotong Royong',
          b: 'Nasionalisme',
          c: 'Kekeluargaan',
          d: 'Musyawarah Mufakat',
        },
        keyAnswer: 'A',
        scoringGuide: 'Jawaban benar bernilai skor 2, salah bernilai 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-7.1.C',
        tpTitle: 'Menganalisis perumusan Piagam Jakarta oleh Panitia Sembilan',
        elementName: 'Pancasila',
        indicator: 'Disajikan konteks musyawarah Panitia Sembilan (22 Juni 1945), peserta didik dapat menganalisis kompromi luhur kebangsaan demi keutuhan NKRI.',
        cognitiveLevel: 'L3 (Penalaran/HOTS)',
        questionType: 'PG',
        stemText: 'Pada tanggal 18 Agustus 1945 pagi, Mohammad Hatta menerima pesan dari perwakilan Indonesia bagian timur terkait kalimat dalam sila pertama Piagam Jakarta. Para pendiri bangsa dari kalangan Islam dengan berjiwa besar menyepakati perubahan kalimat tersebut menjadi "Ketuhanan Yang Maha Esa". Sikap teladan pendiri bangsa ini mencerminkan komitmen terhadap...',
        options: {
          a: 'Kepentingan golongan mayoritas di atas segalanya',
          b: 'Persatuan dan keutuhan bangsa Indonesia di atas kepentingan kelompok',
          c: 'Tuntutan pihak asing agar Indonesia segera diakui',
          d: 'Kekhawatiran akan terjadinya intervensi pasukan Sekutu',
        },
        keyAnswer: 'B',
        scoringGuide: 'Jawaban benar bernilai skor 2, salah bernilai 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-7.1.D',
        tpTitle: 'Meneladani penetapan Pancasila dan komitmen pendiri bangsa',
        elementName: 'Pancasila',
        indicator: 'Disajikan studi kasus fenomena kehidupan remaja, peserta didik dapat merumuskan 3 sikap keteladanan pendiri bangsa dalam kehidupan sehari-hari.',
        cognitiveLevel: 'L3 (Penalaran/HOTS)',
        questionType: 'URAIAN',
        stemText: 'Para pendiri bangsa (founding fathers) menunjukkan sikap berjiwa besar, toleransi, cinta tanah air, dan mengutamakan musyawarah saat menetapkan Pancasila dan UUD NRI 1945 pada sidang PPKI 18 Agustus 1945.\n\nJelaskan 3 (tiga) bentuk sikap keteladanan para pendiri bangsa yang wajib kalian terapkan dalam lingkungan sekolah dan pergaulan sehari-hari saat ini!',
        keyAnswer: '1. Mengutamakan musyawarah dan menghargai perbedaan pendapat saat kerja kelompok.\n2. Berjiwa besar menerima hasil keputusan bersama walau berbeda dengan usulan pribadi.\n3. Menjaga kerukunan dan persatuan tanpa membeda-bedakan suku, agama, dan latar belakang teman.',
        scoringGuide: 'Skor 10: Menjelaskan 3 contoh sikap konkret dan relevan secara komprehensif.\nSkor 7: Menjelaskan 2 contoh sikap konkret.\nSkor 4: Menjelaskan 1 contoh sikap.\nSkor 0: Tidak menjawab.',
        maxScore: 10,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // KELAS 7 - BAB 2: NORMA DAN UUD NRI TAHUN 1945 (SEM 1)
  // ═══════════════════════════════════════════════════════════════════
  {
    babId: 'bab-2-pkn-7',
    babNumber: 2,
    classGrade: 'VII',
    semester: 1,
    babTitle: 'Bab II: Norma dan UUD NRI Tahun 1945',
    questions: [
      {
        tpCode: 'TP-7.2.A',
        tpTitle: 'Mengidentifikasi dan membedakan 4 macam norma dalam masyarakat',
        elementName: 'UUD NRI 1945',
        indicator: 'Disajikan contoh perilaku dalam kehidupan masyarakat, peserta didik dapat mengelompokkan jenis norma dan sanksinya.',
        cognitiveLevel: 'L1 (Pemahaman)',
        questionType: 'PG',
        stemText: 'Seseorang yang membuang sampah sembarangan di jalan raya atau melanggar rambu lalu lintas akan mendapatkan teguran atau tilang dari pihak berwajib. Aturan ini bersumber dari lembaga resmi negara dan memiliki sanksi yang tegas serta memaksa, yaitu merupakan bentuk norma...',
        options: {
          a: 'Norma Agama',
          b: 'Norma Kesusilaan',
          c: 'Norma Kesopanan',
          d: 'Norma Hukum',
        },
        keyAnswer: 'D',
        scoringGuide: 'Jawaban benar skor 2, salah skor 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-7.2.B',
        tpTitle: 'Menganalisis arti penting norma dan keadilan dalam kehidupan bermasyarakat',
        elementName: 'UUD NRI 1945',
        indicator: 'Disajikan ilustrasi konflik sosial, peserta didik dapat menyimpulkan fungsi norma dalam menciptakan ketertiban dan kedamaian.',
        cognitiveLevel: 'L2 (Penerapan)',
        questionType: 'PG',
        stemText: 'Di sebuah lingkungan tempat tinggal yang dihuni oleh warga dari berbagai suku, sering terjadi perselisihan akibat perbedaan kebiasaan. Untuk menciptakan kerukunan, warga bermusyawarah membuat aturan bersama. Fungsi utama norma dalam situasi tersebut adalah...',
        options: {
          a: 'Membatasi kebebasan warga dalam beraktivitas sehari-hari',
          b: 'Memberikan pedoman perilaku guna menciptakan keteraturan, keadilan, dan ketenteraman bersama',
          c: 'Menghukum warga pendatang yang tidak mengikuti tradisi mayoritas',
          d: 'Menghilangkan keberagaman suku bangsa yang ada di lingkungan tersebut',
        },
        keyAnswer: 'B',
        scoringGuide: 'Jawaban benar skor 2, salah skor 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-7.2.C',
        tpTitle: 'Menelaah kedudukan UUD NRI 1945 sebagai hukum dasar tertinggi tertulis',
        elementName: 'UUD NRI 1945',
        indicator: 'Disajikan prinsip hierarki peraturan perundang-undangan, peserta didik dapat menentukan konsekuensi hukum dari peraturan di bawah UUD 1945.',
        cognitiveLevel: 'L2 (Penerapan)',
        questionType: 'PG',
        stemText: 'UUD NRI Tahun 1945 menempati hierarki tertinggi dalam sistem peraturan perundang-undangan di Indonesia. Konsekuensi dari kedudukan UUD 1945 sebagai hukum dasar tertingggi adalah...',
        options: {
          a: 'Semua undang-undang dan peraturan di bawahnya tidak boleh bertentangan dengan UUD 1945',
          b: 'UUD 1945 dapat digantikan sewaktu-waktu oleh peraturan pemerintah',
          c: 'Masyarakat bebas memilih untuk menaati atau mengabaikan pasal-pasal UUD 1945',
          d: 'Peraturan daerah memiliki kekuatan hukum yang lebih kuat daripada UUD 1945',
        },
        keyAnswer: 'A',
        scoringGuide: 'Jawaban benar skor 2, salah skor 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-7.2.D',
        tpTitle: 'Merumuskan aksi pembiasaan penegakan norma di sekolah',
        elementName: 'UUD NRI 1945',
        indicator: 'Disajikan studi kasus pelanggaran tata tertib sekolah, peserta didik dapat merancang solusi preventif dan edukatif.',
        cognitiveLevel: 'L3 (Penalaran/HOTS)',
        questionType: 'URAIAN',
        stemText: 'Di sekolah kalian, beberapa siswa kedapatan terlambat datang ke sekolah dan menggunakan gawai tanpa izin saat jam pelajaran berlangsung.\n\n1. Analisislah jenis norma dan aturan apa saja yang dilanggar!\n2. Jelaskan dampak negatif perilaku tersebut terhadap proses belajar kelas!\n3. Buatlah 2 (dua) usulan solusi kreatif dan persuasif agar teman-teman kalian lebih disiplin menaati tata tertib sekolah!',
        keyAnswer: '1. Norma hukum sekolah (tata tertib) dan norma kesopanan.\n2. Mengganggu konsentrasi belajar, menurunkan ketertiban, dan merugikan teman sekelas.\n3. Usulan: kampanye duta disiplin dan sistem reward bagi kelas tertertib.',
        scoringGuide: 'Skor 10: Menjawab ketiga poin dengan analisis tajam dan solusi realistis.\nSkor 7: Menjawab 2 poin dengan benar.\nSkor 4: Menjawab 1 poin.\nSkor 0: Tidak menjawab.',
        maxScore: 10,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // KELAS 7 - BAB 3: KESATUAN INDONESIA & KEBERAGAMAN (SEM 1)
  // ═══════════════════════════════════════════════════════════════════
  {
    babId: 'bab-3-pkn-7',
    babNumber: 3,
    classGrade: 'VII',
    semester: 1,
    babTitle: 'Bab III: Kesatuan Indonesia dan Keberagaman',
    questions: [
      {
        tpCode: 'TP-7.3.A',
        tpTitle: 'Menjelaskan batas wilayah dan makna kedaulatan NKRI',
        elementName: 'NKRI',
        indicator: 'Disajikan konsep Deklarasi Djuanda 13 Desember 1957, peserta didik dapat menganalisis arti penting wilayah kesatuan laut bagi kedaulatan Indonesia.',
        cognitiveLevel: 'L2 (Penerapan)',
        questionType: 'PG',
        stemText: 'Sebelum lahirnya Deklarasi Djuanda tahun 1957, wilayah laut Indonesia mengacu pada ordonansi kolonial Belanda 1939 yang menyebabkan laut antarpulau menjadi laut bebas (internasional). Arti penting dicetuskannya Deklarasi Djuanda bagi kesatuan bangsa adalah...',
        options: {
          a: 'Menjadikan seluruh laut di antara pulau-pulau sebagai wilayah kedaulatan utuh NKRI',
          b: 'Membatasi kapal nelayan lokal melaut di wilayah perairan sendiri',
          c: 'Menyerahkan pengelolaan selat-selat strategis kepada organisasi PBB',
          d: 'Membagi wilayah laut Indonesia menjadi beberapa zona terpisah',
        },
        keyAnswer: 'A',
        scoringGuide: 'Jawaban benar skor 2, salah skor 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-7.3.B',
        tpTitle: 'Menghargai keragaman suku, agama, ras, dan antargolongan',
        elementName: 'Bhinneka Tunggal Ika',
        indicator: 'Disajikan fenomena keberagaman budaya di lingkungan sekolah, peserta didik dapat menunjukkan perilaku toleran dan inklusif.',
        cognitiveLevel: 'L2 (Penerapan)',
        questionType: 'PG',
        stemText: 'Di kelas VII, terdapat murid yang berasal dari berbagai suku bangsa dengan logat dan dialek yang berbeda-beda. Sikap terpuji yang mencerminkan semboyan Bhinneka Tunggal Ika saat berkomunikasi di sekolah adalah...',
        options: {
          a: 'Menertawakan teman yang berbicara dengan logat daerahnya',
          b: 'Hanya mau berteman dengan teman yang berasal dari satu daerah asal saja',
          c: 'Menggunakan Bahasa Indonesia yang baik serta saling menghargai dan mempelajari budaya teman',
          d: 'Meminta teman dari luar daerah untuk melupakan adat istiadat aslinya',
        },
        keyAnswer: 'C',
        scoringGuide: 'Jawaban benar skor 2, salah skor 0.',
        maxScore: 2,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // KELAS 8 - BAB 1: KEDUDUKAN & FUNGSI PANCASILA (SEM 1)
  // ═══════════════════════════════════════════════════════════════════
  {
    babId: 'bab-1-pkn-8',
    babNumber: 1,
    classGrade: 'VIII',
    semester: 1,
    babTitle: 'Bab I: Kedudukan dan Fungsi Pancasila',
    questions: [
      {
        tpCode: 'TP-8.1.A',
        tpTitle: 'Menganalisis kedudukan Pancasila sebagai Dasar Negara dan Pandangan Hidup Bangsa',
        elementName: 'Pancasila',
        indicator: 'Disajikan studi kasus perumusan kebijakan publik, peserta didik dapat menjelaskan fungsi Pancasila sebagai sumber dari segala sumber hukum negara.',
        cognitiveLevel: 'L2 (Penerapan)',
        questionType: 'PG',
        stemText: 'Pancasila berkedudukan sebagai "Staatsfundamentalnorm" atau norma dasar negara yang menjiwai seluruh batang tubuh konstitusi dan peraturan perundangan. Makna Pancasila sebagai dasar negara adalah...',
        options: {
          a: 'Sebagai pedoman dalam penyelenggaraan tata kelola negara dan pemerintahan',
          b: 'Hanya sebagai lambang formal kenegaraan tanpa konsekuensi hukum',
          c: 'Sebagai slogan politik untuk kampanye pemilihan umum',
          d: 'Sebagai aturan yang hanya mengikat para menteri dan pejabat negara',
        },
        keyAnswer: 'A',
        scoringGuide: 'Jawaban benar skor 2, salah skor 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-8.1.B',
        tpTitle: 'Mengamalkan nilai Pancasila dalam pergaulan era digital',
        elementName: 'Pancasila',
        indicator: 'Disajikan studi kasus penyebaran hoaks di media sosial, peserta didik dapat menerapkan nilai Pancasila dan nalar kritis.',
        cognitiveLevel: 'L3 (Penalaran/HOTS)',
        questionType: 'PG',
        stemText: 'Di era media sosial saat ini, sering beredar informasi yang memuat ujaran kebencian bernuansa SARA yang dapat memecah belah persaudaraan sebangsa. Perilaku seorang pelajar yang mencerminkan pengamalan Sila Ketiga Pancasila saat menerima pesan tersebut adalah...',
        options: {
          a: 'Langsung membagikan ulang pesan tersebut ke grup chat kelas agar viral',
          b: 'Melakukan verifikasi/cek fakta, tidak membagikan berita hoaks, dan mengedukasi rekan untuk menjaga kerukunan',
          c: 'Membalas komentar dengan kata-kata kasar yang memancing pertengkaran',
          d: 'Mengabaikan tanpa peduli bahaya perpecahan bagi masyarakat sekitar',
        },
        keyAnswer: 'B',
        scoringGuide: 'Jawaban benar skor 2, salah skor 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-8.1.C',
        tpTitle: 'Merumuskan aksi nyata pengamalan 5 sila Pancasila',
        elementName: 'Pancasila',
        indicator: 'Disajikan tabel analisis pengamalan nilai sila 1 sampai 5 di sekolah, peserta didik dapat merumuskan contoh konkret pengamalan.',
        cognitiveLevel: 'L3 (Penalaran/HOTS)',
        questionType: 'URAIAN',
        stemText: 'Pancasila bukan sekadar hafalan teks semata, melainkan panduan bertindak (ideologi kerja) dalam kehidupan nyata.\n\nBerikan 1 (satu) contoh nyata pengamalan masing-masing Sila ke-1 sampai Sila ke-5 Pancasila yang dapat kalian lakukan dalam lingkungan SMP!',
        keyAnswer: 'Sila 1: Menghormati teman yang sedang beribadah/berdoa sebelum belajar.\nSila 2: Tidak melakukan perundungan (bullying) dan menolong teman yang kesusahan.\nSila 3: Menjaga kerukunan dan kerja bakti membersihkan lingkungan kelas.\nSila 4: Memilih ketua OSIS/kelas secara musyawarah dan demokratis.\nSila 5: Bersikap adil dalam pembagian tugas kelompok dan menghargai karya teman.',
        scoringGuide: 'Skor 10: Menyebutkan 5 contoh pengamalan sila secara tepat dan operasional.\nSkor 8: Menyebutkan 4 contoh.\nSkor 6: Menyebutkan 3 contoh.\nSkor 4: Menyebutkan 2 contoh.\nSkor 2: Menyebutkan 1 contoh.',
        maxScore: 10,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // KELAS 9 - BAB 1: HUBUNGAN PANCASILA DENGAN UUD NRI 1945 (SEM 1)
  // ═══════════════════════════════════════════════════════════════════
  {
    babId: 'bab-1-pkn-9',
    babNumber: 1,
    classGrade: 'IX',
    semester: 1,
    babTitle: 'Bab I: Hubungan Pancasila dan UUD NRI Tahun 1945',
    questions: [
      {
        tpCode: 'TP-9.1.A',
        tpTitle: 'Menelaah hubungan kausal-organis antara Pembukaan UUD 1945 dan Pancasila',
        elementName: 'Pancasila & UUD NRI 1945',
        indicator: 'Disajikan teks alinea ke-4 Pembukaan UUD 1945, peserta didik dapat menyimpulkan hubungan yuridis-konstitusional antara Pancasila dan pasal-pasal UUD 1945.',
        cognitiveLevel: 'L2 (Penerapan)',
        questionType: 'PG',
        stemText: 'Pancasila termaktub secara resmi dalam Alinea Keempat Pembukaan UUD NRI Tahun 1945. Hubungan antara Pembukaan UUD 1945 dengan pasal-pasal UUD 1945 adalah...',
        options: {
          a: 'Pasal-pasal UUD 1945 merupakan penjabaran terperinci dari pokok-pokok pikiran yang bersumber dari Pancasila',
          b: 'Pembukaan UUD 1945 dapat diubah kapan saja oleh Mahkamah Konstitusi',
          c: 'Pasal-pasal UUD 1945 tidak memiliki keterikatan dengan Pembukaan UUD 1945',
          d: 'Pembukaan UUD 1945 hanya berfungsi sebagai pengantar dokumen sejarah kemerdekaan',
        },
        keyAnswer: 'A',
        scoringGuide: 'Jawaban benar skor 2, salah skor 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-9.1.B',
        tpTitle: 'Menganalisis perwujudan hak dan kewajiban warga negara',
        elementName: 'UUD NRI 1945',
        indicator: 'Disajikan pasal 27 ayat (3) dan pasal 30 ayat (1) UUD 1945, peserta didik dapat menelaah partisipasi bela negara di kalangan pelajar.',
        cognitiveLevel: 'L3 (Penalaran/HOTS)',
        questionType: 'PG',
        stemText: 'Pasal 27 ayat (3) UUD NRI Tahun 1945 menyatakan bahwa "Setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara". Bentuk partisipasi bela negara yang paling tepat dan esensial bagi seorang murid SMP adalah...',
        options: {
          a: 'Mengikuti wajib militer dan mengangkat senjata di perbatasan',
          b: 'Belajar dengan sungguh-sungguh, berprestasi, menjaga nama baik bangsa, serta menaati hukum dan tata tertib',
          c: 'Melakukan demonstrasi anarkis untuk menuntut fasilitas sekolah gratis',
          d: 'Menutup diri dari pergaulan dunia internasional karena takut terpengaruh budaya asing',
        },
        keyAnswer: 'B',
        scoringGuide: 'Jawaban benar skor 2, salah skor 0.',
        maxScore: 2,
      },
      {
        tpCode: 'TP-9.1.C',
        tpTitle: 'Mengevaluasi tantangan penerapan Pancasila di era globalisasi',
        elementName: 'Pancasila',
        indicator: 'Disajikan narasi fenomena individualisme dan konsumerisme di kalangan generasi muda, peserta didik dapat menyusun strategi pencegahan berbasis kearifan lokal.',
        cognitiveLevel: 'L3 (Penalaran/HOTS)',
        questionType: 'URAIAN',
        stemText: 'Arus globalisasi dan kemajuan teknologi membawa tantangan berupa gaya hidup individualistis, konsumerisme, dan pudarnya semangat gotong royong di kalangan sebagian generasi muda.\n\n1. Jelaskan mengapa gaya hidup individualis bertentangan dengan jati diri Pancasila!\n2. Rumuskan 3 (tiga) program kegiatan sekolah yang dapat membangkitkan kembali semangat gotong royong dan kepedulian sosial peserta didik!',
        keyAnswer: '1. Karena bangsa Indonesia adalah bangsa komunal religius yang menjunjung tinggi kebersamaan dan tolong-menolong (Sila 2, 3, dan 5).\n2. Program: Gerakan Jumat Bersih & Sedekah Berbagi, Proyek Kolaborasi P5 Bank Sampah, dan Program Teman Asuh Tutor Sebaya.',
        scoringGuide: 'Skor 10: Analisis filosofis tepat dan 3 program sekolah sangat inovatif dan realistis.\nSkor 7: Analisis tepat dan 2 program realistis.\nSkor 4: Analisis cukup dan 1 program.\nSkor 0: Tidak menjawab.',
        maxScore: 10,
      },
    ],
  },
];

export function getAuthenticQuestionsForClass(
  classGrade: 'VII' | 'VIII' | 'IX',
  semester: 1 | 2,
  assessmentType: AssessmentType,
  selectedBabId?: string
): QuestionCardItem[] {
  let matchedBabs = authenticPancasilaQuestionBank.filter(
    (b) => b.classGrade === classGrade && (assessmentType === 'SAS' ? true : b.semester === semester)
  );

  if (selectedBabId && selectedBabId !== 'all') {
    const specific = matchedBabs.filter((b) => b.babId === selectedBabId);
    if (specific.length > 0) matchedBabs = specific;
  }

  const result: QuestionCardItem[] = [];
  let num = 1;

  matchedBabs.forEach((b) => {
    b.questions.forEach((q) => {
      result.push({
        id: `auth_q_${num}_${b.babNumber}`,
        number: num,
        ...q,
      });
      num++;
    });
  });

  return result;
}
