# Traveller Character Sheet Data Model

```mermaid
classDiagram
    Character "1" -- "6+" Characteristic : has
    Character "1" -- "0..*" Skill : has
    Character "1" -- "0..*" TrainingSkill : learning
    Character "1" -- "0..3" Education : completed
    Character "1" -- "0..*" Career : had
    Character "1" -- "1" Finances : manages
    Character "1" -- "0..*" Weapon : owns
    Character "1" -- "0..*" Armor : wears
    Character "1" -- "0..*" Equipment : possesses
    
    class Character {
        String charName
        String species
        Number age
        String homeworld
        String homeworldUWP
        Number rads
        String upp
        String notes
    }
    
    class Characteristic {
        String type
        Number current
        Number baseline
        Number DM()
    }
    
    class Skill {
        String name
        String specialization
        Number level
        Boolean isMandatorySpecialization()
    }
    
    class TrainingSkill {
        String skill
        String specialization
        Number weeksSpent
        Boolean canComplete()
    }
    
    class Education {
        String type
        Number years
        String outcome
        String benefits
    }
    
    class Career {
        String career
        String assignment
        Number promotions
        Number years
        String rank
        String benefits
        Number disciplineLevel
    }
    
    class Finances {
        Number credits
        Number pension
        Number debt
        Number cashOnHand
        Number livingCosts
        Number shipPayments
        Number shipCosts
        Number wealthLevel
        Number availableCash()
    }
    
    class Equipment {
        String name
        String tl
        Number mass
        Number cost
    }
    
    class Weapon {
        String name
        String tl
        String skill
        String damage
        Number range
        String weight
        String magazine
    }
    
    class Armor {
        String name
        Number rating
        String tl
        String radiation
    }
    
    Weapon --|> Equipment : is a
    Armor --|> Equipment : is a
    
    note for Character "Core entity representing player character"
    note for Characteristic "STR, DEX, END, INT, EDU, SOC, etc."
    note for Skill "Character abilities with levels 0-5+"
    note for TrainingSkill "Skills being learned (needs 8+ weeks)"
    note for Career "Military/civilian career history"
    note for Education "Pre-career education options"
```

## Relationships & Constraints

1. **Character to Characteristics**: One-to-many relationship where each character has exactly one value for each characteristic type (STR, DEX, END, INT, EDU, SOC, etc.)

2. **Character to Skills**: One-to-many relationship where a character can have many skills, but each skill entry belongs to only one character
   - Some skills require specializations as defined in the `skillSpecializations` object

3. **Character to Careers**: One-to-many relationship where a character can have multiple careers throughout their history
   - Each career has an associated discipline level (military: 1.0, disciplined: 0.5, other: 0.0)

4. **Career to Assignment**: Many-to-many relationship where each career can have multiple possible assignments, and assignments can exist across multiple careers
   - Rank titles are determined by career + assignment + promotion count combination

5. **Character to TrainingSkills**: One-to-many relationship where a character can be learning multiple skills simultaneously
   - When a training skill reaches 8+ weeks of training, it can be converted to a regular skill with level 1

6. **Character to Equipment**: One-to-many relationship where a character can own multiple items
