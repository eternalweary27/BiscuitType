const canvas = document.getElementById("canvas");
canvas.width = innerWidth * 0.7;
canvas.height = innerHeight * 0.9;
const ctx = canvas.getContext("2d");

const BACKGROUND_COLOUR = "black";
const BONUS_BACKGROUND_COLOUR = "#3D0A0A";
const TEXT_FONT = '14px "Press Start 2P"';
const START_SCREEN_TEXT_FONT = '20px "Press Start 2P"';
const START_SCREEN_TEXT_COLOUR = "lime"
const CONTROLS_TEXT_COLOUR = "green";
const GAME_OVER_TEXT_FONT = '20px "Press Start 2P"';
const GAME_OVER_TEXT_COLOUR = "red";
const RESTART_TEXT_FONT = '16px "Press Start 2P"';
const RESTART_TEXT_COLOUR = "pink";
const PANEL_TEXT_FONT = '16px "Press Start 2P"';
const TEXT_COLOUR_DEFAULT = "lime";
const TEXT_COLOUR_MEDIUM_DANGER = "yellow";
const TEXT_COLOUR_HIGH_DANGER = "red";
const HIGHLIGHT_TEXT_COLOUR_DEFAULT = "#71FDCA";
const HIGHLIGHT_TEXT_COLOUR_MEDIUM_DANGER = "#FFDF86";
const HIGHLIGHT_TEXT_COLOUR_HIGH_DANGER = "#FF4E95";
const BONUS_TEXT_COLOUR = "cyan";
const POINTS_TEXT_COLOUR = "red";
const CURRENT_INPUT_TEXT_COLOUR = "#A4FC4C";
const WPM_TEXT_COLOUR = "orange";
const LIVES_TEXT_COLOUR = "lime";
const LANGUAGE_TEXT_COLOUR = "pink";
const DIFFICULTY_TEXT_COLOUR = "magenta";
const TEXT_PADDING = 2;

const EASY_TEXT_SPEED = canvas.width / -800;
const MEDIUM_TEXT_SPEED = EASY_TEXT_SPEED * 1.35;
const HARD_TEXT_SPEED = MEDIUM_TEXT_SPEED * 1.08;
var TEXT_SPEED = MEDIUM_TEXT_SPEED;
var current_text_speed = TEXT_SPEED;
const EASY_SPEED_INCREASE_PERCENT = 1.05;
const MEDIUM_SPEED_INCREASE_PERCENT = 1.07;
const HARD_SPEED_INCREASE_PERCENT = 1.08;
var SPEED_INCREASE_PERCENT = MEDIUM_SPEED_INCREASE_PERCENT;
const EASY_SPEED_LIMIT = EASY_TEXT_SPEED * 1.65;
const MEDIUM_SPEED_LIMIT = MEDIUM_TEXT_SPEED * 1.70;
const HARD_SPEED_LIMIT = HARD_TEXT_SPEED * 1.95;
var SPEED_LIMIT = MEDIUM_SPEED_LIMIT;
var display_difficulty = "Medium";
var display_language = "English";
var current_language = "english";

const STAR_COLOUR = "white";
const MAX_STAR_SPEED = canvas.width / 310;
const MIN_STAR_RADIUS = canvas.width / 900;
const MAX_STAR_RADIUS = canvas.width / 500;
var current_stars = [];
const PLATFORM_HEIGHT_PERCENT = 0.15;
const PLATFORM_COLOUR = "blue";

