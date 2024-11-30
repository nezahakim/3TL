class Weapon {
    constructor(type) {
        this.config = GAME_CONSTANTS.WEAPONS[type];
        this.currentAmmo = this.config.ammoCapacity;
        this.totalAmmo = this.config.ammoCapacity * 3;
        this.isReloading = false;
        this.lastShot = 0;
    }
    
    canShoot() {
        return !this.isReloading && 
               this.currentAmmo > 0 && 
               Date.now() - this.lastShot > this.config.fireRate;
    }
    
    shoot() {
        if (this.canShoot()) {
            this.currentAmmo--;
            this.lastShot = Date.now();
            return true;
        }
        return false;
    }
    
    reload() {
        if (this.totalAmmo > 0 && !this.isReloading) {
            this.isReloading = true;
            setTimeout(() => {
                const neededAmmo = this.config.ammoCapacity - this.currentAmmo;
                const reloadAmount = Math.min(neededAmmo, this.totalAmmo);
                this.currentAmmo += reloadAmount;
                this.totalAmmo -= reloadAmount;
                this.isReloading = false;
            }, this.config.reloadTime);
        }
    }
}
