import Parser from './parser.js'
import { predict } from './ppq.js'
import DotEnv from 'dotenv';

DotEnv.config();

export default class User {

  constructor(tmpl) {
    Object.keys(User.schema()).forEach(k => this[k] = undefined);
    Object.assign(this, tmpl);
    this.clientId = process.env.REACT_APP_CLIENT_ID || -1;
    this.isActive = (tmpl && tmpl.isActive) || false;
    this.category = (tmpl && tmpl.category) || 0;
  }

  predictInfluences(num) { // TODO: should set property
    num = num || 3;
    this._verifyTraits();
    // TMP:/TODO: implement
    return ['Security or crime-related issues', 'Images of large crowds', 'Immigration issues'];
  }

  randomSlogans() {
    let ots = User.oceanTraits();
    let idx1 = Math.floor(Math.random() * ots.length);
    let idx2 = Math.floor(Math.random() * ots.length)
    //console.log('['+this.adIssue+']['+(Math.random() < .5 ? 'high' : 'low')+']['+[ots[idx1]]+']');
    let set1 = User.adSlogans[this.adIssue][(Math.random() < .5 ? 'high' : 'low')][ots[idx1]];
    let set2  = User.adSlogans[this.adIssue][(Math.random() < .5 ? 'high' : 'low')][ots[idx2]];
    return set1.concat(set2);
  }

  getSlogans() {
    this._verifyTraits();
    let slogans = [];
    let ots = User.oceanTraits();
    if (typeof this.adIssue !== 'undefined') {
      slogans = this.randomSlogans();
      let cat = this.categorize();
      if (cat !== 0) {
        //console.log('['+this.adIssue+']['+(cat > 0 ? 'high' : 'low')+']['+ots[Math.abs(cat)-1]+']');
        let good = User.adSlogans[this.adIssue][(cat > 0 ? 'high' : 'low')][ots[Math.abs(cat)-1]];
        let bad =  User.adSlogans[this.adIssue][(cat < 0 ? 'high' : 'low')][ots[Math.abs(cat)-1]];
        slogans = good.concat(bad);
        }
      }
      return slogans;
    }

    profileImgUrl() {
      return User.imageDir + this.id + '.jpg';
    }

    targetImgUrl() {
      return User.imageDir + this.targetId + '.jpg';
    }

    predictFromBrands(data) { // TODO:  should set property
      if (!this.traits) this.traits = {};
      return predict(data);
    }

    hasOceanTraits() {
      if (typeof this.traits === 'undefined') return false;
      let result = true;
      this.oceanTraits().forEach(tname => {
        if (!this.traits.hasOwnProperty(tname)) {
          result = false;
          return;
        }
        let t = this.traits[tname];
        if (typeof t === 'undefined' || t < 0 || t > 1) {
          result = false;
          return;
        }
      });

      return result;
    }

    _verifyTraits() {

      if (!this.hasOceanTraits()) {
        throw Error('User with traits required');
      }
    }

    generateDescription(parser) {

      this._verifyTraits();

      let lines = [];
      let traitNames = this.oceanTraits();

      for (var i = 0; i < traitNames.length; i++) {
        if (typeof User.descriptionTemplate[traitNames[i]] !== 'undefined') {
          let val = this.traits[traitNames[i]];
          if (val < 0 || val > 1) throw Error('Bad "' + traitNames[i] + '" trait -> ' + val);
          let idx = Math.min(traitNames.length - 1, Math.floor(val * traitNames.length));
          lines.push(User.descriptionTemplate[traitNames[i]].text[idx]);
        }
      }

      // verify we have a parser
      if (!parser) {
        if (typeof Parser === 'undefined') throw Error('No Parser found');
        parser = new Parser(this);
      }

      for (var i = 0; i < lines.length; i++) {
        lines[i] = parser.parse(lines[i]);
      }

      return lines.join(' ').trim();
    }

    poss() {
      switch (this.gender) {
      case 'male':
        return 'his';
      case 'female':
        return 'her';
      case 'other':
        return 'their';
      }
    }

    pronoun() {
      switch (this.gender) {
      case 'male':
        return 'he';
      case 'female':
        return 'she';
      case 'other':
        return 'they';
      }
    }

    getSimilars() {
      let result = [];
      if (typeof this.similars === 'undefined') return [];
      this.similars.forEach(sims => {
        let parts = sims.split("||");
        if (parts.length != 2) {
          console.log("Bad similar: " + sims);
          return;
        }
        result.push({ id: parts[0], name: parts[1] });
      });
      return result;
    }

