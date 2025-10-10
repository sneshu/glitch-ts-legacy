//
// File: GameManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class GameManager
{
    private time: IGameTime;
    private lastTime: number;
    private ctx: IGameContext;
    private bestScore: number;

    private loopBinding = this.loop.bind(this);

    constructor()
    {
        this.lastTime = performance.now();
        this.time = {} as IGameTime;
        
        this.ctx = {} as IGameContext;
        this.ctx.game = this;
        this.ctx.loader = new AssetLoader();
        this.ctx.atlas = new TextureAtlas(this.ctx.loader);
        this.ctx.audio = new AudioManager();
        this.ctx.camera = new CameraManager(this.ctx);
        this.ctx.canvas = new CanvasManager(this.ctx);
        this.ctx.input = new InputManager();
        this.ctx.debug = new DebugManager(this.ctx);
        this.ctx.particles = new ParticleManager(this.ctx);
        this.ctx.effects = new EffectsManager(this.ctx)
        this.ctx.indicators = new IndicatorManager(this.ctx);
        this.ctx.tiles = new TileManager(this.ctx)
        this.ctx.floatingTexts = new FloatingTextManager(this.ctx);
        this.ctx.messageBoxes = new MessageBoxManager(this.ctx);
        this.ctx.tooltip = new ItemTooltipManager(this.ctx);
        this.ctx.ui = new UserInterfaceManager(this.ctx);
        this.ctx.player = new PlayerManager(this.ctx);
        this.ctx.projectiles = new ProjectileManager(this.ctx);
        this.ctx.gold = new GoldManager(this.ctx);
        this.ctx.shopItems = new ShopItemManager(this.ctx);
        this.ctx.monsters = new MonsterManager(this.ctx);
        this.ctx.world = new WorldManager(this.ctx);

        this.bestScore = 0;

        this.ctx.world.generate();
        this.ctx.player.findSpawnPosition();
        this.loadBestScore();
        this.showGameTitle();
        this.loopBinding(); 
    }

    setBestScore(score: number): void
    {
        this.bestScore = score;
        localStorage.setItem(`bestScore`, score.toString());
    }

    private loadBestScore(): void
    {
        try
        {
            this.bestScore = parseInt(localStorage.getItem(`bestScore`) ?? `0`);
        }
        catch(e) 
        {
            localStorage.clear();
            this.restart();
        }
    }

    getBestScore(): number
    {
        return this.bestScore;
    }

    showGameTitle(): void
    {
        // Title text
        this.ctx.floatingTexts.add({ x: this.ctx.player.x, y: 80, content: `Glitch`, textSize: 48 });
        this.ctx.floatingTexts.add({ x: this.ctx.player.x, y: 120, content: `made by Sneshu`, textSize: 24 });
        // Tutorial text
        this.ctx.messageBoxes.add({ 
            x: this.ctx.player.x, 
            y: 148, 
            lines: [
                { content: `[W], [D] to move;`, color: `white` }, 
                { content: `[Space] to double-jump;`, color: `white` }, 
                { content: `[S] to drop down;`, color: `white` }, 
                { content: `Good luck!`, color: `rgb(0, 220, 50)` }, 
                { content: ``, color: `white` }, 
                { content: `Best score: ${this.bestScore}`, color: `rgb(0, 200, 250)` } 
            ]
        });
    }

    private calculateTime(): void
    {
        const now = performance.now();
        this.time.deltaTime = (now - this.lastTime) * 0.001;
        this.time.runTime = now * 0.001;
        this.lastTime = now;
    }

    loop(): void
    {
        if (this.ctx.loader && !this.ctx.loader.isAppReady) 
        {
            requestAnimationFrame(this.loopBinding);
            return;
        }

        this.calculateTime();

        // Other calculations
        this.ctx.input.update();
        this.ctx.debug.update(this.time);
        this.ctx.world.generate();
        this.ctx.tiles.update();
        this.ctx.gold.update();
        this.ctx.monsters.update(this.time);
        this.ctx.particles.update(this.time);
        this.ctx.projectiles.update(this.time);
        this.ctx.indicators.update(this.time);
        this.ctx.floatingTexts.update();
        this.ctx.shopItems.update();
        this.ctx.messageBoxes.update();
        this.ctx.player.checkCollision(this.time);
        this.ctx.player.getUserInput(this.time);
        this.ctx.player.updateMovement(this.time);
        this.ctx.player.updateAnimation(this.time);
        this.ctx.player.updateCombatStats(this.time);
        this.ctx.camera.update(this.time);
        this.ctx.camera.updatePosition();

        // Clear screen
        this.ctx.canvas.clear(); 

        // Rendering / layering
        this.ctx.tiles.draw();
        this.ctx.gold.draw(this.time);
        this.ctx.monsters.draw();
        this.ctx.floatingTexts.draw();
        this.ctx.shopItems.draw(this.time);
        this.ctx.particles.draw();
        this.ctx.player.draw();
        this.ctx.projectiles.draw();
        this.ctx.indicators.draw();
        this.ctx.messageBoxes.draw();
        this.ctx.tooltip.draw();
        this.ctx.ui.draw(); 
        
        requestAnimationFrame(this.loopBinding);
    }

    restart(): void
    {
        location.reload();
    }
}

import { AssetLoader } from "../Core/AssetLoader";
import { IGameContext } from "../Data/IGameContext";
import { IGameTime } from "../Data/IGameTime";
import { TextureAtlas } from "./AtlasManager";
import { AudioManager } from "./AudioManager";
import { CameraManager } from "./CameraManager";
import { CanvasManager } from "./CanvasManager";
import { DebugManager } from "./DebugManager";
import { EffectsManager } from "./EffectManager";
import { FloatingTextManager } from "./FloatingTextManager";
import { GoldManager } from "./GoldManager";
import { IndicatorManager } from "./IndicatorManager";
import { InputManager } from "./InputManager";
import { ItemTooltipManager } from "./ItemTooltipManager";
import { MessageBoxManager } from "./MessageBoxManager";
import { MonsterManager } from "./MonsterManager";
import { ParticleManager } from "./ParticleManager";
import { PlayerManager } from "./PlayerManager";
import { ProjectileManager } from "./ProjectileManager";
import { ShopItemManager } from "./ShopItemManager";
import { TileManager } from "./TileManager";
import { UserInterfaceManager } from "./UIManager";
import { WorldManager } from "./WorldManager";

