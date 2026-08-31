import type {
  BukuSiswaSubBab,
  BukuSiswaBab,
  LKPDVariation,
} from '../../../../data/bukuSiswaData';
import type {
  CompleteLkpdPackage,
  LkpdActivityType,
  LkpdActivityModelOption,
  LkpdQuestion,
  LkpdRubricCriterion,
  LkpdReflectionDetail,
} from '../types';

/**
 * Pilihan Ragam Model Aktivitas LKPD Berbasis Kurikulum Merdeka
 */
export const LKPD_ACTIVITY_OPTIONS: Record<LkpdActivityType, LkpdActivityModelOption> = {
  studi_kasus: {
    id: 'studi_kasus',
    title: 'Studi Kasus Kontekstual & Pemecahan Masalah',
    shortLabel: 'Studi Kasus',
    badge: 'Analisis Masalah Kontekstual',
    iconName: 'FileText',
    description: 'Menelaah fenomena/dilema nyata dalam kehidupan sehari-hari dan merumuskan solusi berbasis Tujuan Pembelajaran.',
    colorClass: 'bg-blue-50 text-blue-800 border-blue-300',
  },
  komparasi: {
    id: 'komparasi',
    title: 'Telaah Kritis & Matriks Komparasi Konseptual',
    shortLabel: 'Matriks Komparasi',
    badge: 'Telaah & Komparasi Kritis',
    iconName: 'Table',
    description: 'Menganalisis perbandingan fakta, gagasan tokoh, norma, atau konsep penting pada buku teks.',
    colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  },
  proyek_kreatif: {
    id: 'proyek_kreatif',
    title: 'Rancangan Aksi Nyata & Proyek Gotong Royong',
    shortLabel: 'Proyek Aksi Nyata',
    badge: 'Aksi Nyata & Gotong Royong',
    iconName: 'Compass',
    description: 'Menyusun tahapan rencana aksi kolaboratif untuk mengamalkan nilai pembelajaran di sekolah/masyarakat.',
    colorClass: 'bg-purple-50 text-purple-800 border-purple-300',
  },
  observasi_wawancara: {
    id: 'observasi_wawancara',
    title: 'Observasi Lingkungan & Wawancara Investigatif',
    shortLabel: 'Observasi Lingkungan',
    badge: 'Investigasi Lapangan',
    iconName: 'Search',
    description: 'Mengamati penerapan materi di lingkungan sekolah atau masyarakat dan menghimpun temuan faktual.',
    colorClass: 'bg-amber-50 text-amber-800 border-amber-300',
  },
  refleksi_komitmen: {
    id: 'refleksi_komitmen',
    title: 'Internalisasi Nilai Karakter & Ikrar Komitmen Diri',
    shortLabel: 'Refleksi & Komitmen',
    badge: 'Internalisasi Karakter P3',
    iconName: 'Heart',
    description: 'Mendalami pemahaman bermakna, mengevaluasi diri, dan merumuskan komitmen tindakan nyata.',
    colorClass: 'bg-rose-50 text-rose-800 border-rose-300',
  },
  analisis_konsep: {
    id: 'analisis_konsep',
    title: 'Penyelidikan Konsep Esensial & Penalaran Bertingkat',
    shortLabel: 'Analisis Konsep',
    badge: 'Penalaran Konseptual (HOTS)',
    iconName: 'Layers',
    description: 'Eksplorasi mendalam konsep buku teks melalui pertanyaan bertingkat (identifikasi, analisis, sintesis).',
    colorClass: 'bg-slate-50 text-slate-800 border-slate-300',
  },
};

/**
 * Helper untuk menyusun narasi studi kasus yang kontekstual dan spesifik dengan materi
 */
