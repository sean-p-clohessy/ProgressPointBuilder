(() => {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const demoButton = document.querySelector("[data-demo-load]");
  const demoSelect = document.querySelector("[data-demo-select]");
  const resetButton = document.querySelector("[data-reset]");
  const reviewButton = document.querySelector("[data-review]");
  const reportEditor = document.querySelector("[data-report-output]");
  const restoreButton = document.querySelector("[data-restore]");
  const regenerateButton = document.querySelector("[data-regenerate]");
  const clearReportButton = document.querySelector("[data-clear-report]");
  const copyButton = document.querySelector("[data-copy]");
  const form = document.querySelector("#report-form");
  const customPronouns = document.querySelector("#custom-pronouns");
  let state = window.ParentReportState.collect(form);
  let validationAttempted = false;
  let hasGeneratedReport = false;
  let generatedDraft = "";
  let variationIndex = 0;
  let manuallyEdited = false;

  const demoProfiles = {
    am: {
      values: {
        "learner-name": "Alex Morgan",
        "attendance-percentage-optional": "96",
        "punctuality-percentage-optional": "91",
        "notable-strength": "Strong practical problem-solving",
        "recent-achievement": "Completed the first assignment at distinction standard",
        "main-concern": "Written assignments are below the expected standard",
        "agreed-next-step": "Act consistently on written feedback"
      },
      pronouns: "they",
      progress: "needs-support",
      ratings: {
        behaviour: "on-track",
        engagement: "exceptional",
        effort: "on-track"
      },
      contexts: ["strong-practical-performance", "learning-support"]
    },
    jc: {
      values: {
        "learner-name": "Jordan Clarke",
        "attendance-percentage-optional": "98",
        "punctuality-percentage-optional": "100",
        "notable-strength": "Thoughtful contributions and strong written work",
        "recent-achievement": "Applied course knowledge confidently during placement",
        "main-concern": "",
        "agreed-next-step": "Maintain these high standards and prepare for university progression"
      },
      pronouns: "she",
      progress: "exceptional",
      ratings: {
        behaviour: "exceptional",
        engagement: "exceptional",
        effort: "exceptional"
      },
      contexts: ["placement", "strong-written-performance", "university"]
    },
    sr: {
      values: {
        "learner-name": "Sam Reed",
        "attendance-percentage-optional": "75",
        "punctuality-percentage-optional": "82",
        "notable-strength": "Shows clear potential during practical activities",
        "recent-achievement": "Punctuality has begun to improve",
        "main-concern": "Distraction and inconsistent effort are limiting progress",
        "agreed-next-step": "Remain focused, complete missed work and meet the agreed behaviour expectations"
      },
      pronouns: "he",
      progress: "cause-concern",
      ratings: {
        behaviour: "cause-concern",
        engagement: "needs-support",
        effort: "cause-concern"
      },
      contexts: ["improved-punctuality", "behaviour-intervention", "catch-up"]
    }
  };

  const systemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    themeButton.setAttribute("aria-pressed", String(theme === "dark"));
    themeButton.setAttribute(
      "aria-label",
      `Switch to ${theme === "dark" ? "light" : "dark"} mode`
    );
    themeLabel.textContent = theme === "dark" ? "Dark mode" : "Light mode";
  };

  const savedTheme = () => {
    try {
      return localStorage.getItem("prb-theme");
    } catch {
      return null;
    }
  };

  const update = () => {
    state = window.ParentReportState.collect(form);
    const result = window.ParentReportValidation.validate(state);
    window.ParentReportUI.renderReview(result, validationAttempted);
    if (validationAttempted) {
      window.ParentReportUI.showFieldErrors(form, result.errors);
    }
    return result;
  };

  const setCustomPronounVisibility = () => {
    const visible = form.querySelector('[name="pronouns"]:checked')?.value === "custom";
    customPronouns.hidden = !visible;
    customPronouns.querySelectorAll("input").forEach((input) => {
      input.required = visible;
    });
  };

  const clearForm = () => {
    form.reset();
    validationAttempted = false;
    setCustomPronounVisibility();
    window.ParentReportUI.clearErrors(form);
    window.ParentReportUI.clearReport();
    hasGeneratedReport = false;
    generatedDraft = "";
    variationIndex = 0;
    manuallyEdited = false;
    update();
  };

  const generateFromCurrentState = () => {
    const input = {
      ...state,
      options: { ...state.options, variationIndex }
    };
    const generated = window.ParentReportEngine.generateReport(input);
    generatedDraft = generated.report;
    manuallyEdited = false;
    window.ParentReportUI.renderReport(generated);
    hasGeneratedReport = true;
    return generated;
  };

  applyTheme(savedTheme() || systemTheme());
  update();

  themeButton.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("prb-theme", theme);
    } catch {
      // The preference remains active for this page when storage is unavailable.
    }
    applyTheme(theme);
  });

  form.addEventListener("input", () => {
    setCustomPronounVisibility();
    update();
    if (hasGeneratedReport) window.ParentReportUI.markReportStale();
  });
  form.addEventListener("change", () => {
    setCustomPronounVisibility();
    update();
    if (hasGeneratedReport) window.ParentReportUI.markReportStale();
  });
  form.addEventListener("submit", (event) => event.preventDefault());

  reviewButton.addEventListener("click", () => {
    validationAttempted = true;
    const result = update();
    window.ParentReportUI.showFieldErrors(form, result.errors);
    if (!result.isValid) {
      window.ParentReportUI.focusFirstError(form, result.errors);
    } else {
      variationIndex = 0;
      generateFromCurrentState();
      document.querySelector("#preview-heading").focus();
    }
  });

  reportEditor.addEventListener("input", () => {
    manuallyEdited = reportEditor.value !== generatedDraft;
    window.ParentReportUI.setEdited(manuallyEdited);
    window.ParentReportUI.updateReportCounts(reportEditor.value);
  });

  restoreButton.addEventListener("click", () => {
    if (
      manuallyEdited &&
      !window.confirm("Restore the generated draft and discard your edits?")
    ) {
      return;
    }
    reportEditor.value = generatedDraft;
    manuallyEdited = false;
    window.ParentReportUI.setEdited(false);
    window.ParentReportUI.updateReportCounts(reportEditor.value);
    reportEditor.focus();
  });

  regenerateButton.addEventListener("click", () => {
    if (
      manuallyEdited &&
      !window.confirm("Regenerating will replace your current edits. Continue?")
    ) {
      return;
    }
    validationAttempted = true;
    const result = update();
    if (!result.isValid) {
      window.ParentReportUI.showFieldErrors(form, result.errors);
      window.ParentReportUI.focusFirstError(form, result.errors);
      return;
    }
    variationIndex += 1;
    generateFromCurrentState();
    reportEditor.focus();
  });

  clearReportButton.addEventListener("click", () => {
    if (
      manuallyEdited &&
      !window.confirm("Clear the report and discard your edits?")
    ) {
      return;
    }
    window.ParentReportUI.clearReport();
    hasGeneratedReport = false;
    generatedDraft = "";
    manuallyEdited = false;
    variationIndex = 0;
    reviewButton.focus();
  });

  copyButton.addEventListener("click", async () => {
    if (!reportEditor.value) return;
    let copied = false;
    try {
      await navigator.clipboard.writeText(reportEditor.value);
      copied = true;
    } catch {
      reportEditor.focus();
      reportEditor.select();
      copied = document.execCommand("copy");
    }
    if (copied) {
      const originalLabel = copyButton.textContent;
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = originalLabel;
      }, 1800);
    }
  });

  resetButton.addEventListener("click", () => {
    state = window.ParentReportState.collect(form);
    if (
      window.ParentReportState.hasMeaningfulData(state) &&
      !window.confirm("Clear all learner details, ratings and context?")
    ) {
      return;
    }
    clearForm();
    document.querySelector("#learner-name").focus();
  });

  demoButton.addEventListener("click", () => {
    if (
      window.ParentReportState.hasMeaningfulData(state) &&
      !window.confirm("Replace the current form with the development demo?")
    ) {
      return;
    }
    clearForm();
    const profile = demoProfiles[demoSelect.value] || demoProfiles.am;
    Object.entries(profile.values).forEach(([id, fieldValue]) => {
      document.getElementById(id).value = fieldValue;
    });
    form.querySelector(`[name="pronouns"][value="${profile.pronouns}"]`).checked = true;
    form.querySelector(
      `[name="official-progress"][value="${profile.progress}"]`
    ).checked = true;
    Object.entries(profile.ratings).forEach(([name, rating]) => {
      form.querySelector(`[name="${name}"][value="${rating}"]`).checked = true;
    });
    profile.contexts.forEach((context) => {
      form.querySelector(`[name="context"][value="${context}"]`).checked = true;
    });
    document.querySelector(".optional-details").open = true;
    setCustomPronounVisibility();
    update();
    if (hasGeneratedReport) window.ParentReportUI.markReportStale();
    document.querySelector("#learner-name").focus();
  });
})();
