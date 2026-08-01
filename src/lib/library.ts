type LibraryFilterInput = {
  notes: string;
  query: string;
  selectedCategory: string;
  topicCategory?: string;
  topicTitle?: string;
};

export function matchesLibraryFilters({
  notes,
  query,
  selectedCategory,
  topicCategory,
  topicTitle
}: LibraryFilterInput) {
  const normalizedCategory = selectedCategory.trim().toLocaleLowerCase();
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchesCategory =
    !normalizedCategory ||
    topicCategory?.toLocaleLowerCase() === normalizedCategory;
  const matchesQuery =
    !normalizedQuery ||
    [topicTitle, topicCategory, notes].some((value) =>
      value?.toLocaleLowerCase().includes(normalizedQuery)
    );

  return matchesCategory && matchesQuery;
}
