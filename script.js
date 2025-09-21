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
// 인트로 페이지 이미지 컨테이너를 캐싱합니다.
const introImageContainerElement = document.getElementById('introImageContainer');
let typingInterval;

// 타자기 소리 파일 경로
const typewriterSound = "./typewriter-1.mp3";
let sound;

// 게임 시작을 위한 초기화 함수
// 사용자의 첫 상호작용 후 호출되어 소리 재생 권한을 얻고 게임을 시작합니다.
function initGame() {
    // 오디오 객체 생성
    sound = new Audio(typewriterSound);

    // 시작 화면을 숨기고 게임 화면을 표시합니다.
    startScreenElement.style.display = 'none';
    gameContentElement.style.display = 'flex';

    // 첫 페이지를 보여줍니다.
    showPage('start');
}

// 타자기 효과를 구현하는 함수
// 글자를 한 글자씩 표시하고, 완료되면 콜백 함수를 실행합니다.
function typewriterEffect(text, onComplete) {
    let i = 0;
    storyTextElement.innerHTML = '';
    clearInterval(typingInterval);

    // 소리 재생 설정
    if (sound) {
        sound.pause();
        sound.currentTime = 0; // 소리를 처음으로 되감기
        sound.volume = 0.5;
        sound.play().catch(e => console.error("Sound playback failed:", e));
    }

    typingInterval = setInterval(() => {
        if (i < text.length) {
            // 글자를 하나씩 추가
            storyTextElement.innerHTML += text.charAt(i);
            i++;
        } else {
            // 모든 글자가 표시되면 타이머를 정지하고 커서 추가
            clearInterval(typingInterval);
            if (sound) {
                sound.pause();
            }
            // 텍스트 표시가 완료된 후 커서 추가
            storyTextElement.innerHTML += '<span class="typing-cursor">|</span>';
            // 텍스트 표시가 완료된 후 실행할 함수 호출
            onComplete();
        }
    }, 50); // 타이핑 속도 (밀리초)
}

// 특정 페이지의 내용을 표시하는 함수
// HTML 템플릿에서 데이터를 가져와 화면을 업데이트합니다.
function showPage(pageId) {
    const template = document.getElementById(pageId);
    if (!template) {
        console.error(`Error: Template with ID '${pageId}' not found.`);
        return;
    }

    // 템플릿 콘텐츠 복제 및 데이터 추출
    const pageDataElement = template.content.cloneNode(true).querySelector('.page-data');
    const textContent = pageDataElement.querySelector('p').textContent;
    const imageUrl = pageDataElement.dataset.image;

    // 이전 선택지 제거
    optionsContainerElement.innerHTML = '';

    // 이미지 업데이트
    imageContainerElement.style.backgroundImage = `url('${imageUrl}')`;

    // 텍스트에 타자기 효과 적용
    typewriterEffect(textContent, () => {
        // 텍스트 표시가 완료되면 선택지 버튼을 생성하고 표시합니다.
        const options = pageDataElement.querySelectorAll('.options button');
        if (options.length > 0) {
            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option.textContent;
                button.className = 'option-button';
                const nextId = option.dataset.next;
                // 버튼 클릭 시 다음 페이지를 보여주도록 이벤트 리스너 추가
                button.onclick = () => showPage(nextId);
                optionsContainerElement.appendChild(button);
            });
        }
    });
}

// 페이지 로드 시 "게임 시작하기" 버튼에 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', () => {
    // 인트로 페이지 이미지 설정
    if (introImageContainerElement) {
        const introImageUrl = introImageContainerElement.dataset.image;
        introImageContainerElement.style.backgroundImage = `url('${introImageUrl}')`;
    }

    // 시작 버튼 클릭 이벤트 설정
    document.getElementById('startButton').onclick = initGame;
});