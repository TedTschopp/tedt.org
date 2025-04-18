Be an author.  I'm going to give you a set of instructions to follow to create a novel.  Please follow them.  Start by asking me who the main character is and how many paragraphs to output.  Then integrate that response with the {Output}.

{Phonetic Construction}

vsets = ["AIU", "AEIOU", "AEIOUaei", "AEIOUu", "AIUai", "EOU", "AEIOU@0u"]
csets = ["PTKMNSL", "PTKBDGMNLRSsZzc", "PTKMNH", "HKLMNPW'", 
         "PTKQVSGRMNnLJ", "TKSsDBQgxMNLRWY", "TKDGMNSs",
         "PTKBDGMNzSZcHJW"]
lsets = ["RL", "R", "L", "WY", "RLWY"]
ssets = ["S", "Ss", "SsF"]
fsets = ["MN", "SK", "MNn", 'SsZz']
syllsets = ["CVV?C", "CVC", "CVVC?", "CVC?", "CV", "VC", "CVF", "C?VC", "CVF?", 
            "CL?VC", "CL?VF", "S?CVC", "S?CVF", "S?CVC?", 
             "C?VF", "C?VC?", "C?VF?", "C?L?VC", "VC",
           "CVL?C?", "C?VL?C", "C?VLC?"
           ]
vorthos=[{'a': u'á', 'e': u'é', 'i': u'í', 'u': u'ü', '@': u'ä', '0': u'ö'},
         {'a': u'au', 'e': u'ei', 'i': u'ie', 'u': u'oo', '@': u'ea', '0': u'ou'},
         {'a': u'â', 'e': u'ê', 'i': u'y', 'u': u'w', '@': u'à', '0': u'ô'},
         {'a': u'aa', 'e': u'ee', 'i': u'ii', 'u': u'uu', '@': u'ai', '0': u'oo'}]
corthos = [{'n': 'ng', 'x': 'kh', 's': 'sh', 'g': 'gh', 'z': 'zh', 'c': 'ch'},
           {'n': u'ñ', 'x': 'x', 's': u'š', 'g': u'gh', 'z': u'ž', 'c': u'č'},
           {'n': u'ng', 'x': 'ch', 's': u'sch', 'g': u'gh', 'z': u'ts', 'c': u'tsch'},
          {'n': u'ng', 'x': 'c', 's': u'ch', 'g': u'gh', 'z': u'j', 'c': u'tch'},
          {'n': u'ng', 'x': 'c', 's': u'x', 'g': u'g', 'z': u'zh', 'c': u'q'}]
restricts = ['Ss', 'sS', 'LR', 'RL', "FS", "Fs", "SS", "ss", r"(.)\1"]

{Templates}

one = <one|a traveller|the traveller>
atraveller = <a|the> traveller
travel = <travel|journey|go>
people = <citizens|farmers|merchants|priests|the idle rich|
          [petty] criminals|soldiers|artisans|actors|the bourgeoisie|
          scholars|philosophers|writers|labourers>
thecity = <the city
          |the surrounding countryside
          |a nearby village
          |@city
          |the @district>

beast = [<horned|mighty|shaggy|hairy>] \word{beast}

national = <national|sacred>
beastdesc = @beast, <the @national animal of @region|
         bred for <racing|work|show> by the @people of @thecity|
         <prized|valued|beloved> for their <milk|meat|horns|leather>>

golden = <golden|silver|copper|bronze|ivory|chryselephantine|crystal|gleaming|
          glistening|obsidian|jade|emerald|ruby|diamond|sapphire|bone-white|
          sandstone|marble|limestone|granite|basalt>

spires = <spire|spires|tower|towers|roof|clock-tower|lookout|vaulted roof|dome>
temple = <temple|citadel|palace|prison|counting-house|mint|market-hall|theatre|
          university|dancing-hall|fortress|barbican|castle|watchtower|bastion>

great = <great|mighty|famous|colossal|immense|vast|tremendous|monumental|
        gargantuan|celebrated|famed|infamous|monstrous|iniquitous>

aseriesof = [<a series of|scattered|crowds of>]
playing = <trying their luck|practising their skill|showing off>
playinggame = @playing <on the \word{game} <tables|court|field|board>|
                        at [the game of] \word{game}>

merchants = <merchants|fruit-sellers|goldsmiths|silversmiths|fishmongers|
             hawkers|pedlars>
merchanting = <hawking their wares|
               setting out their stalls>
sight = <@beastdesc|
         @people, @activity|
         @aseriesof @merchants, @merchanting>

see = <see|encounter|come across|catch sight of|find|stumble upon>
seefar = <see|catch sight of|espy|make out|discern|observe>

fromhere = <<from|at> <this|such a <great|large>> distance|
            from here|from so far>

