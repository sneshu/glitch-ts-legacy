//
// File: AudioManager.ts
//
// Copyright (c) 2025 Sneshu. All rights reserved.
// Unauthorized copying or use of this code is prohibited.
//

export class AudioManager
{
    private readonly MAX_TRACKS: number;
    private volume: number;
    private soundAssets: Map<string, ISoundAssetData>;

    constructor()
    {
        this.MAX_TRACKS = 3;
        this.volume = 1.0;
        this.soundAssets = new Map<string, ISoundAssetData>();
        this.loadSoundAssets();
    }

    play(id: string, volume: number = 1): void
    {
        let soundAsset = this.soundAssets.get(id);
        if (!soundAsset) return;

        if (soundAsset.trackId >= soundAsset.tracks.length)
        {
            soundAsset.trackId = 0;
        }

        soundAsset.tracks[soundAsset.trackId].currentTime = 0;
        soundAsset.tracks[soundAsset.trackId].volume = Math.abs(volume) * this.volume;

        // Play the sound and switch track for the next sound
        soundAsset.tracks[soundAsset.trackId++].play();
    }

    createSoundAsset(id: string, path: string): void
    {
        const soundAsset = { trackId: 0, tracks: new Array<HTMLAudioElement>() } as ISoundAssetData;
       
        for (let i = 0; i < this.MAX_TRACKS; i++)
        {      
            const track = new Audio(path);
            soundAsset.tracks.push(track);
        }

        this.soundAssets.set(id, soundAsset);
    }

    loadSoundAssets(): void
    {
        this.createSoundAsset(`pick-up`, `Assets/Audio/A_Pickup.wav`);
        this.createSoundAsset(`fleshsplosion`, `Assets/Audio/A_Fleshsplosion.ogg`);
        this.createSoundAsset(`hit-a`, `Assets/Audio/A_HitA.wav`);
        this.createSoundAsset(`hit-b`, `Assets/Audio/A_HitB.wav`);
        this.createSoundAsset(`jump`, `Assets/Audio/A_Jump.ogg`);
        this.createSoundAsset(`hard-landing`, `Assets/Audio/A_HardLanding.ogg`);
        this.createSoundAsset(`magic-cast`, `Assets/Audio/A_MagicCast.ogg`);
        this.createSoundAsset(`slash-a`, `Assets/Audio/A_SlashA.wav`);
        this.createSoundAsset(`slash-b`, `Assets/Audio/A_SlashB.wav`);
        this.createSoundAsset(`step`, `Assets/Audio/A_Step.wav`);
        this.createSoundAsset(`swing`, `Assets/Audio/A_Swing.ogg`);
    }
}

import { ISoundAssetData } from "../Data/ISoundAssetData";