var WORDS_FILENAME = "english.txt";
var ALL_WORDS = [];
const ENGLISH_FILENAME = "english.txt";
const ENGLISH_BONUS_WORDS = ["bioengineering", "circumnavigation", "disenfranchisement", "electrophysiology", "gastrointestinal", "immunodeficiency", "indistinguishable", "intercontinental", "internationalization", "micromanagement", "misrepresentation", "neurotransmitter", "overgeneralization", "photoautotrophic", "psychotherapeutic", "radiotelegraphy", "suboptimization", "thermoregulation", "unquestionably", "weatherization", "extraterrestrial", "heterogeneous", "juxtaposition"];
const FRENCH_FILENAME = "french.txt";
const FRENCH_BONUS_WORDS = ["bioingénierie", "circumnavigation", "désenfranchissement", "électrophysiologie", "gastro-intestinal", "immunodéficience", "indistinguable", "intercontinental", "internationalisation", "micromanagement", "mauvaise représentation", "neurotransmetteur", "surgénéralisation", "photoautotrophe", "psychothérapeutique", "radiotélégraphie", "sous-optimisation", "thermorégulation", "incontestablement", "météorisation", "extraterrestre", "hétérogène", "juxtaposition"];
const GERMAN_FILENAME = "german.txt";
const GERMAN_BONUS_WORDS = ["bioingenieurwesen", "umsegelung", "entziehungdeswahlrechts", "elektrophysiologie", "gastrointestinal", "immunschwäche", "ununterscheidbar", "interkontinental", "internationalisierung", "mikromanagement", "fehldarstellung", "neurotransmitter", "übergeneralisierung", "photoautotroph", "psychotherapeutisch", "radiotelegrafie", "suboptimierung", "thermoregulation", "unbestreitbar", "wetteranpassung", "außerirdisch", "heterogen", "gegenüberstellung"];
const SPANISH_FILENAME = "spanish.txt";
const SPANISH_BONUS_WORDS = ["bioingeniería", "circunnavegación", "desposesión", "electrofisiología", "gastrointestinal", "inmunodeficiencia", "indistinguible", "intercontinental", "internacionalización", "micromanagement", "falsa representación", "neurotransmisor", "sobregeneralización", "fotoautotrófico", "psicoterapéutico", "radiotelegrafía", "suboptimización", "termorregulación", "indiscutiblemente", "climatización", "extraterrestre", "heterogéneo", "yuxtaposición"];
const FINNISH_FILENAME = "finnish.txt";
const FINNISH_BONUS_WORDS = ["bioinsinööri", "ympäriajo", "äänioikeudenriisto", "sähköfysiologia", "gastrointestinal", "immuunipuutos", "erottumaton", "kansainvälinen", "kansainvälistyminen", "mikrohallinta", "väärä esitys", "neurotransmitteri", "yleistämisen ylikorostus", "valokuva-autotrofinen", "psykoterapeuttinen", "radiotelegrafia", "alioptimointi", "lämmönsäätely", "kiistattomasti", "sääsuojaus", "avaruusolento", "heterogeeninen", "vieretys"];
var BONUS_WORDS = ENGLISH_BONUS_WORDS;
const EASY_BONUS_WORD_PROBABILITY = 0.01;
const MEDIUM_BONUS_WORD_PROBABILITY = 0.04;
const HARD_BONUS_WORD_PROBABILITY = 0.07;
var BONUS_WORD_PROBABILITY = MEDIUM_BONUS_WORD_PROBABILITY;
const BONUS_MULTIPLIER = 2;
const BONUS_TIME  = 15;

var current_words = [];
const EASY_WORD_SPAWN_COUNT = 14;
const MEDIUM_WORD_SPAWN_COUNT = 18;
const HARD_WORD_SPAWN_COUNT = 20;
var WORD_SPAWN_COUNT = MEDIUM_WORD_SPAWN_COUNT;
const word_input = document.getElementById("word_input");

const BACKGROUND_MUSIC_COUNT = 10;
var background_music;
const CORRECT_SOUND_FILENAME = "../static/audio/correct_word.mp3";
var CORRECT_SOUND;
const music_volume_input = document.getElementById("music_volume");
const ding_volume_input = document.getElementById("ding_volume");