cannot = <cannot|is unable to|has no way to>
flock = <flock|gather|mill|lounge|teem|congregate|crowd|throng|cluster|
         swarm>
base = <base|walls|doors|door|gates|gate>
avoid = <avoid|stay away from|steer clear of|shun|hide from>

activity = <@playinggame|@xing|@xing and @xing>

form = <form|architecture|bulk>
distasteful = <distasteful|disagreeable|unsavoury|repellent|obscene>

although = <although|though|while|despite the fact that|even though>
seems = <seems|appear|may seem|may appear|looks|may look>
beautiful = <beautiful|alluring|elegant|quaint|magnificent|enchanting>
citizens = <citizens|people|denizens|natives>
distantbuilding = <@fromhere, @one @cannot @seefar
         how @people <@flock <around|by|near> <its [@golden] @base|it>[, @activity]|
         @avoid it[, @activity]>
        |@although @fromhere it @seems @beautiful, [the] @citizens of <@city|the city> 
         find its @form @distasteful, and @avoid it>

xing = <laughing|talking|singing|dancing|telling stories|praying>
seeasight = <@see @sight|
             @seefar [the @golden @spires of] the @great @temple of
             ^\name{building} [. ^@distantbuilding]>

road = <road|route|track>
busy = <well-trodden|busy|crowded>
longtime = <several|many|some|two|three>
           <days|weeks>
shorttime = <<a few|a couple of|two|three> hours|
             half a day|an afternoon>
longjourney = The @road is <long|arduous>, but <rewarding|scenic>, 
              taking @longtime.

shortjourney = The @road is @busy, and the journey takes but @shorttime.

pleasant = <pleasant|enjoyable|agreeable|delightful|smooth|simple>
journey = It is a(n) @pleasant journey.

fromtravel = <From|Leaving|Onwards from> @lastcity @one <may|can> @travel 
             [@direction] to @city.
             <\if{@islandjourney|@roadtravel}
             |\if{@isseajourney|@seatravel}>

roadtravel = [<\if{@far|@longjourney}|
             \if{@near|@shortjourney}|
             @journey>]
             \some{
             ^@roadsidesee|
             ^@enterregion|
             ^@oncecross
             }

seatravel = [^@seaboat]
            \some{
            ^@seafish|
            ^@seaweather|
            ^@seabirds|
            ^@seaeating
            }

shiny = <brightly-coloured
        |iridescent
        |vividly striped
        |silver
        |vermillion
        |turquoise
        |jet-black>

bytheboat = <off the <bow|stern|sides>
            |by the side of the boat
            |near [the side of] the boat
            |in the water nearby>
lotsoffish = [<shoals of|numerous|great numbers of>] [@shiny] [\word{fish}] fish
thereare = <@one can [@often] see|there are @often>
canbeseen = <can|may> @often be @seen
swimmingaround = <darting through the water
                 |@shining in the sunlight
                 |barely visible beneath the <waves|surf|surface>
                 |leaping from wave to wave
                 |<moving|bobbing and weaving> in unison>

shining = <gleaming|glistening|shining>

seen = <seen|spotted|observed>
seafish = <@bytheboat @thereare @lotsoffish|
          |@thereare @lotsoffish @bytheboat
          |@thereare, @bytheboat, @lotsoffish
          |@bytheboat @lotsoffish @canbeseen
          |@lotsoffish @canbeseen [@bytheboat]>
          [, @swimmingaround].

route = <route|crossing>
boat = <boat|ship|vessel>
boats = <boats|ships|vessels|craft>
busysea = <well-traficked|busy>
traffic = <traffic|sail|traverse|cross>
routebusy = <<this|the> @route is @busysea
            |many @boats @traffic these waters>
seaboat = [<@routebusy, <and|so>|as @routebusy,>]
          @one can @often 
          <obtain passage on
          |charter
          |find space on>
          a(n) [<small>] [<trading|fishing>] @boat.

badweather = <<bad|foul|stormy> weather conditions
             |storms
             |gales
             |squalls>

torment = <torment|trouble|plague|beset>
tormented = <tormented|troubled|plagued|beset>

inthesewaters = <in these waters
                |in this area
                |near here>

tormentboats = [@often] @torment @boats
badforboats = <@badweather @tormentboats
              |@boats are [@often] @tormented by @badweather>

despite = <despite|in spite of|even with|notwithstanding>
remarkably = <remarkably|quite|surprisingly|very|extremely>
goodseavoyage = the @route is [@remarkably] <safe|easy|pleasant|comfortable>
seaweather = <@badforboats @inthesewaters [, but @goodseavoyage]
             |@inthesewaters, @badforboats [, but @goodseavoyage] 
             |@despite the @badweather [which @tormentboats [@inthesewaters]], @goodseavoyage
             |@goodseavoyage, @despite the @badweather [which @tormentboats [@inthesewaters]]
             |@although @goodseavoyage, @badforboats [@inthesewaters]>.

