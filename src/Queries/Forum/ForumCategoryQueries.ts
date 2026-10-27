import {ForumSort, ForumSortDirection} from '#src/Enums/ForumSortFilter';
import {useTokenAuthPaginationQuery, useTokenAuthQuery} from '#src/Queries/TokenAuthQuery';
import {CategoryData} from '#src/Structs/ControllerStructs';

export const useForumCategoriesQuery = () => {
  return useTokenAuthQuery<CategoryData[]>('/forum/categories');
};

export interface ForumCategoryQueryParams {
  sort?: ForumSort;
  start?: number;
  limit?: number;
  afterdate?: string; // mutually exclusive
  beforedate?: string; // mutually exclusive
  order?: ForumSortDirection;
}

/** Fetches category threads with optional query enablement for loading category sort metadata first. */
export const useForumCategoryQuery = (
  categoryId: string,
  queryParams: ForumCategoryQueryParams = {},
  options?: {enabled?: boolean},
) => {
  return useTokenAuthPaginationQuery<CategoryData, ForumCategoryQueryParams>(
    `/forum/categories/${categoryId}`,
    options,
    queryParams,
  );
};
