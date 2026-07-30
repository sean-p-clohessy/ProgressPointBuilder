(() => {
  "use strict";

  const categories = ["behaviour", "engagement", "effort"];

  const makeInput = (official = "on-track", rating = "on-track") => ({
    learner: {
      name: "Alex",
      pronounMode: "they",
      customPronouns: { subject: "", object: "", possessive: "", reflexive: "" }
    },
    officialProgressIndicator: official,
    ratings: Object.fromEntries(categories.map((category) => [category, rating])),
    percentages: { attendance: "", punctuality: "" },
    contextTypes: [],
    evidence: {
      notableStrength: "", recentAchievement: "", mainConcern: "",
      agreedNextStep: "", additionalContext: ""
    },
    options: { length: "standard", tone: "balanced", variationIndex: 0 }
  });

  const includesAny = (text, terms) =>
    terms.some((term) => text.toLowerCase().includes(term.toLowerCase()));

  const tests = [
    ["Exceptional approach", () => {
      const result = ParentReportEngine.generateReport(makeInput("exceptional", "exceptional"));
      return result.profile.overallBand === "exceptional" &&
        includesAny(result.report, ["excellent", "above the expected"]) &&
        !result.report.toLowerCase().includes("concern");
    }],
    ["On-track approach", () => {
      const report = ParentReportEngine.generateReport(makeInput()).report;
      return includesAny(report, ["steady progress", "progressing appropriately", "positive and productive"]);
    }],
    ["Positive approach with progress concern", () => {
      const input = makeInput("needs-support", "exceptional");
      const result = ParentReportEngine.generateReport(input);
      return result.profile.contrastDetected &&
        includesAny(result.report, ["outcomes", "expected level"]);
    }],
    ["Engagement concern", () => {
      const input = makeInput();
      input.ratings.engagement = "cause-concern";
      const report = ParentReportEngine.generateReport(input).report;
      return includesAny(report, ["engage", "lesson time"]);
    }],
    ["Behaviour concern", () => {
      const input = makeInput();
      input.ratings.behaviour = "cause-concern";
      const report = ParentReportEngine.generateReport(input).report;
      return includesAny(report, ["behaviour", "conduct"]) &&
        includesAny(report, ["must improve", "significant concern"]);
    }],
    ["Effort concern", () => {
      const input = makeInput("needs-support");
      input.ratings.effort = "cause-concern";
      const report = ParentReportEngine.generateReport(input).report;
      return includesAny(report, ["effort", "application", "feedback"]);
    }],
    ["Optional percentages remain factual", () => {
      const input = makeInput();
      input.percentages = { attendance: "84", punctuality: "100" };
      const report = ParentReportEngine.generateReport(input).report;
      return report.includes("84%") && report.includes("100%") &&
        !includesAny(report, ["poor attendance", "excellent attendance"]);
    }],
    ["Medical context is neutral", () => {
      const input = makeInput();
      input.contextTypes = ["medical-absence"];
      const report = ParentReportEngine.generateReport(input).report;
      return report.includes("health-related circumstances") && !report.includes("poor commitment");
    }],
    ["Singular they grammar", () => {
      const input = makeInput("needs-support");
      const report = ParentReportEngine.generateReport(input).report.toLowerCase();
      return report.includes("they") && report.includes("their") &&
        !includesAny(report, ["they is", "they needs", "they makes", " he ", " she "]);
    }],
    ["Name-only mode", () => {
      const input = makeInput();
      input.learner.name = "Chris";
      input.learner.pronounMode = "name";
      const report = ParentReportEngine.generateReport(input).report.toLowerCase();
      return report.includes("chris") &&
        !includesAny(report, [" he ", " she ", " they ", " his ", " her ", " their "]);
    }],
    ["Determinism", () => {
      const input = makeInput();
      return ParentReportEngine.generateReport(input).report ===
        ParentReportEngine.generateReport(input).report;
    }],
    ["Controlled variation preserves judgement", () => {
      const first = makeInput();
      const second = makeInput();
      second.options.variationIndex = 1;
      const a = ParentReportEngine.generateReport(first);
      const b = ParentReportEngine.generateReport(second);
      return a.report !== b.report && a.profile.overallBand === b.profile.overallBand;
    }]
  ];

  const run = () => {
    const output = tests.map(([name, test]) => {
      try {
        return { name, passed: Boolean(test()) };
      } catch (error) {
        return { name, passed: false, detail: error.message };
      }
    });
    if (typeof document !== "undefined") {
      const list = document.querySelector("#results");
      output.forEach(({ name, passed, detail }) => {
        const item = document.createElement("li");
        item.className = passed ? "pass" : "fail";
        item.textContent = `${passed ? "PASS" : "FAIL"} — ${name}${detail ? `: ${detail}` : ""}`;
        list.append(item);
      });
      const passed = output.filter((test) => test.passed).length;
      const summary = document.querySelector("#summary");
      summary.textContent = `${passed} of ${output.length} tests passed.`;
      summary.className = passed === output.length ? "pass" : "fail";
    }
    return output;
  };

  window.ParentReportTests = { run };
  run();
})();
