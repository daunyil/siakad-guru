import type { BukuSiswaSubject, BukuSiswaBab } from './bukuSiswaData';

export const bukuSiswaKelas9Pancasila: BukuSiswaSubject = {
  id: 'buku-pancasila-9',
  subjectName: 'Pendidikan Pancasila',
  classGrade: 'IX',
  bookTitle: 'Buku Panduan Guru dan Buku Siswa Pendidikan Pancasila SMP Kelas IX',
  authorPublisher: 'Kemendikbudristek RI - Pusat Perbukuan / BSKAP (Edisi Kurikulum Merdeka)',
  isbn: '978-602-244-889-1',
  babList: [
    // ══════════════════════════════════════════════════════════════
    // BAB 1: PANCASILA DALAM DINAMIKA ZAMAN (SEMESTER 1)
    // ══════════════════════════════════════════════════════════════
    {
      id: 'bab-1-pkn-9',
      babNumber: 1,
      semester: 1,
      title: 'Bab I: Pancasila sebagai Dasar Negara, Ideologi Terbuka, dan Pandangan Hidup dalam Dinamika Zaman',
      description: 'Menganalisis keterkaitan organis antarsila Pancasila, dinamika penerapan nilai Pancasila dari masa ke masa (awal kemerdekaan, Orde Lama, Orde Baru, Reformasi), serta perwujudan nilai Pancasila dalam menjawab tantangan era digital dan globalisasi.',
      elemen: 'Pancasila',
      subBabList: [
        {
          id: 'sub-9-1a',
          code: '1.A',
          title: 'Sub-Bab A: Keterkaitan dan Kesatuan Organis Antarsila Pancasila',
          pages: 'Hal. 1 – 12',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-1)',
          modelPembelajaran: 'Problem Based Learning (PBL) & Analisis Konsep Sistemik',
          tujuanPembelajaran: 'Menganalisis hubungan hierarkis piramidal dan kesatuan organis kelima sila Pancasila yang saling menjiwai dan tidak dapat dipisahkan satu sama lain.',
          pemahamanBermakna: 'Kelima sila Pancasila bukan pasal yang terpisah melainkan satu kesatuan sistem filsafat yang utuh; pelaksanaan satu sila senantiasa dijiwai dan menjiwai keempat sila lainnya.',
          pertanyaanPemantik: [
            'Mengapa kelima sila Pancasila tidak boleh dipisah-pisahkan atau diprioritaskan salah satunya saja?',
            'Bagaimana sila pertama (Ketuhanan YME) menjiwai pelaksanaan sila kemanusiaan, persatuan, kerakyatan, dan keadilan?',
            'Apa bahayanya jika seseorang menjalankan sila kemanusiaan tanpa berakar pada persatuan dan keadilan sosial?'
          ],
          p3Dimensions: ['Bernalar Kritis', 'Beriman & Bertakwa kepada Tuhan YME', 'Gotong Royong'],
          sarpras: 'Buku Siswa Kemendikbud Kelas IX Hal. 1-12, Diagram Piramida Hierarkis Pancasila, LCD Proyektor, Salinan Naskah Piagam Jakarta & UUD 1945, LKPD 1.A.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Guru menyapa murid dengan antusias, memimpin doa, memeriksa kesiapan dan presensi kelas.\n2. Apersepsi Analogis (5 Menit):\n   - Guru menampilkan analogi organ tubuh manusia (jantung, paru-paru, otak): "Jika salah satu organ berhenti bekerja, apa yang terjadi pada seluruh tubuh? Demikian pula kesatuan organis 5 sila Pancasila."\n3. Penyampaian Tujuan & Motivasi (3 Menit):\n   - Guru menyampaikan alur capaian pembelajaran dan manfaat penguasaan materi bagi pembentukan karakter kritis.',
          kegiatanInti: `Fase 1: Orientasi Siswa pada Masalah Filosofis Pancasila (10 Menit)
• Aktivitas Guru:
  - Guru menampilkan infografis hierarki piramidal Pancasila (sila 1 mendasari sila 2-5; sila 2 didasari sila 1 dan mendasari sila 3-5, dst).
  - Guru membimbing murid mencermati Buku Siswa Kelas IX Hal. 3–7 mengenai relasi antarsila.
• Aktivitas Murid (Diferensiasi Konten):
  - Murid visual mengkaji bagan relasi interdependensi antarsila Pancasila.
  - Murid tekstual/auditori menyimak studi kasus: penyalahgunaan dalih "kebebasan berpendapat" (sila 4) yang melanggar rasa kemanusiaan (sila 2) dan ketertiban persatuan (sila 3).

Fase 2: Pengorganisasian Kelompok Analisis Sistemik (10 Menit)
• Aktivitas Guru:
  - Guru membagi kelas ke dalam kelompok heterogen (4-5 murid) dan membagikan LKPD 1.A.
  - Guru memandu fokus diskusi: "Membuktikan bahwa pengamalan satu sila tanpa melibatkan sila lain akan memicu distorsi nilai."
• Aktivitas Murid:
  - Murid berbagi tugas: analisis relasi Sila 1 dengan Sila 2, Sila 2 dengan Sila 3, Sila 3 dengan Sila 4, dan Sila 4 dengan Sila 5.

Fase 3: Penyelidikan Kolaboratif Berbasis Kasus (15 Menit)
• Aktivitas Guru (Scaffolding):
  - Guru berkeliling memberikan pendampingan kelompok, membimbing penggunaan istilah 'organis', 'hierarkis-piramidal', dan 'saling menjiwai'.
• Aktivitas Murid (4C: Critical Thinking & Collaboration):
  - Murid mendiskusikan contoh konkret: pembangunan ekonomi (Sila 5) harus memperhatikan kelestarian alam dan martabat manusia (Sila 2) serta musyawarah warga terdampak (Sila 4).
  - Murid menyusun argumen sistemik pada lembar analisis.

Fase 4: Pemaparan Hasil & Diskusi Pleno (15 Menit)
• Aktivitas Guru:
  - Guru memfasilitasi presentasi silang antarkelompok dengan aturan saling menghargai pendapat.
• Aktivitas Murid (4C: Communication):
  - Tiap kelompok menyajikan hasil sintesis keterkaitan antarsila dengan simulasi diagram alur berpikir.
  - Kelompok mitra memberikan tanggapan komparatif.

Fase 5: Evaluasi & Refleksi Pemahaman Konseptual (10 Menit)
• Aktivitas Guru:
  - Guru meluruskan miskonsepsi dan menegaskan bahwa Pancasila adalah kesatuan bulat yang utuh (unitary whole).
• Aktivitas Murid:
  - Murid merumuskan 1 kesimpulan filosofis penting tentang keutuhan Pancasila dalam jurnal belajar.`,
          kegiatanPenutup: '1. Rangkuman Bersama (5 Menit):\n   - Guru bersama murid merangkum intisari relasi hierarkis-piramidal Pancasila.\n2. Refleksi & Penugasan (5 Menit):\n   - Murid menjawab lembar refleksi 3-2-1 (3 konsep dipahami, 2 hal menarik, 1 pertanyaan lanjutan).\n   - Guru menginformasikan materi Sub-Bab B: Dinamika Penerapan Pancasila dari Masa ke Masa dan menutup dengan doa.',
          asesmenDiagnostik: 'Tes lisan awal: Sebutkan urutan sila Pancasila dan jelaskan lambang masing-masing sila beserta maknanya.',
          asesmenFormatif: 'Observasi keaktifan diskusi, lembar telaah relasi hierarkis piramidal LKPD 1.A, dan rubrik presentasi.',
          asesmenSumatif: 'Uji pemahaman esai analitis: Membedah kasus kebijakan publik yang mengabaikan salah satu sila Pancasila.',
          remedial: 'Bimbingan terfokus menyusun peta konsep hierarki piramidal 5 sila dengan bantuan kartu kata kunci.',
          pengayaan: 'Menulis esai reflektif: "Tinjauan Kritis Keadilan Ekologis dalam Perspektif Kesatuan Sila 1 hingga Sila 5 Pancasila".',
          lkpdTitle: 'LKPD 1.A: Analisis Kesatuan Organis & Hierarkis Piramidal Sila-Sila Pancasila',
          lkpdInstructions: [
            'Cermati materi Buku Siswa Kelas IX Hal. 2–8 tentang relasi antarsila Pancasila.',
            'Lakukan kajian kelompok terhadap kasus kebijakan publik di sekitar kalian.',
            'Jawablah pertanyaan analisis dan lengkapi bagan hierarkis antarsila dengan argumen logis.'
          ],
          lkpdQuestions: [
            'Jelaskan makna konsep bahwa kelima sila Pancasila bersifat hierarkis-piramidal!',
            'Bagaimana cara membuktikan bahwa Sila Pertama (Ketuhanan YME) melandasi dan menjiwai Sila Kedua (Kemanusiaan yang Adil dan Beradab)?',
            'Berikan 1 contoh konkret kebijakan atau tindakan di masyarakat yang tampak menjunjung demokrasi (Sila 4) namun merusak persatuan (Sila 3) atau keadilan (Sila 5)!'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-1a-kasus',
              type: 'studi_kasus',
              badge: 'Studi Kasus Kontekstual',
              title: 'LKPD 1.A-1: Bedah Kasus Kebijakan Publik & Keseimbangan Antarsila',
              instructions: [
                'Baca artikel studi kasus pembangunan fasilitas umum di daerah padat penduduk.',
                'Diskusikan bagaimana perencana kebijakan harus menyeimbangkan kepentingan ekonomi (Sila 5), musyawarah warga (Sila 4), dan kemanusiaan (Sila 2).',
                'Rumuskan rekomendasi solusi terpadu berlandaskan Pancasila.'
              ],
              questions: [
                'Identifikasi sila-sila mana saja yang paling rentan terabaikan dalam studi kasus tersebut!',
                'Mengapa musyawarah mufakat (Sila 4) harus tetap berpijak pada keadilan sosial bagi seluruh rakyat (Sila 5)?',
                'Susun 3 butir rekomendasi kebijakan yang mencerminkan keselarasan kelima sila Pancasila secara utuh!'
              ],
              targetRubrik: [
                {
                  kriteria: 'Ketajaman Analisis Relasi Sila',
                  skor4: 'Mampu menghubungkan 5 sila secara komprehensif dengan bukti konkret yang relevan.',
                  skor3: 'Mampu menghubungkan minimal 3-4 sila dengan argumen logis.',
                  skor2: 'Hanya menganalisis 1-2 sila secara terpisah tanpa melihat keterkaitan sistemik.',
                  skor1: 'Belum mampu menunjukkan hubungan antarsila dalam kasus.'
                },
                {
                  kriteria: 'Kualitas Rekomendasi Solusi',
                  skor4: 'Rekomendasi sangat solutif, adil, realistis, dan berakar kuat pada nilai Pancasila.',
                  skor3: 'Rekomendasi realistis dan memuat nilai-nilai Pancasila dengan baik.',
                  skor2: 'Rekomendasi bersifat normatif umum tanpa langkah konkret.',
                  skor1: 'Rekomendasi tidak relevan dengan permasalahan kasus.'
                }
              ]
            },
            {
              id: 'lkpd-9-1a-peta',
              type: 'proyek_kreatif',
              badge: 'Peta Konsep & Mind Map',
              title: 'LKPD 1.A-2: Desain Mind Map Sistematis Hierarki Pancasila',
              instructions: [
                'Gunakan selembar kertas/kanvas gambar untuk merancang Peta Pikiran (Mind Map) relasi 5 sila Pancasila.',
                'Gambarkan hubungan saling menjiwai dan mendasari antarsetiap sila menggunakan tanda panah dan kata kunci.',
                'Sertakan contoh perilaku nyata pelajar SMP untuk setiap irisan antarsila.'
              ],
              questions: [
                'Tuliskan kata kunci filosofis untuk menggambarkan keterkaitan Sila 1 -> Sila 2 -> Sila 3 -> Sila 4 -> Sila 5!',
                'Apa perbedaan mendasar antara memandang Pancasila sebagai sila terpisah dibanding memandangnya sebagai kesatuan organis?',
                'Tuliskan 1 komitmen diri dalam mengamalkan kelima sila secara serempak di lingkungan sekolah!'
              ],
              targetRubrik: [
                {
                  kriteria: 'Kelengkapan & Kejelasan Konsep',
                  skor4: 'Peta pikiran memuat seluruh 5 sila dan garis keterkaitan dengan sangat terstruktur dan detail.',
                  skor3: 'Peta pikiran terstruktur rapi dan memuat hubungan antarsila dengan baik.',
                  skor2: 'Peta pikiran memuat 5 sila namun garis keterkaitan belum jelas.',
                  skor1: 'Peta pikiran belum selesai atau hanya menyalin teks tanpa struktur.'
                }
              ]
            }
          ],
          glosarium: 'Hierarkis-Piramidal: Urutan tingkatan sila Pancasila yang menunjukkan bahwa sila sebelumnya mendasari dan menjiwai sila-sila sesudahnya; Organis: Bersifat satu kesatuan hidup yang bagian-bagiannya saling bergantung; Grundnorm: Norma dasar tertinggi yang menjadi sumber hukum.',
          daftarPustaka: 'Alwi Lutfi, M., dkk. (2022). Buku Panduan Guru dan Siswa Pendidikan Pancasila SMP Kelas IX. Jakarta: Pusat Kurikulum dan Perbukuan Kemendikbudristek RI.'
        },
        {
          id: 'sub-9-1b',
          code: '1.B',
          title: 'Sub-Bab B: Dinamika Penerapan Pancasila dari Masa ke Masa',
          pages: 'Hal. 13 – 24',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-2)',
          modelPembelajaran: 'Discovery Learning & Analisis Linimasa Sejarah',
          tujuanPembelajaran: 'Menelaah dinamika tantangan dan penyimpangan penerapan Pancasila pada masa Awal Kemerdekaan (1945–1959), Masa Orde Lama (1959–1966), Masa Orde Baru (1966–1998), hingga Era Reformasi (1998–sekarang).',
          pemahamanBermakna: 'Pancasila telah teruji melewati berbagai krisis dan ancaman disintegrasi bangsa; komitmen menjaga kemurnian nilai Pancasila harus terus diperbarui oleh generasi muda sesuai tuntutan zaman.',
          pertanyaanPemantik: [
            'Pemberontakan dan tantangan apa saja yang pernah dihadapi bangsa Indonesia untuk mengganti ideologi Pancasila?',
            'Mengapa pada masa Orde Baru terjadi penafsiran tunggal atas Pancasila (lewat P4), dan bagaimana dampaknya?',
            'Tantangan apa yang paling nyata dihadapi Pancasila di era kebebasan informasi dan demokrasi saat ini?'
          ],
          p3Dimensions: ['Bernalar Kritis', 'Berkebinekaan Global', 'Mandiri'],
          sarpras: 'Buku Siswa Kelas IX Hal. 13-24, Linimasa Sejarah Nasional Indonesia, Video Dokumenter Peristiwa Bersejarah, LKPD 1.B.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Guru menyapa murid, memeriksa kehadiran dan kerapian ruang kelas.\n2. Apersepsi Sejarah (5 Menit):\n   - Guru menampilkan foto Monumen Pancasila Sakti dan bertanya: "Mengapa tanggal 1 Oktober diperingati sebagai Hari Kesaktian Pancasila? Apa pesan sejarah di baliknya?"\n3. Tujuan Pembelajaran (3 Menit):\n   - Guru menjelaskan kompetensi analisis linimasa penerapan Pancasila lintas zaman.',
          kegiatanInti: `Fase 1: Pemberian Rangsangan / Stimulation (10 Menit)
• Aktivitas Guru:
  - Guru menyajikan tayangan linimasa empat periode: Awal Kemerdekaan (pemberontakan PKI Madiun 1948, DI/TII, RMS, PRRI/Permesta), Orde Lama (Demokrasi Terpimpin, Nasakom, G30S/PKI), Orde Baru (Demokrasi Pancasila, sentralisme, penafsiran monolitik), dan Era Reformasi (kebebasan, desentralisasi, disrupsi digital).
• Aktivitas Murid:
  - Murid menyimak Buku Siswa Hal. 14–19 dan mencatat kata kunci penting per periode sejarah.

Fase 2: Identifikasi Masalah / Problem Statement (10 Menit)
• Aktivitas Guru:
  - Guru membagikan LKPD 1.B "Matriks Linimasa Dinamika Pancasila" dan membagi murid ke dalam 4 kelompok era sejarah.
• Aktivitas Murid:
  - Kelompok 1: Era Awal Kemerdekaan (1945–1959).
  - Kelompok 2: Era Orde Lama (1959–1966).
  - Kelompok 3: Era Orde Baru (1966–1998).
  - Kelompok 4: Era Reformasi (1998–sekarang).

Fase 3: Pengumpulan Data / Data Collection (15 Menit)
• Aktivitas Guru (Fasilitasi):
  - Guru memfasilitasi murid mencari data faktual dari buku teks, artikel sejarah tepercaya, dan sumber arsip resmi.
• Aktivitas Murid (4C: Collaboration & Critical Thinking):
  - Murid mengeksplorasi bentuk penyimpangan, latar belakang politik/ideologi, serta cara bangsa Indonesia mengatasi krisis tersebut pada era yang ditugaskan.

Fase 4: Pengolahan Data & Verifikasi / Verification (15 Menit)
• Aktivitas Guru:
  - Guru memandu perbandingan antarkelompok dalam format Gallery Walk / Pasar Informasi.
• Aktivitas Murid (4C: Communication):
  - Tiap kelompok menempelkan lembar matriks di dinding kelas; separuh anggota berjaga menjelaskan, separuh anggota berkeliling mencatat temuan dari era lain.

Fase 5: Menarik Kesimpulan / Generalization (10 Menit)
• Aktivitas Guru:
  - Guru mengonfirmasi bahwa Pancasila terbukti memiliki daya tahan ideologis yang kokoh karena berakar dari kepribadian asli bangsa Indonesia.
• Aktivitas Murid:
  - Murid menulis refleksi mengenai pelajaran berharga (lesson learned) dari sejarah perjuangan ideologi bangsa.`,
          kegiatanPenutup: '1. Evaluasi Singkat (5 Menit):\n   - Kuis interaktif lisan kilat mengenai karakteristik 4 periode penerapan Pancasila.\n2. Tindak Lanjut & Doa (5 Menit):\n   - Guru mengarahkan murid membaca Sub-Bab C: Perwujudan Nilai Pancasila dalam Era Digital dan menutup pertemuan dengan doa.',
          asesmenDiagnostik: 'Tanya jawab: Sebutkan salah satu peristiwa sejarah yang mengancam keutuhan ideologi Pancasila pasca-proklamasi 1945.',
          asesmenFormatif: 'Penilaian partisipasi diskusi kelompok, kelengkapan matriks linimasa 4 periode pada LKPD 1.B.',
          asesmenSumatif: 'Tes tulis pilihan ganda dan uraian komparasi dinamika penerapan Pancasila lintas era.',
          remedial: 'Membaca terbimbing tabel komparasi 4 era sejarah penerapan Pancasila dan menjawab 3 pertanyaan kunci.',
          pengayaan: 'Melakukan wawancara dengan tokoh masyarakat/orang tua tentang pengalaman penghayatan Pancasila di masa Orde Baru dan Reformasi.',
          lkpdTitle: 'LKPD 1.B: Matriks Linimasa Dinamika Penerapan Pancasila Lintas Era',
          lkpdInstructions: [
            'Pelajari uraian materi Buku Siswa Kelas IX Hal. 13–22.',
            'Lengkapi tabel matriks dinamika penerapan Pancasila dari masa ke masa.',
            'Diskusikan faktor penyebab penyimpangan dan solusi kebangkitannya bersama anggota kelompok.'
          ],
          lkpdQuestions: [
            'Apa latar belakang terjadinya upaya penggantian ideologi Pancasila pada masa Awal Kemerdekaan (1945–1959)?',
            'Bagaimana penyimpangan terhadap Pancasila dan UUD 1945 yang terjadi pada masa Demokrasi Terpimpin (Orde Lama)?',
            'Analisislah kelebihan dan kekurangan pelaksanaan Pancasila pada masa Orde Baru (1966–1998)!',
            'Tantangan ideologis apa yang paling krusial dihadapi bangsa Indonesia di era Reformasi saat ini?'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-1b-komparasi',
              type: 'komparasi',
              badge: 'Matriks Komparasi Sejarah',
              title: 'LKPD 1.B-1: Tabel Komparasi 4 Era Penerapan Ideologi Pancasila',
              instructions: [
                'Bandingkan 4 era: Awal Kemerdekaan, Orde Lama, Orde Baru, dan Reformasi.',
                'Isi kolom: Kondisi Politik, Bentuk Penyimpangan/Tantangan, serta Upaya Penyelamatan Ideologi.',
                'Tarik kesimpulan bersama mengenai faktor ketahanan Pancasila.'
              ],
              questions: [
                'Bandingkan corak tantangan ideologi: Manakah yang lebih dominan antara ancaman fisik-militer (awal merdeka) vs ancaman perang pemikiran/ideologi transnasional (era reformasi)?',
                'Mengapa hegemoni dan tafsir tunggal pemerintah atas Pancasila di masa lalu justru membahayakan kemurnian nilai Pancasila itu sendiri?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Kelengkapan Fakta Sejarah',
                  skor4: 'Tabel terisi 100% lengkap dengan akurasi data sejarah dan analisis kritis yang sangat tajam.',
                  skor3: 'Tabel terisi lengkap dengan fakta sejarah yang tepat.',
                  skor2: 'Tabel terisi sebagian (2-3 era) dengan penjelasan ringkas.',
                  skor1: 'Data tabel banyak yang kurang tepat atau kosong.'
                }
              ]
            }
          ],
          glosarium: 'Ideologi Terbuka: Ideologi yang nilai-nilai dasarnya bersifat tetap, namun penjabarannya dapat dikembangkan secara dinamis sesuai perkembangan zaman; Orde Lama: Masa pemerintahan Presiden Soekarno (1959–1966); Orde Baru: Masa pemerintahan Presiden Soeharto (1966–1998); Reformasi: Gerakan perubahan ketatanegaraan sejak 1998 untuk mewujudkan demokratisasi.',
          daftarPustaka: 'Alwi Lutfi, M., dkk. (2022). Buku Siswa Pendidikan Pancasila SMP Kelas IX. Jakarta: Kemendikbudristek RI.'
        },
        {
          id: 'sub-9-1c',
          code: '1.C',
          title: 'Sub-Bab C: Perwujudan Nilai-Nilai Pancasila dalam Menjawab Tantangan Era Digital & Globalisasi',
          pages: 'Hal. 25 – 36',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-3)',
          modelPembelajaran: 'Project Based Learning (PjBL) & Desain Kampanye Digital Positif',
          tujuanPembelajaran: 'Merancang aksi nyata perwujudan nilai-nilai Pancasila (nilai dasar, instrumental, dan praksis) dalam kehidupan sehari-hari guna membentengi diri dari dampak negatif globalisasi, radikalisme, dan hoaks digital.',
          pemahamanBermakna: 'Pancasila bukan dogma kaku melainkan ideologi terbuka yang mampu menjadi lentera etika dan penyaring (filter) cerdas di tengah derasnya arus globalisasi dan transformasi kecerdasan buatan.',
          pertanyaanPemantik: [
            'Mengapa Pancasila disebut sebagai ideologi terbuka yang dinamis?',
            'Bagaimana cara nilai-nilai Pancasila menyaring budaya asing yang masuk melalui media sosial?',
            'Karya kreatif apa yang dapat kita ciptakan untuk mengampanyekan nilai toleransi dan gotong royong di internet?'
          ],
          p3Dimensions: ['Kreatif', 'Bernalar Kritis', 'Berkebinekaan Global'],
          sarpras: 'Buku Siswa Kelas IX Hal. 25-36, Gadget/Smartphone, Lembar Kerja Kampanye Positif, LCD Proyektor, LKPD 1.C.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Guru membuka pelajaran dengan salam dan doa.\n2. Apersepsi Digital (5 Menit):\n   - Guru menampilkan tangkapan layar tren media sosial (cyberbullying, hoaks, pamer kemewahan) dan bertanya: "Apakah tren ini sesuai dengan kepribadian Pancasila? Apa yang harus kita lakukan?"\n3. Penyampaian Tujuan Proyek (3 Menit):\n   - Guru memaparkan tujuan pembuatan karya kampanye nilai Pancasila di era digital.',
          kegiatanInti: `Fase 1: Penentuan Pertanyaan Mendasar / Proyek Esensial (10 Menit)
• Aktivitas Guru:
  - Guru memfasilitasi diskusi: "Bagaimana cara efektif mengajak warganet (netizen) sebaya untuk mengamalkan nilai Pancasila saat berselancar di dunia maya?"
• Aktivitas Murid:
  - Murid merumuskan topik karya: Anti-Cyberbullying (Sila 2), Persatuan Warganet & Anti-Hoaks (Sila 3), Etika Diskusi Online (Sila 4), atau Gerakan Donasi Digital (Sila 5).

Fase 2: Perancangan Desain Proyek Kampanye Pancasila (10 Menit)
• Aktivitas Guru:
  - Guru membimbing penyusunan struktur karya (poster infografis, video pendek reels/tiktok edukatif, komik strip digital, atau podcast singkat).
• Aktivitas Murid (Diferensiasi Produk & Kreativitas):
  - Murid memilih format karya sesuai minat dan membagi peran (konseptor naskah, desainer grafis, narator/editor).

Fase 3: Penyusunan Jadwal & Pembuatan Karya (15 Menit)
• Aktivitas Guru:
  - Guru memonitor kemajuan pembuatan draf kampanye pada LKPD 1.C, memberikan masukan estetika dan ketepatan pesan Pancasila.
• Aktivitas Murid (4C: Creativity & Collaboration):
  - Murid menyusun draf konten kampanye memuat slogan bernas, rujukan sila Pancasila, dan ajakan aksi positif di internet.

Fase 4: Uji Coba & Presentasi Karya Proyek (15 Menit)
• Aktivitas Guru:
  - Guru memimpin sesi showcase karya digital di depan kelas.
• Aktivitas Murid (4C: Communication):
  - Setiap kelompok mempresentasikan prototipe poster/video kampanye serta menjelaskan latar belakang pesan Pancasila yang diusung.

Fase 5: Evaluasi Pengalaman Belajar (10 Menit)
• Aktivitas Guru & Murid:
  - Guru dan murid memberikan apresiasi serta merefleksikan pentingnya menjadi warganet yang beradab dan berjiwa Pancasila (Pancasila Digital Citizen).`,
          kegiatanPenutup: '1. Kesimpulan & Komitmen (5 Menit):\n   - Perwakilan murid memimpin deklarasi "Pelajar Pancasila Cerdas & Beretika Digital".\n2. Penutup & Doa (5 Menit):\n   - Guru memberikan umpan balik dan menutup bab I dengan doa bersama.',
          asesmenDiagnostik: 'Kuis singkat mengenai pemahaman nilai dasar, instrumental, dan praksis dalam Pancasila.',
          asesmenFormatif: 'Rubrik penilaian proses perancangan proyek kampanye digital pada LKPD 1.C.',
          asesmenSumatif: 'Penilaian produk poster/video kampanye digital Pancasila dan tes tertulis Bab I.',
          remedial: 'Menyusun 5 daftar aturan etika bermedia sosial yang selaras dengan sila-sila Pancasila.',
          pengayaan: 'Mempublikasikan karya poster digital di mading sekolah atau media sosial resmi OSIS sekolah.',
          lkpdTitle: 'LKPD 1.C: Rancang Bangun Kampanye Edukasi Pelajar Pancasila di Era Digital',
          lkpdInstructions: [
            'Pilihlah salah satu isu dunia maya (hoaks, cyberbullying, ujaran kebencian, konsumerisme).',
            'Rancang pesan kampanye edukatif berbasis nilai Pancasila bersama kelompok.',
            'Lengkapi lembar konsep kampanye dan buat visualisasi draf karya.'
          ],
          lkpdQuestions: [
            'Jelaskan 3 dimensi keterbukaan Pancasila (dimensi idealis, normatif, dan realistis)!',
            'Bagaimana cara nilai Sila Kedua (Kemanusiaan) dapat diterapkan saat kita berkomentar di media sosial?',
            'Tuliskan naskah slogan/pesan persuasif karya kampanye kelompok kalian!'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-1c-proyek',
              type: 'proyek_kreatif',
              badge: 'Proyek Kampanye Digital',
              title: 'LKPD 1.C-1: Desain Poster & Konten Edukasi Netiket Pancasila',
              instructions: [
                'Tentukan tema pesan utama: "Jempolmu Harimaumu: Beretika Pancasila di Ruang Siber".',
                'Buat sketsa tata letak visual poster dan cantumkan 3 tips praktis berinternet sehat.',
                'Presentasikan di depan kelas.'
              ],
              questions: [
                'Apa pesan utama yang ingin disampaikan kelompok melalui poster digital ini?',
                'Bagaimana karya ini dapat mengubah perilaku teman sebaya yang sering terpapar konten negatif?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Kreativitas & Pesan Moral',
                  skor4: 'Karya sangat orisinal, estetis, komunikatif, dan memuat pesan Pancasila yang sangat menginspirasi.',
                  skor3: 'Karya menarik, rapi, dan memuat pesan nilai Pancasila dengan jelas.',
                  skor2: 'Karya cukup baik namun pesan moral belum tersampaikan secara tegas.',
                  skor1: 'Karya belum rapi dan kurang relevan dengan tema.'
                }
              ]
            }
          ],
          glosarium: 'Dimensi Idealis: Nilai-nilai dasar Pancasila yang bersifat sistematis, rasional, dan menyeluruh; Dimensi Normatif: Penjabaran nilai dasar ke dalam norma perundang-undangan; Dimensi Realistis: Kemampuan ideologi mencerminkan realitas hidup masyarakat; Netiket: Etika berselancar dan berkomunikasi di jaringan internet.',
          daftarPustaka: 'Kemendikbudristek RI. (2022). Buku Siswa Pendidikan Pancasila SMP Kelas IX. Jakarta: BSKAP.'
        }
      ]
    },

    // ══════════════════════════════════════════════════════════════
    // BAB 2: HAK DAN KEWAJIBAN WARGA NEGARA DALAM UUD 1945 (SEMESTER 1)
    // ══════════════════════════════════════════════════════════════
    {
      id: 'bab-2-pkn-9',
      babNumber: 2,
      semester: 1,
      title: 'Bab II: Hak dan Kewajiban Warga Negara dalam UUD NRI Tahun 1945',
      description: 'Menganalisis hakikat hak dan kewajiban asasi warga negara, jaminan konstitusional dalam pasal-pasal UUD NRI Tahun 1945, kasus pelanggaran hak dan pengingkaran kewajiban, serta upaya penegakan hukum yang berkeadilan.',
      elemen: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
      subBabList: [
        {
          id: 'sub-9-2a',
          code: '2.A',
          title: 'Sub-Bab A: Hakikat Hak dan Kewajiban Asasi Warga Negara menurut Konstitusi',
          pages: 'Hal. 37 – 48',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-4)',
          modelPembelajaran: 'Inkuiri Yurisprudensial & Diskusi Kasus Konstitusi',
          tujuanPembelajaran: 'Menganalisis makna hakiki hak dan kewajiban warga negara, asas keseimbangan timbal balik (korelatif), serta landasan hukum pasal-pasal HAM dalam UUD NRI Tahun 1945.',
          pemahamanBermakna: 'Hak dan kewajiban warga negara adalah dua sisi dari satu koin mata uang yang tak terpisahkan; tidak ada hak sejati yang dapat dinikmati tanpa kesadaran menunaikan kewajiban secara bertanggung jawab.',
          pertanyaanPemantik: [
            'Mengapa seseorang tidak boleh hanya menuntut haknya tetapi melalaikan kewajibannya?',
            'Apa perbedaan antara Hak Asasi Manusia (HAM) dan Hak Warga Negara?',
            'Pasal-pasal mana saja dalam UUD 1945 yang menjamin hak pendidikan, kesehatan, dan kebebasan beragama?'
          ],
          p3Dimensions: ['Bernalar Kritis', 'Mandiri', 'Berakhlak Mulia'],
          sarpras: 'Buku Siswa Kelas IX Hal. 37-48, Buku Naskah Asli & Amandemen UUD 1945, Bagan Pasal-Pasal Hak & Kewajiban Warga Negara, LKPD 2.A.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Guru menyapa murid, mengecek kehadiran, dan memimpin doa.\n2. Apersepsi (5 Menit):\n   - Guru mengajukan pertanyaan pemantik: "Setiap warga berhak menikmati jalan raya yang mulus. Kewajiban apa yang harus dipenuhi agar hak tersebut dapat terwujud?"\n3. Penyampaian Tujuan (3 Menit):\n   - Guru menyampaikan indikator pemahaman hak dan kewajiban konstitusional.',
          kegiatanInti: `Fase 1: Eksplorasi Pasal-Pasal Konstitusi (10 Menit)
• Aktivitas Guru:
  - Guru memandu penelaahan Pasal 27 (persamaan hukum), Pasal 28A-28J (HAM), Pasal 29 (kebebasan beragama), Pasal 30 (bela negara), Pasal 31 (pendidikan), dan Pasal 34 (fakir miskin) UUD 1945.
• Aktivitas Murid:
  - Murid menandai kata kunci jaminan hak dan butir kewajiban pada salinan UUD 1945.

Fase 2: Pengorganisasian Debat Yurisprudensial (10 Menit)
• Aktivitas Guru:
  - Guru membagikan LKPD 2.A dan membagi murid ke dalam kelompok penelaah hak dan kelompok penelaah kewajiban.
• Aktivitas Murid:
  - Murid membedah konsep hak asasi (bersifat universal melekat pada setiap manusia) vs hak warga negara (dibatasi oleh status kewarganegaraan suatu negara).

Fase 3: Investigasi Kasus Keseimbangan Hak & Kewajiban (15 Menit)
• Aktivitas Guru (Scaffolding):
  - Guru mengarahkan penyelidikan pada kasus putus sekolah, fasilitas difabel, dan kepatuhan membayar pajak.
• Aktivitas Murid (4C: Critical Thinking):
  - Murid mendiskusikan relasi timbal balik antara kepatuhan warga negara dan pelayanan publik negara.

Fase 4: Presentasi & Dialog Argumentatif (15 Menit)
• Aktivitas Guru:
  - Guru menjadi moderator dialog interaktif antar-kelompok.
• Aktivitas Murid (4C: Communication):
  - Setiap kelompok memaparkan hasil telaah pasal konstitusi dan contoh kasus pelanggaran hak di sekitar mereka.

Fase 5: Refleksi & Penarikan Prinsip Keadilan (10 Menit)
• Aktivitas Guru & Murid:
  - Menyimpulkan prinsip bahwa pelaksanaan hak seseorang dibatasi oleh hak asasi orang lain sebagaimana diamanatkan Pasal 28J ayat (2) UUD NRI 1945.`,
          kegiatanPenutup: '1. Rangkuman Materi (5 Menit):\n   - Mengulang 3 poin inti perbedaan hak warga negara dan kewajiban mutlak.\n2. Refleksi Diri & Doa (5 Menit):\n   - Mengisi jurnal refleksi: "Kewajiban apa yang sudah dan belum saya tunaikan di sekolah?" lalu doa penutup.',
          asesmenDiagnostik: 'Tes lisan: Sebutkan hak kalian sebagai murid di sekolah dan kewajiban yang menyertainya.',
          asesmenFormatif: 'Lembar kerja analisis pasal konstitusi pada LKPD 2.A dan rubrik keaktifan diskusi.',
          asesmenSumatif: 'Tes tertulis studi kasus pemenuhan hak dan kewajiban warga negara.',
          remedial: 'Menjodohkan daftar hak dan kewajiban dengan pasal yang sesuai dalam UUD NRI Tahun 1945.',
          pengayaan: 'Menulis artikel opini mini: "Perlindungan Hak Pendidikan bagi Anak Berkebutuhan Khusus (Inklusi) di Indonesia".',
          lkpdTitle: 'LKPD 2.A: Pemetaan Konstitusional Hak & Kewajiban Warga Negara dalam UUD 1945',
          lkpdInstructions: [
            'Baca naskah UUD 1945 Pasal 27 sampai dengan Pasal 34 pada Buku Siswa Hal. 38–44.',
            'Kelompokkan pasal-pasal yang memuat hak warga negara dan pasal yang memuat kewajiban warga negara.',
            'Jawab pertanyaan analisis yuridis secara mandiri dan kelompok.'
          ],
          lkpdQuestions: [
            'Jelaskan perbedaan mendasar antara Hak Asasi Manusia (HAM) dengan Hak Warga Negara!',
            'Mengapa dalam Pasal 28J ayat (2) ditegaskan bahwa dalam menjalankan haknya, setiap orang wajib tunduk kepada pembatasan yang ditetapkan undang-undang?',
            'Berikan 2 contoh konkret kewajiban warga negara yang jika diingkari akan merugikan kepentingan publik secara luas!'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-2a-studi',
              type: 'studi_kasus',
              badge: 'Studi Kasus Konstitusional',
              title: 'LKPD 2.A-1: Telaah Pemenuhan Hak Pendidikan & Fasilitas Kesehatan di Pelosok',
              instructions: [
                'Simak studi kasus mengenai kondisi sekolah di daerah 3T (Terdepan, Terluar, Tertinggal).',
                'Kaitkan kondisi tersebut dengan amanat Pasal 31 UUD 1945.',
                'Rumuskan langkah yang harus diambil pemerintah dan peran partisipasi masyarakat.'
              ],
              questions: [
                'Apakah seluruh anak di daerah 3T telah menikmati hak konstitusionalnya sesuai Pasal 31 ayat (1) dan (2)? Jelaskan alasannya!',
                'Kewajiban apa yang diemban negara dan apa peran yang dapat dilakukan warga masyarakat mampu untuk membantu?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Kedalaman Analisis Konstitusi',
                  skor4: 'Analisis berbasis pasal UUD 1945 sangat mendalam, argumentatif, dan solutif.',
                  skor3: 'Analisis pasal tepat dan menghubungkan fakta kasus dengan baik.',
                  skor2: 'Analisis cukup baik namun rujukan pasal masih kurang spesifik.',
                  skor1: 'Belum mampu menghubungkan pasal konstitusi dengan studi kasus.'
                }
              ]
            }
          ],
          glosarium: 'Hak Konstitusional: Hak-hak yang dijamin secara tegas dalam naskah Undang-Undang Dasar; Korelatif: Hubungan timbal balik yang saling mempengaruhi; Daerah 3T: Daerah Terdepan, Terluar, dan Tertinggal di wilayah NKRI.',
          daftarPustaka: 'Sekretariat Jenderal MPR RI. (2020). Panduan Pemasyarakatan UUD NRI Tahun 1945. Jakarta: Setjen MPR RI.'
        },
        {
          id: 'sub-9-2b',
          code: '2.B',
          title: 'Sub-Bab B: Jaminan Hak & Penegakan Hukum yang Berkeadilan (Pasal 27, 28, 29, 30, 31 UUD 1945)',
          pages: 'Hal. 49 – 60',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-5)',
          modelPembelajaran: 'Problem Based Learning (PBL) & Simulasi Sidang Peradilan Semu',
          tujuanPembelajaran: 'Mengevaluasi berbagai kasus pelanggaran hak dan pengingkaran kewajiban warga negara di masyarakat serta peran lembaga penegak hukum (Kepolisian, Kejaksaan, Kehakiman, KPK, Komnas HAM).',
          pemahamanBermakna: 'Hukum yang adil dan berwibawa adalah payung pelindung bagi seluruh warga negara tanpa memandang status sosial, kekayaan, maupun jabatan (Equality Before the Law).',
          pertanyaanPemantik: [
            'Apa yang terjadi jika hukum di suatu negara tumpul ke atas tetapi tajam ke bawah?',
            'Lembaga negara apa saja yang bertugas menegakkan keadilan dan melindungi hak-hak warga negara?',
            'Bagaimana peran generasi muda dalam mendukung penegakan hukum yang bersih dan bebas korupsi?'
          ],
          p3Dimensions: ['Bernalar Kritis', 'Gotong Royong', 'Mandiri'],
          sarpras: 'Buku Siswa Kelas IX Hal. 49-60, Lembar Kasus Hukum Riil, Bagan Lembaga Peradilan, LKPD 2.B.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Guru menyapa murid dan memimpin doa.\n2. Apersepsi Kasus (5 Menit):\n   - Menampilkan gambar timbangan keadilan dan emblem penegak hukum: "Mengapa simbol keadilan berupa dewi yang matanya tertutup memegang pedang dan timbangan?"\n3. Penyampaian Tujuan (3 Menit):\n   - Menyampaikan fokus kajian peran lembaga hukum dan analisis kasus pelanggaran.',
          kegiatanInti: `Fase 1: Pengenalan Masalah & Fenomena Hukum (10 Menit)
• Aktivitas Guru:
  - Guru menayangkan video singkat mengenai operasi penertiban pungutan liar (pungli) dan penegakan hukum lalu lintas.
• Aktivitas Murid:
  - Murid membaca materi Buku Siswa Hal. 50–55 mengenai macam-macam lembaga penegak hukum di Indonesia.

Fase 2: Pembagian Peran Investigasi Kasus (10 Menit)
• Aktivitas Guru:
  - Guru membagikan lembar kasus pada LKPD 2.B dan membagi murid ke dalam pos-pos investigasi lembaga (Pos Kepolisian, Pos Kejaksaan, Pos Pengadilan, Pos Komnas HAM, Pos KPK).
• Aktivitas Murid:
  - Murid mempelajari kewenangan lembaga masing-masing berdasarkan UU terkait.

Fase 3: Bedah Kasus & Analisis Penegakan Keadilan (15 Menit)
• Aktivitas Guru (Bimbingan Kritis):
  - Membimbing kelompok meneliti faktor penyebab pelanggaran hak: faktor internal (sikap egois, rendahnya kesadaran hukum) dan eksternal (penyalahgunaan kekuasaan, aparat kurang tegas).
• Aktivitas Murid (4C: Collaboration & Critical Thinking):
  - Murid menyusun alur penanganan perkara dari pelaporan, penyelidikan, hingga putusan pengadilan yang adil.

Fase 4: Gelar Perkara & Presentasi Solusi (15 Menit)
• Aktivitas Guru:
  - Memfasilitasi gelar perkara interaktif antarkelompok.
• Aktivitas Murid (4C: Communication):
  - Juru bicara pos memaparkan rekomendasi penindakan hukum dan pemulihan hak korban.

Fase 5: Rekonstruksi Pemahaman & Refleksi Etika (10 Menit)
• Guru & Murid:
  - Menyepakati komitmen antikorupsi dan kepatuhan hukum mulai dari hal kecil di sekolah (tidak menyontek, disiplin tata tertib).`,
          kegiatanPenutup: '1. Simpulan Utama (5 Menit):\n   - Menegaskan prinsip kepastian hukum dan keadilan substantif.\n2. Tindak Lanjut & Doa (5 Menit):\n   - Penugasan Sub-Bab C: Harmonisasi Hak dan Tanggung Jawab, lalu doa penutup.',
          asesmenDiagnostik: 'Tanya jawab seputar tugas Kepolisian RI vs Kejaksaan RI vs Hakim Pengadilan.',
          asesmenFormatif: 'Penilaian telaah kasus hukum pada LKPD 2.B dan lembar observasi kerja sama tim.',
          asesmenSumatif: 'Uji kompetensi esai pemecahan masalah pelanggaran hak warga negara.',
          remedial: 'Membuat bagan alur lembaga peradilan dan fungsinya di Indonesia.',
          pengayaan: 'Melakukan riset mini mengenai peran Komnas HAM dalam menyelesaikan pengaduan masyarakat.',
          lkpdTitle: 'LKPD 2.B: Analisis Peran Lembaga Penegak Hukum & Penanganan Kasus Pelanggaran Hak',
          lkpdInstructions: [
            'Telaah kasus pelanggaran hak dan pengingkaran kewajiban pada Buku Siswa Hal. 52–58.',
            'Tentukan lembaga penegak hukum yang berwenang menanganinya.',
            'Tuliskan faktor penyebab dan upaya pencegahan komprehensif.'
          ],
          lkpdQuestions: [
            'Jelaskan asas "Equality Before the Law" (persamaan kedudukan di hadapan hukum) sesuai Pasal 27 ayat (1) UUD 1945!',
            'Apa perbedaan peran antara Hakim, Jaksa Penuntut Umum, dan Polisi dalam proses penegakan hukum di Indonesia?',
            'Analisis faktor penyebab seseorang melakukan pengingkaran kewajiban membayar pajak atau mematuhi rambu lalu lintas!'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-2b-kasus',
              type: 'studi_kasus',
              badge: 'Simulasi Investigasi Hukum',
              title: 'LKPD 2.B-1: Analisis Kasus Perlindungan Konsumen & Cyber Crime',
              instructions: [
                'Pelajari kasus penipuan belanja daring (online scam) dan kebocoran data pribadi.',
                'Identifikasi hak konsumen mana yang dilanggar dan pasal hukum yang dapat menjerat pelaku.',
                'Susun tips preventif bagi pelajar agar tidak menjadi korban kejahatan siber.'
              ],
              questions: [
                'Hak warga negara apa saja yang dirugikan dalam kasus kebocoran data pribadi?',
                'Lembaga apa yang dapat menerima laporan kejahatan siber dan bagaimana prosedur pelaporannya?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Ketepatan Rekomendasi Yuridis',
                  skor4: 'Menunjukkan pasal dan lembaga penegak hukum dengan sangat tepat beserta alur pelaporan yang jelas.',
                  skor3: 'Menunjukkan lembaga dan pasal hukum dengan tepat.',
                  skor2: 'Menunjukkan lembaga hukum namun penjelasan alur masih kurang tepat.',
                  skor1: 'Belum mampu mengidentifikasi penanganan hukum yang sesuai.'
                }
              ]
            }
          ],
          glosarium: 'Equality Before the Law: Asas hukum bahwa setiap manusia setara di mata hukum tanpa hak istimewa; Kepastian Hukum: Jaminan bahwa hukum dijalankan secara jelas, adil, dan konsisten; Supremasi Hukum: Menempatkan hukum pada posisi tertinggi dalam penyelenggaraan negara.',
          daftarPustaka: 'Alwi Lutfi, M., dkk. (2022). Buku Siswa Pendidikan Pancasila SMP Kelas IX. Jakarta: Kemendikbudristek RI.'
        },
        {
          id: 'sub-9-2c',
          code: '2.C',
          title: 'Sub-Bab C: Upaya Harmonisasi Hak dan Tanggung Jawab dalam Kehidupan Berdemokrasi',
          pages: 'Hal. 61 – 72',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-6)',
          modelPembelajaran: 'Model Reflektif & Proyek Aksi Budaya Sadar Hukum di Sekolah',
          tujuanPembelajaran: 'Menunjukkan perilaku patuh hukum dan mengharmonisasikan hak serta kewajiban dalam kehidupan di keluarga, sekolah, masyarakat, dan bernegara.',
          pemahamanBermakna: 'Kualitas demokrasi dan peradaban suatu bangsa tercermin dari tingginya kesadaran warganya dalam menjalankan tanggung jawab sosial secara sukarela demi kebaikan bersama.',
          pertanyaanPemantik: [
            'Bagaimana cara kita membiasakan diri mendahulukan kewajiban sebelum menuntut hak di lingkungan sekolah?',
            'Mengapa kesadaran hukum harus tumbuh dari hati nurani, bukan sekadar karena takut dihukum?',
            'Aksi nyata apa yang bisa kita pelopori untuk mewujudkan sekolah yang ramah anak dan bebas perundungan (anti-bullying)?'
          ],
          p3Dimensions: ['Beriman & Bertakwa kepada Tuhan YME', 'Gotong Royong', 'Mandiri'],
          sarpras: 'Buku Siswa Kelas IX Hal. 61-72, Lembar Komitmen Siswa, Format Rencana Aksi Sekolah Sadar Hukum, LKPD 2.C.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Membuka kelas dengan salam dan doa.\n2. Apersepsi (5 Menit):\n   - Refleksi bersama mengenai pelaksanaan piket kelas dan antrean di kantin sekolah.\n3. Tujuan (3 Menit):\n   - Menyampaikan target penyusunan rencana aksi harmonisasi hak dan kewajiban.',
          kegiatanInti: `Fase 1: Refleksi Budaya Tertib Sekolah (10 Menit)
• Aktivitas Guru:
  - Guru memantik dialog mengenai iklim kedisiplinan dan rasa saling menghargai antarsiswa.
• Aktivitas Murid:
  - Menyimak materi Buku Siswa Hal. 62–67 tentang partisipasi warga negara dalam menciptakan ketertiban sosial.

Fase 2: Pemetaan Masalah Ketidakharmonisan di Sekolah (10 Menit)
• Aktivitas Guru:
  - Membagikan LKPD 2.C dan memandu identifikasi masalah (sampah sembarangan, keterlambatan, perundungan verbal).
• Aktivitas Murid:
  - Mengelompokkan masalah berdasarkan hak yang terganggu dan kewajiban yang diabaikan.

Fase 3: Perumusan Pakta Integritas Kelas (15 Menit)
• Aktivitas Guru (Fasilitasi):
  - Membimbing perumusan kesepakatan kelas yang adil dan disepakati bersama secara demokratis.
• Aktivitas Murid (4C: Collaboration & Creativity):
  - Menyusun butir-butir kesepakatan hak dan tanggung jawab murid di dalam kelas dan lingkungan sekolah.

Fase 4: Penandatanganan & Deklarasi Bersama (15 Menit)
• Aktivitas Guru:
  - Memfasilitasi pengesahan Pakta Integritas Kelas.
• Aktivitas Murid (4C: Communication):
  - Membacakan deklarasi kesadaran hukum dan komitmen saling menjaga hak sesama teman.

Fase 5: Evaluasi & Rencana Tindak Lanjut (10 Menit)
• Guru & Murid:
  - Menentukan mekanisme evaluasi mingguan pelaksanaan kesepakatan kelas.`,
          kegiatanPenutup: '1. Kesimpulan (5 Menit):\n   - Guru merangkum esensi harmoni hak dan tanggung jawab.\n2. Doa Penutup (5 Menit):\n   - Menutup kegiatan semester 1 Bab II dengan doa.',
          asesmenDiagnostik: 'Survei kesadaran hukum diri: Bagaimana sikapmu jika melihat teman melanggar tata tertib?',
          asesmenFormatif: 'Rubrik penilaian draf Pakta Integritas dan keaktifan pada LKPD 2.C.',
          asesmenSumatif: 'Penilaian portofolio pelaksanaan kesepakatan kelas dan tes tertulis akhir Bab II.',
          remedial: 'Menuliskan 5 contoh hak murid di sekolah dan 5 kewajiban yang wajib dipatuhi.',
          pengayaan: 'Menjadi Duta Sadar Hukum Kelas yang bertugas mengedukasi kawan sebaya mengenai anti-perundungan.',
          lkpdTitle: 'LKPD 2.C: Penyusunan Pakta Integritas Harmonisasi Hak & Kewajiban di Sekolah',
          lkpdInstructions: [
            'Identifikasi 3 hak kalian sebagai peserta didik yang paling mendasar di sekolah.',
            'Tuliskan 3 kewajiban utama yang harus kalian penuhi agar hak-hak tersebut berjalan tertib.',
            'Rumuskan naskah kesepakatan kelas bersama kelompok.'
          ],
          lkpdQuestions: [
            'Mengapa penuntutan hak yang mengabaikan kewajiban dapat menimbulkan kekacauan sosial?',
            'Bagaimana cara menyelesaikan perselisihan antarteman di sekolah dengan mengedepankan musyawarah dan penegakan tata tertib?',
            'Tuliskan komitmen tertulis kalian untuk menjaga keamanan dan ketenteraman kelas!'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-2c-refleksi',
              type: 'refleksi_komitmen',
              badge: 'Jurnal Refleksi Diri & Komitmen',
              title: 'LKPD 2.C-1: Jurnal Evaluasi Diri Pemenuhan Hak dan Kewajiban',
              instructions: [
                'Isi lembar evaluasi diri dengan jujur mengenai kepatuhan terhadap peraturan sekolah dan norma masyarakat.',
                'Tentukan target perbaikan sikap untuk 1 bulan ke depan.',
                'Minta tanda tangan orang tua/wali sebagai bentuk kemitraan belajar.'
              ],
              questions: [
                'Kewajiban apa yang paling menantang untuk kalian laksanakan secara konsisten? Apa faktor penghambatnya?',
                'Langkah konkret apa yang akan kalian lakukan mulai hari ini untuk meningkatkan disiplin diri?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Kejujuran & Komitmen Perbaikan',
                  skor4: 'Refleksi sangat mendalam, objektif, disertai rencana aksi konkret yang terukur.',
                  skor3: 'Refleksi jelas, jujur, dan memuat rencana perbaikan yang realistis.',
                  skor2: 'Refleksi cukup baik namun rencana aksi masih bersifat umum.',
                  skor1: 'Refleksi diisi secara singkat tanpa evaluasi diri yang sungguh-sungguh.'
                }
              ]
            }
          ],
          glosarium: 'Pakta Integritas: Perjanjian tertulis yang memuat komitmen moral bersama untuk bersikap jujur dan patuh pada norma; Harmonisasi: Upaya menyelaraskan dan menyeimbangkan dua hal agar tercipta keserasian.',
          daftarPustaka: 'Alwi Lutfi, M., dkk. (2022). Buku Panduan Guru Pendidikan Pancasila SMP Kelas IX. Jakarta: Kemendikbudristek RI.'
        }
      ]
    },

    // ══════════════════════════════════════════════════════════════
    // BAB 3: KEMERDEKAAN BERPENDAPAT DI ERA DIGITAL (SEMESTER 1)
    // ══════════════════════════════════════════════════════════════
    {
      id: 'bab-3-pkn-9',
      babNumber: 3,
      semester: 1,
      title: 'Bab III: Kemerdekaan Berpendapat Warga Negara pada Era Keterbukaan Informasi',
      description: 'Menganalisis hakikat dan landasan hukum kemerdekaan menyampaikan pendapat (UU No. 9 Tahun 1998 & UUD 1945), etika dan tanggung jawab digital di media sosial, serta praktik musyawarah mufakat generasi muda dalam pembangunan.',
      elemen: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
      subBabList: [
        {
          id: 'sub-9-3a',
          code: '3.A',
          title: 'Sub-Bab A: Hakikat dan Landasan Hukum Kemerdekaan Menyampaikan Pendapat',
          pages: 'Hal. 73 – 84',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-7)',
          modelPembelajaran: 'Problem Based Learning (PBL) & Kajian Yuridis Regulasi',
          tujuanPembelajaran: 'Menganalisis jaminan konstitusional kemerdekaan berpendapat (Pasal 28E ayat 3 UUD 1945), asas-asas penyampaian pendapat menurut UU No. 9 Tahun 1998, serta batas-batas kebebasan yang bertanggung jawab.',
          pemahamanBermakna: 'Kemerdekaan berpendapat adalah pilar utama negara demokrasi; kebebasan tersebut bukan tanpa batas, melainkan dibatasi oleh kewajiban menghormati hak asasi orang lain, ketertiban umum, dan keutuhan bangsa.',
          pertanyaanPemantik: [
            'Apakah di negara demokrasi setiap orang bebas berbicara dan memposting apa saja tanpa aturan?',
            'Undang-undang apa yang mengatur tata cara penyampaian pendapat di muka umum di Indonesia?',
            'Apa perbedaan antara mengkritik kebijakan secara konstruktif dengan melakukan ujaran kebencian (hate speech)?'
          ],
          p3Dimensions: ['Bernalar Kritis', 'Berkebinekaan Global', 'Mandiri'],
          sarpras: 'Buku Siswa Kelas IX Hal. 73-84, Naskah UU No. 9 Tahun 1998, Kliping Berita Aksi Penyampaian Aspirasi, LCD Proyektor, LKPD 3.A.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Salam, presensi, dan doa bersama.\n2. Apersepsi Dialogis (5 Menit):\n   - Guru bertanya: "Pernahkah kalian berbeda pendapat dalam pemilihan ketua OSIS? Bagaimana cara kalian menyampaikan saran tanpa menyinggung perasaan orang lain?"\n3. Penyampaian Tujuan (3 Menit):\n   - Menyampaikan fokus kajian regulasi kemerdekaan berpendapat.',
          kegiatanInti: `Fase 1: Telaah Fenomena Demokrasi & Unjuk Rasa (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan video singkat mengenai penyampaian aspirasi damai di gedung DPR dan aksi unjuk rasa yang berakhir ricuh.
• Aktivitas Murid:
  - Murid mengidentifikasi faktor yang membuat unjuk rasa berlangsung tertib atau sebaliknya.

Fase 2: Pengkajian Landasan Hukum UU No. 9/1998 (10 Menit)
• Aktivitas Guru:
  - Membagikan LKPD 3.A dan memandu murid menelaah asas keseimbangan antara hak dan kewajiban, musyawarah, kepastian hukum, proporsionalitas, dan manfaat.
• Aktivitas Murid:
  - Mencatat bentuk-bentuk penyampaian pendapat di muka umum: unjuk rasa/demonstrasi, pawai, rapat umum, dan mimbar bebas.

Fase 3: Analisis Batasan Hukum & Hak Asasi Orang Lain (15 Menit)
• Aktivitas Guru (Scaffolding):
  - Mengarahkan murid membedah Pasal 6 UU No. 9 Tahun 1998 (5 kewajiban warga saat menyampaikan pendapat).
• Aktivitas Murid (4C: Critical Thinking & Collaboration):
  - Murid menganalisis konsekuensi hukum jika demonstrasi mengabaikan izin pemberitahuan tertulis kepada pihak kepolisian atau merusak fasilitas umum.

Fase 4: Simulasi Musyawarah & Presentasi Analisis (15 Menit)
• Aktivitas Guru:
  - Memfasilitasi presentasi kelompok.
• Aktivitas Murid (4C: Communication):
  - Kelompok menyajikan peta alur prosedur penyampaian aspirasi publik yang sah dan konstitusional.

Fase 5: Sintesis Konseptual & Evaluasi (10 Menit)
• Guru & Murid:
  - Menegaskan prinsip: "Kebebasanku dibatasi oleh kebebasan sesamaku".`,
          kegiatanPenutup: '1. Kesimpulan (5 Menit):\n   - Mengulang 5 asas utama penyampaian pendapat di muka umum.\n2. Refleksi & Doa (5 Menit):\n   - Mengisi lembar refleksi dan menutup pelajaran dengan doa.',
          asesmenDiagnostik: 'Pertanyaan pembuka: Sebutkan hak setiap warga negara dalam Pasal 28E ayat (3) UUD 1945.',
          asesmenFormatif: 'Rubrik penilaian telaah UU No. 9 Tahun 1998 pada LKPD 3.A dan observasi keaktifan kelas.',
          asesmenSumatif: 'Tes tertulis analisis regulasi kebebasan berpendapat dan pencegahan anarkisme.',
          remedial: 'Membaca ringkasan 5 asas penyampaian pendapat dan menyebutkan 4 bentuk aksi penyampaian pendapat.',
          pengayaan: 'Menyusun draf surat pemberitahuan kegiatan aspirasi pelajar kepada pihak sekolah sesuai kaidah resmi.',
          lkpdTitle: 'LKPD 3.A: Kajian Regulasi & Batasan Hukum Kemerdekaan Berpendapat (UU No. 9/1998)',
          lkpdInstructions: [
            'Pelajari isi UU No. 9 Tahun 1998 pada Buku Siswa Hal. 74–80.',
            'Identifikasi bentuk penyampaian pendapat, asas, dan kewajiban warga negara.',
            'Selesaikan studi kasus analisis demonstrasi damai vs anarkis.'
          ],
          lkpdQuestions: [
            'Sebutkan 4 bentuk penyampaian pendapat di muka umum menurut UU No. 9 Tahun 1998!',
            'Jelaskan 5 kewajiban dan tanggung jawab warga negara saat menyampaikan pendapat di muka umum!',
            'Mengapa penyampaian pendapat di tempat ibadah, rumah sakit, dan instalasi militer dilarang oleh undang-undang?'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-3a-komparasi',
              type: 'komparasi',
              badge: 'Matriks Komparasi Hukum',
              title: 'LKPD 3.A-1: Komparasi Aksi Damai Konstitusional vs Anarkisme',
              instructions: [
                'Bandingkan karakteristik aksi penyampaian aspirasi damai dengan aksi yang melanggar hukum.',
                'Analisis dampak terhadap ketertiban umum dan citra demokrasi bangsa.',
                'Buat rekomendasi SOP penyampaian aspirasi yang tertib bagi generasi muda.'
              ],
              questions: [
                'Apa saja indikator yang membedakan kritik konstruktif dengan provokasi anarkis?',
                'Bagaimana langkah aparat kepolisian dalam mengawal aksi agar hak massa dan hak masyarakat umum sama-sama terlindungi?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Kedalaman Analisis Komparatif',
                  skor4: 'Tabel komparasi sangat komprehensif, logis, dan menyajikan solusi SOP yang sangat aplikatif.',
                  skor3: 'Tabel komparasi lengkap dan analisis perbedaan tepat.',
                  skor2: 'Tabel komparasi cukup namun penjelasan masih umum.',
                  skor1: 'Belum mampu membedakan aspek legalitas aksi dengan baik.'
                }
              ]
            }
          ],
          glosarium: 'Mimbar Bebas: Bentuk penyampaian pendapat di muka umum yang dilakukan secara bebas dan terbuka tanpa tema yang ditentukan sebelumnya namun tetap tertib; Proporsionalitas: Keseimbangan antara hak dan kewajiban yang sepadan; Kemerdekaan Mengemukakan Pendapat: Hak setiap warga negara untuk mengeluarkan pikiran dengan lisan, tulisan, dan sebagainya secara bebas dan bertanggung jawab.',
          daftarPustaka: 'Republik Indonesia. (1998). Undang-Undang No. 9 Tahun 1998 tentang Kemerdekaan Menyampaikan Pendapat di Muka Umum. Jakarta.'
        },
        {
          id: 'sub-9-3b',
          code: '3.B',
          title: 'Sub-Bab B: Etika dan Tanggung Jawab Digital dalam Menyuarakan Aspirasi di Media Sosial (Netiket & Anti-Hoaks)',
          pages: 'Hal. 85 – 96',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-8)',
          modelPembelajaran: 'Inquiry Learning & Lab Literasi Cek Fakta Digital',
          tujuanPembelajaran: 'Menganalisis etika komunikasi daring (netiket), bahaya penyebaran hoaks dan fitnah di media sosial (UU ITE), serta mempraktikkan keterampilan verifikasi fakta (fact-checking) secara kritis.',
          pemahamanBermakna: 'Kecerdasan digital tidak hanya diukur dari kemahiran mengoperasikan teknologi, melainkan dari kedewasaan menyaring informasi dan etika bertanggung jawab dalam mengetik kata-kata di ruang publik virtual.',
          pertanyaanPemantik: [
            'Mengapa sebuah berita bohong (hoaks) di media sosial bisa menyebar lebih cepat daripada berita fakta yang benar?',
            'Apa akibat hukum dan psikologis dari tindakan perundungan siber (cyberbullying) dan doxxing?',
            'Langkah apa yang harus kita lakukan sebelum menekan tombol "Share/Bagikan" saat menerima informasi heboh di grup WhatsApp?'
          ],
          p3Dimensions: ['Bernalar Kritis', 'Kreatif', 'Mandiri'],
          sarpras: 'Buku Siswa Kelas IX Hal. 85-96, Smartphone/Komputer Terkoneksi Internet, Contoh Kasus Hoaks Viral, LKPD 3.B.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Membuka kelas dengan salam dan doa.\n2. Apersepsi (5 Menit):\n   - Guru menampilkan judul berita sensasional "clickbait": "Bagaimana kalian tahu berita ini fakta atau hoaks?"\n3. Penyampaian Tujuan (3 Menit):\n   - Menyampaikan tujuan pembelajaran literasi digital dan pengenalan regulasi UU ITE.',
          kegiatanInti: `Fase 1: Eksplorasi Fenomena Infodemik & Hoaks (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan jenis-jenis misinformasi, disinformasi, dan malinformasi yang marak di era digital.
• Aktivitas Murid:
  - Murid mencermati materi Buku Siswa Hal. 86–90 tentang etika berkomunikasi di internet.

Fase 2: Pelatihan Metode Cek Fakta (10 Menit)
• Aktivitas Guru:
  - Guru mendemonstrasikan teknik verifikasi informasi: cek sumber resmi, periksa tanggal publikasi, telusuri gambar terbalik (reverse image search), dan cek situs CekFakta.com/TurnBackHoax.
• Aktivitas Murid:
  - Membuka LKPD 3.B dan bersiap menguji sampel berita viral.

Fase 3: Praktik Investigasi Fakta Kelompok (15 Menit)
• Aktivitas Guru (Pendampingan):
  - Membimbing kelompok meneliti 2 artikel berita kontroversial untuk memisahkan antara opini emosional dan data faktual.
• Aktivitas Murid (4C: Critical Thinking & Collaboration):
  - Murid membuktikan keabsahan berita menggunakan tools digital dan mencatat bukti ketidakvalidan sumber.

Fase 4: Presentasi Temuan Cek Fakta (15 Menit)
• Aktivitas Guru:
  - Memandu presentasi laporan investigasi digital.
• Aktivitas Murid (4C: Communication):
  - Kelompok memaparkan hasil verifikasi: status berita (Fakta/Hoaks), modus penyebaran, serta pasal UU ITE yang berpotensi dilanggar (Pasal 27 ayat 3, Pasal 28 ayat 1 & 2).

Fase 5: Kesimpulan Prinsip "Saring Sebelum Sharing" (10 Menit)
• Guru & Murid:
  - Merumuskan protokol 4T: Tenang, Teliti, Tanya Ahli, Tahan Jangan Sebar jika meragukan.`,
          kegiatanPenutup: '1. Rangkuman (5 Menit):\n   - Mengulang rumus cek fakta dan etika netiket Pancasila.\n2. Tindak Lanjut & Doa (5 Menit):\n   - Penugasan Sub-Bab C: Praktik Musyawarah Mufakat, lalu doa penutup.',
          asesmenDiagnostik: 'Kuis interaktif: Apakah kamu pernah membagikan pesan berantai tanpa mengecek kebenarannya terlebih dahulu?',
          asesmenFormatif: 'Penilaian laporan lembar cek fakta digital pada LKPD 3.B.',
          asesmenSumatif: 'Uji kompetensi analisis kasus etika siber dan regulasi UU ITE.',
          remedial: 'Menuliskan 5 langkah memeriksa kebenaran suatu berita di internet.',
          pengayaan: 'Membuat video tutorial mini 60 detik tentang cara mengecek keaslian foto/berita di media sosial.',
          lkpdTitle: 'LKPD 3.B: Laboratorium Literasi Cek Fakta & Etika Digital Netiket Pancasila',
          lkpdInstructions: [
            'Buka contoh artikel berita yang dibagikan guru pada LKPD 3.B.',
            'Lakukan penelusuran digital: cek domain media, pembanding berita di portal kredibel, dan sumber foto.',
            'Tuliskan kesimpulan status artikel beserta bukti verifikasinya.'
          ],
          lkpdQuestions: [
            'Jelaskan perbedaan mendasar antara misinformasi, disinformasi, dan malinformasi!',
            'Sebutkan 3 pasal penting dalam UU ITE yang mengatur larangan pencemaran nama baik, penyebaran hoaks menyesatkan, dan ujaran kebencian SARA!',
            'Jelaskan prinsip "Saring Sebelum Sharing" dan bagaimana penerapannya dalam kehidupan sehari-hari pelajar!'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-3b-cekfakta',
              type: 'observasi_wawancara',
              badge: 'Investigasi Cek Fakta',
              title: 'LKPD 3.B-1: Lembar Kerja Bedah Hoaks & Verifikasi Informasi',
              instructions: [
                'Pilihlah 1 postingan media sosial yang dicurigai mengandung informasi bohong.',
                'Lakukan pencarian jejak digital dan verifikasi sumber data resmi.',
                'Susun laporan verifikasi fakta sesuai format standar MAFINDO/CekFakta.'
              ],
              questions: [
                'Faktor apa yang membuat berita tersebut tampak meyakinkan bagi pembaca awam?',
                'Bagaimana dampak yang ditimbulkan jika berita tersebut terus disebarkan secara masif?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Akurasi Bukti Verifikasi',
                  skor4: 'Menyajikan bukti digital (tautan sumber primer, perbandingan gambar) dengan sangat akurat dan runut.',
                  skor3: 'Menyajikan bukti verifikasi dengan jelas dan benar.',
                  skor2: 'Bukti verifikasi masih bersifat asumsi umum.',
                  skor1: 'Belum mampu membuktikan kebenaran/kebohongan berita.'
                }
              ]
            }
          ],
          glosarium: 'Netiket: Etika kesantunan dalam berkomunikasi di dunia maya; Doxxing: Tindakan menyebarluaskan informasi pribadi seseorang di internet tanpa izin dengan tujuan mengintimidasi; UU ITE: Undang-Undang Informasi dan Transaksi Elektronik.',
          daftarPustaka: 'Alwi Lutfi, M., dkk. (2022). Buku Siswa Pendidikan Pancasila SMP Kelas IX. Jakarta: Kemendikbudristek RI.'
        },
        {
          id: 'sub-9-3c',
          code: '3.C',
          title: 'Sub-Bab C: Praktik Musyawarah Mufakat dan Partisipasi Aktif Pemuda dalam Pembangunan Bangsa',
          pages: 'Hal. 97 – 108',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-9)',
          modelPembelajaran: 'Simulasi Parlemen Remaja & Musyawarah Perencanaan Partisipatif',
          tujuanPembelajaran: 'Mempraktikkan tata cara musyawarah mufakat, menghormati perbedaan pendapat, dan merancang usulan program partisipasi pelajar dalam memajukan lingkungan sekolah dan masyarakat.',
          pemahamanBermakna: 'Demokrasi Pancasila menempatkan musyawarah mufakat di atas pemungutan suara (voting); kearifan mendengar dan kebesaran jiwa menerima keputusan bersama adalah ciri kedewasaan warga negara.',
          pertanyaanPemantik: [
            'Mengapa bangsa Indonesia mengutamakan musyawarah mufakat daripada voting (suara terbanyak)?',
            'Bagaimana sikap seorang ksatria jika pendapatnya tidak diterima dalam musyawarah kelas?',
            'Gagasan perubahan apa yang ingin kalian sampaikan untuk perbaikan fasilitas atau kegiatan di sekolah kita?'
          ],
          p3Dimensions: ['Gotong Royong', 'Bernalar Kritis', 'Mandiri'],
          sarpras: 'Buku Siswa Kelas IX Hal. 97-108, Lembar Sidang Parlemen Remaja, Palu Sidang Simulasi, LKPD 3.C.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Membuka kelas dengan salam dan doa.\n2. Apersepsi (5 Menit):\n   - Menayangkan cuplikan sidang musyawarah desa/parlemen: "Bagaimana cara para peserta sidang mencapai kesepakatan tanpa bermusuhan?"\n3. Penyampaian Tujuan (3 Menit):\n   - Menyampaikan skenario simulasi musyawarah mufakat kelas.',
          kegiatanInti: `Fase 1: Penjelasan Tata Tertib Musyawarah (10 Menit)
• Aktivitas Guru:
  - Guru menjelaskan etika bersidang: mengangkat tangan sebelum bicara, berbicara santun berbasis data, tidak memotong pembicaraan orang lain, dan mengutamakan kepentingan bersama.
• Aktivitas Murid:
  - Menunjuk pimpinan sidang, sekretaris/notulis, dan anggota fraksi komisi.

Fase 2: Perumusan Isu Strategis Sekolah (10 Menit)
• Aktivitas Guru:
  - Menetapkan 3 tema sidang: (1) Gerakan Sekolah Sehat & Bebas Sampah Plastik, (2) Pencegahan Perundungan & Penguatan Sahabat Sebaya, (3) Optimalisasi Perpustakaan & Literasi Digital.
• Aktivitas Murid:
  - Komisi menyusun draf usulan solusi konkret pada LKPD 3.C.

Fase 3: Pelaksanaan Sidang Musyawarah Pleno (15 Menit)
• Aktivitas Guru (Observer & Pendamping):
  - Memfasilitasi jalannya sidang musyawarah mufakat yang dipimpin oleh perwakilan murid.
• Aktivitas Murid (4C: Communication & Collaboration):
  - Tiap juru bicara komisi menyampaikan pandangan umum; komisi lain memberikan tanggapan secara argumentatif dan santun.

Fase 4: Pengambilan Keputusan Mufakat (15 Menit)
• Aktivitas Guru & Murid:
  - Pimpinan sidang merangkum titik temu (akomodasi gagasan terbaik dari seluruh komisi) dan mengetok palu pengesahan kesepakatan secara mufakat tanpa perlu voting yang memecah suara.

Fase 5: Refleksi Pengalaman Berdemokrasi (10 Menit)
• Guru & Murid:
  - Mengevaluasi dinamika sidang: bagaimana perasaan murid saat argumennya diuji dan bagaimana kepuasan saat mencapai solusi bersama.`,
          kegiatanPenutup: '1. Kesimpulan Akhir Bab III (5 Menit):\n   - Menegaskan nilai luhur Sila Ke-4 Pancasila dalam praktik hidup sehari-hari.\n2. Doa Penutup (5 Menit):\n   - Menutup pertemuan dengan doa bersama.',
          asesmenDiagnostik: 'Tes lisan: Apa arti kata "Mufakat" dalam proses musyawarah?',
          asesmenFormatif: 'Penilaian keaktifan berbicara santun dalam simulasi sidang pada LKPD 3.C.',
          asesmenSumatif: 'Penilaian naskah draf resolusi musyawarah kelas dan tes evaluasi Bab III.',
          remedial: 'Menuliskan 4 prinsip utama pengambilan keputusan bersama menurut Sila Ke-4 Pancasila.',
          pengayaan: 'Menyusun proposal usulan kegiatan inovatif OSIS yang telah diuji melalui uji publik siswa.',
          lkpdTitle: 'LKPD 3.C: Simulasi Sidang Musyawarah Mufakat Parlemen Pelajar Pancasila',
          lkpdInstructions: [
            'Pilihlah salah satu isu peningkatan mutu lingkungan belajar di sekolah.',
            'Susun naskah argumen dan alternatif solusi bersama anggota komisi.',
            'Ikuti simulasi sidang musyawarah mufakat dan catat hasil kesepakatan pleno.'
          ],
          lkpdQuestions: [
            'Jelaskan mengapa voting (pemungutan suara terbanyak) baru boleh dilakukan apabila musyawarah mufakat benar-benar telah diupayakan namun belum mencapai titik temu!',
            'Sikap apa yang harus ditunjukkan oleh seluruh peserta sidang setelah sebuah keputusan musyawarah disahkan?',
            'Tuliskan 3 butir keputusan strategis hasil musyawarah kelompok komisi kalian!'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-3c-proyek',
              type: 'proyek_kreatif',
              badge: 'Resolusi Kebijakan Pelajar',
              title: 'LKPD 3.C-1: Draf Naskah Resolusi Musyawarah Pembangunan Sekolah',
              instructions: [
                'Susun dokumen resolusi kebijakan pelajar memuat: Latar Belakang Masalah, Dasar Pertimbangan Sila Pancasila, dan 5 Pasal Rencana Aksi.',
                'Sahkan dengan tanda tangan seluruh perwakilan kelas.'
              ],
              questions: [
                'Bagaimana rencana aksi kelompok memastikan keterlibatan seluruh murid secara inklusif tanpa ada yang tertinggal?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Kualitas Draf Resolusi',
                  skor4: 'Naskah resolusi sangat sistematis, realistis, aplikatif, dan memuat nilai musyawarah mufakat secara utuh.',
                  skor3: 'Naskah resolusi terstruktur rapi dan program usulan realistis.',
                  skor2: 'Naskah resolusi cukup baik namun program masih kurang terinci.',
                  skor1: 'Naskah belum selesai atau kurang relevan.'
                }
              ]
            }
          ],
          glosarium: 'Musyawarah Mufakat: Pembahasan bersama dengan maksud mencapai keputusan atas penyelesaian masalah yang disetujui bersama; Voting: Pengambilan keputusan berdasarkan suara terbanyak; Resolusi: Putusan atau kebulatan pendapat berupa tuntutan atau kesepakatan bersama suatu rapat.',
          daftarPustaka: 'Alwi Lutfi, M., dkk. (2022). Buku Siswa Pendidikan Pancasila SMP Kelas IX. Jakarta: Kemendikbudristek RI.'
        }
      ]
    },

    // ══════════════════════════════════════════════════════════════
    // BAB 4: HARMONI DALAM KEBERAGAMAN BANGSA (SEMESTER 2)
    // ══════════════════════════════════════════════════════════════
    {
      id: 'bab-4-pkn-9',
      babNumber: 4,
      semester: 2,
      title: 'Bab IV: Harmoni dan Keberagaman Masyarakat Indonesia dalam Bingkai Bhinneka Tunggal Ika',
      description: 'Menganalisis keberagaman SARA (Suku, Agama, Ras, Antargolongan) dan kesetaraan gender, faktor penyebab dan dampak konflik sosial, serta merajut harmoni sosial melalui sikap inklusif, moderasi beragama, dan kolaborasi kebhinnekaan.',
      elemen: 'Bhinneka Tunggal Ika',
      subBabList: [
        {
          id: 'sub-9-4a',
          code: '4.A',
          title: 'Sub-Bab A: Keberagaman SARA (Suku, Agama, Ras, Antargolongan) dan Gender dalam Bingkai Kebhinnekaan',
          pages: 'Hal. 109 – 120',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-10)',
          modelPembelajaran: 'Discovery Learning & Peta Budaya Etnografi Nusantara',
          tujuanPembelajaran: 'Mengidentifikasi kekayaan keberagaman suku bangsa, agama/kepercayaan, ras, status sosial-ekonomi, dan kesetaraan gender sebagai anugerah Tuhan Yang Maha Esa dan modal sosial pembangunan.',
          pemahamanBermakna: 'Keberagaman bukanlah sumber perpecahan melainkan mozaik keindahan yang memperkaya identitas nasional; menghargai perbedaan adalah wujud rasa syukur tertinggi kepada Sang Pencipta.',
          pertanyaanPemantik: [
            'Mengapa Indonesia memiliki ratusan suku dan bahasa daerah yang berbeda-beda?',
            'Apa yang dimaksud dengan kesetaraan gender dalam kehidupan bermasyarakat dan bernegara?',
            'Bagaimana cara kita memandang perbedaan tradisi atau keyakinan teman tanpa berprasangka buruk (stereotip)?'
          ],
          p3Dimensions: ['Berkebinekaan Global', 'Beriman & Bertakwa kepada Tuhan YME', 'Gotong Royong'],
          sarpras: 'Buku Siswa Kelas IX Hal. 109-120, Peta Etnografi Suku Bangsa Indonesia, Video Rumah Ibadah Nusantara, LKPD 4.A.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Salam, presensi, doa.\n2. Apersepsi Visual (5 Menit):\n   - Menayangkan video tari kolosal nusantara yang memadukan berbagai baju adat: "Apa yang membuat tarian kolosal ini tampak begitu megah dan indah?"\n3. Penyampaian Tujuan (3 Menit):\n   - Menyampaikan tujuan kajian keberagaman SARA dan gender.',
          kegiatanInti: `Fase 1: Eksplorasi Keberagaman SARA & Gender (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan data sensus BPS mengenai 1.340+ suku bangsa, 6 agama resmi & penghayat kepercayaan, serta peran perempuan dalam berbagai profesi strategis.
• Aktivitas Murid:
  - Murid mencermati peta sebaran budaya pada Buku Siswa Hal. 110–115.

Fase 2: Identifikasi Isu & Stereotip Negatif (10 Menit)
• Aktivitas Guru:
  - Membagikan LKPD 4.A dan memandu diskusi kritis: membongkar prasangka (stereotip) keliru terhadap suku, profesi, atau peran gender tertentu.
• Aktivitas Murid:
  - Mengidentifikasi contoh stereotip yang sering muncul di pergaulan dan merumuskan cara meluruskannya.

Fase 3: Pemetaan Potensi Kekayaan Budaya Daerah (15 Menit)
• Aktivitas Guru (Scaffolding):
  - Membimbing kelompok meriset kearifan lokal daerah (misal: Subak di Bali, Dalihan Na Tolu di Batak, Pela Gandong di Maluku, Rumah Betang di Dayak).
• Aktivitas Murid (4C: Collaboration & Critical Thinking):
  - Menyusun ulasan nilai gotong royong dan kesetaraan dalam kearifan lokal nusantara.

Fase 4: Showcase Mozaik Budaya (15 Menit)
• Aktivitas Guru:
  - Memandu presentasi infografis mozaik keberagaman.
• Aktivitas Murid (4C: Communication):
  - Setiap kelompok mempresentasikan keunikan dan filosofi persaudaraan dari daerah yang ditelaah.

Fase 5: Generalisasi Prinsip Bhinneka Tunggal Ika (10 Menit)
• Guru & Murid:
  - Menegaskan semboyan Bhinneka Tunggal Ika Tan Hana Dharma Mangrwa (Berbeda-beda tetapi tetap satu, tiada kebenaran yang mendua).`,
          kegiatanPenutup: '1. Rangkuman (5 Menit):\n   - Menyimpulkan pilar keberagaman SARA dan kesetaraan gender.\n2. Refleksi & Doa (5 Menit):\n   - Menuliskan 1 kalimat apresiasi terhadap budaya teman berbeda suku lalu doa penutup.',
          asesmenDiagnostik: 'Tes lisan: Sebutkan 3 suku bangsa dan nama rumah adatnya di Indonesia bagian timur.',
          asesmenFormatif: 'Penilaian lembar kerja eksplorasi mozaik budaya pada LKPD 4.A.',
          asesmenSumatif: 'Uji kompetensi pilihan ganda dan uraian pemahaman keberagaman SARA.',
          remedial: 'Mengisi tabel nama suku bangsa, agama, tarian daerah, dan filosofi gotong royongnya.',
          pengayaan: 'Menyusun buklet mini digital: "Kearifan Lokal Nusantara Penjaga Harmoni Sosial".',
          lkpdTitle: 'LKPD 4.A: Eksplorasi Mozaik Keberagaman SARA & Kesetaraan Gender di Indonesia',
          lkpdInstructions: [
            'Pelajari peta kebudayaan Indonesia pada Buku Siswa Hal. 110–118.',
            'Pilihlah satu kearifan lokal nusantara yang mengandung nilai persaudaraan lintas identitas.',
            'Jawablah pertanyaan telaah kritis mengenai keberagaman dan kesetaraan gender.'
          ],
          lkpdQuestions: [
            'Jelaskan mengapa keberagaman suku, agama, dan budaya di Indonesia merupakan kekayaan (modal sosial) dan bukan kelemahan bangsa!',
            'Bagaimana cara mengatasi prasangka (stereotip) dan etnosentrisme sempit yang dapat merusak persatuan antarsuku?',
            'Jelaskan pentingnya kesetaraan gender dalam memberikan kesempatan yang adil bagi laki-laki dan perempuan di bidang pendidikan dan kepemimpinan!'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-4a-budaya',
              type: 'proyek_kreatif',
              badge: 'Infografis Etnografi Budaya',
              title: 'LKPD 4.A-1: Desain Poster Mozaik Kearifan Lokal Penjaga Harmoni',
              instructions: [
                'Rancang poster yang menampilkan tradisi gotong royong khas daerah di Indonesia (misal: Sambatan di Jawa, Rambu Solo di Toraja, Siwalima di Maluku).',
                'Jelaskan pesan moral bagaimana tradisi tersebut merangkul seluruh warga tanpa membeda-bedakan.'
              ],
              questions: [
                'Nilai-nilai luhur apa yang dapat diadopsi oleh generasi muda perkotaan dari tradisi kearifan lokal tersebut?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Estetika & Kedalaman Budaya',
                  skor4: 'Visual poster sangat menarik, kaya informasi autentik, dan pesan harmoni sangat kuat.',
                  skor3: 'Poster rapi, memuat data budaya dengan jelas dan tepat.',
                  skor2: 'Poster cukup baik namun informasi masih minim.',
                  skor1: 'Poster belum selesai atau kurang rapi.'
                }
              ]
            }
          ],
          glosarium: 'Etnosentrisme: Sikap menganggap budaya atau sukunya sendiri lebih unggul dibanding suku lain; Stereotip: Penilaian terhadap seseorang hanya berdasarkan persepsi terhadap kelompoknya; Kesetaraan Gender: Kondisi di mana laki-laki dan perempuan menikmati status dan hak yang setara untuk mengembangkan potensi diri.',
          daftarPustaka: 'Kemendikbudristek RI. (2022). Buku Siswa Pendidikan Pancasila SMP Kelas IX. Jakarta: BSKAP.'
        },
        {
          id: 'sub-9-4b',
          code: '4.B',
          title: 'Sub-Bab B: Faktor Penyebab, Dampak Konflik Sosial, dan Strategi Manajemen Konflik Berkeadaban',
          pages: 'Hal. 121 – 132',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-11)',
          modelPembelajaran: 'Problem Based Learning (PBL) & Analisis Akar Masalah (Root Cause Analysis)',
          tujuanPembelajaran: 'Menganalisis faktor-faktor penyebab konflik sosial (antar-suku, antar-agama, antar-golongan), dampak destruktif konflik, serta merumuskan strategi penyelesaian konflik secara damai (mediasi, negosiasi, rekonsiliasi).',
          pemahamanBermakna: 'Konflik adalah keniscayaan dalam masyarakat majemuk; yang menentukan masa depan bangsa bukanlah ketiadaan konflik, melainkan kedewasaan menyelesaikan perbedaan melalui jalur dialog dan perdamaian berkeadaban.',
          pertanyaanPemantik: [
            'Mengapa kesalahpahaman kecil di media sosial bisa membesar menjadi konflik antarkelompok?',
            'Apa kerugian fisik, psikologis, dan ekonomi yang ditimbulkan akibat konflik kekerasan?',
            'Bagaimana cara menjadi seorang juru damai (peace maker) saat terjadi perselisihan antarteman di kelas?'
          ],
          p3Dimensions: ['Bernalar Kritis', 'Gotong Royong', 'Berakhlak Mulia'],
          sarpras: 'Buku Siswa Kelas IX Hal. 121-132, Diagram Pohon Masalah Konflik, Studi Kasus Resolusi Konflik Damai, LKPD 4.B.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Salam dan doa pembuka.\n2. Apersepsi (5 Menit):\n   - Guru menampilkan gambar jembatan yang runtuh: "Konflik yang tidak dikelola ibarat membakar jembatan persaudaraan. Bagaimana cara merawat jembatan tersebut?"\n3. Penyampaian Tujuan (3 Menit):\n   - Menyampaikan fokus analisis penyebab dan teknik resolusi konflik.',
          kegiatanInti: `Fase 1: Orientasi pada Realitas Konflik Sosial (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan pelajaran sejarah dari konflik sosial di masa lalu dan pentingnya rekonsiliasi nasional.
• Aktivitas Murid:
  - Menyimak materi Buku Siswa Hal. 122–126 tentang klasifikasi bentuk konflik (vertikal dan horizontal).

Fase 2: Pemetaan Pohon Masalah Konflik (10 Menit)
• Aktivitas Guru:
  - Membagikan LKPD 4.B dan mengajarkan teknik Pohon Konflik (Akar Masalah, Batang/Isu Utama, dan Daun/Dampak).
• Aktivitas Murid:
  - Kelompok memilih satu studi kasus perselisihan sosial untuk dibedah menggunakan diagram pohon masalah.

Fase 3: Analisis Pendekatan Resolusi Konflik (15 Menit)
• Aktivitas Guru (Bimbingan Kritis):
  - Membimbing perbandingan metode penyelesaian: Negosiasi, Mediasi oleh pihak ketiga yang netral, Arbitrase, Konsiliasi, dan Kompromi.
• Aktivitas Murid (4C: Critical Thinking & Collaboration):
  - Merancang langkah-langkah mediasi damai yang adil dan bermartabat bagi kedua belah pihak yang bersengketa.

Fase 4: Simulasi Mediasi Damai (15 Menit)
• Aktivitas Guru:
  - Memfasilitasi simulasi meja perundingan mediasi antarteman.
• Aktivitas Murid (4C: Communication):
  - Perwakilan murid memerankan pihak yang berselisih dan mediator netral untuk menyepakati perjanjian damai win-win solution.

Fase 5: Refleksi & Komitmen Anti-Kekerasan (10 Menit)
• Guru & Murid:
  - Mengukuhkan komitmen: "Menolak segala bentuk kekerasan fisik maupun verbal dalam menyelesaikan masalah".`,
          kegiatanPenutup: '1. Rangkuman (5 Menit):\n   - Menyimpulkan tahapan manajemen konflik berkeadaban.\n2. Tindak Lanjut & Doa (5 Menit):\n   - Penugasan Sub-Bab C: Moderasi Beragama dan Harmoni Sosial, lalu doa penutup.',
          asesmenDiagnostik: 'Tanya jawab: Apa yang kamu lakukan jika melihat dua orang temanmu mulai bertengkar?',
          asesmenFormatif: 'Penilaian diagram pohon konflik dan lembar mediasi damai pada LKPD 4.B.',
          asesmenSumatif: 'Tes tertulis analisis kasus resolusi konflik sosial dan pencegahan disintegrasi.',
          remedial: 'Mengelompokkan 5 dampak negatif konflik sosial dan menyebutkan 3 cara penyelesaian damai.',
          pengayaan: 'Menyusun naskah drama pendek bertema "Duta Damai Sekolah: Menyelesaikan Perselisihan Tanpa Kekerasan".',
          lkpdTitle: 'LKPD 4.B: Analisis Pohon Konflik & Rancangan Mediasi Resolusi Damai',
          lkpdInstructions: [
            'Pilihlah salah satu kasus perselisihan sosial pada Buku Siswa Hal. 124–128.',
            'Lengkapi diagram Pohon Konflik (Akar Penyebab, Isu Utama, Dampak Kerusakan).',
            'Susun naskah kesepakatan damai berbasis pendekatan win-win solution.'
          ],
          lkpdQuestions: [
            'Jelaskan perbedaan antara konflik horizontal (antarkelompok masyarakat) dengan konflik vertikal (masyarakat dengan pemegang kebijakan)!',
            'Sebutkan 3 dampak non-fisik (psikologis dan sosial) yang dialami korban konflik berkepanjangan!',
            'Bagaimana peran seorang mediator dalam memfasilitasi perundingan damai agar tidak memihak salah satu pihak?'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-4b-mediasi',
              type: 'studi_kasus',
              badge: 'Simulasi Mediasi Damai',
              title: 'LKPD 4.B-1: Simulasi Mediasi Sengketa Fasilitas Lapangan Olahraga Antarsekolah',
              instructions: [
                'Pelajari skenario sengketa jadwal penggunaan lapangan olahraga antardua sekolah tetangga.',
                'Bertindaklah sebagai tim mediator independen.',
                'Rumuskan draft MoU (Nota Kesepahaman) pembagian jadwal dan pemeliharaan bersama.'
              ],
              questions: [
                'Klausul apa saja yang harus dicantumkan dalam MoU agar kedua belah pihak merasa diperlakukan adil?',
                'Sanksi mendidik apa yang disepakati jika salah satu pihak melanggar perjanjian?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Keadilan Solusi Mediasi',
                  skor4: 'Rumusan kesepakatan damai sangat adil, komprehensif, tidak berat sebelah, dan mencegah potensi konflik susulan.',
                  skor3: 'Rumusan damai adil dan dapat diterima kedua belah pihak.',
                  skor2: 'Rumusan damai masih menyisakan potensi ketidakpuasan salah satu pihak.',
                  skor1: 'Belum mampu merumuskan solusi damai yang realistis.'
                }
              ]
            }
          ],
          glosarium: 'Mediasi: Upaya penyelesaian sengketa dengan melibatkan pihak ketiga yang netral sebagai fasilitator; Rekonsiliasi: Pemulihan hubungan persahabatan pada keadaan semula setelah terjadinya perselisihan; Win-Win Solution: Penyelesaian masalah di mana semua pihak merasa diuntungkan.',
          daftarPustaka: 'Alwi Lutfi, M., dkk. (2022). Buku Siswa Pendidikan Pancasila SMP Kelas IX. Jakarta: Kemendikbudristek RI.'
        },
        {
          id: 'sub-9-4c',
          code: '4.C',
          title: 'Sub-Bab C: Merajut Harmoni Sosial melalui Sikap Inklusif, Moderasi Beragama, dan Kerjasama Lintas Identitas',
          pages: 'Hal. 133 – 144',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-12)',
          modelPembelajaran: 'Project Based Learning (PjBL) & Aksi Kolaborasi Sahabat Kebhinnekaan',
          tujuanPembelajaran: 'Menerapkan sikap inklusif, prinsip moderasi beragama (komitmen kebangsaan, toleransi, anti-kekerasan, akomodatif terhadap budaya lokal), dan merancang aksi nyata gotong royong lintas agama/budaya.',
          pemahamanBermakna: 'Moderasi beragama bukan mendangkalkan keyakinan, melainkan cara beragama yang santun dan berada di jalan tengah, menjunjung tinggi nilai kemanusiaan, dan membela keutuhan NKRI.',
          pertanyaanPemantik: [
            'Apa yang dimaksud dengan sikap inklusif dalam pergaulan sehari-hari di sekolah?',
            'Mengapa prinsip moderasi beragama sangat penting untuk menjaga kerukunan hidup berbangsa di Indonesia?',
            'Proyek gotong royong apa yang bisa dilakukan bersama teman-teman yang berbeda agama dan suku?'
          ],
          p3Dimensions: ['Beriman & Bertakwa kepada Tuhan YME', 'Berkebinekaan Global', 'Gotong Royong'],
          sarpras: 'Buku Siswa Kelas IX Hal. 133-144, Panduan Moderasi Beragama Kemenag RI, Lembar Rencana Aksi Harmoni, LKPD 4.C.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Salam dan doa.\n2. Apersepsi Inspiratif (5 Menit):\n   - Menampilkan video pemuda lintas iman bergotong royong membersihkan lingkungan dan membagikan bantuan kemanusiaan saat bencana.\n3. Penyampaian Tujuan (3 Menit):\n   - Menyampaikan tujuan penerapan 4 pilar moderasi beragama.',
          kegiatanInti: `Fase 1: Eksplorasi 4 Pilar Moderasi Beragama (10 Menit)
• Aktivitas Guru:
  - Guru menjelaskan 4 indikator moderasi beragama: (1) Komitmen Kebangsaan, (2) Toleransi, (3) Anti-Kekerasan, dan (4) Akomodatif terhadap Budaya Lokal.
• Aktivitas Murid:
  - Mengkaji materi Buku Siswa Hal. 134–139 dan merumuskan contoh perilakunya bagi pelajar.

Fase 2: Perancangan Proyek Sahabat Kebhinnekaan (10 Menit)
• Aktivitas Guru:
  - Membagikan LKPD 4.C dan membimbing perancangan proyek bakti sosial / festival kebudayaan kelas inklusif.
• Aktivitas Murid (Diferensiasi Peran):
  - Membagi tugas tim proyek gotong royong lintas kelas (koleksi donasi buku, penghijauan bersama, pameran kuliner nusantara).

Fase 3: Penyusunan Rencana Aksi & Anggaran (15 Menit)
• Aktivitas Guru:
  - Memberikan masukan agar kegiatan melibatkan seluruh murid secara inklusif tanpa membedakan latar belakang.
• Aktivitas Murid (4C: Collaboration & Creativity):
  - Menyusun rincian jadwal, pembagian peran, dan pesan moral kampanye kerukunan.

Fase 4: Presentasi Draf Proyek Kolaborasi (15 Menit)
• Aktivitas Guru:
  - Memandu sesi tanggapan dan penguatan antarkelompok.
• Aktivitas Murid (4C: Communication):
  - Tiap kelompok memaparkan keunggulan program aksi harmoni sosial mereka.

Fase 5: Pengukuhan Janji Pelajar Penggerak Moderasi (10 Menit)
• Guru & Murid:
  - Bersama-sama mengucapkan komitmen menjaga toleransi dan kerukunan beragama di lingkungan sekolah.`,
          kegiatanPenutup: '1. Rangkuman Bab IV (5 Menit):\n   - Mengulang esensi Bhinneka Tunggal Ika dalam tindakan nyata.\n2. Doa Penutup (5 Menit):\n   - Menutup semester 2 Bab IV dengan doa bersama.',
          asesmenDiagnostik: 'Pertanyaan pembuka: Apa arti kata moderat dan lawan katanya (ekstrem/radikal)?',
          asesmenFormatif: 'Rubrik penilaian draf proyek kolaborasi lintas identitas pada LKPD 4.C.',
          asesmenSumatif: 'Penilaian proposal aksi harmoni sosial dan tes evaluasi akhir Bab IV.',
          remedial: 'Menuliskan 4 indikator moderasi beragama dan memberikan masing-masing 1 contoh tindakan di sekolah.',
          pengayaan: 'Melaksanakan aksi nyata kunjungan sahabat kebhinnekaan ke rumah ibadah atau komunitas budaya sekitar.',
          lkpdTitle: 'LKPD 4.C: Rancang Bangun Proyek Kolaborasi Harmoni Sosial & Moderasi Beragama',
          lkpdInstructions: [
            'Pelajari 4 indikator moderasi beragama pada Buku Siswa Hal. 134–140.',
            'Rancang satu kegiatan gotong royong yang mempertemukan berbagai latar belakang teman secara inklusif.',
            'Lengkapi proposal mini proyek kolaboratif bersama kelompok.'
          ],
          lkpdQuestions: [
            'Jelaskan mengapa moderasi beragama menjadi kunci utama keberhasilan merawat persatuan bangsa Indonesia!',
            'Bagaimana cara membedakan antara sikap toleran yang benar dengan kompromi berlebihan yang mengorbankan akidah keyakinan pribadi?',
            'Tuliskan rencana kegiatan proyek aksi sosial kelompok kalian beserta tujuan kerukunan yang ingin dicapai!'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-4c-proyek',
              type: 'proyek_kreatif',
              badge: 'Proposal Aksi Harmoni',
              title: 'LKPD 4.C-1: Proposal Gerakan "Pelajar Bersaudara: Satu Hati untuk Negeri"',
              instructions: [
                'Susun proposal mini memuat nama kegiatan, latar belakang, sasaran penerima manfaat, dan susunan panitia lintas identitas.',
                'Presentasikan di hadapan wali kelas dan perwakilan pengurus OSIS.'
              ],
              questions: [
                'Bagaimana proyek ini mampu mempererat tali persahabatan antarmurid yang berbeda agama dan suku?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Kelayakan & Semangat Inklusif',
                  skor4: 'Proposal sangat terencana, realistis, menjunjung tinggi nilai inklusivitas, dan sangat layak diimplementasikan.',
                  skor3: 'Proposal baik, terstruktur, dan memuat pesan kerukunan.',
                  skor2: 'Proposal cukup baik namun aspek teknis pelaksanaan masih kurang matang.',
                  skor1: 'Proposal belum lengkap atau kurang mencerminkan nilai kolaborasi.'
                }
              ]
            }
          ],
          glosarium: 'Inklusif: Sikap terbuka mengajak dan merangkul semua orang tanpa membeda-bedakan latar belakang; Moderasi Beragama: Sikap dan cara pandang keagamaan yang moderat, tidak ekstrem kiri maupun ekstrem kanan; Toleransi: Sikap saling menghargai dan membiarkan orang lain menjalankan keyakinannya.',
          daftarPustaka: 'Kementerian Agama RI. (2019). Moderasi Beragama. Jakarta: Badan Litbang dan Diklat Kemenag RI.'
        }
      ]
    },

    // ══════════════════════════════════════════════════════════════
    // BAB 5: MENJAGA KEUTUHAN NKRI DAN BELA NEGARA (SEMESTER 2)
    // ══════════════════════════════════════════════════════════════
    {
      id: 'bab-5-pkn-9',
      babNumber: 5,
      semester: 2,
      title: 'Bab V: Menjaga Keutuhan NKRI dan Partisipasi Warga Negara dalam Pertahanan dan Keamanan Negara',
      description: 'Menganalisis konsep Wawasan Nusantara dan geopolitik pertahanan NKRI, mengidentifikasi ancaman militer, non-militer, dan hibrida (siber, ideologi, krisis lingkungan), serta mewujudkan komitmen aksi nyata bela negara generasi muda.',
      elemen: 'Negara Kesatuan Republik Indonesia',
      subBabList: [
        {
          id: 'sub-9-5a',
          code: '5.A',
          title: 'Sub-Bab A: Konsep Wawasan Nusantara dan Geopolitik Pertahanan Wilayah NKRI',
          pages: 'Hal. 145 – 156',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-13)',
          modelPembelajaran: 'Discovery Learning & Peta Geopolitik Kepulauan Indonesia',
          tujuanPembelajaran: 'Menganalisis hakikat Wawasan Nusantara sebagai geopolitik bangsa Indonesia, Deklarasi Djuanda 1957, asas kesatuan wilayah darat, laut, udara, serta batas-batas kedaulatan NKRI.',
          pemahamanBermakna: 'Bagi bangsa Indonesia, laut bukanlah pemisah pulau-pulau, melainkan pemersatu dan jembatan hati nusantara; seluruh wilayah tanah air adalah satu kesatuan utuh politik, hukum, ekonomi, sosial budaya, dan pertahanan.',
          pertanyaanPemantik: [
            'Mengapa sebelum Deklarasi Djuanda 13 Desember 1957 luas wilayah laut Indonesia hanya 3 mil dari garis pantai?',
            'Apa makna semboyan "Tanah Air" bagi cara pandang persatuan bangsa Indonesia?',
            'Mengapa pulau-pulau terluar Indonesia di perbatasan harus dijaga dan dibangun dengan sungguh-sungguh?'
          ],
          p3Dimensions: ['Bernalar Kritis', 'Mandiri', 'Berkebinekaan Global'],
          sarpras: 'Buku Siswa Kelas IX Hal. 145-156, Peta Wilayah Kedaulatan NKRI & Zona Ekonomi Eksklusif (ZEE), Video Deklarasi Djuanda, LKPD 5.A.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Salam, presensi, doa.\n2. Apersepsi Spasial (5 Menit):\n   - Guru menampilkan peta Indonesia di antara Samudra Hindia dan Pasifik, Benua Asia dan Australia: "Mengapa posisi geografis Indonesia disebut posisi silang yang sangat strategis dan rawan?"\n3. Penyampaian Tujuan (3 Menit):\n   - Menyampaikan kompetensi analisis Wawasan Nusantara.',
          kegiatanInti: `Fase 1: Eksplorasi Sejarah Deklarasi Djuanda (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan kisah kepahlawanan Ir. H. Djuanda Kartawidjaja menyatukan laut pedalaman Indonesia menjadi wilayah kedaulatan utuh yang diakui konvensi PBB (UNCLOS 1982).
• Aktivitas Murid:
  - Menyimak peta perbandingan luas laut teritorial sebelum dan sesudah 1957 pada Buku Siswa Hal. 146–150.

Fase 2: Telaah 4 Aspek Kesatuan Wawasan Nusantara (10 Menit)
• Aktivitas Guru:
  - Membagikan LKPD 5.A dan memandu telaah 4 aspek: (1) Kesatuan Politik, (2) Kesatuan Ekonomi, (3) Kesatuan Sosial Budaya, (4) Kesatuan Pertahanan Keamanan.
• Aktivitas Murid:
  - Kelompok membedah satu aspek kesatuan wilayah dan merumuskan implikasinya bagi kedaulatan bangsa.

Fase 3: Analisis Batas Wilayah & Titik Perbatasan (15 Menit)
• Aktivitas Guru (Scaffolding):
  - Membimbing identifikasi batas laut teritorial (12 mil), ZEE (200 mil), dan landas kontinen.
• Aktivitas Murid (4C: Critical Thinking & Collaboration):
  - Meneliti tantangan penjagaan perbatasan di Pulau Natuna, Miangas, Rote, dan Sebatik dari ancaman pencurian ikan dan klaim sepihak negara asing.

Fase 4: Presentasi & Pemaparan Geopolitik (15 Menit)
• Aktivitas Guru:
  - Memfasilitasi pameran peta kedaulatan nusantara.
• Aktivitas Murid (4C: Communication):
  - Tiap kelompok mempresentasikan argumen pentingnya kedaulatan maritim dan dirgantara bagi kemakmuran rakyat.

Fase 5: Generalisasi Konsep Kesatuan Tanah Air (10 Menit)
• Guru & Murid:
  - Menegaskan bahwa kedaulatan NKRI bersifat harga mati (non-negotiable).`,
          kegiatanPenutup: '1. Rangkuman (5 Menit):\n   - Mengulang makna Deklarasi Djuanda dan 4 pilar kesatuan nusantara.\n2. Doa Penutup (5 Menit):\n   - Menutup kegiatan belajar dengan doa bersama.',
          asesmenDiagnostik: 'Tes lisan: Kapan Hari Nusantara diperingati setiap tahunnya dan apa peristiwa dasarnya?',
          asesmenFormatif: 'Penilaian analisis peta geopolitik kepulauan pada LKPD 5.A.',
          asesmenSumatif: 'Uji kompetensi pilihan ganda dan uraian konsep Wawasan Nusantara.',
          remedial: 'Menggambar peta batas laut teritorial 12 mil dan zona ZEE 200 mil Indonesia.',
          pengayaan: 'Menulis esai singkat: "Pentingnya Pembangunan Kawasan Perbatasan sebagai Beranda Depan NKRI".',
          lkpdTitle: 'LKPD 5.A: Analisis Konsep Geopolitik Wawasan Nusantara & Deklarasi Djuanda',
          lkpdInstructions: [
            'Pelajari peta kedaulatan wilayah NKRI pada Buku Siswa Hal. 146–154.',
            'Bandingkan peta batas wilayah sebelum dan sesudah Deklarasi Djuanda 1957.',
            'Jawablah pertanyaan telaah 4 dimensi kesatuan Wawasan Nusantara.'
          ],
          lkpdQuestions: [
            'Jelaskan mengapa Deklarasi Djuanda 13 Desember 1957 merupakan tonggak sejarah kedua kedaulatan NKRI setelah Proklamasi 17 Agustus 1945!',
            'Sebutkan dan jelaskan 4 aspek perwujudan Wawasan Nusantara sebagai satu kesatuan utuh!',
            'Bagaimana cara kita sebagai generasi muda menjaga kedaulatan pulau-pulau terluar dan kekayaan maritim nusantara?'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-5a-peta',
              type: 'proyek_kreatif',
              badge: 'Peta Tematik Geopolitik',
              title: 'LKPD 5.A-1: Desain Peta Tematik Batas Wilayah Kedaulatan Maritim NKRI',
              instructions: [
                'Gambarkan garis batas laut teritorial, zona tambahan, dan ZEE pada sketsa peta Indonesia.',
                'Beri tanda titik-titik pulau terluar strategis (Natuna, Miangas, Rote, Sabang, Merauke).',
                'Tuliskan narasi singkat mengenai potensi kekayaan sumber daya alam di dalamnya.'
              ],
              questions: [
                'Mengapa konsep negara kepulauan (Archipelagic State) sangat krusial bagi pertahanan nasional Indonesia?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Ketelitian & Kejelasan Peta',
                  skor4: 'Peta digambar sangat presisi, lengkap dengan skala, garis batas ZEE akurat, dan narasi geopolitik mendalam.',
                  skor3: 'Peta digambar rapi dan memuat batas wilayah dengan benar.',
                  skor2: 'Peta cukup rapi namun rincian ZEE masih kurang jelas.',
                  skor1: 'Peta belum selesai atau banyak ketidaktepatan letak geografis.'
                }
              ]
            }
          ],
          glosarium: 'Wawasan Nusantara: Cara pandang bangsa Indonesia tentang diri dan lingkungannya yang serba seragam dan bernilai strategis dengan mengutamakan persatuan bangsa dan kesatuan wilayah; Deklarasi Djuanda: Deklarasi yang menyatakan bahwa segala perairan di sekitar, di antara, dan yang menghubungkan pulau-pulau Indonesia adalah bagian dari wilayah NKRI; ZEE: Zona Ekonomi Eksklusif batas 200 mil laut untuk hak eksplorasi sumber daya.',
          daftarPustaka: 'Lemhannas RI. (2020). Wawasan Nusantara sebagai Geopolitik Indonesia. Jakarta: Lembaga Ketahanan Nasional RI.'
        },
        {
          id: 'sub-9-5b',
          code: '5.B',
          title: 'Sub-Bab B: Bentuk Ancaman Militer, Non-Militer, dan Hibrida (Siber, Ideologi, Separatisme, Krisis Lingkungan)',
          pages: 'Hal. 157 – 168',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-14)',
          modelPembelajaran: 'Problem Based Learning (PBL) & Analisis Matriks Ancaman Ketahanan Nasional',
          tujuanPembelajaran: 'Mengidentifikasi dan menganalisis spektrum ancaman terhadap kedaulatan negara (ancaman militer, ancaman non-militer di bidang Ipoleksosbud, ancaman siber, dan ancaman krisis lingkungan global).',
          pemahamanBermakna: 'Perang modern di era abad ke-21 tidak lagi hanya menggunakan senjata mesiu di medan perang, melainkan perang proksi (proxy war), serangan siber melumpuhkan infrastruktur, perang informasi, dan perebutan sumber daya.',
          pertanyaanPemantik: [
            'Apakah ancaman terhadap negara saat ini hanya berupa serangan tentara negara lain (agresi militer)?',
            'Bagaimana serangan siber (cyber attack) dan perang opini informasi dapat mengancam stabilitas ketahanan nasional?',
            'Mengapa penyelundupan narkoba dan krisis kerusakan lingkungan dapat dikategorikan sebagai ancaman non-militer berbahaya?'
          ],
          p3Dimensions: ['Bernalar Kritis', 'Mandiri', 'Berkebinekaan Global'],
          sarpras: 'Buku Siswa Kelas IX Hal. 157-168, Matriks Ancaman Nasional Kemenhan RI, LCD Proyektor, LKPD 5.B.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Salam dan doa.\n2. Apersepsi (5 Menit):\n   - Menayangkan cuplikan berita serangan peretas (hacker) terhadap data pusat server nasional: "Apakah ini termasuk bentuk perang baru? Siapa yang harus mempertahankan negara?"\n3. Penyampaian Tujuan (3 Menit):\n   - Menyampaikan indikator penguasaan materi spektrum ancaman nasional.',
          kegiatanInti: `Fase 1: Pemetaan Spektrum Ancaman Abad 21 (10 Menit)
• Aktivitas Guru:
  - Guru memaparkan trikotomi ancaman: (1) Ancaman Militer (agresi, spionase, sabotase, terorisme bersenjata), (2) Ancaman Non-Militer (ideologi radikal, krisis ekonomi, perusakan moral generasi lewat narkoba, degradasi lingkungan), (3) Ancaman Hibrida (kombinasi siber, propaganda, dan kekuatan finansial).
• Aktivitas Murid:
  - Menyimak materi Buku Siswa Hal. 158–163.

Fase 2: Pembagian Pos Analisis Ancaman (10 Menit)
• Aktivitas Guru:
  - Membagikan LKPD 5.B dan membagi murid ke dalam 4 pos komando analisis: Pos Ancaman Ideologi, Pos Ancaman Ekonomi, Pos Ancaman Siber/Teknologi, dan Pos Ancaman Separatisme/Terorisme.
• Aktivitas Murid:
  - Mempelajari kasus ancaman riil yang pernah atau sedang dihadapi bangsa Indonesia.

Fase 3: Investigasi & Perumusan Strategi Pertahanan (15 Menit)
• Aktivitas Guru (Scaffolding):
  - Membimbing analisis Sistem Pertahanan dan Keamanan Rakyat Semesta (Sishankamrata) di mana TNI sebagai kekuatan utama, Polri sebagai kekuatan kamtibmas, dan seluruh rakyat sebagai kekuatan pendukung.
• Aktivitas Murid (4C: Critical Thinking & Collaboration):
  - Merumuskan langkah antisipasi dan ketahanan masyarakat terhadap ancaman di pos masing-masing.

Fase 4: Simulasi Briefing Ketahanan Nasional (15 Menit)
• Aktivitas Guru:
  - Memimpin rapat koordinasi ketahanan negara antarkelompok.
• Aktivitas Murid (4C: Communication):
  - Komandan kelompok memaparkan evaluasi kerentanan dan usulan langkah preventif pertahanan non-militer.

Fase 5: Sintesis Kesiapsiagaan Warga Negara (10 Menit)
• Guru & Murid:
  - Menyimpulkan bahwa ketahanan nasional yang tangguh berakar dari persatuan rakyat, kemandirian ekonomi, dan kejernihan ideologi.`,
          kegiatanPenutup: '1. Rangkuman (5 Menit):\n   - Mengulang pilar Sishankamrata dan jenis-jenis ancaman.\n2. Tindak Lanjut & Doa (5 Menit):\n   - Penugasan Sub-Bab C: Aksi Nyata Bela Negara bagi Generasi Muda, lalu doa penutup.',
          asesmenDiagnostik: 'Tes lisan: Apa kepanjangan dari Sishankamrata dan siapa saja komponennya?',
          asesmenFormatif: 'Penilaian lembar kerja matriks ancaman nasional pada LKPD 5.B.',
          asesmenSumatif: 'Uji kompetensi analisis ancaman siber dan pertahanan kedaulatan negara.',
          remedial: 'Mengisi tabel klasifikasi: 3 contoh ancaman militer dan 3 contoh ancaman non-militer.',
          pengayaan: 'Melakukan riset mengenai peran Badan Siber dan Sandi Negara (BSSN) dalam menjaga kedaulatan digital Indonesia.',
          lkpdTitle: 'LKPD 5.B: Matriks Identifikasi Ancaman Militer, Non-Militer, dan Hibrida Abad 21',
          lkpdInstructions: [
            'Pelajari spektrum ancaman nasional pada Buku Siswa Hal. 158–166.',
            'Klasifikasikan jenis ancaman beserta contoh kasus riilnya di Indonesia.',
            'Tentukan strategi penangkalan berbasis Sishankamrata.'
          ],
          lkpdQuestions: [
            'Jelaskan perbedaan mendasar antara ancaman militer dengan ancaman non-militer beserta contohnya!',
            'Mengapa serangan siber (cyber warfare) dan perang informasi di media sosial dapat merusak kedaulatan dan integrasi nasional?',
            'Bagaimana peran komponen cadangan dan komponen pendukung (rakyat) dalam Sistem Pertahanan dan Keamanan Rakyat Semesta (Sishankamrata)?'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-5b-matriks',
              type: 'komparasi',
              badge: 'Matriks Spektrum Ancaman',
              title: 'LKPD 5.B-1: Tabel Analisis Kerentanan & Strategi Penangkalan Ancaman Non-Militer',
              instructions: [
                'Lengkapi tabel dimensi ancaman: Dimensi Ideologi, Politik, Ekonomi, Sosial Budaya, dan Teknologi.',
                'Tuliskan potensi dampak bagi stabilitas nasional dan solusi penanggulangan oleh generasi muda.'
              ],
              questions: [
                'Dimensi ancaman mana yang menurut kelompok paling mendesak untuk diantisipasi oleh pelajar SMP saat ini? Jelaskan alasannya!'
              ],
              targetRubrik: [
                {
                  kriteria: 'Kedalaman Analisis Ancaman',
                  skor4: 'Tabel analisis terisi lengkap, logis, tajam, dan menyajikan solusi pencegahan yang sangat konkret.',
                  skor3: 'Tabel terisi lengkap dan analisis ancaman tepat.',
                  skor2: 'Tabel terisi sebagian dengan penjelasan singkat.',
                  skor1: 'Belum mampu membedakan jenis ancaman dengan tepat.'
                }
              ]
            }
          ],
          glosarium: 'Sishankamrata: Sistem Pertahanan dan Keamanan Rakyat Semesta yang melibatkan seluruh warga negara, wilayah, dan sumber daya nasional; Ancaman Hibrida: Ancaman yang menggabungkan taktik militer konvensional dengan serangan siber, ekonomi, dan perang propaganda informasi; Proxy War: Perang terselubung di mana pihak yang berkepentingan menggunakan pihak ketiga untuk melemahkan negara sasaran.',
          daftarPustaka: 'Kementerian Pertahanan RI. (2021). Buku Putih Pertahanan Indonesia. Jakarta: Kemenhan RI.'
        },
        {
          id: 'sub-9-5c',
          code: '5.C',
          title: 'Sub-Bab C: Peran dan Aksi Nyata Bela Negara Generasi Muda dalam Menjaga Kedaulatan Bangsa',
          pages: 'Hal. 169 – 180',
          alokasiWaktu: '2 x 40 Menit (Pertemuan Ke-15 & 16)',
          modelPembelajaran: 'Project Based Learning (PjBL) & Portofolio Karya Nyata Pelajar Pancasila',
          tujuanPembelajaran: 'Merancang dan melaksanakan aksi nyata bela negara di lingkungan keluarga, sekolah, dan masyarakat sebagai wujud implementasi Pasal 27 ayat (3) dan Pasal 30 ayat (1) UUD NRI Tahun 1945.',
          pemahamanBermakna: 'Bela negara bukan monopoli tentara dengan memanggul senjata; belajar tekun, berprestasi, menjaga lingkungan bersih, melestarikan budaya bangsa, dan memerangi korupsi adalah wujud bela negara sejati bagi pelajar masa kini.',
          pertanyaanPemantik: [
            'Apakah seorang pelajar SMP yang giat belajar dan berprestasi di kancah internasional sudah termasuk melakukan bela negara?',
            'Apa saja 5 nilai dasar bela negara yang wajib diresapi oleh setiap warga negara Indonesia?',
            'Aksi nyata apa yang bisa kita persembahkan sebagai bukti cinta tanah air sebelum menyelesaikan pendidikan di jenjang SMP?'
          ],
          p3Dimensions: ['Beriman & Bertakwa kepada Tuhan YME', 'Gotong Royong', 'Mandiri', 'Kreatif'],
          sarpras: 'Buku Siswa Kelas IX Hal. 169-180, Formulir Komitmen Aksi Bela Negara, Video Prestasi Anak Bangsa, LKPD 5.C.',
          kegiatanAwal: '1. Orientasi & Doa (5 Menit):\n   - Salam, presensi, doa bersama.\n2. Apersepsi Patriotik (5 Menit):\n   - Memutar lagu kebangsaan "Bagimu Negeri" dan menayangkan capaian atlet muda Indonesia mengibarkan Sang Merah Putih di podium juara dunia.\n3. Penyampaian Tujuan (3 Menit):\n   - Menyampaikan target penyusunan portofolio aksi nyata bela negara.',
          kegiatanInti: `Fase 1: Eksplorasi 5 Nilai Dasar Bela Negara (10 Menit)
• Aktivitas Guru:
  - Guru menjelaskan 5 nilai dasar bela negara: (1) Cinta Tanah Air, (2) Sadar Berbangsa dan Bernegara, (3) Setia pada Pancasila sebagai Ideologi Negara, (4) Rela Berkorban untuk Bangsa dan Negara, (5) Memiliki Kemampuan Awal Bela Negara (fisik & psikis).
• Aktivitas Murid:
  - Menelaah materi Buku Siswa Hal. 170–175 dan merumuskan implementasi konkret bagi murid SMP.

Fase 2: Perancangan Proyek Portofolio Bela Negara (10 Menit)
• Aktivitas Guru:
  - Membagikan LKPD 5.C dan membimbing pemilihan klaster aksi: Klaster Literasi Kebangsaan, Klaster Cinta Produk Dalam Negeri & UMKM, Klaster Aksi Peduli Lingkungan Hidup, atau Klaster Prestasi Akademik/Seni/Olahraga.
• Aktivitas Murid (Diferensiasi Minat & Bakat):
  - Memilih klaster aksi dan menyusun rencana kegiatan konkret yang terukur dalam kurun waktu 1-2 minggu.

Fase 3: Penyusunan Dokumen Komitmen & Timeline Aksi (15 Menit)
• Aktivitas Guru:
  - Memberikan umpan balik terhadap kelayakan rencana aksi kelompok.
• Aktivitas Murid (4C: Collaboration & Creativity):
  - Menyusun linimasa pelaksanaan aksi, pembagian penanggung jawab tugas, dan indikator keberhasilan proyek bela negara.

Fase 4: Gelar Karya (Showcase) Aksi Nyata Bela Negara (15 Menit)
• Aktivitas Guru:
  - Memimpin pameran portofolio dan deklarasi janji setia kepada NKRI.
• Aktivitas Murid (4C: Communication):
  - Setiap kelompok mempresentasikan laporan portofolio karya nyata bela negara dengan penuh kebanggaan dan percaya diri.

Fase 5: Refleksi Puncak Pembelajaran Pendidikan Pancasila SMP (10 Menit)
• Guru & Murid:
  - Mengadakan refleksi komprehensif perjalanan belajar Pendidikan Pancasila selama 3 tahun di bangku SMP dan kesiapan melangkah ke jenjang SMA/SMK sebagai generasi penerus bangsa yang berkarakter Profil Pelajar Pancasila.`,
          kegiatanPenutup: '1. Rangkuman & Pesan Kebangsaan (5 Menit):\n   - Guru menyampaikan pesan motivasi kebangsaan kepada seluruh murid.\n2. Doa Syukur & Penutup (5 Menit):\n   - Menyanyikan lagu "Satu Nusa Satu Bangsa" dan menutup rangkaian pembelajaran dengan doa syukur bersama.',
          asesmenDiagnostik: 'Tes lisan: Sebutkan isi Pasal 27 ayat (3) UUD NRI Tahun 1945 tentang hak dan kewajiban bela negara.',
          asesmenFormatif: 'Rubrik penilaian portofolio rancangan aksi nyata bela negara pada LKPD 5.C.',
          asesmenSumatif: 'Penilaian produk akhir portofolio bela negara dan tes akhir semester genap Kelas IX.',
          remedial: 'Menuliskan 5 nilai dasar bela negara beserta 1 contoh penerapannya di rumah dan sekolah.',
          pengayaan: 'Menyusun video dokumenter singkat tentang kisah inspiratif pahlawan lokal di daerah tempat tinggal.',
          lkpdTitle: 'LKPD 5.C: Rancang Bangun Portofolio Aksi Nyata Bela Negara Generasi Muda Indonesia',
          lkpdInstructions: [
            'Pelajari 5 nilai dasar bela negara pada Buku Siswa Hal. 170–178.',
            'Pilihlah salah satu klaster aksi bela negara bersama kelompok.',
            'Susun rencana aksi terperinci, laksanakan kegiatan, dan dokumentasikan laporannya dalam portofolio.'
          ],
          lkpdQuestions: [
            'Jelaskan bunyi dan makna Pasal 27 ayat (3) serta Pasal 30 ayat (1) UUD NRI Tahun 1945 mengenai hak dan kewajiban bela negara bagi setiap warga negara!',
            'Bagaimana cara seorang pelajar mengamalkan nilai "Rela Berkorban untuk Bangsa dan Negara" dalam kehidupan modern saat ini?',
            'Tuliskan rancangan aksi nyata bela negara kelompok kalian beserta sasaran dan target dampak positif yang ingin diwujudkan!'
          ],
          lkpdVariations: [
            {
              id: 'lkpd-9-5c-proyek',
              type: 'proyek_kreatif',
              badge: 'Portofolio Aksi Bela Negara',
              title: 'LKPD 5.C-1: Portofolio Proyek Karya Nyata "Bela Negaraku, Bangga Indonesiaku"',
              instructions: [
                'Dokumentasikan aksi nyata kelompok (misal: kampanye mencintai produk lokal/batik, gerakan bersih lingkungan sekolah, pembuatan konten video sejarah perjuangan pahlawan).',
                'Sertakan foto bukti kegiatan, refleksi kendala yang dihadapi, dan testimoni rekan sejawat.',
                'Kumpulkan dalam bentuk bundel portofolio cetak/digital.'
              ],
              questions: [
                'Pelajaran hidup (life lesson) apa yang paling berharga yang kalian peroleh setelah menyelesaikan proyek aksi bela negara ini?'
              ],
              targetRubrik: [
                {
                  kriteria: 'Dampak & Orisinalitas Aksi',
                  skor4: 'Portofolio memuat aksi nyata yang sangat orisinal, berdampak nyata bagi lingkungan sekitar, dan terdokumentasi dengan sangat rapi.',
                  skor3: 'Portofolio memuat aksi nyata yang baik, rapi, dan terdokumentasi dengan baik.',
                  skor2: 'Portofolio memuat aksi yang bersifat umum dan dokumentasi cukup.',
                  skor1: 'Portofolio belum lengkap atau hanya memuat teori tanpa aksi nyata.'
                },
                {
                  kriteria: 'Kedalaman Refleksi Diri',
                  skor4: 'Refleksi sangat jujur, mendalam, dan menunjukkan transformasi karakter cinta tanah air yang kuat.',
                  skor3: 'Refleksi jelas dan menunjukkan pemahaman nilai bela negara yang baik.',
                  skor2: 'Refleksi cukup baik namun masih normatif.',
                  skor1: 'Refleksi belum terisi secara mendalam.'
                }
              ]
            }
          ],
          glosarium: 'Bela Negara: Sikap dan perilaku warga negara yang dijiwai oleh kecintaannya kepada NKRI yang berdasarkan Pancasila dan UUD 1945 dalam menjamin kelangsungan hidup bangsa dan negara; Nilai Dasar Bela Negara: Lima fondasi karakter patriotik warga negara; Portofolio: Kumpulan hasil karya dan dokumentasi kegiatan seseorang yang disusun secara sistematis.',
          daftarPustaka: 'Dewan Ketahanan Nasional (Wantannas). (2020). Modul Pembinaan Kesadaran Bela Negara. Jakarta: Setjen Wantannas RI.'
        }
      ]
    }
  ]
};
