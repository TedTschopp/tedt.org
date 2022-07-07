---
title: Of Maps and Monsters, the Right way to Populate a World Part II
date: 2018-11-19T21:04:42-07:00
author:
  name: Ted Tschopp
  url: https://tedt.org/
  avatar: https://tedt.org/img/thumb3.jpg

description: 
excerpt: |
   This work is the beginning of a collection of notes on Monsters.  In the future I will split this out into several different sections.  I wanted to start wtih what I had here and start working my thoughts out while getting some of this out of my head and into a place I can review and look at. 

layout: post
guid: dd7cf62d-9947-46e7-b436-7fafb10027e6
permalink: /2018/11/19/Of-Maps-and-Monsters-the-Right-Way-to-Populate-a-World-Part-II/
image: 	/wp-content/uploads/2018/05/Ebstorfer-stich2.jpg
image-credits: Ebstorf Map by Gervase of Ebstorf 
categories:
  - Role Playing Games
  - Maps
  - Monsters
  - Draft
draft-status: notes
mathjax: true
---
<style>
.dccvsdnd thead tr th {
  width: 50%;
}
</style>


# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}


# Notes

This work is the beginning of a collection of notes on Monsters and Maps.  In the future I will split this out into several different sections.  I wanted to start wtih what I had here and start working my thoughts out while getting some of this out of my head and into a place I can review and look at.

# Monsters
One of the aspects of making a sandbox type of role playing game is that many times the monsters that the players run into do not make sense.  These rules are things I am trying to put down to make a computer controlled map generator that can be used to simplify the planning process for people running a game. A lot of this information was inspired and taken from around the web and expanded upon.

## Monster variation
Today in most role playing games monsters are reduced to a handful of stats that do not make them unique.  The first activity that I think is needed for a database of monsters to run into is that these monsters need to have random stats.  Not every player character or human today has the same strength.  The basic idea here is that there is some variation.  Many times this variation is reduced to simplify bookkeeping and that makes sense.  Today however we have rather powerful computers that can work on handing some of that bookkeeping.  Therefore I propose that attributes be replaced with a set of dice.  


### Stats for Exceptional Members of the Encounter
If someone wants to pick more than one type of archetype for the character in question, and there are two bonuses to a given stat than the dice are rolled and the larger of the bonuses are taken.  Bonuses do not stack.  Example:  Someone wants to be a Giant Leader.  Giant gives someone 1d3+3 hit dice up the dice chain.  Leader gives 1d3 increase up the dice chain.  The Giant 1d3+3 rolls a 1+3 = 4 die increase, while leader grants a 1d3 that rolls a 3.  The resulting increase in hit dice is 4.  

#### The Leader
A leader of a given group will have the following:

* Increase Hitdice by 1d3 dice up the dice chain
* Prioritize the following for these creatures with a 1, 2, and 3
   * Physical Prowess (The Alpha)- Add Priority to AC and Reflex or Strength Modifier
   * Personality / Looks (The Commander) - Add Priority to Personality Modifier
   * Health - Add Priority to Fortitude Modifier
 
*[dice chain]: (d3《》d4《》d5《》d6《》d7《》d8《》d10《》d12《》d14《》d16《》d20《》d24《》d30) 


#### The Giant 
A Giant of a given group can be modified as follows:

* Increase HitDice by 1d3+3 up the dice chain 
* Increase Stamina modifier 2d3

#### Dire or Prehistoric
These creatures are normal creatures that are generally larger and have built in weapons in the form of horns, teeth or spikes.  They may have built in armor in the form of heavy fur, hardened bony plates, or thicker skin.  They also have a heightened intelligence if their base species doesn't have such intelligence.  These creatures also will act as Alpha leaders in groups of the normal creatures of the base species. 

* Increase HitDice by 1d3 up the dice chain
* Increase Personality modifier by 1d3
* Set Intelligence Modifier to 0
* Prioritize the following for these creatures with a 1, 2, 3, and 4
  * Increase Fortitude modifier by priority
  * Increase Strength modifier by priority
  * Increase AC by 2d{{priority}}-2
  * Increase Damage from each non-weapon attack by 2d{{priority}}-2 up the dice chain

#### Magical, Blessed
Magical or blessed creatures are those that are blessed by the Gods, Magic, or appear so normal people.  Fey creatures are like this many times.

* Increase in Personality modifier by 1d3
* Prioritize the following for these creatures with a 1, 2, 3 and 4
   * Physical Prowess - Add Priority to AC and Reflex or Strength Modifier
   * Health - Add Priority to Fortitude Modifier
   * Increase Speed by 5' x priority
   * Horns, Claws, hooves, or Teeth - Increase Damage from one non-weapon attack by priority up the dice chain
* TODO: Add Spell
* TODO: Add Aura

### Types of Subnormal Members of the Encounter

#### The Runt / Toady
A Runt or Toady of a given group will have the following:

