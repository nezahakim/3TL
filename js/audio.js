class AudioManager {
    constructor() {
        this.sounds = {
            shoot: new Audio('assets/audio/shot.mp3'),
            reload: new Audio('assets/audio/reload.mp3'),
            hit: new Audio('assets/audio/hit.mp3'),
            pickup: new Audio('assets/audio/pickup.mp3'),
            enemyDeath: new Audio('assets/audio/enemy-death.mp3'),
            playerDamage: new Audio('assets/audio/player-damage.mp3'),
            levelUp: new Audio('assets/audio/level-up.mp3'),
            background: new Audio('assets/audio/background.mp3')
        };
        
        this.sounds.background.loop = true;
    }
    
    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }
}
