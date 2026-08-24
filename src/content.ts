export type PhotoAsset = {
  path: string
  alt: string
  placeholderLabel: string
  objectPosition: string
  optional: boolean
  available: boolean
}

export type DocketMatter = {
  title: string
  status: string
  detail?: string
}

// Add photos at these paths, then set their `available` flags to true.
// Optional assets remain out of the DOM while unavailable; required assets render stable placeholders.
export const photoAssets = {
  portrait: {
    path: 'her-img/dung-portrait.png',
    alt: 'Chân dung gần đây của Dung ở tuổi hai mươi hai.',
    placeholderLabel: 'Chân dung gần đây của Dung',
    objectPosition: '50% 14%',
    optional: false,
    available: true,
  },
  childhood: {
    path: 'her-img/dung-childhood.png',
    alt: 'Một bức ảnh thời thơ ấu của Dung.',
    placeholderLabel: 'Ảnh thời thơ ấu của Dung',
    objectPosition: '50% 35%',
    optional: false,
    available: true,
  },
  highSchoolGroup: {
    path: 'her-img/highschool-group.jpg',
    alt: 'Dung bên nhóm bạn thân từ thời cấp ba.',
    placeholderLabel: 'Ảnh nhóm bạn cấp ba',
    objectPosition: '50% 70%',
    optional: false,
    available: true,
  },
  highSchoolMemory: {
    path: 'her-img/highschool-memory.jpg',
    alt: 'Một khoảnh khắc đời thường của Dung bên nhóm bạn cấp ba.',
    placeholderLabel: 'Ảnh kỷ niệm cấp ba — không bắt buộc',
    objectPosition: '50% 50%',
    optional: true,
    available: false,
  },
  graduation: {
    path: 'her-img/dung-graduation-cropped.png',
    alt: 'Dung trong lễ phục tốt nghiệp sau khi hoàn thành chương trình Luật.',
    placeholderLabel: 'Chân dung tốt nghiệp chính',
    objectPosition: '50% 12%',
    optional: false,
    available: true,
  },
  graduationSecondary: {
    path: 'her-img/dung-graduation-secondary.jpg',
    alt: 'Dung tại ULAW trong dịp lễ tốt nghiệp.',
    placeholderLabel: 'Ảnh không gian lễ tốt nghiệp — không bắt buộc',
    objectPosition: '50% 50%',
    optional: true,
    available: false,
  },
} satisfies Record<string, PhotoAsset>

// Add /public/audio/background.mp3 and set `available` to true when music is selected.
export const audioAsset = {
  path: 'music.mp3',
  available: true,
  volume: 0.2,
}

