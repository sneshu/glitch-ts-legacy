//
// File: CameraManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class CameraManager
{
    private ctx: IGameContext;
    x: number;
    y: number;
    offsetX: number;
    private followPositionX: number;
    private shakeOffsetX: number;
    private shakeOffsetY: number;
    private shakeValue: number;
    private readonly onWindowResizeBinding = this.onWindowResize.bind(this);

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.offsetX = window.innerWidth * 0.5;
        this.followPositionX = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
        this.shakeValue = 0;

        window.addEventListener(`resize`, this.onWindowResizeBinding);
    }

    onWindowResize(): void
    {
        this.offsetX = window.innerWidth * 0.5;
    }

    setPosition(x: number, y: number): void
    {
        this.x = x;
        this.y = y;
    }

    setShake(value: number)
    {
        this.shakeValue = value;
    }

    update(time: IGameTime): void
    {
        if (this.shakeValue > 0)
        {
            this.shakeValue = Math.max(0, this.shakeValue - 4 * time.deltaTime);
        }

        this.shakeOffsetX = (Math.cos(time.runTime * 6) * 10 + Math.cos(time.runTime * 5) * 5) * this.shakeValue;
        this.shakeOffsetY = (Math.sin(time.runTime * 7) * 5 + Math.cos(time.runTime * 4) * 10) * this.shakeValue;
    }

    // Update camera position based on player current position
    updatePosition(): void
    {
        this.x = this.followPositionX - this.offsetX + this.shakeOffsetX;
        this.y = this.shakeOffsetY;

        // If player has surpassed middle of the screen, the camera starts following the player
        if (this.ctx.player.x + WorldManager.GRID_SIZE * 0.5 <= this.followPositionX) return;

        this.followPositionX = this.ctx.player.x + WorldManager.GRID_SIZE * 0.5;
        this.x = this.followPositionX - this.offsetX + this.shakeOffsetX;
        this.y = this.shakeOffsetY;
    }   
}

import { IGameContext } from "../Data/IGameContext";
import { IGameTime } from "../Data/IGameTime";
import { IPositionData } from "../Data/IPositionData";
import { WorldManager } from "./WorldManager";

