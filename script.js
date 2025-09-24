// JavaScript 파일 구성:
// 1. 전역 변수 및 DOM 요소 캐싱
// 2. 게임 시작 및 페이지 초기화 함수 (initGame)
// 3. 타자기 효과 함수 (typewriterEffect)
// 4. 페이지 전환 및 콘텐츠 표시 함수 (showPage)
// 5. 이벤트 리스너 설정

// 전역 변수 및 DOM 요소 캐싱
const storyTextElement = document.getElementById('storyText');
const optionsContainerElement = document.getElementById('optionsContainer');
const imageContainerElement = document.getElementById('imageContainer');
const startScreenElement = document.getElementById('start-screen');
const gameContentElement = document.getElementById('game-content');
const introImageContainerElement = document.getElementById('introImageContainer');
const gameImageElement = document.getElementById('gameImage');
const heartContainerElement = document.getElementById('heart-container');
let typingInterval;
let hearts = 3;

// 오디오 요소 캐싱
const typewriterSound = new Audio("mp3/typewriter.mp3"); // New Audio() is already here
const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');

// 하트 업데이트 및 이미지 투명도 조절 함수
function updateHearts() {
    const heartSvgs = heartContainerElement.querySelectorAll('.heart-svg');
    heartSvgs.forEach((heart, index) => {
        if (index < hearts) {
            heart.classList.remove('empty');
        } else {
            heart.classList.add('empty');
        }
    });

    gameImageElement.classList.remove('image-filter-low', 'image-filter-medium', 'image-filter-high');
    if (hearts === 3) {
        gameImageElement.classList.add('image-filter-low');
    } else if (hearts === 2) {
        gameImageElement.classList.add('image-filter-medium');
    } else if (hearts === 1) {
        gameImageElement.classList.add('image-filter-high');
    }
}



// 게임 오버 함수
function gameOver() {
    gameContentElement.style.display = 'none';
    startScreenElement.style.display = 'flex';
    document.getElementById('startButton').textContent = '다시 시작하기';
    document.querySelector('#start-screen h1').textContent = '게임 오버';
    document.querySelector('#start-screen p').textContent = '모든 하트를 잃었습니다. 다시 도전하세요!';
    hearts = 3;
    updateHearts();
}

// 게임 시작을 위한 초기화 함수
function initGame() {
    // Corrected: sound = new Audio(typewriterSound);
    startScreenElement.style.display = 'none';
    gameContentElement.style.display = 'flex';
    updateHearts();
    showPage('start');
}

// 타자기 효과를 구현하는 함수
function typewriterEffect(text, onComplete) {
    let i = 0;
    storyTextElement.innerHTML = '';
    clearInterval(typingInterval);

    // Corrected: use typewriterSound directly
    if (typewriterSound) {
        typewriterSound.pause();
        typewriterSound.currentTime = 0;
        typewriterSound.volume = 0.5;
        typewriterSound.play().catch(e => console.error("Sound playback failed:", e));
    }

    typingInterval = setInterval(() => {
        if (i < text.length) {
            storyTextElement.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            if (typewriterSound) {
                typewriterSound.pause();
            }
            storyTextElement.innerHTML += '<span class="typing-cursor">|</span>';
            onComplete();
        }
    }, 50);
}

// 특정 페이지의 내용을 표시하는 함수
function showPage(pageId) {
    const template = document.getElementById(pageId);
    if (!template) {
        console.error(`Error: Template with ID '${pageId}' not found.`);
        return;
    }

    if (pageId === 'start') {
        hearts = 3;
        updateHearts();
    }

    const pageDataElement = template.content.cloneNode(true).querySelector('.page-data');
    const textContent = pageDataElement.querySelector('p').textContent;
    const imageUrl = pageDataElement.dataset.image;

    optionsContainerElement.innerHTML = '';
    gameImageElement.src = imageUrl;

    typewriterEffect(textContent, () => {
        const options = pageDataElement.querySelectorAll('.options button');
        optionsContainerElement.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.textContent;
            button.className = 'option-button';
            const nextId = option.dataset.next;
            const hasCorrectAttribute = option.hasAttribute('data-correct');
            const isCorrect = option.dataset.correct === 'true';

            button.onclick = () => {
                if (hasCorrectAttribute) {
                    if (isCorrect) {
                        // 정답일 때
                        correctSound.currentTime = 0;
                        correctSound.play().catch(e => console.error("Sound playback failed:", e));
                        showPage(nextId);
                    } else {
                        // 오답일 때
                        incorrectSound.currentTime = 0;
                        incorrectSound.play().catch(e => console.error("Sound playback failed:", e));
                        hearts--;
                        updateHearts();
                        if (hearts <= 0) {
                            gameOver();
                        } else {
                            showPage(nextId);
                        }
                    }
                } else {
                    showPage(nextId);
                }
            };
            optionsContainerElement.appendChild(button);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').onclick = initGame;
    updateHearts();
});