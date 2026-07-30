(() => {
  "use strict";

  const ratingNames = ["behaviour", "engagement", "effort"];

  const value = (form, selector) => form.querySelector(selector)?.value.trim() || "";
  const selected = (form, name) =>
    form.querySelector(`[name="${name}"]:checked`)?.value || "";

  const collect = (form) => {
    const pronounMode = selected(form, "pronouns");
    return {
      learner: {
        name: value(form, "#learner-name"),
        course: value(form, "#course"),
        reportingPeriod: value(form, "#reporting-period"),
        lecturerName: value(form, "#lecturer-name"),
        pronounMode,
        customPronouns: {
          subject: value(form, "#subject-pronoun"),
          object: value(form, "#object-pronoun"),
          possessive: value(form, "#possessive-pronoun"),
          reflexive: value(form, "#reflexive-pronoun")
        }
      },
      officialProgressIndicator: selected(form, "official-progress"),
      ratings: Object.fromEntries(
        ratingNames.map((name) => [name, selected(form, name)])
      ),
      percentages: {
        attendance: value(form, "#attendance-percentage-optional"),
        punctuality: value(form, "#punctuality-percentage-optional")
      },
      contextTypes: Array.from(
        form.querySelectorAll('[name="context"]:checked'),
        (input) => input.value
      ),
      evidence: {
        notableStrength: value(form, "#notable-strength"),
        recentAchievement: value(form, "#recent-achievement"),
        mainConcern: value(form, "#main-concern"),
        agreedNextStep: value(form, "#agreed-next-step"),
        additionalContext: value(form, "#context-notes")
      },
      options: {
        length: value(form, "#report-length") || "detailed",
        tone: "balanced",
        variationIndex: 0
      }
    };
  };

  const hasMeaningfulData = (state) =>
    Boolean(
      state.learner.name ||
      state.learner.course ||
      state.learner.reportingPeriod ||
      state.learner.lecturerName ||
      state.learner.pronounMode ||
      state.officialProgressIndicator ||
      Object.values(state.ratings).some(Boolean) ||
      Object.values(state.percentages).some(Boolean) ||
      state.contextTypes.length ||
      Object.values(state.evidence).some(Boolean) ||
      state.options.length !== "detailed"
    );

  window.ParentReportState = { collect, hasMeaningfulData, ratingNames };
})();
