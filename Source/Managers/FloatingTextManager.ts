//
// File: FloatingTextManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class FloatingTextManager
{
    ctx: IGameContext;
    texts: Array<ITextObjectData>;

    constructor(ctx: IGameContext)
    {
        this.ctx = ctx;
        this.texts = new Array<ITextObjectData>();
    }

    getCount(): number
    {
        return this.texts.length;
    }

    add(descriptor: Partial<ITextObjectData>): void
    {
        const t = {} as ITextObjectData;
        
        t.x = descriptor.x ?? 0
        t.y = descriptor.y ?? 0;
        t.content = descriptor.content ?? `empty`;
        t.textSize = descriptor.textSize ?? 24;
        const size = this.ctx.canvas.measureText(t.content, `${t.textSize}px Retro`);
        t.width = size.width
        t.height = t.textSize;
        t.color = descriptor.color ?? `white`;
        t.align = descriptor.align ?? `center`;
        
        this.texts.push(t);
    }

    update(): void
    {
        this.texts = this.texts.filter(text => 
        {
            return !(text.x + text.width < this.ctx.camera.x - this.ctx.camera.offsetX);
        });
    }

    draw(): void
    {
        for (let i = 0; i < this.texts.length; i++)
        {
            const t = this.texts[i];
            this.ctx.canvas.drawText(t.x, t.y, t.textSize, t.content, t.color, t.align);
        }
    }
}

import { IGameContext } from "../Data/IGameContext";
import { ITextObjectData } from "../Data/ITextObjectData";
