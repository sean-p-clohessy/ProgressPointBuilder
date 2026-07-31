(() => {
  "use strict";

  window.ParentReportPhrases = {
    openings: {
      exceptional: [
        "{name} is making excellent progress across {possessive} programme.",
        "{name} continues to perform above the expected level and is making highly positive progress.",
        "{name} is demonstrating excellent development in both knowledge and practical application."
      ],
      "on-track": [
        "{name} is making steady progress across the course.",
        "{name} is progressing appropriately towards {possessive} agreed target.",
        "{name} has maintained a positive and productive approach during this reporting period."
      ],
      "needs-support": [
        "{name} is making some progress, although further support is needed to reach the expected level.",
        "{namePossessive} current progress is below the expected point and requires additional focus.",
        "{name} has shown some positive development, but there remain areas that need improvement."
      ],
      "cause-concern": [
        "{name} is currently significantly behind the expected progress point.",
        "There is currently cause for concern regarding {namePossessive} progress across the course.",
        "{namePossessive} current level of progress places successful achievement at risk."
      ]
    },
    engagement: {
      exceptional: [
        "{subjectCap} participate{s} actively in lessons and contribute{s} thoughtfully to discussions.",
        "{subjectCap} engage{s} positively with learning activities and show{s} genuine enthusiasm.",
        "{subjectCap} make{s} effective use of lesson time and engage{s} well with both theory and practical tasks."
      ],
      "on-track": [
        "{subjectCap} engage{s} positively in lessons and participate{s} appropriately.",
        "{subjectCap} make{s} suitable use of lesson time and respond{s} well to activities.",
        "{subjectCap} maintain{s} an appropriate level of participation in learning."
      ],
      "needs-support": [
        "{possessiveCap} engagement can be inconsistent, and regular encouragement is sometimes required.",
        "{subjectCap} {is} capable of engaging well but {does} not yet maintain this consistently.",
        "Engagement varies across lessons, which can limit the progress {subject} make{s}."
      ],
      "cause-concern": [
        "{subjectCap} rarely engages fully and currently makes limited use of lesson time.",
        "Limited engagement is significantly restricting {possessive} participation in learning.",
        "{subjectCap} need{s} to engage much more consistently with lesson activities."
      ]
    },
    effort: {
      exceptional: [
        "{subjectCap} appl{yEnding} {reflexive} consistently and regularly exceed{s} expectations.",
        "{possessiveCap} commitment and application are particular strengths.",
        "{subjectCap} approach{esEnding} tasks with sustained effort and determination."
      ],
      "on-track": [
        "{subjectCap} appl{yEnding} suitable effort and respond{s} positively to tasks.",
        "{possessiveCap} effort is generally appropriate and supports continued development.",
        "{subjectCap} usually work{s} with an appropriate level of focus and application."
      ]
    },
    behaviour: {
      exceptional: [
        "{subjectCap} consistently demonstrate{s} maturity, respect and a highly positive attitude.",
        "{possessiveCap} conduct and attitude towards learning are exemplary."
      ],
      "on-track": [
        "{subjectCap} behave{s} appropriately and maintain{s} a positive approach to learning.",
        "{possessiveCap} attitude is positive, and {subject} work{s} respectfully with others."
      ],
      "needs-support": [
        "{possessiveCap} attitude or behaviour can be inconsistent and sometimes requires reminders.",
        "{subjectCap} need{s} to maintain a more consistently positive approach to learning."
      ],
      "cause-concern": [
        "{possessiveCap} current behaviour is affecting learning and must improve.",
        "Behaviour is a significant concern and is limiting both participation and progress."
      ]
    },
    contrast: {
      effortProgress: [
        "Despite this positive approach, {possessive} current outcomes are below the expected level.",
        "Although {subject} appl{yEnding} {reflexive} positively, this effort is not yet consistently reflected in {possessive} assessed work.",
        "{possessiveCap} attitude towards learning is positive, but stronger academic outcomes are still needed."
      ],
      attendanceRisk: [
        "Current work is at the expected standard, but attendance must improve to protect future progress.",
        "Although {possessive} current outcomes are secure, inconsistent attendance could make this difficult to sustain."
      ],
      attendanceAndProgress: [
        "When present, {subject} demonstrate{s} the ability to make progress, but attendance is limiting continuity of learning.",
        "{subjectCap} show{s} potential in lessons; however, attendance is contributing to the current progress concern."
      ],
      practicalWritten: [
        "{subjectCap} demonstrate{s} clear practical capability, while written work and completion require further development.",
        "Practical performance is a strength, but this is not yet matched consistently in written work."
      ]
    },
    attendance: {
      exceptional: [
        "Attendance is excellent{attendanceValue}, and {subject} make{s} consistent use of scheduled learning.",
        "{subjectCap} attend{s} consistently{attendanceValue}, which provides a strong foundation for progress."
      ],
      "on-track": [
        "Attendance is generally secure{attendanceValue} and supports continued progress.",
        "{possessiveCap} attendance{attendanceValue} is currently at an appropriate level."
      ],
      "needs-support": [
        "Attendance{attendanceValue} is inconsistent and requires improvement.",
        "{possessiveCap} attendance{attendanceValue} is beginning to affect continuity of learning."
      ],
      "cause-concern": [
        "Attendance{attendanceValue} is a serious concern and is significantly limiting participation.",
        "{possessiveCap} current attendance{attendanceValue} is placing successful progress at risk."
      ]
    },
    punctuality: {
      exceptional: "Punctuality is excellent{punctualityValue}.",
      "on-track": "Punctuality is generally secure{punctualityValue}.",
      "needs-support": "Punctuality{punctualityValue} needs to become more consistent.",
      "cause-concern": "Persistent punctuality concerns{punctualityValue} are reducing available learning time."
    },
    contexts: {
      "medical-absence": "Attendance has been affected by health-related circumstances, and this context should be considered when reviewing the current figure.",
      "authorised-absence": "Some absence has been authorised and should be considered alongside the current attendance figure.",
      "personal-circumstances": "Relevant personal circumstances should be considered when reviewing {possessive} progress during this reporting period.",
      "late-enrolment": "{name} joined the course late and is continuing to settle in and catch up with missed learning.",
      "improved-attendance": "It is positive that attendance has improved recently.",
      "improved-punctuality": "Recent improvement in punctuality is encouraging.",
      "behaviour-intervention": "A behaviour intervention is in place to support more consistent choices.",
      "learning-support": "{subjectCap} {has} access to learning support and should continue to use it purposefully.",
      placement: "Placement or work-experience activity provides useful evidence of {possessive} developing skills.",
      settling: "{subjectCap} {has} experienced some difficulty settling into the course and continue{s} to need support with this.",
      "catch-up": "Missed work now needs to be completed so that important gaps do not remain.",
      "strong-practical-performance": "{possessiveCap} practical performance is a particular strength.",
      "strong-written-performance": "{possessiveCap} written work is a particular strength.",
      university: "{subjectCap} {is} working towards university progression and should keep this longer-term goal in focus.",
      "frequent-phone-use": "Frequent phone use during lessons is affecting {possessive} focus and reducing productive learning time."
    },
    conclusions: {
      exceptional: [
        "Maintaining these high standards will help {object} continue to achieve excellent outcomes.",
        "{name} should continue to build on these strengths and sustain this excellent approach."
      ],
      "on-track": [
        "Continuing this approach will help {object} remain securely on track.",
        "{name} should now build on this secure foundation and continue working towards {possessive} target."
      ],
      "needs-support": [
        "The main priority is now to {action}.",
        "Moving forward, {name} should focus on {action}.",
        "To move back on track, {subject} now need{s} to {action}."
      ],
      "cause-concern": [
        "Immediate and sustained attention to {action} is now required.",
        "To reduce the risk to achievement, {subject} must now {action}.",
        "The urgent next step is to {action}."
      ]
    }
  };
})();