export const siteContent = {
  cover: {
    institution: '⚖️ Hội đồng Tối cao về Chuyện Sinh nhật',
    caseNumber: 'HỒ SƠ SỐ 22',
    title: 'V/V: THÙI BƯỚC SANG TUỔI 22',
    subtitle: 'Về việc chính thức bước sang tuổi hai mươi hai.',
    filed: '🗓️ Lập hồ sơ • Tháng 8.2026',
    confidentiality: '🔒 BẢO MẬT • CHỈ DÙNG CHO MỤC ĐÍCH SINH NHẬT',
    cta: 'MỞ HỒ SƠ',
  },

  opening: {
    label: '📜 LỜI TRÌNH BÀY MỞ ĐẦU',
    statement:
      'Ở tuổi 22, Thùi đã tỏa sáng với bốn năm học Luật, chính thức cầm trong tay tấm bằng Cử nhân, ngoài tự tin về tài năng của mình, cô ấy còn tự tin về cả nhan sắc của mình, và còn cho rằng một tấm bằng vẫn chưa đủ.',
    direction: '🔎 Hội đồng xin tiến hành xem xét chứng cứ.',
    cta: 'XEM XÉT CHỨNG CỨ',
  },

  exhibits: {
    childhood: {
      label: '🧸 CHỨNG CỨ A',
      title: 'Khởi đầu câu chuyện',
      copy: 'Chứng cứ hình ảnh ban đầu cho thấy sự tự tin này đã xuất hiện từ rất sớm.',
      cta: 'CHỨNG CỨ TIẾP THEO',
    },

    highSchool: {
      label: '🎒 CHỨNG CỨ B',
      title: 'Những năm tháng cấp ba',
      copy: 'Trong hồ sơ những năm cấp ba, có một nhóm bạn xuất hiện đủ nhiều để rồi trở thành một phần không thể thiếu.',
      cta: 'CHỨNG CỨ TIẾP THEO',
    },

    graduation: {
      label: '🎓 CHỨNG CỨ C',
      title: 'Chặng đường Luật ⚖️',
      headline: 'KHÉP LẠI HỒ SƠ.',
      subheading: 'Tấm bằng Cử nhân Luật, chính thức trong tay.',
      copy: 'Bốn năm, vô số hạn chót và một lễ tốt nghiệp sau đó, chứng cứ đã quá rõ ràng.',
      cta: 'XEM CÁC VIỆC CÒN CHỜ',
      status: '⚖️ ULAW • TỐT NGHIỆP • 2026',
    },
  },

  pending: {
    label: '📋 CÁC VIỆC ĐANG CHỜ XỬ LÝ',
    cta: 'ĐỀ NGHỊ PHÁN QUYẾT',

    matters: [
      {
        title: '🎓 Hồ sơ cao học',
        status: '⏳ QUY TRÌNH ĐANG TIẾP DIỄN',
        detail: 'Hồ sơ hiện đang chờ kết quả từ phía có thẩm quyền.',
      },

      {
        title: '💼 Sự nghiệp',
        status: '📈 RẤT CÓ TRIỂN VỌNG',
        detail: 'Hành trình của một luật sư ở tòa nhà chọc trời đang được nuôi dưỡng, và có vẻ sẽ còn rất nhiều cơ hội phía trước.',
      },

      {
        title: '🏙️ Nhà 69 lầu và 36 chiếc xe hơi',
        status: '✨ ĐẶC BIỆT KHUYẾN NGHỊ',
      },

      {
        title: '💌 Chàng trai rich kid khéo miệng',
        status: '👀 ĐANG XEM XÉT',
      },
    ] satisfies DocketMatter[],
  },

  judgment: {
    label: 'PHÁN QUYẾT CUỐI CÙNG',
    copy: 'Sau khi xem xét toàn bộ chứng cứ, Hội đồng đi đến kết luận: Thùi chính thức đã hai mươi hai tuổi, đầy tham zọng, tỏa sáng trong từng bức ảnh, và có tương lai sáng lạn phía trước.',
    celebration: 'CHÚC MỪNG SINH NHẬT 22 TUỔI, THÙI. ✨',
    signature: 'Bóng 🎈',
    signatureTitle: 'Cố vấn Ban Sinh nhật',
    cta: 'CÒN MỘT LỜI NHẮN',
  },

  personalLetter: {
    eyebrow: '💌 NGOÀI HỒ SƠ',
    title: 'Một lời nhắn từ Bóng 🎈',
    openCta: 'MỞ THƯ',

    body: 'Hé lô Thùi, là Bóng 🎈 đây. Bóng chúc mừng Thùi sinh nhật 22 thậc zui zẻ nhóe 🎂. Năm vừa qua Thùi đã có 1 năm cảm xúc bùn vui lẫn lộn, thăng hoa cảm xúc, tận đáy đao khổ. Vị mà sau tất cả chuyện đó, chụy Thùi zẫn siu tỏa sáng ✨ và còn ngồi nhâm nhi ly Cà phê Laura 2 vị ☕ ở tòa nhà chọc trời, ngồi trên chiếc ghế văn phòng êm ái và xử lý các hồ sơ một cách kinh ngạc. Bóng chúc Thùi một năm mới 23 tuổi thật nhiều niềm vui mới, nhiều trải nghiệm sẽ còn đến với Thùi. Có thể là anh chàng kia sẽ thuyết phục đc Thùi 👀. Và mong tụi mình sẽ cùng phát triển để các cuộc hẹn đi chơi xa không còn là dự án ma =)))))))))).',

    signature: 'Bóng 🎈',
    continueCta: 'XEM THÔNG BÁO KHÁNG CÁO',
  },

  appeal: {
    label: 'THÔNG BÁO KHÁNG CÁO',
    copy: 'Tuổi 22 có quyền kháng cáo phán quyết này trong vòng 365 ngày.',
    cta: 'HẸN GẶP Ở TUỔI 23 🎈',
  },
} as const
