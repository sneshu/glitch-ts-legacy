//
// File: CanvasManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class CanvasManager 
{
    private ctx: IGameContext;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private patternCache: Map<string, CanvasPattern>;
    width: number = 0;
    height: number = 0;

    private onWindowResizeBinding = this.onWindowResize.bind(this);

    constructor(ctx: IGameContext) 
    {
        this.ctx = ctx;

        this.canvas = document.createElement(`canvas`);
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext(`2d`)!;
        this.context.font = `32px Retro`;
        
        this.patternCache = new Map<string, CanvasPattern>();

        this.onWindowResizeBinding();
        window.addEventListener(`resize`, this.onWindowResizeBinding);
    }

    // Resize canvas to be fullscreen
    onWindowResize(): void
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
   }

    clear(): void 
    {
        if (!this.context) return;
        this.context.clearRect(0, 0, this.width, this.height);
    }

    measureText(text: string, font: string): TextMetrics
    {
        this.context.font = font;
        return this.context.measureText(text);
    }

    drawText(x: number, y: number, textSize: number, content: string, color: string = `white`, align: CanvasTextAlign = `start`): void
    {
        this.context.fillStyle = color;
        this.context.font = `${textSize}px Retro`;
        this.context.shadowColor = `black`;
        this.context.shadowOffsetY = 3;
        
        // Fix for blurry centered text
        const size = this.measureText(content, this.context.font);
        const offsetX = align == `center` ? size.width * 0.5 : 0;

        this.context.fillText(content, Math.round(x - this.ctx.camera.x - offsetX), Math.round(y - this.ctx.camera.y));

        // Revert shadow settings back
        this.context.shadowColor = `transparent`;
        this.context.shadowOffsetY = 0;
    }

    drawFilledRect(x: number, y: number, width: number, height: number, color: string, borderColor: string = `transparent`, lineWidth: number = 3): void
    {
        this.context.fillStyle = color;
        this.context.strokeStyle = borderColor;
        this.context.lineWidth = lineWidth
        this.context.strokeRect(Math.floor(x - this.ctx.camera.x), Math.floor(y - this.ctx.camera.y), width, height);
        this.context.fillRect(Math.floor(x - this.ctx.camera.x), Math.floor(y - this.ctx.camera.y), width, height);
    }

    drawRect(x: number, y: number, width: number, height: number, color: string, lineWidth: number = 3): void
    {
        this.context.imageSmoothingEnabled = false;
        this.context.strokeStyle = color;
        this.context.lineWidth = lineWidth
        this.context.strokeRect(Math.floor(x - this.ctx.camera.x), Math.floor(y - this.ctx.camera.y), Math.floor(width), Math.floor(height));
    }

    drawCircle(x: number, y: number, radius: number, color: string): void
    {
        this.context.beginPath();
        this.context.arc(Math.floor(x - this.ctx.camera.x), Math.floor(y - this.ctx.camera.y), radius, 0, Math.PI * 2);
        this.context.fillStyle = color;
        this.context.fill();
    }    

    drawLine(x: number, y: number, radians: number, length: number, color: string): void
    {
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(Math.floor(x - this.ctx.camera.x), Math.floor(y - this.ctx.camera.y));
        this.context.lineTo(Math.floor(x - this.ctx.camera.x + (Math.cos(radians) * length)), Math.floor(y - this.ctx.camera.y + (Math.sin(radians) * length)));
        this.context.stroke();
    }

    drawImage(x: number, y: number, textureX: number, textureY: number, width: number = WorldManager.GRID_SIZE, height: number = WorldManager.GRID_SIZE, scaleX: number = 1.0, scaleY: number = 1.0): void 
    {
        this.context.imageSmoothingEnabled = false;
        this.context.save();
        this.context.translate(Math.floor(x - this.ctx.camera.x) + (scaleX < 0 ? width : 0), Math.floor(y - this.ctx.camera.y));
        this.context.scale(scaleX, scaleY);
        this.context.drawImage(this.ctx.atlas.texture, textureX * TextureAtlas.GRID_SIZE, textureY * TextureAtlas.GRID_SIZE, TextureAtlas.GRID_SIZE, TextureAtlas.GRID_SIZE, 0, 0, width, height);
        this.context.restore();
    }

    drawRotatedImage(x: number, y: number, textureX: number, textureY: number, radians: number, width: number = WorldManager.GRID_SIZE, height: number = WorldManager.GRID_SIZE): void
    {
        this.context.imageSmoothingEnabled = false;
        this.context.save();
        this.context.translate(x - this.ctx.camera.x, y - this.ctx.camera.y);
        this.context.rotate(radians);
        this.context.drawImage(this.ctx.atlas.texture, textureX * TextureAtlas.GRID_SIZE, textureY * TextureAtlas.GRID_SIZE, TextureAtlas.GRID_SIZE, TextureAtlas.GRID_SIZE, -width * 0.5, -height * 0.5, width, height);
        this.context.restore();
    }

    getPattern(x: number, y: number): CanvasPattern
    {
        const key = `${x}x${y}`;

        if (!this.patternCache.get(key)) 
        {
            const patternCanvas = document.createElement(`canvas`);
            patternCanvas.width = WorldManager.GRID_SIZE;
            patternCanvas.height = WorldManager.GRID_SIZE;

            const patternContext = patternCanvas.getContext(`2d`)!;
            patternContext.imageSmoothingEnabled = false;
            patternContext.drawImage(
                this.ctx.atlas.texture,
                x * TextureAtlas.GRID_SIZE,
                y * TextureAtlas.GRID_SIZE,
                TextureAtlas.GRID_SIZE,
                TextureAtlas.GRID_SIZE,
                0,
                0,
                WorldManager.GRID_SIZE,
                WorldManager.GRID_SIZE
            );

            const pattern = this.context.createPattern(patternCanvas, `repeat`)!;
            this.patternCache.set(key, pattern);
        }

        return this.patternCache.get(key)!;
    }

    drawRepeatingImage(x: number, y: number, textureX: number, textureY: number, width: number = WorldManager.GRID_SIZE, height: number = WorldManager.GRID_SIZE): void
    {
        const pattern = this.getPattern(textureX, textureY);
        this.context.save();
        this.context.translate(Math.floor(x - this.ctx.camera.x), Math.floor(y - this.ctx.camera.y));
        this.context.fillStyle = pattern;
        this.context.fillRect(0, 0, width, height);
        this.context.restore();
    };
}

import { IGameContext } from "../Data/IGameContext";
import { TextureAtlas } from "./AtlasManager";
import { WorldManager } from "./WorldManager";