const STARTING_LIVES = 3;
var player_lives = STARTING_LIVES;
var characters_typed = 0;
var points = 0;
const restart_button = document.getElementById("restart_button");
const language_dropdown_menu = document.getElementById("language_dropdown_menu");
const difficulty_dropdown_menu = document.getElementById("difficulty_dropdown_menu");
var bonus_mode = false;
var bonus_timer;
var wave_count = 0;
var wpm_timer;
var WPM = 0;
var game_started = false;

class Word{
    constructor(x,y, dx, word_string){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.word_string = word_string;
        this.bonus_word = BONUS_WORDS.includes(this.word_string);
        this.colour = this.bonus_word ? BONUS_TEXT_COLOUR : TEXT_COLOUR_DEFAULT;
        this.highlight_colour = HIGHLIGHT_TEXT_COLOUR_DEFAULT;
        this.setTextDimensions();
    }

    setTextDimensions(){
        let text_dimensions = getTextDimensions(this.word_string, TEXT_FONT);
        this.text_width = text_dimensions.width;
        this.text_height = text_dimensions.height;
    }

    updatePosition(){
        this.x += this.dx;
    }

    setColour(){
        if (this.bonus_word){
            return;
        }

        if(this.x < canvas.width / 2 && this.x > canvas.width / 4){
            this.colour = TEXT_COLOUR_MEDIUM_DANGER;
            this.highlight_colour = HIGHLIGHT_TEXT_COLOUR_MEDIUM_DANGER;
            return;
        }

        if(this.x < canvas.width / 2 && this.x < canvas.width / 4){
            this.colour = TEXT_COLOUR_HIGH_DANGER;
            this.highlight_colour = HIGHLIGHT_TEXT_COLOUR_HIGH_DANGER;
            return;
        }
    }

    draw(){
        
        this.setColour();
        drawText(this.word_string, this.x, this.y, TEXT_FONT, this.colour, "left");

        if(this.word_string.startsWith(word_input.value)){
            drawText(word_input.value, this.x, this.y, TEXT_FONT, this.highlight_colour, "left");
        }
    }
}

class Star{
    constructor(x, y, dx, radius, colour){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.radius = radius;
        this.colour = colour;
    }

    updatePosition(){
        this.x += this.dx;
    }

    draw(){
        drawCircle(this.x, this.y, this.radius, this.colour);
    }
}

class StopWatch{
    constructor(){
        this.seconds_elapsed = 0;
        this.running = false;
        this.start_time = null;
    }

    start(){
        if(this.running){
            return;
        }
        this.running = true;
        this.start_time = new Date();
    }

    stop(){
        if(!this.running){
            return;
        }
        this.running = false;
        this.seconds_elapsed += (new Date() - this.start_time) / 1000;
        this.start_time = null;
    }

    getSecondsElapsed(){
        if(!this.running){
            return this.seconds_elapsed;
        }

        let seconds_elapsed = ((new Date() - this.start_time) / 1000) + this.seconds_elapsed;
        return seconds_elapsed;
    }
}

async function fetchWords() {
    try {
        let file_path = `../static/languages/${WORDS_FILENAME}`;
        const result = await fetch(file_path);
        const text = await result.text();
        ALL_WORDS = text.split("\n").map(word => word.trim());
    } catch (e) {
        console.error("Failed to fetch words, Error: " + e);
    }
}

async function getAudio(audio_url, audio_volume=0.5) {
    const result = await fetch(audio_url);
    const array_buffer = await result.arrayBuffer();
    let blob = new Blob([array_buffer], { type: "audio/mpeg" });
    let object_url = URL.createObjectURL(blob);
    let audio_object = new Audio(object_url);
    audio_object.volume = audio_volume;
    return audio_object;
}

function drawCircle(x,y,radius,colour){
    ctx.beginPath();
    ctx.fillStyle = colour;
    ctx.arc(x,y,radius,0,Math.PI*2,false);
    ctx.fill();
    ctx.closePath();
}

function drawRect(x,y, width, height, colour){
    ctx.beginPath();
    ctx.fillStyle = colour;
    ctx.rect(x,y,width,height,colour);
    ctx.fill();
    ctx.closePath();
}

