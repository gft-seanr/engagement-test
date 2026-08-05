interface QueryOptions {
  programs: Ref<Program[]>;
  programTypeId?: ProgramTypeId;
  programId?: string;
}

export function useProgramInfoByKeyQuery(options: QueryOptions) {
  // Find the program based on either programId or programTypeId
  const program = computed(() => {
    if (options.programId) {
      return options.programs.value.find((program) => program.programId === options.programId);
    } else if (options.programTypeId) {
      return options.programs.value.find(
        (program) => program.programTypeId === options.programTypeId
      );
    }
    return undefined;
  });

  const programId = computed(() => {
    if (options.programId) return options.programId;
    return program.value?.programId || '';
  });

  const programInfoQuery = useProgramInfoQuery({ programId });

  return programInfoQuery;
}
