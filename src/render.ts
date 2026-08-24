import { photoAssets, siteContent, type DocketMatter, type PhotoAsset } from './content.ts'
import { publicAssetUrl } from './utils/publicAssetUrl.ts'

const renderPhoto = (asset: PhotoAsset, className = ''): string => {
  if (asset.optional && !asset.available) {
    return ''
  }

  const classes = ['photo-slot', className].filter(Boolean).join(' ')

  if (asset.available) {
    return `
      <figure
        class="${classes} photo-slot--available"
        data-photo-path="/public/${asset.path}"
        data-photo-state="available"
      >
        <img
          src="${publicAssetUrl(asset.path)}"
          alt="${asset.alt}"
          loading="lazy"
          decoding="async"
          style="object-position: ${asset.objectPosition}"
        />
      </figure>
    `
  }

  return `
    <figure
      class="${classes} photo-slot--placeholder"
      role="img"
      aria-label="${asset.alt} Ảnh chưa được cung cấp."
      data-photo-path="/public/${asset.path}"
      data-photo-state="placeholder"
    >
      <figcaption>
        <span>${asset.placeholderLabel}</span>
        <code>/public/${asset.path}</code>
      </figcaption>
    </figure>
  `
}

const photoGroupClasses = (hasSecondaryPhoto: boolean): string =>
  `scene__media photo-group photo-group--${hasSecondaryPhoto ? 'multiple' : 'single'}`

const renderDocketMatter = (matter: DocketMatter, index: number): string => `
  <li class="docket__item ${index === 3 ? 'docket__item--prince' : ''}" style="--item-index: ${index};">
    <span class="docket__index">0${index + 1}</span>
    <div class="docket__content">
      <div class="docket__title-row">
        <h3>${matter.title}</h3>
        <span class="docket__leader" aria-hidden="true"></span>
      </div>
      ${matter.detail ? `<p class="docket__detail">${matter.detail}</p>` : ''}
    </div>
    <div class="docket__status-col">
      <p class="status">${matter.status}</p>
    </div>
  </li>
`

