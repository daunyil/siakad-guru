export interface LKPDVariation {
  id: string;
  type: 'studi_kasus' | 'komparasi' | 'proyek_kreatif' | 'observasi_wawancara' | 'refleksi_komitmen';
  badge: string; // e.g. 'Studi Kasus Kontekstual', 'Proyek Infografis & Mind Map', etc.
  title: string;
  instructions: string[];
  questions: string[];
  targetRubrik?: {
    kriteria: string;
    skor4: string; // Sangat Baik
    skor3: string; // Baik
    skor2: string; // Cukup
    skor1: string; // Perlu Bimbingan
  }[];
}

export interface BukuSiswaSubBab {
  id: string;
  code: string; // e.g. '1.A', '1.B', '2.A'
  title: string;
  pages: string; // e.g. 'Hal. 1 - 10'
  alokasiWaktu: string; // e.g. '2 x 40 Menit (Pertemuan 1)'
  modelPembelajaran: string;
  tujuanPembelajaran: string;
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  p3Dimensions: string[];
  sarpras: string;
  kegiatanAwal: string;
  kegiatanInti: string;
  kegiatanPenutup: string;
  asesmenDiagnostik: string;
  asesmenFormatif: string;
  asesmenSumatif: string;
  remedial: string;
  pengayaan: string;
  lkpdTitle: string;
  lkpdInstructions: string[];
  lkpdQuestions: string[];
  lkpdVariations?: LKPDVariation[];
  glosarium: string;
  daftarPustaka: string;
}

export interface BukuSiswaBab {
  id: string;
  babNumber: number;
  semester: 1 | 2;
  title: string;
  description: string;
  elemen: string;
  subBabList: BukuSiswaSubBab[];
}

export interface BukuSiswaSubject {
  id: string;
  subjectName: string;
  classGrade: 'VII' | 'VIII' | 'IX';
  bookTitle: string;
  authorPublisher: string;
  isbn: string;
  babList: BukuSiswaBab[];
}

export function resolveLkpdVariations(subBab: BukuSiswaSubBab): LKPDVariation[] {
  if (subBab.lkpdVariations && subBab.lkpdVariations.length > 0) {
    return subBab.lkpdVariations;
  }

  const q1 = subBab.lkpdQuestions?.[0] || `Identifikasikan 2 fakta atau permasalahan penting terkait ${subBab.title}!`;
  const q2 = subBab.lkpdQuestions?.[1] || `Analisis bagaimana prinsip atau nilai pada ${subBab.title} dapat diterapkan dalam menyelesaikan masalah tersebut!`;
  const q3 = subBab.lkpdQuestions?.[2] || `Rumuskan 2 aksi nyata yang dapat dilakukan oleh peserta didik di sekolah atau lingkungan sekitar!`;

  return [
    {
      id: `${subBab.id}-var-studi-kasus`,
      type: 'studi_kasus',
      badge: 'Studi Kasus Kontekstual',
      title: `LKPD Studi Kasus: Analisis Kasus Riil & Solusi Terkait ${subBab.title.replace(/^Sub-Bab\s+[A-Z]:\s*/i, '')}`,
      instructions: [
        `Bacalah materi ${subBab.title} pada Buku Siswa ${subBab.pages} dengan teliti.`,
        `Amati dan diskusikan bersama rekan sekelompok mengenai fenomena/kasus nyata terkait materi ini.`,
        `Tuliskan analisis dan rumusan solusi pemecahan masalah pada lembar jawaban yang tersedia.`
      ],
      questions: [
        q1,
        q2,
        q3
      ],
      targetRubrik: [
        {
          kriteria: 'Kedalaman Analisis Kasus',
          skor4: 'Mampu menganalisis masalah secara kritis, logis, komprehensif, dan menyertakan argumentasi kontekstual yang kuat.',
          skor3: 'Mampu menganalisis masalah dengan tepat dan sistematis sesuai materi buku teks.',
          skor2: 'Menganalisis masalah secara umum dan masih memerlukan bimbingan guru.',
          skor1: 'Belum mampu mengidentifikasi esensi masalah dengan benar.'
        },
        {
          kriteria: 'Relevansi Solusi & Nilai Pancasila',
          skor4: 'Merumuskan rekomendasi solusi yang sangat orisinal, realistis, dan berlandaskan Profil Pelajar Pancasila.',
          skor3: 'Merumuskan rekomendasi solusi yang baik dan dapat diterapkan.',
          skor2: 'Merumuskan solusi namun masih bersifat teoritis.',
          skor1: 'Belum merumuskan solusi konkret.'
        }
      ]
    },
    {
      id: `${subBab.id}-var-komparasi`,
      type: 'komparasi',
      badge: 'Matriks Komparasi & Telaah',
      title: `LKPD Komparasi: Matriks Perbandingan & Telaah Konseptual ${subBab.title.replace(/^Sub-Bab\s+[A-Z]:\s*/i, '')}`,
      instructions: [
        `Pelajari uraian konsep esensial pada Buku Siswa ${subBab.pages}.`,
        `Bandingkan sudut pandang, peristiwa sejarah, norma, atau penerapan aturan dalam tabel analisis kelompok.`,
        `Rumuskan kesimpulan komparatif secara musyawarah dan bertanggung jawab.`
      ],
      questions: [
        `Bandingkan persamaan dan perbedaan aspek utama yang dibahas pada ${subBab.title}!`,
        `Analisislah faktor pendorong dan tantangan dalam mengimplementasikan nilai-nilai tersebut di era saat ini!`,
        `Simpulkan pesan inti pembelajaran ini bagi penguatan karakter dan persatuan bangsa!`
      ],
      targetRubrik: [
        {
          kriteria: 'Kelengkapan & Ketajaman Tabel Komparasi',
          skor4: 'Tabel terisi lengkap dengan analisis perbandingan yang tajam, berbasis data dan fakta akurat.',
          skor3: 'Tabel terisi lengkap dengan perbandingan konsep yang benar.',
          skor2: 'Tabel terisi sebagian dengan penjelasan yang masih ringkas.',
          skor1: 'Tabel belum terisi dengan sistematis.'
        }
      ]
    },
    {
      id: `${subBab.id}-var-proyek`,
      type: 'proyek_kreatif',
      badge: 'Proyek Kampanye & Infografis',
      title: `LKPD Proyek Kreatif: Desain Media Edukasi / Infografis Aksi Nyata ${subBab.title.replace(/^Sub-Bab\s+[A-Z]:\s*/i, '')}`,
      instructions: [
        `Rancanglah media kreatif (infografis / mind map / poster gagasan) bersama kelompok.`,
        `Sematkan poin-poin penting materi ${subBab.title} dan ajakan aksi positif bagi peserta didik.`,
        `Presentasikan hasil karya kelompok secara bergantian di hadapan kelas.`
      ],
      questions: [
        `Gambarkan diagram alur atau sketsa infografis yang memvisualisasikan esensi materi ini!`,
        `Buatlah 1 slogan / kalimat ajakan yang kuat untuk mengedukasi generasi muda!`,
        `Jelaskan pesan moral yang ingin disampaikan kelompok melalui media kreatif ini!`
      ],
      targetRubrik: [
        {
          kriteria: 'Kreativitas & Daya Tarik Visual',
          skor4: 'Desain karya sangat komunikatif, inovatif, rapi, dan pesan materi tersampaikan dengan sangat kuat.',
          skor3: 'Desain karya menarik, rapi, dan memuat pesan materi dengan jelas.',
          skor2: 'Desain karya cukup baik namun informasi masih belum lengkap.',
          skor1: 'Karya belum selesai dan pesan materi belum terlihat.'
        }
      ]
    }
  ];
}

import { bukuSiswaKelas8Pancasila } from './bukuSiswaKelas8Data';
import { bukuSiswaKelas9Pancasila } from './bukuSiswaKelas9Data';

