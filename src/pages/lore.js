import pixelFontPath from "../assets/Qaroxe.ttf";
import loreLvl1StartPath from "../assets/lore/lore_lvl1_start.png";
import loreLvl1EndPath from "../assets/lore/lore_lvl1_end.png";
import loreLvl2StartPath from "../assets/lore/lore_lvl2_start.png";
import loreLvl2EndPath from "../assets/lore/lore_lvl2_end.png";
import loreLvl3StartPath from "../assets/lore/lore_lvl3_start.png";
import loreLvl3EndPath from "../assets/lore/lore_lvl3_end.png";
import chihiroPortraitPath from "../assets/lore/lore_chihiro.png";
import hakuPortraitPath from "../assets/lore/lore_haku.png";
import linPortraitPath from "../assets/lore/lore_lin.png";
import kamajiPortraitPath from "../assets/lore/lore_kamaji.png";

const LEVEL_NAMES = {
  1: "Village",
  2: "Forest",
  3: "Mansion"
};

const STORY_DIALOGUES = {
  1: {
    start: [
      {
        speaker: "Chihiro",
        title: "Village - Arrival",
        text: "Where... where did everyone go? A minute ago I was walking with my parents, and now the whole road behind me has disappeared into the fog."
      },
      {
        speaker: "Chihiro",
        title: "Village - Arrival",
        text: "This village feels wrong. The lanterns are glowing, the stalls are open, and yet it is so quiet that I can hear my own breathing."
      },
      {
        speaker: "Haku",
        title: "Village - Guidance",
        text: "Do not stay out in the open, Chihiro. This town belongs to spirits after dark, and they will notice you if you hesitate."
      },
      {
        speaker: "Chihiro",
        title: "Village - Guidance",
        text: "You know my name...? Then tell me what this place is. I just want to go home."
      },
      {
        speaker: "Haku",
        title: "Village - Guidance",
        text: "I am Haku. You crossed into the spirit world, and now the village is testing whether you will lose yourself here. Roamers wander these streets, and a stronger spirit waits near the exit gate."
      },
      {
        speaker: "Haku",
        title: "Village - Guidance",
        text: "Take Spirit Bloom if you find it, and claim the Moon Blade if you can. Defeat the boss and keep moving forward. If you stop now, this world will swallow you whole."
      }
    ],
    end: [
      {
        speaker: "Chihiro",
        title: "Village - Aftermath",
        text: "I made it out... but the village still feels like it is watching me leave. Even from here, I can hear those empty streets whispering behind me."
      },
      {
        speaker: "Haku",
        title: "Village - Aftermath",
        text: "That means the village has accepted that you will not stay. Few people ever reach this far with their name and heart still intact."
      },
      {
        speaker: "Chihiro",
        title: "Village - Aftermath",
        text: "If this is only the beginning, then how much farther do I have to go before I can return home?"
      },
      {
        speaker: "Haku",
        title: "Village - Aftermath",
        text: "Farther than you want. The forest ahead is alive, and it does not let travelers pass without a price. Go carefully, Chihiro."
      }
    ]
  },
  2: {
    start: [
      {
        speaker: "Chihiro",
        title: "Forest - Arrival",
        text: "The air changed the moment I stepped into the forest. It feels colder here, like the trees themselves are staring back at me."
      },
      {
        speaker: "Lin",
        title: "Forest - Guidance",
        text: "You are not imagining it. This forest is full of spirits, and not all of them care whether you leave in one piece. Name's Lin."
      },
      {
        speaker: "Chihiro",
        title: "Forest - Guidance",
        text: "Then please tell me the truth. Why was I brought here? Why does every place in this world feel like it already knows who I am?"
      },
      {
        speaker: "Lin",
        title: "Forest - Guidance",
        text: "Because once you wander into the spirit side, the world begins shaping itself around your fear. Here you'll face Roamers and Chasers, and the boss at the end fights with a sword."
      },
      {
        speaker: "Lin",
        title: "Forest - Guidance",
        text: "Take Spirit Bloom and Moon Blade if they appear, and do not rush blindly. Panic gets people killed faster than any spirit in these woods."
      },
      {
        speaker: "Chihiro",
        title: "Forest - Guidance",
        text: "I am scared... but I am still here. If the path home is hidden beyond these trees, then I will keep walking until I find it."
      }
    ],
    end: [
      {
        speaker: "Chihiro",
        title: "Forest - Aftermath",
        text: "The trees are finally thinning. For a while I thought the forest would keep me forever, like I would walk in circles until I forgot who I was."
      },
      {
        speaker: "Lin",
        title: "Forest - Aftermath",
        text: "That happens more often than you think. The forest likes to eat memories first. Lucky for you, you're more stubborn than you look."
      },
      {
        speaker: "Chihiro",
        title: "Forest - Aftermath",
        text: "What is that building ahead? It feels... familiar somehow. Like it has been waiting for me since the moment I got here."
      },
      {
        speaker: "Lin",
        title: "Forest - Aftermath",
        text: "That is where the strongest spirits gather. Mansion, bathhouse, prison... call it whatever you want. If you want answers, they are waiting inside."
      }
    ]
  },
  3: {
    start: [
      {
        speaker: "Chihiro",
        title: "Mansion - Arrival",
        text: "The doors opened before I touched them. I knew this place would be frightening, but this feels like stepping into the center of a dream that does not want to let me wake up."
      },
      {
        speaker: "Kamaji",
        title: "Mansion - Guidance",
        text: "Then stop gawking and listen. I am Kamaji. This house is the heart of the spirit world, and hearts can be cruel things when they are disturbed."
      },
      {
        speaker: "Chihiro",
        title: "Mansion - Guidance",
        text: "If this is the heart of it all, then maybe this is where I finally learn why I was brought here... and how I can leave."
      },
      {
        speaker: "Kamaji",
        title: "Mansion - Guidance",
        text: "Maybe. First you survive. Roamers, Chasers, and Flyers stalk these halls, and some of them spit spirit orbs like sparks from a furnace."
      },
      {
        speaker: "Kamaji",
        title: "Mansion - Guidance",
        text: "Find Spirit Bloom, Moon Blade, and Orb Sigil. The master spirit at the end fires in spreads and summons help when cornered. Bring it down, and the last exit should open."
      },
      {
        speaker: "Chihiro",
        title: "Mansion - Guidance",
        text: "Then I will finish this. I did not cross the village and the forest just to become another lost soul in this house."
      }
    ],
    end: [
      {
        speaker: "Chihiro",
        title: "Mansion - Aftermath",
        text: "It is quiet now... quieter than anything in this world has a right to be. The whole mansion feels like it is dissolving around me."
      },
      {
        speaker: "Kamaji",
        title: "Mansion - Aftermath",
        text: "That is the sound of a spell breaking. This place held you because it believed you would stay lost here forever."
      },
      {
        speaker: "Chihiro",
        title: "Mansion - Aftermath",
        text: "I almost did. But I still remember who I am, and I still remember that I want to go home."
      },
      {
        speaker: "Kamaji",
        title: "Mansion - Aftermath",
        text: "Then go, Chihiro. The path is open now. Just remember this much: spirit worlds never forget the ones who escape them."
      }
    ]
  }
};

