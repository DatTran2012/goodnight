const stars = document.getElementById('stars');
for (let i = 0; i < 75; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.textContent = Math.random() > .72 ? '✦' : '·';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.fontSize = `${6 + Math.random() * 10}px`;
  star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
  star.style.animationDelay = `${Math.random() * 4}s`;
  stars.appendChild(star);
}

const letterSection = document.getElementById('letterSection');
const typedMessage = document.getElementById('typedMessage');
const openLetter = document.getElementById('openLetter');
const message = `Này người đặc biệt,

Mong rằng những điều chưa vui của hôm nay
sẽ nhẹ nhàng ở lại phía sau cánh cửa.

Em không cần phải mạnh mẽ mọi lúc đâu.
Nếu mệt rồi thì cứ nghỉ ngơi,
nếu buồn thì cứ cho mình một chút thời gian.

Ngoài kia có thể vẫn còn nhiều bộn bề,
nhưng ngay lúc này, hãy để bản thân
được bình yên như bầu trời đầy sao nhé.

Chúc em có một giấc mơ thật đẹp.
Ngày mai thức dậy, mong nụ cười
sẽ lại dịu dàng trên môi em. ♡`;

let typingTimer;
openLetter.addEventListener('click', () => {
  letterSection.classList.add('open');
  openLetter.innerHTML = '<span>Gửi em một chút bình yên</span><span class="button-sparkle">♡</span>';
  typedMessage.textContent = '';
  clearInterval(typingTimer);
  let index = 0;
  typingTimer = setInterval(() => {
    typedMessage.textContent += message[index++];
    if (index >= message.length) clearInterval(typingTimer);
  }, 28);
  setTimeout(() => letterSection.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
});

const envelope = document.getElementById('envelope');
const hugSection = document.getElementById('hugSection');
const closeHug = document.getElementById('closeHug');
const toast = document.getElementById('toast');
envelope.addEventListener('click', () => {
  hugSection.classList.add('open');
  hugSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast('Gửi em một cái ôm thật ấm áp ♡');
  burstHearts();
});
closeHug.addEventListener('click', () => hugSection.classList.remove('open'));

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}
function burstHearts() {
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement('span');
    heart.textContent = Math.random() > .5 ? '♡' : '✦';
    Object.assign(heart.style, {
      position: 'fixed', zIndex: 20, left: `${35 + Math.random() * 30}%`,
      top: `${45 + Math.random() * 20}%`, color: '#f3c5df',
      fontSize: `${14 + Math.random() * 18}px`, pointerEvents: 'none',
      transition: 'all 1.4s ease-out', opacity: '1'
    });
    document.body.appendChild(heart);
    requestAnimationFrame(() => {
      heart.style.transform = `translate(${(Math.random() - .5) * 260}px,${-100 - Math.random() * 180}px) rotate(${Math.random() * 90}deg)`;
      heart.style.opacity = '0';
    });
    setTimeout(() => heart.remove(), 1500);
  }
}

// Original, synthesized lo-fi ambience. No external/copyrighted audio file is needed.
let audioContext = null;
let musicTimer = null;
let masterGain = null;
let musicOn = false;
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
const chordProgression = [
  [261.63, 329.63, 392.00, 493.88],
  [220.00, 261.63, 329.63, 392.00],
  [174.61, 220.00, 261.63, 349.23],
  [196.00, 246.94, 293.66, 392.00]
];
let chordIndex = 0;

function playNote(freq, start, duration, volume, type = 'sine') {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  osc.type = type;
  osc.frequency.value = freq;
  filter.type = 'lowpass';
  filter.frequency.value = 1100;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(filter); filter.connect(gain); gain.connect(masterGain);
  osc.start(start); osc.stop(start + duration + .04);
}
function playChord() {
  if (!audioContext || !musicOn) return;
  const now = audioContext.currentTime;
  const chord = chordProgression[chordIndex % chordProgression.length];
  chord.forEach((freq, i) => playNote(freq, now + i * .035, 2.8, .022, 'triangle'));
  playNote(chord[0] / 2, now, 3.2, .035, 'sine');
  // Soft, muted high notes create a gentle lo-fi sparkle.
  playNote(chord[2] * 2, now + .7, 1.2, .008, 'sine');
  chordIndex++;
}
async function toggleMusic() {
  if (!musicOn) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) { showToast('Trình duyệt này chưa hỗ trợ phát nhạc.'); return; }
    audioContext = audioContext || new AudioCtx();
    if (audioContext.state === 'suspended') await audioContext.resume();
    masterGain = audioContext.createGain();
    masterGain.gain.value = .7;
    masterGain.connect(audioContext.destination);
    musicOn = true;
    playChord();
    musicTimer = setInterval(playChord, 2800);
    musicLabel.textContent = 'Tắt nhạc lofi';
    musicToggle.setAttribute('aria-pressed', 'true');
  } else {
    musicOn = false;
    clearInterval(musicTimer);
    if (masterGain && audioContext) {
      masterGain.gain.setTargetAtTime(0, audioContext.currentTime, .12);
    }
    musicLabel.textContent = 'Bật nhạc lofi';
    musicToggle.setAttribute('aria-pressed', 'false');
  }
}
musicToggle.addEventListener('click', toggleMusic);
