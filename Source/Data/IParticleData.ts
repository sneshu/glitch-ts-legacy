//
// File: IParticleData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IParticleData
{
    x: number;
    y: number;
    width: number;
    height: number;
    spriteX: number;
    spriteY: number;
    maxLifetime: number;
    lifetime: number;
    angle: number;
    angularSpeed: number;
    localRotation: number;
    rotateTowardsMovement: boolean;
    rotation: number;
    rotationSpeed: number;
    speed: number;
    speedYFromGravity: number;
    gravityForce: number;
}