//
// File: IGameContext.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export interface IGameContext
{
    time: IGameTime;

    game: GameManager;
    loader: AssetLoader;
    atlas: TextureAtlas;
    audio: AudioManager;
    camera: CameraManager;
    canvas: CanvasManager;
    input: InputManager;
    debug: DebugManager;
    particles: ParticleManager;
    effects: EffectsManager;
    indicators: IndicatorManager;
    tiles: TileManager;
    floatingTexts: FloatingTextManager;
    messageBoxes: MessageBoxManager;
    tooltip: ItemTooltipManager;
    ui: UserInterfaceManager;
    player: PlayerManager;
    projectiles: ProjectileManager;
    gold: GoldManager;
    shopItems: ShopItemManager;
    monsters: MonsterManager;
    world: WorldManager;
}

import { AssetLoader } from "../Core/AssetLoader";
import { TextureAtlas } from "../Managers/AtlasManager";
import { AudioManager } from "../Managers/AudioManager";
import { CameraManager } from "../Managers/CameraManager";
import { CanvasManager } from "../Managers/CanvasManager";
import { DebugManager } from "../Managers/DebugManager";
import { EffectsManager } from "../Managers/EffectManager";
import { GoldManager } from "../Managers/GoldManager";
import { IndicatorManager } from "../Managers/IndicatorManager";
import { InputManager } from "../Managers/InputManager";
import { ItemTooltipManager } from "../Managers/ItemTooltipManager";
import { MessageBoxManager } from "../Managers/MessageBoxManager";
import { MonsterManager } from "../Managers/MonsterManager";
import { ParticleManager } from "../Managers/ParticleManager";
import { PlayerManager } from "../Managers/PlayerManager";
import { ProjectileManager } from "../Managers/ProjectileManager";
import { ShopItemManager } from "../Managers/ShopItemManager";
import { FloatingTextManager } from "../Managers/FloatingTextManager";
import { TileManager } from "../Managers/TileManager";
import { UserInterfaceManager } from "../Managers/UIManager";
import { WorldManager } from "../Managers/WorldManager";
import { IGameTime } from "./IGameTime";
import { GameManager } from "../Managers/GameManager";

