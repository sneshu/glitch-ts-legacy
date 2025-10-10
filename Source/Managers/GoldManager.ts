//
// File: GoldManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class GoldManager
{
    private ctx: IGameContext;
    private goldNuggets: Array<IGoldData>;

    constructor(ctxRef: IGameContext)
    {
        this.ctx = ctxRef;
        this.goldNuggets = new Array<IGoldData>();
    }

    getCount(): number
    {
        return this.goldNuggets.length;
    }

    add(data: IGoldSpawnData): void
    {
        const g = {} as IGoldData;

        g.type = data.type;
        g.x = data.spawnX;
        g.y = data.spawnY;
        g.animationOffset = data.animationOffset
        g.width = 24;
        g.height = 24;
        g.offsetX = 6;
        g.offsetY = 6;

        this.goldNuggets.push(g);
    }

    update(): void
    {
        this.goldNuggets = this.goldNuggets.filter(g => 
        {
            // Checking collision with player
            if (Utils.collision(this.ctx.player.x + this.ctx.player.offsetX, this.ctx.player.y + this.ctx.player.offsetY, this.ctx.player.hitboxWidth, this.ctx.player.hitboxHeight, g.x + g.offsetX, g.y + g.offsetY, g.width, g.height))
            {
                this.ctx.effects.trigger(`gold-pick-up`, { x: g.x, y: g.y });

                switch(g.type)
                {
                    case 0: this.ctx.player.addGold(1); break;
                    case 1: this.ctx.player.addGold(10); break;
                    case 2: this.ctx.player.addGold(100); break;
                }

                // Destroy the nugget
                return false;
            }

            return !(g.x + g.width < this.ctx.camera.x);
        });
    }

    draw(time: IGameTime): void
    {
        const frequency = 5;
        const amplitude = 5;

        for (let i = 0; i < this.goldNuggets.length; i++)
        {
            const g = this.goldNuggets[i];
            const animationOffsetY = Math.floor(amplitude * Math.sin((g.animationOffset * 0.5 + time.runTime) * frequency) * 0.5) * 2;
            this.ctx.canvas.drawImage(g.x - g.offsetX, g.y - g.offsetY + animationOffsetY, 13 + g.type, 0);

            if (this.ctx.debug.isEnabled())
            {
                this.ctx.canvas.drawRect(g.x + g.offsetX, g.y + g.offsetY, g.width, g.height, `rgb(255, 255, 0)`);
            }
        }
    }
    
    getRandomGoldType(): number
    {
        if (Utils.randomInt(0, 79) == 0) return 2;
        if (Utils.randomInt(0, 7) == 0) return 1;
        return 0;
    }
}

import { IGameContext } from "../Data/IGameContext";
import { IGameTime } from "../Data/IGameTime";
import { IGoldData } from "../Data/IGoldData";
import { Utils } from "../Core/Utils";
import { IGoldSpawnData } from "../Data/IGoldSpawnData";