* Decrease Hitdice by 1d3 dice down the dice chain
* Prioritize the following for these creatures with a 1, 2, and 3
   * Physical Prowess (The Runt)- subtract Priority to AC and Reflex or Strength Modifier
   * Personality / Looks (The Toady) - Subtract Priority to Personality Modifier
   * Health - Subtract Priority to Fortitude Modifier
 
#### The Pygmy
A Pigmy of a given group will tend to have the following:

* Decrease HitDice by 1d3+3 up the dice chain 
* Decrease Stamina modifier 2d3
* Decrease Strength modifier 2d3

#### The Fool
A fool of a given group will tend to have the following:
* Decrease Personality modifier by 1d3
* Decrease Intelligence Modifier by 1d3

#### With the Head of a...
* Man

* Bull
* etc...

#### With the Body of a...
* Man

* Bull
* etc...

#### Magical, Undead
When the body dies, the spirit and the mind must be properly dealt with.  Each religious tradition, deity, and demi-god has various plans on how this occurs and what to do.  Some cults and religions however will prescribe the creation of various forms of the undead under certain circumstances.  

#####  The Zombie
The zombie is a human being whose body is still alive, but their spirit and mind have been removed from the body.  The reasons for doing this can be because there are spirits who wish to use the body as a host.  Another example would be that the body is never given a spirit at all, but instead is given a simplistic mind set upon a given outcome.  Eventually the body may die, but the zombie will continue to control the remaining flesh, bones, and sinew.  

* Fast
* Contagious
* Traditional 
* Movie

##### The Mummy
The Mummy is human body who has died.  However through various techniques the spirit and the mind are still bound to this body.  This may be done by the person themselves who wishes to take this route to eternal life.  This can also be done by others who wish a person who has died to continue to live.  There are even cultures where this is attempted with victims of certain crimes.  In general this type of undead may also occur naturally if the spirit and the mind are not actually properly separated from the body in death.  The burial rituals of various cultures and religions are designed to insure that this occurs.

##### The Skeleton
The Skeleton is when someone attaches a mind to a skeleton of a creature.  This mind is given certain various simple commands to carry out.

##### The Ghost
When someone dies, their mind may linger roaming the world looking for their body or to accomplish some task that they as a human felt the need to accomplish.  In tragic cases this will be some seemingly impossible task.  This will trap the mind of the person in the physical realm.  A Ghost has very little personal memories of the person they were when they were merged with their body and their spirit.  They remain only as the archtype of who they were with the task or goal they needed to accomplish.  The more unique or memorable a person was in life, the more durable their ghost will be if the burial rituals are not performed.

##### The Spirit
When someone dies and their spirit lingers, the very nature of this person is still around.  Unlike a Ghost which is without a personality, the Spirit is all personality and will remember the details of their previous life.  In addition they will be able to continue to build new memories.  

#### Magical, Vampire

#### Magical, Were

#### Magical, Demonic
calculating, dark, with fiery highlights.

* TODO: Fix this
* Increase in Personality modifier by 1d3
* Prioritize the following for these creatures with a 1, 2, 3 and 4
   * Physical Prowess - Add Priority to AC and Reflex or Strength Modifier
   * Health - Add Priority to Fortitude Modifier
   * Increase Speed by 5' x priority
   * Horns, Claws, hooves, or Teeth - Increase Damage from one non-weapon attack by priority up the dice chain
* TODO: Add Spell
* TODO: Add Aura

#### Magical, Hideous
Ugly, Chaotic, random, insanity inducing 

* TODO: Fix this
* Increase in Personality modifier by 1d3
* Prioritize the following for these creatures with a 1, 2, 3 and 4
   * Physical Prowess - Add Priority to AC and Reflex or Strength Modifier
   * Health - Add Priority to Fortitude Modifier
   * Increase Speed by 5' x priority
   * Horns, Claws, hooves, or Teeth - Increase Damage from one non-weapon attack by priority up the dice chain
* TODO: Add Spell
* TODO: Add Aura

#### Magical, Doomed
Pitiable, an object lesson, extreme to the point of humiliation.  

* TODO: Fix this
* Increase in Personality modifier by 1d3
* Prioritize the following for these creatures with a 1, 2, 3 and 4
   * Physical Prowess - Add Priority to AC and Reflex or Strength Modifier
   * Health - Add Priority to Fortitude Modifier
   * Increase Speed by 5' x priority
   * Horns, Claws, hooves, or Teeth - Increase Damage from one non-weapon attack by priority up the dice chain
* TODO: Add Spell
* TODO: Add Aura

#### but with Claws!

TODO:  Move from D&D 5e to DCC

