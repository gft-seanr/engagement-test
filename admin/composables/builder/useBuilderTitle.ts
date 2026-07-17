export function useBuilderTitle() {
  const title = useState<string>('builder-title', () => '');

  const setTitle = (newTitle: string) => {
    title.value = newTitle;
  };

  return { title, setTitle };
}
