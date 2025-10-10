//
// File: IMovementData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IMovementData
{
    x: number;
    y: number;
    width: number;
    height: number;
    hitboxWidth: number;
    hitboxHeight: number;
    offsetX: number;
    offsetY: number;

    speedX: number;
    speedY: number;
    maxSpeedX: number;
    acceleration: number;
    friction: number;
    isMoving: boolean;
}