function drawText(text, x, y, font, colour, text_allign){
    ctx.font = font;
    ctx.fillStyle = colour;
    ctx.text_allign = text_allign;
    ctx.fillText(text,x,y);
}

function getTextDimensions(text, font){
    ctx.font = font;
    let font_metrics = ctx.measureText(text);
    return {width: font_metrics.width + TEXT_PADDING, height: parseInt(font) + TEXT_PADDING};
}

function getRandomNumInRange(min, max){
    return (Math.random() * (max - min)) + min;
}

function getRandomNumInRangeInt(min, max){
    return Math.floor(getRandomNumInRange(min,max));
}

function drawStartScreen(){
    let start_screen_text = "Press Tab to Start";
    let start_screen_text_dimensions = getTextDimensions(start_screen_text, START_SCREEN_TEXT_FONT);
    let starting_y = canvas.height / 2;
    drawText(start_screen_text, canvas.width/2 - start_screen_text_dimensions.width/2, starting_y, START_SCREEN_TEXT_FONT, START_SCREEN_TEXT_COLOUR, "center");

    let controls_text_1 = "SPACE Clears Input";
    let controls_text_1_dimensions = getTextDimensions(controls_text_1, START_SCREEN_TEXT_FONT);
    starting_y += controls_text_1_dimensions.height + 10;
    drawText(controls_text_1, canvas.width/2 - controls_text_1_dimensions.width/2, starting_y, START_SCREEN_TEXT_FONT, CONTROLS_TEXT_COLOUR, "center");

    let controls_text_2 = "TAB Restarts Game";
    let controls_text_2_dimensions = getTextDimensions(controls_text_2, START_SCREEN_TEXT_FONT);
    starting_y += controls_text_2_dimensions.height + 10;
    drawText(controls_text_2, canvas.width/2 - controls_text_2_dimensions.width/2, starting_y, START_SCREEN_TEXT_FONT, CONTROLS_TEXT_COLOUR, "center");
}

function drawPlatform(){
    drawRect(0, (1-PLATFORM_HEIGHT_PERCENT) * canvas.height, canvas.width, PLATFORM_HEIGHT_PERCENT * canvas.height, PLATFORM_COLOUR);

    let points_text = `Points: ${points}`;
    let points_text_dimensions = getTextDimensions(points_text, PANEL_TEXT_FONT);
    let starting_y = (1-PLATFORM_HEIGHT_PERCENT)*canvas.height + points_text_dimensions.height + 10;
    drawText(points_text, 10, starting_y, PANEL_TEXT_FONT, POINTS_TEXT_COLOUR, "left");

    let current_input_text = `${word_input.value}`;
    let current_input_text_dimensions = getTextDimensions(current_input_text, PANEL_TEXT_FONT);
    drawText(current_input_text, canvas.width/2 - current_input_text_dimensions.width/2 , starting_y, PANEL_TEXT_FONT, CURRENT_INPUT_TEXT_COLOUR, "left");

    let wpm_text = `WPM: ${Math.round(WPM)}`;
    let wpm_text_dimensions = getTextDimensions(wpm_text, PANEL_TEXT_FONT);
    starting_y += wpm_text_dimensions.height + 5;
    drawText(wpm_text, 10, starting_y, PANEL_TEXT_FONT, WPM_TEXT_COLOUR, "left");
    
    let lives_text = `Lives: ${player_lives}`;
    let lives_text_dimensions = getTextDimensions(lives_text, PANEL_TEXT_FONT);
    starting_y += lives_text_dimensions.height + 5;
    drawText(lives_text, 10, starting_y, PANEL_TEXT_FONT, LIVES_TEXT_COLOUR, "left");

    let language_text = "Language: " + display_language;
    let language_text_dimensions = getTextDimensions(language_text, PANEL_TEXT_FONT);
    starting_y = canvas.height - 5;
    drawText(language_text, canvas.width - language_text_dimensions.width - 10, starting_y, PANEL_TEXT_FONT, LANGUAGE_TEXT_COLOUR, "left");
    
    let difficulty_text = `Difficulty: ${display_difficulty}`;
    let difficulty_text_dimensions = getTextDimensions(difficulty_text, PANEL_TEXT_FONT);
    starting_y -= (difficulty_text_dimensions.height + 5);
    drawText(difficulty_text, canvas.width - difficulty_text_dimensions.width - 10, starting_y, PANEL_TEXT_FONT, DIFFICULTY_TEXT_COLOUR, "left");
    
    if(bonus_mode){
        let bonus_text = `Bonus Round: ${BONUS_TIME - Math.round(bonus_timer.getSecondsElapsed())}`;
        let bonus_text_dimensions = getTextDimensions(bonus_text, PANEL_TEXT_FONT);
        starting_y = (1-PLATFORM_HEIGHT_PERCENT)*canvas.height + bonus_text_dimensions.height + 10;
        drawText(bonus_text, canvas.width - bonus_text_dimensions.width - 10, starting_y, PANEL_TEXT_FONT, BONUS_TEXT_COLOUR, "left");
    }
}

