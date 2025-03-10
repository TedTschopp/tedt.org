flowchart TD
%% Start

Start(START) --> Gluttony
Start(START) --> Lust
Start(START) --> Wrath
Start(START) --> Vanity
Start(START) --> Sloth
Start(START) --> Greed
Start(START) --> Despair

%% Root causes (starting points)

Gluttony(["Gluttony*"]) --> Apathy
Gluttony --> Decay
Gluttony --> Selfishness

Lust(["Lust*"]) --> Deception
Lust --> Obsession
Lust --> BrokenRelationships[Broken Relationships]

Wrath(["Wrath*"]) --> Violence
Wrath --> Destruction
Wrath --> Hatred

Vanity(["Vanity*"]) --> Deception
Vanity --> Arrogance
Vanity --> BrokenRelationships[Broken Relationships]

Sloth(["Sloth*"]) --> Failure[Failure]
Sloth --> Apathy
Sloth --> Decay

Pride(["Pride*"]) --> Arrogance[Arrogance]
Pride --> Ignorance
Pride --> BrokenRelationships

Greed(["Greed*"]) --> Deception
Greed --> Betrayal
Greed --> Conflict

Despair(["Despair*"]) --> Apathy
Despair --> Hopelessness
Despair --> Decay



%% Second level connections

Obsession --> BrokenRelationships[Broken Relationships]
Obsession --> Betrayal
Obsession --> Conflict

Apathy --> Despair
Apathy --> Decay
Apathy --> Failure

Arrogance --> BrokenRelationships[Broken Relationships]
Arrogance --> Folly
Arrogance --> Ignorance

Betrayal --> BrokenRelationships[Broken Relationships]
Betrayal --> Conflict
Betrayal --> LastingWounds[Lasting Wounds]

Bitterness --> Hatred
Bitterness --> Revenge
Bitterness --> Apathy

BrokenRelationships --> Apathy
BrokenRelationships --> Conflict
BrokenRelationships --> Destruction

Conflict --> Destruction
Conflict --> Hatred
Conflict --> Violence

Decay --> Destruction
Decay --> Apathy
Decay --> Despair

Deception --> Betrayal
Deception --> Conflict
Deception --> Destruction

Destruction --> Suffering
Destruction --> Decay
Destruction --> Despair

Failure --> Bitterness
Failure --> Despair
Failure --> Hopelessness

Folly --> Ignorance
Folly --> Failure
Folly --> Destruction

Hopelessness --> Apathy
Hopelessness --> Despair
Hopelessness --> Failure

Ignorance --> Bitterness
Ignorance --> Folly
Ignorance --> Suffering

LastingWounds --> Bitterness
LastingWounds --> Hatred
LastingWounds --> Despair

Rebellion --> Conflict
Rebellion --> Destruction
Rebellion --> Betrayal

Revenge --> Hatred
Revenge --> Violence
Revenge --> Destruction

Suffering --> Despair
Suffering --> Bitterness
Suffering --> Hatred

Violence --> Destruction
Violence --> Hatred
Violence --> Suffering

%% TO BE SORTED


Hatred --> Violence
Hatred --> Destruction
Hatred --> Suffering


