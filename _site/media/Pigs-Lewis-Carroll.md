Below is a systematic “logic‑unpacking” of the nine sentences, parallel to the method I used for your kitten example.
I translate each remark into a clean **IF … THEN …** rule, weave the rules together, and list every strong consequence they jointly force.
Throughout, italics represent *predicates* that can be true or false of any creature.

---

### 1.  Translate every sentence

| #   | Original wording                                                                                                    | Logical rule (plain‑English “if … then …”)                                              |
| --- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
|  1  | “All who **neither dance on tight‑ropes nor eat penny‑buns** are **old**.”                                          | If a creature *does **not** dance* **and** *does **not** eat penny‑buns* → it is *old*. |
|  2  | “**Pigs** that are **liable to giddiness** are **treated with respect**.”                                           | If *pig* **and** *giddy* → *respected*.                                                 |
|  3  | “A **wise balloonist** takes an **umbrella** with him.”                                                             | If *wise* **and** *balloonist* → *carries umbrella*.                                    |
|  4  | “No one ought to **lunch in public** who **looks ridiculous and eats penny‑buns**.”                                 | If *ridiculous* **and** *eats buns* → *must not lunch in public*.                       |
|  5  | “**Young** creatures who **go up in balloons** are **liable to giddiness**.”                                        | If *young* **and** *balloonist* → *giddy*.                                              |
|  6  | “**Fat** creatures who **look ridiculous** **may** lunch in public, **provided they do not dance** on tight‑ropes.” | If *fat* **and** *ridiculous* **and** *not dancing* → *may lunch in public*.            |
|  7  | “No **wise** creatures **dance** on tight‑ropes, **if liable to giddiness**.”                                       | If *wise* **and** *giddy* → *do not dance*.                                             |
|  8  | “A **pig** looks **ridiculous** carrying an **umbrella**.”                                                          | If *pig* **and** *carries umbrella* → *ridiculous*.                                     |
|  9  | “All who **do not dance** on tight‑ropes **and** who are **treated with respect** are **fat**.”                     | If *not dancing* **and** *respected* → *fat*.                                           |

*(The deontic notions “ought not” and “may” behave like ordinary predicates here: **may‑lunch** vs **must‑not‑lunch**.)*

---

### 2.  See how the rules chain together

Below is the main “river” of implications, with each arrow citing the rule that fires:

```
young ∧ balloonist
        └─(5)→ giddy
wise ∧ giddy
        └─(7)→ not‑dancing
wise ∧ balloonist
        └─(3)→ umbrella
pig ∧ umbrella
        └─(8)→ ridiculous
giddy ∧ pig
        └─(2)→ respected
not‑dancing ∧ respected
        └─(9)→ fat
fat ∧ ridiculous ∧ not‑dancing
        └─(6)→ may‑lunch
ridiculous ∧ eats‑buns
        └─(4)→ must‑not‑lunch
not‑dancing ∧ not‑eats‑buns
        └─(1)→ old
```

So, depending on which starting traits a creature has (pig? wise? young?), the arrows switch on in different orders, but they never contradict *facts* such as “is fat” or “is old”.  The only possible tension is between the **may‑lunch** and **must‑not‑lunch** predicates (see §4).

---

### 3.  What the nine rules *force* in every case

Below is a compact “query table”.  Read any line as “If a creature has the property on the left, the properties on the right are compelled.”

| Given …                            | Forced consequences                                |
| ---------------------------------- | -------------------------------------------------- |
| **pig & giddy**                    | respected (2)<br>if **also not‑dancing** → fat (9) |
| **pig & umbrella**                 | ridiculous (8)                                     |
| **wise & balloonist**              | umbrella (3)                                       |
| **wise & giddy**                   | not‑dancing (7)                                    |
| **young & balloonist**             | giddy (5)                                          |
| **not‑dancing & not‑eats‑buns**    | old (1)                                            |
| **not‑dancing & respected**        | fat (9)                                            |
| **fat & ridiculous & not‑dancing** | may‑lunch (6)                                      |
| **ridiculous & eats‑buns**         | must‑not‑lunch (4)                                 |

Everything else is *optional*—the rules leave it undecided.

---

### 4.  A single point of potential conflict

The only place two rules can collide is over public lunching:

* **Rule 6** grants permission (“may lunch”) to anyone **fat & ridiculous & not‑dancing**.
* **Rule 4** forbids lunching (“must not lunch”) to anyone **ridiculous & eats‑buns**.

So a creature that is **fat, ridiculous, not‑dancing, *and* eats penny‑buns** simultaneously satisfies *both* antecedents.  That creature is *both* permitted and forbidden to lunch—an explicit normative clash the premises themselves create.  Aside from this deontic contradiction, the factual predicates remain perfectly consistent.

---

### 5.  Two illustrative “stories”

**(a) A *wise young pig* who insists on ballooning**

1. *young* + *balloonist* → giddy (5)
2. pig + giddy → respected (2)
3. wise + giddy → not‑dancing (7)
4. wise + balloonist → umbrella (3)
5. pig + umbrella → ridiculous (8)
6. not‑dancing + respected → fat (9)
7. fat + ridiculous + not‑dancing → **may‑lunch** (6)

   *Unless the pig also gobbles penny‑buns (which would add a “must‑not‑lunch” tag via rule 4), this airborne philosopher‑pig is free to picnic in public.*

---

**(b) An *ordinary creature* that neither dances nor eats buns**

*not‑dancing* + *not‑eats‑buns* → **old** (1).
No further facts follow, and no conflicts arise.

---

### 6.  Bottom line

* The rule‑set is **factually consistent**—it never forces a creature to be both fat and not‑fat, young and not‑young, etc.
* It **does** allow a *normative* inconsistency (may‑vs‑must‑not lunch) for the special case *fat & ridiculous & not‑dancing & eats‑buns*.
* Apart from that pocket of tension, every implication is a clean one‑way street like the kitten chain you tackled before.