function drawGameOverScreen(){
    let game_over_text = "Game Over! Points: " + points;
    let game_over_text_dimensions = getTextDimensions(game_over_text, START_SCREEN_TEXT_FONT);
    drawText(game_over_text, canvas.width/2 - game_over_text_dimensions.width/2, canvas.height/2, GAME_OVER_TEXT_FONT, GAME_OVER_TEXT_COLOUR, "center");

    let restart_text = "(Press Tab to Restart)";
    let restart_text_dimensions = getTextDimensions(restart_text, RESTART_TEXT_FONT);
    drawText(restart_text, canvas.width/2 - restart_text_dimensions.width/2, canvas.height/2 + game_over_text_dimensions.height + 20, RESTART_TEXT_FONT, RESTART_TEXT_COLOUR, "center");
}

function setTextSpeed(){
    if(bonus_mode){
        current_text_speed = TEXT_SPEED * 0.7;
        return;
    }

    if(current_text_speed < SPEED_LIMIT){
        return;
    }

    current_text_speed = TEXT_SPEED * Math.pow(SPEED_INCREASE_PERCENT, wave_count);
}

function updateTimers(){
    if (current_words.filter(word => word.x < canvas.width && !word.bonus_word).length == 0){
        wpm_timer.stop();
        bonus_timer.stop();
    }else{
        wpm_timer.start();
        if(bonus_mode){
            bonus_timer.start();
        }
    }

    let wpm_timer_seconds_elapsed = wpm_timer.getSecondsElapsed();
    WPM = wpm_timer_seconds_elapsed > 0 ? ((characters_typed / 5) / wpm_timer_seconds_elapsed)*60 : 0;

    let bonus_timer_seconds_elapsed = bonus_timer.getSecondsElapsed();
    bonus_mode = bonus_mode ? (bonus_timer_seconds_elapsed < BONUS_TIME) : false;
    if(!bonus_mode){
        bonus_timer = new StopWatch();
    }
}

function removeCurrentMusic(){
    if (background_music) {
        background_music.pause();
        background_music.currentTime = 0;
    }
}

function setRandomBackgroundMusic(){
    if(music_volume_input.value == 0){
        return;
    }
    removeCurrentMusic();
    let random_filename_count = getRandomNumInRangeInt(1, BACKGROUND_MUSIC_COUNT);
    let random_filename = `../static/audio/background_music/${random_filename_count}.mp3`;
    background_music = new Audio(random_filename);
    background_music.volume = Number(music_volume_input.value);
    background_music.play();
    background_music.currentTime = 0;
}

