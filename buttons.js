document.getElementById('play-btn').onclick = startGame;
    document.getElementById('main-menu-btn').onclick = function() {
      document.getElementById('game-over').classList.add('hidden');
      document.getElementById('start-screen').classList.remove('hidden');
    };
    document.getElementById('credits-btn').onclick = function() {
      document.getElementById('credits-modal').classList.remove('hidden');
    };
    document.getElementById('close-credits-btn').onclick = function() {
      document.getElementById('credits-modal').classList.add('hidden');
    };
    document.getElementById('exit-btn').onclick = function() {
      if (confirm('Are you sure you want to exit the game?')) {
        window.close();
      }
    };
    document.getElementById('volume-slider').oninput = function(e) {
      setVolume(parseFloat(e.target.value));
    };
    let isMuted = false;
    document.getElementById('mute-btn').onclick = function() {
      isMuted = !isMuted;
      if (isMuted) {
        setVolume(0);
        this.innerText = 'Unmute';
      } else {
        setVolume(parseFloat(document.getElementById('volume-slider').value));
        this.innerText = 'Mute';
      }
    };
    