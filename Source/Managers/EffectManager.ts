//
// File: EffectManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class EffectsManager
{
    private ctx: IGameContext;
    private effects: Map<string, Function>;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.effects = new Map<string, Function>();

        this.add(`step`, (modifiers: Partial<IEffectModifiersData>): void =>
        {
            const count = modifiers.count ?? 1;

            for (let i = 0; i < count; i++)
            {
                this.ctx.particles.add({ 
                    x: modifiers.x ?? 0, 
                    y: modifiers.y ?? 0, 
                    width: modifiers.width ?? 0, 
                    speed: Utils.random(2, 10),
                    gravityForce: 0
                });
            }
        });

        this.add(`jump`, (modifiers: IEffectModifiersData): void =>
        {
            const count = modifiers.count ?? 3;
            const volume = modifiers.volume ?? 0.2;

            this.ctx.audio.play(`jump`, volume);

            for (let i = 0; i < count; i++)
            {
                this.ctx.particles.add({ 
                    x: modifiers.x ?? 0, 
                    y: modifiers.y ?? 0, 
                    width: modifiers.width ?? 0, 
                    angle: Math.PI * 0.5,
                    angularSpeed: Utils.random(-6, 6),

                });
            }
        });

        this.add(`land`, (modifiers: IEffectModifiersData): void =>
        {
            const count = modifiers.count ?? Utils.randomInt(4, 6);
            const volume = modifiers.volume ?? 1.0;

            this.ctx.audio.play(`hard-landing`, volume);

            for (let i = 0; i < count; i++)
            {
                this.ctx.particles.add({ 
                    x: modifiers.x ?? 0, 
                    y: modifiers.y ?? 0, 
                    width: modifiers.width ?? 0, 
                    speed: Utils.random(40, 60), 
                    angle: Utils.random(0, Math.PI), 
                    angularSpeed: Utils.random(-6, 6), 

                });
            }
        });

        this.add(`gold-pick-up`, (modifiers: IEffectModifiersData): void =>
        {
            const count = modifiers.count ?? Utils.randomInt(3, 5);
            const volume = modifiers.volume ?? 0.1;

            this.ctx.audio.play(`pick-up`, volume);

            for (let i = 0; i < count; i++)
            {
                this.ctx.particles.add({ 
                    x: modifiers.x ?? 0, 
                    y: modifiers.y ?? 0, 
                    lifetime: Utils.random(0.4, 0.5), 
                    angularSpeed: Utils.random(-2, 2), 
                    spriteY: Utils.randomInt(3, 5),

                });
            }
        });

        this.add(`player-death`, (modifiers: Partial<IEffectModifiersData>): void =>
        {
            this.ctx.audio.play(`hit-b`, 0.5);
            this.ctx.camera.setShake(2);

            const x = modifiers.x ?? 0;
            const y = modifiers.y ?? 0;
            const countRed = Utils.randomInt(7, 10);

            for (let i = 0; i < countRed; i++)
            {
                this.ctx.particles.add({ 
                    x: x + Utils.random(0, 48), 
                    y: y + Utils.random(0, 48), 
                    lifetime: Utils.random(0.7, 0.8), 
                    speed: Utils.random(80, 100),
                    angle: Utils.random(-1, 1), 
                    angularSpeed: Utils.random(-6, 6),
                    spriteY: Utils.randomInt(6, 7),
                    gravityForce: 100,
                });
            }
        })

        this.add(`monster-death`, (modifiers: IEffectModifiersData): void =>
        {
            this.ctx.audio.play(`hit-b`, 0.6);

            const x = modifiers.x ?? 0;
            const y = modifiers.y ?? 0;
            const count = Utils.randomInt(9, 11);

            for (let i = 0; i < count; i++)
            {
                this.ctx.particles.add({ 
                    x: x  + Utils.random(0, 48), 
                    y: y + Utils.random(0, 48), 
                    lifetime: Utils.random(0.7, 0.8), 
                    speed: Utils.random(80, 100),
                    angle: Utils.random(-1, 1), 
                    angularSpeed: Utils.random(-6, 6),
                    spriteY: Utils.randomInt(6, 7),
                    gravityForce: 200,
                });
            }
             
        })

        this.add(`damage`, (modifiers: IEffectModifiersData): void =>
        {
            this.ctx.audio.play(`hit-a`, 0.3);
            this.ctx.camera.setShake(modifiers.shake ?? 1);

            const impactX = modifiers.impactX ?? 0;
            const impactY = modifiers.impactY ?? 0;
            const direction = modifiers.direction ?? 0;

            const countRed = Utils.randomInt(3, 5);
            for (let i = 0; i < countRed; i++)
            {
                this.ctx.particles.add({ 
                    x: impactX + Utils.random(0, 48), 
                    y: impactY + Utils.random(0, 48), 
                    lifetime: Utils.random(0.7, 0.8), 
                    speed: Utils.random(80, 100),
                    angle: Utils.random(-1, 1) + direction, 
                    angularSpeed: Utils.random(-6, 6),
                    spriteY: Utils.randomInt(6, 7),
                    gravityForce: 200,
                });
            }

            // Sideway projectiles
            this.ctx.particles.add({ 
                x: impactX + Utils.random(0, 48), 
                y: impactY + Utils.random(0, 48), 
                lifetime: Utils.random(0.3, 0.5), 
                speed: Utils.random(50, 200),
                angle: Utils.random(-0.1, 0.1) + direction - Math.PI * 0.5,
                angularSpeed: Utils.random(-4, 4), 
                spriteY: Utils.randomInt(6, 7),
            });

            this.ctx.particles.add({ 
                x: impactX + Utils.random(0, 48), 
                y: impactY + Utils.random(0, 48), 
                lifetime: Utils.random(0.3, 0.5), 
                speed: Utils.random(50, 200),
                angle: Utils.random(-0.1, 0.1) + direction + Math.PI * 0.5,
                angularSpeed: Utils.random(-4, 4), 
                spriteY: Utils.randomInt(6, 7),
            });
        })

        this.add(`monster-attack`, (modifiers: IEffectModifiersData): void =>
        {
            const sound = modifiers.sound ?? `slash`;
            const volume = modifiers.volume ?? 0.02;
            this.ctx.audio.play(sound, volume);
        })

        this.add(`player-attack`, (modifiers: IEffectModifiersData): void =>
        {
            this.ctx.audio.play([`slash-a`, `slash-b`][Utils.randomInt(0, 1)], 0.02);

            const impactX = modifiers.impactX ?? 0;
            const impactY = modifiers.impactY ?? 0;
            const direction = modifiers.direction ?? 0;

            for (let i = 0; i < 2; i++)
            {
                this.ctx.particles.add({ 
                    x: impactX + Utils.random(-12, 12), 
                    y: impactY + Utils.random(-12, 12), 
                    lifetime: Utils.random(0.5, 0.7), 
                    speed: Utils.random(150, 200),
                    angle: Utils.random(-0.1, 0.1) + direction + Math.PI,
                    angularSpeed: Utils.random(-5, 5),

                });
            }

            // Sword blade projectile
            this.ctx.particles.add({ 
                x: impactX, 
                y: impactY, 
                lifetime: 0.3, 
                speed: 500,
                rotation: 0,
                rotationSpeed: 0,
                rotateTowardsMovement: true,
                localRotation: -Math.PI * 0.25,
                angle: direction,
                angularSpeed: 0, 
                spriteY: 8,
            });
            
            this.ctx.particles.add({ 
                x: impactX, 
                y: impactY, 
                lifetime: 0.3, 
                speed: 400,
                rotation: 0,
                rotationSpeed: 0,
                rotateTowardsMovement: true,
                localRotation: -Math.PI * 0.25,
                angle: direction,
                angularSpeed: 0, 
                spriteY: 9,
            });
        });
    }

    add(id: string, callback: Function): void
    {
        this.effects.set(id, callback);
    }

    trigger(id: string, modifiers: Partial<IEffectModifiersData>): void
    {
        const callback = this.effects.get(id);
        if (!callback) return;
        callback(modifiers);
    }
}

import { IEffectModifiersData } from "../Data/IEffectModifiersData";
import { Utils } from "../Core/Utils";
import { IGameContext } from "../Data/IGameContext";
