//
// File: ProjectileManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class ProjectileManager
{
    static readonly MAX_PROJECTILES: number = 500;
    private ctx: IGameContext;
    private projectiles: Array<IProjectileData>;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.projectiles = new Array<IProjectileData>();
    }

    getCount(): number
    {
        return this.projectiles.length;
    }

    add(descriptor: Partial<IProjectileData>): void
    {
        if (this.projectiles.length >= ProjectileManager.MAX_PROJECTILES) return;

        const projectile = {} as IProjectileData;

        projectile.x = descriptor.x ?? 0;
        projectile.y = descriptor.y ?? 0;
        projectile.damage = descriptor.damage ?? 0;
        projectile.spriteX = descriptor.spriteX ?? 0;
        projectile.spriteY = descriptor.spriteY ?? 9;
        projectile.size = descriptor.size ?? WorldManager.GRID_SIZE;
        projectile.hitsize = projectile.size * 0.5;
        projectile.angle = descriptor.angle ?? 0;
        projectile.angularSpeed = descriptor.angularSpeed ?? 0;
        projectile.localRotation = descriptor.localRotation ?? 0;
        projectile.rotateTowardsMovement = descriptor.rotateTowardsMovement ?? true;
        projectile.rotation = descriptor.rotation ?? 0;
        projectile.rotationSpeed = descriptor.rotationSpeed ?? 0;
        projectile.speed = descriptor.speed ?? 400;
        
        this.projectiles.push(projectile);
    }

    update(time: IGameTime): void
    {
        // Loop is inverted so I dont have to check if projectile exists after one is removed from array
        for (let i = this.projectiles.length - 1; i >= 0; i--)
        {
            let p = this.projectiles[i];

            // Destroy if projectile is out of screen bounds
            if (!Utils.collision(p.x - this.ctx.camera.x, p.y - this.ctx.camera.y, p.size, p.size, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height))
            {
                this.projectiles.splice(i, 1);
                continue;
            }

            // Check if touches player
            if (Utils.collision(p.x + (p.size - p.hitsize) * 0.5, p.y + (p.size - p.hitsize) * 0.5, p.hitsize, p.hitsize, this.ctx.player.x + this.ctx.player.offsetX, this.ctx.player.y + this.ctx.player.offsetY, this.ctx.player.hitboxWidth, this.ctx.player.hitboxHeight))
            {
                this.ctx.player.takeDamage(p.damage, p.x, p.y, p.angle);
                this.projectiles.splice(i, 1);
                continue;
            }

            p.rotation += p.rotationSpeed * time.deltaTime;
            p.angle += p.angularSpeed * time.deltaTime;
            p.x += Math.cos(p.angle) * p.speed * time.deltaTime;
            p.y += Math.sin(p.angle) * p.speed * time.deltaTime;            
        }
    }

    draw(): void
    {
        for (let i = 0; i < this.projectiles.length; i++)
        {
            const p = this.projectiles[i];
            let rotation = p.rotation + p.localRotation;

            if (p.rotateTowardsMovement == true)
            {
                rotation += p.angle;
            }

            this.ctx.canvas.drawRotatedImage(p.x + p.size * 0.5, p.y + p.size * 0.5, p.spriteX, p.spriteY, rotation, p.size, p.size);

            if (this.ctx.debug.isEnabled())
            {
                this.ctx.canvas.drawRect(p.x + (p.size - p.hitsize) * 0.5, p.y + (p.size - p.hitsize) * 0.5, p.hitsize, p.hitsize, `rgb(255, 0, 255)`)
            }
        }
    }
}

import { IGameTime } from "../Data/IGameTime";
import { IProjectileData } from "../Data/IProjectileData";
import { Utils } from "../Core/Utils";
import { CameraManager } from "./CameraManager";
import { CanvasManager } from "./CanvasManager";
import { DebugManager } from "./DebugManager";
import { PlayerManager } from "./PlayerManager";
import { WorldManager } from "./WorldManager";import { IGameContext } from "../Data/IGameContext";