seaingredient = <\word{fish} fish
                |\word{bird} [bird] meat
                |turtle meat
                |seaweed
                |\word{plant} fruit>

grilled = <grilled|boiled|braised|salted|dried>

soup = <soup|broth|stew>
hearty = <hearty|thin|piquant>
spiced = <spiced|flavoured|garnished>
seafood = <a(n) [@hearty] @soup made of @seaingredient and @seaingredient
          |@grilled @seaingredient>
          [, @spiced with \word{plant} <flowers|root|leaves|seed|berries>]
food = <food|supplies|meals>
sailors = <sailors|fishermen|crew>
thesailors = <the @sailors
             |@sailors and passengers alike
             |both @sailors and passengers>
sour = <sour|clean|citric|nutty|dark|rich|meaty|bitter|sweet|spicy>

seaeating = <@thesailors @eat @seafood
            |@one <may|will> enjoy @seafood, as eaten by @thesailors>.
            [^ @flavourcountry [, <mingling with|enriched by> the salty air].]

tasty = <tasty|delicious|enchanting>
flavour = <flavour|taste>
flavourcountry = <the @flavour is @sour [, but @sour]
                 |the @sour @flavour is @tasty>

eat = <eat|subsist on|snack on>
lotsofbirds = [flocks of] <\word{bird} birds|seabirds>
onecanhear = @one <can|may> <hear|see>
shore = <shore|coast|land's edge>
neartheshore = <@near the @shore>
near = <near|close to|not far from>
doingbird = <circling overhead
            |diving for [\word{fish}] fish
            |riding the @wind>
seabirds = <@neartheshore, @onecanhear @lotsofbirds
           |@onecanhear @lotsofbirds @neartheshore
           |@neartheshore @lotsofbirds @canbeseen
           |@lotsofbirds @canbeseen @neartheshore>
           [, @doingbird].

gorge = <gorge|chasm|ravine|canyon|gully>
valley = <valley|rift|depression>

oncecross = <at one point|along the way> the @road crosses a
            <deep @gorge|broad @valley>[, spotted with @plants].
side = <side|edge|verge|bank|fringe> 
roadside = <@side of the @road|
            roadside|
            @road>

byroad = <by|near|on> the @roadside

roadsidesee = <@byroad, @roadsidethings|
               @roadsidethings @byroad>.

roadsidethings = <@plants grow|
                  @beast graze>

foliage = <foliage|greenery|vegetation>
thickets = <thickets|groves|clumps|copses|woods>
wildplants = <[wild] @plants|open fields|hedgerows|@thickets of @plants|
              meadows|scrubland|pastures>
bluish = <bluish|golden|grey|pale|harsh>
landscape = <landscape|terrain|land|countryside>
change = <change|shift|variation>
stuffchanges = <the @foliage changes, giving way to @wildplants and @wildplants|
                there is a @change in the [quality of the] light, and a @bluish 
                cast falls <across|over|upon> the @landscape>
enters = <enters|crosses [the border] into>
enterregion = <as|when> @one @enters @region, @stuffchanges.
outside = <<near|at|on reaching|nearing|approaching> the 
            <edge|gates|outskirts|walls> of|
           <outside|near to|entering|on entering|passing into>>

slightly = <slightly|a little|somewhat>
closer = [@slightly] <closer|nearer>
town = <city|city|city|metropolis>
namecity = <[@great] @city|
            the [@great] @town|
            the [@great] @town of @city>

arriving = ^<@outside @namecity
            @one <will|can|may> @seeasight.|
            @atraveller, @outside @namecity, <will|can|may> @seeasight.>
           ^@closer to the <centre|heart|inner parts> of the city, 
           @one <will begin to|begins to|can faintly|will> 
           hear @hearthing.
           ^@finally the @smell of @smellythings fills the @wind, and
           @one <is @truly in @city|has @truly arrived>.

truly = <truly|without a doubt|undoubtedly|undeniably|surely|beyond doubt>

finally = <finally|at last|ultimately|eventually|in the end>
fruit = \word{fruit} fruit
smellythings = <@plants|@fruit>
district = <Merchants'|Ancient|Actors'|New|Old|Artisans'|Temple|Fishmongers'|
            Tailors'|Red|Green|Blue|Grey|Goldsmiths'>
           <Quarter|District> 
fragrant = <fragrant|delicate|red|emerald|blue|yellow|golden>
blossoms = <blossoms|leaves|petals>
sway = <sway|rustle|whisper|shimmer>
timeofday = [<early|late>] <night|morning|afternoon|evening>
smell = <smell|scent|fragrance|aroma|perfume|musk|bouquet>
nice = <pleasant|sweet|gentle|delicate|balmy>
wind = <breeze|wind|air>
plantdesc = <the @fragrant @blossoms @sway in the [@timeofday] @wind|
             the @nice @smell fills the @timeofday @wind>
