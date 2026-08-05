// State Example
// "state": "login|status=active|count>3"
// "state": "login|score>=80"
// "state": "login|isRedemptionExpired=true"
// "state": "login|type!=guest"

export function useSectionState(
  states: string[],
  sections: Section[],
  defaultState?: string,
  conditionalState?: Ref<Record<string, any>>
) {
  if (!Array.isArray(states) || !Array.isArray(sections)) {
    throw new Error('States and sections must be arrays.');
  }

  const currentSectionState = ref(defaultState || states[0]);
  const isSectionUpdating = ref(false);

  function setSectionState(state: string) {
    if (states.includes(state)) {
      currentSectionState.value = state;
    } else {
      console.warn(`State "${state}" is not defined in the states array.`);
    }
  }

  function nextSectionState() {
    const currentIndex = states.indexOf(currentSectionState.value);
    if (currentIndex < states.length - 1) {
      currentSectionState.value = states[currentIndex + 1];
    }
  }

  function previousSectionState() {
    const currentIndex = states.indexOf(currentSectionState.value);
    if (currentIndex > 0) {
      currentSectionState.value = states[currentIndex - 1];
    }
  }

  const visibleSections = computed(() => {
    return sections.filter((section) => {
      if (!section.state) return true; // If no state is defined, show the section

      const stateParts = section.state.split('|');

      return stateParts.every((statePart) => matchStatePart(statePart.trim()));
    });
  });

  function matchStatePart(statePart: string) {
    // Value comparisons
    // e.g., "status=active", "count>3", "score>=80, "isRedemptionExpired=true"
    const match = statePart.match(/^(\w+)\s*(=|!=|>=|<=|>|<)\s*(.+)$/);
    if (match) {
      const [, key, operator, rawValue] = match;

      const conditionValue = conditionalState?.value[key];
      let compareValue;

      if (rawValue === 'true') {
        compareValue = true;
      } else if (rawValue === 'false') {
        compareValue = false;
      } else if (!isNaN(Number(rawValue))) {
        compareValue = Number(rawValue);
      } else {
        compareValue = rawValue;
      }

      switch (operator) {
        case '=':
          return conditionValue == compareValue;
        case '!=':
          return conditionValue != compareValue;
        case '>':
          return conditionValue > compareValue;
        case '<':
          return conditionValue < compareValue;
        case '>=':
          return conditionValue >= compareValue;
        case '<=':
          return conditionValue <= compareValue;
      }
    }

    // Direct state match
    return statePart === currentSectionState.value;
  }

  watch(visibleSections, () => {
    isSectionUpdating.value = true;
    setTimeout(() => {
      isSectionUpdating.value = false;
    }, 300); // duration of transition
  });

  return {
    currentSectionState,
    visibleSections,
    isSectionUpdating,
    setSectionState,
    nextSectionState,
    previousSectionState,
  };
}
