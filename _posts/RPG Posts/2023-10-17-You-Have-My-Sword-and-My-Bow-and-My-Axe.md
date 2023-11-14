---
layout: post

title: "The Comprehensive Guide to Weapon Mechanics in Tabletop RPGs"
title-url: 
subtitle: "From Melee to Cosmic: Understanding Weapon Attributes, Types, and Classifications"
subtitle-url: 
quote: "Your choice of weapon is more than a damage dealer; it's a narrative tool."
excerpt: "This exhaustive guide covers every conceivable weapon property and classification from melee to cosmic weaponry. Whether you're a player or a game master, this is your go-to resource."
source: Ted Tschopp's Blog
source-url: 
call-to-action: 

date: 2023-10-17 20:20:08
update:
author:
    avatar: https://secure.gravatar.com/avatar/a76b4d6291cecb3a738896a971bfb903?s=512&d=mp&r=g
    name: Ted Tschopp
    url: https://tedt.org/

bullets:
  - "Weapon Properties"
  - "Range vs. Melee Weapons"
  - "Weapon Materials"
  - "Damage Types"
  - "Weapon Classifications"

description: "A comprehensive guide to understanding weapon mechanics in the Märchen Engine, covering properties, materials, damage types, and classifications."
seo-description: "Master weapon mechanics in the Märchen Engine with our exhaustive guide covering everything from properties to cosmic-level classifications."

categories:
  - Draft
  - Role Playing Games
  - The Märchen Engine
tags:
  - RPG
  - Weapons
  - Game Mechanics
keywords:
  - Weapon Mechanics
  - RPG Weapons
  - Game Master Guide

draft-status: Integration

location:
    name: Bradbury, CA
coordinates:
    latitude: 34.1470
    longitude: -117.9709

image: /img/2023-10-17/A_blacksmith_making_weapons_in_a_hollowed_out_tree.png
image-alt: A blacksmith making fictional weapons.
image-author: Ted Tschopp
image-author-URL: https://tedt.org/
image-credits:
image-credits-URL:
image-credits-artist:
image-credits-artist-URL:
image-credits-title:
image-description: "A blacksmith making fictional weapons."
image-title: "Warcraft"

monster-or-magical-or-religious-ideas:
year-the-event-took-place:


mathjax: false

order:
---

