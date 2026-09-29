//
// File: PlayerManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class PlayerManager implements IMovementData, ICombatData, IAnimationData, IPlayerModifiersData
{
    ctx: IGameContext

    score: number = 0;
    gold: number = 0;
    purchasedItems: Map<string, IPurchasedItem>;
    width: number = WorldManager.GRID_SIZE;
    height: number = WorldManager.GRID_SIZE;
    hitboxWidth: number = WorldManager.GRID_SIZE * 0.4;
    hitboxHeight: number = WorldManager.GRID_SIZE * 0.7;
    offsetX: number = WorldManager.GRID_SIZE * 0.3;
    offsetY: number = WorldManager.GRID_SIZE * 0.3;

    // Animation
    spriteX: number = 1;
    spriteY: number = 7;
    lookDirection: number = 1;
    animationState: string = `idle`;
    animationPreviousState: string = `idle`;
    animationSpeed: number = 4;
    animationFrame: number = 0;
    animationOffset: number = 0;
    maxFrames: number = 2;

    // Movement variables
    x: number = 0;
    y: number = 0;
    speedX: number = 0;
    speedY: number = 0;
    speedLastFrameX: number = 0;
    speedLastFrameY: number = 0;
    maxSpeedX: number = 9 * WorldManager.GRID_SIZE;
    acceleration: number = 220 * WorldManager.GRID_SIZE;
    gravityPull: number = 1.0;
    friction: number = 50.0;
    isGrounded: boolean = false;
    isOnPlatform: boolean = false;
    isMoving: boolean = false;
    canMoveLeft: boolean = true;

    // Jump variables
    jumps: number = 0;
    maxJumps: number = 2;
    jumpBoost: number = 0;
    maxJumpBoost: number = 4 * WorldManager.GRID_SIZE;
    jumpSpeed: number = 18 * WorldManager.GRID_SIZE;
    isJumping: boolean = false;

    // Combat variables
    isAlive: boolean = true;
    maxLives: number = 10;
    life: number = this.maxLives;
    attackCooldown: number = 0;
    maxAttackCooldown: number = 0.25;
    attackDamage: number = 2;
    projectileSpriteX: number = 0;
    projectileSpriteY: number = 0;
    projectileCount: number = 0;
    projectileArc: number = 0;
    projectileAngularSpeed: number = 0;
    projectileSpeedMultiplier: number = 0;
    attackSoundAsset: string = `none`;
    attackSoundVolume: number = 1;

    // Particle and sound effects
    stepSoundDistance: number = 0;
    stepSoundDistanceThreshold: number = 2.2 * WorldManager.GRID_SIZE;
    stepParticleDistance: number = 0;
    stepParticleDistanceThreshold: number = 0.5 * WorldManager.GRID_SIZE;

    // Artifacts / modifiers
    lifeStealer: number = 0;
    midasSword: number = 0;
    gamblersFate: number = 0;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.purchasedItems = new Map<string, IPurchasedItem>();
    }

    setAnimationState(state: string): void
    {
        if (this.animationState == state) return;

        this.animationPreviousState = this.animationState;
        this.animationState = state;
        this.animationFrame = 0;

        switch(state)
        {
            case `idle`: 
            {
                this.animationOffset = 0;
                this.maxFrames = 2; 
                this.animationSpeed = 4; 
                break
            }
            case `walk`: 
            {
                this.maxFrames = 4; 
                this.animationOffset = 2;
                break;
            }
            case `jump`: 
            {
                this.maxFrames = 1; 
                this.animationOffset = 3;
                break;
            }
            case `hit`: 
            {
                this.maxFrames = 1; 
                this.animationSpeed = 10; 
                this.animationOffset = 6;
                break;
            }
        }
    }

    updateAnimation(time: IGameTime): void 
    {
        this.animationFrame += this.animationSpeed * time.deltaTime;

        if (this.animationState == `hit`) {}
        else if (this.isGrounded && Math.abs(this.speedX) > 0) 
        {
            this.setAnimationState(`walk`);
            this.animationSpeed = Math.abs(this.speedX * 0.03);
        }
        else if (!this.isGrounded)
        {
            this.setAnimationState(`jump`);
        }
        else
        {
            this.setAnimationState(`idle`);
        }

        if (this.animationFrame >= this.maxFrames)
        {
            this.animationFrame %= this.maxFrames;

            if (this.animationState == `hit`)
            {
                this.setAnimationState(this.animationPreviousState)
            }
        }
    }

    getPositionData(): IPositionData
    {
        return { x: this.x, y: this.y };
    }

    getUIData(): IPlayerUIData
    {
        return { life: this.life, maxLives: this.maxLives, score: this.score, gold: this.gold, purchasedItems: this.purchasedItems}
    }

    addGold(value: number): void
    {
        this.gold += value;
        this.ctx.indicators.add({ x: this.x + this.width * 0.5, y: this.y, content: `+${value}g`, color: `rgb(250, 200, 0)`, spread: 5 })
    }

    addScore(value: number, showIndicator: boolean = true): void
    {
        this.score += value;

        if (!showIndicator) return;
        this.ctx.indicators.add({ x: this.x + this.width * 0.5, y: this.y + 40, speed: 10, content: `+${value} pts`, color: `rgb(0, 250, 200)`, spread: 5 })
    }

    takeDamage(damage: number, impactX: number, impactY: number, direction: number): void
    {
        if (damage == 0) return;

        if (this.gamblersFate > 0)
        {
            damage = 0;

            if (Utils.randomInt(1, 10 + 5 * this.gamblersFate) == 1)
            {
                this.die();
            }
        }

        this.setAnimationState(`hit`);
        this.ctx.effects.trigger(`damage`, { impactX, impactY, direction, shake: 0.5 });
        this.ctx.indicators.add({ x: impactX, y: impactY, content: `${damage}`, color: `red`});
        this.ctx.ui.signalDamage();
        
        this.reactToDamage(direction + Math.PI, 200);
        this.life -= damage;

        if (this.life <= 0)
        {
            this.die();
        }
    }

    reactToDamage(radians: number, force: number): void
    {
        const directionalForceX = -Math.cos(radians) * force;
        const directionalForceY = -Math.abs(Math.sin(radians) * force);

        this.speedX = directionalForceX;
        this.speedY = directionalForceY;
    }

    onMonsterKill(): void
    {
        if (this.lifeStealer > 0)
        {
            this.regenerateLife(this.lifeStealer * 2);
        }
    }

    // Bounce everyone after combat hit
    combatBounce(monster: IMonsterData, radians: number, force: number): void
    {
        const direction = (radians > Math.PI * 0.5 ? 1 : -1);
        const randomForceX = Utils.random(600, 800) * direction;
        const directionalForceX = -Math.cos(radians) * force;
        const directionalForceY = -Math.abs(Math.sin(radians) * force);

        this.speedX = directionalForceX + randomForceX;
        this.speedY = directionalForceY;

        if (typeof(monster) === `undefined`) return;

        monster.speedX = Math.cos(radians) * 1100;
        //monster.isGrounded = false;
    }

    // Kill player
    die(): void
    {
        if (this.isAlive == false) return;
        this.isAlive = false;
        this.life = 0;

        // Effects
        this.ctx.effects.trigger(`player-death`, { x: this.x, y: this.y });
        
        // Add lines to tooltip
        const lines: Array<ITextLineData> = 
        [
            { content: `You are dead!`, color: `rgb(250, 75, 75)` }, 
            { content: `Score: ${this.score}`, color: `rgb(0, 200, 250)` }
        ];
        if (this.score > this.ctx.game.getBestScore())
        {
            lines.push({ content: `You beat your best score!`, color: `rgb(0, 200, 250)` });
            this.ctx.game.setBestScore(this.score);
        }

        lines.push({ content: ``, color: `white` });
        lines.push({ content: `Press [R] to restart`, color: `white` });

        this.ctx.messageBoxes.clearAll();
        this.ctx.tooltip.show({ id: `death`, x: this.ctx.camera.x + this.ctx.canvas.width * 0.5, y: 300, lines, textSize: 24 });
    }

    regenerateLife(value: number): void
    {
        value = Math.min(this.maxLives - this.life, value);
        if (value == 0) return;

        this.life += value;
        this.ctx.indicators.add({ x: this.x, y: this.y, content: `+${value} life`, color: `rgb(250, 75, 75)`});
    }

    // Check collision with tiles and canvas border
    checkCollision(time: IGameTime): void
    {      
        const tiles: Array<ITileData> = this.ctx.tiles.getTiles();
        let grounded = false;

        this.speedLastFrameX = this.speedX;
        this.speedLastFrameY = this.speedY;

        // Fall under map
        if (this.y > this.ctx.canvas.height)
        {
            this.die();
        }

        if (this.x + this.offsetX < this.ctx.camera.x)
        {
            this.x = this.ctx.camera.x - this.offsetX;
            this.speedX = 0;
            this.canMoveLeft = false;
        }

        // Collision with the blocks
        for (const tile of tiles)
        {
            if (!tile.isVisible || !tile.isObstacle) continue;

            const nextY = Math.ceil(this.y + this.offsetY + this.speedY * time.deltaTime);
            const willCollide = Utils.collision(this.x + this.offsetX, nextY, this.hitboxWidth + this.speedX * time.deltaTime, this.hitboxHeight, tile.x, tile.y + tile.hitboxOffsetY, tile.width, tile.height);
            const isFalling = this.speedY > 0;
            const aboveIsland = Math.floor(this.y + this.height) <= (tile.y + tile.hitboxOffsetY);

            if (willCollide && aboveIsland)
            {
                // Skip platform seamlessly
                if (tile.isPlatform && this.ctx.input.isKeyDown(`s`))
                {
                    continue;
                }

                if (isFalling)
                { 
                    this.y = tile.y + tile.hitboxOffsetY - this.height;
                    this.speedY = 0;
                }

                this.isOnPlatform = tile.isPlatform;
                grounded = true;
                break;
            }
        }

        // Lose ground
        if (this.isGrounded == true && grounded == false)
        {
            this.jumps++;
        }

        // Gain ground
        if (this.isGrounded == false && grounded == true)
        {
            this.jumps = 0;
            this.jumpBoost = 0;

            // Draw effect after reaching some falling speed
            if (this.speedLastFrameY > 300)
            {
                const volume = Utils.clamp(this.speedLastFrameY * 0.0003, 0.03, 0.3);
                const count = Math.ceil(this.speedLastFrameY * 0.003);
                this.ctx.effects.trigger(`land`, { count, volume, x: this.x - this.width * 0.5, y: this.y + this.height * 0.5, width: this.width });
            }
        }

        this.isGrounded = grounded;
    }

    // Position player on the correct spot
    findSpawnPosition(): void
    {
        const majorTiles = this.ctx.tiles.getMajorTiles();

        if (majorTiles.length != 0)
        {
            for (let i = 0; i < majorTiles.length; i++)
            {
                const tile = majorTiles[i];
                const x = tile.x + majorTiles[0].width * 0.5 - this.width * 0.5;
                const y = tile.y + tile.hitboxOffsetY - this.height;

                if (x - this.ctx.camera.x > 0)
                {
                    this.x = x;
                    this.y = y;
                    this.isGrounded = true;
                    return;
                }
            }
        }

        this.x = this.ctx.canvas.width * 0.5;
        this.y = this.ctx.canvas.height * 0.5;
    }

    getUserInput(time: IGameTime): void 
    {
        if (this.ctx.input.isKeyDown(`r`))// && typeof(game) !== `undefined`) 
        {
            this.ctx.game.restart();
        }

        if (!this.isAlive) return;

        // Horizontal movement
        if (this.ctx.input.isKeyDown(`d`)) 
        {
            this.isMoving = true;
            this.canMoveLeft = true;
            this.lookDirection = 1;

            if (this.speedX < this.maxSpeedX)
            {
                this.speedX = Math.min(this.maxSpeedX, this.speedX + this.acceleration * time.deltaTime);
            }
        }

        else if (this.ctx.input.isKeyDown(`a`) && this.canMoveLeft == true) 
        {
            this.isMoving = true;
            this.lookDirection = -1;

            if (this.speedX > -this.maxSpeedX)
            {
                this.speedX = Math.max(-this.maxSpeedX, this.speedX - this.acceleration * time.deltaTime);
            }
        }

        else 
        {
            this.isMoving = false;
        }

        // Drop down
        if (this.ctx.input.isKeyDown(`s`) && this.isGrounded && this.isOnPlatform) 
        {
            this.jumps++;
            this.isGrounded = false;

            this.ctx.effects.trigger(`jump`, { x: this.x - this.width * 0.5, y: this.y + this.height * 0.5, width: this.width });
        }

        // Jumping
        if (this.ctx.input.isKeyDown(` `))
        {
            if ((this.isGrounded == true && !this.isJumping) || (this.ctx.input.wasKeyPressedThisFrame(` `) && this.jumps < this.maxJumps))
            {
                this.jumps++;
                this.isJumping = true;
                this.jumpBoost = 0;
                this.speedY = -this.jumpSpeed;
                this.isGrounded = false;

                this.ctx.effects.trigger(`jump`, { x: this.x - this.width * 0.5, y: this.y + this.height * 0.5, width: this.width });
            }
            else if (this.isJumping && this.jumpBoost < this.maxJumpBoost)
            {
                this.speedY = -this.jumpSpeed;
                this.jumpBoost += -this.speedY * time.deltaTime;

                // Draw "cloud" effect when player is jumping up
                if (Math.floor(this.jumpBoost) % 2 == 0)
                {
                    this.ctx.effects.trigger(`step`, { x: this.x - this.width * 0.5, y: this.y + this.height * 0.5, width: this.width });
                }
            }
            else
            {
                this.isJumping = false;
            }
        }
        else
        {
            this.isJumping = false;
        }
    }

    updateMovement(time: IGameTime): void
    {
        if (!this.isAlive) return;

        // Deacceleration
        const absSpeedX = Math.abs(this.speedX);
        if (this.isMoving == false || absSpeedX > this.maxSpeedX)
        {
            if (absSpeedX > 1)
            {
                this.speedX *= Math.min(0.9, this.friction * time.deltaTime);
            }

            else
            {
                this.speedX = 0;
            }
        }

        // Step sounds
        if (this.isMoving && this.isGrounded)
        {
            this.stepSoundDistance += absSpeedX * time.deltaTime;
            this.stepParticleDistance += absSpeedX * time.deltaTime;

            if (this.stepSoundDistance >= this.stepSoundDistanceThreshold)
            {
                this.stepSoundDistance = 0;
                const volume = 0.1 + 0.3 * (absSpeedX / this.maxSpeedX); 
                this.ctx.audio.play(`step`, volume);               
            }

            if (this.stepParticleDistance >= this.stepParticleDistanceThreshold)
            {
                this.stepParticleDistance = 0;
                this.ctx.effects.trigger(`step`, { x: this.x - this.width * 0.5, y: this.y + this.height * 0.5, width: this.width });
            }
        }

        // Gravity
        if (!this.isGrounded)
        {
            this.speedY += WorldManager.GRAVITY_FORCE * this.gravityPull * time.deltaTime;
        }

        // Update position
        this.x += this.speedX * time.deltaTime;
        this.y += this.speedY * time.deltaTime;
    }   

    updateCombatStats(time: IGameTime): void
    {
        // Calculate attack cooldown
        if (this.attackCooldown > 0)
        {
            this.attackCooldown -= time.deltaTime;

            if (this.attackCooldown < 0)
            {
                this.attackCooldown = 0;
            }
        }
    }

    draw(): void
    {
        if (!this.isAlive) return;

        this.ctx.canvas.drawImage(this.x, this.y, this.spriteX + Math.floor(this.animationFrame + this.animationOffset), this.spriteY, this.width, this.height, this.lookDirection);

        if (this.ctx.debug.isEnabled())
        {
            this.ctx.canvas.drawRect(this.x + this.offsetX, this.y + this.offsetY, this.hitboxWidth, this.hitboxHeight, `rgb(0, 255, 0)`);
        }
    }
} 

import { IAnimationData } from "../Data/IAnimationData";
import { IPurchasedItem } from "../Data/IPurchasedItem";
import { ICombatData } from "../Data/ICombatData";
import { IGameTime } from "../Data/IGameTime";
import { IMonsterData } from "../Data/IMonsterData";
import { IMovementData } from "../Data/IMovementData";
import { IPlayerModifiersData } from "../Data/IPlayerModifiersData";
import { IPlayerUIData } from "../Data/IPlayerUIData";
import { IPositionData } from "../Data/IPositionData";
import { ITextLineData } from "../Data/ITextLineData";
import { ITileData } from "../Data/ITileData";
import { Utils } from "../Core/Utils";
import { WorldManager } from "./WorldManager";
import { IGameContext } from "../Data/IGameContext";
