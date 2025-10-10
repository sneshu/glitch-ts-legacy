//
// File: MessageBoxManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class MessageBoxManager
{
    private ctx: IGameContext;
    private boxes: Array<IMessageBoxData>;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.boxes = new Array<IMessageBoxData>();
    }

    getCount(): number
    {
        return this.boxes.length;
    }

    recalculateBounds(b: IMessageBoxData): void
    {
        let maxWidth = 0;
        for (let i = 0; i < b.lines.length; i++)
        {
            const size = this.ctx.canvas.measureText(b.lines[i].content, `${b.textSize}px Retro`);

            if (size.width > maxWidth)
            {
                maxWidth = size.width;
            }
        }

        const padding = { x: Math.floor(b.textSize * 0.5) + 8, y: 8 };
        b.width = maxWidth + 2 * padding.x;
        b.height = b.textSize * b.lines.length + padding.y;
    }

    add(modifiers: Partial<IMessageBoxData>): void
    {
        const b = {} as IMessageBoxData;
        b.x = modifiers.x ?? 0;
        b.y = modifiers.y ?? 0;
        b.lines = modifiers.lines ?? new Array<ITextLineData>();
        b.textSize = modifiers.textSize ?? 24;
        b.backgroundColor = modifiers.backgroundColor ?? `rgba(0, 0, 0, 0.5)`;

        this.recalculateBounds(b);
        this.boxes.push(b);
    } 

    clearAll(): void
    {
        this.boxes.length = 0;
    }

    update(): void
    {
        // Clear when out of screen (x < 0)
        this.boxes = this.boxes.filter(b => 
        { 
            return !(b.x + b.width < this.ctx.camera.x);
        });
    }

    drawSingle(b: IMessageBoxData): void
    {
        this.ctx.canvas.drawFilledRect(b.x - b.width * 0.5, b.y, b.width, b.height, b.backgroundColor, `white`, 3);

        for (let i = 0; i < b.lines.length; i++)
        {
            this.ctx.canvas.drawText(b.x, b.y + (i + 1) * b.textSize, b.textSize, b.lines[i].content, b.lines[i].color, `center`);
        }
    }

    draw(): void
    {
        for (let i = 0; i < this.boxes.length; i++)
        {
            this.drawSingle(this.boxes[i]);
        }
    }
}

import { IGameContext } from "../Data/IGameContext";
import { IMessageBoxData } from "../Data/IMessageBoxData";
import { ITextLineData } from "../Data/ITextLineData";
