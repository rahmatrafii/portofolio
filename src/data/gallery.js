export const galleryPhotos = [
  { file: 'IMG_0815.JPG', name: 'award', alt: 'Foto bersama di panggung sambil memegang sertifikat penghargaan.' },
  { file: '1000277882.jpg', name: 'community', alt: 'Foto bersama peserta kegiatan di ruang kelas.' },
  { file: 'gambar wa.jpeg', name: 'poster', alt: 'Tiga peserta berdiri bersama di samping poster presentasi.' },
  { file: 'IMG_2836.JPG', name: 'workshop', alt: 'Peserta berdiskusi dan mencoba aplikasi pada laptop.' },
  { file: 'IMG_0985.JPG', name: 'gathering', alt: 'Swafoto bersama peserta kegiatan di ruang pertemuan.' },
  { file: 'IMG_3464.JPG', name: 'gdg', alt: 'Jaket biru dengan tulisan Google Developer Group on Campus.' },
  { file: 'IMG_3417.JPG', name: 'team', position: '15% center', alt: 'Lima anggota tim berjaket biru berfoto bersama di luar ruangan.' },
];

// Nine depth layers match the reference; the final two reuse the first two photos.
export const galleryLayers = [...galleryPhotos, ...galleryPhotos.slice(0, 2)];
