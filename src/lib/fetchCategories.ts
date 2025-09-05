import { api } from '@/server/api';

export default async function getCategories() {
  return await api.categories.getAll();
}
