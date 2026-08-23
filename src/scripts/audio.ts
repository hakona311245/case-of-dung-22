import { publicAssetUrl } from '../utils/publicAssetUrl.ts'

export type AudioOptions = {
  path: string
  available: boolean
  volume: number
}

type AudioController = {
  start: () => Promise<void>
}

export const setupAudio = (
  button: HTMLButtonElement,
  status: HTMLElement,
  options: AudioOptions,
): AudioController => {
  let audio: HTMLAudioElement | null = null
  let muted = true

  const updateControl = (message?: string): void => {
    if (!options.available) {
      button.textContent = 'Nhạc chưa có'
      button.setAttribute('aria-label', 'Nhạc nền chưa có')
      button.setAttribute('aria-pressed', 'true')
      button.disabled = true
      status.textContent = message ?? 'Nhạc nền hiện chưa có.'
      return
    }

    button.disabled = false
    button.textContent = muted ? 'Nhạc: tắt' : 'Nhạc: bật'
    button.setAttribute(
      'aria-label',
      muted ? 'Bật nhạc nền' : 'Tắt nhạc nền',
    )
    button.setAttribute('aria-pressed', String(muted))
    status.textContent = message ?? (muted ? 'Nhạc nền đang tắt.' : 'Nhạc nền đang phát.')
  }

  const ensureAudio = (): HTMLAudioElement | null => {
    if (!options.available) {
      return null
    }

    if (audio) {
      return audio
    }

    audio = new Audio(publicAssetUrl(options.path))
    audio.loop = true
    audio.preload = 'none'
    audio.volume = options.volume
    audio.addEventListener('error', () => {
      options.available = false
      muted = true
      audio = null
      updateControl('Không thể tải nhạc nền. Hồ sơ vẫn có thể xem bình thường.')
    })

    return audio
  }

  const play = async (): Promise<void> => {
    const player = ensureAudio()

    if (!player) {
      updateControl()
      return
    }

    try {
      await player.play()
      muted = false
      updateControl()
    } catch {
      muted = true
      updateControl('Nhạc nền đã sẵn sàng. Hãy dùng nút điều khiển để bắt đầu phát.')
    }
  }

  button.addEventListener('click', () => {
    const player = ensureAudio()

    if (!player) {
      updateControl()
      return
    }

    if (muted || player.paused) {
      void play()
      return
    }

    player.pause()
    muted = true
    updateControl()
  })

  updateControl()

  return {
    start: play,
  }
}