stone = <stone|granite|basalt|bronze|sandstone|limestone|marble|
         ivory|obsidian|lead|\word{stone} stone>
plants = \word{plant} <trees|flowers|plants|bushes>
streets = <streets|back-streets|alleyways|squares|plazas|roadways|boulevards>
streetdesc = <lined with @plants[, and @plantdesc]|
              paved with @stone[, inlaid with @stone]>

educational = <educational|instructive|edifying|humbling>
sacred = <sacred|holy|famous|revered|intricate>
procession = <procession|parade|dance|ceremony|ritual>
fight = <fight|quarrel|argument|squabble|altercation>

event = <a game of \word{game}|
         a herd of @beastdesc|
         @people @xing|
         a(n) @fight between two lovers|
         the @sacred ^\name{event} @procession>

difficult = <difficult|hard|tricky|almost impossible>
unabletoleave = <unable to leave|
                 find it @difficult to escape|
                 @maybesometime>

maybesometime = it <may|can> be @shorttime before escape is possible
eventoutcome = <@maybesometime|
                @one <may|might> be drawn in, and @unabletoleave|
                it <may|can> be a(n) [<very|most>] @educational experience>

lucky = <lucky|fortunate|blessed|charmed|unlucky|unfortunate|ill-fated>

luckyposs = <if @one is|should @one be|
            in the event that @one is>
            <@lucky enough|so @lucky as> to @see @event, @eventoutcome.

miss = <miss|fail to see|not notice|overlook>
careless = <careless|inattentive|hasty|distracted>
observer = <observer|traveller|visitor>

decorate = <decorate|adorn|grace|ornament>
statues = <statues|figurines|figures|gargoyles|carvings|columns|medallions>
rooftops = <rooftops|eaves|lintels|pediments|walls|balustrades|doorways|archways>
caged = <caged|tame>
decorations = <the @stone @statues <which|that> @decorate the @rooftops|
               the @plants|
               the @caged \word{bird} birds>
impressed = <impressed|inspired|humbled>
notice = <see|notice|take note of|be @impressed by>

actas = <act as|serve as|function as|are>
warning = <warning|deterrent|caution>
evil = <evil|malign|unwanted|hostile|harmful>
spirits = <spirits|influences>
deter = <ward off|warn off|deter|repel>
warn = <@actas a(n) @warning to|
        [<act to|serve to>] @deter>
plague = <plague|pestilence|war|sickness|revolution>

recently = <recently|long ago|not long ago|in times past|twenty years ago>
ravaged = <ravaged|devastated|beset|troubled|tormented|engulfed>
reminder = <reminder|memento|relic|vestige>
remember = <<call to mind|commemorate|are in memory of>
            |@actas a(n) @reminder of>

indicate = <indicate|mark|signify|denote|betoken>
home = <home|shop|place of business|workplace>

professional = <doctor|artisan|fortune-teller|smith|apothecary>
obvious = <obvious|clear|conspicuous|apparent|easy to see|@difficult to miss>
decosent = <<a(n) @careless @observer will @miss|
             @one will @notice>
            @decorations.|
            @decorations will be @obvious [to @one].>
            ^
           <these @warn @evil @spirits|
            these @remember the @plague which @recently @ravaged
            @thecity|
            these @indicate the @home of a(n) @professional>.

bells = <bells|chimes|tolling|knell|peal|clanging|sound|striking>
sad = <mournful|desolate|sorrowful|doleful|melancholy|heavy-hearted|
       forlorn|sombre|elegiac|dirgeful|plaintive>
happiness = <joy|exuberance|delight|pleasure|ecstasy|bliss|glee>
happy = <joyous|exuberant|ecstatic|blissful|gleeful|merry|ebullient|
         mirthful|hopeful|buoyant>
sadness = <melancholy|gloom|misery|dejection|sadness>

often = <often|usually|sometimes|occasionally|typically>
songs = songs of <@sad @happiness|@happy @sadness>
soundsent = [in the @timeofday,] @one <can|may> @often hear @hearthing.
hearthing = <the [@nice] song of the \word{bird} birds[, kept by @people]|
             the @bells of the @temple clock|
             @songs, sung by @people of @thecity>

closeto = <near|close to|around|in the vicinity of>

atlocation = <in the @district [of the city]|
              @closeto the @temple [of ^\name{building}]>
indistrict = ^@atlocation, the @streets are @streetdesc.
            \some{
            ^@people @flock here, @activity.|
            ^@luckyposs|
            ^@decosent|
            ^@soundsent
            }

{Output}

description = \if{@lastcity|@fromtravel ~} @arriving ~ @indistrict

