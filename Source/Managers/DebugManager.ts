//
// File: DebugManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class DebugManager
{
    private ctx: IGameContext;

    private container: HTMLDivElement;
    private fpsInfoContainer: HTMLDivElement;
    private particlesInfoContainer: HTMLDivElement;
    private projectilesInfoContainer: HTMLDivElement;
    private indicatorsInfoContainer: HTMLDivElement;
    private messageBoxesInfoContainer: HTMLDivElement;
    private textObjectsInfoContainer: HTMLDivElement;
    private tilesInfoContainer: HTMLDivElement;
    private goldNuggets: HTMLDivElement;
    private monsters: HTMLDivElement;
    private playerPosition: HTMLDivElement;
    private playerSpeed: HTMLDivElement;
    private jumps: HTMLDivElement;
    private jumpBoost: HTMLDivElement;
    private goldValue: HTMLDivElement;
    private scoreValue: HTMLDivElement;
    private attackCooldown: HTMLDivElement;

    private showStats: boolean;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;

        this.showStats = false;

        this.container = document.createElement(`div`);
        this.container.className = `debug`;
        this.container.style.marginLeft = `4px`;
        document.body.appendChild(this.container);

        this.fpsInfoContainer = document.createElement(`div`);
        this.fpsInfoContainer.className = `fps`;
        this.container.appendChild(this.fpsInfoContainer);

        this.particlesInfoContainer = document.createElement(`div`);
        this.particlesInfoContainer.className = `particles`;
        this.container.appendChild(this.particlesInfoContainer);

        this.projectilesInfoContainer = document.createElement(`div`);
        this.projectilesInfoContainer.className = `particles`;
        this.container.appendChild(this.projectilesInfoContainer);

        this.indicatorsInfoContainer = document.createElement(`div`);
        this.indicatorsInfoContainer.className = `indicators`;
        this.container.appendChild(this.indicatorsInfoContainer);

        this.messageBoxesInfoContainer = document.createElement(`div`);
        this.messageBoxesInfoContainer.className = `msg-boxes`;
        this.container.appendChild(this.messageBoxesInfoContainer);

        this.textObjectsInfoContainer = document.createElement(`div`);
        this.textObjectsInfoContainer.className = `text-objs`;
        this.container.appendChild(this.textObjectsInfoContainer);

        this.tilesInfoContainer = document.createElement(`div`);
        this.tilesInfoContainer.className = `tiles`;
        this.container.appendChild(this.tilesInfoContainer);        

        this.goldNuggets = document.createElement(`div`);
        this.goldNuggets.className = `gold-nuggets`;
        this.container.appendChild(this.goldNuggets); 

        this.monsters = document.createElement(`div`);
        this.monsters.className = `monsters`;
        this.container.appendChild(this.monsters);

        this.playerPosition = document.createElement(`div`);
        this.playerPosition.className = `player-position`;
        this.container.appendChild(this.playerPosition); 

        this.playerSpeed = document.createElement(`div`);
        this.playerSpeed.className = `player-speed`;
        this.container.appendChild(this.playerSpeed); 

        this.jumps = document.createElement(`div`);
        this.jumps.className = `jumps`;
        this.container.appendChild(this.jumps); 

        this.jumpBoost = document.createElement(`div`);
        this.jumpBoost.className = `jump-height`;
        this.container.appendChild(this.jumpBoost); 

        this.goldValue = document.createElement(`div`);
        this.goldValue.className = `gold-value`;
        this.container.appendChild(this.goldValue); 

        this.scoreValue = document.createElement(`div`);
        this.scoreValue.className = `score-value`;
        this.container.appendChild(this.scoreValue); 

        this.attackCooldown = document.createElement(`div`);
        this.attackCooldown.className = `attack-cooldown`;
        this.container.appendChild(this.attackCooldown); 
    
        this.toggleStats(false);
    }

    toggleStats(visible: boolean): void 
    {
        this.showStats = visible;
        this.container.style.display = this.showStats ? `block` : `none`;
    }

    isEnabled(): boolean
    {
        return this.showStats;
    }

    update(time: IGameTime): void
    {
        if (this.ctx.input.wasKeyPressedThisFrame(`\``))
        {
            this.toggleStats(!this.showStats)
        }

        if (!this.toggleStats) return;    

        this.fpsInfoContainer.innerText = `FPS: ${(1 / time.deltaTime).toFixed(2)}`;
        this.particlesInfoContainer.innerText = `Particles: ${this.ctx.particles.getCount()} / ${ParticleManager.MAX_PARTICLES}`;
        this.projectilesInfoContainer.innerText = `Projectiles: ${this.ctx.projectiles.getCount()} / ${ProjectileManager.MAX_PROJECTILES}`;
        this.indicatorsInfoContainer.innerText = `Indicators: ${this.ctx.indicators.getCount()}`;
        this.messageBoxesInfoContainer.innerText = `Message Boxes: ${this.ctx.messageBoxes.getCount()}`;
        this.textObjectsInfoContainer.innerText = `Floating Texts: ${this.ctx.floatingTexts.getCount()}`;
        this.tilesInfoContainer.innerText = `Tiles Drawn: ${this.ctx.tiles.getCount()}`;
        this.goldNuggets.innerText = `Gold Drawn: ${this.ctx.gold.getCount()}`;
        this.monsters.innerText = `Monsters: ${this.ctx.monsters.getCount()}`;
        this.playerPosition.innerText = `Position: { X: ${Math.floor(this.ctx.player.x)}, Y: ${Math.floor(this.ctx.player.y)} }`; 
        this.playerSpeed.innerText = `Movement Speed: { X: ${Math.floor(this.ctx.player.speedX)}, Y: ${Math.floor(this.ctx.player.speedY)} }`;
        this.jumps.innerText = `Jumps: ${this.ctx.player.jumps} / ${this.ctx.player.maxJumps}`;
        this.jumpBoost.innerText = `Jump Boost: ${Math.floor(this.ctx.player.jumpBoost)} / ${this.ctx.player.maxJumpBoost}`;
        this.goldValue.innerText = `Gold Value: ${Math.floor(this.ctx.player.gold)}`;
        this.scoreValue.innerText = `Score Value: ${Math.floor(this.ctx.player.score)}`;
        this.attackCooldown.innerText = `Attack Cooldown: ${this.ctx.player.attackCooldown.toFixed(2)} / ${this.ctx.player.maxAttackCooldown.toFixed(2)}`; 
    }
}

import { IGameContext } from "../Data/IGameContext";
import { IGameTime } from "../Data/IGameTime";
import { ParticleManager } from "./ParticleManager";import { ProjectileManager } from "./ProjectileManager";

