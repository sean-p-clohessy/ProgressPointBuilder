(() => {
  "use strict";

  const error = (field, message) => ({ field, message });
  const warning = (code, message) => ({ code, message });

  const percentageError = (field, label, rawValue) => {
    if (rawValue === "") return null;
    const number = Number(rawValue);
    return Number.isFinite(number) && number >= 0 && number <= 100
      ? null
      : error(field, `${label} must be a number from 0 to 100.`);
  };

  const validate = (state) => {
    const errors = [];
    const warnings = [];

    if (!state.learner.name) {
      errors.push(error("learner-name", "Enter the learner’s name."));
    }
    if (!state.learner.pronounMode) {
      errors.push(error("pronouns", "Select a pronoun option."));
    }
    if (state.learner.pronounMode === "custom") {
      Object.entries(state.learner.customPronouns).forEach(([key, value]) => {
        if (!value) {
          errors.push(
            error(
              `${key}-pronoun`,
              `Enter the custom ${key === "possessive" ? "possessive adjective" : `${key} pronoun`}.`
            )
          );
        }
      });
    }
    if (!state.officialProgressIndicator) {
      errors.push(error("official-progress", "Select the official progress indicator."));
    }

    window.ParentReportState.ratingNames.forEach((name) => {
      if (!state.ratings[name]) {
        const readable = name
          .replace("workQuality", "quality and completion of work")
          .replace(/([A-Z])/g, " $1")
          .toLowerCase();
        errors.push(error(name, `Select a rating for ${readable}.`));
      }
    });

    [
      percentageError(
        "attendance-percentage-optional",
        "Attendance percentage",
        state.percentages.attendance
      ),
      percentageError(
        "punctuality-percentage-optional",
        "Punctuality percentage",
        state.percentages.punctuality
      )
    ].filter(Boolean).forEach((item) => errors.push(item));

    if (
      state.contextTypes.includes("other") &&
      !state.evidence.otherContext
    ) {
      errors.push(
        error("other-context", "Clarify the selected “Other” context.")
      );
    }

    if (
      state.officialProgressIndicator === "cause-concern" &&
      !state.evidence.mainConcern &&
      !state.evidence.agreedNextStep
    ) {
      warnings.push(
        warning(
          "missing-concern-detail",
          "Consider adding a specific concern or agreed next step to make the report more informative."
        )
      );
    }

    return { errors, warnings, isValid: errors.length === 0 };
  };

  window.ParentReportValidation = { validate };
})();
