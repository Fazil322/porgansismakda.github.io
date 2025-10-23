
import { useState } from 'react';
import { VotingEvent, Candidate, VotingToken, Organization, Activity, NewsItem, Aspiration, Registration, VoteRecord } from '../types';

const generateTokens = (count: number): VotingToken[] => {
  const tokens: VotingToken[] = [];
  for (let i = 0; i < count; i++) {
    tokens.push({
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: 'active',
    });
  }
  return tokens;
};

const initialCandidates: Candidate[] = [
    { id: 1, name: 'Aditya Pratama', vision: 'Mewujudkan OSIS yang aktif, kreatif, dan inovatif bagi seluruh siswa.', mission: '1. Mengadakan event-event edukatif.\n2. Menampung dan merealisasikan aspirasi siswa.\n3. Menjalin kerjasama antar organisasi.', photoUrl: 'https://i.pravatar.cc/150?u=aditya', votes: 120, bio: 'Siswa kelas XI TKJ 1, aktif di organisasi Pramuka dan Paskibra.' },
    { id: 2, name: 'Citra Kirana', vision: 'Menjadikan sekolah sebagai tempat yang nyaman dan inspiratif untuk belajar.', mission: '1. Program kebersihan lingkungan sekolah.\n2. Mengaktifkan kembali mading sekolah.\n3. Mengadakan lomba-lomba antar kelas.', photoUrl: 'https://i.pravatar.cc/150?u=citra', votes: 155, bio: 'Siswa kelas XI AKL 2, anggota PMR dan tim debat Bahasa Inggris.' },
    { id: 3, name: 'Bima Sakti', vision: 'Meningkatkan solidaritas dan prestasi siswa di bidang akademik maupun non-akademik.', mission: '1. Membuat kelompok belajar bersama.\n2. Mengadakan turnamen olahraga.\n3. Mengapresiasi siswa berprestasi.', photoUrl: 'https://i.pravatar.cc/150?u=bima', votes: 98, bio: 'Siswa kelas XI TSM, kapten tim futsal sekolah.' },
];

const initialOrganizations: Organization[] = [
    { id: 1, name: 'OSIS', description: 'Organisasi Siswa Intra Sekolah, wadah bagi siswa untuk belajar berorganisasi dan menyalurkan aspirasi.', imageUrl: 'https://via.placeholder.com/150/06b6d4/FFFFFF?text=OSIS', members: ['Ahmad', 'Budi', 'Citra', 'Dewi', 'Eka'] },
    { id: 2, name: 'Pramuka', description: 'Gerakan kepanduan yang mendidik anggotanya dalam hal kemandirian, keterampilan, dan kepemimpinan.', imageUrl: 'https://via.placeholder.com/150/8b5cf6/FFFFFF?text=Pramuka', members: ['Fajar', 'Gita', 'Hadi', 'Indah'] },
    { id: 3, name: 'PMR', description: 'Palang Merah Remaja, organisasi yang bergerak di bidang kemanusiaan dan kesehatan.', imageUrl: 'https://via.placeholder.com/150/ec4899/FFFFFF?text=PMR', members: ['Joko', 'Kartika', 'Lina', 'Mira', 'Naufal'] },
    { id: 4, name: 'Paskibra', description: 'Pasukan Pengibar Bendera, melatih kedisiplinan dan cinta tanah air.', imageUrl: 'https://via.placeholder.com/150/f59e0b/FFFFFF?text=Paskibra', members: ['Putra', 'Rina', 'Sari', 'Tono'] },
];

const initialActivities: Activity[] = [
    { id: 1, date: '17 AGU', title: 'Upacara Bendera HUT RI', organizer: 'Paskibra' },
    { id: 2, date: '25 SEP', title: 'Latihan Gabungan PMR', organizer: 'PMR' },
    { id: 3, date: '10 OKT', title: 'Rapat Program Kerja OSIS', organizer: 'OSIS' },
    { id: 4, date: '28 OKT', title: 'Perkemahan Sumpah Pemuda', organizer: 'Pramuka' },
];

const initialNews: NewsItem[] = [
    { id: 1, title: 'OSIS Gelar Rapat Awal Tahun Bahas Program Kerja', content: 'OSIS SMK LPPMRI 2 Kedungreja mengadakan rapat perdananya di tahun ajaran baru untuk membahas rencana program kerja setahun ke depan. Rapat dihadiri oleh seluruh pengurus OSIS dan perwakilan dari setiap kelas. Berbagai usulan kegiatan inovatif dibahas untuk meningkatkan partisipasi siswa.', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', organizationTag: 'OSIS' },
    { id: 2, title: 'Tim PMR Raih Juara 2 Lomba Pertolongan Pertama', content: 'Tim PMR sekolah berhasil mengharumkan nama sekolah dengan meraih Juara 2 dalam Lomba Pertolongan Pertama yang diadakan di tingkat kabupaten. Keberhasilan ini merupakan buah dari latihan rutin dan kerja keras seluruh anggota tim.', imageUrl: 'https://images.unsplash.com/photo-1628863119423-86d14871d882?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', organizationTag: 'PMR' },
];

const initialAspirations: Aspiration[] = [
    { id: 1, text: "Tolong perbaiki fasilitas toilet siswa, beberapa pintu rusak.", status: 'read', category: 'Fasilitas', timestamp: Date.now() - 86400000 * 2 },
    { id: 2, text: "Adakan lebih banyak ekstrakurikuler di bidang seni, seperti teater atau musik.", status: 'read', category: 'Kegiatan Kesiswaan', timestamp: Date.now() - 86400000 },
    { id: 3, text: "Saya berharap ada wifi gratis di area taman sekolah untuk belajar.", status: 'unread', timestamp: Date.now() },
];

export const useMockVotingData = () => {
    const [votingEvent, setVotingEvent] = useState<VotingEvent | null>({
        title: 'Pemilihan Ketua OSIS 2024/2025',
        description: 'Gunakan hak pilihmu untuk menentukan pemimpin OSIS periode selanjutnya. Pilihlah kandidat yang paling sesuai dengan aspirasimu untuk sekolah yang lebih baik.',
        startDate: '2024-07-20T08:00:00',
        endDate: '2024-08-30T16:00:00',
        isActive: true,
        candidates: initialCandidates,
    });
    
    const [votingTokens, setVotingTokens] = useState<VotingToken[]>(generateTokens(300));
    const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
    const [activities, setActivities] = useState<Activity[]>(initialActivities);
    const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNews);
    const [aspirations, setAspirations] = useState<Aspiration[]>(initialAspirations);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    
    const [voteHistory, setVoteHistory] = useState<VoteRecord[]>([
        { id: 'v1', candidateId: 2, timestamp: Date.now() - 86400000 * 3 },
        { id: 'v2', candidateId: 1, timestamp: Date.now() - 86400000 * 2.5 },
        { id: 'v3', candidateId: 2, timestamp: Date.now() - 86400000 * 2 },
        { id: 'v4', candidateId: 3, timestamp: Date.now() - 86400000 * 1 },
        { id: 'v5', candidateId: 2, timestamp: Date.now() - 3600000 },
    ]);


    return {
        votingEvent,
        setVotingEvent,
        votingTokens,
        setVotingTokens,
        organizations,
        setOrganizations,
        activities,
        setActivities,
        newsItems,
        setNewsItems,
        aspirations,
        setAspirations,
        voteHistory,
        setVoteHistory,
        registrations,
        setRegistrations,
    };
};
