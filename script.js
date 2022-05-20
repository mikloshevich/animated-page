const pageWrapper = document.querySelector('.page-wrapper')
const bgImageAll = pageWrapper.querySelectorAll('.bg-img')
const rightBgAll = pageWrapper.querySelectorAll('.right-bg')
const textAll = pageWrapper.querySelectorAll('.info')
const leftBgAll = pageWrapper.querySelectorAll('.left-bg')
const linksAll = pageWrapper.querySelectorAll('.nav-item')
const rightImgAll = pageWrapper.querySelectorAll('.right-img')
const rightBg = pageWrapper.querySelector('.right-bg')
const rightImgWrapper = pageWrapper.querySelector('.right-img-wrapper')
const logo = pageWrapper.querySelector('.logo')
const navLinksWrapper = pageWrapper.querySelector('.nav-links')

let nextSlide = true
let counter = 0
let isSwiping = false
const delay = 1500

function firstScreen() {
    const welcomeScreen = document.querySelector('.welcome')
    const welcomeText = welcomeScreen.querySelector('.welcome-text')
    gsap.set(textAll[0], { y: '-50%', opacity: 1 })
    gsap.set(rightImgWrapper, { y: '20%', x: '-50%' })

    const tl = gsap.timeline()
    tl.to(welcomeText, {
        duration: 3.5,
        scale: 1, ease: "power3.out", onComplete: function() {
            pageWrapper.style.display = 'block'
        }
    }).to(welcomeText, { duration: 1, opacity: 0 }, 'same')
        .to(welcomeScreen, { duration: 1, opacity: 0 }, 'same+=0.8')
        .to(pageWrapper, { duration: 3, opacity: 1 }, 'same+=0.8')
        .from(rightImgWrapper, { duration: 1, opacity: 0, x: '100%' }, 'same+=1')
        .from(textAll[0], { duration: 1, opacity: 0, x: '-100%' }, 'same+=1.5')
        .from(navLinksWrapper, { duration: 1, opacity: 0, x: '-100%' }, 'same+=2')
        .from(logo, { duration: 1, opacity: 0, scale: 0 }, 'same+=2.5')
    setTimeout(() => {
        welcomeScreen.style.display = 'none'
        init()
    }, 4600)
}

firstScreen()

function handleLinks() {
    linksAll.forEach((link, i) => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            if (nextSlide && !link.classList.contains('active')) {
                nextSlide = false
                changeImage(i)
                changeText(i)
                changeBgImg(i)
                changeLeftBg(i)
                changeRightBg(i)
                autoBgMove(i)
                counter = i

                linksAll.forEach(link => link.classList.remove('active'))
                link.classList.add('active')

                setTimeout(() => {
                    nextSlide = true
                }, delay)
            }
        })
    })
}

handleLinks()

function setBackground() {
    leftBgAll.forEach(bg => {
        bg.style.backgroundColor = bg.getAttribute('data-bg-color')
    })

    bgImageAll.forEach(bg => {
        bg.style.backgroundImage = `url(${bg.getAttribute('data-url')})`
    })
}

setBackground()

function autoBgMove(index) {
    const tl = gsap.timeline({
        yoyo: true,
        repeat: -1,
        defaults: {
            duration: 10,
            ease: "none"
        },
    })
    tl.to(bgImageAll[index], { x: '10%', scale: 1.1 })
        .to(bgImageAll[index], { y: '10%', scale: 1.2 })
}

function parallax(e) {
    const xOffset = e.clientX * 0.02
    const yOffset = e.clientY * 0.02
    bgImageAll.forEach(img => {
        img.style.transform = `translate(${xOffset}px, ${yOffset}px)`
    })
}

// document.addEventListener('mousemove', parallax)

