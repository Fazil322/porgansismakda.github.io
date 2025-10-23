
import { GoogleGenAI, Type } from "@google/genai";
import { Aspiration } from "../types";

// Initialize Gemini API. Assuming API_KEY is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNewsArticle = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Buatlah sebuah artikel berita singkat (sekitar 3-4 paragraf) untuk portal berita sekolah berdasarkan poin-poin berikut. Artikel harus informatif, netral, dan mudah dibaca oleh siswa. Gunakan gaya bahasa jurnalistik yang sesuai untuk lingkungan sekolah. Poin-poin: "${prompt}"`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating news article:", error);
    throw new Error("Failed to generate news article with AI.");
  }
};

export const generateAspirationThemes = async (aspirations: Aspiration[]): Promise<string> => {
    if (aspirations.length === 0) return "Tidak ada data untuk dianalisis.";
    
    const aspirationText = aspirations.map(a => `- ${a.text} (Kategori: ${a.category})`).join('\n');

    const prompt = `
    Analisis daftar aspirasi siswa berikut yang telah dikategorikan. 
    Identifikasi 2-3 tema utama yang muncul dari aspirasi ini.
    Untuk setiap tema, berikan ringkasan singkat (1-2 kalimat) dan satu rekomendasi tindakan konkret yang bisa diambil oleh pihak sekolah atau OSIS.
    Format output dalam bentuk poin-poin ringkas menggunakan Markdown (gunakan **bold** untuk judul tema).
    
    Contoh output:
    **Tema: Peningkatan Fasilitas Belajar**
    Ringkasan: Banyak siswa menginginkan peningkatan fasilitas seperti perbaikan proyektor dan penambahan koleksi buku di perpustakaan.
    Rekomendasi: Lakukan inventarisasi fasilitas yang perlu diperbaiki dan ajukan proposal pengadaan buku baru ke pihak sekolah.

    Data Aspirasi:
    ${aspirationText}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
            },
        });
        return response.text.replace(/\n/g, '<br />');
    } catch (error) {
        console.error("Error generating aspiration themes:", error);
        throw new Error("Failed to generate aspiration themes with AI.");
    }
};


export const categorizeAspirations = async (aspirations: Aspiration[]): Promise<Aspiration[]> => {
    if (aspirations.length === 0) return [];
    
    const categories = ["Akademik", "Fasilitas", "Kegiatan Kesiswaan", "Lingkungan Sekolah", "Lain-lain"];
    
    const prompt = `
    Anda adalah asisten AI yang membantu mengelola aspirasi siswa.
    Kategorikan setiap aspirasi berikut ke dalam salah satu kategori ini: ${categories.join(', ')}.
    Gunakan kategori "Lain-lain" jika tidak yakin.

    Aspirasi:
    ${aspirations.map(a => `ID ${a.id}: ${a.text}`).join('\n')}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        categorizedAspirations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.NUMBER },
                                    category: { type: Type.STRING, enum: categories }
                                },
                                required: ["id", "category"]
                            }
                        }
                    },
                    required: ["categorizedAspirations"]
                }
            },
        });
        
        const jsonText = response.text.trim();
        const result: { categorizedAspirations: {id: number; category: string}[] } = JSON.parse(jsonText);
        const categorizedMap = new Map(result.categorizedAspirations.map(item => [item.id, item.category]));

        return aspirations.map(aspiration => ({
            ...aspiration,
            category: categorizedMap.get(aspiration.id) || 'Lain-lain',
            status: 'read' as const,
        }));

    } catch (error) {
        console.error("Error categorizing aspirations:", error);
        return aspirations.map(a => ({
            ...a,
            category: 'Lain-lain', 
            status: 'read',
        }));
    }
};
