(() => {
  "use strict";

  const score = {
    exceptional: 1,
    "on-track": 2,
    "needs-support": 3,
    "cause-concern": 4
  };

  const hash = (text) => {
    let value = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  };

  const choose = (items, key, variationIndex) => {
    const list = Array.isArray(items) ? items : [items];
    return list[(hash(key) + Number(variationIndex || 0)) % list.length];
  };

  const possessiveName = (name) => (/s$/i.test(name) ? `${name}’` : `${name}’s`);

  const pronounsFor = (learner) => {
    const sets = {
      he: { subject: "he", object: "him", possessive: "his", reflexive: "himself" },
      she: { subject: "she", object: "her", possessive: "her", reflexive: "herself" },
      they: { subject: "they", object: "them", possessive: "their", reflexive: "themselves" }
    };
    if (learner.pronounMode === "name") {
      return {
        subject: learner.name,
        object: learner.name,
        possessive: possessiveName(learner.name),
        reflexive: learner.name
      };
    }
    if (learner.pronounMode === "custom") return learner.customPronouns;
    return sets[learner.pronounMode] || sets.they;
  };

  const capitalise = (text) =>
    text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : "";

  const tokensFor = (input) => {
    const pronouns = pronounsFor(input.learner);
    const pluralAgreement = pronouns.subject.toLowerCase() === "they";
    return {
      name: input.learner.name,
      namePossessive: possessiveName(input.learner.name),
      subject: pronouns.subject,
      subjectCap: capitalise(pronouns.subject),
      object: pronouns.object,
      possessive: pronouns.possessive,
      possessiveCap: capitalise(pronouns.possessive),
      reflexive: pronouns.reflexive,
      s: pluralAgreement ? "" : "s",
      yEnding: pluralAgreement ? "y" : "ies",
      esEnding: pluralAgreement ? "" : "es",
      is: pluralAgreement ? "are" : "is",
      has: pluralAgreement ? "have" : "has",
      does: pluralAgreement ? "do" : "does"
    };
  };

  const fill = (template, tokens) =>
    template.replace(/\{(\w+)\}/g, (_, token) => tokens[token] ?? "");

  const ensureSentence = (text) => {
    if (!text) return "";
    const clean = text.trim().replace(/\s+/g, " ");
    return /[.!?]$/.test(clean) ? clean : `${clean}.`;
  };

  const evidenceSentence = (prefix, evidence) => {
    if (!evidence) return "";
    const clean = evidence.trim().replace(/[.!?]+$/, "");
    return ensureSentence(`${prefix}${clean.charAt(0).toLowerCase()}${clean.slice(1)}`);
  };

  const labelledEvidence = (label, evidence) => {
    if (!evidence) return "";
    const clean = evidence.trim().replace(/[.!?]+$/, "");
    return ensureSentence(`${label}: ${clean}`);
  };

  const analyseProfile = (input) => {
    const entries = Object.entries(input.ratings);
    const bestScore = Math.min(...entries.map(([, band]) => score[band]));
    const worstScore = Math.max(...entries.map(([, band]) => score[band]));
    const positiveApproach =
      score[input.ratings.engagement] <= 2 || score[input.ratings.effort] <= 2;
    const progressConcern = score[input.officialProgressIndicator] >= 3;
    const behaviourConcern = score[input.ratings.behaviour] >= 3;

    return {
      overallBand: input.officialProgressIndicator,
      strongestCategories: entries
        .filter(([, band]) => score[band] === bestScore)
        .map(([category]) => category),
      weakestCategories: entries
        .filter(([, band]) => score[band] === worstScore)
        .map(([category]) => category),
      contrastDetected: positiveApproach && progressConcern,
      contrasts: { positiveApproachProgress: positiveApproach && progressConcern },
      behaviourConcern
    };
  };

  const participationSentence = (input, tokens) => {
    const attendance = input.percentages.attendance;
    const punctuality = input.percentages.punctuality;
    if (!attendance && !punctuality) return "";
    if (attendance && punctuality) {
      return `Attendance is currently ${Number(attendance)}%, while punctuality is ${Number(punctuality)}%.`;
    }
    if (attendance) return `Attendance is currently ${Number(attendance)}%.`;
    return `Punctuality is currently ${Number(punctuality)}%.`;
  };

  const defaultAction = (input) => {
    if (input.ratings.behaviour === "cause-concern") {
      return "meet the agreed behaviour expectations consistently";
    }
    if (score[input.ratings.engagement] >= 3) {
      return "engage consistently and make fuller use of lesson time";
    }
    if (score[input.ratings.effort] >= 3) {
      return "apply consistent effort to each task";
    }
    if (score[input.officialProgressIndicator] >= 3) {
      return "act on feedback and complete the agreed actions";
    }
    return "maintain this positive approach and continue working towards the agreed target";
  };

  const compose = (input, profile, tokens) => {
    const bank = window.ParentReportPhrases;
    const variation = input.options?.variationIndex ?? 0;
    const pick = (items, key) => fill(choose(items, key, variation), tokens);
    const sentences = {
      opening: pick(bank.openings[input.officialProgressIndicator], "opening"),
      strength: "",
      details: [
        pick(bank.behaviour[input.ratings.behaviour], "behaviour-detail"),
        pick(bank.engagement[input.ratings.engagement], "engagement-detail")
      ],
      participation: "",
      contexts: [],
      evidence: [],
      additionalEvidence: "",
      contrast: "",
      concern: "",
      agreedNextStep: "",
      conclusion: ""
    };

    if (bank.effort[input.ratings.effort]) {
      sentences.details.push(pick(bank.effort[input.ratings.effort], "effort-detail"));
    } else {
      const effortConcern = input.ratings.effort === "cause-concern"
        ? `${tokens.possessiveCap} current effort is insufficient to support successful progress.`
        : `${tokens.possessiveCap} effort is inconsistent and greater application is required.`;
      sentences.details.push(effortConcern);
    }

    if (score[input.ratings.engagement] <= 2) {
      sentences.strength = pick(bank.engagement[input.ratings.engagement], "engagement");
    } else if (score[input.ratings.effort] <= 2) {
      sentences.strength = pick(bank.effort[input.ratings.effort], "effort");
    } else if (score[input.ratings.behaviour] <= 2) {
      sentences.strength = pick(bank.behaviour[input.ratings.behaviour], "behaviour");
    }

    sentences.participation = participationSentence(input, tokens);
    if (input.contextTypes.includes("medical-absence")) {
      sentences.contexts.push(fill(bank.contexts["medical-absence"], tokens));
    }
    input.contextTypes
      .filter((type) => type !== "medical-absence" && type !== "other")
      .forEach((type) => {
        if (bank.contexts[type]) sentences.contexts.push(fill(bank.contexts[type], tokens));
      });
    if (
      input.contextTypes.includes("other") &&
      input.evidence.otherContext
    ) {
      sentences.contexts.unshift(
        labelledEvidence("Additional context", input.evidence.otherContext)
      );
    }

    if (profile.behaviourConcern) {
      sentences.contrast = pick(bank.behaviour[input.ratings.behaviour], "behaviour-concern");
    } else if (score[input.ratings.engagement] >= 3) {
      sentences.contrast = pick(bank.engagement[input.ratings.engagement], "engagement-concern");
    } else if (score[input.ratings.effort] >= 3) {
      sentences.contrast = input.ratings.effort === "cause-concern"
        ? `${tokens.possessiveCap} current effort is insufficient to support successful progress.`
        : `${tokens.possessiveCap} effort is inconsistent and greater application is required.`;
    } else if (profile.contrasts.positiveApproachProgress) {
      sentences.contrast = pick(bank.contrast.effortProgress, "approach-progress");
    } else if (score[input.officialProgressIndicator] >= 3) {
      sentences.contrast = `${tokens.possessiveCap} current outcomes are below the expected level and require further focus.`;
    }

    if (input.evidence.notableStrength) {
      sentences.evidence.push(labelledEvidence("Notable strength", input.evidence.notableStrength));
    }
    if (input.evidence.recentAchievement) {
      sentences.evidence.push(labelledEvidence("Recent achievement", input.evidence.recentAchievement));
    }
    if (input.evidence.mainConcern) {
      sentences.concern = labelledEvidence("Main concern", input.evidence.mainConcern);
    }
    if (input.evidence.additionalContext) {
      sentences.additionalEvidence = labelledEvidence(
        "Additional evidence",
        input.evidence.additionalContext
      );
    }

    const action = defaultAction(input);
    tokens.action = action.charAt(0).toLowerCase() + action.slice(1);
    if (input.evidence.agreedNextStep) {
      sentences.agreedNextStep = labelledEvidence(
        "Agreed next step",
        input.evidence.agreedNextStep
      );
    }
    sentences.conclusion = pick(
      bank.conclusions[input.officialProgressIndicator],
      "conclusion"
    );
    return sentences;
  };

  const selectForLength = (sentences, length) => {
    if (length === "concise") {
      return [
        sentences.opening,
        sentences.strength,
        sentences.contrast,
        sentences.concern,
        sentences.additionalEvidence,
        sentences.agreedNextStep,
        sentences.conclusion
      ];
    }
    if (length === "detailed") {
      return [
        sentences.opening,
        ...sentences.details,
        ...sentences.evidence,
        sentences.additionalEvidence,
        sentences.participation,
        ...sentences.contexts,
        sentences.contrast,
        sentences.concern,
        sentences.agreedNextStep,
        sentences.conclusion
      ];
    }
    return [
      sentences.opening,
      sentences.strength,
      sentences.evidence[0],
      sentences.additionalEvidence,
      sentences.participation,
      sentences.contexts[0],
      sentences.contrast,
      sentences.concern,
      sentences.agreedNextStep,
      sentences.conclusion
    ];
  };

  const removeDuplicates = (sentences) => {
    const seen = new Set();
    return sentences
      .map(ensureSentence)
      .filter(Boolean)
      .filter((sentence) => {
        const key = sentence.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  };

  const generateReport = (input) => {
    const profile = analyseProfile(input);
    const tokens = tokensFor(input);
    const groups = compose(input, profile, tokens);
    const report = removeDuplicates(
      selectForLength(groups, input.options?.length || "detailed")
    ).join(" ");
    return {
      report,
      nextStep: groups.conclusion,
      profile,
      warnings: [],
      wordCount: report ? report.split(/\s+/).length : 0,
      characterCount: report.length
    };
  };

  window.ParentReportEngine = { generateReport, analyseProfile };
})();