class LorePage {
  constructor(p, router) {
    this.p = p;
    this.router = router;
    this.menuFont = null;

    this.level = 1;
    this.phase = "start";
    this.dialogues = [];
    this.dialogueIndex = 0;
    this.dialogueText = "";
    this.visibleDialogueText = "";
    this.headerText = "";
    this.speakerName = "";
    this.loreBackgrounds = {};
    this.characterPortraits = {};
    this.skipPrompt = "Press SPACE to continue";
    this.skipPromptAlpha = 0;
    this.alpha = 0;
    this.fadeIn = true;
    this.portraitSlideProgress = 0;
    this.typewriterSpeed = 46;
    this.typewriterProgress = 0;

    this.p.loadFont(pixelFontPath)
      .then((font) => {
        this.menuFont = font;
      })
      .catch((error) => {
        console.error("Failed to load lore font:", error);
      });

    this.loadLoreBackgrounds();
    this.loadCharacterPortraits();
  }

  onEnter(data) {
    this.level = data?.level || this.router.getSelectedLevel() || 1;
    this.phase = data?.phase === "end" ? "end" : "start";

    const levelStory = STORY_DIALOGUES[this.level] || STORY_DIALOGUES[1];
    this.dialogues = (levelStory[this.phase] || levelStory.start).filter(
      (dialogue) => dialogue.text.trim().length > 0
    );
    this.dialogueIndex = 0;
    this.applyCurrentDialogue();

    this.skipPrompt = this.getPromptText();
    this.skipPromptAlpha = 0;
    this.alpha = 0;
    this.fadeIn = true;
    this.portraitSlideProgress = 0;
  }

  getPromptText() {
    const dialogueFinished = this.visibleDialogueText === this.dialogueText;
    const isLastDialogue = this.dialogueIndex >= this.dialogues.length - 1;
    if (!dialogueFinished) {
      return "Press SPACE to skip";
    }
    if (!isLastDialogue) {
      return "Press SPACE for next dialogue";
    }
    if (this.phase === "start") {
      return "Press SPACE to begin";
    }
    if (this.level < 3) {
      return "Press SPACE for next chapter";
    }
    return "Press SPACE to return to menu";
  }