function changeImage(index) {
    let currentImg = document.querySelector('.right-img.active')
    let nextImg = rightImgAll[index]
    rightImgAll.forEach(el => el.classList.remove('right-img-top'))
    currentImg.classList.add('right-img-top')

    const tl = gsap.timeline({
        defaults: {}, onComplete: function() { currentImg.classList.remove('right-img-top') }
    })
    tl.from(nextImg, 0.5, { y: '-100%' }, 0.5)

    currentImg.classList.remove('active')
    nextImg.classList.add('active')

    linksAll.forEach(link => link.classList.remove('active'))
    linksAll[index].classList.add('active')
}

function changeText(index) {
    let currentText = document.querySelector('.info.active')
    let nextText = textAll[index]
    const tl = gsap.timeline()
    tl.to(currentText, 0.5, {
        y: '50%', opacity: 0
    })
        .to(nextText, 0.5, { y: '-50%', opacity: 1 }, 1)
    nextText.classList.add('active')
    currentText.classList.remove('active')
}

function changeBgImg(index) {
    let currentBg = document.querySelector('.bg-img.active')
    let nextBg = bgImageAll[index]
    currentBg.classList.remove('active')
    nextBg.classList.add('active')
}

function changeLeftBg(index) {
    let currentBgLeft = document.querySelector('.left-bg.active')
    let nextBgLeft = leftBgAll[index]
    leftBgAll.forEach(el => el.classList.remove('right-bg-top'))
    currentBgLeft.classList.add('right-bg-top')

    const tl = gsap.timeline()
    tl.from(nextBgLeft, 0.5, { x: '-100%' }, 0.25)

    currentBgLeft.classList.remove('active')
    nextBgLeft.classList.add('active')
}

function changeRightBg(index) {
    const colors = ['#b9c6d1', '#a7ddce', '#efeaaf']
    rightBg.style.backgroundColor = colors[index]
}

function init() {
    autoBgMove(0)
    document.addEventListener('wheel', (e) => {
        if (e.deltaY > 0 && counter < rightImgAll.length - 1) {
            if (nextSlide) {
                nextSlide = false
                counter++
                changeImage(counter)
                changeText(counter)
                changeBgImg(counter)
                changeLeftBg(counter)
                changeRightBg(counter)
                autoBgMove(counter)
                setTimeout(() => {
                    nextSlide = true
                }, delay)
            }
        } else if (e.deltaY < 0 && counter > 0) {
            if (nextSlide) {
                nextSlide = false
                counter--
                changeImage(counter)
                changeText(counter)
                changeBgImg(counter)
                changeLeftBg(counter)
                changeRightBg(counter)
                autoBgMove(counter)
                setTimeout(() => {
                    nextSlide = true
                }, delay)
            }
        }
    })

    handleSwipe()
}

let touchX
let touchEndX

function handleSwipe() {
    document.addEventListener('touchstart', (e) => {
        // e.preventDefault()
        touchX = e.changedTouches[0].clientX
    })
    document.addEventListener('touchend', (e) => {
        // e.preventDefault()
        touchEndX = e.changedTouches[0].clientX
        if (swipeDirection() === 'left' && counter < rightImgAll.length - 1) {
            if (nextSlide) {
                nextSlide = false
                counter++
                changeImage(counter)
                changeText(counter)
                changeBgImg(counter)
                changeLeftBg(counter)
                changeRightBg(counter)
                autoBgMove(counter)
                setTimeout(() => {
                    nextSlide = true
                }, delay)
            }
        } else if (swipeDirection() === 'right' && counter > 0) {
            if (nextSlide) {
                nextSlide = false
                counter--
                changeImage(counter)
                changeText(counter)
                changeBgImg(counter)
                changeLeftBg(counter)
                changeRightBg(counter)
                autoBgMove(counter)
                setTimeout(() => {
                    nextSlide = true
                }, delay)
            }
        }
    })
}

function swipeDirection() {
    if (touchX < touchEndX - 6) {
        return 'right'
    }
    if (touchX > touchEndX + 6) {
        return 'left'
    }
}

function isTouch() {
    return ('ontouchstart' in window)
}