- [Introduction](#introduction)
  - [Range Weapons](#range-weapons)
    - [Thrown Weapons](#thrown-weapons)
    - [Missile Weapons](#missile-weapons)
      - [Ammunition](#ammunition)
        - [Running Out of Ammunition](#running-out-of-ammunition)
      - [Range](#range)
      - [Loading (#)](#loading-)
      - [Reload (## shots, time)](#reload--shots-time)
      - [Aim / Rate / Reload from Source 2](#aim--rate--reload-from-source-2)
      - [Auto-Fire](#auto-fire)
      - [Double-Shot](#double-shot)
        - [Rules missing that are needed](#rules-missing-that-are-needed)
      - [Spray](#spray)
      - [Flight Path](#flight-path)
      - [Scope -- Merged from Source 2](#scope----merged-from-source-2)
      - [Area (Radius)](#area-radius)
      - [Blast from source 2](#blast-from-source-2)
      - [Explosive (X)](#explosive-x)
      - [High-Explosive (X)](#high-explosive-x)
      - [Misfire from Source 2](#misfire-from-source-2)
  - [Melee Weapons Overview](#melee-weapons-overview)
    - [Melee Weapons](#melee-weapons)
    - [Armor Penetration - AP (#)](#armor-penetration---ap-)
    - [Awkward (#)](#awkward-)
    - [Barbed](#barbed)
    - [Brace - Merged from Source 2](#brace---merged-from-source-2)
    - [Bulky](#bulky)
    - [Brutal - Merged from Source 2](#brutal---merged-from-source-2)
    - [Charge (XX) - Merged from Source 2](#charge-xx---merged-from-source-2)
    - [Crit (#) - Skipped needs to look at](#crit----skipped-needs-to-look-at)
    - [Crushing - Merged from Source 2](#crushing---merged-from-source-2)
    - [Damage Over Time (Time)](#damage-over-time-time)
    - [Deadly - Merged from Source 2](#deadly---merged-from-source-2)
    - [Defensive (#)](#defensive-)
    - [Disarming Rule](#disarming-rule)
    - [Double](#double)
    - [Entangling](#entangling)
    - [Fast Toggle (Timeframe)](#fast-toggle-timeframe)
    - [Fast Draw (Timeframe)](#fast-draw-timeframe)
    - [Finesse](#finesse)
    - [Fragile/Scrap](#fragilescrap)
    - [Gear Bonus(+/- #)](#gear-bonus--)
    - [Handed (x)](#handed-x)
      - [Two-Handed](#two-handed)
    - [Heavy](#heavy)
    - [Knock-out -- Merged from Source 2](#knock-out----merged-from-source-2)
    - [Light](#light)
    - [Mass Produced](#mass-produced)
    - [Masterwork Rule](#masterwork-rule)
    - [Operators Rule (#)](#operators-rule-)
    - [One Use Weapons](#one-use-weapons)
    - [Quick Draw](#quick-draw)
    - [Reach Weapons](#reach-weapons)
    - [Readied Weapons](#readied-weapons)
    - [Reliable Weapons](#reliable-weapons)
    - [Serrated](#serrated)
    - [Shield Grappler -- Merged from Source 2](#shield-grappler----merged-from-source-2)
    - [Silent](#silent)
    - [Slow](#slow)
    - [Smart -- Merged from Source 2](#smart----merged-from-source-2)
    - [Specialized -- Merged from Source 2](#specialized----merged-from-source-2)
    - [Splash X -- Merged from Source 2](#splash-x----merged-from-source-2)
    - [Stealth -- Merged fom Source 2](#stealth----merged-fom-source-2)
    - [Strangle -- Merged from Source 2](#strangle----merged-from-source-2)
    - [Stun](#stun)
    - [Thermal Sweep](#thermal-sweep)
    - [Tiny](#tiny)
    - [Toggle (#)](#toggle-)
    - [Tripping](#tripping)
    - [Unbalancing](#unbalancing)
    - [Versatile](#versatile)
    - [Very Bulky](#very-bulky)
    - [Wrap-Around](#wrap-around)
    - [Zero-G -- Merged from Source 2](#zero-g----merged-from-source-2)
  - [Weapon Construction Materials from Gamma World to 5th Edition D\&D](#weapon-construction-materials-from-gamma-world-to-5th-edition-dd)
    - [Stone Weapons](#stone-weapons)
    - [Bone (Horn, shell, and ivory) Weapons](#bone-horn-shell-and-ivory-weapons)
    - [Unworked Wooden Weapons](#unworked-wooden-weapons)
    - [Bronze (Brass, Copper, or Tin) Weapons](#bronze-brass-copper-or-tin-weapons)
    - [Iron](#iron)
    - [Steel](#steel)
    - [Synthetic Metal (Durasteel, Plasteel, Duralloy, Titanium Alloy)](#synthetic-metal-durasteel-plasteel-duralloy-titanium-alloy)
    - [Synthetic Crystal (Ceramic, Diamond, Crysteel, Glassteel)](#synthetic-crystal-ceramic-diamond-crysteel-glassteel)
    - [Weapon Size Increases](#weapon-size-increases)
    - [Weapon Size Decreases](#weapon-size-decreases)
  - [Damage Type](#damage-type)
    - [Acid Damage](#acid-damage)
      - [Acid Damage in Fantasy Settings](#acid-damage-in-fantasy-settings)
      - [Acid Damage in Sci-Fi Settings](#acid-damage-in-sci-fi-settings)
      - [Acid Damage in Modern or Urban Fantasy Settings](#acid-damage-in-modern-or-urban-fantasy-settings)
      - [Acid Damage in Horror Settings](#acid-damage-in-horror-settings)
      - [Acid Damage in Historical Settings](#acid-damage-in-historical-settings)
      - [Acid Damage in Post-Apocalyptic Settings](#acid-damage-in-post-apocalyptic-settings)
      - [Acid Damage in Steampunk Settings](#acid-damage-in-steampunk-settings)
    - [Bludgeoning Damage](#bludgeoning-damage)
      - [Bludgeoning Damage in Fantasy Settings](#bludgeoning-damage-in-fantasy-settings)
      - [Bludgeoning Damage in Sci-Fi Settings](#bludgeoning-damage-in-sci-fi-settings)
      - [Bludgeoning Damage in Modern or Urban Fantasy Settings](#bludgeoning-damage-in-modern-or-urban-fantasy-settings)
      - [Bludgeoning Damage in Horror Settings](#bludgeoning-damage-in-horror-settings)
      - [Bludgeoning Damage in Historical Settings](#bludgeoning-damage-in-historical-settings)
      - [Bludgeoning Damage in Post-Apocalyptic Settings](#bludgeoning-damage-in-post-apocalyptic-settings)
      - [Bludgeoning Damage in Steampunk Settings](#bludgeoning-damage-in-steampunk-settings)
    - [Cold Damage](#cold-damage)
      - [Cold Damage in Fantasy Settings](#cold-damage-in-fantasy-settings)
      - [Cold Damage in Sci-Fi Settings](#cold-damage-in-sci-fi-settings)
      - [Cold Damage in Modern or Urban Fantasy Settings](#cold-damage-in-modern-or-urban-fantasy-settings)
      - [Cold Damage in Horror Settings](#cold-damage-in-horror-settings)
      - [Cold Damage in Historical Settings](#cold-damage-in-historical-settings)
      - [Cold Damage in Post-Apocalyptic Settings](#cold-damage-in-post-apocalyptic-settings)
      - [Cold Damage in Steampunk Settings](#cold-damage-in-steampunk-settings)
    - [Fire Damage](#fire-damage)
      - [Fire Damage in Fantasy Settings](#fire-damage-in-fantasy-settings)
      - [Fire Damage in Sci-Fi Settings](#fire-damage-in-sci-fi-settings)
      - [Fire Damage in Modern or Urban Fantasy Settings](#fire-damage-in-modern-or-urban-fantasy-settings)
      - [Fire Damage in Horror Settings](#fire-damage-in-horror-settings)
      - [Fire Damage in Historical Settings](#fire-damage-in-historical-settings)
      - [Fire Damage in Post-Apocalyptic Settings](#fire-damage-in-post-apocalyptic-settings)
      - [Fire Damage in Steampunk Settings](#fire-damage-in-steampunk-settings)
    - [Force Damage](#force-damage)
      - [Force Damage in Fantasy Settings Settings](#force-damage-in-fantasy-settings-settings)
      - [Force Damage in Sci-Fi Settings Settings](#force-damage-in-sci-fi-settings-settings)
      - [Force Damage in Modern or Urban Fantasy Settings](#force-damage-in-modern-or-urban-fantasy-settings)
      - [Force Damage in Horror Settings](#force-damage-in-horror-settings)
      - [Force Damage in Historical Settings](#force-damage-in-historical-settings)
      - [Force Damage in Post-Apocalyptic Settings](#force-damage-in-post-apocalyptic-settings)
      - [Force Damage in Steampunk Settings](#force-damage-in-steampunk-settings)
    - [Electrical Damage](#electrical-damage)
      - [Electrical Damage in Fantasy Settings Settings](#electrical-damage-in-fantasy-settings-settings)
      - [Electrical Damage in Sci-Fi Settings Settings](#electrical-damage-in-sci-fi-settings-settings)
      - [Ion Damage](#ion-damage)
      - [Electrical Damage in Modern or Urban Fantasy Settings](#electrical-damage-in-modern-or-urban-fantasy-settings)
      - [Electrical Damage in Horror Settings](#electrical-damage-in-horror-settings)
      - [Electrical Damage in Historical Settings](#electrical-damage-in-historical-settings)
      - [Electrical Damage in Post-Apocalyptic Settings](#electrical-damage-in-post-apocalyptic-settings)
      - [Electrical Damage in Steampunk Settings](#electrical-damage-in-steampunk-settings)
    - [Radiation Damage](#radiation-damage)
      - [Radiation Damage in Fantasy Settings](#radiation-damage-in-fantasy-settings)
      - [Radiation Damage in Sci-Fi Settings](#radiation-damage-in-sci-fi-settings)
      - [Radiation Damage in Modern or Urban Fantasy Settings](#radiation-damage-in-modern-or-urban-fantasy-settings)
      - [Radiation Damage in Horror Settings](#radiation-damage-in-horror-settings)
      - [Radiation Damage in Historical Settings](#radiation-damage-in-historical-settings)
      - [Radiation Damage in Post-Apocalyptic Settings](#radiation-damage-in-post-apocalyptic-settings)
      - [Radiation Damage in Steampunk Settings](#radiation-damage-in-steampunk-settings)
    - [Piercing Damage](#piercing-damage)
      - [Piercing Damage in Fantasy Settings](#piercing-damage-in-fantasy-settings)
      - [Piercing Damage in Sci-Fi Settings](#piercing-damage-in-sci-fi-settings)
      - [Piercing Damage in Modern or Urban Fantasy Settings](#piercing-damage-in-modern-or-urban-fantasy-settings)
      - [Piercing Damage in Horror Settings](#piercing-damage-in-horror-settings)
      - [Piercing Damage in Historical Settings](#piercing-damage-in-historical-settings)
      - [Piercing Damage in Post-Apocalyptic Settings](#piercing-damage-in-post-apocalyptic-settings)
      - [Piercing Damage in Steampunk Settings](#piercing-damage-in-steampunk-settings)
        - [Ballistic (Type)](#ballistic-type)
        - [Additional Rules needed?](#additional-rules-needed)
    - [Poison Damage](#poison-damage)
      - [Poison Damage in Fantasy Settings](#poison-damage-in-fantasy-settings)
      - [Poison Damage in Sci-Fi Settings](#poison-damage-in-sci-fi-settings)
      - [Poison Damage in Modern or Urban Fantasy Settings](#poison-damage-in-modern-or-urban-fantasy-settings)
      - [Poison Damage in Horror Settings](#poison-damage-in-horror-settings)
      - [Poison Damage in Historical Settings](#poison-damage-in-historical-settings)
      - [Poison Damage in Post-Apocalyptic Settings](#poison-damage-in-post-apocalyptic-settings)
      - [Poison Damage in Steampunk Settings](#poison-damage-in-steampunk-settings)
    - [Mental Damage](#mental-damage)
      - [Mental Damage in Fantasy Settings](#mental-damage-in-fantasy-settings)
      - [Mental Damage in Sci-Fi Settings](#mental-damage-in-sci-fi-settings)
      - [Mental Damage in Modern or Urban Fantasy](#mental-damage-in-modern-or-urban-fantasy)
      - [Mental Damage in Horror](#mental-damage-in-horror)
      - [Mental Damage in Historical](#mental-damage-in-historical)
      - [Mental Damage in Post-Apocalyptic](#mental-damage-in-post-apocalyptic)
      - [Mental Damage in Steampunk](#mental-damage-in-steampunk)
    - [Mystical Damage](#mystical-damage)
      - [Mystical Damage in Fantasy Settings](#mystical-damage-in-fantasy-settings)
      - [Mystical Damage in Sci-Fi Settings](#mystical-damage-in-sci-fi-settings)
      - [Mystical Damage in Modern or Urban Fantasy Settings](#mystical-damage-in-modern-or-urban-fantasy-settings)
      - [Mystical Damage in Horror Settings](#mystical-damage-in-horror-settings)
      - [Mystical Damage in Historical Settings](#mystical-damage-in-historical-settings)
      - [Mystical Damage in Post-Apocalyptic Settings](#mystical-damage-in-post-apocalyptic-settings)
      - [Mystical Damage in Steampunk Settings](#mystical-damage-in-steampunk-settings)
    - [Radiant Damage](#radiant-damage)
      - [Radiant Damage in Fantasy Settings](#radiant-damage-in-fantasy-settings)
      - [Radiant Damage in Sci-Fi Settings](#radiant-damage-in-sci-fi-settings)
      - [Radiant Damage in Modern or Urban Fantasy Settings](#radiant-damage-in-modern-or-urban-fantasy-settings)
      - [Radiant Damage in Horror Settings](#radiant-damage-in-horror-settings)
      - [Radiant Damage in Historical Settings](#radiant-damage-in-historical-settings)
      - [Radiant Damage in Post-Apocalyptic Settings](#radiant-damage-in-post-apocalyptic-settings)
      - [Radiant Damage in Steampunk Settings](#radiant-damage-in-steampunk-settings)
    - [Slashing Damage](#slashing-damage)
      - [Slashing Damage in Fantasy Settings](#slashing-damage-in-fantasy-settings)
      - [Slashing Damage in Sci-Fi Settings](#slashing-damage-in-sci-fi-settings)
      - [Slashing Damage in Modern or Urban Fantasy Settings](#slashing-damage-in-modern-or-urban-fantasy-settings)
      - [Slashing Damage in Horror Settings](#slashing-damage-in-horror-settings)
      - [Slashing Damage in Historical Settings](#slashing-damage-in-historical-settings)
      - [Slashing Damage in Post-Apocalyptic Settings](#slashing-damage-in-post-apocalyptic-settings)
      - [Slashing Damage in Steampunk Settings](#slashing-damage-in-steampunk-settings)
    - [Social Damage](#social-damage)
      - [Social Damage in Fantasy Settings Settings](#social-damage-in-fantasy-settings-settings)
      - [Social Damage in Sci-Fi Settings Settings](#social-damage-in-sci-fi-settings-settings)
      - [Social Damage in Modern or Urban Fantasy Settings](#social-damage-in-modern-or-urban-fantasy-settings)
      - [Social Damage in Horror Settings](#social-damage-in-horror-settings)
      - [Social Damage in Historical Settings](#social-damage-in-historical-settings)
      - [Social Damage in Post-Apocalyptic Settings](#social-damage-in-post-apocalyptic-settings)
      - [Social Damage in Steampunk Settings](#social-damage-in-steampunk-settings)
    - [Sonic Damage](#sonic-damage)
      - [Sonic Damage in Fantasy Settings](#sonic-damage-in-fantasy-settings)
      - [Sonic Damage in Sci-Fi Settings](#sonic-damage-in-sci-fi-settings)
      - [Sonic Damage in Modern or Urban Fantasy Settings](#sonic-damage-in-modern-or-urban-fantasy-settings)
      - [Sonic Damage in Horror Settings](#sonic-damage-in-horror-settings)
      - [Sonic Damage in Historical Settings](#sonic-damage-in-historical-settings)
      - [Sonic Damage in Post-Apocalyptic Settings](#sonic-damage-in-post-apocalyptic-settings)
      - [Sonic Damage in Steampunk Settings](#sonic-damage-in-steampunk-settings)
  - [Weapon Classifications](#weapon-classifications)
    - [Vehicle Weaponry](#vehicle-weaponry)
      - [Damage and Effects](#damage-and-effects)
    - [Strategic Weaponry](#strategic-weaponry)
    - [Planetary Weaponry](#planetary-weaponry)
    - [Stellar Weaponry](#stellar-weaponry)
    - [Galactic Weaponry](#galactic-weaponry)
    - [Cosmic Weaponry](#cosmic-weaponry)
  - [Weapon Properties from Gamma World conversion to 6e](#weapon-properties-from-gamma-world-conversion-to-6e)

# Introduction

In the expansive universe of tabletop role-playing games, your choice of weapon is more than a mere instrument of destruction; it's a narrative tool, an extension of your character's personality, history, and aspirations. Whether it's a rustic blade handed down through generations or a state-of-the-art laser cannon with cosmic capabilities, each weapon carries its own set of features, mechanics, and lore that can profoundly impact how your character interacts with the game world. 

This exhaustive guide aims to be your definitive resource for understanding those complex intricacies. Covering every conceivable weapon property and classification from the simplest melee instruments to sophisticated cosmic weaponry, this compendium is tailored to cater to both newcomers and seasoned veterans of tabletop gaming. Whether you're a player seeking to optimize your character build or a game master aiming to design balanced and engaging combat scenarios, this guide is your go-to resource. Dive deep into weapon attributes, material compositions, damage types, and many more categories that add layers of strategy and storytelling to your gaming experience.

It's important to note that this guide is very much a work in progress, a living document that continues to evolve. The content is culled from an extensive range of rules, documents, and materials I've written over the years, each contributing to the rich tapestry of information presented here. From various homebrew rules to meticulously researched data, this compilation aims to create a harmonious blend of different systems and philosophies. Your feedback and contributions are not just welcome but highly encouraged, as the goal is to make this a collaborative and comprehensive resource for the entire gaming community.

## Range Weapons

### Thrown Weapons

These are weapons designed to be thrown with one hand, offering a versatile approach to combat.

- **Primary Attribute for Attack Rolls**: Thrown weapons the Muscle Characteristic to determine range.
- **Alternate Attribute for Melee-Capable Weapons**: If the thrown weapon can also be used in melee and does not have the Finesse quality, players have the option to use the character Fitness (minimum of 1) attribute for damage.
- **Specialization and Skill Use**: If a character has a a skill in Ranged Combat, with a focus on throwing weapons, or Athletics with a specialization in throwing objects, this can be used in place of the Muscle Score to determine Range.

### Missile Weapons

These weapons are designed to be thrown or fired, suitable for combat at distances greater than 5 feet. A weapon in this category has the following traits:

- **Ranged Combat**: Effective at distances greater than 5 feet.
  
#### Ammunition

- With each attack, you must spend one (or more) pieces of ammunition.  -- Change rule to roll the dice associated with the ammo
- Some ammunition can be used as an improvised weapon.
- Reloading ammunition requires two hands, even if the weapon itself can be fired with one.
- You typically recover half of your ammunition spent after a battle. (No ammunition is recovered from firearms or energy weapons).
- In the Weapon Stats List, damage listed for variant ammunition modifies the damage given for standard ammunition.

##### Running Out of Ammunition

- Six-shooters run out of ammunition on a failed roll that includes any 1's showing on the dice.
- Many-shot weapons run out or overheat on a failed roll that includes two or more 1's showing on the dice.

**Special Cases:**

1. If you roll a 1 on an ability dice (or equivalent), treat it as a critical failure, which may include running out of ammo or overheating, depending on the GM's discretion.
2. If you roll a 2 on an attack roll, your weapon runs out or overheats, unless a 1 is also showing, in which case refer to the special case #1.

#### Range

| Märchen Range Category   | Description                               | Traditional Range category | Distance in meters      | Distance in feet       | Distance in 'squares'/inches minis scale | Other                                                                                                      |
|--------------------------|-------------------------------------------|----------------------------|-------------------------|------------------------|------------------------------------------|------------------------------------------------------------------------------------------------------------|
| I can touch it           | Immediate physical interaction            | Close Range                | up to about 2 meters    | up to about 5 feet.    | 1 square                                 | (Also referred to as adjacent or immediate)                                                                |
| I can reach it           | Quick movement or extended reach          | Near Range                 | up to about 10 meters   | up to about 30 feet    | 6 squares                                | (Typical movement rate for many games)                                                                     |
| I can catch it           | Sprinting to get to a stationary object   | Short Range                | up to about 20 meters   | up to about 60 feet    | 12 squares                               | (A typical double move action or run movement)                                                             |
| I can hit it with a rock | Distance for throwing objects             | Medium Range               | up to about 40 meters   | up to about 120 feet   | 24 squares                               | (Typical long range weapon attack)                                                                         |
| I can see it             | Clear visibility, but too far to interact | Long Range                 | up to about 100 meters  | up to about 300 feet   | 60 squares                               | (A typical long range spell attack or high tech weapon)                                                    |
| I can hear it            | Audible but too far for visual contact    | Extreme                    | up to about 1 kilometer | up to about 3,000 feet | 600 squares                              | (Basically anything beyond Long range, within eyesight, and reasonable distance for the given weapon used) |
{: .well .table .table-striped }

**Range Categories and Penalties**  
Weapons have specified ranges, divided into categories as above. Each category has associated modifiers for attack rolls. Attacks can be made beyond the weapons stated range, increase the difficulty. The following traits apply:

- **Standard Range**: Attacks made within the weapon's specified range face no penalties.

- **Beyond Range**:
  - For every additional range category beyond the initial one, impose a -2 penalty to the attack roll.
  - You may attempt an attack one range category beyond the listed maximum, but the attack roll suffers a -3 penalty.

- **Close Quarters**:
  - Attacking with a ranged weapon while a threatening enemy is within close range (5 feet or less) imposes a disadvantage penalty on your attack roll.
  - If you are engaged in melee combat and attempt a ranged attack, suffer a -3 penalty.

#### Loading (#)

This property applies to slow-loading weapons like crossbows, black powder firearms, and siege weapons.

1. **Rate of Fire**: You can only fire one piece of ammunition or make a single attack with this weapon per round, irrespective of the number of attacks or actions you have available.
2. **Two-Handed Loading**: It requires both hands to load the weapon, leaving you unable to use other weapons or items while loading.
3. **Loading Time**: The symbol "#" represents the number of actions required to reload the weapon. For instance, Loading (2) means it takes two actions to reload the weapon.
4. **Teamwork**:  For weapons that have enough space to work around that require extensive loading time, multiple characters can contribute actions to speed up the reloading process. Each contributing character must also use both hands to assist in the loading. And each character takes up space around the weapon itself.
5. **Restrictions**:  Firing and reloading this weapon takes precedence over any multi-attack features or abilities you may have. The Loading (#) property restricts you to single attacks per round even if your character normally can attack more frequently.

#### Reload (## shots, time)

This property is for weapons that have a limited ammunition capacity and must be reloaded after expended shots. Unlike weapons with the "Loading (#)" property, these can be fired every round.

1. **Rate of Fire**:  You can fire this weapon every round, assuming it has ammunition remaining. The number represented by "#" indicates the maximum number of shots you can fire before needing to reload.
2. **Two-Handed Reloading**: Reloading this weapon requires both hands, restricting you from using other items or weapons during the reload action.
3. **Reload Time**:  The second number in the parenthesis indicates the time it takes to reload the weapon.
4. **Ammo Count**: Keep track of the number of shots fired. Once you've reached the limit indicated by "#," you must take the required action to reload the weapon before it can be used again.
5. **Restrictions**: While reloading, you cannot perform other actions that require your hands, like casting spells or using another weapon.

#### Aim / Rate / Reload from Source 2

**Aim / Rate  / Reload.** Aim is the number of actions it takes to prepare the weapon for attack.  Formally Aiming a weapon will be determined by class, proficiency and feats.  This number represents the number of actions regardless bonuses from proficiency, feats, or class that it takes to get the weapon ready to attack.

Rate of Fire is the number of actions it takes to attack with the weapon.  Some weapons may take multiple actions.  Some weapons may allow for multiple attacks per action.

Reload is the number of actions it takes to reload a ranged weapon.  Please see Weapon Properties on Ammunition and Firearms to further understand this action.

#### Auto-Fire

For modern and futuristic weapons that can unleash a hail of rounds in seconds. Most automatic weapons can also fire normal single shots. Auto-fire only weapons often have the Brace quality too. There are basically three ways to use auto-fire:

- All auto-fire attacks are ranged attack actions made at a -2 penalty.

1. **Single Target Burst**: Maximum range is Short for this attack.
2. **Area Burst**: Affects all targets that are Close to each other (typically a 2 x 2 square). Maximum range is Long for this attack.
3. **Sweep**: Starting at one target and if possible moving to others. Maximum range is Long for this attack.

- All uses consume ammunition of 10, (or run out on the numbers rolled listed below if not tracking ammo). -- Fix this

#### Double-Shot

This property is for firearms that can fire a couple of shots quickly, such as revolvers and semi-automatic weapons that are not fully automatic. In a Western setting, this is known as Double-Tap.

- **Ammunition**: Using Double-Shot doubles the amount of normal ammunition needed. If using optional rules for rolling ammunition, it increases the chance of running out by 1 step.
- **Movement Penalty**: If you move during the same round that you use Double-Shot, you suffer penalties to your attack rolls as specified below.
- **General**: You can make a Double-Shot as a free action immediately after shooting at a target, to roll a second attack against the same target. If you hit with the second roll, the target takes normal weapon damage. The damage from this second attack is not modified in any way—it is only the damage value listed for the weapon.
- **Movement Penalties**: Moving incurs a -2 penalty to both attacks.

##### Rules missing that are needed

- Ammo that can not be collected after a battle
- Ammo that can be collected and repackaged (brass shells)
- Ammo that can be used as an improvised weapon

#### Spray

This property is for weapons spreads out, increasing the chances of hitting. Often referred to as Grape weapons/shot.

- **Close Range**: When attacking a target within what is considered "normal" or "close" range for this weapon, players receive a special bonus of a flat +2 to the attack roll.
- **Beyond Close Range**: When attacking a target beyond this range, the weapon deals half damage. However, the player may choose two targets that are in close proximity to each other to attack simultaneously. The bonus gained at close range does not apply here, but the attack still benefits from the multiple target effect.

#### Flight Path

**Round Flight Path**
This property applies to specific thrown weapons, denoting a circular flight path for the projectile.

1. **Determining Flight Path**: Establish a circular flight path with the attacker and target on opposite sides of the circle. The distance between them also sets the 'width' of the flight path.
2. **Intervening Targets**:  If other creatures or solid objects lie along the flight path, they become the new target.
3. **Hit or Miss**: On a hit, the weapon lands in the target's space as usual.  On a miss, the weapon continues along the flight path if it is clear; otherwise, it targets the next creature or object in the flight path.
4. **Weapon Return**: If no targets are hit, the weapon returns to the attacker, who can spend a fast/bonus action to catch it. Otherwise, it lands within Close range of the thrower.
5. **Missed Landings**: Subtract the attacker's attack bonus from the natural roll made for the attack. The result is the number of Close range increments away the weapon lands from the thrower. If the result is zero or less, the weapon returns as described in point 4.

#### Scope -- Merged from Source 2

The weapon has been fitted with vision- enhancing sights, allowing it to put shots on target from far greater ranges. A weapon with the Scope trait ignores the rule that limits all attacks made at a range greater than 100 meters are automatically Extreme Range, so long as the character aims before shooting.

#### Area (Radius)

These weapons target everyone in the designated radius.

- Size of the area determined by weapon's Radius number.
- All targets must be withing this range of all other targets.
- Quite often a save/check can reduce the damage of area attacks.
- Area attacks typically deal damage even on a miss or if targets make a successful check/save.

#### Blast from source 2

Upon a hit, Each creature within 5 feet of the target must succeed on a DC 15 Dexterity saving throw or take the weapon's normal damage. If the weapon misses, the ammunition fails to detonate, or bounces away harmlessly before doing so.

#### Explosive (X)

This weapon has an explosive component or is otherwise able to affect targets spread across a wide area. Upon a successful attack, damage is rolled against every target within the weapon’s blast area. Dodge Reactions may not be made against a Blast weapon, but targets may dive for cover. Cover may be taken advantage of if it lies between a target and the centre of the weapon’s Blast.  Cover will reduce damage in half.  

#### High-Explosive (X)

This weapon has an explosive component or is otherwise able to affect targets spread across a wide area. Upon a successful attack, damage is rolled against every target within the weapon’s blast area. Dodge Reactions may not be made against a Blast weapon, but targets may dive for cover. Cover may be taken advantage of if it lies between a target and the centre of the weapon’s Blast.  Cover will not reduce damage from high-explosive damage. 

#### Misfire from Source 2

Whenever you make an attack roll with a firearm, and the dice roll is equal to or lower than the weapons Misfire score, the weapon misfires.  The attack misses and the weapon cannot be used again until you spend an action to try to repair it.  To repair your firearm , you must make a successful Tinker’s Tools check (DC equal to 8+ misfire score)  If your check fails, the weapon is broken and must be repaired out of combat at half the cost of the firearm.




## Melee Weapons Overview

### Melee Weapons

These weapons are specifically designed for close quarters combat. A weapon of this category has the following traits:

- **Close Quarters**: Melee weapons are effective within a 5-foot range or less.

### Armor Penetration - AP (#)

- This property is for types of weapons that slip through cracks in armor or can pound straight through a simple suit of armor.
- This value does not apply against heavily armored vehicles or heavy cover (unless the weapon also has the Anti-Vehicle property).
- The AP value is subtracted from the Armor Rating of the defender, if applicable.

### Awkward (#)

Apply this property to large tools and improvised weapons, especially those that have more than one part that can cause damage, or to weapons that have several moving parts.

- A critical fumble or equivalent negative outcome occurs when you roll a number represented by "#" or lower on the attack roll or relevant ability die.
- If you roll "#" or lower on your Ability die, reroll the die. If you roll this value again, then it is a critical miss.
- Reduce the required number of 1's by "#". For example, if typically two 1's are required for a crit fumble, a weapon with "Awkward 1" would crit fumble with any 1's showing.

### Barbed

Weapons with barbs and back-ward-facing spikes designed to stick into a target (like a harpoon).

- Weapons with this property do their normal damage when they hit.
- Weapons with this property remain attached to the target on a hit.
- Weapons with this property can be removed by the target, or a creature within Close range of them, by taking an action to remove the weapon with an Average skill check. On a successful result the barbed weapon is removed without damaging the target. On a failure, it is still removed, but the target takes damage again from weapon upon removal.
- If the attacker still wields the weapon, they can also remove it as an action. The attacker can chose if the removal will cause additional damage on removal from the target.

### Brace - Merged from Source 2

Bracing against the ground doubles damage against charging enemies.

### Bulky

This property is for high-powered weapons that require extra support to wield effectively.

- If this weapon is used standing up without a harness, stand or something else to brace with, then you suffer a -2 to your ranged combat skill.
- Bulky items count for two encumbrance slots.

### Brutal - Merged from Source 2

- If the result of the attack roll with this weapon is a Critical Sucess, the subsequent damage dealt by the weapon is doubled.
- If the result of the attack roll with this weapon is a Serendipitious Sucess, the subsequent damage dealt by the weapon is tripled.

### Charge (XX) - Merged from Source 2

When moving at least XX’ in a Ounces (⏱) and attacking doubles any damage done with a successful hit.

### Crit (#) - Skipped needs to look at

**At this stage this value only applies to Coriolis games; though I would introduce it to Mutant: Year Zero too, as it is even deadlier**.  
Where ## equals the amount of extra 6's required to deal a critical hit following a successful attack.

### Crushing - Merged from Source 2

On a critical hit vs. a target of the attacker’s size or smaller, the attacker can choose to either a) disarm the target, or b) halve the target’s movement rate.

Certainly, creating rules for damage-over-time effects like Radiation and Fire can add depth and complexity to combat scenarios. Here's an attempt to create a unified rule for such effects:

### Damage Over Time (Time)

Weapons with this property inflict damage over a period of time due to effects like Radiation, Fire, or other lingering hazards. The damage is applied at the start of each affected creature's turn.

- The weapon deals its initial damage upon a successful hit.
- The target then takes additional damage equal to half the damage taken last time frame at the start of each time frame until the damage is reduced to zero.
- The target can attempt a saving throws per the rules of the game to end the effect early.  A sucessful saving throw cuts the amount of damage done during the next time frame in half.

### Deadly - Merged from Source 2

Roll damage dice with Advantage (roll damage dice twice, and keep the higher result).

### Defensive (#)

When a weapon has the "Defensive (#)" property, it is designed to block and parry attacks more effectively.

- **Activation**: The defensive bonus is active as long as you have not used the weapon to attack during your current turn.
- **Stacking**: When wielding two defensive weapons, only the highest bonus is applied.
- **General**: Add ## to your defensive value

### Disarming Rule

You need to state you are attempting a disarm before making your attack roll.

- Your attack deals half damage.
- The target must make a Strength saving throw or equivalent, or drop their weapon. The DC for the saving throw is your attack roll result.

### Double

A weapon with the "Double" property is essentially two melee weapons joined as one.

- **Properties**: Each end retains the properties of the original weapons, except for the Two-handed property.
- **Usage**: Double weapons require two hands to use but do not have the Two-handed property. They cannot benefit from features that affect two-handed weapons, nor can weapons with the Two-handed property be given the Double property.
- **Reach**: If the weapon has the Reach property, only one attack per round can benefit from this property.
- **General**: If a character has the means to fight with two weapons, double weapons qualify. This includes benefits from talents, styles, or features related to two-weapon fighting or light-weapon fighting.
- **Special Cases**:
  - If both ends have the Light property, the weapon can be used to make a two-weapon fighting attack and benefits from the two-weapon fighting style.
  - Count as attacking with two weapons.

### Entangling

This property is for weapons that can ensnare targets, such as nets, or wrap limbs in their embrace, like bolas.

- **Restrained Condition**: On a hit, the attacker can choose to stop the target from moving (impose the restrained condition) until the target escapes.
- **Size and Form Limitations**: Targets two size categories larger than the attacker or targets with formless bodies are immune to this property.
- **Trailing Line**: For weapons with a trailing line, like the whip or harpoon, the target can move but only in the direction of the attacker. If the target remains entangled, the attacker can use their action to initiate a Strength contest and, if successful, can pull the entangled target up to 10 feet towards them.
- **Escape**: To escape, the target, or another creature within Close range, must spend an action to make a successful Strength or Dexterity check. The difficulty varies depending on the system.
- **Destroying the Weapon**: Alternatively, the entangling weapon or its trailing line can be destroyed by dealing it a certain amount of slashing damage. The weapon can only be attacked when it is restraining a target.

### Fast Toggle (Timeframe)

Many futuristic and modern weapons have different settings built into a weapon. Changing settings requires that you spend a certain amount of time making the changes.

- Changing settings requires a "Timeframe" to be spent toggling the weapon to another configuration.  

### Fast Draw (Timeframe)

Some weapons require that you spend a give time frame getting them ready for use in combat.  

- Readying this equipment requires a "Timeframe" to be spent setting up the weapon before it can be used.

### Finesse

This property is for light, fast weapons.

- **General**: When wielding a weapon with the Finesse property, you can substitute a more agile or accurate attribute (like Dexterity, Speed, Accuracy, or Agility) in place of a more strength-oriented attribute (like Strength, Might, Fighting, or Athletics) for the attack bonus and damage die.

### Fragile/Scrap
 
This property is for weapons made of brittle or less durable materials such as wood, stone, bone, or even metal weapons that are thin or improperly made. These weapons are prone to damage and may require frequent repair.

- **Reduced Armor Penetration**: All weapons with the Fragile/Scrap property halve any Armor Penetration values they may have, rounded down.
- **Wear and Tear**: Each time the weapon rolls the minimum damage value, it takes a penalty to its damage rolls. If this penalty accumulates beyond -4, the weapon is considered destroyed.
- **Repair**:  Someone with the appropriate tools and proficiency can repair the weapon. The time it takes to remove each -1 penalty is one hour per penalty point.
- **Weapon Longevity**: The threshold before the weapon is destroyed, as well as the means of repair.

### Gear Bonus(+/- #)

**For YZE games only (Coriolis & Mutant: Year Zero)**.  
Where ## equals the number of gear dice you roll for attacks.

### Handed (x)

Requires X number of hands; the character cannot use a shield unless they have an additional hand free.

#### Two-Handed

You must use two hands to use these weapons.

### Heavy

**Heavy**  
Weapons with this property are cumbersome and difficult to use under certain conditions. They are not well-suited for confined spaces, nor are they easy to wield when mounted. These weapons also prove challenging for smaller creatures.

- **Mounted or Cramped Conditions**: Using a Heavy weapon while mounted or in cramped conditions imposes penalties of -2 attack rolls.
- **Size Limitations**: Creatures smaller than the intended size category for the weapon always suffer the imposed penalties.
- **Off-Hand Restrictions**: Heavy weapons cannot be used in the off-hand.
- **Encumbrance**:  - Heavy weapons count as two items for the purpose of encumbrance calculations.

### Knock-out -- Merged from Source 2

On a critical hit, the target must save vs. paralysis or be knocked out
for 1d6 turns. The target must be the attacker’s size or smaller, and
have biological susceptibility to being rendered unconscious from blunt
trauma to the head.

### Light

**Light**  
Weapons with this property are small, easy to handle, and ideal for quick, agile combat. These weapons are beneficial for characters who prioritize speed and finesse over raw power.

- **Encumbrance**:  Light weapons count as half an item for encumbrance purposes. Two light items can fill one line of your Gear/Equipment chart.
- **Dual Wielding**: When wielding a Light weapon in one hand, you can use a bonus action to make an off-hand attack with another Light weapon. The off-hand attack does not add your ability score to its damage. 

### Mass Produced

Weapons, ammunition, tools, or armor of this quality are made quickly and with cheaper materials, often by societies that are at higher tech levels then those that introduced the item. A Mass Produced item has the following drawbacks:

- **-1 to Damage**: Subtracts -1 from all damage rolls made with this weapon. This penalty does stack with magical penalties, if the weapon is or becomes cursed.
- **-1 to Hit**: Subtracts -1 from all hit rolls made with this weapon. This penalty does stack with magical penalties, if the weapon is or becomes cursed.
- **No Choice**: The penalties to hit and damage are both automatically applied, and cannot be chosen or mitigated.
- **Limited Evolution**: Mass Produced items can never become Specialized Tools, Elite Gear, or Named Items.
- **Limited Repairability**: Mass Produced items take twice as long to repair and clean.
- **High-Tech Mass Production**: A society that is of higher tech levels than the tech level that introduced the weapon can mass produce the item. 
- **Reduced Cost**: Costing half the amount it normally would, representing the economies of scale achieved through high-tech mass production.
- **Reduced Time**: Creating a mass produced item will take half the normal amount of time.
- **Bulk Production:** When a mass-produced item is built, the process generates 2 additional items of the same type for the same production cost, representing the efficiency of mass production systems.
- **Fragile**: Due to cost-cutting measures, the mass-produced item is fragile and more susceptible to breaking.

### Masterwork Rule

Weapons of this quality are made with exceptional skill and materials. A Masterwork weapon grants the following benefits:

- **+1 to Damage**: Adds +1 to all damage rolls made with this weapon. This bonus does not stack with magical bonuses, if the weapon is or becomes magical.
- **+1 to Hit**: Adds +1 to all hit rolls made with this weapon. This bonus does not stack with magical bonuses, if the weapon is or becomes magical.
- **Exclusivity**: The person building the masterwork weapon must choose between +1 to hit or +1 to damage, but not both.
- **Greater Things to Come**: Masterwork items may become Specialized Tools, Elite Gear, or Named Items.
- **Tender Love and Care**: Typically adds an additional 1 month wage for the weapons smith of ₢ of in-game currency to the weapon's base value.

**Mass Produced.**  A society that is two tech levels higher than the tech level that introduced the weapon can mass produce weapon, ammunition, or armor.  When this is done, the weapon acts like it is fragile as well costing half the amount it costs normally.

### Operators Rule (#)

Weapons in this game may require a specific number of people to operate them effectively, especially in the case of large siege weapons or higher-tech level equipment. The "Operators" characteristic defines this requirement:

- **Single-Operator**: Weapons with this designation require only one person to operate. These are typically handheld or easily managed weapons.
- **Multi-Operator**: Weapons with this designation require more than one person to operate successfully. The specific number needed will be listed alongside the weapon's description. For example, a trebuchet might list "Operators: 3" to indicate that it requires three people for optimal use.
- **Tech-Dependent**: Higher-tech level weapons may require a larger operating crew due to their complexity. The number of operators will be listed in the weapon's description and could change depending on the tech level of the society using it.


### One Use Weapons

Weapons with this designation are engineered for a single use, expending all their energy or ammunition in one action. After use, they are rendered inoperative. The following traits apply:

- **Single Use**: Once activated, this weapon is expended and cannot be used again.
- **Expended Resources**: All ammunition or energy is used up in a single attack, making the weapon useless thereafter.
- **Disposable**: The only thing this weapon is good for after its use is as an improved weapon.

### Quick Draw

Weapons with this attribute are designed for rapid deployment, enabling the wielder to ready and use the weapon as part of the same action. The following traits apply:

- **Swift Action**: This weapon can be readied (drawn or prepared for use) as part of the same action used to attack.

### Reach Weapons

Weapons with this trait are designed to strike at enemies from a greater distance than most melee weapons. A Reach weapon has the following characteristics:

- **Extended Reach**: Adds an additional 2 meters/5 feet to your attack range when using this weapon, effectively doubling your Close range for attacks.

- **On Hold**: If armed with a Reach weapon and not surprised, you can be considered to be on hold for the purposes of attacking an advancing foe only. If someone moves within your reach, you may attack immediately.

- **Close Quarters Penalty**:
  - Attacks against foes within Close range (usually 5 feet or less) impose a specific penalty of a -2 on your attack roll:

### Readied Weapons

Weapons with this property are designed for strategic placement, generally piercing weapons that can be braced or planted in the ground for an opportunity attack.

- **Conditions for Use**: You must not have a hostile creature able to take actions within Close range of you to utilize this feature.
- **Defensive Reaction**: Once per round, if a foe tries to move into Close range with you, you can use your reaction to make a free melee attack against that target with your readied weapon.
- **Special Effects on Hit**: If your attack hits, the attack automatically deals an additional +2 damage.

### Reliable Weapons

These are weapons of exceptional quality, with intricate yet robust mechanics that minimize the chance of malfunction or failure.

- **Reduced Critical Misses**: Your negative results are still a miss, and you may not escalate a miss into a hit, however your miss is always one rank closer to the middle using a reliable weapon.
- **Negating Negative Outcomes**: If you roll and the result is a 1, you may reroll that die to negate this. If the second roll converts the result into a success, you still miss but with no negative outcomes.
- **Increased Cost for Referee Interference**: The cost for the Referee to trigger a weapon jam or similar negative effect is double for this piece of gear, making it less likely to happen.
- **Greater Things to Come**: Reliable items may become Specialized Tools, Elite Gear, or Named Items.
- **Tender Love and Care**: Typically adds an additional 1 month wage for the weapons smith of ₢ of in-game currency to the weapon's base value.

### Serrated

**Serrated**  
Weapons with this quality are designed to rip and tear through flesh, making them highly effective against unprotected or lightly armored targets. Note that this quality only applies to weapons that deal slashing damage.

- **Armor Penetration**: Weapons with this quality lose the Armor Penetration quality.

- **Rend Armor** Hitting an unarmored target allows you to use a fast action or maneuver to deal an extra point of damage. If you hit a target with light armor, you can then on perform a fast action to reduce their Armor rating by 1; armor reduced to 0 rating is destroyed, making the target unarmored for future attacks.

### Shield Grappler -- Merged from Source 2

Attacking with this weapon negates an opponent’s shield.

### Silent

This quality is for modern weapons. It could be due to an added silencer at the end of a gun barrel or a setting on a futuristic blaster.

- **Silent Trade-Off** Weapons on silent mode deal 1 less damage. 
- **Whispers** Requires an Observation/Scout roll to hear.
 
### Slow

This is for weapons that require time to be used repeatedly.

- This weapon cannot be fired in consecutive rounds.
- On any other round a maximum of 1 attack can be made with this weapon, even if you have the means to make more than one attack.
- If this weapon is moved manually (not vehicle mounted), it must be set-up required at least 1 round.

### Smart -- Merged from Source 2

This weapon has intelligent or semi-intelligent rounds that are able to guide themselves onto a target. They gain a DM to their attack rolls equal to the difference between their TL and that of the target, to a minimum of ⚅+1 and a maximum of ⚅+6.

### Specialized -- Merged from Source 2

Only classes with Strength as a prime requisite can wield this weapon efficiently. All others suffer a -4 penalty to hit.

### Splash X -- Merged from Source 2

On a successful attack, the container smashes and douses the target with the contents. Damage is inflicted over X “rounds.”

### Stealth -- Merged fom Source 2

May only be used to attack an unaware person (i.e. human / demi-human of any level or humanoid monster of up to 4+1 HD) from behind. Any successful attack with this weapon is considered to be a critical hit.

### Strangle -- Merged from Source 2

Following a successful hit, this weapon inflicts automatic damage each round. The victim cannot move and suffers a -2 penalty to attack rolls. A successful hit on the attacker allows the victim to break free.

### Stun

This quality is for modern weapons. It is a typical setting for blasters in a futuristic settings and even batons from such settings may have this property. Also known as zap weapons.

- Unless noted otherwise, stun settings only work out to Short range.
- Deals stress (or Wits & then Empath) damage. A critical success stuns the target for the next round: they cannot take any actions.

### Thermal Sweep

For futuristic weapons that fire a continuous beam that can be swept across several enemies.  

Works as Auto-Fire (Sweep)

### Tiny

This property is mostly for ammunition, though it could represent smaller weapons carried by small characters too.

Tiny items do not count towards encumbrance.

### Toggle (#)

Weapons with this quality have a trailing line that can connect to targets. The line's length is denoted by "#." When a weapon with the Toggle and either Barbed or Entangling properties hits a target, the following rules apply:

1. **Line Connection**: A trailing line connects the target to the attacker. The attacker determines the length of the line, up to "#" units.

2. **Breaking the Line**: To break the line, the target (or an ally) must:
   - Deal 2 slashing damage, (against standard target number ).
   - Make a Strength or Might check, with the difficulty varying by system (against a standard target number).

3. **Restricted Movement**: If the connected target wishes to move beyond the length of the line, they must succeed in an opposed Strength check against the wielder.

4. **Wielder's Choice**: If the target successfully moves away, the wielder can either:
   - Drop the weapon, which will be dragged away by the target.
   - Spend a action to keep the weapon. If the weapon has the Barbed property, pulling it free deals damage to the target as per the Barbed rules.

### Tripping

For weapons that have hooks or protrusions made to take people to ground, or entangling weapons like whips that can be used to yank legs out from under foes.

- This only works on a creature up to one size category larger than the wielder of the disarming weapon.
- You can choose to deal half damage and knock the target prone.

### Unbalancing

Weapons with this quality are typically weighted or designed in a way that they can throw the wielder off balance if not used effectively. If you attack and miss your target with an Unbalancing weapon, the next melee attack against you gains a +2 bonus before your next turn unless you spend a fast action to recover.

### Versatile

Versatile weapons are flexible in terms of how they can be used. They can be wielded with one or two hands, offering various benefits depending on the method. The rules for small creatures and for ranged and melee uses differ.

 **Melee & Ranged**: When used in two hands, you can reroll any one die not showing a 1.
 **Size-Dependent Handling**: Small creatures must wield these weapons in two hands but use the standard damage. If a small creature attempts to use the weapon in one hand, the weapon is treated as having the Heavy property.

### Very Bulky

Some weapons are designed only for the strongest combatants. A character
using a Very Bulky weapon must have Strength 12 or higher to use it without
penalty. Otherwise, all attack rolls will have a negative DM equal to
the difference between their Strength DM and +2.

### Wrap-Around

For weapons that have large hooks or flexible components capable of wrapping around shields.

- Weapons with the wrap-around property ignore any defense bonus a target has due to using a shield or weapon with the defensive property.

### Zero-G -- Merged from Source 2

This weapon has little or no recoil, allowing it to be used in low or zero gravity situations without requiring an Athletics (dexterity) check.

## Weapon Construction Materials from Gamma World to 5th Edition D&D

### Stone Weapons

Light and one-handed bludgeoning weapons, spears, axes, and daggers can all be made of stone.

- Stone weapons are two thirds the weight of their base weapons
- Stone weapons take a –1 penalty on damage rolls (minimum 1 damage)
- Stone weapons have the fragile property
- Stone weapons can be manufactured by TL0 and above

### Bone (Horn, shell, and ivory) Weapons

Bone can be used in place of wood and steel in weapons.  Light and one-handed melee weapons, as well as two-handed weapons that deal bludgeoning damage only, can be crafted from bone. Hafted two-handed weapons such as spears can be crafted with bone. Other two-handed weapons cannot be constructed of bone.

- Bone weapons are one third the weight of their base weapons
- Bone weapons take a –2 penalty on damage rolls (minimum 1 damage)
- Bone weapons have the the fragile property
- Stone weapons can be manufactured by TL0 and above

### Unworked Wooden Weapons

Light and one-handed melee weapons, as well as two-handed weapons that deal bludgeoning damage only, can be crafted from unworked wood. Hafted two-handed weapons such as spears can be crafted entirely of wood. Other two-handed weapons cannot be constructed of wood.

- Unworked wood weapons have the the fragile property.
- Rustic Wood weapons take a –3 penalty on damage rolls (minimum 1 point damage)
- Unworked Wooden weapons can be manufactured by TL0 and above

### Bronze (Brass, Copper, or Tin) Weapons

Before the advent of iron and steel, bronze ruled the world. This easily worked metal can be used in place of steel for both weapons and armor. For simplicity’s sake, similar or component metals such as brass, copper, or even tin can use the following rules, even though in reality bronze is both harder and more reliable than those metals.

All weapons that can be made out of steel can also be made out of bronze.  Bronze weapons have the same weight and do the same damage as steel weapons of the same type.

- Bronze weapons have the the fragile property
- Bronze weapons can be manufactured by TL1 and above

### Iron

Items without metal parts cannot be made from iron. An arrow could be made of iron, but a standard quarterstaff could not.

- Iron weapons lose all Light and Finesse properties
- Iron weapons weigh one and one half times as much as the same item made from steel
- Iron weapons can be manufactured by TL1 and above

### Steel

Items listed in the manual are steel weapons.

- Steel weapons can be manufactured by TL2 and above

### Synthetic Metal (Durasteel, Plasteel, Duralloy, Titanium Alloy)

An item made from Synthetic Metal weighs half as much as the same item made from other metals.

- Synthetic Metal is too light to be used for Heavy weapons and lose their effectiveness
- Synthetic Metal weapons become Light weapons
- Synthetic Metal Light weapons gain the Finesse property
- Synthetic Metal Two-Handed weapons are now versatile instead
- Synthetic Metal Ammunition it too light to be effective
- TL5 Synthetic Metal weapons can only be Light
- Synthetic Metal weapons can be manufactured by TL5 and above

### Synthetic Crystal (Ceramic, Diamond, Crysteel, Glassteel)

Melee weapons and ammunition made with synthetic crystals are unusually effective when used to break objects.

- Synthetic Crystals weapons and ammunition, when they hit, always hit with a critical hit.
- TL5 Synthetic Crystals are Fragile and can not be used for ammunition
- Synthetic Crystals weapons can be manufactured by TL5 and above

### Weapon Size Increases

- Large weapons have double the number of dice they had at normal size.
- Huge weapons have triple the number of dice they had a normal size.
- Gargantuan weapons have quadruple the number of dice they had a normal size.
- A weapon sized for an attacker one size larger is used at a disadvantage.
- A weapon sized for an attacker two or more sizes larger is too big for the attacker to use at all.

### Weapon Size Decreases

- Weapons manufactured for Small attackers use the medium weapon charts.  Small Attackers may use medium weapons at no disadvantage.
- Small attackers use heavy weapons at a disadvantage.
- Weapons manufactured for Tiny creatures do half damage.
- Heavy Weapons may not be manufactured for Tiny Creatures.
- A weapon sized for an attacker one size smaller is used at a disadvantage.
- A weapon sized for an attacker two or more sizes smaller is too small for the attacker to use at all.

## Damage Type

### Acid Damage

Acid damage often represents corrosive substances that eat away at materials and flesh alike. Whether it's a vial of acid thrown by an alchemist, a dragon's acidic breath, or an environmental hazard, acid damage brings a sense of relentless, unstoppable dissolution to the table.  Acid damage can be highly varied and tailored to fit the mood, technology level, and general theme of your campaign, making it a versatile and evocative tool in a game master's arsenal.

#### Acid Damage in Fantasy Settings

In a classic fantasy realm, acid damage might come from a variety of sources. Potions or flasks of acid could be commonly sold in arcane shops or used by tricky rogues. Some creatures, like black dragons or oozes, are well-known for their acid-based attacks. Wizards and sorcerers may also have spells at their disposal that conjure acidic clouds or bolts.

#### Acid Damage in Sci-Fi Settings

In science fiction campaigns, acid damage could be delivered via specially designed weapons that shoot corrosive substances, or it could be an environmental hazard on an alien planet. Acid might also be used as a weapon of mass destruction, capable of melting through spaceship hulls or robotic exteriors.

#### Acid Damage in Modern or Urban Fantasy Settings

Imagine running into a criminal gang that employs acid as a weapon, or perhaps a creature of myth hiding in the city sewers with corrosive saliva. Acid might also be a hazardous material in a chemical plant, providing a mundane but dangerous obstacle for players to navigate.

#### Acid Damage in Horror Settings

In horror settings, acid could be a particularly gruesome way to showcase the terror of a scene. Whether it's an acidic trap set up by a malevolent entity or a creature whose touch dissolves flesh, acid damage can heighten the stakes and horror.

#### Acid Damage in Historical Settings

Whether it's the ancient world or a more recent setting, acid could be employed in a number of ways, from primitive corrosive substances used in traps to more modern scientific applications. In war settings, acid could be used as a primitive form of chemical warfare.

#### Acid Damage in Post-Apocalyptic Settings

In a world where resources are scarce, acid might become a highly sought-after weapon. It could be harvested from mutated creatures or manufactured in rudimentary labs. Traps using acid could also be a common way to protect valuable resources.

#### Acid Damage in Steampunk Settings

Acid in a steampunk setting might come from elaborate brass and glass contraptions that spray the substance, or it could be part of the exhaust from a steam-powered machine gone haywire.

### Bludgeoning Damage

Bludgeoning damage is the most straightforward and one of the most versatile types of damage, representing impact force against a target. This could be from a club, a falling rock, or a giant's fist. It's a primal and direct form of damage that lends itself to all sorts of contexts and settings.  Bludgeoning damage is a universal concept that can be adapted to fit virtually any setting or genre. It's a fundamental form of harm that resonates on a basic level, making it a versatile choice for all kinds of storytelling scenarios.

#### Bludgeoning Damage in Fantasy Settings

Bludgeoning is perhaps most commonly seen in fantasy settings, where weapons like hammers, maces, and staves are abundant. Monsters like hill giants or trolls may use large clubs or even their fists to deal bludgeoning damage. Traps in ancient temples might release rolling boulders, and magic spells could call down meteor showers.

#### Bludgeoning Damage in Sci-Fi Settings

In a science fiction context, bludgeoning damage could come from advanced, but non-lethal crowd-control weapons designed to subdue rather than kill. It could also be the result of a spaceship crash or a mechanical arm gone rogue. Even in high-tech settings, the simplicity of bludgeoning means it's never obsolete.

#### Bludgeoning Damage in Modern or Urban Fantasy Settings

In modern settings, bludgeoning damage often takes on a gritty, street-level quality. It might come from baseball bats in a gang fight, or rubber bullets used by riot police. In urban fantasy, mystical beings might employ ancient hammers or other legendary blunt instruments that carry both physical and magical weight.

#### Bludgeoning Damage in Horror Settings

In horror games, bludgeoning is the staple of many a terrifying foe. Whether it's a crazed killer with a sledgehammer or an undead monstrosity with overwhelming strength, bludgeoning damage in horror is often portrayed as brutal and gruesome.

#### Bludgeoning Damage in Historical Settings

In historical campaigns, the technology and weaponry might define the types of bludgeoning damage encountered. In a Roman campaign, it could be the wooden clubs of barbarians, while in medieval Japan it could be the bo staff or kanabo (a spiked or studded two-handed club).

#### Bludgeoning Damage in Post-Apocalyptic Settings

In post-apocalyptic worlds, bludgeoning takes on a makeshift quality. Makeshift weapons like crowbars, tire irons, or even simple rocks become essential tools for survival. Bludgeoning damage here is raw and desperate, emblematic of the harshness of life in a ruined world.

#### Bludgeoning Damage in Steampunk Settings

In a steampunk universe, expect to see elaborate mechanical hammers, pneumatic fists, or even steam-powered mauls. These often combine the aesthetic of the setting with the primal effectiveness of bludgeoning damage.

### Cold Damage

Cold damage represents harm inflicted through extremely low temperatures, freezing winds, or ice-based magical or elemental attacks. It's a damage type that often has the added effect of slowing down or immobilizing targets, making it a tactical option in various settings.  Cold damage offers a versatile and often tactical form of harm that can be adapted to any setting. It can be a straightforward combat concern, an environmental obstacle, or a mood-setting element, making it a useful addition to any game master's repertoire.

#### Cold Damage in Fantasy Settings

In a fantasy world, cold damage might come from ice dragons, frost mages, or enchanted weapons imbued with chilling magic. The wilderness itself, particularly tundra or icy mountain ranges, can be a source of environmental cold damage.

#### Cold Damage in Sci-Fi Settings

In a futuristic or space-faring campaign, cold damage could be inflicted by advanced cryo-weapons or malfunctioning life support systems in a spaceship. Planets with harsh, sub-zero climates may also serve as environments where cold damage is a constant concern.

#### Cold Damage in Modern or Urban Fantasy Settings

In a modern setting, cold damage might stem from liquid nitrogen traps or experimental cold-based weaponry. In urban fantasy, perhaps a being from Norse mythology brings with it a frigid aura, or a rogue scientist has developed a freeze ray that's causing havoc.

#### Cold Damage in Horror Settings

Cold damage in a horror setting adds an element of dread and creeping doom. It might manifest through malevolent spirits that bring a chill to the air, or a dark ritual that plummets the temperature in an area, slowing characters both physically and mentally.

#### Cold Damage in Historical Settings

In historical settings, cold damage is often an environmental concern. For example, expeditions into the Arctic or soldiers on winter campaigns could face the dangers of frostbite and hypothermia, which could be represented as cold damage in game terms.

#### Cold Damage in Post-Apocalyptic Settings

In a post-apocalyptic setting, the collapse of modern infrastructure might mean a harsh winter presents a significant danger. Alternatively, some apocalyptic event might have thrown the climate into chaos, making cold damage a frequent concern.

#### Cold Damage in Steampunk Settings

In steampunk settings, imaginative devices like "Frost Cannons" or "Icy Ether Projectors" could be sources of cold damage. Inventors and scientists may have devised various ways to weaponize cold, adding a touch of Victorian flair to the elemental force.

### Fire Damage

Fire damage is a classic and evocative form of harm, symbolizing both destruction and cleansing. Whether it comes from a dragon's breath, a Molotov cocktail, or a high-tech flamethrower, fire damage often comes with the added complication of potentially spreading or affecting an area.  Fire damage is a dramatic and multi-faceted form of harm that can be adapted to fit virtually any setting or storyline. It's both a practical combat concern and a powerful thematic element, making it a useful and engaging tool in any game master's toolkit.

#### Fire Damage in Fantasy Settings

Fire is a staple in fantasy settings, and it manifests in myriad ways. Wizards might launch fireballs, while warriors could wield flaming swords. Red dragons, fire elementals, and various demonic creatures often deal fire damage. Magical traps that erupt in flame are also common in ancient dungeons.

#### Fire Damage in Sci-Fi Settings

In science fiction, fire damage could come from advanced energy weapons that emulate the effect of fire on a molecular level. Flamethrowers and incendiary rounds can cause fire damage, as could the dangerous environment of an alien planet with methane lakes that can ignite.

#### Fire Damage in Modern or Urban Fantasy Settings

Modern settings offer a variety of sources for fire damage, from Molotov cocktails thrown in a street protest to arson attacks. In urban fantasy, ancient artifacts might conjure fire, or magical creatures like phoenixes might bring their own fiery destruction to the modern world.

#### Fire Damage in Horror Settings

Fire often serves as a dual symbol in horror settings: a destroyer and a purifier. It could be that the only way to vanquish an undead abomination is to set it aflame, or perhaps a malevolent spirit sets lethal fires. Either way, fire damage in horror can be both a threat and a tool for players.

#### Fire Damage in Historical Settings

In a historical setting, fire damage can come from a variety of sources depending on the time period. In ancient sieges, flaming arrows and pots of burning oil were used. In more recent times, the advent of firearms and artillery brought explosive rounds that could cause fire damage.

#### Fire Damage in Post-Apocalyptic Settings

In post-apocalyptic worlds, fire is often a primal force again, necessary for survival but also a constant hazard. Makeshift weapons like flaming arrows or fuel-filled bottles become more common, and the destruction of modern firefighting methods might make fire damage more pervasive and dangerous.

#### Fire Damage in Steampunk Settings

In a steampunk universe, expect to see fantastical contraptions that shoot jets of flame or incendiary rounds. Fire may also be a byproduct of the many steam-powered machines that populate the world, making it a common environmental hazard.

### Force Damage

Force damage is a unique and often magical form of energy that bypasses most forms of physical resistance. It represents a pure, raw exertion of energy, often manifested as invisible or ethereal blasts, barriers, or waves. This type of damage is commonly associated with arcane or divine sources but can also occur due to technological means in certain settings.  Force damage is a versatile and often mysterious form of harm that can appear in a wide array of settings. It's typically less straightforward than physical types of damage, offering a range of creative and tactical possibilities that can add depth and intrigue to any campaign.

#### Force Damage in Fantasy Settings Settings

In a fantasy realm, force damage is often the purview of arcane spellcasters. Spells that shoot bolts of arcane energy or generate waves of concussive force may have the capability to inflict force damage. Certain enchanted items or artifacts may also deliver force damage when activated.

#### Force Damage in Sci-Fi Settings Settings

In science fiction worlds, force damage could be related to advanced technology like force fields, gravity-manipulating devices, or particle beams. It could also come from psionic abilities, where mental force is made manifest to damage or repel enemies.

#### Force Damage in Modern or Urban Fantasy Settings

In modern or urban fantasy settings, force damage could manifest through esoteric martial arts that focus energy, or through technological means like experimental weapons. It might also come from powerful artifacts hidden in plain sight, like a seemingly innocuous pendant that unleashes a burst of force energy when activated.

#### Force Damage in Horror Settings

In a horror game, force damage could be associated with malevolent spirits or curses that exert a damaging influence on the physical world. It could also manifest as an extension of forbidden arcane or eldritch knowledge, hurting those who dare to meddle with the unknown.

#### Force Damage in Historical Settings

In historical settings, force damage might be limited to legendary artifacts, divine interventions, or other extraordinary circumstances. For example, a holy relic could emit a burst of force energy when used to fend off unholy creatures.

#### Force Damage in Post-Apocalyptic Settings

In post-apocalyptic scenarios, remnants of advanced technology or lost arcane knowledge might be the sources of force damage. A scavenged piece of tech or a rediscovered spellbook could provide characters with a unique advantage.

#### Force Damage in Steampunk Settings

In a steampunk world, experimental "force cannons" or "aetheric pulse devices" might deliver bursts of concentrated force. These could be the inventions of mad scientists, or perhaps based on arcane principles rediscovered and mechanized through steampunk ingenuity.

### Electrical Damage

- Fire: target of a fire attack may continue to burn (use the fire rules for the system being used).  <-- this needs to change
- Ion: this damages electronics and droids only.

Electrical damage represents the raw power of electricity or other types of intense energy. Whether it's a bolt of lightning from the sky, an electrical trap, or a futuristic laser, this damage type is often fast, focused, and devastating. It can also carry the additional effect of disrupting systems, whether those are magical constructs or technological devices.  Electrical damage is a flexible and dynamic type of harm that can find a place in almost any kind of setting. It can represent the raw power of the elements, the dangers of technology, or the mysterious energy of arcane or extraterrestrial origin, offering a myriad of storytelling possibilities.

#### Electrical Damage in Fantasy Settings Settings

In traditional fantasy worlds, lightning is often the domain of storm gods, powerful sorcerers, and certain types of dragons. Spells like "Chain Lightning" or "Shocking Grasp" can deal electrical damage, and magical items like a "Staff of Thunder and Lightning" could give players a shocking edge.

#### Electrical Damage in Sci-Fi Settings Settings

In a science fiction landscape, energy-based weapons like laser guns or plasma rifles would deal this type of damage. Electrical hazards might also come from malfunctioning equipment, security systems, or the natural phenomena of exotic planets.

#### Ion Damage

> By means of massive electromagnetic pulses, overloading or power systems or other exotic effects, ion weapons have the potential to temporarily disrupt critical systems on board a ship without causing permanent damage. This can give a vital edge in combat while an enemy ship recovers or force an enemy to surrender before the disabling attack is followed up by something far more potent.
> 
> Instead of dealing damage as usual, Ion weapons use the following rules.
>
> > When an Ion weapon successfully hits a target, roll for its damage but ignore any armour the target possesses. Instead of applying damage to the target’s hull, it is instead temporarily deducted from the target’s Power, representing the disabling effects as they spread throughout the ship and the crew working hard to keep the most vital systems online.
> >
> > This reduction in Power will last until the target completes its next set of actions, in either the current Ounces (⏱) or the next.
> >
> > If the Effect of the attack roll is 6 or more, the reduction in Power will last for D3 rounds.

#### Electrical Damage in Modern or Urban Fantasy Settings

Electricity is a modern marvel, and in contemporary settings, it might be weaponized in the form of tasers, electrical traps, or experimental energy weapons. In urban fantasy, an electrical attack could also be magical in origin, perhaps from a modern wizard or a mythological creature adapted to urban life.

#### Electrical Damage in Horror Settings

In horror settings, electrical damage can take on an even darker tone, perhaps being employed in torturous or sadistic ways. Haunted or cursed electrical systems can fry unsuspecting victims, and otherworldly entities might possess the power to manipulate electrical energy.

#### Electrical Damage in Historical Settings

In historical settings, instances of electrical damage might be rare but could still appear in the form of lightning storms or rare alchemical devices. Devices like the Leyden jar, an antique form of a capacitor, could be an interesting basis for an electrical trap or weapon.

#### Electrical Damage in Post-Apocalyptic Settings

In a post-apocalyptic world, remnants of old technology could provide electrical damage capabilities, either as booby traps protecting valuable resources or as jury-rigged weapons. Natural occurrences like lightning storms may also be more dangerous in a world where shelter is scarce.

#### Electrical Damage in Steampunk Settings

Electrical damage in steampunk could come from "aetheric generators," "lightning guns," or other wildly imaginative gadgets. As steampunk often bridges the gap between magic and technology, these devices could operate on principles of electricity, arcane energy, or a blend of both.

### Radiation Damage

Radiation damage deals with forms of energy that decay or corrupt living tissue. Radiation damage is often associated with the dark arts, death, decay, and is linked to dangerous isotopes or high-energy particles. This damage type has long-term harmful effects, including persistent wounds or lingering sickness.  This damage type offers rich narrative opportunities for harm that's not just immediate but also potentially lingering. It can serve to heighten the stakes, introduce new challenges, and add layers of complexity to your storytelling. Whether sourced from dark magic or dangerous technology, these forms of damage can bring a sense of urgency and menace to any campaign.

#### Radiation Damage in Fantasy Settings

In a fantasy world, this damage is typically the domain of dark mages, necromancers, or undead creatures. Spells that channel harmful energies to directly harm the body, or items such as swords imbued with malevolent magic that cause degeneration, are common sources of this type of effect. Scientific sources of this damage is less common but might appear in the form of cursed lands or arcane fallout from a magical catastrophe.

#### Radiation Damage in Sci-Fi Settings

Radiation damage is a natural fit for science fiction settings, especially in dystopian or post-apocalyptic scenarios. Radiation can come from nuclear weapons, malfunctioning reactors, or cosmic phenomena. Alien technology or biology might also be the source of the effect.

#### Radiation Damage in Modern or Urban Fantasy Settings

In modern settings, radiation damage could result from nuclear accidents or terrorist attacks using "dirty bombs." While hidden necromancers, cursed artifacts, or secret societies practicing dark arts could also provide a source of this damage. 

#### Radiation Damage in Horror Settings

This damage damage in horror settings can be the result of curses, dark rituals, or malevolent entities seeking to drain the life from victims. This damage type can add a layer of existential dread, emanating from forbidden technologies or eldritch phenomena that corrupt and decay.

#### Radiation Damage in Historical Settings

This damage type could appear in ancient curses, dark rites, or through exposure to unholy artifacts. Its less likely to be encountered elsewhere but it could be introduced through mysterious substances (like uranium unknowingly used in old pottery) or as a divine punishment in myths.

#### Radiation Damage in Post-Apocalyptic Settings

This damage type is common in post-apocalyptic settings. This energy could be a byproduct of the apocalyptic event itself, emanating from the undead or corrupted lands. This damage is a staple in post-nuclear settings, where radiation zones and isotopes pose constant threats.

#### Radiation Damage in Steampunk Settings

In steampunk worlds, this damage type could be channeled through dark aetheric energies or alchemical concoctions, and it could be an unintended side effect of new, steam-powered technologies. Mad scientists and dark inventors might utilize these energies to create potent but perilous weapons.

### Piercing Damage

Piercing damage represents the act of penetrating or puncturing an object or creature with a sharp or pointed implement. It's a common form of damage that ranges from arrows and spears to bullets and laser beams, depending on the setting. Piercing attacks often excel at bypassing armor or hitting vital areas.  Piercing damage is a versatile and widespread form of harm that has a place in almost any genre or setting. It's often associated with precision and skill, and can introduce a range of tactical options for players and NPCs alike. From the traditional bowman to the futuristic sharpshooter, characters specializing in piercing damage often bring a unique set of capabilities to their parties.

#### Piercing Damage in Fantasy Settings

Piercing damage is a staple in fantasy worlds, often dealt by archers, rogues, or warriors using weapons like longbows, crossbows, or daggers. Mythical creatures like manticores or wyverns might also have piercing attacks, like spines or stingers.

#### Piercing Damage in Sci-Fi Settings

In futuristic settings, piercing damage could be delivered by advanced firearms, railguns, or even focused laser beams that punch through armor. Alien species might possess natural abilities to deal piercing damage, such as proboscises or spines.

#### Piercing Damage in Modern or Urban Fantasy Settings

Modern firearms like handguns and sniper rifles typically deal piercing damage. In an urban fantasy setting, even magical creatures might use firearms, or perhaps their natural attacks like fangs or quills deal piercing damage. 

#### Piercing Damage in Horror Settings

In horror games, piercing damage can be particularly gruesome, often dealt by instruments of torture or weapons like meat hooks and syringes. Supernatural creatures might also have fangs, talons, or spines that deal piercing damage.

#### Piercing Damage in Historical Settings

Historical settings offer a plethora of piercing weapons based on the technology of the time. From slingshots and bows to muskets and early firearms, piercing damage is often the most common form of ranged attack.

#### Piercing Damage in Post-Apocalyptic Settings

In a world after civilization's fall, piercing damage might come from makeshift weapons like crossbows or sharpened pieces of scrap metal. Traps made of sharp objects are also more likely in a world where sophisticated weaponry is scarce.

#### Piercing Damage in Steampunk Settings

Steampunk worlds may feature innovative piercing weapons like clockwork crossbows, pneumatic spearguns, or mechanically-enhanced throwing knives. These could combine traditional mechanisms with steam or aetheric energy to add a fantastical element to otherwise conventional piercing weapons.

##### Ballistic (Type)

Ballistic damage is the type of damage that firearms inflict. It is a subset of piercing damage.

- All ballistic damage counts as piercing damage,
- Not all piercing damage counts as ballistic damage.
- Stuff that is resistance to piercing damage is also resistant to ballistic damage.
- Stuff that is resistant to ballistic damage is not automatically resistant to piercing damage.

##### Additional Rules needed?

- Is there something above ballistic?



### Poison Damage

> This weapon inflicts no damage, but may administer a bloodstream poison.
>
> Endurance Check Difficulty. This is a number -4 thru 4
>
> Damage: This is the damage taken
>
> Effects: This is the targets condition if the check is unsuccessful
> (dead, unconscious, Coma, etc..)
>
> Interval: This how frequently the check must be made
>
> Contagious: This is how frequently someone else in contact with the
> victim can become sick

Poison damage represents the harmful effects of toxic substances, venom, or noxious gases. It can be a slow-acting threat that gradually weakens a character or a fast-acting toxin that deals immediate harm. Poison damage often comes with secondary effects like weakening, disorientation, or ongoing damage over time.  Poison damage offers a host of narrative and tactical possibilities, bringing a sense of danger, urgency, and complexity to a game. Whether it's the simple poison of a snakebite or the engineered toxin of a futuristic assassin, poison damage can challenge characters in unique ways and add layers to storytelling.

#### Poison Damage in Fantasy Settings

In a fantasy realm, poison damage can be the weapon of choice for assassins, rogue alchemists, or sinister mages. Creatures like spiders, snakes, and wyverns might have poisonous bites or stingers. Magical poisons with unique properties can also be a feature.

#### Poison Damage in Sci-Fi Settings

In science fiction, poison could be a form of biochemical warfare, an alien venom, or an environmental hazard on a newly explored planet. Futuristic technology might offer new delivery systems for poisons, such as drones or nanobots

#### Poison Damage in Modern or Urban Fantasy Settings

In a modern setting, poison could come in the form of industrial chemicals, illegal narcotics, or even household items that have been tampered with. Urban fantasy might feature magical or mythical creatures with poisonous abilities, hiding in plain sight.

#### Poison Damage in Horror Settings

Poison in horror games adds an element of suspense and urgency, as characters may have to find an antidote or cure before time runs out. This could range from a cursed vial of liquid to a monster's venomous bite.

#### Poison Damage in Historical Settings

In historical contexts, poison has been used in various forms, from arsenic and belladonna to poisoned arrows and tainted food. Assassinations, warfare, and political intrigue often feature poison as a central element.

#### Poison Damage in Post-Apocalyptic Settings

In a post-apocalyptic setting, poisons might be more prevalent due to the breakdown of industrial safeguards. Polluted water sources, toxic waste, and poisonous plants or mutated animals could all be potential dangers.

#### Poison Damage in Steampunk Settings

In a steampunk universe, poisons could be intricately engineered concoctions, delivered through clockwork syringes or aerosol sprays. They might be the creations of mad scientists, nefarious industrialists, or rogue inventors.


### Mental Damage

Mental damage targets the psyche, affecting the target's thought processes, emotions, or even core beliefs. It can manifest in various forms such as confusion, disorientation, or debilitating fear. Unlike Mystical damage, which directly assaults the mind, mental damage tends to alter or manipulate mental states rather than harm them outright. This type of damage often sidesteps traditional armor and physical defenses.  Mental damage provides a nuanced challenge that targets a character's mental resilience rather than their physical durability. It offers unique storytelling opportunities, allowing players to explore themes of control, identity, and the fragility of the mind. Whether through magical means, advanced technology, or the mysteries of the psyche, mental damage enriches the complexity and drama of TTRPG encounters.

#### Mental Damage in Fantasy Settings

In fantasy worlds, mental damage might be inflicted by enchanters, bards, or certain types of clerics who can manipulate emotions or thoughts. Creatures like sirens or harpies might use mesmerizing songs that deal mental damage.

#### Mental Damage in Sci-Fi Settings

In futuristic settings, mental damage may come from advanced technologies like "emotion disruptors," "psychoactive gas," or even neural hacking that messes with a target's ability to think or act coherently.

#### Mental Damage in Modern or Urban Fantasy

Here, mental damage could come from a mix of supernatural beings like fae who toy with emotions, or even human minds with the power to induce fear or confusion. Advanced technologies or potent drugs might also be sources of mental impairment.

#### Mental Damage in Horror

In a horror context, mental damage is often central to the theme. Encounters with eldritch abominations, ghosts, or demonic entities could impose severe mental tolls. Even merely witnessing certain events or symbols might incur mental damage.

#### Mental Damage in Historical

While rare, mental damage in historical settings could come from curses, extreme forms of religious fervor, or encounters with mythological creatures that can affect the mind. Shamans or mystical traditions might use various methods to inflict this type of damage.

#### Mental Damage in Post-Apocalyptic

In the bleak world of post-apocalypse, mental damage could result from the immense stress and horror of daily life, or from mutated creatures with mind-affecting abilities. Lost technology might also play a role, affecting minds in ways no longer fully understood.

#### Mental Damage in Steampunk

In a steampunk world, intricate contraptions like "cogwheel mesmerizers" or "steam-powered emotion regulators" could be designed to manipulate thoughts and feelings, resulting in mental damage. The combination of arcane arts and machinery offers various avenues for such effects.

### Mystical Damage

Mystical damage targets the mind, emotions, or soul rather than the physical body. It can manifest as mental fatigue, loss of memory, or even Mystical "pain" that somehow hurts without a physical source. Unlike other damage types, Mystical damage often bypasses traditional forms of armor and physical defense.  Mystical damage offers a different kind of threat, one that can undermine not just a character's physical health but their mental well-being. It can add an element of existential danger and suspense, making it an interesting option for both players and storytellers alike. Whether through magic, technology, or some unknown force, Mystical damage can make for a complex and intriguing challenge.

#### Mystical Damage in Fantasy Settings

In fantasy worlds, Mystical damage is often the purview of mystical or arcane powers. Illusionists, mind mages, or psionic beings may use abilities that cause Mystical harm. Certain creatures like mind flayers or elder beings can also deal Mystical damage as part of their eldritch nature.

#### Mystical Damage in Sci-Fi Settings

In a science-fiction setting, Mystical damage might be explained through advanced neuroscience, Mystical phenomena, or alien abilities. Weapons like "neural disruptors" or "Mystical amplifiers" could be designed to specifically cause this kind of damage.

#### Mystical Damage in Modern or Urban Fantasy Settings

In contemporary settings, Mystical damage could come from a variety of sources, from cultists invoking ancient powers to induce mental suffering, to modern Mysticals with mysterious abilities. Even cybernetic interfaces could be hacked to deliver a form of Mystical trauma.

#### Mystical Damage in Horror Settings

Mystical damage in horror games can be particularly unnerving, as it may target the very core of a character's sense of self or sanity. Malevolent spirits, cursed objects, or unspeakable entities might wield Mystical abilities as part of their arsenal.

#### Mystical Damage in Historical Settings

While rarer in historical settings, Mystical damage could still occur through curses, religious fervor, or esoteric rites. Shamanistic or mystical traditions may involve abilities or artifacts that can inflict harm on the soul or mind.

#### Mystical Damage in Post-Apocalyptic Settings

In a post-apocalyptic world, Mystical damage could be a byproduct of the cataclysmic events that shattered civilization. New breeds of mutants, or remnants of old-world technology that affect the mind, could be sources of Mystical damage.

#### Mystical Damage in Steampunk Settings

In a steampunk setting, Mystical damage might be caused by experimental "mind-machines" or arcane energies harnessed through intricate devices. Scholars and inventors could dabble in the mysterious realms of the mind, sometimes with dangerous results.

### Radiant Damage

Radiant damage deal with focused forms of light or energy.  The source of this energy differs quite a bit based on the source of that energy. Radiant damage can be associated with divine or celestial power, and is often effective against creatures of darkness or evil. Its origin can also be technological in nature, coming from devices that focus light into damaging beams.  Radiant damage offer unique storytelling opportunities. Radiant damage often carries with it thematic implications of holy retribution or divine intervention, making it a powerful narrative tool. In a technical setting, radiant damage, is often seen as a byproduct of technological advancement and can introduce questions about the ethical use of such powerful weaponry. This damage type can add depth and complexity to combat encounters and offer specialized ways of overcoming challenges.

#### Radiant Damage in Fantasy Settings

In fantasy settings, radiant damage is often linked to divine beings, holy warriors, or celestial entities. Spells that imbue a weapon with celestial or righteous power, as well as those that unleash divine fury, are common sources of this kind of effect. 

#### Radiant Damage in Sci-Fi Settings

In science fiction scenarios, laser damage is quite common, appearing in the form of laser guns, laser swords, or even ship-mounted laser cannons. Radiant damage could could also be explained as a form of exotic energy derived from celestial phenomena or advanced technology.

#### Radiant Damage in Modern or Urban Fantasy Settings

Radiant damage in a modern context could be the result of holy artifacts, divine intervention, or beings of pure light. Experimental weapons or even be weaponized from industrial cutting tools could also be the source of this damage.

#### Radiant Damage in Horror Settings

Radiant damage can serve as a powerful tool for good in a horror setting, damaging vampires, wraiths, or other creatures of the dark. In a sci-fi horror setting radiant damage is a dangerous property where laser weapons are common that can harm both the user and the target if mishandled.

#### Radiant Damage in Historical Settings

Radiant damage in a historical context would likely be tied to religious or mythical narratives, perhaps granted by gods or found in holy relics. If your scenario is an alternative-history setting, technological sources of this damage type might also be present.

#### Radiant Damage in Post-Apocalyptic Settings

Radiant damage sourced from mystical beings and old world religions and cults might be rare. Radiant damage can be found from scavenged technology or the remnants of a more advanced civilizations.

#### Radiant Damage in Steampunk Settings

Radiant damage could be the result of harnessing "aetheric" or "celestial" energy through arcane devices or steam-powered machinery. It can also be a byproduct of new, cutting-edge technology using focused light or energy crystals.

### Slashing Damage

Slashing damage is characterized by cutting, tearing, or slicing actions, often inflicted by edged or bladed weapons. It's one of the most common damage types and is widely used across various settings and genres. Slashing attacks can be devastatingly effective against lightly-armored targets but may be less effective against heavily-armored or naturally tough creatures.  Slashing damage is a versatile and ubiquitous form of harm that can be found in nearly every TTRPG setting. Whether it's a knight's sword or a cybernetic claw, slashing damage offers a wide range of tactical and narrative opportunities. It's often associated with frontline combatants and melee skirmishes, making it a staple in many adventurers' repertoires.

#### Slashing Damage in Fantasy Settings

In a fantasy world, slashing damage is the domain of warriors, barbarians, and swashbucklers wielding swords, axes, and scimitars. Mythical creatures like dragons or manticores might have slashing claws or tails.

#### Slashing Damage in Sci-Fi Settings

In futuristic settings, slashing damage may come from high-tech variants like monomolecular blades, plasma swords, or laser-edged weapons. Robots or aliens could also employ slashing mechanisms, like rotating saws or retractable claws.

#### Slashing Damage in Modern or Urban Fantasy Settings

In modern settings, slashing damage could come from knives, machetes, or even improvised weapons like broken bottles. In urban fantasy, you might find magical blades or mythical creatures whose natural attacks deal slashing damage.

#### Slashing Damage in Horror Settings

Slashing damage in horror games adds an element of visceral danger. Classic horror villains often use knives, machetes, or claws to stalk their prey. Supernatural entities might have slashing talons or spectral blades.

#### Slashing Damage in Historical Settings

In historical scenarios, slashing weapons vary based on the time period and culture, ranging from bronze swords and iron axes to katanas and cavalry sabers. Slashing damage is often the most straightforward and common form of damage in these settings.

#### Slashing Damage in Post-Apocalyptic Settings

In a post-apocalyptic world, slashing damage may come from makeshift weapons like jagged pieces of metal or repurposed tools. Resourceful survivors might adapt the remains of the old world into effective slashing weapons.

#### Slashing Damage in Steampunk Settings

Steampunk settings may feature intricately-designed slashing weapons that combine traditional blades with mechanical or arcane enhancements. Gear-driven axes or steam-pressured scimitars add a unique flair to the conventional slashing attack.


### Social Damage

Social damage is a form of non-physical harm that affects a character's reputation, relationships, or social standing. While not necessarily quantified in the same way as physical damage, social damage can be just as devastating, impacting a character's ability to interact, gain resources, or achieve their objectives. This form of damage is most effective in campaigns that place a significant emphasis on social interaction and role-playing.  Social damage offers a different axis of conflict and challenge. It engages players in the complexities of interpersonal relationships and the consequences of their actions in a social context. This type of damage is best employed in campaigns that feature social dynamics as a key component, offering diverse challenges and enriching character development.

#### Social Damage in Fantasy Settings Settings

In a medieval or fantasy context, social damage could be inflicted through public shaming, accusations of heresy, or tarnishing one's honor. Nobles might duel not to kill but to humiliate, and bards might sing tales that sow doubt about a hero's legitimacy.

#### Social Damage in Sci-Fi Settings Settings

In a futuristic setting, social damage can take on high-tech forms like hacking one's social profiles, broadcasting disinformation, or using technology to manipulate public opinion. Losing face in a galactic council could have wide-reaching implications.

#### Social Damage in Modern or Urban Fantasy Settings

Social damage in a modern setting could involve the spread of damaging rumors online, public humiliation through media, or manipulation of social dynamics. In urban fantasy, magical means like enchantments or illusions could also play a role in social subterfuge.

#### Social Damage in Horror Settings

In horror settings, social damage could involve stigmatization or ostracization due to perceived ties with supernatural elements. Accusations of witchcraft or being cursed could isolate a character from their community.

#### Social Damage in Historical Settings

In historical campaigns, social damage often revolves around honor, reputation, and social conventions. Accusations of treachery, disloyalty, or impropriety could ruin lives just as surely as any sword.

#### Social Damage in Post-Apocalyptic Settings

In a post-apocalyptic world, social damage might mean being branded a traitor or a thief, leading to exile or worse. In tight-knit communities struggling to survive, social standing can be a matter of life and death.

#### Social Damage in Steampunk Settings

In steampunk settings, social damage might include being discredited as an inventor, having your patents stolen, or losing favor with influential guilds. Social dynamics can often be just as intricate as any piece of machinery.

### Sonic Damage

Sonic damage typically results from intense vibrations in the air, loud noises, or other wave-based forms of energy. This type of damage can affect both the target and the surrounding area, sometimes causing collateral effects like shattering objects or stunning foes. Sonic damage often bypass conventional armor and may have unique interactions with barriers and enclosed spaces.  Sonic damage offer both tactical and narrative richness, capable of bypassing traditional defenses and affecting a broad area. Whether it's the boom of a magical thunderclap, the whine of an alien sonic emitter, or the roar of a divine beast, this damage type adds depth and excitement to many TTRPG scenarios.

#### Sonic Damage in Fantasy Settings

In fantastical settings, damage stemming from sound or shockwaves can often be traced back to spells that produce forceful gusts of sonic energy, the abilities of mythical creatures like dragons or banshees, or divine attacks accompanied by an ear-splitting roar.

#### Sonic Damage in Sci-Fi Settings

In science fiction scenarios, sonic damage could be delivered through advanced weaponry like "sonic disruptors" or "pulse rifles," or as a byproduct of certain technologies like faster-than-light engines. Even alien creatures might use sonic attacks as a form of communication or hunting.

#### Sonic Damage in Modern or Urban Fantasy Settings

In a modern context, sonic damage could be the product of high-decibel speakers, sonic grenades, or experimental technologies. In urban fantasy, magical creatures or practitioners could use sonic attacks, often hidden behind the guise of natural phenomena like storms.

#### Sonic Damage in Horror Settings

Sonic damage add another layer of sensory fright to horror settings. The sudden boom or eerie, escalating hum of a sonic attack can elevate tension. Eldritch beings or cursed artifacts might emit sounds that don't just scare but also harm.

#### Sonic Damage in Historical Settings

Historical settings might have more limited sources of sonic or thunder damage, but they could still occur through magical or divine means. For instance, mythological creatures, magical spells, or religious artifacts could produce devastating sonic effects.

#### Sonic Damage in Post-Apocalyptic Settings

In post-apocalyptic scenarios, remnants of old-world technology might still produce sonic damage, whether it's malfunctioning military tech or repurposed construction equipment. Mutated creatures might also develop sonic abilities as survival mechanisms.

#### Sonic Damage in Steampunk Settings

In a steampunk universe, inventors could create complex machinery like "aetheric sound cannons" or "vibration blades" to deal thunder or sonic damage. The merging of arcane and mechanical elements can offer creative ways to deliver these types of effects.





## Weapon Classifications

Objects that block higher classes of damage (anti-vehicle, etc... ) will always block all damage from a weapon of a lower class. 

### Vehicle Weaponry

These weapons are built to damage things like ground, air, water, and small spacecraft vehicles at a team, squad, and tactical scale.

- These weapons can be used against vehicles and large objects.
- Any AP (Armor Penetration) the weapon has still applies versus the target.

#### Damage and Effects

- When used against vehicles and structures the weapon its normal damage.
- When used against natural objects, the weapon deals half its normal damage.
- Anti-{X} weapons are the only weapons that can affect X.

### Strategic Weaponry

These weapons are built to damage things like cities, orbital platforms, large Space ships, and capital ships.

- These weapons can be used against massive objects and large scale vehicles and buildings.
- Any AP (Armor Penetration) the weapon has still applies versus target.

### Planetary Weaponry

These weapons are built to damage things like planets as a whole and creatures of planetary size.

- These weapons can be used against planetary scale objects and creatures of that size.
- Any AP (Armor Penetration) the weapon has still applies versus target.

### Stellar Weaponry

These weapons are built to damage and destroy whole solar systems and creatures of that size.

- These weapons can be used against Stellar scale objects and creatures of that size.
- Any AP (Armor Penetration) the weapon has still applies versus target.

### Galactic Weaponry

These weapons are built to damage and destroy whole Galaxies and creatures of that size.

- These weapons can be used against Galactic scale objects and creatures of that size.
- Any AP (Armor Penetration) the weapon has still applies versus target.

### Cosmic Weaponry

These weapons are built to damage and destroy the whole of reality.

- These weapons can be used against a whole reality construct.
- Any AP (Armor Penetration) the weapon has still applies versus target.

## Weapon Properties from Gamma World conversion to 6e

**Complexity.**  This is either Simple, Complex, or Multipurpose.  A simple object uses the rules for discovering the use of simple objects. Complex objects use the rules for discovering the use of complex objects.  Multipurpose objects can have multiple ratings for each purpose in which case you might see a rating of 4S 1C for 4 simple purposes and 1 Complex purpose.

A simple example of this is a bayonet, which is essentially a dagger attached to a gun, this would be rated a 2S complexity; one for the gun, and one for the dagger.

**_Scatter_**.  An attack is made against each creature within a 30ft cone.  If an affected creature is adjacent to you, they suffer double damage to a hit.

