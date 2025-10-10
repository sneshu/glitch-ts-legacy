//
// File: IndicatorManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class IndicatorManager
{
    private ctx: IGameContext;
    private indicators: Array<IIndicatorData>;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.indicators = new Array<IIndicatorData>();
    }

    getCount(): number
    {
        return this.indicators.length;
    }

    add(descriptor: Partial<IIndicatorData>): void
    {
        const i = {} as IIndicatorData;

        i.content = descriptor.content ?? `empty`;
        i.color = descriptor.color ?? `white`;
        const spread = descriptor.spread ?? 30;
        i.x = descriptor.x ?? 0 + Utils.random(-spread, spread);
        i.y = descriptor.y ?? 0 + Utils.random(-spread, spread);
        i.maxLifetime = descriptor.lifetime ?? Utils.random(1.0, 1.3);
        i.lifetime = i.maxLifetime;
        i.angle = i.angle ?? -Math.PI * 0.5;
        i.speed = descriptor.speed ?? Utils.random(100, 150);
        i.deacceleration = i.deacceleration ?? Utils.random(150, 180);
        
        this.indicators.push(i);
    }

    update(time: IGameTime): void
    {
        for (let j = this.indicators.length - 1; j >= 0; j--)
        {
            let i = this.indicators[j];

            if (i.lifetime <= 0)
            {
                this.indicators.splice(j, 1);
                continue;
            }

            i.lifetime -= time.deltaTime;

            // Deacceleration
            if (i.speed > 0)
            {
                i.speed -= i.deacceleration * time.deltaTime;

                if (i.speed < 0)
                {
                    i.speed = 0;
                }
            }

            // Update position
            i.x += Math.cos(i.angle) * i.speed * time.deltaTime;
            i.y += Math.sin(i.angle) * i.speed * time.deltaTime;            
        }
    }

    draw(): void
    {
        for (let j = this.indicators.length - 1; j >= 0; j--)
        {
            const i = this.indicators[j];
            this.ctx.canvas.drawText(i.x, i.y, 32, i.content, i.color, `center`);

            if (this.ctx.debug.isEnabled())
            {
                this.ctx.canvas.drawRect(i.x, i.y, 20, 20, `rgb(0, 128, 128)`)
            }
        }
    }
}

import { IGameContext } from "../Data/IGameContext";
import { IGameTime } from "../Data/IGameTime";
import { IIndicatorData } from "../Data/IIndicatorData";
import { Utils } from "../Core/Utils";

