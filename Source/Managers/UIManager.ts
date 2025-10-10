//
// File: UIManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class UserInterfaceManager
{
    private ctx: IGameContext;

    private tookDamageTime: number;
    private x: number;
    private y: number;

    private onWindowResizeBinding = this.onWindowResize.bind(this);

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.tookDamageTime = Date.now();
        this.x = 0;
        this.y = 0;

        this.onWindowResizeBinding();
        window.addEventListener(`resize`, this.onWindowResizeBinding);
    }

    onWindowResize(): void
    {
        this.x = this.ctx.canvas.width * 0.5;
        this.y = this.ctx.canvas.height - WorldManager.GRID_SIZE * 0.5;
    }

    signalDamage(): void
    {
        this.tookDamageTime = Date.now() + 250;
    }

    draw(): void
    {
        const playerLife = this.ctx.player.life;
        const playerMaxLives = this.ctx.player.maxLives;
        const playerScore = this.ctx.player.score;
        const playerGold = this.ctx.player.gold;
        const playerItems = this.ctx.player.purchasedItems;

        // Background
        const bgColorR = (Date.now() < this.tookDamageTime ? 200 : 0);
        const size = { width: 524, height: WorldManager.GRID_SIZE + 12 };
        const offsetX = this.x + this.ctx.camera.x;
        const offsetY = this.y + this.ctx.camera.y - size.height * 0.75;
        this.ctx.canvas.drawFilledRect(offsetX - size.width * 0.5, offsetY, size.width, size.height, `rgba(${bgColorR}, 0, 0, 0.5)`, `black`, 3);

        // Player life
        const livesContainerWidth = 300;
        const spacing = livesContainerWidth / playerMaxLives;
        const center = playerMaxLives * 0.5;
        for (let i = playerMaxLives - 1; i >= 0; i--)
        {
            this.ctx.canvas.drawImage(this.x + (i - center) * spacing + this.ctx.camera.x, this.y + this.ctx.camera.y - size.height * 0.75 + 9, i < playerLife ? 1 : 2, 6);
        }
        
        // Score
        this.ctx.canvas.drawText(offsetX - livesContainerWidth * 0.5 - 64, offsetY + 24, 24, `Score:`, `white`, `center`);
        this.ctx.canvas.drawText(offsetX - livesContainerWidth * 0.5 - 64, offsetY + 48, 24, `${playerScore} pts`, `rgb(0, 250, 200)`, `center`);

        // Gold
        this.ctx.canvas.drawText(offsetX + livesContainerWidth * 0.5 + 64, offsetY + 24, 24, `Wallet:`, `white`, `center`);
        this.ctx.canvas.drawText(offsetX + livesContainerWidth * 0.5 + 64, offsetY + 48, 24, `${playerGold}g`, `rgb(250, 200, 0)`, `center`);
        
        // Artifacts
        if (playerItems.size == 0) return;
        
        let i = playerItems.size * 0.5;
        for (const [_, item] of playerItems.entries()) 
        {
            const x = offsetX - 24;
            const y = offsetY - 24;
            const padding = 32;
            this.ctx.canvas.drawImage(x + i * padding, y - 4, item.data.spriteX, item.data.spriteY, 32, 32);
            this.ctx.canvas.drawText(x + i-- * padding + padding * 0.5, y + padding - 4, 16, `x${item.quantity}`);
        }  
    }
}

import { IGameContext } from "../Data/IGameContext";
import { WorldManager } from "./WorldManager";