export const renderSite = (): string => {
  const { cover, opening, exhibits, pending, judgment, appeal } = siteContent

  return `
    <section
      class="scene case-cover"
      id="case-cover"
      aria-labelledby="case-title"
      aria-hidden="false"
      data-scene
      data-scene-state="active"
    >
      <div class="scene__inner case-cover__inner dossier-folder">
        <div class="dossier-spine" aria-hidden="true"></div>
        <div class="dossier-tab" aria-hidden="true">
          <span class="dossier-tab__mark">§</span>
          <span class="dossier-tab__title">HỒ SƠ TỐI MẬT • 2026-DUNG22</span>
        </div>
        <p class="eyebrow">${cover.institution}</p>
        <div class="cover-meta-row">
          <p class="case-number">${cover.caseNumber}</p>
          <span class="cover-classification" aria-hidden="true">CHỈ LƯU HÀNH NỘI BỘ</span>
        </div>
        <h1 id="case-title" tabindex="-1" data-scene-heading>${cover.title}</h1>
        <p class="lede">${cover.subtitle}</p>
        <p class="metadata">${cover.filed}</p>
        <div class="unseal-ribbon" id="security-seal" aria-hidden="true">
          <div class="unseal-ribbon__slice unseal-ribbon__slice--attached">
            <span class="unseal-ribbon__text">NIÊM PHONG BỞI BAN TỔ CHỨC • CHỈ MỞ KHI ĐỦ 22 TUỔI</span>
          </div>
          <svg
            class="unseal-ribbon__tear-front"
            viewBox="0 0 12 32"
            preserveAspectRatio="none"
            focusable="false"
            aria-hidden="true"
          >
            <path
              class="unseal-ribbon__tear-front-path unseal-ribbon__tear-front-path--fiber"
              d="M7 0 L3 4 L8 8 L2 12 L9 17 L4 21 L10 25 L3 29 L5 32"
            />
            <path
              class="unseal-ribbon__tear-front-path unseal-ribbon__tear-front-path--edge"
              d="M7 0 L3 4 L8 8 L2 12 L9 17 L4 21 L10 25 L3 29 L5 32"
            />
          </svg>
          <div class="unseal-ribbon__slice unseal-ribbon__slice--peeled">
            <span class="unseal-ribbon__text">NIÊM PHONG BỞI BAN TỔ CHỨC • CHỈ MỞ KHI ĐỦ 22 TUỔI</span>
          </div>
        </div>
        <div class="scene__actions">
          <button
            class="button unseal-button"
            id="open-case"
            type="button"
            aria-controls="opening-statement"
            data-scene-next
          >
            ${cover.cta}
          </button>
        </div>
        <p class="fine-print">${cover.confidentiality}</p>
      </div>
    </section>

    <div class="case-controls" id="case-controls" hidden>
      <p class="scene-progress" id="scene-progress" aria-live="polite">01 / 08</p>
      <button
        class="audio-control"
        id="audio-control"
        type="button"
        aria-pressed="true"
        aria-describedby="audio-status"
      >
        Nhạc chưa có
      </button>
      <span class="sr-only" id="audio-status" aria-live="polite">Nhạc nền hiện chưa có.</span>
    </div>

    <main id="case-file" aria-label="Nội dung hồ sơ">
      <section
        class="scene opening"
        id="opening-statement"
        aria-labelledby="opening-title"
        aria-hidden="true"
        data-scene
        data-scene-state="inactive"
        hidden
      >
        <div class="scene__inner">
          <div class="scene__layout">
            <div class="scene__copy">
              <p class="eyebrow">BẮT ĐẦU ĐIỀU TRẦN</p>
              <h2 id="opening-title" tabindex="-1" data-scene-heading>${opening.label}</h2>
              <p class="statement">${opening.statement}</p>
              <p>${opening.direction}</p>
            </div>
            <div class="scene__media">${renderPhoto(photoAssets.portrait)}</div>
          </div>
          <div class="scene__actions">
            <button class="button" type="button" aria-controls="exhibit-childhood" data-scene-next>
              ${opening.cta}
            </button>
          </div>
        </div>
      </section>

      <section
        class="scene exhibit"
        id="exhibit-childhood"
        aria-labelledby="exhibit-a-title"
        aria-hidden="true"
        data-scene
        data-scene-state="inactive"
        hidden
      >
        <div class="scene__inner">
          <div class="scene__layout">
            <div class="scene__copy">
              <p class="eyebrow">${exhibits.childhood.label}</p>
              <h2 id="exhibit-a-title" tabindex="-1" data-scene-heading>${exhibits.childhood.title}</h2>
              <p>${exhibits.childhood.copy}</p>
            </div>
            <div class="scene__media">${renderPhoto(photoAssets.childhood)}</div>
          </div>
          <div class="scene__actions">
            <button class="button" type="button" aria-controls="exhibit-high-school" data-scene-next>
              ${exhibits.childhood.cta}
            </button>
          </div>
        </div>
      </section>

      <section
        class="scene exhibit"
        id="exhibit-high-school"
        aria-labelledby="exhibit-b-title"
        aria-hidden="true"
        data-scene
        data-scene-state="inactive"
        hidden
      >
        <div class="scene__inner">
          <div class="scene__copy">
            <p class="eyebrow">${exhibits.highSchool.label}</p>
            <h2 id="exhibit-b-title" tabindex="-1" data-scene-heading>${exhibits.highSchool.title}</h2>
            <p>${exhibits.highSchool.copy}</p>
          </div>
          <div class="${photoGroupClasses(photoAssets.highSchoolMemory.available)}">
            ${renderPhoto(photoAssets.highSchoolGroup)}
            ${renderPhoto(photoAssets.highSchoolMemory, 'photo-slot--secondary')}
          </div>
          <div class="scene__actions">
            <button class="button" type="button" aria-controls="exhibit-graduation" data-scene-next>
              ${exhibits.highSchool.cta}
            </button>
          </div>
        </div>
      </section>

      <section
        class="scene exhibit exhibit--graduation"
        id="exhibit-graduation"
        aria-labelledby="exhibit-c-title"
        aria-hidden="true"
        data-scene
        data-scene-state="inactive"
        hidden
      >
        <div class="scene__inner">
          <div class="scene__layout">
            <div class="scene__copy">
              <p class="eyebrow">${exhibits.graduation.label}</p>
              <h2 id="exhibit-c-title" tabindex="-1" data-scene-heading>${exhibits.graduation.title}</h2>
              <p class="case-closed">${exhibits.graduation.headline}</p>
              <p class="subheading">${exhibits.graduation.subheading}</p>
              <p>${exhibits.graduation.copy}</p>
              <p class="status">${exhibits.graduation.status}</p>
            </div>
            <div class="${photoGroupClasses(photoAssets.graduationSecondary.available)}">
              ${renderPhoto(photoAssets.graduation)}
              ${renderPhoto(photoAssets.graduationSecondary, 'photo-slot--secondary')}
            </div>
          </div>
          <div class="scene__actions">
            <button class="button" type="button" aria-controls="pending-proceedings" data-scene-next>
              ${exhibits.graduation.cta}
            </button>
          </div>
        </div>
      </section>

      <section
        class="scene pending"
        id="pending-proceedings"
        aria-labelledby="pending-title"
        aria-hidden="true"
        data-scene
        data-scene-state="inactive"
        hidden
      >
        <div class="scene__inner docket-sheet">
          <div class="docket-header">
            <div class="docket-header__titles">
              <p class="eyebrow">TIẾN TRÌNH THỦ TỤC</p>
              <h2 id="pending-title" tabindex="-1" data-scene-heading>${pending.label}</h2>
            </div>
            <div class="docket-header__code" aria-hidden="true">
              <span class="docket-code">DOCKET 2026-CV</span>
              <span class="docket-sub">DANH MỤC CHƯA KHÉP LẠI</span>
            </div>
          </div>
          <div class="docket-table__head" aria-hidden="true">
            <span class="col-idx">STT</span>
            <span class="col-name">MỤC HỒ SƠ & GHI CHÚ</span>
            <span class="col-status">TRẠNG THÁI</span>
          </div>
          <ol class="docket">
            ${pending.matters.map((matter, index) => renderDocketMatter(matter, index)).join('')}
          </ol>
          <div class="scene__actions">
            <button class="button" type="button" aria-controls="final-judgment" data-scene-next>
              ${pending.cta}
            </button>
          </div>
        </div>
      </section>

      <section
        class="scene judgment"
        id="final-judgment"
        aria-labelledby="judgment-title"
        aria-hidden="true"
        data-scene
        data-scene-state="inactive"
        hidden
      >
        <div class="scene__inner judgment__inner verdict-certificate">
          <div class="judgment__stamp" aria-hidden="true">
            <span class="stamp__label">HỘI ĐỒNG PHÊ CHUẨN</span>
            <span class="stamp__meta">TUỔI 22 • CHÍNH THỨC</span>
          </div>
          <p class="eyebrow">QUYẾT ĐỊNH CỦA HỘI ĐỒNG</p>
          <h2 id="judgment-title" tabindex="-1" data-scene-heading>${judgment.label}</h2>
          <p class="statement">${judgment.copy}</p>
          <p class="celebration">${judgment.celebration}</p>
          <footer class="signature">
            <p>${judgment.signature}</p>
            <p>${judgment.signatureTitle}</p>
          </footer>
          <div class="scene__actions">
            <button class="button" type="button" aria-controls="notice-of-appeal" data-scene-next>
              ${judgment.cta}
            </button>
          </div>
        </div>
      </section>

      <section
        class="scene appeal"
        id="notice-of-appeal"
        aria-labelledby="appeal-title"
        aria-hidden="true"
        data-scene
        data-scene-state="inactive"
        hidden
      >
        <div class="scene__inner appeal__inner appeal-slip">
          <div class="appeal-slip__clip" aria-hidden="true"></div>
          <div class="appeal-slip__tag" aria-hidden="true">
            <span>PHỤ LỤC THỦ TỤC • BỔ SUNG VÀO HỒ SƠ</span>
          </div>
          <p class="eyebrow">THỦ TỤC BỔ SUNG</p>
          <h2 id="appeal-title" tabindex="-1" data-scene-heading>${appeal.label}</h2>
          <p>${appeal.copy}</p>
          <div class="scene__actions">
            <button class="button" id="appeal-button" type="button">${appeal.cta}</button>
          </div>
          <p class="sr-only" id="celebration-status" aria-live="polite"></p>
        </div>
      </section>
    </main>

    <div class="confetti" id="confetti" aria-hidden="true"></div>
  `
}