  applyCurrentDialogue() {
    const currentDialogue = this.dialogues[this.dialogueIndex] || {
      speaker: "Me",
      title: "",
      text: ""
    };
    this.speakerName = currentDialogue.speaker;
    this.headerText = currentDialogue.title;
    this.dialogueText = currentDialogue.text;
    this.visibleDialogueText = "";
    this.typewriterProgress = 0;
  }

  advanceDialogue() {
    if (this.dialogueIndex < this.dialogues.length - 1) {
      this.dialogueIndex += 1;
      this.applyCurrentDialogue();
      this.skipPrompt = this.getPromptText();
      this.alpha = 0;
      this.fadeIn = true;
      return true;
    }
    return false;
  }

  update(deltaSeconds = 1 / 60) {
    if (this.fadeIn) {
      this.alpha = Math.min(this.alpha + 320 * deltaSeconds, 255);
      if (this.alpha >= 255) {
        this.fadeIn = false;
      }
    }

    this.portraitSlideProgress = Math.min(1, this.portraitSlideProgress + deltaSeconds * 3.2);
    this.typewriterProgress = Math.min(
      this.dialogueText.length,
      this.typewriterProgress + this.typewriterSpeed * deltaSeconds
    );
    this.visibleDialogueText = this.dialogueText.slice(0, Math.floor(this.typewriterProgress));
    this.skipPromptAlpha = 120 + 120 * Math.sin(this.p.millis() * 0.005);
    this.skipPrompt = this.getPromptText();
  }

  draw() {
    this.drawLoreBackground();

    this.drawCharacterPortraits();
    this.drawDialogueBox();
  }

  drawAmbientOverlay() {
    this.p.push();
    this.p.noStroke();
    this.p.fill(30, 45, 80, 90);
    this.p.rect(0, 0, this.p.width, this.p.height);

    this.p.blendMode(this.p.ADD);
    this.p.fill(130, 170, 255, 22);
    this.p.ellipse(this.p.width * 0.5, this.p.height * 0.26, this.p.width * 0.65, this.p.height * 0.38);
    this.p.blendMode(this.p.BLEND);
    this.p.pop();
  }

  getLoreBackgroundKey() {
    return `${this.level}_${this.phase}`;
  }

  drawLoreBackground() {
    const key = this.getLoreBackgroundKey();
    const bgImage = this.loreBackgrounds[key];

    if (bgImage) {
      this.p.image(bgImage, 0, 0, this.p.width, this.p.height);
    } else {
      this.p.background(12, 15, 34);
    }
  }

  loadLoreBackgrounds() {
    const backgroundMap = {
      "1_start": loreLvl1StartPath,
      "1_end": loreLvl1EndPath,
      "2_start": loreLvl2StartPath,
      "2_end": loreLvl2EndPath,
      "3_start": loreLvl3StartPath,
      "3_end": loreLvl3EndPath
    };

    Object.entries(backgroundMap).forEach(([key, path]) => {
      this.p.loadImage(path)
        .then((img) => {
          this.loreBackgrounds[key] = img;
        })
        .catch((error) => {
          console.error(`Failed to load lore background ${key}:`, error);
        });
    });
  }

  loadCharacterPortraits() {
    const portraitMap = {
      Chihiro: chihiroPortraitPath,
      Haku: hakuPortraitPath,
      Lin: linPortraitPath,
      Kamaji: kamajiPortraitPath
    };

    Object.entries(portraitMap).forEach(([name, path]) => {
      this.p.loadImage(path)
        .then((img) => {
          this.characterPortraits[name] = img;
        })
        .catch((error) => {
          console.error(`Failed to load lore portrait for ${name}:`, error);
        });
    });
  }

