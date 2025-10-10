//
// File: Utils.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class Utils
{
    // Checking collision of two rectangles
    static collision(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number): boolean
    {
        return ax < bx + bw && ax + aw >= bx && ay < by + bh && ay + ah >= by;
    }

    // Values are inclusive
    static randomInt(min: number, max: number): number
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static random(min: number, max: number): number
    {
        return Math.random() * (max - min) + min;
    }

    static angleToRadians(angle: number): number
    {
        return angle * (Math.PI / 180);
    }

    static radiansToAngle(radians: number): number
    {
        return radians * (180 / Math.PI);
    }

    static clamp (value: number, min: number, max: number): number
    {
        return Math.max(min, Math.min(max, value));
    }
}