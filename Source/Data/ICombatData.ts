//
// File: ICombatData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface ICombatData
{
    isAlive: boolean;
    life: number;
    maxLives: number;
    projectileSpriteX: number;
    projectileSpriteY: number;
    projectileCount: number;
    projectileArc: number;
    projectileAngularSpeed: number;
    projectileSpeedMultiplier: number;
    attackDamage: number;
    attackCooldown: number;
    maxAttackCooldown: number;
    attackSoundAsset: string;
    attackSoundVolume: number;
}