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

  containers.forEach(container => {
    container.classList.add('sticky')
  })

  let scrollUpIndicatorVisible = false
  let scrollDownIndicatorVisible = false

  updateScrollIndicatorVisibility()
  window.addEventListener('scroll', updateScrollIndicatorVisibility)
  window.addEventListener('resize', updateScrollIndicatorVisibility)

  function updateScrollIndicatorVisibility() {
    let scrollPercentage = computeScrollPercentage()

    if (scrollPercentage < 100) {
      if (!scrollDownIndicatorVisible) {
        scrollDownIndicator.classList.remove('hidden')
        scrollDownIndicatorVisible = true
      }
    } else if (scrollDownIndicatorVisible) {
      scrollDownIndicator.classList.add('hidden')
      scrollDownIndicatorVisible = false
    }

    if (scrollPercentage > 0) {
      if (!scrollUpIndicatorVisible) {
        scrollUpIndicator.classList.remove('hidden')
        scrollUpIndicatorVisible = true
      }
    } else if (scrollUpIndicatorVisible) {
      scrollUpIndicator.classList.add('hidden')
      scrollUpIndicatorVisible = false
    }
    
    scrollDownIndicator.innerHTML = `v(${scrollPercentage}%)`
    scrollUpIndicator.innerHTML = `^(${100 - scrollPercentage}%)`
  }

  function computeScrollPercentage() {
    let doc = document.documentElement
    let body = document.body
    let scrollTop = doc.scrollTop || body.scrollTop
    let scrollHeight = doc.scrollHeight || body.scrollHeight
    return Math.round(scrollTop / (scrollHeight - doc.clientHeight) * 100)
  }
}
