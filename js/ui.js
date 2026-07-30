(() => {
  "use strict";

  const fieldTarget = (form, field) => {
    if (field === "pronouns" || field === "official-progress") {
      return form.querySelector(`[name="${field}"]`)?.closest("fieldset");
    }
    const namedRating = form.querySelector(`[name="${field}"]`);
    return namedRating?.closest("fieldset") || document.getElementById(field);
  };

  const clearErrors = (form) => {
    form.querySelectorAll("[aria-invalid]").forEach((element) => {
      element.removeAttribute("aria-invalid");
      element.removeAttribute("aria-describedby");
    });
    form.querySelectorAll(".field-error").forEach((element) => element.remove());
  };

  const showFieldErrors = (form, errors) => {
    clearErrors(form);
    const firstByField = new Map();
    errors.forEach((item) => {
      if (!firstByField.has(item.field)) firstByField.set(item.field, item);
    });

    firstByField.forEach((item, field) => {
      const target = fieldTarget(form, field);
      if (!target) return;
      const id = `error-${field}`;
      const message = document.createElement("span");
      message.className = "field-error";
      message.id = id;
      message.textContent = item.message;
      target.setAttribute("aria-invalid", "true");
      target.setAttribute("aria-describedby", id);
      target.insertAdjacentElement("afterend", message);
    });
  };

  const renderReview = (result, attempted) => {
    const panel = document.querySelector("#review-panel");
    const heading = panel.querySelector("[data-review-heading]");
    const list = panel.querySelector("[data-review-list]");
    const status = document.querySelector("[data-readiness]");
    list.replaceChildren();

    const visibleErrors = attempted ? result.errors : [];
    const items = [...visibleErrors, ...result.warnings];

    if (!items.length) {
      panel.hidden = !attempted;
      panel.dataset.kind = "success";
      heading.textContent = "Ready for report generation";
      if (attempted) {
        const li = document.createElement("li");
        li.textContent = "All required information is complete and no unusual combinations were detected.";
        list.append(li);
      }
    } else {
      panel.hidden = false;
      panel.dataset.kind = visibleErrors.length ? "error" : "warning";
      heading.textContent = visibleErrors.length
        ? `${visibleErrors.length} required ${visibleErrors.length === 1 ? "item needs" : "items need"} attention`
        : "Selections to review";
      items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.message;
        list.append(li);
      });
    }

    status.textContent = result.isValid
      ? "Inputs complete"
      : `${result.errors.length} required ${result.errors.length === 1 ? "item" : "items"} remaining`;
    status.dataset.ready = String(result.isValid);
  };

  const focusFirstError = (form, errors) => {
    if (!errors.length) return;
    const target = fieldTarget(form, errors[0].field);
    const collapsedDetails = target?.closest("details");
    if (collapsedDetails) collapsedDetails.open = true;
    const focusable = target?.matches("input, select, textarea, button")
      ? target
      : target?.querySelector("input, select, textarea, button");
    focusable?.focus();
  };

  const renderReport = (result) => {
    const empty = document.querySelector("[data-empty-preview]");
    const output = document.querySelector("[data-report-output]");
    const status = document.querySelector("[data-report-status]");
    const wordCount = document.querySelector("[data-word-count]");
    const characterCount = document.querySelector("[data-character-count]");

    empty.hidden = true;
    output.hidden = false;
    output.value = result.report;
    status.className = `status-badge status-${result.profile.overallBand}`;
    status.innerHTML = `<span class="status-dot" aria-hidden="true"></span>${result.profile.overallBand
      .replace("exceptional", "Strong Progress")
      .replace("on-track", "Secure Progress")
      .replace("needs-support", "Attention Needed")
      .replace("cause-concern", "Causing Concern")}`;
    wordCount.textContent = `${result.wordCount} ${result.wordCount === 1 ? "word" : "words"}`;
    characterCount.textContent = `${result.characterCount} characters`;
    document.querySelector("[data-edit-status]").hidden = true;
    document.querySelectorAll(
      "[data-restore], [data-regenerate], [data-clear-report], [data-copy]"
    ).forEach((button) => {
      button.disabled = false;
    });
  };

  const updateReportCounts = (text) => {
    const clean = text.trim();
    const words = clean ? clean.split(/\s+/).length : 0;
    document.querySelector("[data-word-count]").textContent =
      `${words} ${words === 1 ? "word" : "words"}`;
    document.querySelector("[data-character-count]").textContent =
      `${text.length} characters`;
  };

  const setEdited = (edited) => {
    document.querySelector("[data-edit-status]").hidden = !edited;
  };

  const clearReport = () => {
    document.querySelector("[data-empty-preview]").hidden = false;
    const output = document.querySelector("[data-report-output]");
    output.hidden = true;
    output.value = "";
    const status = document.querySelector("[data-report-status]");
    status.className = "status-badge";
    status.innerHTML = '<span class="status-dot" aria-hidden="true"></span>Not generated';
    document.querySelector("[data-word-count]").textContent = "0 words";
    document.querySelector("[data-character-count]").textContent = "0 characters";
    document.querySelector("[data-edit-status]").hidden = true;
    document.querySelectorAll(
      "[data-restore], [data-regenerate], [data-clear-report], [data-copy]"
    ).forEach((button) => {
      button.disabled = true;
    });
  };

  const markReportStale = () => {
    const status = document.querySelector("[data-report-status]");
    if (!document.querySelector("[data-report-output]").hidden) {
      status.className = "status-badge status-stale";
      status.innerHTML =
        '<span class="status-dot" aria-hidden="true"></span>Inputs changed';
    }
  };

  window.ParentReportUI = {
    clearErrors,
    showFieldErrors,
    renderReview,
    focusFirstError,
    renderReport,
    updateReportCounts,
    setEdited,
    clearReport,
    markReportStale
  };
})();