function isWordOverlapping(word, current_words) {
    let word_x = word.x;
    let word_y = word.y - word.text_height;
    for (let i = 0; i < current_words.length; i++) {
        let current_word = current_words[i];
        let current_word_x = current_word.x;
        let current_word_y = current_word.y - current_word.text_height;
        if (
            word_x < current_word_x + current_word.text_width &&
            word_x + word.text_width > current_word_x &&
            word_y < current_word_y + current_word.text_height &&
            word_y + word.text_height > current_word_y
        ) {
            return true;
        }
    }
    return false;
}

function getRandomWord(arr){
    let random_string = arr[getRandomNumInRangeInt(0, arr.length-1)];
    let text_dimensions = getTextDimensions(random_string, TEXT_FONT);
    let text_width = text_dimensions.width;
    let text_height = text_dimensions.height;

    let random_x = -1;
    let random_y = -1;
    let current_word = null;
    while (current_word == null || isWordOverlapping(current_word, current_words)){
        random_x = getRandomNumInRange(canvas.width, canvas.width*2);
        random_y = getRandomNumInRange(text_height, canvas.height*(1-PLATFORM_HEIGHT_PERCENT)-text_height);
        current_word = {x: random_x, y: random_y, text_width: text_width, text_height: text_height};
    }
    current_word.string = random_string;
    current_word = new Word(random_x, random_y, TEXT_SPEED, random_string);
    return current_word;
}

function spawnWords(spawn_count){
    for(let i = 0; i < spawn_count; i++){
        let random_word = getRandomWord(ALL_WORDS);
        current_words.push(random_word);
    }

    let random_var = Math.random();
    if(random_var <= BONUS_WORD_PROBABILITY){
        let random_bonus_word = getRandomWord(BONUS_WORDS);
        current_words.push(random_bonus_word);
    }
}

function isStarOverlapping(current_star, current_stars){
    for(let i = 0; i < current_stars.length; i++){
        let distance = Math.pow(current_star.x - current_stars[i].x,2) + Math.pow(current_star.y - current_stars[i].y,2);
        if (distance < Math.pow(current_star.radius + current_stars[i].radius, 2)){
            return true;
        }
    }
    return false;
}

function getRandomStar(){
    let random_radius = getRandomNumInRange(MIN_STAR_RADIUS,MAX_STAR_RADIUS);

    let random_x = -1;
    let random_y = -1;
    let current_star = null;
    while (current_star == null || isStarOverlapping(current_star, current_stars)){
        random_x = getRandomNumInRange(-canvas.width, -random_radius);
        random_y = getRandomNumInRange(random_radius, canvas.height*(1-PLATFORM_HEIGHT_PERCENT)-random_radius);
        current_star = {x: random_x, y: random_y, radius: random_radius};
    }
    let scaled_star_speed = (Math.pow(random_radius,2) / MAX_STAR_RADIUS) * MAX_STAR_SPEED;
    current_star = new Star(random_x, random_y, scaled_star_speed, random_radius, STAR_COLOUR);
    return current_star;
}

function spawnStars(spawn_count){
    for(let i = 0; i < spawn_count; i++){
        let random_star = getRandomStar();
        current_stars.push(random_star);
    }
}

function restartGame(){
    wpm_timer = new StopWatch();
    bonus_mode = false;
    bonus_timer = new StopWatch();
    game_started = true;
    word_input.value = "";
    player_lives = STARTING_LIVES;
    characters_typed = 0;
    points = 0;
    current_stars = [];
    current_words = [];
    word_input.focus();
    current_text_speed = TEXT_SPEED;
    wave_count = 0;
}

function handleWordInput(){
    if(player_lives <= 0){
        return;
    }

    let word_input_value = word_input.value.toLowerCase().trim();
    for(let i = current_words.length-1; i >= 0; i--){
        let current_word = current_words[i];
        let current_word_string = current_word.word_string;
        if (current_word_string == word_input_value){
            current_words.splice(i,1);
            word_input.value = "";

            if(current_word.bonus_word){
                bonus_mode = true;
                bonus_timer.start();
            }
            characters_typed += current_word_string.length;
            points += current_word_string.length * (bonus_mode ? BONUS_MULTIPLIER : 1);

            if(ding_volume_input.value > 0){
                let correct_word_sound = CORRECT_SOUND.cloneNode();
                correct_word_sound.volume = Number(ding_volume_input.value);
                correct_word_sound.play();
            }
            return;
        }
    }
}

