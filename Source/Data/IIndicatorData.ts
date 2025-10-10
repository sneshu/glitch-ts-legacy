//
// File: IIndicatorData.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IIndicatorData
{
    x: number;
    y: number;
    spread: number;
    maxLifetime: number;
    lifetime: number;
    angle: number;
    speed:number;
    deacceleration: number;
    content: string;
    color: string;
}