|Size     |Tiny |Small |Medium|Large |Huge  |Gargantuan|
|-------: |:---:|:----:|:----:|:----:|:----:|:--------:|
|Reach    | 0ft | 5ft  | 5ft  | 10ft | 10ft | 15ft |
|Bite     | 1d4 | 1d6  | 1d8  | 1d10 | 2d8  | 2d10 |
|Claw     | 1d4 | 1d4  | 1d6  | 1d8  | 1d10 | 2d8  |
|Gore     | 1d4 | 1d6  | 1d8  | 1d10 | 2d8  | 2d10 |
|Hoof     | 1d4 | 1d4  | 1d6  | 1d8  | 1d10 | 2d8  |
|Tentacle | 1d4 | 1d4  | 1d6  | 1d8  | 1d10 | 2d8  |
|Wing     | 1d4 | 1d4  | 1d6  | 1d8  | 1d10 | 2d8  |
|Pincers  | 1d4 | 1d6  | 1d8  | 1d10 | 2d8  | 2d10 |
|Tail Slap| 1d4 | 1d6  | 1d8  | 1d10 | 2d8  | 2d10 |
|Slam     | 1d4 | 1d4  | 1d6  | 1d8  | 1d10 | 2d8  |
|Stomp    | 1d4 | 1d4  | 1d6  | 1d8  | 1d10 | 2d8  |
|Sting    | 1d4 | 1d4  | 1d6  | 1d8  | 1d10 | 2d8  |
|Talons   | 1d4 | 1d4  | 1d6  | 1d8  | 1d10 | 2d8  |
{: .well .table .table-striped}





## Close Calls
Monster close calls are used to build tension and to give players a hint of foreshadowing.  They also give players that the world is a whole lot more detailed and immerse.  Here is an example of how these are used.  Lets say the players are off the planned map in an area 


### Tracks
What sort of tracks do these monsters leave?  Do they have feet, hooves, do they have tails that drag on the ground?  How may legs do they walk on?

### Remains
What sort of remains do these creatures leave?  Trash?  Bodies of prey or do they leave the victims alive?  Do they tend to leave feathers, horns, hair, fur, skin?  Do they do this sort of thing only during certain times of the year?  Or while they are engaged in certain social behaviors?  What does an abandoned watering hole or sleeping area look like?  Do they pad all the grass down in a certain way before they go to sleep?

### Markings
What sort of ways do these creatures mark their territory?  

### Droppings
What do droppings and scat look like from this creature?

## Not so Close Calls

### Their Lair 
Perhaps they are social.  Perhaps they are anti-social.  What happens when you meet them in their typical lair. 

### Encountered away from their Lair
Traveling, Hunting, Gathering, Fighting, Trading, Exploring, Patrolling, Scouting?

#### Travel 
Distance they can Travel in one day.  How long will they remain away from their Home. What sort of Travel?

Do they travel by:
* Land
* Air - close to ground
* Air - within ranged combat
* Air - within sight
* Air - Above sight
* Water
* other?

Why are they traveling
* Traveling
* Hunting
* Gathering
* Fighting

### Habitat
What sort of habitat does this creature live and travel in.  

## External Reactions
How do these creatures typically react to others

## How to hunt them
How difficult are these creatures to hunt and what sort of skills and equipment are needed.

## How to cook / eat them
Once they are hunted, how are they cooked.  Are they edible?  Are the poisonousness?  Are they a delicacy? 

### Mammal Meat
Roast, Soup, Stew, Ground, Steaks, Ribs, 

### Bird Meat
Breast, Leg, Thigh, Wing, Soup, Stew, 

### Lizard
Neck, Jaw, Torso & Body, Leg, Tail

## How to Harvest them
Once the meat is taken from their bones, what can you do with whats left?


 Creature | Part | Common Use| Effect of Use                                             | Value | DC  | Notes  | Shelf Life in days
----------:|:----:|:---------:|:---------------------------------------------------------:|:-----:|:---:|:------:|:-------------------
Ape        | Paw  | Trophy    | The paw is dried and mounted                              | 2     | 5   | -none- | 10
Ape        | Hide | Trophy    | The hide is skinned and cured, lined, and turned into a cape. | 8 | 18  | On an unsuccessful attempt, the item becomes leather | 10
Ape        | Hide | Trophy    | The hide is skinned and cured, lined, and stuffed.        | 8     | 18  | -none- | 10
Ape        | Hide | Practical | The hide can be skinned and cured and turned into Leather | 8     | 18? | -none- | 10
Badger     | Hide | Trophy    | The hide can be skinned and cured and turned into Leather

Badger

Hide Trophy/Practical 1 15 10
Claws Trophy 1 5 n/a




Paw Trophy 2 5 10
Hide Trophy/Practical 8 18 10

## Trophies and other  

### Trophies
Trophies consist of several things.  The first is a stuffed, dried, or otherwise preserved piece of the creature.  Another aspect of a Trophies is to integrate the body parts into clothing.  



* Alchemy
* Medical
* Practical


### Head
* Antenna
* Horns /Antlers
* Skull
* Eyes
* Teeth / Tusks
* Tongue
* Beak
* Brain
* Manibles


### Reproduction
* Egg


### Body Parts
* Hide
* Claws
* Feathers
* Stinger
* Paw / Hand / Feet / Toe
* Hooves
* Tail
* Spikes, Plates, and other carpace 
* Wings


### Body Parts
* Gizzard
* Heart
* Liver
* Blood
* Musk Gland
* Poison Sack
* Ink Sack
* Spores
* Blubber / Fat / Oil
