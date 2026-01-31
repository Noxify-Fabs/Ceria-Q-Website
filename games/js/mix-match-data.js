// Mix & Match Game Data Bank
// 25 pasangan soal edukatif Islami untuk anak

const gameData = [
    // Pasangan 1-5: Ibadah Dasar
    {
        id: 1,
        image: "assets/images/mix-match/masjid.svg",
        text: "Tempat shalat berjamaah"
    },
    {
        id: 2,
        image: "assets/images/mix-match/alquran.svg",
        text: "Kitab suci umat Islam"
    },
    {
        id: 3,
        image: "assets/images/mix-match/sajadah.svg",
        text: "Alat untuk shalat"
    },
    {
        id: 4,
        image: "assets/images/mix-match/wudhu.svg",
        text: "Bersuci sebelum shalat"
    },
    {
        id: 5,
        image: "assets/images/mix-match/mukena.svg",
        text: "Pakaian shalat perempuan"
    },

    // Pasangan 6-10: Akhlak Mulia
    {
        id: 6,
        image: "assets/images/mix-match/sedekah.svg",
        text: "Memberi kepada yang membutuhkan"
    },
    {
        id: 7,
        image: "assets/images/mix-match/jujur.svg",
        text: "Berkata benar"
    },
    {
        id: 8,
        image: "assets/images/mix-match/sopan.svg",
        text: "Santun kepada orang tua"
    },
    {
        id: 9,
        image: "assets/images/mix-match/berbagi.svg",
        text: "Memberikan pada teman"
    },
    {
        id: 10,
        image: "assets/images/mix-match/sabar.svg",
        text: "Tidak mudah marah"
    },

    // Pasangan 11-15: Aktivitas Anak Muslim
    {
        id: 11,
        image: "assets/images/mix-match/anak-sholat.svg",
        text: "Beribadah kepada Allah"
    },
    {
        id: 12,
        image: "assets/images/mix-match/anak-belajar.svg",
        text: "Mencari ilmu pengetahuan"
    },
    {
        id: 13,
        image: "assets/images/mix-match/anak-doa.svg",
        text: "Memohon kepada Allah"
    },
    {
        id: 14,
        image: "assets/images/mix-match/anak-bantu.svg",
        text: "Membantu orang tua"
    },
    {
        id: 15,
        image: "assets/images/mix-match/anak-makan.svg",
        text: "Membaca doa sebelum makan"
    },

    // Pasangan 16-20: Simbol Islam
    {
        id: 16,
        image: "assets/images/mix-match/kaligrafi.svg",
        text: "Seni tulis Arab Islam"
    },
    {
        id: 17,
        image: "assets/images/mix-match/tasbih.svg",
        text: "Alat untuk berdzikir"
    },
    {
        id: 18,
        image: "assets/images/mix-match/kaaba.svg",
        text: "Arah kiblat shalat"
    },
    {
        id: 19,
        image: "assets/images/mix-match/bulan-sabit.svg",
        text: "Simbul penentu waktu puasa"
    },
    {
        id: 20,
        image: "assets/images/mix-match/bintang.svg",
        text: "Cahaya di malam hari"
    },

    // Pasangan 21-25: Konsep Islami
    {
        id: 21,
        image: "assets/images/mix-match/keluarga.svg",
        text: "Kasih sayang sesama keluarga"
    },
    {
        id: 22,
        image: "assets/images/mix-match/teman.svg",
        text: "Persahabatan yang baik"
    },
    {
        id: 23,
        image: "assets/images/mix-match/sekolah.svg",
        text: "Tempat belajar ilmu"
    },
    {
        id: 24,
        image: "assets/images/mix-match/rumah.svg",
        text: "Tempat tinggal keluarga"
    },
    {
        id: 25,
        image: "assets/images/mix-match/taman.svg",
        text: "Ciptaan Allah yang indah"
    }
];

// Fungsi untuk mengambil 5 pasangan acak
function getRandomPairs(count = 5) {
    const shuffled = [...gameData].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Fungsi untuk mengacak posisi
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Export untuk digunakan di game logic
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameData, getRandomPairs, shuffleArray };
}