function handleSpecialCharacters(event){
    if (event.key === "Tab" || event.keyCode === 9){
        event.preventDefault();
        restartGame();
        setRandomBackgroundMusic();
        return;
    }

    if(event.key === "Escape" || event.keyCode === 27){
        event.preventDefault();
        restartGame();
        removeCurrentMusic();
        game_started = false;
        return;
    }

    if (event.key === " " || event.keyCode === 32) {
        event.preventDefault();
        word_input.value = "";
    }
}

word_input.addEventListener("input", handleWordInput);
word_input.addEventListener("keydown", handleSpecialCharacters);

music_volume_input.addEventListener("input", function(){
    if(background_music){
        background_music.volume = Number(music_volume_input.value);
    }
});

restart_button.addEventListener("click", function(){
    restartGame();
    setRandomBackgroundMusic();
})

let language_dropdown_items = language_dropdown_menu.querySelectorAll('.dropdown-item');
language_dropdown_items.forEach(item => {
    item.addEventListener("click", handleLanguageDropdown);
});

let difficulty_dropdown_items = difficulty_dropdown_menu.querySelectorAll(".dropdown-item");
difficulty_dropdown_items.forEach(item => {
    item.addEventListener("click", handleDifficultyDropdown);
});

async function handleLanguageDropdown(event){
    event.preventDefault();
    let data_value = event.target.getAttribute('data-value');
    handleLanguageValue(data_value);

    await fetchWords();
    if(game_started){
        restartGame();
        setRandomBackgroundMusic();
    }
}

function handleLanguageValue(language_value){
    current_language = language_value
    switch(language_value){
        case "english":
            WORDS_FILENAME = ENGLISH_FILENAME;
            BONUS_WORDS = ENGLISH_BONUS_WORDS;
            display_language = "English";
            break;
        
        case "french":
            WORDS_FILENAME = FRENCH_FILENAME;
            BONUS_WORDS = FRENCH_BONUS_WORDS;
            display_language = "Français";
            break;
        
        case "german":
            WORDS_FILENAME = GERMAN_FILENAME;
            BONUS_WORDS = GERMAN_BONUS_WORDS;
            display_language = "Deutsch";
            break;
        
        case "spanish":
            WORDS_FILENAME = SPANISH_FILENAME;
            BONUS_WORDS = SPANISH_BONUS_WORDS;
            display_language = "Español";
            break;
        
        case "finnish":
            WORDS_FILENAME = FINNISH_FILENAME;
            BONUS_WORDS = FINNISH_BONUS_WORDS;
            display_language = "Finnish";
            break;
        
        default:
            WORDS_FILENAME = ENGLISH_FILENAME;
            BONUS_WORDS = ENGLISH_BONUS_WORDS;
            display_language = "English";
            break;
    }
}

function handleDifficultyDropdown(event){
    event.preventDefault();
    let data_value = event.target.getAttribute('data-value');
    handleDifficultyValue(data_value);

    if(game_started){
        restartGame();
        setRandomBackgroundMusic();
    }
}

