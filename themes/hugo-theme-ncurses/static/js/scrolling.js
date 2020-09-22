document.addEventListener("DOMContentLoaded", (event) => {
  handleScollIndicatorUpdates()
})

function handleScollIndicatorUpdates() {
  let containers = document.querySelectorAll('.scrollable-sticky')
  if (!containers || containers.length !== 2) {
    console.error('Could not find scroll indicator containers')
    return
  }

  let scrollUpIndicator = document.querySelector('.scroll-indicator.up')
  if (!scrollUpIndicator) {
    console.error('Could not find scroll-up indicator')
    return
  }

  let scrollDownIndicator = document.querySelector('.scroll-indicator.down')
  if (!scrollDownIndicator) {
    console.error('Could not find scroll-down indicator')
    return
  }

  const scrollUpObserver = new IntersectionObserver(([e]) => updateVisibility(e), {
    rootMargin: '-1px 0px 0px 0px',
    threshold: [1]
  })

  const scrollDownObserver = new IntersectionObserver( ([e]) => updateVisibility(e), {
    rootMargin: '0px 0px -1px 0px',
    threshold: [1]
  })

  containers.forEach(container => {
    container.classList.add('sticky')
  })

  scrollUpObserver.observe(scrollUpIndicator)
  scrollDownObserver.observe(scrollDownIndicator)

  function updateVisibility(event) {
    if (event.intersectionRatio < 1) {
      event.target.classList.remove('hidden')
    } else {
      event.target.classList.add('hidden')
    }
  }
}
