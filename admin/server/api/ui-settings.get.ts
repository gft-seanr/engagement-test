import { defineEventHandler } from 'h3';
import { fetchData } from '~admin/utils/shared/api';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (!query.id) {
    throw createError({
      statusCode: 400,
      message: 'id query parameter is required',
    });
  }

  return await fetchData(event);
});
