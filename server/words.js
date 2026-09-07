// Curated dictionary of common English words (3-5 letters), used to build
// the word-ladder graph. Kept dense in common patterns so ladders like
// COLD -> WARM resolve reliably.

const WORDS = `able ache acid acre aged ages airy also amid arch area army arts ashy
atom aunt auto avid away axis baby back bail bait bake bald bale ball balm band bane
bang bank bard bare bark barn base bash bass bath bead beak beam bean bear beat beef
been beer bees bell belt bend bent best bike bile bill bind bird bite blob blot blow
blue blur boar boat body boil bold bolt bomb bond bone book boom boot bore born boss
both bowl bows brag bran bred brew brim brow buck bulb bulk bull bump bunk burn burp
bush bust busy cage cake calf call calm camp cane cape card care carp cart case cash
cast cave cede cell chap chat chef chew chic chin chip chop city clad clam clan clap
claw clay clip clog club clue coal coat code coil coin coke cold colt come cone cook
cool cope cord core cork corn cost cove cozy crab crew crib crop cube cure curl curt
cute daft dame damp dare dark dart dash data date dawn days dead deaf deal dean dear
debt deck deed deep deer deft defy deny desk dial dice diet dime dine dirt dish disk
dive dock doer does dole doll dome done doom door dose dove down doze drag draw drew
drip drop drug drum duck dude dull duly dumb dump dune dust duty each earn ease east
easy eats echo edge edit eels else envy epic euro even ever evil exam exit face fact
fade fail fair fall fame fang fare farm fast fate fear feat feed feel fees feet fell
felt fend fern fest feud fewd file fill film find fine fire firm fish fist five flag
flap flat flaw fled flee flew flex flip flop flow foam foil fold folk font food fool
foot ford fore fork form fort foul four free frog from fuel full fume fund fury fuse
gain gala gale game gang gaps gash gate gave gaze gear gene gift girl give glad glow
glue goal goat gold golf gone good gore gown grab gray grew grid grim grin grip grit
grow gulf gulp gush gust hail hair half hall halo halt hand hang hard hare harm harp
hash hate haul have hawk haze head heal heap heap hear heat heed heel heir hell helm
help herb herd here hero hide high hike hill hint hire hive hold hole holy home hood
hoof hook hope horn hose host hour huge hull hunt hurl hurt hush hymn icon idea idle
inch info into iris iron item jail jazz jean joke july jump june junk jury just keen
keep kelp kept keys kick kid kill kilt kind king kiss kite knee knew knit knob knot
lace lack lady laid lake lamb lame lamp land lane lard lark last late lava lawn lead
leaf leak lean leap left lend lens lent less lick lied lies life lift like limb lime
limp line link lint lion list live load loaf loan lobe lock loft logo lone long look
loom loop loot lord lose loss lost loud love luck lung lure lurk lush lust luxe lynx
made mail main make male mall mane many maps mare mark mars mash mask mass mast mate
maze mead meal mean meat meet melt memo mend mens mesh mesa mice mild mile milk mill
mind mine mint mist mode mold mole molt monk mood moon moor moot more moss most moth
move much mule mull mums must mute myth nail name nape navy near neat neck need neon
nerd nest nets news next nice nine node none nook noon norm nose note nova nuke numb
oaks oath oats obey odor okay omen once only onto open opts oral over pace pack pact
page paid pail pain pair pale palm pane pang pans pant park part pass past path pave
peak peal peat peck peel peer pelt pens perk pest pets pick pier pike pile pill pilot
pine pink pint pipe pity plan play plea plot plow ploy plug plum plus poem poet poke
pole poll pond pony pool poor pore port pose posh post pour pray prep prey prod prom
prop pull pulp pump pure push quad quay quit quiz race rack raft rage rail rain rake
ramp rang rank rant rare rash rate rave raze read real reap rear reed reef reel rely
rent rest rice rich ride rift rill ring rink riot ripe rise risk rite road roam roar
robe rock rode role roll roof room root rope rose rosy rout rove rows rude rule rung
runs runt rush rust safe sage said sail sake sale salt same sand sane sang sank sash
save scab scan scar seal seam sear seas seat sect seed seek seem seen self sell send
sent sept sets shed shin ship shoe shop shot show shut sick side sift sigh silk sill
silo sine sing sink site size skew skid skim skin skip skit slab slam slap slat slay
sled slid slim slip slit slow slug slum slur smog snap snip snow soak soap soar sock
sofa soil sold sole solo some song soon sore sort soul soup sour sown spam span spar
spat sped spin spit spot spun spur stab stag star stay stem step stew stir stop stub
stud stun such suit sulk sung sunk sure surf swab swam swan swap swat sway swim tack
tail take tale talk tall tame tank tape task taut teal team tear teas tech teen tell
tend tent term test text than that them then they thin this thud thug tick tide tidy
tied tier tile till tilt time tint tiny tips toad toe toed toes told toll tomb tone
tong took tool toot torn tour town trap tray tree trek trim trip trot true tuba tube
tuck tuna tune turf turn twin type ugly undo unit upon urge used user vain vale vane
vase vast veer veil vein vent verb very vest veto vibe vice view vine visa vise void
volt vote wade wage wail wait wake walk wall ward ware warm warn warp wart wash wasp
wave wavy waxy weak wear weed week weep well went were west what when whim whip whir
whom wick wide wife wild will wind wine wing wink wipe wire wise wish with wolf womb
wood wool word wore work worm worn wrap yard yarn yawn year yeah yell yoga yolk your
zeal zero zest zinc zone`;

const WORD_LIST = WORDS.split(/\s+/).filter(Boolean);
const WORD_SET = new Set(WORD_LIST);

module.exports = { WORD_LIST, WORD_SET };
