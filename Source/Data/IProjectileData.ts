//
// File: IProjectileData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IProjectileData
{
    x: number;
    y: number;
    damage: number;
    spriteX: number;
    spriteY: number;
    size: number;
    hitsize: number;
    angle: number;
    angularSpeed: number;
    localRotation: number;
    rotateTowardsMovement: boolean;
    rotation: number;
    rotationSpeed: number;
    speed: number;
}