function buildContextualCaseStudy(
  cleanTitle: string,
  elementName: string,
  pages: string,
  subBab: BukuSiswaSubBab
): { title: string; narrative: string; hint: string } {
  const lowerTitle = cleanTitle.toLowerCase();
  const lowerElem = (elementName || '').toLowerCase();

  if (lowerTitle.includes('sejarah') || lowerTitle.includes('kelahiran pancasila') || lowerTitle.includes('awal') || lowerTitle.includes('bpupk')) {
    return {
      title: `Studi Kasus Keteladanan Pendiri Bangsa: "Musyawarah Mufakat di Tengah Perbedaan"`,
      narrative: `Dalam proses perumusan dasar negara pada sidang BPUPK dan PPKI, para tokoh pendiri bangsa (seperti Moh. Yamin, Soepomo, dan Ir. Soekarno) memiliki latar belakang daerah, agama, dan pandangan yang berbeda. Namun, mereka menempatkan persatuan bangsa dan keutuhan NKRI di atas kepentingan pribadi atau golongan.\n\nDalam kehidupan saat ini di sekolah, sering kali muncul perdebatan sengit saat musyawarah pemilihan ketua kelas atau pembagian tugas kelompok, di mana sebagian peserta didik memaksakan kehendak atau meninggalkan kelompok saat pendapatnya tidak disetujui.`,
      hint: `Bandingkan sikap kebesaran jiwa para pendiri bangsa pada Buku Siswa (${pages}) dengan fenomena pergaulan di sekolahmu saat ini.`,
    };
  }

  if (lowerTitle.includes('norma') || lowerTitle.includes('hukum') || lowerTitle.includes('uud') || lowerElem.includes('undang-undang')) {
    return {
      title: `Studi Kasus Kesadaran Hukum & Norma: "Dilema Kedisiplinan dan Etika Bermedia Sosial"`,
      narrative: `Di era digital saat ini, marak terjadi fenomena di mana norma kesopanan dan kesusilaan diabaikan di media sosial. Beberapa peserta didik menganggap komentar menyindir, menyebarkan foto teman tanpa izin, atau melanggar tata tertib sekolah sebagai hal sepele karena 'hanya bercanda' dan tidak diawasi langsung oleh guru.\n\nPadahal, norma dan aturan hukum dibuat bukan untuk mengekang kebebasan, melainkan untuk menciptakan keteraturan, keadilan, dan rasa aman bagi setiap warga negara sebagaimana diatur dalam UUD NRI Tahun 1945.`,
      hint: `Identifikasikan jenis norma yang dilanggar dan bagaimana sanksi sosial maupun hukum dapat ditegakkan secara adil berdasarkan Buku Siswa (${pages}).`,
    };
  }

  if (lowerTitle.includes('kebinekaan') || lowerTitle.includes('keragaman') || lowerTitle.includes('suku') || lowerTitle.includes('agama') || lowerElem.includes('bhinneka')) {
    return {
      title: `Studi Kasus Harmoni Kebinekaan: "Mencegah Stereotip & Mempererat Toleransi di Sekolah"`,
      narrative: `Di sebuah SMP yang memiliki murid dari beragam suku (Melayu, Jawa, Batak, Minang, Tionghoa) dan latar belakang agama, terbentuk kelompok-kelompok pergaulan eksklusif yang hanya mau berteman dengan sesama latar belakang daerahnya. Hal ini sempat memicu kesalahpahaman dan prasangka antarkelompok saat kerja bakti sekolah.\n\nPrinsip Bhinneka Tunggal Ika mengajarkan bahwa perbedaan suku dan budaya adalah kekayaan bangsa yang harus dirawat dengan sikap saling menghargai (toleransi) dan keterbukaan.`,
      hint: `Gunakan konsep keragaman budaya dan nilai kearifan lokal pada Buku Siswa (${pages}) untuk merumuskan langkah pemersatu yang merangkul semua pihak.`,
    };
  }

  if (lowerTitle.includes('wilayah') || lowerTitle.includes('nkri') || lowerTitle.includes('kedaulatan') || lowerElem.includes('negara kesatuan')) {
    return {
      title: `Studi Kasus Bela Negara & Cinta Tanah Air: "Menjaga Keutuhan dan Martabat Bangsa"`,
      narrative: `Menjaga keutuhan Negara Kesatuan Republik Indonesia (NKRI) bukan hanya tugas aparat keamanan, melainkan tanggung jawab seluruh warga negara termasuk generasi muda. Di tengah derasnya arus globalisasi, sebagian generasi muda mulai kehilangan kebanggaan terhadap produk dalam negeri, acuh terhadap sejarah bangsa, serta mudah terprovokasi informasi palsu (hoaks) yang memecah belah.\n\nBerdasarkan materi Buku Siswa (${pages}), bela negara di lingkungan sekolah dapat diwujudkan melalui prestasi belajar, kerukunan, dan kepedulian terhadap lingkungan sekitar.`,
      hint: `Telaah bentuk ancaman non-militer di era modern dan temukan aksi nyata siswa SMP dalam menjaga keutuhan NKRI.`,
    };
  }

  // General Contextual Fallback
  return {
    title: `Studi Kasus Kontekstual Penerapan Nilai: "${cleanTitle}"`,
    narrative: `Dalam kehidupan bermasyarakat dan bersekolah, sering dijumpai dinamika sosial di mana pemahaman dan pengamalan nilai "${cleanTitle}" sangat dibutuhkan untuk memecahkan persoalan sehari-hari. Ketika warga sekolah atau masyarakat saling bekerjasama, menghormati hak orang lain, dan mengedepankan musyawarah, tercipta suasana yang damai dan produktif.\n\nNamun, tantangan seperti sikap individualisme, kurangnya kedisiplinan, dan ketidakpedulian terhadap aturan bersama masih kerap terjadi dan memerlukan komitmen perbaikan bersama.`,
    hint: `Hubungkan fenomena nyata di atas dengan konsep esensial pada Buku Siswa (${pages}) dan Tujuan Pembelajaran.`,
  };
}