  drawCharacterPortraits() {
    const chihiroPortrait = this.characterPortraits.Chihiro;
    const companionDialogue = this.dialogues.find((dialogue) => dialogue.speaker !== "Chihiro");
    const companionName = companionDialogue?.speaker || "Haku";
    const companionPortrait = this.characterPortraits[companionName];

    if (!chihiroPortrait && !companionPortrait) {
      return;
    }

    const maxPortraitW = 600;
    const maxPortraitH = 680;
    const portraitY = this.p.height - maxPortraitH - 130;
    const leftX = 20;
    const rightX = this.p.width - maxPortraitW - 40;
    const companionX = companionName === "Haku" ? rightX - 70 : rightX;
    const activeSpeaker = this.speakerName;
    const easedSlide = 1 - Math.pow(1 - this.portraitSlideProgress, 3);

    this.p.push();

    if (chihiroPortrait) {
      this.drawPortraitFrame(
        chihiroPortrait,
        leftX - (1 - easedSlide) * 80,
        portraitY,
        maxPortraitW,
        maxPortraitH,
        activeSpeaker === "Chihiro"
      );
    }

    if (companionPortrait) {
      this.drawPortraitFrame(
        companionPortrait,
        companionX + (1 - easedSlide) * 80,
        portraitY,
        maxPortraitW,
        maxPortraitH,
        activeSpeaker === companionName
      );
    }

    this.p.pop();
  }

  drawPortraitFrame(image, x, y, w, h, isActive) {
    this.p.push();
    const scale = isActive ? 1.03 : 0.94;
    const drawW = image.width * scale;
    const drawH = image.height * scale;
    const fitScale = Math.min(w / drawW, h / drawH);
    const finalW = drawW * fitScale;
    const finalH = drawH * fitScale;
    const drawX = x + (w - finalW) / 2;
    const drawY = y + (h - finalH);

    this.p.tint(255, isActive ? 255 : 175);
    this.p.image(image, drawX, drawY, finalW, finalH);
    this.p.noTint();
    this.p.pop();
  }

  drawDialogueBox() {
    const boxX = 42;
    const boxY = this.p.height - 240;
    const boxW = this.p.width - 84;
    const boxH = 195;
    const pixel = 4;

    this.p.push();
    this.p.noStroke();
    this.p.fill(0, 0, 0, 145);
    this.p.rect(boxX + pixel * 2, boxY + pixel * 2, boxW, boxH);

    this.p.fill(27, 47, 85, this.alpha);
    this.p.rect(boxX, boxY, boxW, boxH);

    this.p.fill(0);
    this.p.rect(boxX, boxY, boxW, pixel);
    this.p.rect(boxX, boxY, pixel, boxH);
    this.p.rect(boxX + boxW - pixel, boxY, pixel, boxH);
    this.p.rect(boxX, boxY + boxH - pixel, boxW, pixel);

    this.p.fill(137, 183, 236, this.alpha);
    this.p.rect(boxX + pixel, boxY + pixel, boxW - pixel * 2, pixel);
    this.p.rect(boxX + pixel, boxY + pixel * 2, pixel, boxH - pixel * 3);

    this.p.fill(23, 39, 64, this.alpha);
    this.p.rect(boxX + pixel, boxY + boxH - pixel * 2, boxW - pixel * 2, pixel);
    this.p.rect(boxX + boxW - pixel * 2, boxY + pixel, pixel, boxH - pixel * 3);

    if (this.menuFont) {
      this.p.textFont(this.menuFont);
    }

    this.p.fill(170, 210, 255, this.alpha);
    this.p.textAlign(this.p.LEFT, this.p.TOP);
    this.p.textSize(14);
    this.p.textStyle(this.p.BOLD);
    this.p.text(this.speakerName, boxX + 20, boxY + 19);

    this.p.fill(190, 220, 255, this.alpha);
    this.p.textSize(20);
    this.p.text(this.headerText, boxX + 20, boxY + 48);

    this.p.fill(235, 245, 255, this.alpha);
    this.p.textStyle(this.p.NORMAL);
    this.p.textSize(17);
    this.p.textWrap(this.p.WORD);
    this.p.text(this.visibleDialogueText, boxX + 20, boxY + 84, boxW - 40, 82);

    this.p.fill(205, 225, 255, this.skipPromptAlpha);
    this.p.textSize(14);
    this.p.textAlign(this.p.RIGHT, this.p.BOTTOM);
    this.p.text(this.skipPrompt, boxX + boxW - 20, boxY + boxH - 16);
    this.p.pop();
  }

  keyPressed(key) {
    if (key !== " " && key !== "Enter") return;

    if (this.visibleDialogueText !== this.dialogueText) {
      this.typewriterProgress = this.dialogueText.length;
      this.visibleDialogueText = this.dialogueText;
      this.skipPrompt = this.getPromptText();
      return;
    }

    if (this.advanceDialogue()) {
      return;
    }

    if (this.phase === "start") {
      this.router.navigateTo("game", { level: this.level });
      return;
    }

    if (this.level < 3) {
      const nextLevel = this.level + 1;
      this.router.navigateTo("lore", { level: nextLevel, phase: "start" });
      return;
    }

    this.router.navigateTo("menu");
  }
}

export default LorePage;