export const masterBukuSiswaData: BukuSiswaSubject[] = [
  {
    id: 'buku-pancasila-7',
    subjectName: 'Pendidikan Pancasila',
    classGrade: 'VII',
    bookTitle: 'Buku Panduan Guru dan Buku Siswa Pendidikan Pancasila SMP Kelas VII',
    authorPublisher: 'Kemendikbudristek RI - Pusat Perbukuan / BSKAP (Edisi Kurikulum Merdeka)',
    isbn: '978-602-244-887-7',
    babList: [
      // ══════════════════════════════════════════════════════════════
      // BAB 1: SEJARAH KELAHIRAN PANCASILA (SEMESTER 1)
      // ══════════════════════════════════════════════════════════════
      {
        id: 'bab-1-pkn-7',
        babNumber: 1,
        semester: 1,
        title: 'Bab I: Sejarah Kelahiran Pancasila',
        description: 'Membahas akar sejarah nilai-nilai ketuhanan, kemanusiaan, persatuan, kerakyatan, dan keadilan sejak masa awal sejarah Nusantara hingga sidang BPUPK dan PPKI.',
        elemen: 'Pancasila',
        subBabList: [
          {
            id: 'sub-1a',
            code: '1.A',
            title: 'Sub-Bab A: Latar Sejarah Kelahiran Pancasila',
            pages: 'Hal. 1 – 9',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-1)',
            modelPembelajaran: 'Discovery Learning & Diskusi Kelompok',
            tujuanPembelajaran: 'Menganalisis latar sejarah awal dan nilai-nilai kearifan lokal masa kemaharajaan Nusantara (Sriwijaya, Majapahit) serta masa penjajahan sebagai cikal bakal nilai Pancasila.',
            pemahamanBermakna: 'Nilai-nilai luhur Pancasila (ketuhanan, kemanusiaan, gotong royong, dan keadilan) telah lama hidup dan dipraktikkan oleh nenek moyang bangsa Indonesia jauh sebelum Indonesia merdeka.',
            pertanyaanPemantik: [
              'Mengapa nilai-nilai Pancasila dikatakan digali dari bumi pertiwi Indonesia sendiri?',
              'Bagaimana perikehidupan masyarakat Nusantara masa lampau mencerminkan nilai ketuhanan dan persatuan?',
              'Apa dampak penjajahan terhadap timbulnya rasa senasib sepenanggungan para pejuang bangsa?'
            ],
            p3Dimensions: ['Beriman & Bertakwa kepada Tuhan YME', 'Berkebinekaan Global', 'Bernalar Kritis'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 1-9, Peta Wilayah Nusantara Kuno, Video Dokumenter Sejarah, LCD Proyektor, LKPD.',
            kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Guru memberi salam hangat, memimpin doa bersama, dan mengecek presensi serta kesiapan belajar murid.\n2. Apersepsi & Motivasi (5 Menit):\n   - Guru menampilkan gambar Candi Borobudur, Candi Prambanan, dan Prasasti Talang Tuwo melalui proyektor/buku.\n   - Guru mengajukan pertanyaan pemantik: "Apa bukti nyata bahwa nenek moyang kita adalah bangsa yang religius, gotong royong, dan toleran?"\n3. Penyampaian Tujuan & Kontrak Belajar (3 Menit):\n   - Guru menyampaikan Tujuan Pembelajaran Sub-Bab A, skema kerja kelompok, serta rubrik penilaian.',
            kegiatanInti: `Fase 1: Pemberian Rangsangan / Stimulation (10 Menit)
• Aktivitas Guru:
  - Guru menayangkan peta wilayah kemaharajaan Nusantara (Sriwijaya dan Majapahit) serta kutipan Kitab Sutasoma karya Mpu Tantular pada Buku Siswa Hal. 4.
  - Guru memandu murid mengamati pembabakan sejarah: Masa Awal (Zaman Praaksara/Tradisi Lisan), Masa Kerajaan Nusantara, dan Masa Penjajahan Bangsa Barat.
• Aktivitas Peserta Didik (Diferensiasi Konten):
  - Murid dengan profil belajar visual mencermati peta dan infografis linimasa sejarah pada Buku Siswa Hal. 3–5.
  - Murid dengan profil belajar auditori menyimak narasi singkat guru tentang nilai gotong royong bahari kerajaan Sriwijaya.

Fase 2: Identifikasi Masalah / Problem Statement (10 Menit)
• Aktivitas Guru:
  - Guru membagi murid ke dalam kelompok heterogen (4-5 murid per kelompok) dan membagikan Lembar Kerja Peserta Didik (LKPD 1.A).
  - Guru membimbing murid merumuskan pertanyaan kritis: "Bagaimana nilai-nilai luhur ketuhanan, kemanusiaan, persatuan, dan keadilan dipraktikkan pada masa kerajaan kuno dan bertahan melewati masa penjajahan?"
• Aktivitas Peserta Didik:
  - Setiap kelompok memilih fokus telaah: (a) Jejak Nilai Ketuhanan & Kemanusiaan di Sriwijaya/Majapahit, atau (b) Kebangkitan Nilai Persatuan Menghadapi Penjajahan Belanda & Jepang.
  - Murid menuliskan rumusan hipotesis awal pada LKPD.

Fase 3: Pengumpulan Data / Data Collection (15 Menit)
• Aktivitas Guru (Diferensiasi Proses / Scaffolding):
  - Guru berkeliling memberikan bimbingan berjenjang (scaffolding): kelompok yang membutuhkan bimbingan dituntun menemukan kata kunci pada teks Buku Siswa Hal. 2–8, sedangkan kelompok mandiri diarahkan membandingkan 2 prasasti/peristiwa sejarah.
• Aktivitas Peserta Didik:
  - Murid membaca secara intensif Buku Siswa Hal. 2–8, mencari data fakta sejarah:
    1. Bukti nilai religius dan toleransi di Nalanda & Candi Plaosan.
    2. Konsep Bhinneka Tunggal Ika Tan Hana Dharma Mangrwa dari Kitab Sutasoma.
    3. Perlawanan Sultan Hasanuddin, Pangeran Diponegoro, Pattimura, dan Cut Nyak Dien yang menyatukan tekad kemerdekaan.
  - Murid mencatat dan mengorganisasikan data ke dalam matriks "5 Jejak Sila Pancasila di Masa Lampau".

Fase 4: Pengolahan Data & Pembuktian / Data Processing & Verification (10 Menit)
• Aktivitas Guru:
  - Guru memantau jalannya diskusi, memastikan seluruh anggota berkontribusi (4C: Collaboration & Critical Thinking).
• Aktivitas Peserta Didik (Diferensiasi Produk):
  - Kelompok mengkaji kebenaran data dan menyusun hasil telaah. Kelompok dapat menyajikan dalam bentuk tabel isian LKPD, mind-mapping kronologi sejarah, atau infografis diagram alur singkat sesuai minat kelompok.

Fase 5: Menarik Kesimpulan & Presentasi / Generalization (10 Menit)
• Aktivitas Guru:
  - Guru memfasilitasi presentasi silang antarkelompok dan memberikan umpan balik formatif.
• Aktivitas Peserta Didik:
  - Perwakilan 2 kelompok mempresentasikan hasil temuannya di depan kelas (4C: Communication).
  - Kelompok lain menyimak secara aktif dan memberikan apresiasi serta tanggapan konstruktif.
  - Bersama guru, murid merumuskan kesimpulan bahwa Pancasila bukan tiruan budaya asing, melainkan mutiara nilai yang digali dari kepribadian asli bangsa Nusantara.`,
            kegiatanPenutup: '1. Refleksi Terbimbing (5 Menit):\n   - Murid menjawab lembar refleksi 3-2-1: (3 hal baru yang dipahami, 2 hal yang menarik, 1 sikap keteladanan yang akan dipraktikkan).\n2. Penguatan & Apresiasi (3 Menit):\n   - Guru memberikan umpan balik positif terhadap partisipasi dan kolaborasi aktif seluruh murid.\n3. Tindak Lanjut & Penutup (2 Menit):\n   - Guru menginformasikan topik pertemuan ke-2: "Sub-Bab B: Kelahiran Pancasila (Sidang BPUPK 29 Mei - 1 Juni 1945)".\n   - Berdoa bersama dan salam penutup.',
            asesmenDiagnostik: 'Kuis lisan pemantik tentang nama-nama kerajaan besar di nusantara dan peninggalan toleransi beragama.',
            asesmenFormatif: 'Observasi keaktifan diskusi kelompok, Lembar Kerja Peserta Didik (LKPD Aktivitas 1.1 Tabel Telusur Sejarah), dan penilaian presentasi.',
            asesmenSumatif: 'Uji Pemahaman Soal Pilihan Ganda & Uraian Sub-Bab A Buku Siswa.',
            remedial: 'Membaca ulang ringkasan kronologi sejarah kerajaan nusantara dan membuat peta pikiran (mind map) sederhana.',
            pengayaan: 'Menulis artikel mini (1 halaman) tentang jejak diplomasi dan toleransi di daerah setempat pada masa lampau.',
            lkpdTitle: 'LKPD 1.A: Jejak Nilai Luhur Bangsa pada Masa Awal Sejarah Nusantara',
            lkpdInstructions: [
              'Bacalah uraian materi Latar Sejarah Kelahiran Pancasila pada Buku Siswa Halaman 2–8.',
              'Diskusikan bersama rekan sekelompok mengenai jejak nilai-nilai ketuhanan, persatuan, dan keadilan.',
              'Lengkapi tabel analisis peninggalan sejarah di bawah ini dengan tepat!'
            ],
            lkpdQuestions: [
              'Tuliskan 2 bukti peninggalan sejarah pada masa Sriwijaya atau Majapahit yang mencerminkan kerukunan antarumat beragama!',
              'Jelaskan bagaimana penderitaan akibat penjajahan menumbuhkan persatuan dan tekad bersama untuk merdeka!',
              'Apa hubungan antara semboyan "Bhinneka Tunggal Ika" dalam Kitab Sutasoma karya Mpu Tantular dengan persatuan bangsa saat ini?'
            ],
            lkpdVariations: [
              {
                id: 'lkpd-1a-studi-kasus',
                type: 'studi_kasus',
                badge: 'Studi Kasus Kontekstual',
                title: 'LKPD 1.A-1: Analisis Nilai Ketuhanan & Toleransi Kerajaan Kuno Nusantara',
                instructions: [
                  'Bacalah narasi prasasti Talang Tuwo dan Candi Plaosan pada Buku Siswa Hal. 4–6.',
                  'Lakukan bedah kasus bersama kelompok mengenai bagaimana toleransi antarumat Buddha dan Hindu dipraktikkan berdampingan.',
                  'Tuliskan rumusan solusi pencegahan intoleransi di sekolah berkaca pada sejarah bangsa.'
                ],
                questions: [
                  'Identifikasikan 2 bukti otentik peradaban nusantara yang menunjukkan toleransi tinggi antarpemeluk keyakinan yang berbeda!',
                  'Mengapa persaudaraan dan gotong royong maritim Sriwijaya mampu menyatukan berbagai suku di kepulauan nusantara?',
                  'Bagaimana cara mengaplikasikan semangat toleransi Candi Plaosan dalam pergaulan di kelas kita saat ini?'
                ],
                targetRubrik: [
                  {
                    kriteria: 'Kedalaman Analisis Sejarah',
                    skor4: 'Menjelaskan 2+ bukti sejarah lengkap dengan data kontekstual yang sangat akurat.',
                    skor3: 'Menjelaskan 2 bukti sejarah dengan benar dan runtut.',
                    skor2: 'Menjelaskan 1 bukti sejarah namun uraian masih sangat umum.',
                    skor1: 'Belum mampu menunjukkan bukti sejarah yang relevan.'
                  },
                  {
                    kriteria: 'Relevansi Solusi Toleransi',
                    skor4: 'Merumuskan 3 aksi nyata toleransi di sekolah yang sangat orisinal dan logis.',
                    skor3: 'Merumuskan 2 aksi nyata toleransi yang realistis.',
                    skor2: 'Merumuskan 1 aksi toleransi yang bersifat umum.',
                    skor1: 'Belum merumuskan aksi nyata secara konkret.'
                  }
                ]
              },
              {
                id: 'lkpd-1a-komparasi',
                type: 'komparasi',
                badge: 'Matriks Komparasi',
                title: 'LKPD 1.A-2: Matriks Perbandingan Karakter Bangsa Masa Kerajaan vs Masa Penjajahan',
                instructions: [
                  'Pelajari linimasa sejarah peradaban pada Buku Siswa Hal. 3–8.',
                  'Bandingkan faktor pendorong persatuan pada masa kemakmuran kerajaan dengan faktor kebangkitan persatuan melawan penjajah.',
                  'Susun sintesis dalam bentuk tabel komparasi dua zaman.'
                ],
                questions: [
                  'Bandingkan pemicu persatuan bangsa: Apakah lebih dominan ikatan budaya maritim atau rasa senasib sepenanggungan?',
                  'Analisislah taktik adu domba (Devide et Impera) penjajah dan mengapa persatuan menjadi senjata terkuat bangsa Indonesia!',
                  'Simpulkan mengapa nilai Pancasila adalah jati diri orisinal bangsa Indonesia, bukan pemberian negara penjajah!'
                ],
                targetRubrik: [
                  {
                    kriteria: 'Kelengkapan Tabel Komparasi',
                    skor4: 'Tabel terisi lengkap dengan analisis perbandingan tajam dan berbasis fakta.',
                    skor3: 'Tabel terisi lengkap dengan perbandingan yang tepat.',
                    skor2: 'Tabel terisi sebagian dengan penjelasan singkat.',
                    skor1: 'Tabel belum terisi secara runtut.'
                  }
                ]
              },
              {
                id: 'lkpd-1a-proyek',
                type: 'proyek_kreatif',
                badge: 'Proyek Infografis & Mind Map',
                title: 'LKPD 1.A-3: Desain Infografis Kronologi 5 Nilai Pancasila Pra-Kemerdekaan',
                instructions: [
                  'Gunakan kertas plano/lembar kerja untuk menggambar infografis linimasa sejarah.',
                  'Sematkan 5 pilar nilai (Ketuhanan, Kemanusiaan, Persatuan, Kerakyatan, Keadilan) pada era Sriwijaya, Majapahit, dan Pergerakan Nasional.',
                  'Presentasikan infografis kreatif di hadapan teman sekelas.'
                ],
                questions: [
                  'Gambarkan simbol/ikon kreatif untuk masing-masing pilar nilai sejarah nusantara!',
                  'Tuliskan kutipan inspiratif dari tokoh sejarah lokal yang memperkuat persatuan bangsa!',
                  'Jelaskan pesan moral utama yang ingin disampaikan kelompok melalui karya infografis ini!'
                ],
                targetRubrik: [
                  {
                    kriteria: 'Kreativitas & Estetika Infografis',
                    skor4: 'Visualisasi sangat komunikatif, tata letak rapi, pesan sejarah sangat kuat.',
                    skor3: 'Visualisasi menarik, rapi, dan memuat 5 pilar nilai dengan jelas.',
                    skor2: 'Visualisasi cukup baik namun informasi masih belum lengkap.',
                    skor1: 'Infografis kurang rapi dan belum memuat nilai utama.'
                  }
                ]
              }
            ],
            glosarium: 'Pancasila: Dasar negara Indonesia; Sriwijaya: Kemaharajaan bahari di Sumatera; Majapahit: Kerajaan besar di Jawa Timur bersemboyan Bhinneka Tunggal Ika; Prasasti: Piagam tertulis di batu masa lampau.',
            daftarPustaka: 'Zaim, M., dkk. (2021). Buku Panduan Guru dan Siswa Pendidikan Pancasila SMP Kelas VII. Jakarta: Pusat Kurikulum dan Perbukuan Kemendikbudristek RI.'
          },
          {
            id: 'sub-1b',
            code: '1.B',
            title: 'Sub-Bab B: Kelahiran Pancasila (Sidang BPUPK & Pidato Sukarno)',
            pages: 'Hal. 10 – 16',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-2)',
            modelPembelajaran: 'Problem Based Learning (PBL) & Model Jigsaw',
            tujuanPembelajaran: 'Menganalisis proses pembentukan BPUPK, jalannya Sidang Pertama BPUPK (29 Mei – 1 Juni 1945), serta gagasan para tokoh pendiri bangsa (Moh. Yamin, Soepomo, dan Ir. Sukarno) tentang dasar negara.',
            pemahamanBermakna: 'Perumusan dasar negara merupakan buah pemikiran mendalam, kebijaksanaan, dan dialog demokratis para pendiri bangsa yang mengutamakan kepentingan persatuan Indonesia di atas segalanya.',
            pertanyaanPemantik: [
              'Mengapa tanggal 1 Juni ditetapkan sebagai Hari Lahir Pancasila?',
              'Apa saja usulan gagasan dasar negara yang disampaikan oleh Moh. Yamin, Soepomo, dan Ir. Sukarno?',
              'Nilai keteladanan apa yang dapat kita petik dari sikap para tokoh bangsa saat berdebat di ruang sidang BPUPK?'
            ],
            p3Dimensions: ['Bernalar Kritis', 'Gotong Royong', 'Mandiri'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 10-16, Transkrip Pidato 1 Juni 1945 Bung Karno, Foto Tokoh BPUPK, LKPD Aktivitas 1.2.',
            kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Guru menyapa siswa, memimpin doa pembuka, dan memeriksa presensi serta kerapian ruang kelas.\n2. Apersepsi Audio-Visual (5 Menit):\n   - Guru memutarkan audio cuplikan pidato Bung Karno: "Negara Indonesia yang kita dirikan adalah negara semua buat semua, bukan buat satu orang, bukan buat satu golongan!"\n   - Guru mengajukan pertanyaan pemantik: "Di gedung manakah pidato bersejarah ini disampaikan dan mengapa momentum 1 Juni 1945 begitu monumental?"\n3. Penyampaian Alur Pembelajaran (3 Menit):\n   - Guru menjelaskan alur diskusi Jigsaw kelompok ahli dan lembar kerja komparasi dasar negara.',
            kegiatanInti: `Fase 1: Orientasi Peserta Didik pada Masalah (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan konteks sejarah pembentukan BPUPK (Dokuritsu Zyunbi Tyoosakai) pada 29 April 1945 oleh dr. K.R.T. Radjiman Wedyodiningrat yang mengajukan pertanyaan kunci: "Apa dasar negara Indonesia yang akan kita bentuk?"
  - Guru menampilkan potret tiga tokoh sentral perumus dasar negara: Mr. Mohammad Yamin, Prof. Dr. Soepomo, dan Ir. Sukarno.
• Aktivitas Peserta Didik:
  - Murid mengamati tayangan dan membaca pengantar Sidang Pertama BPUPK pada Buku Siswa Hal. 10–12.
  - Murid mengidentifikasi rumusan masalah: "Bagaimana titik temu dan perbedaan perspektif dari gagasan ketiga tokoh tersebut?"

Fase 2: Mengorganisasikan Peserta Didik untuk Belajar (10 Menit)
• Aktivitas Guru:
  - Guru membagi kelas ke dalam "Kelompok Asal" beranggotakan 3-4 murid, lalu membagi murid ke dalam 3 "Kelompok Ahli":
    1. Kelompok Ahli 1: Mengkaji pidato Mr. Mohammad Yamin (29 Mei 1945).
    2. Kelompok Ahli 2: Mengkaji pidato Prof. Dr. Soepomo (31 Mei 1945) tentang paham Negara Integralistik.
    3. Kelompok Ahli 3: Mengkaji pidato Ir. Sukarno (1 Juni 1945) tentang philosophische grondslag dan penamaan Pancasila.
• Aktivitas Peserta Didik:
  - Murid berpindah ke Kelompok Ahli masing-masing dan membuka Buku Siswa Hal. 12–15 serta naskah transkrip yang disediakan.

Fase 3: Membimbing Penyelidikan Kelompok Ahli (15 Menit)
• Aktivitas Guru (Scaffolding & Fasilitasi):
  - Guru membimbing Kelompok Ahli 1 dalam membedakan usulan lisan vs usulan tertulis Moh. Yamin.
  - Guru mendampingi Kelompok Ahli 2 memahami makna filosofis "Negara Persatuan Organik/Integralistik" Soepomo.
  - Guru mendampingi Kelompok Ahli 3 menganalisis 5 prinsip Bung Karno (Kebangsaan, Internasionalisme/Peri-Kemanusiaan, Mufakat/Demokrasi, Kesejahteraan Sosial, Ketuhanan).
• Aktivitas Peserta Didik:
  - Anggota Kelompok Ahli berdiskusi intensif, mencatat inti gagasan, latar belakang pemikiran tokoh, dan nilai keteladanannya ke dalam lembar catatan ahli.

Fase 4: Mengembangkan dan Menyajikan Hasil Karya (Model Jigsaw) (15 Menit)
• Aktivitas Guru:
  - Guru menginstruksikan murid kembali ke "Kelompok Asal" dan memandu giliran berbagi informasi.
• Aktivitas Peserta Didik (4C: Communication & Collaboration):
  - Setiap ahli secara bergantian menjelaskan materi keahliannya kepada rekan di Kelompok Asal.
  - Kelompok Asal menyusun tabel komparasi komprehensif pada LKPD 1.B: membandingkan tanggal pidato, butir sila, dan istilah pokok ketiga tokoh bangsa.

Fase 5: Menganalisis dan Mengevaluasi Proses Pemecahan Masalah (10 Menit)
• Aktivitas Guru:
  - Guru meluruskan miskonsepsi dan menegaskan bahwa perbedaan usulan adalah kekayaan intelektual para pendiri bangsa yang disatukan oleh komitmen kemerdekaan.
• Aktivitas Peserta Didik:
  - Murid membuat simpulan bersama mengenai alasan pidato Ir. Sukarno 1 Juni 1945 diterima bulat sebagai hari lahir istilah Pancasila.`,
            kegiatanPenutup: '1. Rangkuman & Refleksi (5 Menit):\n   - Murid bersama guru menyimpulkan keteladanan sikap saling menghormati perbedaan pendapat para tokoh BPUPK.\n2. Asesmen Singkat (3 Menit):\n   - Kuis kilat 3 butir soal pemahaman dasar negara.\n3. Rencana Pertemuan Berikutnya (2 Menit):\n   - Membaca Sub-Bab C: Perumusan Pancasila (Panitia Sembilan & Piagam Jakarta 22 Juni 1945).\n   - Doa penutup dan salam.',
            asesmenDiagnostik: 'Tanya jawab singkat tentang latar belakang pembentukan BPUPK oleh dr. K.R.T. Radjiman Wedyodiningrat.',
            asesmenFormatif: 'Penilaian lembar perbandingan gagasan dasar negara dan rubrik observasi musyawarah kelompok.',
            asesmenSumatif: 'Tes tertulis analisis perbandingan rumusan dasar negara para pendiri bangsa.',
            remedial: 'Membuat tabel komparasi 3 usulan tokoh bangsa (Moh. Yamin, Soepomo, Sukarno) secara terstruktur.',
            pengayaan: 'Membaca naskah asli Pidato 1 Juni 1945 dan membuat resensi 2 paragraf tentang konsep kebangsaan.',
            lkpdTitle: 'LKPD 1.B: Komparasi Gagasan Dasar Negara Tokoh Pendiri Bangsa BPUPK',
            lkpdInstructions: [
              'Bacalah uraian Sidang BPUPK Pertama pada Buku Siswa Halaman 10–15.',
              'Bandingkan rumusan dasar negara yang diusulkan oleh Mr. Mohammad Yamin, Prof. Dr. Soepomo, dan Ir. Sukarno.',
              'Tuliskan nilai keteladanan yang paling menonjol dari masing-masing tokoh!'
            ],
            lkpdQuestions: [
              'Tuliskan 5 sila yang diusulkan Ir. Sukarno pada tanggal 1 Juni 1945!',
              'Jelaskan konsep "Negara Integralistik" yang disampaikan oleh Prof. Dr. Soepomo dalam sidang BPUPK!',
              'Mengapa para tokoh pendiri bangsa tetap saling menghormati meski memiliki perbedaan pandangan saat sidang?'
            ],
            glosarium: 'BPUPK: Badan Penyelidik Usaha-usaha Persiapan Kemerdekaan; Philosophische Grondslag: Norma filsafat dasar yang mendasari berdirinya sebuah negara; Integralistik: Paham persatuan yang mengikat seluruh rakyat.',
            daftarPustaka: 'Sekretariat Negara RI. (1995). Risalah Sidang BPUPKI dan PPKI 28 Mei 1945 - 22 Agustus 1945. Jakarta: Setneg RI.'
          },
          {
            id: 'sub-1c',
            code: '1.C',
            title: 'Sub-Bab C: Perumusan Pancasila (Panitia Sembilan & Piagam Jakarta)',
            pages: 'Hal. 17 – 23',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-3)',
            modelPembelajaran: 'Problem Based Learning (PBL) & Analisis Dokumen Sejarah',
            tujuanPembelajaran: 'Menelaah peran Panitia Sembilan, perumusan Piagam Jakarta (Jakarta Charter) pada 22 Juni 1945, serta semangat kompromi kebangsaan para tokoh Islam dan Nasionalis.',
            pemahamanBermakna: 'Kecintaan terhadap persatuan bangsa melahirkan Piagam Jakarta sebagai jembatan kesepakatan agung (gentlemen’s agreement) demi terwujudnya kemerdekaan Indonesia.',
            pertanyaanPemantik: [
              'Siapa sajakah anggota Panitia Sembilan yang mewakili golongan kebangsaan dan golongan Islam?',
              'Apa isi rumusan dasar negara dalam Piagam Jakarta pada tanggal 22 Juni 1945?',
              'Mengapa semangat musyawarah mufakat menjadi kunci keberhasilan Panitia Sembilan?'
            ],
            p3Dimensions: ['Gotong Royong', 'Bernalar Kritis', 'Beriman & Bertakwa kepada Tuhan YME'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 17-23, Salinan Naskah Piagam Jakarta, Foto Rumah Bung Karno di Pegangsaan Timur 56, LKPD 1.C.',
            kegiatanAwal: '1. Salam & Doa (5 Menit):\n   - Guru menyapa siswa, memimpin doa, dan memeriksa kehadiran siswa.\n2. Apersepsi Sejarah (5 Menit):\n   - Guru menampilkan foto 9 tokoh anggota Panitia Sembilan yang berkumpul di kediaman Bung Karno, Jalan Pegangsaan Timur No. 56 Jakarta.\n   - Guru bertanya: "Mengapa dibentuk Panitia Kecil beranggotakan 9 orang di masa reses persidangan BPUPK?"\n3. Tujuan & Indikator (3 Menit):\n   - Guru menyampaikan fokus kompetensi: menelaah kompromi luhur Piagam Jakarta.',
            kegiatanInti: `Fase 1: Orientasi Siswa pada Konteks Sejarah (10 Menit)
• Aktivitas Guru:
  - Guru menjelaskan masa jeda (reses) sidang BPUPK dan pembentukan Panitia Delapan yang kemudian disempurnakan menjadi Panitia Sembilan agar komposisi golongan kebangsaan (nasionalis) dan golongan Islam seimbang.
  - Guru menampilkan salinan autentik naskah Piagam Jakarta (Jakarta Charter) tanggal 22 Juni 1945.
• Aktivitas Peserta Didik:
  - Murid membaca pengantar materi pada Buku Siswa Hal. 17–19 dan mencermati susunan 9 tokoh (Ir. Sukarno, Moh. Hatta, A.A. Maramis, Abikoesno Tjokrosoejoso, Abdoel Kahar Moezakir, H. Agus Salim, K.H. Wachid Hasjim, Moh. Yamin, dan Achmad Soebardjo).

Fase 2: Pengorganisasian Kelompok Telaah Dokumen (10 Menit)
• Aktivitas Guru:
  - Guru mengelompokkan murid menjadi 4–5 kelompok dan membagikan LKPD 1.C yang memuat teks Pembukaan UUD (Piagam Jakarta) dan lembar analisis perbandingan.
• Aktivitas Peserta Didik:
  - Murid membagi tugas dalam kelompok: pencatat kronologi, penelaah alinea ke-4 naskah Piagam Jakarta, dan penelaah profil tokoh golongan kebangsaan & Islam.

Fase 3: Penyelidikan & Analisis Naskah Piagam Jakarta (15 Menit)
• Aktivitas Guru (Diferensiasi Proses):
  - Guru membimbing murid menelaah 7 kata kunci sila pertama Piagam Jakarta: "Ketuhanan dengan kewajiban menjalankan syari'at Islam bagi pemeluk-pemeluknya".
  - Guru memberikan pertanyaan penuntun: "Bagaimana para tokoh dengan latar belakang berbeda dapat menyepakati naskah ini tanpa perselisihan yang memecah belah?"
• Aktivitas Peserta Didik (4C: Critical Thinking & Collaboration):
  - Murid menganalisis bahwa Piagam Jakarta merupakan bentuk musyawarah mufakat dan kesepakatan terhormat (gentlemen's agreement).
  - Murid mencatat hasil rumusan 5 dasar negara versi Piagam Jakarta ke dalam lembar kerja.

Fase 4: Penyusunan Laporan & Pemaparan Kelompok (15 Menit)
• Aktivitas Guru:
  - Guru memfasilitasi presentasi interaktif antarkelompok.
• Aktivitas Peserta Didik (4C: Communication):
  - Kelompok memaparkan hasil analisis peran Panitia Sembilan dan membaca naskah Piagam Jakarta dengan intonasi yang khidmat.
  - Kelompok lain menanggapi aspek keteladanan sikap musyawarah para tokoh.

Fase 5: Evaluasi & Refleksi Kebangsaan (10 Menit)
• Aktivitas Guru:
  - Guru menegaskan kembali pentingnya menempatkan persatuan bangsa di atas kepentingan pribadi/golongan, sebagaimana dicontohkan Panitia Sembilan.
• Aktivitas Peserta Didik:
  - Murid menyimpulkan nilai kenegarawanan dan kedewasaan berdemokrasi para pendiri bangsa.`,
            kegiatanPenutup: '1. Rangkuman Pembelajaran (5 Menit):\n   - Murid menggarisbawahi poin penting Piagam Jakarta sebagai cikal bakal Pembukaan UUD 1945.\n2. Refleksi Pribadi (3 Menit):\n   - Menuliskan 1 komitmen untuk selalu mengutamakan musyawarah saat terjadi beda pendapat di kelas.\n3. Doa & Salam (2 Menit).',
            asesmenDiagnostik: 'Menyebutkan nama-nama anggota Panitia Sembilan.',
            asesmenFormatif: 'Lembar kerja analisis teks Piagam Jakarta dan observasi sikap gotong royong.',
            asesmenSumatif: 'Tes uraian peranan Panitia Sembilan dalam sejarah bangsa.',
            remedial: 'Menuliskan kembali 9 nama tokoh anggota Panitia Sembilan dan isi alinea ke-4 Piagam Jakarta.',
            pengayaan: 'Menganalisis biografi singkat salah satu tokoh Panitia Sembilan (misal: Mr. A.A. Maramis atau K.H. Wachid Hasjim).',
            lkpdTitle: 'LKPD 1.C: Telaah Naskah Piagam Jakarta & Panitia Sembilan',
            lkpdInstructions: [
              'Cermati naskah Piagam Jakarta 22 Juni 1945 pada Buku Siswa Hal. 18.',
              'Identifikasi 9 tokoh anggota Panitia Sembilan beserta asal golongannya.',
              'Diskusikan bagaimana proses lahirnya kesepakatan dasar negara tersebut!'
            ],
            lkpdQuestions: [
              'Sebutkan 9 anggota Panitia Sembilan yang merumuskan Piagam Jakarta!',
              'Tuliskan rumusan 5 dasar negara yang termaktub di dalam naskah Piagam Jakarta!',
              'Jelaskan mengapa Piagam Jakarta disebut sebagai jembatan persatuan bangsa Indonesia!'
            ],
            glosarium: 'Piagam Jakarta: Naskah rancangan pembukaan UUD yang dirumuskan 22 Juni 1945; Panitia Sembilan: Panitia kecil bertugas menyusun rancangan dasar negara.',
            daftarPustaka: 'Kusuma, A.B. (2004). Lahirnya Undang-Undang Dasar 1945. Jakarta: Badan Penerbit Fakultas Hukum Universitas Indonesia.'
          },
          {
            id: 'sub-1d',
            code: '1.D',
            title: 'Sub-Bab D: Penetapan Pancasila (Sidang PPKI 18 Agustus 1945)',
            pages: 'Hal. 24 – 32',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-4)',
            modelPembelajaran: 'Role Playing / Simulasi Sidang PPKI & PBL',
            tujuanPembelajaran: 'Menganalisis peristiwa perubahan sila pertama Piagam Jakarta demi keutuhan bangsa pada Sidang PPKI 18 Agustus 1945 serta penetapan Pancasila dan UUD 1945.',
            pemahamanBermakna: 'Ketetapan hati para tokoh Islam (seperti Ki Bagus Hadikusumo, K.H. Wachid Hasjim, Kasman Singodimedjo) menyetujui perubahan sila pertama menjadi "Ketuhanan Yang Maha Esa" adalah bukti cinta tanah air dan persatuan Indonesia yang abadi.',
            pertanyaanPemantik: [
              'Mengapa pada tanggal 18 Agustus 1945 rumusan sila pertama diubah menjadi "Ketuhanan Yang Maha Esa"?',
              'Apa saja 3 keputusan penting Sidang Pertama PPKI pada 18 Agustus 1945?',
              'Bagaimana kita meneladani sikap toleransi dan rela berkorban para pendiri bangsa dalam kehidupan sehari-hari?'
            ],
            p3Dimensions: ['Beriman & Bertakwa kepada Tuhan YME', 'Berkebinekaan Global', 'Gotong Royong'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 24-32, Video Dokumentasi Proklamasi & Sidang PPKI, Naskah Naskah Simulasi, LKPD 1.D.',
            kegiatanAwal: '1. Salam & Doa (5 Menit):\n   - Guru menyapa murid, memimpin doa, dan menyanyikan lagu "Garuda Pancasila" dengan penuh semangat.\n2. Apersepsi Dramatisasi (5 Menit):\n   - Guru menceritakan suasana pagi 18 Agustus 1945 saat Bung Hatta menerima pesan dari opsir Angkatan Laut Jepang mengenai keberatan rakyat Indonesia bagian Timur jika sila pertama tidak diubah.\n3. Guru menjelaskan skenario simulasi sidang PPKI (3 Menit).',
            kegiatanInti: `Fase 1: Orientasi Masalah Kebangsaan Pagi 18 Agustus 1945 (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan situasi kritis pasca Proklamasi 17 Agustus 1945: ancaman perpecahan wilayah Indonesia Timur jika dasar negara memuat klausul khusus satu agama.
  - Guru menguraikan kebesaran jiwa Bung Hatta yang segera menemui 4 tokoh Islam: Ki Bagus Hadikusumo, K.H. Wachid Hasjim, Mr. Kasman Singodimedjo, dan Teuku Moh. Hasan.
• Aktivitas Peserta Didik:
  - Murid membaca kronologi detik-detik musyawarah darurat pada Buku Siswa Hal. 24–27.

Fase 2: Persiapan Role Playing / Simulasi Sidang PPKI (10 Menit)
• Aktivitas Guru:
  - Guru membagikan naskah drama singkat sidang PPKI kepada perwakilan pemeran: (Bung Karno sebagai Ketua PPKI, Bung Hatta sebagai Wakil, Ki Bagus Hadikusumo, Kasman Singodimedjo, dan Radjiman Wedyodiningrat).
  - Murid lainnya berperan sebagai anggota sidang PPKI dan tim pengamat kritis.
• Aktivitas Peserta Didik:
  - Pemeran membaca dan menghayati dialog historis; tim pengamat menyiapkan lembar observasi nilai persatuan pada LKPD 1.D.

Fase 3: Pelaksanaan Simulasi Sidang (15 Menit)
• Aktivitas Guru:
  - Guru bertindak sebagai narator sidang di Gedung Pejambon (sekarang Gedung Pancasila).
• Aktivitas Peserta Didik (4C: Communication, Creativity, Collaboration):
  - Murid memainkan adegan musyawarah Bung Hatta dengan Ki Bagus Hadikusumo yang bersepakat mengganti 7 kata menjadi "Ketuhanan Yang Maha Esa".
  - Adegan berlanjut ke pengesahan 3 keputusan utama Sidang PPKI:
    1. Mengesahkan Pembukaan dan Batang Tubuh UUD 1945 (yang di dalamnya termaktub Pancasila yang sah dan resmi).
    2. Memilih Ir. Sukarno sebagai Presiden dan Drs. Mohammad Hatta sebagai Wakil Presiden RI.
    3. Membentuk Komite Nasional Indonesia Pusat (KNIP) untuk membantu tugas Presiden sebelum terbentuknya MPR/DPR.

Fase 4: Diskusi Hasil Pengamatan & Refleksi Toleransi (15 Menit)
• Aktivitas Guru:
  - Guru memandu diskusi bedah peristiwa: "Mengapa para tokoh rela mengorbankan redaksi awal demi keutuhan NKRI?"
• Aktivitas Peserta Didik (4C: Critical Thinking):
  - Murid menganalisis pengorbanan dan toleransi tanpa pamrih para pendiri bangsa yang menyelamatkan keutuhan dari Sabang sampai Merauke.
  - Murid mencatat 3 keputusan resmi PPKI dan susunan sila Pancasila yang sah secara yuridis-konstitusional.

Fase 5: Penegasan Konsep & Evaluasi (10 Menit)
• Aktivitas Guru:
  - Guru menegaskan bahwa rumusan Pancasila yang sah dan mengikat seluruh bangsa Indonesia adalah rumusan yang tercantum dalam Pembukaan UUD 1945 alinea ke-4 yang disahkan PPKI 18 Agustus 1945.
• Aktivitas Peserta Didik:
  - Murid merumuskan ringkasan materi akhir Bab I pada lembar kesimpulan.`,
            kegiatanPenutup: '1. Evaluasi & Uji Kompetensi Bab I (5 Menit):\n   - Pengerjaan 3 soal esai evaluasi komprehensif Bab I pada Buku Siswa Hal. 30.\n2. Pesan Moral Guru (3 Menit):\n   - Menjaga Pancasila sebagai rumah bersama seluruh suku, agama, dan golongan di Indonesia.\n3. Doa & Salam Penutup (2 Menit).',
            asesmenDiagnostik: 'Kuis tanggal-tanggal bersejarah (29 Mei, 1 Juni, 22 Juni, 17 Agustus, 18 Agustus 1945).',
            asesmenFormatif: 'Penilaian simulasi sidang peran PPKI dan kelengkapan LKPD 1.D.',
            asesmenSumatif: 'Uji Kompetensi Bab 1 Sejarah Kelahiran Pancasila (Pilihan Ganda & Esai HOTS).',
            remedial: 'Menyusun urutan kronologi garis waktu (timeline) dari pembentukan BPUPK hingga sidang PPKI.',
            pengayaan: 'Menulis esai reflektif "Jika Saya Menjadi Anggota PPKI pada 18 Agustus 1945".',
            lkpdTitle: 'LKPD 1.D: Kronologi & Keputusan Monumental Sidang PPKI 18 Agustus 1945',
            lkpdInstructions: [
              'Pelajari peristiwa pagi hari 18 Agustus 1945 pada Buku Siswa Halaman 24–30.',
              'Analisis keputusan yang diambil oleh para tokoh bangsa dalam sidang PPKI.',
              'Jawablah pertanyaan telaah kritis di bawah ini!'
            ],
            lkpdQuestions: [
              'Sebutkan 3 keputusan pokok Sidang PPKI pada tanggal 18 Agustus 1945!',
              'Jelaskan mengapa perubahan kalimat sila pertama Piagam Jakarta menjadi "Ketuhanan Yang Maha Esa" sangat menentukan keutuhan Republik Indonesia!',
              'Tuliskan 3 sikap keteladanan para pendiri bangsa yang wajib kita terapkan sebagai pelajar Pancasila!'
            ],
            glosarium: 'PPKI: Panitia Persiapan Kemerdekaan Indonesia; KNIP: Komite Nasional Indonesia Pusat; Konsensus: Kesepakatan bersama yang dicapai melalui musyawarah.',
            daftarPustaka: 'Hatta, Mohammad. (1979). Memoir Mohammad Hatta. Jakarta: Tintamas.'
          }
        ]
      },

      // ══════════════════════════════════════════════════════════════
      // BAB 2: NORMA DAN UUD NRI TAHUN 1945 (SEMESTER 1)
      // ══════════════════════════════════════════════════════════════
      {
        id: 'bab-2-pkn-7',
        babNumber: 2,
        semester: 1,
        title: 'Bab II: Norma dan UUD NRI Tahun 1945',
        description: 'Membahas hakikat norma dalam masyarakat, 4 jenis norma, arti penting norma dalam mewujudkan keadilan, hak dan kewajiban, serta UUD 1945 sebagai hukum dasar tertulis tertinggi.',
        elemen: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
        subBabList: [
          {
            id: 'sub-2a',
            code: '2.A',
            title: 'Sub-Bab A: Norma dalam Kehidupan Bermasyarakat',
            pages: 'Hal. 33 – 42',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-5)',
            modelPembelajaran: 'Problem Based Learning (PBL) & Analisis Kasus Nyata',
            tujuanPembelajaran: 'Menjelaskan pengertian norma, fungsi norma, serta mengklasifikasikan 4 jenis norma (Agama, Kesusilaan, Kesopanan, dan Hukum) beserta sumber dan sanksinya.',
            pemahamanBermakna: 'Norma diciptakan untuk menciptakan keteraturan, ketenteraman, dan keselamatan bersama dalam kehidupan bermasyarakat.',
            pertanyaanPemantik: [
              'Apa yang akan terjadi jika di sekolah atau di jalan raya tidak ada aturan sama sekali?',
              'Apa perbedaan antara sanksi norma kesusilaan dengan sanksi norma hukum?',
              'Mengapa norma hukum memerlukan aparat penegak hukum yang tegas dan adil?'
            ],
            p3Dimensions: ['Mandiri', 'Bernalar Kritis', 'Beriman & Bertakwa kepada Tuhan YME'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 33-42, Video Pelanggaran Lalu Lintas & Tata Tertib Sekolah, Kartu Studi Kasus Norma, LKPD 2.A.',
            kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Guru menyapa siswa, berdoa bersama, memeriksa kebersihan kelas dan presensi.\n2. Apersepsi Video Kasus (5 Menit):\n   - Guru menayangkan video berdurasi 1 menit tentang situasi semrawut di persimpangan jalan ketika lampu lalu lintas padam dan pengendara saling serobot.\n   - Guru bertanya: "Apa yang membuat suasana menjadi tertib atau kacau ketika aturan tidak ditaati?"\n3. Guru menyampaikan tujuan pembelajaran 4 macam norma (3 Menit).',
            kegiatanInti: `Fase 1: Orientasi Peserta Didik pada Masalah Nyata (10 Menit)
• Aktivitas Guru:
  - Guru menyajikan 4 kasus kontekstual di masyarakat: (1) Siswa yang mencontek saat ujian, (2) Pengendara sepeda motor tanpa helm dan menerobos lampu merah, (3) Remaja yang tidak menyapa orang tua/guru saat berpapasan, (4) Warga yang mengabaikan kewajiban ibadah agamanya.
• Aktivitas Peserta Didik:
  - Murid mengamati keempat kasus pada tayangan slide / lembar kerja dan membaca Buku Siswa Hal. 33–36.
  - Murid merumuskan masalah: "Aturan apa yang dilanggar dari masing-masing kasus tersebut dan apa sanksi yang diterima pelakunya?"

Fase 2: Mengorganisasikan Peserta Didik ke dalam Kelompok Kerja (10 Menit)
• Aktivitas Guru:
  - Guru membagi murid ke dalam 4 kelompok berdasarkan jenis norma:
    1. Kelompok Norma Agama (Sumber wahyu Tuhan, sanksi dosa/pahala di akhirat).
    2. Kelompok Norma Kesusilaan (Sumber hati nurani, sanksi rasa bersalah/penyesalan batin).
    3. Kelompok Norma Kesopanan (Sumber tata pergaulan masyarakat lokal, sanksi cemooh/dikucilkan).
    4. Kelompok Norma Hukum (Sumber negara/penguasa, sanksi tegas, nyata, dan memaksa oleh aparat).
• Aktivitas Peserta Didik:
  - Setiap kelompok menerima "Kartu Kasus Norma" dan LKPD 2.A untuk dianalisis secara mendalam.

Fase 3: Membimbing Penyelidikan Mandiri dan Kelompok (15 Menit)
• Aktivitas Guru (Diferensiasi Proses):
  - Guru berkeliling memberikan pendampingan: memandu murid membedakan batas tipis antara norma kesopanan (kebiasaan eksternal) dan kesusilaan (bisikan hati nurani internal).
• Aktivitas Peserta Didik (4C: Critical Thinking & Collaboration):
  - Murid menelaah Buku Siswa Hal. 35–41, mengidentifikasi ciri-ciri, sifat mengikat, instrumen penegak, serta contoh nyata di lingkungan keluarga, sekolah, dan masyarakat.
  - Murid melengkapi Matriks Perbandingan 4 Norma pada LKPD 2.A.

Fase 4: Mengembangkan dan Menyajikan Hasil Analisis (15 Menit)
• Aktivitas Guru:
  - Guru mengarahkan tiap kelompok mengirimkan juru bicara untuk memaparkan solusi atas studi kasus norma.
• Aktivitas Peserta Didik (4C: Communication):
  - Kelompok mempresentasikan klasifikasi kasus norma, mendemonstrasikan contoh perilaku taat norma di sekolah, dan menjawab pertanyaan kelompok lain.

Fase 5: Menganalisis dan Mengevaluasi Efektivitas Norma (10 Menit)
• Aktivitas Guru:
  - Guru memberikan penguatan konsep bahwa norma hukum melengkapi ketiga norma lainnya karena memiliki sanksi fisik/hukum yang memaksa demi ketertiban umum.
• Aktivitas Peserta Didik:
  - Murid menarik kesimpulan bahwa ketaatan norma harus berlandaskan kesadaran moral pribadi, bukan semata karena takut dihukum.`,
            kegiatanPenutup: '1. Refleksi Ketaatan Norma (5 Menit):\n   - Murid mengisi lembar "Komitmen Pelajar Tertib Norma" (menuliskan 1 perilaku kesopanan dan 1 perilaku disiplin sekolah yang ditingkatkan).\n2. Guru memberikan apresiasi (3 Menit).\n3. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Tanya jawab mengenai tata tertib sekolah yang wajib dipatuhi.',
            asesmenFormatif: 'Penilaian analisis kartu kasus norma dan keaktifan diskusi LKPD 2.A.',
            asesmenSumatif: 'Kuis klasifikasi jenis-jenis norma dan sanksinya.',
            remedial: 'Mengisi tabel komparasi 4 norma dengan contoh konkret di rumah dan sekolah.',
            pengayaan: 'Merancang poster digital/manual "Bangga Taat Norma di Sekolah".',
            lkpdTitle: 'LKPD 2.A: Klasifikasi 4 Jenis Norma dalam Kehidupan Sehari-hari',
            lkpdInstructions: [
              'Bacalah uraian Macam-Macam Norma pada Buku Siswa Halaman 35–41.',
              'Diskusikan bersama kelompok mengenai perbedaan sumber dan sanksi dari 4 jenis norma.',
              'Lengkapi tabel studi kasus norma di bawah ini!'
            ],
            lkpdQuestions: [
              'Tuliskan pengertian norma menurut para ahli hukum dan fungsinya dalam masyarakat!',
              'Jelaskan perbedaan mendasar antara norma kesopanan dan norma kesusilaan!',
              'Berikan masing-masing 2 contoh penerapan norma agama, kesusilaan, kesopanan, dan hukum di lingkungan sekolah!'
            ],
            glosarium: 'Norma: Aturan atau ketentuan yang mengikat warga kelompok dalam masyarakat; Sanksi: Hukuman atau akibat dari pelanggaran aturan; Hukum: Peraturan resmi yang dibuat oleh penguasa dan bersifat memaksa.',
            daftarPustaka: 'Ali, Mohammad Daud. (2012). Hukum Islam dan Peradilan Agama. Jakarta: Rajawali Pers.'
          },
          {
            id: 'sub-2b',
            code: '2.B',
            title: 'Sub-Bab B: Arti Penting Norma dalam Mewujudkan Keadilan',
            pages: 'Hal. 43 – 50',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-6)',
            modelPembelajaran: 'Inquiry Learning & Diskusi Terbimbing Berbasis Kasus',
            tujuanPembelajaran: 'Menganalisis arti penting norma hukum dalam mewujudkan keadilan, ketertiban, kepastian hukum, dan perlindungan hak asasi manusia.',
            pemahamanBermakna: 'Keadilan tidak dapat terwujud tanpa ketaatan terhadap norma hukum yang berlaku setara bagi semua warga negara (equality before the law).',
            pertanyaanPemantik: [
              'Mengapa hukum harus ditegakkan secara adil tanpa pandang bulu?',
              'Apa arti semboyan "Keadilan untuk Semua" bagi masyarakat?',
              'Bagaimana peran hakim dan penegak hukum dalam memastikan keadilan terwujud?'
            ],
            p3Dimensions: ['Bernalar Kritis', 'Gotong Royong'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 43-50, Timbangan Keadilan / Simbol Hukum, Artikel Berita Persidangan, LKPD 2.B.',
            kegiatanAwal: '1. Salam & Doa (5 Menit).\n2. Apersepsi Simbol Hukum (5 Menit):\n   - Guru menampilkan gambar Dewi Keadilan (Justitia) yang memegang pedang, timbangan, dan mata tertutup kain.\n   - Guru memantik: "Mengapa mata Dewi Keadilan ditutup kain dan tangan kanannya memegang timbangan?"\n3. Penyampaian Tujuan (3 Menit): Memahami fungsi keadilan dan kepastian hukum.',
            kegiatanInti: `Fase 1: Identifikasi Kebutuhan & Perumusan Masalah Keadilan (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan 3 nilai dasar tujuan hukum menurut Gustav Radbruch: Keadilan (Gerechtigkeit), Kemanfaatan (Zweckmassigkeit), dan Kepastian Hukum (Rechtssicherheit).
  - Guru mengangkat isu bahaya tindakan main hakim sendiri (eigenrichting) yang marak terjadi jika masyarakat tidak percaya pada hukum.
• Aktivitas Peserta Didik:
  - Murid menyimak pemaparan dan membaca Buku Siswa Hal. 43–46.

Fase 2: Pembentukan Hipotesis & Pengelompokan Investigasi (10 Menit)
• Aktivitas Guru:
  - Guru membagikan LKPD 2.B berisi artikel sengketa kepemilikan tanah dan kasus pencurian yang diselesaikan melalui jalur hukum formal vs mediasi damai.
• Aktivitas Peserta Didik:
  - Murid dalam kelompok merumuskan dugaan sementara: "Bagaimana norma hukum melindungi hak warga negara yang lemah dari kesewenang-wenangan pihak yang kuat?"

Fase 3: Pengumpulan Data & Uji Fakta Hukum (15 Menit)
• Aktivitas Guru (Pendampingan Berkelanjutan):
  - Guru membimbing murid membaca Pasal 27 Ayat 1 UUD 1945 ("Segala warga negara bersamaan kedudukannya di dalam hukum dan pemerintahan...").
• Aktivitas Peserta Didik (4C: Critical Thinking):
  - Murid menganalisis prinsip equality before the law (kesetaraan di hadapan hukum).
  - Murid mendiskusikan peran aparat penegak hukum (Polisi, Jaksa, Hakim, Advokat) dalam menegakkan keadilan secara objektif.

Fase 4: Perumusan Temuan & Solusi Pencegahan Main Hakim Sendiri (15 Menit)
• Aktivitas Guru:
  - Guru memandu murid merumuskan langkah prosedural yang benar jika menemukan tindak kejahatan di lingkungan sekitar.
• Aktivitas Peserta Didik (4C: Collaboration & Communication):
  - Kelompok menyusun infografis panduan: "Langkah Warga Bijak Taat Hukum: Mengapa Kita Tidak Boleh Main Hakim Sendiri?".

Fase 5: Generalisasi & Penguatan Integritas Keadilan (10 Menit)
• Aktivitas Guru:
  - Guru mengonfirmasi hasil kerja murid dan memberikan apresiasi atas kedalaman analisis hukum.
• Aktivitas Peserta Didik:
  - Murid menyimpulkan bahwa keadilan sejati adalah memperlakukan hak orang lain secara proporsional sesuai aturan yang sah.`,
            kegiatanPenutup: '1. Refleksi Nilai Adil (5 Menit):\n   - Murid merefleksikan apakah selama ini telah bersikap adil terhadap teman sebangku dan adik/kakak di rumah.\n2. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Tanya jawab mengenai apa arti kata "Adil".',
            asesmenFormatif: 'Rubrik penilaian argumen analisis keadilan pada LKPD 2.B.',
            asesmenSumatif: 'Uji pemahaman esai arti penting norma hukum.',
            remedial: 'Meringkas 3 fungsi utama norma hukum dalam Buku Siswa.',
            pengayaan: 'Menganalisis artikel berita tentang penyelesaian sengketa melalui jalur mediasi/musyawarah.',
            lkpdTitle: 'LKPD 2.B: Telaah Keadilan & Pencegahan Perilaku Main Hakim Sendiri',
            lkpdInstructions: [
              'Pelajari materi Arti Penting Norma dalam Mewujudkan Keadilan pada Buku Siswa Hal. 43–48.',
              'Diskusikan mengapa masyarakat dilarang melakukan aksi main hakim sendiri (eigenrichting).',
              'Jawablah pertanyaan reflektif berikut!'
            ],
            lkpdQuestions: [
              'Jelaskan mengapa norma hukum sangat dibutuhkan untuk mencegah terjadinya main hakim sendiri di masyarakat!',
              'Apa makna prinsip kesamaan kedudukan di hadapan hukum (equality before the law)?',
              'Bagaimana cara kalian sebagai siswa membantu menciptakan suasana tertib dan adil di kelas?'
            ],
            glosarium: 'Keadilan: Sikap memperlakukan seseorang sesuai haknya; Kepastian Hukum: Jaminan bahwa hukum dijalankan secara jelas dan tegas; Main Hakim Sendiri: Tindakan menghukum pihak lain tanpa melalui proses peradilan yang sah.',
            daftarPustaka: 'Kansil, C.S.T. (2002). Pengantar Ilmu Hukum dan Tata Hukum Indonesia. Jakarta: Balai Pustaka.'
          },
          {
            id: 'sub-2c',
            code: '2.C',
            title: 'Sub-Bab C: Hak dan Kewajiban pada Norma',
            pages: 'Hal. 51 – 58',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-7)',
            modelPembelajaran: 'Project Based Learning (PjBL) Mini: Pohon Keseimbangan Hak-Kewajiban',
            tujuanPembelajaran: 'Mengidentifikasi hak dan kewajiban peserta didik sebagai anak, murid, dan warga negara, serta menyeimbangkan pelaksanaannya dalam kehidupan sehari-hari.',
            pemahamanBermakna: 'Hak dan kewajiban ibarat dua sisi mata uang yang tidak dapat dipisahkan; pemenuhan hak harus didahului oleh pelaksanaan kewajiban dengan penuh tanggung jawab.',
            pertanyaanPemantik: [
              'Mana yang harus didahulukan: menuntut hak atau melaksanakan kewajiban?',
              'Apa saja hak anak menurut Konvensi Hak Anak dan UU Perlindungan Anak?',
              'Bagaimana contoh nyata pelaksanaan kewajiban siswa di sekolah yang berdampak pada kenyamanan belajar?'
            ],
            p3Dimensions: ['Mandiri', 'Gotong Royong', 'Bernalar Kritis'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 51-58, Lembar Bagan Hak & Kewajiban, Kertas Karton, Sticky Notes Warna, LKPD 2.C.',
            kegiatanAwal: '1. Salam, Doa & Cek Kerapian (5 Menit):\n   - Guru mengajak murid memeriksa kebersihan kolong meja sebagai wujud pelaksanaan kewajiban menjaga kelas.\n2. Apersepsi Interaktif (5 Menit):\n   - Guru bertanya: "Kalian berhak mendapatkan nilai ulangan yang baik, tetapi kewajiban apa yang harus kalian penuhi terlebih dahulu?"\n3. Tujuan Proyek Mini (3 Menit): Membuat Pohon Keseimbangan Hak dan Kewajiban.',
            kegiatanInti: `Fase 1: Penentuan Pertanyaan Mendasar Proyek (10 Menit)
• Aktivitas Guru:
  - Guru menjelaskan pengertian Hak (wewenang/kenikmatan yang semestinya diterima) dan Kewajiban (keharusan/tanggung jawab yang wajib ditunaikan) menurut Prof. Notonagoro.
  - Guru memaparkan hak-hak dasar anak menurut Konvensi Hak Anak (Hak Hidup, Tumbuh Kembang, Perlindungan, dan Partisipasi).
• Aktivitas Peserta Didik:
  - Murid membaca Buku Siswa Hal. 51–54 dan menanggapi pertanyaan: "Mengapa menuntut hak tanpa menjalankan kewajiban akan menciptakan perselisihan?"

Fase 2: Mendesain Perencanaan Proyek Kolaboratif (10 Menit)
• Aktivitas Guru:
  - Guru membagikan lembar kerja karton LKPD 2.C dan sticky notes warna-warni (Kuning = Hak, Biru = Kewajiban).
  - Guru memfasilitasi pembagian ranah analisis: Lingkungan Keluarga/Rumah, Lingkungan Sekolah, dan Lingkungan Masyarakat/Negara.
• Aktivitas Peserta Didik:
  - Murid dalam kelompok merancang desain "Pohon Keseimbangan Hak & Kewajiban": batang pohon melambangkan norma/aturan, cabang kiri melambangkan hak, cabang kanan melambangkan kewajiban.

Fase 3: Menyusun Jadwal & Eksekusi Proyek Mini (15 Menit)
• Aktivitas Guru (Fasilitasi & Observasi Sikap):
  - Guru berkeliling mengamati keaktifan murid, memastikan terjadi pembagian peran yang seimbang (P3: Gotong Royong & Mandiri).
• Aktivitas Peserta Didik (4C: Creativity & Collaboration):
  - Murid menuliskan butir-butir konkret hak dan kewajiban siswa pada sticky notes:
    1. Di Rumah: Hak mendapat kasih sayang & nafkah; Kewajiban membantu orang tua & belajar tertib.
    2. Di Sekolah: Hak mendapat bimbingan guru & fasilitas kelas; Kewajiban menjaga sarana, disiplin waktu, dan menghormati warga sekolah.
    3. Di Negara: Hak atas perlindungan hukum & kebebasan berpendapat; Kewajiban menaati UU & membayar pajak saat dewasa.

Fase 4: Monitoring dan Presentasi Karya Melalui Gallery Walk (15 Menit)
• Aktivitas Guru:
  - Guru mengarahkan setiap kelompok menempelkan hasil karya pohon hak-kewajiban di dinding kelas.
• Aktivitas Peserta Didik (4C: Communication):
  - Murid melakukan pameran karya (Gallery Walk): 2 anggota berjaga di stan kelompok untuk menjelaskan isi karya, anggota lain berkeliling memberikan bintang apresiasi dan catatan masukan.

Fase 5: Evaluasi Pengalaman Belajar & Refleksi Bersama (10 Menit)
• Aktivitas Guru:
  - Guru memandu sesi refleksi akhir: menyimpulkan bahwa hak seseorang dibatasi oleh hak orang lain, sehingga kewajiban harus selalu didahulukan.
• Aktivitas Peserta Didik:
  - Murid merumuskan komitmen bersama kelas mengenai 5 kewajiban prioritas demi kenyamanan belajar.`,
            kegiatanPenutup: '1. Rangkuman & Komitmen Kelas (5 Menit):\n   - Penandatanganan komitmen bersama pelaksanaan kewajiban kelas.\n2. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Sebutkan 2 hak anak di rumah dan 2 kewajiban anak di rumah.',
            asesmenFormatif: 'Penilaian karya bagan pohon hak & kewajiban dan LKPD 2.C.',
            asesmenSumatif: 'Tes tertulis studi kasus pemenuhan hak dan kewajiban.',
            remedial: 'Menuliskan 5 daftar hak dan 5 daftar kewajiban siswa di sekolah.',
            pengayaan: 'Membuat jurnal harian pemenuhan kewajiban selama 1 pekan di rumah dan sekolah.',
            lkpdTitle: 'LKPD 2.C: Matriks Pemetaan Keseimbangan Hak dan Kewajiban',
            lkpdInstructions: [
              'Pelajari materi Hak dan Kewajiban pada Buku Siswa Hal. 51–57.',
              'Klasifikasikan contoh hak dan kewajiban di lingkungan keluarga, sekolah, dan masyarakat.',
              'Isi kolom analisis keseimbangan hak dan kewajiban di bawah ini!'
            ],
            lkpdQuestions: [
              'Jelaskan mengapa pelaksanaan hak tidak boleh merugikan atau melanggar hak orang lain!',
              'Tuliskan 3 hak siswa di sekolah dan 3 kewajiban siswa di sekolah yang saling berkaitan erat!',
              'Apa sanksi moral atau akibat langsung yang terjadi jika seorang siswa mengabaikan kewajiban belajarnya?'
            ],
            glosarium: 'Hak: Kuasa untuk menerima atau melakukan sesuatu yang semestinya; Kewajiban: Sesuatu yang wajib dilaksanakan dengan penuh tanggung jawab; Tanggung Jawab: Keadaan wajib menanggung segala sesuatunya.',
            daftarPustaka: 'Notonagoro. (1987). Pancasila Secara Ilmiah Populer. Jakarta: Bina Aksara.'
          },
          {
            id: 'sub-2d',
            code: '2.D',
            title: 'Sub-Bab D: UUD NRI 1945 sebagai Dasar Hukum Tertulis',
            pages: 'Hal. 59 – 68',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-8)',
            modelPembelajaran: 'Problem Based Learning & Kajian Konstitusi Indonesia',
            tujuanPembelajaran: 'Menjelaskan kedudukan UUD NRI Tahun 1945 sebagai hukum dasar tertinggi, tata urutan peraturan perundang-undangan (UU No. 12 Tahun 2011), serta kepatuhan terhadap hukum nasional.',
            pemahamanBermakna: 'UUD NRI Tahun 1945 adalah pedoman utama penyelenggaraan negara dan pembatas kekuasaan agar hak-hak warga negara terlindungi.',
            pertanyaanPemantik: [
              'Mengapa setiap undang-undang atau peraturan di Indonesia tidak boleh bertentangan dengan UUD 1945?',
              'Bagaimana tata urutan perundang-undangan di Indonesia?',
              'Apa peran Mahkamah Konstitusi dalam menjaga kemurnian UUD 1945?'
            ],
            p3Dimensions: ['Bernalar Kritis', 'Mandiri'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 59-68, Buku UUD 1945 Hasil Amandemen, Bagan Piramida Hierarki Peraturan Hukum, LKPD 2.D.',
            kegiatanAwal: '1. Salam, Doa & Lagu Kebangsaan (5 Menit):\n   - Menyanyikan lagu "Bagimu Negeri" dengan khidmat.\n2. Apersepsi Konstitusi (5 Menit):\n   - Guru menunjukkan Buku Naskah UUD 1945 dan bertanya: "Apakah ada peraturan hukum di Indonesia yang kedudukannya lebih tinggi daripada UUD 1945?"\n3. Guru menyampaikan skenario analisis piramida perundang-undangan (3 Menit).',
            kegiatanInti: `Fase 1: Orientasi Terhadap Kedudukan UUD 1945 (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan kedudukan UUD NRI 1945 sebagai norma hukum dasar tertinggi (groundnorm) yang menjadi sumber hukum bagi seluruh peraturan perundang-undangan di bawahnya.
  - Guru menjelaskan struktur naskah UUD 1945 pasca amandemen: Pembukaan (4 Alinea, tidak boleh diubah) dan Batang Tubuh (16 Bab, 37 Pasal, 3 Pasal Aturan Peralihan, 2 Pasal Aturan Tambahan).
• Aktivitas Peserta Didik:
  - Murid mengkaji Buku Siswa Hal. 59–62 dan mencermati prinsip supremasi konstitusi.

Fase 2: Organisasi Belajar: Hierarki Peraturan Hukum (10 Menit)
• Aktivitas Guru:
  - Guru membagikan LKPD 2.D yang memuat bagan piramida kosong tata urutan peraturan perundang-undangan berdasarkan UU No. 12 Tahun 2011 juncto UU No. 13 Tahun 2022.
• Aktivitas Peserta Didik:
  - Murid dalam kelompok bertugas mengurutkan 7 tingkatan hierarki hukum dari puncak piramida hingga dasar.

Fase 3: Penyelidikan & Analisis Asas Hukum (15 Menit)
• Aktivitas Guru (Bimbingan Kritis):
  - Guru memperkenalkan asas hukum fundamental: Lex Superior Derogat Legi Inferiori (peraturan yang lebih tinggi mengesampingkan peraturan yang lebih rendah).
  - Guru memberikan contoh studi kasus: Jika ada Peraturan Daerah (Perda) yang melarang pedagang kecil berjualan tanpa izin padahal bertentangan dengan UU di atasnya, apa yang harus dilakukan?
• Aktivitas Peserta Didik (4C: Critical Thinking):
  - Murid menelaah 7 tingkatan perundang-undangan:
    1. UUD NRI Tahun 1945
    2. Ketetapan MPR (Tap MPR)
    3. Undang-Undang / Peraturan Pemerintah Pengganti Undang-Undang (UU/Perpu)
    4. Peraturan Pemerintah (PP)
    5. Peraturan Presiden (Perpres)
    6. Peraturan Daerah Provinsi (Perda Prov)
    7. Peraturan Daerah Kabupaten/Kota (Perda Kab/Kota)
  - Murid mendiskusikan mekanisme uji materi (judicial review) di Mahkamah Konstitusi dan Mahkamah Agung.

Fase 4: Penyajian Bagan & Presentasi Piramida Hukum (15 Menit)
• Aktivitas Guru:
  - Guru mengundang 2 kelompok untuk mendemonstrasikan piramida hukum dan memberikan argumen mengapa peraturan bawahan wajib tunduk pada peraturan atasan.
• Aktivitas Peserta Didik (4C: Communication):
  - Kelompok menyajikan bagan piramida lengkap dengan contoh konkret produk hukumnya dan menjawab pertanyaan kelas.

Fase 5: Analisis & Kesimpulan Penegakan Hukum (10 Menit)
• Aktivitas Guru:
  - Guru mengonfirmasi pemahaman murid bahwa kepatuhan hukum menciptakan ketertiban dan perlindungan hak asasi bagi seluruh rakyat Indonesia.
• Aktivitas Peserta Didik:
  - Murid merumuskan intisari materi Bab II pada LKPD.`,
            kegiatanPenutup: '1. Uji Kompetensi Bab II (5 Menit):\n   - Pengerjaan kuis evaluasi pemahaman konstitusi pada Buku Siswa Hal. 67.\n2. Refleksi ketaatan hukum (3 Menit).\n3. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Sebutkan apa nama undang-undang dasar negara kita.',
            asesmenFormatif: 'Penilaian gambar bagan piramida hierarki hukum dan LKPD 2.D.',
            asesmenSumatif: 'Uji Kompetensi Bab 2 Norma dan UUD NRI Tahun 1945.',
            remedial: 'Menghafal dan menuliskan urutan 7 tingkatan peraturan perundang-undangan di Indonesia.',
            pengayaan: 'Membaca salah satu pasal UUD 1945 tentang hak asasi manusia (Pasal 28A-28J) dan membuat rangkuman artinya.',
            lkpdTitle: 'LKPD 2.D: Piramida Tata Urutan Peraturan Perundang-undangan di Indonesia',
            lkpdInstructions: [
              'Pelajari materi UUD NRI Tahun 1945 pada Buku Siswa Halaman 59–66.',
              'Gambarkan bagan piramida tata urutan peraturan perundang-undangan berdasarkan UU No. 12 Tahun 2011.',
              'Jawablah pertanyaan analisis konstitusi di bawah ini!'
            ],
            lkpdQuestions: [
              'Tuliskan secara berurutan 7 jenis peraturan perundang-undangan di Indonesia dari yang tertinggi hingga terendah!',
              'Mengapa peraturan perundang-undangan yang lebih rendah tidak boleh bertentangan dengan peraturan yang lebih tinggi?',
              'Sebutkan 2 contoh perilaku taat hukum yang dapat dilakukan oleh seorang pelajar SMP!'
            ],
            glosarium: 'Konstitusi: Hukum dasar tertulis maupun tidak tertulis dari suatu negara; Hierarki: Urutan tingkatan atau jenjang peraturan perundang-undangan; Perda: Peraturan Daerah yang dibentuk oleh Kepala Daerah bersama DPRD.',
            daftarPustaka: 'Asshiddiqie, Jimly. (2006). Pengantar Ilmu Hukum Tata Negara. Jakarta: Konstitusi Press.'
          }
        ]
      },

      // ══════════════════════════════════════════════════════════════
      // BAB 3: KESATUAN INDONESIA & KARAKTERISTIK DAERAH (SEMESTER 1)
      // ══════════════════════════════════════════════════════════════
      {
        id: 'bab-3-pkn-7',
        babNumber: 3,
        semester: 1,
        title: 'Bab III: Kesatuan Indonesia dan Karakteristik Daerah',
        description: 'Membahas batas wilayah NKRI, makna negara kesatuan, tonggak sejarah persatuan (1908, 1928, 1945), karakteristik daerah dalam NKRI, serta peran pelajar dalam mempertahankan keutuhan bangsa.',
        elemen: 'Negara Kesatuan Republik Indonesia',
        subBabList: [
          {
            id: 'sub-3a',
            code: '3.A',
            title: 'Sub-Bab A: Wilayah Negara Indonesia & Deklarasi Djuanda',
            pages: 'Hal. 69 – 78',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-9)',
            modelPembelajaran: 'Discovery Learning & Analisis Peta Wilayah Kemaritiman',
            tujuanPembelajaran: 'Memetakan wilayah darat, laut (Deklarasi Djuanda 1957 / UNCLOS 1982), dan udara NKRI serta batas-batas teritorial dengan negara tetangga.',
            pemahamanBermakna: 'Laut bagi bangsa Indonesia bukanlah pemisah antarpulau, melainkan pemersatu dan jembatan kebangsaan yang mengikat seluruh tanah air Nusantara.',
            pertanyaanPemantik: [
              'Mengapa Deklarasi Djuanda 13 Desember 1957 sangat penting bagi keutuhan wilayah laut Indonesia?',
              'Apa saja batas-batas wilayah darat dan laut Indonesia dengan negara tetangga?',
              'Bagaimana peran strategis posisi silang geografis Indonesia di dunia?'
            ],
            p3Dimensions: ['Berkebinekaan Global', 'Bernalar Kritis', 'Mandiri'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 69-78, Peta NKRI Ukuran Besar, Atlas Geografis Indonesia, LKPD 3.A.',
            kegiatanAwal: '1. Salam, Doa & Lagu Nasional (5 Menit):\n   - Menyanyikan bersama lagu "Dari Sabang Sampai Merauke" dengan penuh penghayatan.\n2. Apersepsi Komparasi Peta (5 Menit):\n   - Guru menampilkan dua peta perbandingan: Peta Indonesia zaman kolonial Belanda (ordonansi 1939 dengan laut teritorial hanya 3 mil sehingga laut antarpulau adalah laut bebas internasional) vs Peta Pasca Deklarasi Djuanda 1957 (konsep Tanah Air - Negara Kepulauan/Archipelagic State).\n3. Tujuan Pembelajaran (3 Menit): Memetakan kedaulatan wilayah NKRI.',
            kegiatanInti: `Fase 1: Pemberian Stimulasi / Stimulation (10 Menit)
• Aktivitas Guru:
  - Guru menceritakan perjuangan Perdana Menteri Ir. Djuanda Kartawidjaja pada 13 Desember 1957 yang mendeklarasikan bahwa seluruh perairan di sekitar, di antara, dan yang menghubungkan pulau-pulau Indonesia adalah bagian integral dari wilayah NKRI.
• Aktivitas Peserta Didik:
  - Murid membaca Buku Siswa Hal. 69–73 dan mengamati peta perairan nusantara.

Fase 2: Identifikasi Masalah Kedaulatan Wilayah (10 Menit)
• Aktivitas Guru:
  - Guru membagikan LKPD 3.A dan memandu murid merumuskan pertanyaan: "Bagaimana hukum laut internasional UNCLOS 1982 mengakui batas wilayah laut teritorial (12 mil), zona tambahan (24 mil), dan Zona Ekonomi Eksklusif / ZEE (200 mil) Indonesia?"
• Aktivitas Peserta Didik:
  - Murid dalam kelompok membagi tugas meneliti 4 penjuru batas wilayah: Batas Utara, Batas Selatan, Batas Barat, dan Batas Timur.

Fase 3: Pengumpulan Data & Eksplorasi Atlas Wilayah (15 Menit)
• Aktivitas Guru (Diferensiasi Konten & Pendampingan):
  - Guru menyediakan atlas dan peta digital/cetak; membimbing murid mencari negara-negara yang berbatasan langsung secara darat (Malaysia, Timor Leste, Papua Nugini) dan secara laut (10 negara tetangga).
• Aktivitas Peserta Didik (4C: Collaboration & Critical Thinking):
  - Murid memplot batas teritorial Indonesia pada peta buta di LKPD 3.A:
    1. Utara: Malaysia, Singapura, Thailand, Vietnam, Filipina, Laut Cina Selatan.
    2. Selatan: Timor Leste, Australia, Samudra Hindia.
    3. Barat: Samudra Hindia, Perairan India.
    4. Timur: Papua Nugini, Samudra Pasifik.
  - Murid mengidentifikasi pulau-pulau terluar Indonesia (seperti Pulau Miangas, Pulau Rote, Pulau Weh).

Fase 4: Pengolahan Data & Pembuatan Infografis Wilayah (15 Menit)
• Aktivitas Guru:
  - Guru memantau ketepatan analisis konsep "Tanah Air" sebagai satu kesatuan geopolitik dan geoekonomi.
• Aktivitas Peserta Didik (4C: Creativity):
  - Kelompok menyusun peta infografis yang menggambarkan potensi maritim dan peran posisi silang strategis Indonesia (antara 2 benua dan 2 samudra).

Fase 5: Verifikasi & Penarikan Kesimpulan (10 Menit)
• Aktivitas Guru:
  - Guru menegaskan pentingnya menjaga keutuhan setiap jengkal wilayah NKRI dan merayakan Hari Nusantara setiap tanggal 13 Desember.
• Aktivitas Peserta Didik:
  - Perwakilan kelompok mempresentasikan analisis batas wilayah dan menyimpulkan makna filosofis semboyan "Nenek Moyangku Seorang Pelaut" sebagai bangsa bahari yang berdaulat.`,
            kegiatanPenutup: '1. Refleksi Rasa Syukur (5 Menit):\n   - Murid mengemukakan rasa bangga dan bersyukur atas kekayaan alam maritim Indonesia.\n2. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Sebutkan 3 pulau terluar atau batas wilayah Indonesia yang kamu ketahui.',
            asesmenFormatif: 'Penilaian peta batas wilayah pada LKPD 3.A dan keaktifan kelompok.',
            asesmenSumatif: 'Kuis batas wilayah dan makna Deklarasi Djuanda.',
            remedial: 'Menyebutkan batas-batas wilayah geografis Indonesia di 4 arah mata angin.',
            pengayaan: 'Membuat artikel tentang potensi kelautan Indonesia sebagai poros maritim dunia.',
            lkpdTitle: 'LKPD 3.A: Telaah Batas Wilayah NKRI & Deklarasi Djuanda',
            lkpdInstructions: [
              'Cermati materi Wilayah Negara Indonesia pada Buku Siswa Halaman 69–76.',
              'Gunakan peta Indonesia atau atlas untuk mengidentifikasi batas-batas negara.',
              'Jawablah pertanyaan telaah geografis berikut!'
            ],
            lkpdQuestions: [
              'Jelaskan perbedaan kondisi laut Indonesia sebelum dan sesudah Deklarasi Djuanda 1957!',
              'Tuliskan batas-batas wilayah Indonesia di sebelah Utara, Selatan, Barat, dan Timur!',
              'Mengapa laut di Indonesia berfungsi sebagai pemersatu, bukan pemisah antarpulau?'
            ],
            glosarium: 'Deklarasi Djuanda: Deklarasi yang menyatakan bahwa laut Indonesia adalah satu kesatuan utuh; ZEE: Zona Ekonomi Eksklusif sejauh 200 mil laut dari garis pangkal; Teritorial: Wilayah kekuasaan hukum suatu negara.',
            daftarPustaka: 'Djalal, Hasjim. (1995). Indonesia and the Law of the Sea. Jakarta: CSIS.'
          },
          {
            id: 'sub-3b',
            code: '3.B',
            title: 'Sub-Bab B: Indonesia sebagai Negara Kesatuan & Karakteristik Daerah',
            pages: 'Hal. 79 – 90',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-10)',
            modelPembelajaran: 'Problem Based Learning & Presentasi Keunikan Daerah',
            tujuanPembelajaran: 'Menganalisis makna Pasal 1 Ayat 1 UUD 1945, karakteristik daerah dalam NKRI (otonomi daerah, daerah khusus/istimewa, daerah 3T), serta peran generasi muda dalam menjaga persatuan.',
            pemahamanBermakna: 'Kekuatan Negara Kesatuan Republik Indonesia terletak pada keutuhan nasional yang menghargai keunikan, otonomi, dan karakteristik kearifan daerah masing-masing.',
            pertanyaanPemantik: [
              'Mengapa para pendiri bangsa memilih bentuk Negara Kesatuan, bukan Negara Federal (Serikat)?',
              'Apa kekhususan atau keistimewaan daerah seperti Aceh, Yogyakarta, Papua, dan DKI Jakarta?',
              'Bagaimana cara kita menjaga kerukunan dan mencegah perselisihan kedaerahan di sekolah?'
            ],
            p3Dimensions: ['Gotong Royong', 'Berkebinekaan Global', 'Bernalar Kritis'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 79-90, Peta Otonomi Daerah, Video Profil Daerah Istimewa & Khusus di Indonesia, LKPD 3.B.',
            kegiatanAwal: '1. Salam, Doa & Presensi (5 Menit).\n2. Apersepsi Konstitusional (5 Menit):\n   - Guru membacakan Pasal 1 Ayat 1 UUD 1945: "Negara Indonesia ialah Negara Kesatuan, yang berbentuk Republik" dan Pasal 37 Ayat 5 (Bentuk NKRI tidak dapat dilakukan perubahan).\n3. Guru menyampaikan skenario analisis karakteristik daerah otonom & khusus (3 Menit).',
            kegiatanInti: `Fase 1: Orientasi Masalah: Kesatuan vs Keberagaman Daerah (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan sejarah singkat mengapa Republik Indonesia Serikat (RIS) bentukan Belanda tahun 1949 tidak bertahan lama dan bangsa Indonesia kembali bulat memilih Negara Kesatuan Republik Indonesia pada 17 Agustus 1950.
  - Guru menjelaskan kebijakan Otonomi Daerah (desentralisasi) menurut UU No. 23 Tahun 2014.
• Aktivitas Peserta Didik:
  - Murid membaca Buku Siswa Hal. 79–83 dan mengidentifikasi hakikat daerah otonom.

Fase 2: Pengorganisasian Kelompok Studi Daerah Khusus (10 Menit)
• Aktivitas Guru:
  - Guru membagi kelas menjadi 5 kelompok fokus:
    1. Daerah Istimewa Yogyakarta (Keistimewaan Kesultanan & Kadipaten Pakualaman).
    2. Provinsi Aceh (Otonomi Khusus Syariat Islam & Lembaga Wali Nanggroe).
    3. Provinsi-provinsi di Papua (Otonomi Khusus Majelis Rakyat Papua & Afirmasi OAP).
    4. Daerah Khusus Ibukota Jakarta / IKN Nusantara (Pusat Perekonomian & Pusat Pemerintahan).
    5. Kawasan Daerah 3T (Terdepan, Terluar, Tertinggal sebagai Benteng Pertahanan Bangsa).
• Aktivitas Peserta Didik:
  - Setiap kelompok menerima lembar studi kasus LKPD 3.B.

Fase 3: Penyelidikan Karakteristik & Kontribusi Daerah (15 Menit)
• Aktivitas Guru (Scaffolding):
  - Guru membimbing murid mengenali potensi kearifan lokal, sumber daya alam, dan peran historis masing-masing daerah dalam perjuangan kemerdekaan.
• Aktivitas Peserta Didik (4C: Critical Thinking & Collaboration):
  - Murid menganalisis mengapa keistimewaan dan otonomi khusus tidak memecah belah bangsa, melainkan memperkaya keutuhan NKRI.
  - Murid mencatat kontribusi daerah asal masing-masing terhadap pembangunan nasional.

Fase 4: Penyajian Hasil Telaah Daerah & Diskusi Panel (15 Menit)
• Aktivitas Guru:
  - Guru memoderatori diskusi panel antarkelompok.
• Aktivitas Peserta Didik (4C: Communication):
  - Perwakilan tiap kelompok memaparkan keunikan daerahnya dengan antusias.
  - Murid menyuarakan sikap anti-etnosentrisme (tidak merasa sukunya lebih hebat dari suku lain).

Fase 5: Refleksi & Penguatan Komitmen Kebangsaan (10 Menit)
• Aktivitas Guru:
  - Guru menegaskan pesan moral: "Bersatu kita teguh, bercerai kita runtuh. Menjaga keutuhan daerah adalah kewajiban setiap warga negara."
• Aktivitas Peserta Didik:
  - Murid menyusun ikrar bersama: "Pelajar Cinta NKRI dan Bangga Daerah".`,
            kegiatanPenutup: '1. Uji Kompetensi Bab III (5 Menit):\n   - Pengerjaan evaluasi pemahaman Bab III pada Buku Siswa Hal. 89.\n2. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Sebutkan provinsi atau kabupaten tempat sekolah kita berada beserta nama kepala daerahnya.',
            asesmenFormatif: 'Penilaian presentasi karakteristik daerah dan LKPD 3.B.',
            asesmenSumatif: 'Uji Kompetensi Bab 3 Kesatuan Indonesia dan Karakteristik Daerah.',
            remedial: 'Menjelaskan pengertian Negara Kesatuan dan menyebutkan 3 daerah khusus/istimewa di Indonesia.',
            pengayaan: 'Menulis esai singkat tentang potensi kearifan lokal daerah sendiri untuk kemajuan bangsa.',
            lkpdTitle: 'LKPD 3.B: Karakteristik Keistimewaan & Keunikan Daerah dalam NKRI',
            lkpdInstructions: [
              'Pelajari materi Karakteristik Daerah dalam NKRI pada Buku Siswa Hal. 79–88.',
              'Identifikasi status keistimewaan atau otonomi khusus pada daerah-daerah di Indonesia.',
              'Lengkapi tabel analisis karakteristik daerah berikut!'
            ],
            lkpdQuestions: [
              'Tuliskan bunyi Pasal 1 Ayat 1 UUD NRI Tahun 1945 tentang bentuk negara Indonesia!',
              'Jelaskan apa yang dimaksud dengan otonomi daerah dan tujuan pelaksanaannya!',
              'Sebutkan 3 daerah di Indonesia yang memiliki status istimewa atau otonomi khusus beserta alasannya!'
            ],
            glosarium: 'Negara Kesatuan: Bentuk negara berdaulat tunggal tanpa negara bagian; Otonomi Daerah: Hak dan wewenang daerah untuk mengatur urusan rumah tangganya sendiri; Daerah 3T: Daerah terdepan, terluar, dan tertinggal di Indonesia.',
            daftarPustaka: 'Rasyid, M. Ryaas. (2000). Makna Otonomi Daerah. Jakarta: Yayasan Reksa Cipta.'
          }
        ]
      },

      // ══════════════════════════════════════════════════════════════
      // BAB 4: KEBERAGAMAN INDONESIA (SEMESTER 2)
      // ══════════════════════════════════════════════════════════════
      {
        id: 'bab-4-pkn-7',
        babNumber: 4,
        semester: 2,
        title: 'Bab IV: Keberagaman Indonesia',
        description: 'Membahas keragaman gender, suku, budaya, agama/kepercayaan, ras, dan antargolongan dalam bingkai Bhinneka Tunggal Ika serta upaya menjaga toleransi.',
        elemen: 'Bhinneka Tunggal Ika',
        subBabList: [
          {
            id: 'sub-4a',
            code: '4.A',
            title: 'Sub-Bab A: Keragaman Gender, Suku Bangsa, dan Budaya',
            pages: 'Hal. 91 – 104',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-11)',
            modelPembelajaran: 'Discovery Learning & Pameran Budaya Gallery Walk',
            tujuanPembelajaran: 'Mengidentifikasi keragaman gender (kesetaraan peran), persebaran suku bangsa, serta kekayaan budaya (rumah adat, pakaian, tarian, lagu daerah) di Nusantara.',
            pemahamanBermakna: 'Perbedaan suku, budaya, dan gender bukanlah pembeda derajat, melainkan kekayaan peradaban yang memperindah persatuan bangsa Indonesia.',
            pertanyaanPemantik: [
              'Mengapa laki-laki dan perempuan memiliki hak dan kesempatan yang setara untuk meraih prestasi?',
              'Apa saja faktor penyebab banyaknya suku bangsa di Indonesia?',
              'Bagaimana cara kita melestarikan kesenian dan rumah adat daerah di era modern?'
            ],
            p3Dimensions: ['Berkebinekaan Global', 'Gotong Royong', 'Kreatif'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 91-104, Poster Rumah & Pakaian Adat 38 Provinsi, Rekaman Musik Tradisional, LKPD 4.A.',
            kegiatanAwal: '1. Salam, Doa & Lagu Daerah (5 Menit):\n   - Memutarkan cuplikan medley lagu daerah nusantara (Yamko Rambe Yamko, Sajojo, Rasa Sayange, Manuk Dadali).\n2. Apersepsi Kebinekaan Kelas (5 Menit):\n   - Guru mendata suku asal orang tua murid di kelas dan menanyakan: "Apa keunikan tradisi dari suku keluargamu masing-masing?"\n3. Tujuan Pembelajaran (3 Menit): Memahami keragaman gender, suku, dan budaya bangsa.',
            kegiatanInti: `Fase 1: Pemberian Stimulasi / Stimulation (10 Menit)
• Aktivitas Guru:
  - Guru menayangkan video dan peta persebaran lebih dari 300 kelompok etnis / 1.340 suku bangsa di Indonesia menurut sensus BPS.
  - Guru menjelaskan konsep kesetaraan gender: bahwa laki-laki dan perempuan adalah mitra sejajar yang saling menghormati dan memiliki hak yang sama di bidang pendidikan dan kepemimpinan.
• Aktivitas Peserta Didik:
  - Murid mencermati infografis Buku Siswa Hal. 91–96.

Fase 2: Identifikasi Masalah & Pembentukan Zona Kepulauan (10 Menit)
• Aktivitas Guru:
  - Guru membagi murid ke dalam 6 kelompok berbasis zona kepulauan:
    1. Kelompok Zona Sumatera (Suku Batak, Minang, Melayu, Aceh, Lampung).
    2. Kelompok Zona Jawa & Bali (Suku Jawa, Sunda, Betawi, Madura, Bali).
    3. Kelompok Zona Kalimantan (Suku Dayak, Banjar, Kutai).
    4. Kelompok Zona Sulawesi (Suku Bugis, Makassar, Toraja, Minahasa, Gorontalo).
    5. Kelompok Zona Nusa Tenggara & Maluku (Suku Sasak, Manggarai, Alor, Ambon, Ternate).
    6. Kelompok Zona Papua (Suku Asmat, Dani, Biak, Marind).
• Aktivitas Peserta Didik:
  - Murid menerima lembar kerja inventarisasi budaya LKPD 4.A.

Fase 3: Pengumpulan Data Kekayaan Budaya (15 Menit)
• Aktivitas Guru (Fasilitasi Kreatif):
  - Guru menyediakan kartu gambar rumah adat (Rumoh Aceh, Tongkonan, Gadang, Honai, Joglo), pakaian adat, senjata tradisional, dan tarian daerah.
• Aktivitas Peserta Didik (4C: Collaboration & Creativity):
  - Murid mengumpulkan data tentang: Nama Rumah Adat, Senjata Tradisional, Tarian Daerah, Lagu Daerah, serta Falsafah Kearifan Lokal dari zona masing-masing.
  - Murid membuat poster mini "Eksplorasi Budaya Nusantara".

Fase 4: Pameran Budaya / Gallery Walk (15 Menit)
• Aktivitas Guru:
  - Guru mengelola alur rotasi pameran gallery walk antarzona.
• Aktivitas Peserta Didik (4C: Communication):
  - Setiap murid berkeliling mengunjungi stan zona lain, mencatat kekayaan budaya baru di lembar catatan jelajah nusantara, serta mengapresiasi keindahan karya teman.

Fase 5: Verifikasi & Refleksi Kesetaraan & Kebinekaan (10 Menit)
• Aktivitas Guru:
  - Guru menegaskan kembali bahwa keberagaman budaya adalah identitas kebanggaan Indonesia di mata dunia dan harus dijaga dari kepunahan.
• Aktivitas Peserta Didik:
  - Murid menyimpulkan bahwa menghormati perbedaan suku dan kesetaraan gender menciptakan lingkungan belajar yang aman dan inklusif.`,
            kegiatanPenutup: '1. Refleksi Kebudayaan (5 Menit):\n   - Murid menyebutkan 1 tarian daerah atau rumah adat yang paling ingin dikunjungi di masa depan.\n2. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Sebutkan 3 nama suku bangsa di luar pulau tempat tinggalmu.',
            asesmenFormatif: 'Penilaian karya poster budaya dan lembar kerja LKPD 4.A.',
            asesmenSumatif: 'Kuis identifikasi rumah adat, tarian, dan suku bangsa Indonesia.',
            remedial: 'Menuliskan 5 nama suku bangsa di Indonesia beserta daerah asalnya.',
            pengayaan: 'Mempelajari dan mempraktikkan 1 lagu daerah Nusantara di depan kelas.',
            lkpdTitle: 'LKPD 4.A: Eksplorasi Keragaman Suku & Budaya Nusantara',
            lkpdInstructions: [
              'Bacalah materi Keragaman Gender, Suku, dan Budaya pada Buku Siswa Hal. 91–102.',
              'Isi tabel eksplorasi budaya Nusantara dengan data 5 provinsi di Indonesia.',
              'Jawablah pertanyaan reflektif kebinekaan berikut!'
            ],
            lkpdQuestions: [
              'Jelaskan mengapa bangsa Indonesia memiliki lebih dari 300 kelompok etnis/suku bangsa!',
              'Apa yang dimaksud dengan kesetaraan gender dan berikan contoh penerapannya di lingkungan sekolah!',
              'Sebutkan 3 contoh tindakan nyata untuk melestarikan budaya daerah agar tidak punah!'
            ],
            glosarium: 'Gender: Peran, perilaku, dan identitas sosial laki-laki dan perempuan; Etnis/Suku: Golongan manusia yang terikat oleh kesadaran identitas kebudayaan; Budaya: Hasil cipta, rasa, dan karsa manusia.',
            daftarPustaka: 'Koentjaraningrat. (2009). Pengantar Ilmu Antropologi. Jakarta: Rineka Cipta.'
          },
          {
            id: 'sub-4b',
            code: '4.B',
            title: 'Sub-Bab B: Keragaman Agama, Ras, dan Antargolongan',
            pages: 'Hal. 105 – 118',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-12)',
            modelPembelajaran: 'Problem Based Learning & Pendidikan Moderasi Beragama',
            tujuanPembelajaran: 'Menganalisis keragaman 6 agama resmi & aliran kepercayaan, klasifikasi ras (Malayan-Mongoloid, Melanesoid, Asiatic Mongoloid, Kaukasoid), serta membiasakan sikap moderasi dan toleransi antargolongan.',
            pemahamanBermakna: 'Toleransi dan moderasi beragama adalah pilar utama menjaga perdamaian dan keharmonisan hidup bersama di tengah masyarakat majemuk.',
            pertanyaanPemantik: [
              'Bagaimana bunyi Pasal 29 Ayat 2 UUD 1945 tentang kebebasan beragama?',
              'Mengapa kita tidak boleh memaksakan keyakinan atau agama kepada orang lain?',
              'Apa bahaya dari sikap prasangka (stereotipe) dan diskriminasi antargolongan?'
            ],
            p3Dimensions: ['Beriman & Bertakwa kepada Tuhan YME', 'Berkebinekaan Global', 'Bernalar Kritis'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 105-118, Foto Tempat Ibadah 6 Agama Berdampingan, Lembar Studi Kasus Toleransi, LKPD 4.B.',
            kegiatanAwal: '1. Salam & Doa Pembuka (5 Menit).\n2. Apersepsi Kerukunan (5 Menit):\n   - Guru menampilkan foto Masjid Istiqlal dan Gereja Katedral Jakarta yang berdampingan dan dihubungkan oleh "Terowongan Silaturahmi".\n   - Guru memantik: "Pesan kerukunan apa yang terpancar dari keberadaan tempat ibadah yang berdampingan ini?"\n3. Guru menyampaikan tujuan pembelajaran moderasi beragama (3 Menit).',
            kegiatanInti: `Fase 1: Orientasi Terhadap Keragaman Agama, Ras, & Golongan (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan 6 agama yang diakui resmi di Indonesia (Islam, Kristen Protestan, Katolik, Hindu, Buddha, Khonghucu) dan keberadaan penghayat kepercayaan.
  - Guru menguraikan klasifikasi ras fisik penduduk Indonesia (Malayan-Mongoloid, Melanesoid, Asiatic Mongoloid, Kaukasoid) serta menegaskan prinsip kesetaraan anti-rasisme.
  - Guru membacakan jaminan konstitusi Pasal 29 Ayat 2 UUD 1945.
• Aktivitas Peserta Didik:
  - Murid mencermati materi pada Buku Siswa Hal. 105–110.

Fase 2: Organisasi Belajar: Telaah Kasus Moderasi (10 Menit)
• Aktivitas Guru:
  - Guru membagikan LKPD 4.B yang memuat 3 studi kasus toleransi di masyarakat: (1) Tradisi gotong royong warga antariman saat perayaan hari besar keagamaan, (2) Pencegahan perundungan (bullying) berbasis suku/ras di sekolah, (3) Kerjasama pemuda lintas agama menjaga ketertiban.
• Aktivitas Peserta Didik:
  - Murid dalam kelompok heterogen memilih kasus untuk dianalisis faktor pendukung toleransinya.

Fase 3: Penyelidikan & Diskusi Nilai-Nilai Moderasi Beragama (15 Menit)
• Aktivitas Guru (Bimbingan Karakter P3):
  - Guru memandu murid memahami 4 indikator moderasi beragama menurut Kemenag RI: (1) Komitmen Kebangsaan, (2) Toleransi, (3) Anti-Kekerasan, dan (4) Akomodatif terhadap Budaya Lokal.
• Aktivitas Peserta Didik (4C: Critical Thinking & Collaboration):
  - Murid menelaah tabel 6 agama (Kitab Suci, Tempat Ibadah, Hari Besar Keagamaan, dan Pemimpin Ibadah).
  - Murid merumuskan argumen mengapa diskriminasi SARA (Suku, Agama, Ras, Antargolongan) bertentangan dengan Pancasila dan norma hukum.

Fase 4: Penyajian Solusi & Role Model Toleransi di Sekolah (15 Menit)
• Aktivitas Guru:
  - Guru memfasilitasi presentasi kelompok tentang tindakan nyata pencegahan intoleransi di sekolah.
• Aktivitas Peserta Didik (4C: Communication):
  - Kelompok memaparkan 5 Prinsip Pelajar Toleran:
    1. Memberi kesempatan teman beribadah sesuai agamanya tanpa mengganggu.
    2. Berteman dengan siapa saja tanpa membedakan warna kulit, ras, atau latar belakang ekonomi.
    3. Tidak mengejek tata cara ibadah atau logat bicara rekan sekelas.
    4. Menghormati perbedaan pendapat saat diskusi.
    5. Menjaga kerukunan dan saling tolong-menolong saat tertimpa musibah.

Fase 5: Refleksi & Komitmen Bhinneka Tunggal Ika (10 Menit)
• Aktivitas Guru:
  - Guru menguatkan pemahaman bahwa keragaman adalah takdir Tuhan yang harus dirawat dengan cinta kasih dan persaudaraan kebangsaan (ukhuwah wathaniyah).
• Aktivitas Peserta Didik:
  - Murid menuliskan pesan persahabatan tanpa sekat di selembar kartu komitmen toleransi.`,
            kegiatanPenutup: '1. Uji Kompetensi Bab IV (5 Menit):\n   - Pengerjaan evaluasi pemahaman Bab IV pada Buku Siswa Hal. 116.\n2. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Sebutkan 6 agama yang diakui secara resmi di Indonesia.',
            asesmenFormatif: 'Penilaian lembar analisis kasus moderasi beragama pada LKPD 4.B.',
            asesmenSumatif: 'Uji Kompetensi Bab 4 Keberagaman Indonesia.',
            remedial: 'Membuat tabel 6 agama di Indonesia (nama agama, kitab suci, tempat ibadah, dan hari besar).',
            pengayaan: 'Membuat esai "Indahnya Berbagi dan Bertoleransi di Lingkungan Sekolah".',
            lkpdTitle: 'LKPD 4.B: Menjaga Moderasi Beragama & Kerukunan Hidup Bermasyarakat',
            lkpdInstructions: [
              'Pelajari materi Keragaman Agama, Ras, dan Antargolongan pada Buku Siswa Hal. 105–115.',
              'Analisis pentingnya sikap toleransi dalam Pasal 29 Ayat 2 UUD 1945.',
              'Jawablah pertanyaan evaluasi toleransi di bawah ini!'
            ],
            lkpdQuestions: [
              'Tuliskan isi Pasal 29 Ayat 2 UUD NRI Tahun 1945 tentang jaminan kemerdekaan beragama!',
              'Jelaskan 4 kelompok ras utama yang ada dalam masyarakat Indonesia beserta ciri fisiknya!',
              'Tuliskan 3 contoh perilaku toleran antarteman yang berbeda agama di sekolah!'
            ],
            glosarium: 'Toleransi: Sikap saling menghormati dan menghargai perbedaan; Ras: Pengelompokan manusia berdasarkan ciri-ciri fisik biologis; Moderasi Beragama: Cara pandang keagamaan yang moderat, tidak ekstrem, dan menjunjung nilai kemanusiaan.',
            daftarPustaka: 'Kementerian Agama RI. (2019). Moderasi Beragama. Jakarta: Badan Litbang dan Diklat Kemenag RI.'
          }
        ]
      },

      // ══════════════════════════════════════════════════════════════
      // BAB 5: MENGHARGAI LINGKUNGAN & BUDAYA LOKAL (SEMESTER 2)
      // ══════════════════════════════════════════════════════════════
      {
        id: 'bab-5-pkn-7',
        babNumber: 5,
        semester: 2,
        title: 'Bab V: Menghargai Lingkungan dan Budaya Lokal',
        description: 'Mengenal bentang alam sekitar, situs budaya lokal, tradisi, makanan tradisional, produk & jasa lokal, serta gerakan mencintai produk buatan bangsa sendiri.',
        elemen: 'Bhinneka Tunggal Ika',
        subBabList: [
          {
            id: 'sub-5a',
            code: '5.A',
            title: 'Sub-Bab A: Mengenal Lingkungan Sekitar & Budaya Lokal',
            pages: 'Hal. 119 – 132',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-13)',
            modelPembelajaran: 'Contextual Teaching and Learning (CTL) & Eksplorasi Lingkungan',
            tujuanPembelajaran: 'Mengidentifikasi potensi flora, fauna, bentang alam, situs sejarah lokal, dan tradisi kearifan lokal di sekitar tempat tinggal peserta didik.',
            pemahamanBermakna: 'Mencintai tanah air dimulai dari kepedulian terhadap kebersihan lingkungan sekitar, kelestarian alam, dan penghargaan terhadap warisan budaya di kampung halaman.',
            pertanyaanPemantik: [
              'Situs bersejarah atau tempat wisata alam apa saja yang ada di daerah tempat tinggalmu?',
              'Tradisi adat apa yang masih rutin dilakukan oleh masyarakat di sekitarmu?',
              'Bagaimana cara kita menjaga kebersihan sungai, taman, dan lingkungan sekolah?'
            ],
            p3Dimensions: ['Gotong Royong', 'Mandiri', 'Kreatif'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 119-132, Foto Pemandangan Alam & Situs Budaya Lokal Terdekat, LKPD 5.A.',
            kegiatanAwal: '1. Salam, Doa & Sapa Lingkungan (5 Menit):\n   - Guru menyapa murid dan mengamati keasrian halaman sekolah.\n2. Apersepsi Kontekstual (5 Menit):\n   - Guru menanyakan: "Siapa yang tahu nama sungai terdekat, nama bukit, atau bangunan tua peninggalan masa lalu yang ada di sekitar kecamatan kita?"\n3. Tujuan Pembelajaran (3 Menit): Mengenal lingkungan alam dan situs budaya lokal.',
            kegiatanInti: `Fase 1: Modeling & Pengamatan Kontekstual (10 Menit)
• Aktivitas Guru:
  - Guru menjelaskan pentingnya mengenal 3 pilar lingkungan lokal: (1) Lingkungan Fisik/Bentang Alam (sungai, danau, pesisir, gunung), (2) Flora & Fauna Khas Daerah, (3) Situs Sejarah & Cagar Budaya Lokal.
• Aktivitas Peserta Didik:
  - Murid mencermati ilustrasi Buku Siswa Hal. 119–123 dan mendata elemen lingkungan yang ada di sekitar tempat tinggal mereka.

Fase 2: Mengorganisasikan Riset Mini Lingkungan Sekitar (10 Menit)
• Aktivitas Guru:
  - Guru membagikan lembar inventarisasi LKPD 5.A dan membagi murid ke dalam kelompok penjelajah lokal.
• Aktivitas Peserta Didik:
  - Murid membagi fokus penelusuran: (a) Bentang alam & ancaman pencemaran sampah, (b) Situs sejarah / makam tokoh / bangunan kolonial / rumah adat lokal, (c) Cerita rakyat (folklore) dan tradisi turun-temurun.

Fase 3: Investigasi Terbimbing & Pengumpulan Data Kearifan Lokal (15 Menit)
• Aktivitas Guru (Bimbingan Berdiferensiasi):
  - Guru memfasilitasi murid mengingat kembali tradisi adat di desa mereka (seperti tradisi sedekah bumi, menakik getah, petik laut, ruwatan, atau rewang).
• Aktivitas Peserta Didik (4C: Critical Thinking & Collaboration):
  - Murid menggali nilai kearifan lokal (local wisdom) yang terkandung di dalam tradisi tersebut: nilai menjaga kelestarian alam, tidak serakah menebang pohon, dan saling menolong antartetangga.
  - Murid menganalisis solusi mengatasi masalah sampah plastik di lingkungan sekitar sekolah.

Fase 4: Penyusunan "Peta Jejak Budaya & Alam Lokal" (15 Menit)
• Aktivitas Guru:
  - Guru membimbing murid menyusun laporan peta jejak budaya dalam bentuk infografis atau peta konsep visual.
• Aktivitas Peserta Didik (4C: Creativity & Communication):
  - Kelompok menggambar denah persebaran potensi alam dan situs sejarah daerah mereka serta menuliskan rekomendasi aksi pelestarian lingkungan.

Fase 5: Presentasi & Rencana Aksi Peduli Lingkungan (10 Menit)
• Aktivitas Guru:
  - Guru mengapresiasi kepedulian murid dan merangkum temuan penting.
• Aktivitas Peserta Didik:
  - Murid merumuskan 3 aksi nyata harian: mengurangi kantong plastik sekali pakai, membuang sampah pada tempatnya, dan merawat tanaman di sekolah.`,
            kegiatanPenutup: '1. Refleksi Kecintaan Kampung Halaman (5 Menit):\n   - Murid menuliskan apa yang paling mereka banggakan dari daerah kelahirannya.\n2. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Sebutkan 1 nama tempat bersejarah atau cerita legenda di daerahmu.',
            asesmenFormatif: 'Penilaian peta jejak budaya lokal dan lembar kerja LKPD 5.A.',
            asesmenSumatif: 'Kuis kearifan lokal dan pelestarian lingkungan.',
            remedial: 'Menuliskan 3 tradisi lokal di daerah tempat tinggal beserta maknanya.',
            pengayaan: 'Membuat video pendek/vlog promosi situs sejarah lokal berdurasi 1 menit.',
            lkpdTitle: 'LKPD 5.A: Inventarisasi Situs Budaya & Kearifan Lokal Daerahku',
            lkpdInstructions: [
              'Pelajari materi Mengenal Lingkungan dan Budaya Lokal pada Buku Siswa Hal. 119–130.',
              'Data potensi bentang alam, situs sejarah, dan tradisi yang ada di daerahmu.',
              'Isi lembar kerja eksplorasi di bawah ini!'
            ],
            lkpdQuestions: [
              'Sebutkan 2 contoh situs sejarah atau peninggalan budaya yang ada di daerah tempat tinggalmu!',
              'Jelaskan makna filosofis dari salah satu tradisi adat yang masih dilestarikan oleh masyarakat sekitar!',
              'Tuliskan 3 aksi nyata yang dapat kamu lakukan untuk menjaga kelestarian lingkungan hidup di sekitarmu!'
            ],
            glosarium: 'Kearifan Lokal: Tata nilai atau perilaku hidup masyarakat lokal dalam berinteraksi dengan lingkungan secara bijak; Situs Sejarah: Lokasi ditemukannya peninggalan bersejarah masa lampau.',
            daftarPustaka: 'Sibarani, Robert. (2012). Kearifan Lokal: Hakikat, Peran, dan Metode Tradisi Lisan. Jakarta: Asosiasi Tradisi Lisan.'
          },
          {
            id: 'sub-5b',
            code: '5.B',
            title: 'Sub-Bab B: Menghargai Makanan Tradisional & Produk Lokal',
            pages: 'Hal. 133 – 144',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-14)',
            modelPembelajaran: 'Project Based Learning (PjBL) Promosi Produk Kreatif UMKM Lokal',
            tujuanPembelajaran: 'Menghargai kekayaan kuliner tradisional Nusantara, mendukung produk kerajinan UMKM lokal, serta menerapkan gerakan Bangga Buatan Indonesia.',
            pemahamanBermakna: 'Mengkonsumsi makanan tradisional dan menggunakan produk buatan dalam negeri memperkuat kedaulatan ekonomi rakyat dan identitas budaya bangsa.',
            pertanyaanPemantik: [
              'Makanan khas tradisional apa yang paling kamu sukai dari daerahmu?',
              'Mengapa kita harus bangga membeli dan menggunakan produk buatan bangsa sendiri daripada produk impor?',
              'Bagaimana cara kreatif mempromosikan kuliner tradisional agar diminati generasi muda?'
            ],
            p3Dimensions: ['Kreatif', 'Mandiri', 'Bernalar Kritis'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 133-144, Contoh Kemasan/Foto Produk Kerajinan Lokal & Kuliner Daerah, LKPD 5.B.',
            kegiatanAwal: '1. Salam, Doa & Ceria Kuliner (5 Menit).\n2. Apersepsi Gambar Makanan Nusantara (5 Menit):\n   - Guru menampilkan aneka kuliner khas Nusantara (Rendang, Gudeg, Papeda, Pempek, Kerak Telor, Soto, Lempuk Durian) dan produk kerajinan anyaman/batik.\n   - Guru bertanya: "Mengapa Rendang dan Nasi Goreng Indonesia dinobatkan sebagai makanan terlezat di dunia?"\n3. Tujuan Proyek (3 Menit): Merancang poster promosi Bangga Produk Indonesia.',
            kegiatanInti: `Fase 1: Penentuan Proyek Promosi Kuliner & Produk Lokal (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan materi Buku Siswa Hal. 133–138 tentang ragam makanan tradisional, minuman herbal khas (jamu, wedang jahe, bajigur), serta kerajinan UMKM lokal.
  - Guru meluncurkan Gerakan Nasional "Bangga Buatan Indonesia" (BBI) sebagai benteng kedaulatan ekonomi bangsa.
• Aktivitas Peserta Didik:
  - Murid memilih 1 makanan tradisional khas daerah atau 1 produk kerajinan UMKM lokal untuk dijadikan objek proyek kampanye kreatif.

Fase 2: Perancangan Desain Media Iklan / Kampanye (10 Menit)
• Aktivitas Guru:
  - Guru membagikan LKPD 5.B dan memberikan panduan elemen iklan yang menarik: (1) Nama Produk & Asal Daerah, (2) Bahan Baku Alami & Keunggulan Gizi/Kualitas, (3) Filosofi Tradisi di baliknya, (4) Slogan Ajakan Persuasif yang menggugah.
• Aktivitas Peserta Didik:
  - Murid dalam kelompok menyusun konsep sketsa iklan poster promosi di atas kertas karton atau lembar kerja LKPD.

Fase 3: Pelaksanaan & Pembuatan Media Promosi (15 Menit)
• Aktivitas Guru (Pendampingan Berkelanjutan):
  - Guru berkeliling memberikan masukan atas kreativitas slogan dan ilustrasi visual murid (P3: Kreatif & Mandiri).
• Aktivitas Peserta Didik (4C: Creativity & Collaboration):
  - Murid mendesain poster promosi: mewarnai, menambahkan informasi harga terjangkau, keunikan cita rasa, serta logo "Bangga Buatan Indonesia".
  - Murid berlatih menyusun narasi promosi lisan (pitching) berdurasi 1 menit layaknya duta UMKM daerah.

Fase 4: Presentasi Kampanye Iklan Produk Lokal (15 Menit)
• Aktivitas Guru:
  - Guru memfasilitasi sesi "Festival Iklan Produk Kreatif Nusantara".
• Aktivitas Peserta Didik (4C: Communication):
  - Setiap kelompok mempresentasikan poster iklannya di depan kelas dengan gaya persuasif yang menarik.
  - Kelompok lain bertindak sebagai konsumen dan memberikan ulasan apresiatif.

Fase 5: Evaluasi Pengalaman & Refleksi Kedaulatan Ekonomi (10 Menit)
• Aktivitas Guru:
  - Guru menekankan dampak luar biasa jika generasi muda membiasakan jajan kuliner tradisional dan membeli produk lokal: pedagang kecil terbantu, lapangan kerja terbuka, dan devisa negara terjaga.
• Aktivitas Peserta Didik:
  - Murid berkomitmen memprioritaskan konsumsi produk buatan bangsa sendiri.`,
            kegiatanPenutup: '1. Evaluasi & Uji Kompetensi Bab V (5 Menit):\n   - Pengerjaan latihan Bab V pada Buku Siswa Hal. 143.\n2. Refleksi Cinta Produk Indonesia (3 Menit).\n3. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Sebutkan 3 nama makanan tradisional dari berbagai daerah di Indonesia.',
            asesmenFormatif: 'Penilaian desain poster promosi kuliner/produk lokal pada LKPD 5.B.',
            asesmenSumatif: 'Uji Kompetensi Bab 5 Menghargai Lingkungan dan Budaya Lokal.',
            remedial: 'Menuliskan 5 daftar makanan tradisional beserta daerah asalnya.',
            pengayaan: 'Menulis ulasan (review) kuliner tradisional lokal yang pernah dicicipi beserta keunikannya.',
            lkpdTitle: 'LKPD 5.B: Desain Promosi Kuliner Tradisional & Produk Kreatif Lokal',
            lkpdInstructions: [
              'Pelajari materi Menghargai Makanan Tradisional dan Produk Lokal pada Buku Siswa Hal. 133–142.',
              'Pilih 1 makanan tradisional atau produk kerajinan khas daerahmu.',
              'Rancang narasi promosi kreatif pada kolom yang disediakan!'
            ],
            lkpdQuestions: [
              'Tuliskan keistimewaan dan bahan baku utama dari 1 makanan tradisional yang kamu pilih!',
              'Jelaskan dampak positif bagi perekonomian masyarakat jika kita membiasakan membeli produk lokal UMKM!',
              'Apa slogan ajakan yang kamu buat untuk mengampanyekan Gerakan Bangga Buatan Indonesia?'
            ],
            glosarium: 'Kuliner Tradisional: Makanan dan minuman khas warisan turun temurun suatu daerah; UMKM: Usaha Mikro, Kecil, dan Menengah yang dikelola masyarakat; Gerakan Bangga Buatan Indonesia: Gerakan nasional mencintai produk negeri sendiri.',
            daftarPustaka: 'Kementerian Perdagangan RI. (2020). Bangga Buatan Indonesia: Panduan Pemberdayaan Produk Dalam Negeri. Jakarta: Kemendag.'
          }
        ]
      },

      // ══════════════════════════════════════════════════════════════
      // BAB 6: BEKERJA SAMA & BERGOTONG ROYONG (SEMESTER 2)
      // ══════════════════════════════════════════════════════════════
      {
        id: 'bab-6-pkn-7',
        babNumber: 6,
        semester: 2,
        title: 'Bab VI: Bekerja Sama dan Bergotong Royong',
        description: 'Membahas nilai luhur gotong royong sebagai jati diri bangsa, tradisi gotong royong di berbagai daerah (sambatan, gugur gunung, subak), landasan karakter, serta penerapannya di sekolah dan masyarakat.',
        elemen: 'Pancasila',
        subBabList: [
          {
            id: 'sub-6a',
            code: '6.A',
            title: 'Sub-Bab A: Nilai Luhur dan Tradisi Gotong Royong Nusantara',
            pages: 'Hal. 145 – 156',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-15)',
            modelPembelajaran: 'Discovery Learning & Analisis Nilai Budaya Nusantara',
            tujuanPembelajaran: 'Menganalisis nilai penting gotong royong sebagai intisari Pancasila (ekasila Bung Karno) dan tradisi gotong royong di berbagai suku (Sambatan, Gugur Gunung, Subak, Mapalus, Siadapari).',
            pemahamanBermakna: 'Gotong royong adalah jiwa dan intisari Pancasila yang membuat pekerjaan berat menjadi ringan dan mempererat ikatan persaudaraan kebangsaan.',
            pertanyaanPemantik: [
              'Mengapa Bung Karno menyatakan bahwa jika Pancasila diperas menjadi satu sila, maka intinya adalah "Gotong Royong"?',
              'Tradisi gotong royong apa saja yang ada di daerah-daerah Indonesia (seperti Gugur Gunung di Jawa, Subak di Bali, Mapalus di Minahasa)?',
              'Apa perbedaan antara gotong royong tolong-menolong dengan gotong royong kerja bakti?'
            ],
            p3Dimensions: ['Gotong Royong', 'Beriman & Bertakwa kepada Tuhan YME', 'Bernalar Kritis'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 145-156, Video Tradisi Pindah Rumah Adat (Mappalette Bola) di Sulawesi, LKPD 6.A.',
            kegiatanAwal: '1. Salam, Doa & Presensi (5 Menit).\n2. Apersepsi Video Gotong Royong Unik (5 Menit):\n   - Guru memutarkan video tradisi Mappalette Bola suku Bugis (ratusan warga mengangkat satu rumah kayu panggung dan memindahkannya bersama-sama).\n   - Guru bertanya: "Mungkinkah satu rumah besar dipindahkan tanpa kerja sama dan gotong royong ratusan orang?"\n3. Tujuan Pembelajaran (3 Menit): Meneladani tradisi gotong royong Nusantara.',
            kegiatanInti: `Fase 1: Stimulasi / Pemberian Rangsangan (10 Menit)
• Aktivitas Guru:
  - Guru mengutip pidato Bung Karno 1 Juni 1945: "Pancasila jika diperas menjadi Tri Sila adalah Sosio-Nasionalisme, Sosio-Demokrasi, dan Ketuhanan; dan jika diperas menjadi Eka Sila adalah Gotong Royong!".
  - Guru menjelaskan perbedaan Gotong Royong Tolong-Menolong (kegiatan pertanian, hajatan, kedukaan) dan Gotong Royong Kerja Bakti (membersihkan selokan desa, membangun jembatan).
• Aktivitas Peserta Didik:
  - Murid membaca materi Buku Siswa Hal. 145–149.

Fase 2: Identifikasi Masalah & Pemetaan Tradisi Antardaerah (10 Menit)
• Aktivitas Guru:
  - Guru membagikan LKPD 6.A berisi tabel eksplorasi tradisi gotong royong di berbagai kepulauan.
• Aktivitas Peserta Didik:
  - Murid dalam kelompok bertugas menelusuri 6 tradisi gotong royong khas Nusantara:
    1. Tradisi Sambatan / Gugur Gunung (Masyarakat Jawa).
    2. Tradisi Subak (Sistem pembagian air pertanian di Bali).
    3. Tradisi Siadapari / Marsialapari (Kerja sama memanen padi suku Batak, Sumatera Utara).
    4. Tradisi Mapalus (Tolong menolong tolak bahaya & panen suku Minahasa, Sulawesi Utara).
    5. Tradisi Pawonda / Pomaa (Gotong royong membuka ladang di Nusa Tenggara & Sulawesi Tenggara).
    6. Tradisi Helem Hoi Rouk (Gotong royong membangun rumah suku Dani di Papua).

Fase 3: Pengumpulan Data & Telaah Nilai Filosofis (15 Menit)
• Aktivitas Guru (Bimbingan Mendalam):
  - Guru membimbing murid memahami nilai luhur yang terkandung: keikhlasan, tanpa pamrih, kebersamaan, dan musyawarah.
• Aktivitas Peserta Didik (4C: Critical Thinking & Collaboration):
  - Murid mencatat prosedur pelaksanaan masing-masing tradisi, nilai sosial yang dijaga, dan manfaat nyata bagi keharmonisan desa.
  - Murid melengkapi Matriks Tradisi Gotong Royong pada LKPD 6.A.

Fase 4: Pengolahan Data & Pemaparan Hasil Telaah (15 Menit)
• Aktivitas Guru:
  - Guru memandu presentasi silang antarkelompok.
• Aktivitas Peserta Didik (4C: Communication):
  - Kelompok mempresentasikan hasil telaah tradisi gotong royong daerah dan membandingkannya dengan fenomena individualisme di era digital.
  - Murid merumuskan cara melestarikan semangat gotong royong di kalangan generasi Z.

Fase 5: Generalisasi & Penegasan Karakter Gotong Royong (10 Menit)
• Aktivitas Guru:
  - Guru menggarisbawahi bahwa gotong royong adalah DNA asli bangsa Indonesia yang menjadi modal sosial terbesar dalam menghadapi berbagai krisis dan bencana alam.
• Aktivitas Peserta Didik:
  - Murid menyimpulkan bahwa kebersamaan selalu melipatgandakan kekuatan dan meringankan beban seberat apa pun.`,
            kegiatanPenutup: '1. Refleksi Nilai Gotong Royong (5 Menit):\n   - Murid menceritakan 1 pengalaman berkesan saat menolong tetangga atau teman tanpa mengharap imbalan.\n2. Doa dan salam penutup (2 Menit).',
            asesmenDiagnostik: 'Tanya jawab mengenai pengalaman pernah ikut kerja bakti di lingkungan RT/RW.',
            asesmenFormatif: 'Penilaian lembar identifikasi tradisi gotong royong daerah pada LKPD 6.A.',
            asesmenSumatif: 'Kuis istilah-istilah tradisi gotong royong Nusantara.',
            remedial: 'Menjelaskan pengertian gotong royong dan menyebutkan 3 contohnya di masyarakat.',
            pengayaan: 'Menulis artikel deskriptif tentang tradisi kerja sama khas suku daerah masing-masing.',
            lkpdTitle: 'LKPD 6.A: Telusur Ragam Tradisi Gotong Royong di Berbagai Daerah Nusantara',
            lkpdInstructions: [
              'Pelajari materi Tradisi Gotong Royong pada Buku Siswa Halaman 145–154.',
              'Identifikasi nama tradisi gotong royong, daerah asal, dan bentuk kegiatannya.',
              'Jawablah pertanyaan telaah gotong royong berikut!'
            ],
            lkpdQuestions: [
              'Jelaskan mengapa gotong royong disebut sebagai intisari dan kepribadian asli bangsa Indonesia!',
              'Sebutkan 4 nama tradisi gotong royong dari berbagai daerah di Indonesia beserta daerah asalnya!',
              'Apa manfaat sosial yang dirasakan masyarakat ketika memelihara budaya gotong royong?'
            ],
            glosarium: 'Gotong Royong: Bekerja bersama-sama untuk mencapai suatu hasil yang didambakan; Sambatan: Tradisi gotong royong tolong menolong membangun rumah di Jawa; Subak: Sistem gotong royong irigasi pertanian di Bali; Mapalus: Tradisi tolong-menolong suku Minahasa.',
            daftarPustaka: 'Koentjaraningrat. (1984). Kebudayaan Jawa: Gotong Royong dan Pola Kerja Sama. Jakarta: Balai Pustaka.'
          },
          {
            id: 'sub-6b',
            code: '6.B',
            title: 'Sub-Bab B: Penerapan Gotong Royong & Karakter Kerja Sama',
            pages: 'Hal. 157 – 170',
            alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-16)',
            modelPembelajaran: 'Project Based Learning (PjBL) Aksi Nyata Gotong Royong Sekolah',
            tujuanPembelajaran: 'Merancang dan mempraktikkan aksi gotong royong di lingkungan sekolah (kebersihan, penghijauan, bakti sosial) serta mewujudkan revolusi mental (etos kerja dan integritas).',
            pemahamanBermakna: 'Karakter gotong royong sejati dibuktikan melalui aksi nyata saling membantu, peduli terhadap sesama, dan menjaga kenyamanan lingkungan belajar bersama.',
            pertanyaanPemantik: [
              'Bagaimana wujud nyata kerja sama yang dapat kalian terapkan dalam regu piket kelas?',
              'Apa hambatan yang sering muncul saat bekerja kelompok dan bagaimana cara mengatasinya?',
              'Bagaimana gotong royong dapat membantu teman yang sedang mengalami musibah atau kesulitan belajar?'
            ],
            p3Dimensions: ['Gotong Royong', 'Mandiri', 'Beriman & Bertakwa kepada Tuhan YME'],
            sarpras: 'Buku Siswa Kemendikbud Hal. 157-170, Peralatan Kebersihan Kelas, Bibit Tanaman Hias, LKPD 6.B Lembar Rencana Aksi.',
            kegiatanAwal: '1. Salam, Doa & Cek Kesiapan (5 Menit).\n2. Apersepsi Reflektif (5 Menit):\n   - Guru menanyakan: "Bagaimana perasaan kalian jika kelas kita bersih, hijau, tertata rapi karena hasil keringat dan kerja sama kita sendiri?"\n3. Tujuan Proyek Aksi Nyata (3 Menit): Melaksanakan proyek gotong royong kelas.',
            kegiatanInti: `Fase 1: Penentuan Proyek Aksi Nyata Gotong Royong (10 Menit)
• Aktivitas Guru:
  - Guru menguraikan 4 pilar penerapan gotong royong menurut Buku Siswa Hal. 157–163:
    1. Gotong Royong di Lingkungan Keluarga (membantu pekerjaan rumah, merawat anggota keluarga sakit).
    2. Gotong Royong di Lingkungan Sekolah (piket kebersihan, menata perpustakaan, tutor sebaya).
    3. Gotong Royong di Lingkungan Masyarakat (kerja bakti RT, siskamling, tanggap darurat bencana).
    4. Gotong Royong di Lingkungan Berbangsa & Bernegara (taat membayar pajak, mematuhi hukum).
  - Guru mengajak murid menyepakati proyek aksi nyata di lingkungan sekolah.
• Aktivitas Peserta Didik:
  - Murid memilih salah satu tema aksi: (a) Revitalisasi Pojok Baca & Kebersihan Kelas, (b) Program Taman Hijau Sekolah (Go Green), atau (c) Gerakan Kotak Infaq & Peduli Sahabat Sebaya.

Fase 2: Perencanaan Langkah-Langkah & Pembagian Tugas (10 Menit)
• Aktivitas Guru:
  - Guru membagikan lembar LKPD 6.B Rencana Aksi Gotong Royong dan memastikan pembagian peran adil dan merata.
• Aktivitas Peserta Didik (4C: Collaboration):
  - Murid membagi tugas spesifik dalam kelompok: koordinator perlengkapan, pelaksana lapangan, dokumentator, dan penyusun laporan evaluasi.

Fase 3: Pelaksanaan Aksi Nyata Gotong Royong Terbimbing (20 Menit)
• Aktivitas Guru (Observasi Kinerja & Pendampingan):
  - Guru mengawasi jalannya aksi gotong royong di area kelas/taman sekolah, menilai rubrik sikap gotong royong, kepedulian, dan etos kerja murid.
• Aktivitas Peserta Didik (P3: Gotong Royong & Mandiri):
  - Seluruh murid bekerja sama secara aktif: membersihkan kaca, mengepel lantai, menata buku literasi, menyiram dan menata pot tanaman hias, serta mengumpulkan donasi sukarela.
  - Murid saling membantu tanpa mengeluh dan saling menyemangati.

Fase 4: Monitoring Hasil dan Pembuatan Laporan Refleksi (10 Menit)
• Aktivitas Guru:
  - Guru mengajak murid kembali ke ruang kelas yang kini sudah bersih dan asri.
• Aktivitas Peserta Didik (4C: Communication & Critical Thinking):
  - Murid mendokumentasikan foto "Sebelum (Before) vs Sesudah (After)" pada lembar LKPD 6.B.
  - Kelompok merumuskan refleksi: "Apa tantangan yang dihadapi dan bagaimana rasa bahagia yang didapat setelah bergotong royong?"

Fase 5: Evaluasi Pengalaman & Selebrasi Keberhasilan (10 Menit)
• Aktivitas Guru:
  - Guru memberikan apresiasi setinggi-tingginya kepada seluruh kelas atas kerja keras dan kekompakan yang ditunjukkan.
• Aktivitas Peserta Didik:
  - Murid bertepuk tangan bersama merayakan keberhasilan ruang belajar yang nyaman dan asri.`,
            kegiatanPenutup: '1. Uji Kompetensi Akhir Tahun / Bab VI (5 Menit):\n   - Pengerjaan soal uji pemahaman akhir tahun pada Buku Siswa Hal. 169.\n2. Pesan Penutup & Motivasi Karakter Profil Pelajar Pancasila (3 Menit).\n3. Doa penutup dan salam kebangsaan (2 Menit).',
            asesmenDiagnostik: 'Sebutkan 2 contoh gotong royong yang pernah kamu lakukan di sekolah.',
            asesmenFormatif: 'Penilaian unjuk kerja aksi gotong royong dan lembar kerja LKPD 6.B.',
            asesmenSumatif: 'Uji Kompetensi Bab 6 Bekerja Sama dan Bergotong Royong.',
            remedial: 'Menuliskan 5 contoh kegiatan gotong royong di rumah dan di sekolah.',
            pengayaan: 'Menyusun proposal kegiatan bakti sosial peduli panti asuhan atau lingkungan sekitar sekolah.',
            lkpdTitle: 'LKPD 6.B: Perencanaan & Pelaksanaan Proyek Aksi Nyata Gotong Royong Siswa',
            lkpdInstructions: [
              'Pelajari materi Penerapan Gotong Royong pada Buku Siswa Halaman 157–168.',
              'Rancanglah 1 program aksi gotong royong sederhana yang dapat kalian laksanakan bersama di sekolah.',
              'Lengkapi lembar rencana aksi di bawah ini!'
            ],
            lkpdQuestions: [
              'Tuliskan nama kegiatan gotong royong yang dirancang kelompok beserta tujuannya!',
              'Bagaimana pembagian tugas antaranggota kelompok agar seluruh siswa berkontribusi aktif?',
              'Refleksikan manfaat apa yang kalian rasakan bagi diri sendiri dan kelas setelah gotong royong selesai dilaksanakan!'
            ],
            glosarium: 'Revolusi Mental: Gerakan perubahan cara berpikir, bersikap, dan bertindak menjadi lebih berintegritas dan beretos kerja; Aksi Nyata: Tindakan konkret penerapan nilai teori dalam kehidupan sehari-hari.',
            daftarPustaka: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2022). Panduan Penguatan Profil Pelajar Pancasila. Jakarta: BSKAP Kemendikbudristek.'
          }
        ]
      }
    ]
  },
  bukuSiswaKelas8Pancasila,
  bukuSiswaKelas9Pancasila
];

// Helper to find Buku Siswa subject by name & grade
export function findBukuSiswaSubject(subjectName: string, classGrade: 'VII' | 'VIII' | 'IX'): BukuSiswaSubject | undefined {
  const normName = subjectName.toLowerCase();
  return masterBukuSiswaData.find((b) => {
    const bNorm = b.subjectName.toLowerCase();
    const isSubjectMatch = normName.includes('pancasila') || normName.includes('pkn') || normName.includes('ppkn')
      ? bNorm.includes('pancasila') || bNorm.includes('pkn')
      : bNorm.includes(normName);
    return isSubjectMatch && b.classGrade === classGrade;
  });
}
