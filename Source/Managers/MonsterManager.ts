//
// File: MonsterManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class MonsterManager
{
    private ctx: IGameContext

    private monsters: Array<IMonsterData>;
    private monsterCreateCount: number;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.monsters = new Array<IMonsterData>();    
        this.monsterCreateCount = 0;
    }

    getCount(): number
    {
        return this.monsters.length;
    }

    getTotalCount(): number
    {
        return this.monsterCreateCount;
    }

    add(data: IMonsterSpawnData): void
    {
        const m = {} as IMonsterData;
        this.monsterCreateCount++;

        // Base variables
        m.type = data.type;
        m.movementBounds = data.movementBounds;
        m.scoreValue = 0;
        m.goldValue = 0;
        m.detectRangeSqr = 800 * 800;

        // Combat variables
        m.isAlive = true;
        m.life = 1;
        m.maxLives = m.life;
        m.projectileSpriteX = 0;
        m.projectileSpriteY = 11;
        m.projectileCount = 0;
        m.projectileArc = 0;
        m.projectileAngularSpeed = 0;
        m.projectileSpeedMultiplier = 1;
        m.attackDamage = 0;
        m.attackCooldown = 0;
        m.maxAttackCooldown = 1;
        m.attackSoundAsset = `slash`;
        m.attackSoundVolume = 0.03;

        // Movement variables
        m.x = data.spawnX;
        m.y = data.spawnY;
        m.width = WorldManager.GRID_SIZE;
        m.height = WorldManager.GRID_SIZE;
        m.hitboxWidth = 64;
        m.hitboxHeight = 64;
        m.offsetX = -8;
        m.offsetY = -8;
        m.speedX = 0;
        m.speedY = 0;
        m.maxSpeedX = 100;
        m.acceleration = 5000;
        m.friction = 50;
        m.isMoving = false;

        // Animation variables
        m.spriteX = 2;
        m.spriteY = 8;
        m.lookDirection = -1;
        m.animationState = `idle`;
        m.animationPreviousState = `idle`;
        m.animationSpeed = 4;
        m.animationFrame = 0;
        m.animationOffset = 0;
        m.maxFrames = 2;
        
        // Overrides based on monster type
        switch (m.type)
        {
            case 0:
            {
                m.scoreValue = 10;
                m.goldValue = Utils.randomInt(15, 25);
                m.spriteX = 1;
                m.spriteY = 8;
                m.life = 3;
                m.attackDamage = 1;
                m.projectileCount = 1;
                m.projectileSpriteX = 0;
                m.projectileArc = Utils.angleToRadians(0);
                m.maxAttackCooldown = 4;
                m.projectileSpeedMultiplier = 0.9;
                m.attackSoundAsset = `slash-b`;
                break;
            }

            case 1:
            {
                m.scoreValue = 25;
                m.goldValue = Utils.randomInt(35, 50);
                m.spriteX = 1;
                m.spriteY = 9;
                m.life = 7;
                m.attackDamage = 1;
                m.projectileCount = 4;
                m.projectileSpriteX = 1;
                m.projectileAngularSpeed = Math.random() < 0.5 ? -1.2 : 1.2
                m.projectileArc = Utils.angleToRadians(360);
                m.maxAttackCooldown = 7;
                m.attackSoundAsset = `slash-b`;
                m.projectileSpeedMultiplier = 1.2;
                m.attackSoundVolume = 0.02;
                break;
            }

            case 2:
            {
                m.scoreValue = 50;
                m.goldValue = Utils.randomInt(50, 60);
                m.spriteX = 1;
                m.spriteY = 10;
                m.life = 15;
                m.attackDamage = 3;
                m.projectileCount = 1;
                m.projectileSpeedMultiplier = 0.9;
                m.projectileSpriteX = 2;
                m.projectileAngularSpeed = Utils.random(-0.2, 0.2);
                m.projectileArc = Utils.angleToRadians(0);
                m.maxAttackCooldown = 2.8;
                m.attackSoundAsset = `magic-cast`;
                break;
            }

            case 3:
            {
                m.scoreValue = 100;
                m.goldValue = Utils.randomInt(80, 100);
                m.spriteX = 8;
                m.spriteY = 10;
                m.life = 33;
                m.attackDamage = 2;
                m.projectileCount = 4;
                m.projectileSpriteX = 3;
                m.projectileArc = Utils.angleToRadians(90);
                m.maxAttackCooldown = 3;
                m.projectileSpeedMultiplier = 0.7;
                m.attackSoundAsset = `magic-cast`;
                break;
            }
        }  
            
        // Randomize attack cooldowns
        m.attackCooldown = Utils.random(0, m.maxAttackCooldown);

        this.monsters.push(m);
    }

    takeDamage(m: IMonsterData, taken: IDamageTakenData): void 
    {
        if (taken.damage == 0) return;

        this.setAnimationState(m, `hit`);
        this.ctx.effects.trigger(`damage`, { impactX: taken.impactX, impactY: taken.impactY, direction: taken.direction, shake: 1 });
        this.ctx.indicators.add({ x: taken.impactX, y: taken.impactY, content: `${taken.damage}`});

        m.life -= taken.damage;
        m.isAlive = (m.life > 0);

        if (!m.isAlive)
        {
            this.ctx.player.addScore(m.scoreValue);
            this.ctx.player.addGold(m.goldValue);
            this.ctx.effects.trigger(`monster-death`, { x: m.x, y: m.y });
        }
    }

    update(time: IGameTime): void
    {
        this.monsters = this.monsters.filter(m => 
        {
            this.updateMovement(m, time);
            this.updateCombat(m, time);
            this.updateAnimation(m, time);
            this.checkPlayerCollision(m, time);

            return !((m.x + m.width < this.ctx.camera.x) || !m.isAlive);
        });
    }

    updateMovement(m: IMonsterData, time: IGameTime): void
    {
        // Deacceleration
        const absSpeedX = Math.abs(m.speedX);
        if (m.isMoving == false || absSpeedX > m.maxSpeedX)
        {
            if (absSpeedX > 1)
            {
                m.speedX *= Math.min(0.9, m.friction * time.deltaTime);
            }

            else
            {
                m.speedX = 0;
            }
        }

        let deltaX = m.speedX * time.deltaTime;

        if (m.x + m.width + deltaX >= m.movementBounds.x + m.movementBounds.width)
        {
            m.x = m.movementBounds.x + m.movementBounds.width - m.width;
            m.speedX = 0;
            deltaX = 0;
        }

        else if (m.x + deltaX < m.movementBounds.x)
        {
            m.x = m.movementBounds.x;
            m.speedX = 0;
            deltaX = 0;
        }

        // Update position
        m.x += deltaX;
    }  

    updateCombat(m: IMonsterData, time: IGameTime): void
    {
        if (!this.ctx.player.isAlive) return;
        
        const playerDistanceSqr = Math.pow(this.ctx.player.y - m.y, 2) + Math.pow(this.ctx.player.x - m.x, 2);

        if (playerDistanceSqr > m.detectRangeSqr) return;
        if (m.projectileCount == 0) return;

        m.attackCooldown -= time.deltaTime;

        if (m.attackCooldown <= 0)
        {
            m.attackCooldown = m.maxAttackCooldown;
            
            // Calculates direcion to player
            const shootDirection = Math.atan2(this.ctx.player.y - m.y, this.ctx.player.x - m.x);

            // Depending on how many projectiles monster shoot
            for (let i = 0; i < m.projectileCount; i++)
            {
                // Calculate angle for each projectile with consistent angle gap
                const angle = shootDirection - ((i - m.projectileCount * 0.5 + 0.5) / m.projectileCount) * m.projectileArc;

                this.ctx.projectiles.add({ 
                    damage: m.attackDamage,
                    x: m.x + m.width * 0.25, 
                    y: m.y + m.height * 0.25, 
                    angle, 
                    spriteX: m.projectileSpriteX, 
                    spriteY: m.projectileSpriteY,
                    speed: 400 * m.projectileSpeedMultiplier,
                    angularSpeed: m.projectileAngularSpeed
                });
            }

            this.ctx.effects.trigger(`monster-attack`, { sound: m.attackSoundAsset, volume: m.attackSoundVolume });
        }
    }

    updateAnimation(m: IMonsterData, time: IGameTime): void 
    {
        m.lookDirection = this.ctx.player.x < m.x ? -1 : 1;
        m.animationFrame += m.animationSpeed * time.deltaTime;

        if (m.animationFrame > m.maxFrames)
        {
            m.animationFrame %= m.maxFrames;

            if (m.animationState == `hit`)
            {
                this.setAnimationState(m, m.animationPreviousState)
            }
        }

        if (m.animationState != `hit`)
        {
            this.setAnimationState(m, `idle`);
        }
    }

    checkPlayerCollision(m: IMonsterData, time: IGameTime): void
    {
        if (!Utils.collision(this.ctx.player.x, this.ctx.player.y, this.ctx.player.width, this.ctx.player.height, m.x + m.offsetX, m.y + m.offsetY, m.hitboxWidth, m.hitboxHeight)) 
        {
            return;
        }

        const impactX = (this.ctx.player.x + m.x) * 0.5;
        const impactY = (this.ctx.player.y + m.y) * 0.5;
        const direction = Math.atan2(m.y - this.ctx.player.y, m.x - this.ctx.player.x);

        if (this.ctx.player.speedY > 100 && this.ctx.player.attackCooldown <= 0)
        {
            this.ctx.player.attackCooldown = this.ctx.player.maxAttackCooldown;
            this.ctx.player.combatBounce(m, direction, 1000);

            let damage = this.ctx.player.attackDamage;
            if (this.ctx.player.midasSword && this.ctx.player.gold > this.ctx.player.score)
            {
                damage += 3 * this.ctx.player.midasSword;
            }

            this.takeDamage(m, { damage, impactX, impactY, direction });

            if (m.isAlive == false)
            {
                // On kill effects
                this.ctx.player.onMonsterKill();
            }

            this.ctx.effects.trigger(`player-attack`, { impactX, impactY, direction });
        }
    }

    setAnimationState(m: IMonsterData, state: string): void
    {
        if (m.animationState == state) return;

        m.animationPreviousState = m.animationState;
        m.animationState = state;
        m.animationFrame = 0;

        switch(state)
        {
            case `idle`: 
            {
                m.animationOffset = 0;
                m.maxFrames = 2; 
                m.animationSpeed = 4; 
                break
            }
            case `hit`: 
            {
                m.maxFrames = 1; 
                m.animationSpeed = 10; 
                m.animationOffset = 6;
                break;
            }
        }
    }

    // Based on difficulty scaling
    getRandomMonsterType(majorTilesSpawn: number): number
    {
        // Capped at 3, since that's how many mob types there is
        const maxMonsterType = Utils.clamp(Math.floor((majorTilesSpawn + 3) * 0.16), 0, 3);
        return Utils.randomInt(0, maxMonsterType);
    }

    draw(): void 
    {
        for (let i = 0; i < this.monsters.length; i++)
        {
            const m = this.monsters[i];

            this.ctx.canvas.drawImage(m.x, m.y, m.spriteX + Math.floor(m.animationFrame + m.animationOffset), m.spriteY, m.width, m.height, m.lookDirection);

            if (this.ctx.debug.isEnabled())
            {
                this.ctx.canvas.drawRect(m.movementBounds.x, m.movementBounds.y, m.movementBounds.width, m.movementBounds.height, `rgb(128, 0, 0)`);
                this.ctx.canvas.drawRect(m.x + m.offsetX, m.y + m.offsetY, m.hitboxWidth, m.hitboxHeight, `rgb(255, 0, 0)`);
            }

            // Attack timer
            const progress = 1 - (m.attackCooldown / m.maxAttackCooldown);
            const barMargin = 3;
            const barX = m.x + m.width * 0.25;
            const barY = m.y + m.height + barMargin;
            const barWidth = 24;

            this.ctx.canvas.drawFilledRect(barX - barMargin, barY - barMargin, barWidth + 2 * barMargin, 9, `black`, `transparent`);
            this.ctx.canvas.drawFilledRect(barX, barY, barWidth * progress, barMargin, `rgb(0, 150, ${150 + 100 * progress})`, `transparent`);
        }
    }
}

import { IGameTime } from "../Data/IGameTime";
import { IMonsterData } from "../Data/IMonsterData";
import { IMonsterSpawnData } from "../Data/IMonsterSpawnData";
import { IDamageTakenData } from "../Data/IDamageTakenData";
import { Utils } from "../Core/Utils";
import { WorldManager } from "./WorldManager";
import { IGameContext } from "../Data/IGameContext";