    virtueAsAdverb() {
      const adverbs = {
        power: 'powerful',
        truth: 'truthful',
        wealth: 'valuable',
        faith: 'faithful',
        influence: 'influential',
      }
      return adverbs[this.virtue];
    }

    toBe() {
      return (this.gender === 'other') ? 'are' : 'is';
    }

    oceanTraits() {
      return User.oceanTraits();
    }

    categorize() {
      this.category = 0;
      let maxVal = 0;
      let trait = null;
      let traits = this.oceanTraits();
      traits.forEach(t => {
        let val = this.traits[t];
        if (Math.abs(val - .5) > maxVal) {
          maxVal = Math.abs(val - .5);
          trait = t;
        }
      });
      let traitIdx = 1 + traits.indexOf(trait);

      //console.log('def-trait: '+trait, this.traits[trait], 'idx='+traitIdx);

      let multiply = 0;
      if (this.traits[trait] < .4) multiply = -1;
      if (this.traits[trait] >= .6) multiply = 1;

      this.category = traitIdx * multiply;

      return this.category;
    }

    _randomizeTraits() {
      this.traits = {};
      this.oceanTraits().forEach(t => this.traits[t] = Math.random());
      return this;
    }
  };

  User.imageDir = '/profiles/';

  User.schema = () => {
    return {
      name: {
        type: 'string'
      },
      similars: { //
        type: ['string']
      },
      influencedBy: {
        type: ['string']
      },
      clientId: { // in this case, the monolith id from .env file
        type: 'number',
        default: -1
      },
      category: { // OCEAN-group: from -5 to 5, with 0 meaning neutral
        type: 'number',
        default: 0,
      },
      hasImage: {
        type: 'boolean',
        default: false
      },
      isActive: {
        type: 'boolean',
        default: false
      },
      targetId: {
        type: 'string'
        //type: { type: 'objectId', ref: 'User' }
      },
      targetName: {
        type: 'string'
        //type: { type: 'objectId', ref: 'User' }
      },
      virtue: {
        type: 'string'
      },
      adIssue: {
        type: 'string'
      },
      lastPageVisit: {
        time: { type: 'date' },
        page: { type: 'string' }
      },
      traits: {
        openness: { type: 'number' },
        conscientiousness: { type: 'number' },
        agreeableness: { type: 'number' },
        extraversion: { type: 'number' },
        neuroticism: { type: 'number' },
        relationship: { type: 'number' },
        gender: { type: 'number' },
        age: { type: 'number' }
      },
      login: {
        type: 'string',
        required: true
      },
      dataChoices: { // TODO: should be arrays
        consumer: { type: 'string' }, // comma-delimited
        home: { type: 'string' }, // comma-delimited
        political: { type: 'string' } // comma-delimited
      },
      loginType: {
        type: 'string',
        enum: ['twitter', 'google', 'facebook', 'email'],
        required: true
      },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'other']
      },
      createdAt: {
        type: 'date',
        default: Date.now
      }
    }
  }

  User.oceanTraits = () => [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism'
  ];

  User.adSlogans = {
    leave: {
      high: {
        openness: ["Free to create a British future", "Dream of unleashing our true potential"],
        conscientiousness: ["Greater control. Greater savings", "Exercise your right to plan your own future"],
        extraversion: ["Play the game by your own rules", "Tell the EU that your voice matters"],
        agreeableness: ["Love Europe.Not the EU.", "Better for family budgets, lower bills for hard-pressed families"],
        neuroticism: ["Stop convicted criminals from other countries coming to the UK", "Tipping point"]
      },
      low: {
        openness: ["Mind your own business Europe!", "The EU is diluting our traditions"],
        conscientiousness: ["If we don't act now we will be stuck forever", "No more sitting around, it's time to act"],
        extraversion: ["Rise like Lions. Vote Leave.", "Imagine a new tomorrow. It begins now"],
        agreeableness: ["Our borders. Our jobs", "Don't pay for a migrant's mistakes"],
        neuroticism: ["No EU. No problem", "Relax. It's no big deal"]
      }
    },
    remain: {
      high: {
        openness: ["No man is an island.No country by itself", "A vote to remain is a vote for democracy <br> human rights and solidarity"],
        conscientiousness: ["Don't let them gamble with our future", "30 years of stability <br> out of the window"],
        extraversion: ["Don't be silenced. Vote to Remain.", "Don't leave us out of the conversation. Vote in!"],
        agreeableness: ["Create a future your family can be proud of ", "Cooperation leads to a more inclusive future"],
        neuroticism: ["Au Revoir Stability.Auf Wiedersehen Support <br> Ariverderci Safety.", "If we think things are bad now, imagine the uncertainty if we leave"],
      },
      low: {
        openness: ["My father's Polish. My mum's from Spain. <br> Now I live in the UK. Don't make this a hassle", "Don't rock the boat.Keep us in the EU"],
        conscientiousness: ["Seize the opportunity <br> Reform the EU", "It's not perfect <br> but I'll take my chances"],
        extraversion: ["You don't need to join the crowd <br> to have your say", "Contemplate your future.Vote in !"],
        agreeableness: ["The fastest way to lose is to quit", "Control your future.Vote in !"],
        neuroticism: ["Who needs the hassle of leaving", "We've got better things to do that worry about leaving"],
      }
    }
  };

  User.descriptionTemplate = {
    openness: {
      desc: 'Openness to experience relates to our imagination and the degree to which we are comfortable with unfamiliarity',
      poles: ['Conservative and Traditional', 'Liberal and Artistic'],
      meta: 'People scoring high on this trait can be described as intellectually curious, sensitive to beauty, and unconventional, while people scoring low on this trait can be characterized as traditional and are more likely to prefer the familiar over the unusual.',
      text: [
          '$user.name.ucf() $user.toBe() down-to-earth and prefers things to be simple and straightforward. $user.pronoun().ucf() finds life easier if things don’t change unnecessarily. The arts are of little practical use to $user.poss() as tradition $user.toBe() generally more important.',
          '$user.name.ucf() dislikes needless complexity, and prefers the familiar over the unusual. $user.pronoun().ucf() is more conservative than many and values practical outcomes over flighty imagination.',
          '$user.name.ucf() $user.toBe() aware of $user.poss() feelings but doesn’t get carried away with $user.poss() imagination. $user.pronoun().ucf() embraces change when it $user.toBe() necessary while still resisting it when $user.pronoun() thinks otherwise. Beauty $user.toBe() important to $user.poss(), but it’s not everything.',
          '$user.name.ucf() $user.toBe() intellectually curious and appreciative of what $user.pronoun() considers beautiful, no matter what others think. $user.poss().ucf() imagination $user.toBe() vivid and makes $user.poss() more creative than many others.',
          '$user.name.ucf() $user.toBe() far more intellectually curious and sensitive to beauty than most. $user.poss().ucf() beliefs are individualistic and frequently drift towards the unconventional. $user.pronoun().ucf() enjoys $user.poss() imagination and the exciting places it takes $user.poss().'
        ]
    },

    conscientiousness: {
      desc: 'Conscientiousness concerns the way in which we control, regulate, and direct our impulses.',
      poles: ['Impulsive and Spontaneous', 'Organized and Hard-working'],
      meta: 'People scoring high on this trait can be described as organized, reliable, and efficient, while people scoring low on this trait are generally characterized as spontaneous and impulsive.',
      text: [
          '$user.name.ucf() $user.toBe() impulsive and whimsical, and fine with it! $user.pronoun().ucf() would say that sometimes decisions need to be made quickly, and that $user.pronoun() makes them quicker than most. $user.pronoun().ucf() would say $user.pronoun() $user.toBe() zany, colourful, and just generally great fun to be with... as long as someone isn’t relying on $user.pronoun() to get some work done.',
          '$user.name.ucf() $user.toBe() spontaneous and fun. $user.pronoun().ucf() like to do unexpected things that make life that bit more interesting. $user.pronoun().ucf() $user.toBe()n’t completely unreliable, but $user.pronoun()’ve been known to slip up on occasion.',
          '$user.name.ucf() $user.toBe() random and fun to be around but $user.pronoun() can plan and persist when life requires it. Depending on the situation, $user.pronoun() can make quick decisions or deliberate for longer if necessary.',
          '$user.name.ucf() avoids foreseeable trouble through purposeful planning and achieves success through persistence. $user.pronoun().ucf() $user.toBe() reliable and prepared for life’s challenges.',
          '$user.name.ucf() $user.toBe() a perfectionist. $user.pronoun().ucf() prefers to plan everything to the last detail, which has consequently led to $user.poss() being very successful and extremely reliable. $user.pronoun().ucf() enjoys seeing $user.poss() long-term plans come to fruition.'
        ]
    },

    extraversion: {
      desc: 'Extraversion refers to the extent to which people get their energy from the company of others, and whether they actively seek excitement and stimulation',
      poles: ['Contemplative', 'Engaged with Outside World'],
      meta: 'People scoring high on this trait can be described as energetic, talkative and sociable, while people scoring low on this trait tend to be more shy, reserved and comfortable in their own company.',
      text: [
          '$user.name.ucf() $user.toBe() quiet and somewhat withdrawn. $user.pronoun().ucf() is someone who doesn’t need lots of other people around to have fun, and sometimes finds people tiring.',
          '$user.name.ucf() prefers low-key social occasions, with a few close friends. It’s not that $user.pronoun() $user.toBe() afraid of large parties; they\'re just not that fun for $user.poss().',
          '$user.name.ucf() enjoys and actively seeks out social occasions, but would say that they’re not everything. $user.pronoun().ucf() might say that sometimes it $user.toBe() nice to step back for a while and have a quiet night in.',
          '$user.name.ucf() $user.toBe() energetic and active. $user.pronoun().ucf() is someone who enjoys and actively seeks out social occasions, and especially enjoys talking with a big group of people.',
          '$user.name.ucf() $user.toBe() constantly energetic, exuberant and active. $user.pronoun().ucf() is someone who aims to be the centre of attention at social occasions, asserts onself in groups, and usually says, "Yes!"'
        ]
    },

    agreeableness: {
      desc: 'Agreeableness reflects individual differences concerning cooperation and social harmony.',
      poles: ['Competitive', 'Team-working and Trusting'],
      meta: 'People scoring high on this trait are generally considered soft-hearted, generous, and sympathetic, while people scoring low on this trait tend to be more driven, self-confident and competitive.',
      text: [
          '$user.name.ucf() $user.toBe() willing to make (tough|difficult) decisions when necessary, and will point out when something $user.toBe() wrong no matter what other people might feel. (One|You) might say that $user.pronoun() is tough and uncompromising.',
          '$user.name.ucf() often finds it difficult to get along with new people when they first meet, as $user.pronoun() can be suspicious of their motives. Over time though people warm to $user.poss(), and $user.pronoun() to them, although that doesn’t stop $user.poss() from telling them "how it $user.toBe()".',
          '$user.name.ucf() gets along with people well, especially once they have proved themselves trustworthy to $user.pronoun(). $user.pronoun().ucf() do have a healthy scepticism about others’ motives, but that doesn’t stop $user.pronoun() from considering others to be basically honest and decent.',
          '$user.name.ucf() is someone people get along with easily. $user.pronoun().ucf() $user.toBe() considerate and friendly, and expect others to be honest and decent.',
          '$user.name.ucf() $user.toBe() extremely easy to get along with. $user.pronoun().ucf() $user.toBe() considerate, friendly, generous and helpful and $user.pronoun() considers most others to be decent and trustworthy.'
        ]
    },

    neuroticism: {
      desc: 'Neuroticism refers to the tendency to experience negative emotions.',
      poles: ['Laid-back and Relaxed', 'Easily Stressed and Emotional'],
      meta: 'People scoring high on this trait generally worry more than most, and react poorly to stressful situations. However, they often show an emotional depth that others lack.',
      text: [
          '$user.name.ucf() $user.toBe() extremely (hard|difficult) to upset or stress out, since $user.pronoun() rarely, if ever, react with negative emotions, and even when $user.pronoun() $user.toBe() anxious about something the feeling quickly passes. $user.pronoun().ucf() comes across as very calm and resilient.',
          '$user.name.ucf() $user.toBe() calm and emotionally stable. $user.pronoun().ucf() comes across as someone who $user.toBe() rarely bothered by things, and when they do get $user.pronoun() down, the feeling does not persist for very long.',
          '$user.name.ucf() $user.toBe() generally calm. $user.pronoun().ucf() comes across as someone who can feel emotional or stressed out by some experiences, but $user.poss() feelings tend to be warranted by the situation.',
          '$user.name.ucf() tends to be more self-conscious than many. $user.pronoun().ucf() comes across as someone who can find it hard to not get caught up by anxious or stressful situations. $user.pronoun().ucf() $user.toBe() in touch with $user.poss() own feelings.',
          '$user.name.ucf() reacts poorly to stressful situations, and consequently worries about them more than most. However $user.pronoun() has an emotional depth that others may lack.'
        ]
    }
  };