function handleDifficultyValue(difficulty_value){
    switch(difficulty_value){
        case "easy":
            TEXT_SPEED = EASY_TEXT_SPEED;
            SPEED_INCREASE_PERCENT = EASY_SPEED_INCREASE_PERCENT;
            BONUS_WORD_PROBABILITY = EASY_BONUS_WORD_PROBABILITY;
            WORD_SPAWN_COUNT = EASY_WORD_SPAWN_COUNT;
            SPEED_LIMIT = EASY_SPEED_LIMIT;
            break;
        
        case "medium":
            TEXT_SPEED = MEDIUM_TEXT_SPEED;
            SPEED_INCREASE_PERCENT = MEDIUM_SPEED_INCREASE_PERCENT;
            BONUS_WORD_PROBABILITY = MEDIUM_BONUS_WORD_PROBABILITY;
            WORD_SPAWN_COUNT = MEDIUM_WORD_SPAWN_COUNT;
            SPEED_LIMIT = MEDIUM_SPEED_LIMIT;
            break;
        
        case "hard":
            TEXT_SPEED = HARD_TEXT_SPEED;
            SPEED_INCREASE_PERCENT = HARD_SPEED_INCREASE_PERCENT;
            BONUS_WORD_PROBABILITY = HARD_BONUS_WORD_PROBABILITY;
            WORD_SPAWN_COUNT = HARD_WORD_SPAWN_COUNT;
            SPEED_LIMIT = HARD_SPEED_LIMIT;
            break;
        
        default:
            break;
    }
    display_difficulty = difficulty_value.charAt(0).toUpperCase() + difficulty_value.slice(1);
}

function handleTypingGame(){
    for(let i = current_stars.length-1; i >= 0; i--){
        let current_star = current_stars[i];
        if(current_star.x > canvas.width+current_star.radius){
            current_stars.splice(i,1);
            continue;
        }
        current_star.draw();
        current_star.updatePosition();
    }

    updateTimers();
    setTextSpeed();
    for(let i = current_words.length-1; i >= 0; i--){
        let current_word = current_words[i];
        current_word.dx = current_text_speed;
        if(current_word.x < -current_word.text_width){
            current_words.splice(i,1);

            if(!current_word.bonus_word){
                player_lives -= 1;
            }

            if(player_lives <= 0){
                bonus_mode = false;
                removeCurrentMusic();
                saveScore();
                break;
            }
            continue;
        }
        current_word.draw();
        current_word.updatePosition();
    }

    if(current_stars.filter(star => star.x > 0).length == current_stars.length){
        spawnStars(WORD_SPAWN_COUNT);
    }

    if(current_words.length == 0){
        spawnWords(WORD_SPAWN_COUNT);
        wave_count += 1;
    }

    if(music_volume.value > 0 && (background_music?.ended ?? true)){
        setRandomBackgroundMusic();
    }
}

function mainGameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(0,0,canvas.width,canvas.height, bonus_mode ? BONUS_BACKGROUND_COLOUR : BACKGROUND_COLOUR);
    drawPlatform();

    if(!game_started){
        drawStartScreen();
    }

    else if(player_lives <= 0){
        drawGameOverScreen();

    }else{
        handleTypingGame();
    }

    requestAnimationFrame(mainGameLoop);
}

async function saveScore(){
    let save_score_form_data = new FormData();
    save_score_form_data.append("points", points);
    save_score_form_data.append("wpm", WPM);
    save_score_form_data.append("game_language", current_language);
    save_score_form_data.append("game_difficulty", display_difficulty.toLowerCase());
    let save_score_api_url = `${window.location.origin}/user/score`;
    let save_score_api_response = await fetch(save_score_api_url, {method: "POST", body: save_score_form_data});
    if (!save_score_api_response.ok){
        throw new Error("Failed to save User Score");
    }
}

async function loadUserSettings(){
    let user_settings_api_url = `${window.location.origin}/user/settings`;
    let user_settings_response = await fetch(user_settings_api_url, {method: "GET"});
    if (!user_settings_response.ok){
        throw new Error("Failed to fetch User Settings");
    }

    let user_settings = (await user_settings_response.json()).data;
    handleDifficultyValue(user_settings.default_difficulty.toLowerCase());
    handleLanguageValue(user_settings.default_language.toLowerCase());
    music_volume_input.value = user_settings.music_volume;
    ding_volume_input.value = user_settings.ding_volume;

    await fetchWords();
}

document.addEventListener("DOMContentLoaded", async () => {
    CORRECT_SOUND = await getAudio(CORRECT_SOUND_FILENAME);
    await loadUserSettings();
    mainGameLoop();
});