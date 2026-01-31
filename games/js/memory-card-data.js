// Memory Card Game Data Bank
// Berbagai gambar untuk kartu memory dengan tema dunia cerita anak

const cardImages = [
    // Karakter Anak
    {
        id: 1,
        name: 'anak-laki',
        image: 'assets/images/memory-card/anak-laki.svg',
        category: 'character'
    },
    {
        id: 2,
        name: 'anak-perempuan',
        image: 'assets/images/memory-card/anak-perempuan.svg',
        category: 'character'
    },
    {
        id: 3,
        name: 'anak-belajar',
        image: 'assets/images/memory-card/anak-belajar.svg',
        category: 'character'
    },
    {
        id: 4,
        name: 'anak-bermain',
        image: 'assets/images/memory-card/anak-bermain.svg',
        category: 'character'
    },
    
    // Bangunan
    {
        id: 5,
        name: 'rumah',
        image: 'assets/images/memory-card/rumah.svg',
        category: 'building'
    },
    {
        id: 6,
        name: 'masjid',
        image: 'assets/images/memory-card/masjid.svg',
        category: 'building'
    },
    {
        id: 7,
        name: 'sekolah',
        image: 'assets/images/memory-card/sekolah.svg',
        category: 'building'
    },
    {
        id: 8,
        name: 'perpustakaan',
        image: 'assets/images/memory-card/perpustakaan.svg',
        category: 'building'
    },
    
    // Alam
    {
        id: 9,
        name: 'pohon',
        image: 'assets/images/memory-card/pohon.svg',
        category: 'nature'
    },
    {
        id: 10,
        name: 'bunga',
        image: 'assets/images/memory-card/bunga.svg',
        category: 'nature'
    },
    {
        id: 11,
        name: 'matahari',
        image: 'assets/images/memory-card/matahari.svg',
        category: 'nature'
    },
    {
        id: 12,
        name: 'awan',
        image: 'assets/images/memory-card/awan.svg',
        category: 'nature'
    },
    
    // Hewan
    {
        id: 13,
        name: 'kucing',
        image: 'assets/images/memory-card/kucing.svg',
        category: 'animal'
    },
    {
        id: 14,
        name: 'burung',
        image: 'assets/images/memory-card/burung.svg',
        category: 'animal'
    },
    {
        id: 15,
        name: 'kupu-kupu',
        image: 'assets/images/memory-card/kupu-kupu.svg',
        category: 'animal'
    },
    {
        id: 16,
        name: 'kelinci',
        image: 'assets/images/memory-card/kelinci.svg',
        category: 'animal'
    },
    
    // Objek
    {
        id: 17,
        name: 'buku',
        image: 'assets/images/memory-card/buku.svg',
        category: 'object'
    },
    {
        id: 18,
        name: 'pensil',
        image: 'assets/images/memory-card/pensil.svg',
        category: 'object'
    },
    {
        id: 19,
        name: 'tas',
        image: 'assets/images/memory-card/tas.svg',
        category: 'object'
    },
    {
        id: 20,
        name: 'mainan',
        image: 'assets/images/memory-card/mainan.svg',
        category: 'object'
    },
    
    // Makanan
    {
        id: 21,
        name: 'apel',
        image: 'assets/images/memory-card/apel.svg',
        category: 'food'
    },
    {
        id: 22,
        name: 'pisang',
        image: 'assets/images/memory-card/pisang.svg',
        category: 'food'
    },
    {
        id: 23,
        name: 'roti',
        image: 'assets/images/memory-card/roti.svg',
        category: 'food'
    },
    {
        id: 24,
        name: 'susu',
        image: 'assets/images/memory-card/susu.svg',
        category: 'food'
    },
    
    // Transportasi
    {
        id: 25,
        name: 'sepeda',
        image: 'assets/images/memory-card/sepeda.svg',
        category: 'transport'
    },
    {
        id: 26,
        name: 'mobil',
        image: 'assets/images/memory-card/mobil.svg',
        category: 'transport'
    },
    {
        id: 27,
        name: 'pesawat',
        image: 'assets/images/memory-card/pesawat.svg',
        category: 'transport'
    },
    {
        id: 28,
        name: 'kapal',
        image: 'assets/images/memory-card/kapal.svg',
        category: 'transport'
    }
];

// Level configurations
const levelConfigs = {
    mudah: {
        name: 'MUDAH',
        grid: 'easy',
        pairs: 4,
        totalCards: 9, // 8 cards + 1 bonus
        bonusCard: true
    },
    sedang: {
        name: 'SEDANG',
        grid: 'medium',
        pairs: 8,
        totalCards: 16,
        bonusCard: false
    },
    sulit: {
        name: 'SULIT',
        grid: 'hard',
        pairs: 12,
        totalCards: 25, // 24 cards + 1 bonus
        bonusCard: true
    }
};

// Fungsi untuk mengambil kartu acak berdasarkan level
function getCardsForLevel(level) {
    const config = levelConfigs[level];
    if (!config) {
        console.error('Level tidak valid:', level);
        return [];
    }
    
    // Ambil kartu acak sesuai jumlah pasangan
    const shuffled = [...cardImages].sort(() => Math.random() - 0.5);
    const selectedCards = shuffled.slice(0, config.pairs);
    
    // Buat pasangan kartu
    const cards = [];
    selectedCards.forEach((card, index) => {
        cards.push({ ...card, pairId: card.id, cardId: index * 2 });
        cards.push({ ...card, pairId: card.id, cardId: index * 2 + 1 });
    });
    
    // Tambahkan kartu bonus jika diperlukan
    if (config.bonusCard && cards.length < config.totalCards) {
        const bonusCard = {
            id: 999,
            name: 'bonus',
            image: 'assets/images/memory-card/bonus.svg',
            category: 'special',
            pairId: 999,
            cardId: cards.length
        };
        cards.push(bonusCard);
    }
    
    // Acak posisi kartu
    return shuffleArray(cards);
}

// Fungsi untuk mengacak array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Fungsi untuk mendapatkan konfigurasi level
function getLevelConfig(level) {
    return levelConfigs[level] || null;
}

// Export untuk digunakan di game logic
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        cardImages, 
        levelConfigs, 
        getCardsForLevel, 
        shuffleArray, 
        getLevelConfig 
    };
}
