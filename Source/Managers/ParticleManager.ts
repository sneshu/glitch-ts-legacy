//
// File: ParticleManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class ParticleManager
{
    static readonly MAX_PARTICLES: number = 500;
    private ctx: IGameContext;
    private particles: Array<IParticleData>;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.particles = new Array<IParticleData>();
    }

    getCount(): number
    {
        return this.particles.length;
    }

    add(descriptor: Partial<IParticleData>): void
    {
        if (this.particles.length >= ParticleManager.MAX_PARTICLES) return;

        const p = {} as IParticleData;
        p.x = (descriptor.x ?? 0) + Utils.random(0, descriptor.width ?? 0)
        p.y = (descriptor.y ?? 0) + Utils.random(0, descriptor.height ?? 0)
        p.spriteX = descriptor.spriteX ?? 0;
        p.spriteY = descriptor.spriteY ?? Utils.randomInt(0, 2);
        p.maxLifetime = descriptor.lifetime ?? Utils.random(0.5, 0.8);
        p.lifetime = p.maxLifetime;
        p.angle = descriptor.angle ?? Math.random() * 2 * Math.PI;
        p.angularSpeed = descriptor.angularSpeed ?? Utils.random(-1, 1);
        p.localRotation = descriptor.localRotation ?? 0;
        p.rotateTowardsMovement = descriptor.rotateTowardsMovement ?? false;
        p.rotation = descriptor.rotation ?? Utils.random(0, 2 * Math.PI);
        p.rotationSpeed = descriptor.rotationSpeed ?? Utils.random(-0.5, 0.5);
        p.speed = descriptor.speed ?? Utils.random(40, 60);
        p.speedYFromGravity = 0;
        p.gravityForce = descriptor.gravityForce ?? WorldManager.GRAVITY_FORCE * 0.25;
        
        this.particles.push(p);
    }

    update(time: IGameTime): void
    {
        // Loop is inverted so I dont have to check if particles exists after one is removed from array
        for (let i = this.particles.length - 1; i >= 0; i--)
        {
            let p = this.particles[i];

            if (p.lifetime <= 0)
            {
                this.particles.splice(i, 1);
                continue;
            }

            p.lifetime -= time.deltaTime;
            p.rotation += p.rotationSpeed * time.deltaTime;
            p.angle += p.angularSpeed * time.deltaTime;
            p.speedYFromGravity += p.gravityForce * time.deltaTime;
            p.x += Math.cos(p.angle) * p.speed * time.deltaTime;
            p.y += (Math.sin(p.angle) * p.speed + p.speedYFromGravity) * time.deltaTime;            
        }
    }

    draw(): void
    {
        const baseSize = WorldManager.GRID_SIZE;

        for (let i = 0; i < this.particles.length; i++)
        {
            const p = this.particles[i];
            const size = baseSize * (p.lifetime / p.maxLifetime);
            let rotation = p.rotation + p.localRotation;

            if (p.rotateTowardsMovement == true)
            {
                rotation += p.angle;
            }

            this.ctx.canvas.drawRotatedImage(p.x + size * 0.5, p.y + size * 0.5, p.spriteX, p.spriteY, rotation, size, size);

            if (this.ctx.debug.isEnabled())
            {
                this.ctx.canvas.drawRect(p.x, p.y, size, size, `rgb(0, 255, 255)`)
            }
        }
    }
}

import { IGameContext } from "../Data/IGameContext";
import { IGameTime } from "../Data/IGameTime";
import { IParticleData } from "../Data/IParticleData";
import { Utils } from "../Core/Utils";
import { WorldManager } from "./WorldManager";