/**
 * Generator Utama LKPD Berbasis Konteks Buku Teks & Tujuan Pembelajaran
 */
export function generateLkpdFromTextbookContext(
  subBab: BukuSiswaSubBab,
  bab: { semester: 1 | 2; elemen: string; title?: string; babNumber?: number },
  selectedClass: 'VII' | 'VIII' | 'IX',
  selectedActivityType: LkpdActivityType = 'studi_kasus',
  overrideMeetingNumber?: number,
  subjectName: string = 'Pendidikan Pancasila'
): CompleteLkpdPackage {
  const cleanTitle = subBab.title.replace(/^Sub-Bab\s+[A-Z]:\s*/i, '');
  const pages = subBab.pages || 'Buku Siswa';
  const meetingNumber =
    overrideMeetingNumber ||
    parseInt((subBab.code || '1').replace(/[^0-9]/g, '')) ||
    1;

  const activityConfig = LKPD_ACTIVITY_OPTIONS[selectedActivityType] || LKPD_ACTIVITY_OPTIONS.studi_kasus;
  const caseStudyContext = buildContextualCaseStudy(cleanTitle, bab.elemen, pages, subBab);

  // 1. STIMULUS TEKS KONTEKSTUAL (Berdasarkan Topik & Konteks Buku Siswa)
  const stimulusTitle = `C. WACANA PEMANTIK & STIMULUS KONTEKSTUAL: "${cleanTitle.toUpperCase()}"`;
  
  let stimulusNarrative = `Materi pembelajaran "${cleanTitle}" pada Buku Siswa ${subjectName} Kelas ${selectedClass} (${pages}) mengkaji pemahaman mendasar mengenai:\n\n"${subBab.pemahamanBermakna || 'Penerapan nilai dan konsep materi pembelajaran dalam memecahkan masalah kehidupan nyata serta memperkuat karakter dan persatuan.'}"\n\nUntuk mengawali penyelidikan, cermati pertanyaan pemantik berikut:\n${(subBab.pertanyaanPemantik && subBab.pertanyaanPemantik.length > 0)
    ? subBab.pertanyaanPemantik.map((q, i) => `${i + 1}. ${q}`).join('\n')
    : `1. Mengapa pemahaman tentang ${cleanTitle} sangat penting bagi kehidupan kita sebagai warga negara?\n2. Bagaimana kita dapat mempraktikkan nilai-nilai tersebut di lingkungan sekolah dan pergaulan sehari-hari?`}`;

  // 2. PETUNJUK & LANGKAH-LANGKAH AKTIVITAS
  const activityStepsTitle = `D. LANGKAH-LANGKAH AKTIVITAS BELAJAR (${activityConfig.badge.toUpperCase()})`;
  
  let activitySteps: string[] = [
    `Pelajari uraian materi "${cleanTitle}" pada Buku Siswa ${subjectName} Kelas ${selectedClass} (${pages}).`,
    `Diskusikan wacana pemantik dan tujuan pembelajaran bersama rekan sekelompok secara aktif, santun, dan terbuka.`,
    `Kerjakan seluruh instruksi dan instrumen lembar aktivitas di bawah ini secara kolaboratif.`,
    `Rumuskan kesimpulan pemahaman bermakna dan buatlah komitmen aksi nyata sesuai capaian pembelajaran.`,
    `Persiapkan diri untuk mempresentasikan hasil temuan kelompok dan saling memberikan tanggapan apresiatif.`,
  ];

  // 3. GENERASI PERTANYAAN / INSTRUMEN AKTIVITAS SESUAI MODEL AKTIVITAS TERPILIH
  let questions: LkpdQuestion[] = [];
  const baseQuestions = subBab.lkpdQuestions && subBab.lkpdQuestions.length > 0
    ? subBab.lkpdQuestions
    : [
        `Identifikasikan fakta, konsep kunci, atau peristiwa penting terkait "${cleanTitle}" berdasarkan Buku Siswa hal. ${pages}!`,
        `Analisislah bagaimana prinsip dan nilai dalam "${cleanTitle}" dapat diterapkan untuk mengatasi permasalahan di lingkungan sekitar!`,
        `Rumuskan 2 aksi nyata yang dapat dilakukan oleh peserta didik untuk mengamalkan materi pembelajaran ini secara berkelanjutan!`,
      ];

  if (selectedActivityType === 'studi_kasus') {
    questions = [
      {
        id: 'q_case_1',
        type: 'case_study',
        questionText: `Telaah Kasus Kontekstual: ${caseStudyContext.title}`,
        caseStudyTitle: caseStudyContext.title,
        caseStudyNarrative: caseStudyContext.narrative,
        guideHint: caseStudyContext.hint,
      },
      {
        id: 'q_case_2',
        type: 'essay',
        questionText: `Berdasarkan narasi kasus di atas dan materi Buku Siswa (${pages}), analisislah apa yang menjadi akar penyebab permasalahan dan mengapa hal itu bertentangan dengan nilai ${bab.elemen || 'Pancasila'}?`,
        guideHint: `Hubungkan secara kritis dengan Tujuan Pembelajaran: "${subBab.tujuanPembelajaran || cleanTitle}".`,
        sentenceStarter: `Menurut analisis kelompok kami, akar penyebab persoalan tersebut adalah... karena...`,
      },
      {
        id: 'q_case_3',
        type: 'essay',
        questionText: `Rumuskan solusi konkret dan adil yang dapat dilakukan oleh pihak-pihak terkait (siswa, guru, sekolah/keluarga) dengan mengedepankan nilai musyawarah dan gotong royong!`,
        guideHint: `Sajikan langkah-langkah sistematis yang realistis dan dapat diterapkan langsung.`,
        sentenceStarter: `Rekomendasi solusi terpadu yang kami tawarkan meliputi: 1) ... 2) ...`,
      },
      {
        id: 'q_case_4',
        type: 'essay',
        questionText: `Sebagai peserta didik yang berkarakter Pelajar Pancasila, keteladanan dan komitmen nyata apa yang akan kalian terapkan di kelas agar permasalahan serupa tidak terjadi?`,
        guideHint: `Tuliskan komitmen perilaku spesifik yang dapat dipantau dan dievaluasi bersama teman sebangku/sekelas.`,
        sentenceStarter: `Komitmen nyata yang akan kami budayakan mulai hari ini adalah...`,
      },
    ];
  } else if (selectedActivityType === 'komparasi') {
    questions = [
      {
        id: 'q_comp_1',
        type: 'matrix_table',
        questionText: `Matriks Telaah & Komparasi Kritis: Analisis Multi-Dimensi Materi "${cleanTitle}"`,
        guideHint: `Kaji Buku Siswa (${pages}). Analisislah perbandingan dimensi konsep teoritis dengan tantangan realitas di lapangan dan solusi aksi nyatanya.`,
        tableHeaders: ['No', 'Aspek / Dimensi Kajian', 'Konsep & Fakta Buku Teks', 'Tantangan Realitas di Lapangan', 'Solusi & Penerapan Nyata Siswa'],
        tableRows: [
          {
            aspect: `1. Pemahaman Konseptual (${cleanTitle})`,
            cells: [
              `Konsep kunci dan nilai dasar yang termaktub dalam Buku Siswa hal. ${pages}.`,
              `Adanya kesenjangan antara pengetahuan teori dan kebiasaan sehari-hari peserta didik.`,
              `Menumbuhkan pembiasaan positif melalui keteladanan dan saling mengingatkan secara santun.`
            ],
            helperHint: 'Gunakan baris ini sebagai model acuan alur berpikir analitis.',
          },
          {
            aspect: `2. Penerapan dalam Interaksi Sosial di Sekolah`,
            cells: ['', '', ''],
            helperHint: 'Diskusikan contoh konkret di kelas, kantin, atau pergaulan ekstrakurikuler saat ini.',
          },
          {
            aspect: `3. Peran Peserta Didik dalam Merawat Persatuan & Karakter Bangsa`,
            cells: ['', '', ''],
            helperHint: 'Uraikan aksi nyata yang dapat kalian lakukan bersama teman kelompok.',
          },
        ],
      },
      {
        id: 'q_comp_2',
        type: 'essay',
        questionText: `Berdasarkan perbandingan pada matriks di atas, apa kesimpulan utama yang kelompok kalian peroleh mengenai pentingnya mengamalkan materi "${cleanTitle}"?`,
        guideHint: `Kaitkan kesimpulan dengan Tujuan Pembelajaran yang ingin dicapai.`,
        sentenceStarter: `Berdasarkan telaah komparasi di atas, kami menyimpulkan bahwa...`,
      },
      {
        id: 'q_comp_3',
        type: 'essay',
        questionText: `Faktor pendorong utama apa yang paling menentukan agar keselarasan antara nilai materi buku teks dan perilaku nyata dapat terwujud di sekolah kita?`,
        sentenceStarter: `Faktor pendorong yang paling menentukan menurut kelompok kami adalah...`,
      },
    ];
  } else if (selectedActivityType === 'proyek_kreatif') {
    questions = [
      {
        id: 'q_proj_1',
        type: 'action_plan',
        questionText: `Matriks Rancangan Aksi Nyata & Proyek Gotong Royong: Mengamalkan Nilai "${cleanTitle}"`,
        guideHint: `Rancanglah sebuah aksi kolaboratif sederhana (misal: kampanye poster positif, aksi peduli kelas/lingkungan, deklarasi anti-perundungan, atau mading tema kebinekaan) yang dapat dilaksanakan bersama.`,
        actionPlanSteps: [
          {
            tahap: '1. Perencanaan & Pembagian Peran',
            rencanaKegiatan: `Menentukan gagasan tema aksi terkait ${cleanTitle}, menetapkan tujuan, dan membagi tugas setiap anggota.`,
            pelaksana: 'Seluruh Anggota Kelompok',
            targetHasil: 'Proposal rancangan kegiatan & pembagian peran tertulis rapi.',
          },
          {
            tahap: '2. Pelaksanaan Aksi di Lingkungan Sekolah',
            rencanaKegiatan: `Melaksanakan kegiatan aksi nyata secara gotong royong, tertib, dan saling mendukung.`,
            pelaksana: 'Tim Pelaksana Aksi Kelompok',
            targetHasil: 'Aksi terlaksana dengan dokumentasi foto/karya nyata.',
          },
          {
            tahap: '3. Evaluasi, Refleksi & Tindak Lanjut',
            rencanaKegiatan: `Mengevaluasi dampak kegiatan bagi warga sekolah dan merumuskan langkah keberlanjutan.`,
            pelaksana: 'Ketua & Notulis Kelompok',
            targetHasil: 'Laporan refleksi singkat & komitmen keberlanjutan aksi.',
          },
        ],
      },
      {
        id: 'q_proj_2',
        type: 'essay',
        questionText: `Bagaimana rancangan proyek kelompokmu dapat menginspirasi teman-teman lain di sekolah untuk memahami dan mempraktikkan "${cleanTitle}"?`,
        guideHint: `Jelaskan media komunikasi atau cara penyampaian pesan yang kelompok gunakan agar menarik dan efektif.`,
        sentenceStarter: `Melalui proyek aksi nyata ini, pesan yang ingin kami sebarkan adalah...`,
      },
      {
        id: 'q_proj_3',
        type: 'essay',
        questionText: `Kendala apa yang paling mungkin dihadapi saat menjalankan rencana aksi ini dan bagaimana strategi kelompok untuk mengatasinya secara bermusyawarah?`,
        sentenceStarter: `Strategi kami dalam mengantisipasi kendala adalah...`,
      },
    ];
  } else if (selectedActivityType === 'observasi_wawancara') {
    questions = [
      {
        id: 'q_obs_1',
        type: 'matrix_table',
        questionText: `Lembar Observasi Investigatif: Pengamatan Fakta Penerapan Nilai "${cleanTitle}" di Lingkungan Sekolah`,
        guideHint: `Lakukan pengamatan cermat di area sekolah (ruang kelas, kantin, perpustakaan, lapangan) mengenai bagaimana nilai-nilai materi dipraktikkan.`,
        tableHeaders: ['No', 'Objek / Situasi yang Diamati', 'Fakta Faktual Hasil Pengamatan', 'Kesesuaian dengan Nilai TP', 'Rekomendasi Perbaikan / Apresiasi'],
        tableRows: [
          {
            aspect: '1. Interaksi Antarsiswa saat Jam Istirahat / Diskusi',
            cells: [
              'Mengamati cara siswa saling berkomunikasi, menghargai perbedaan latar belakang, dan bersikap santun.',
              'Mayoritas siswa berinteraksi ramah, namun terkadang masih terdengar candaan bernada mengejek.',
              'Meningkatkan sosialisasi budaya saling menghargai dan melarang segala bentuk perkataan kasar.'
            ],
            helperHint: 'Contoh pengamatan objektif.',
          },
          {
            aspect: '2. Kepatuhan terhadap Aturan & Tanggung Jawab Bersama',
            cells: ['', '', ''],
            helperHint: 'Amati pelaksanaan piket kebersihan, ketertiban antre di kantin, atau pemanfaatan fasilitas.',
          },
          {
            aspect: '3. Kepedulian Sosial & Semangat Tolong Menolong',
            cells: ['', '', ''],
            helperHint: 'Amati kepekaan membantu teman yang kesulitan belajar atau sedang tertimpa musibah.',
          },
        ],
      },
      {
        id: 'q_obs_2',
        type: 'essay',
        questionText: `Berdasarkan data fakta hasil pengamatan di atas, aspek mana yang sudah menjadi budaya positif di sekolah dan aspek mana yang paling mendesak untuk dibenahi?`,
        sentenceStarter: `Budaya positif yang sudah berjalan baik yaitu... Sedangkan aspek yang perlu pembenahan segera adalah...`,
      },
      {
        id: 'q_obs_3',
        type: 'essay',
        questionText: `Usulan inovatif apa yang dapat kelompok kalian sampaikan kepada pengurus OSIS atau pihak sekolah untuk memperkuat pengamalan nilai tersebut?`,
        sentenceStarter: `Usulan inovatif yang kami rekomendasikan adalah...`,
      },
    ];
  } else if (selectedActivityType === 'refleksi_komitmen') {
    questions = [
      {
        id: 'q_ref_1',
        type: 'essay',
        questionText: `Makna dan Nilai Luhur Pembelajaran: Apa pemahaman paling bermakna (*big idea*) yang kalian peroleh setelah mendalami materi "${cleanTitle}" pada Buku Siswa hal. ${pages}?`,
        guideHint: `Jelaskan dengan bahasa sendiri bagaimana konsep ini memperkaya wawasan moral dan kewarganegaraanmu.`,
        sentenceStarter: `Pemahaman paling berharga yang saya peroleh adalah...`,
      },
      {
        id: 'q_ref_2',
        type: 'essay',
        questionText: `Evaluasi Diri & Introspeksi: Sejauh mana kalian telah menerapkan nilai-nilai "${cleanTitle}" dalam pergaulan sehari-hari? Berikan 1 contoh perilaku terpuji yang sudah rutin dilakukan dan 1 perilaku yang masih perlu diperbaiki!`,
        guideHint: `Tuliskan secara jujur dan objektif sebagai bahan refleksi kematangan karakter pribadi.`,
        sentenceStarter: `Hal baik yang sudah saya biasakan adalah... sedangkan hal yang masih harus saya perbaiki adalah...`,
      },
      {
        id: 'q_ref_3',
        type: 'essay',
        questionText: `Ikrar Komitmen Karakter: Rumuskan sebuah ikrar/komitmen bersama seluruh anggota kelompok untuk menjadi teladan pengamalan Profil Pelajar Pancasila di lingkungan sekolah!`,
        guideHint: `Buat kalimat ikrar yang tegas, bersemangat, dan dapat dipertanggungjawabkan dalam tindakan nyata harian.`,
        sentenceStarter: `Kami berikrar dengan sungguh-sungguh untuk: 1) ... 2) ... 3) ...`,
      },
    ];
  } else {
    // Default Analisis Konsep (LOTS ke HOTS)
    questions = [
      {
        id: 'q_ana_1',
        type: 'essay',
        questionText: `Pemahaman Konsep Kunci (LOTS - Mengidentifikasi): Jelaskan gagasan pokok, istilah penting, dan peristiwa penting yang dibahas dalam sub-bab "${cleanTitle}" berdasarkan Buku Siswa hal. ${pages}!`,
        guideHint: `Identifikasi minimal 3 konsep esensial dan jelaskan artinya dengan kalimat kalian sendiri.`,
        sentenceStarter: `Konsep-konsep esensial yang kami temukan meliputi: 1) ... 2) ... 3) ...`,
      },
      {
        id: 'q_ana_2',
        type: 'essay',
        questionText: `Analisis Kritis & Hubungan Kausalitas (HOTS - Menganalisis): Analisislah bagaimana penguasaan konsep "${cleanTitle}" berhubungan erat dengan pembentukan karakter Pelajar Pancasila yang bernalar kritis, mandiri, dan bergotong royong!`,
        guideHint: `Uraikan alasan mengapa konsep ini menjadi pondasi penting dalam kehidupan berbangsa dan bernegara.`,
        sentenceStarter: `Hubungan mendasar antara materi ini dengan pembentukan karakter Pelajar Pancasila adalah...`,
      },
      {
        id: 'q_ana_3',
        type: 'essay',
        questionText: `Sintesis & Solusi Kontekstual (HOTS - Mencipta Solusi): Bagaimana penerapan praktis dari konsep tersebut dalam mengatasi dilema nyata yang sering dihadapi oleh remaja di lingkungan masyarakat saat ini?`,
        guideHint: `Berikan contoh kasus nyata beserta langkah penyelesaian yang solutif dan berkeadilan.`,
        sentenceStarter: `Penerapan solutif yang dapat kita lakukan dalam kehidupan nyata adalah...`,
      },
    ];
  }

  // 4. REFLEKSI KETERCAPAIAN TUJUAN PEMBELAJARAN
  const reflectionDetail: LkpdReflectionDetail = {
    tpMasteryCheck: [
      `Saya memahami konsep esensial dan fakta penting dalam materi "${cleanTitle}".`,
      `Saya mampu menganalisis permasalahan kontekstual menggunakan prinsip materi pembelajaran secara kritis.`,
      `Saya aktif berkolaborasi dan menghargai pendapat rekan sekelompok selama proses diskusi.`,
      `Saya siap mengamalkan nilai karakter Profil Pelajar Pancasila dalam tindakan nyata sehari-hari.`,
    ],
    meaningfulInsight: subBab.pemahamanBermakna || `Materi "${cleanTitle}" memberikan bekal moral dan wawasan kewarganegaraan untuk menjadi pribadi yang berintegritas, mandiri, dan berkontribusi bagi kemajuan bangsa.`,
    characterCommitment: `Menjadi peserta didik yang berakhlak mulia, disiplin, menghargai kebinekaan, mengutamakan musyawarah, dan gemar bergotong royong di lingkungan sekolah maupun masyarakat.`,
  };

  const reflectionQuestions = [
    `Setelah menyelesaikan seluruh lembar aktivitas ini, apakah kalian telah mencapai Tujuan Pembelajaran "${subBab.tujuanPembelajaran || cleanTitle}"? Jelaskan bukti konkret hasil belajarmu!`,
    `Tantangan apa yang paling berkesan saat berdiskusi dan bagaimana cara kelompok kalian menyelesaikannya secara bermusyawarah dan demokratis?`,
    `Satu tindakan konkret apa yang akan langsung kalian terapkan besok pagi di sekolah sebagai wujud nyata hasil pembelajaran hari ini?`,
  ];

  // 5. RUBRIK PENILAIAN OTENTIK KETERCAPAIAN TUJUAN PEMBELAJARAN
  const rubricCriteria: LkpdRubricCriterion[] = [
    {
      aspect: `Penguasaan Konsep Buku Teks (${cleanTitle})`,
      score4: 'Mampu menjelaskan seluruh konsep esensial materi secara komprehensif, tepat, dan didukung rujukan fakta buku teks yang sangat akurat.',
      score3: 'Mampu menjelaskan konsep materi dengan tepat dan menggunakan rujukan fakta buku teks yang relevan.',
      score2: 'Menjelaskan konsep materi cukup tepat, namun pemanfaatan fakta buku teks masih terbatas.',
      score1: 'Penjelasan konsep materi masih kurang tepat dan belum mencerminkan pemahaman isi buku teks.',
    },
    {
      aspect: 'Kedalaman Penalaran & Analisis Kritis (HOTS)',
      score4: 'Mampu membedah masalah secara mendalam, kritis, menyajikan argumen logis, dan merumuskan solusi orisinal yang aplikatif.',
      score3: 'Mampu menganalisis masalah dengan baik, argumen terstruktur, dan solusinya relevan dengan konteks materi.',
      score2: 'Analisis masalah masih bersifat umum atau normatif, solusi belum terperinci.',
      score1: 'Belum mampu melakukan analisis kritis terhadap permasalahan yang disajikan.',
    },
    {
      aspect: 'Kolaborasi & Nilai Profil Pelajar Pancasila',
      score4: 'Sangat aktif berdiskusi, demokratis, saling menghargai gagasan, dan pembagian tugas kelompok sangat merata dan adil.',
      score3: 'Aktif berdiskusi dan bekerja sama dengan baik dalam menyelesaikan tugas kelompok.',
      score2: 'Cukup berpartisipasi, namun proses diskusi masih didominasi oleh segelintir anggota.',
      score1: 'Kurang terlibat aktif dalam kerja sama kelompok atau pasif selama pembelajaran.',
    },
    {
      aspect: 'Kualitas Refleksi & Komitmen Aksi Nyata (Ketercapaian TP)',
      score4: 'Merumuskan sintesis refleksi dengan sangat mendalam, jujur, serta rencana aksi nyata sangat konkret dan terukur.',
      score3: 'Merumuskan refleksi dengan jelas dan menyertakan komitmen tindakan nyata yang terarah.',
      score2: 'Refleksi masih normatif dan rencana aksi nyata belum terperinci secara jelas.',
      score1: 'Belum menuliskan refleksi atau komitmen tindakan nyata yang dapat dievaluasi.',
    },
  ];

  return {
    title: `LKPD Pertemuan ${meetingNumber}: ${cleanTitle}`,
    meetingNumber,
    timeAllocation: subBab.alokasiWaktu || '2 x 40 Menit (1 Pertemuan)',
    targetClass: selectedClass,
    semester: bab.semester,
    subjectId: subjectName.toLowerCase().replace(/\s+/g, '-'),
    subjectName,
    elementName: bab.elemen || 'Pendidikan Pancasila',
    tpCode: `TP.${selectedClass}.${subBab.code || '1.1'}`,
    tpTitle: subBab.tujuanPembelajaran || `Peserta didik mampu menganalisis konsep ${cleanTitle} serta mengamalkan nilai-nilainya dalam kehidupan sehari-hari.`,
    pemahamanBermakna: subBab.pemahamanBermakna || `Pemahaman mendalam mengenai ${cleanTitle} sebagai landasan bersikap dan bertindak secara bertanggung jawab.`,
    pertanyaanPemantik: subBab.pertanyaanPemantik || [
      `Mengapa materi ${cleanTitle} penting untuk dipelajari?`,
      `Bagaimana kita menerapkannya dalam kehidupan sehari-hari?`,
    ],
    p5Dimensions: subBab.p3Dimensions || [
      'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
      'Bernalar Kritis',
      'Gotong Royong',
      'Berkebinekaan Global',
    ],
    toolsAndMaterials: `Buku Siswa ${subjectName} Kelas ${selectedClass} (${pages}), Alat Tulis, Lembar Kerja Siswa`,
    generalInstructions: subBab.lkpdInstructions || [
      'Berdoalah terlebih dahulu bersama seluruh anggota kelompok sebelum memulai kegiatan belajar.',
      `Pelajari uraian materi ${cleanTitle} pada Buku Siswa Kemendikbudristek RI (${pages}).`,
      'Diskusikan setiap pertanyaan dan tugas aktivitas bersama rekan sekelompok secara santun, aktif, dan demokratis.',
      'Tuliskan hasil analisis, komparasi, atau rancangan aksi kelompok pada lembar kerja yang tersedia.',
      'Rumuskan refleksi pembelajaran dan persiapkan perwakilan kelompok untuk mempresentasikan hasil diskusi.',
    ],
    stimulusTitle,
    stimulusText: stimulusNarrative,
    activityType: selectedActivityType,
    activityBadge: activityConfig.badge,
    activityStepsTitle,
    activitySteps,
    questionsTitle: `E. INSTRUMEN AKTIVITAS PENYELIDIKAN: ${activityConfig.title.toUpperCase()}`,
    questions,
    reflectionQuestions,
    reflectionDetail,
    rubricCriteria,
  };
}
