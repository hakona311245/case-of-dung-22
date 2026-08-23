const CONFETTI_COUNT = 24
const CONFETTI_DURATION_MS = 1600

export const setupConfetti = (
  button: HTMLButtonElement,
  container: HTMLElement,
  status: HTMLElement,
): void => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  button.addEventListener('click', () => {
    container.replaceChildren()
    status.textContent = 'Hẹn gặp ở tuổi 23.'

    if (reducedMotion.matches) {
      return
    }

    const fragment = document.createDocumentFragment()

    for (let index = 0; index < CONFETTI_COUNT; index += 1) {
      const piece = document.createElement('span')
      piece.className = 'confetti__piece'
      piece.style.setProperty('--confetti-x', `${Math.round(Math.random() * 180 - 90)}px`)
      piece.style.setProperty('--confetti-rotate', `${Math.round(Math.random() * 540 - 270)}deg`)
      piece.style.setProperty('--confetti-delay', `${Math.round(Math.random() * 180)}ms`)
      fragment.append(piece)
    }

    container.append(fragment)

    window.setTimeout(() => {
      container.replaceChildren()
    }, CONFETTI_DURATION_MS)
  })
}
