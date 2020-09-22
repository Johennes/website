handleScollIndicatorUpdates()

function handleScollIndicatorUpdates() {
  let topStickyContainer = document.querySelector('.scrollable-sticky.top')
  if (!topStickyContainer) {
    console.error('Could not find top sticky container')
    return
  }

  let bottomStickyContainer = document.querySelector('.scrollable-sticky.bottom')
  if (!bottomStickyContainer) {
    console.error('Could not find bottom sticky container')
    return
  }

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

  const scrollUpObserver = new IntersectionObserver(([e]) => updateVisibility(e, topStickyContainer), {
    rootMargin: '-1px 0px 0px 0px',
    threshold: [1]
  })

  const scrollDownObserver = new IntersectionObserver( ([e]) => updateVisibility(e, bottomStickyContainer), {
    rootMargin: '0px 0px -1px 0px',
    threshold: [1]
  })

  containers.forEach(container => {
    container.classList.add('sticky')
  })

  scrollUpObserver.observe(scrollUpIndicator)
  scrollDownObserver.observe(scrollDownIndicator)

  function updateVisibility(event, container) {
    if (event.intersectionRatio < 1) {
      container.classList.add('is-sticky')
    } else {
      container.classList.remove('is-sticky')
    }
  }
}
