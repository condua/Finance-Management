import categoriesDefault from '@/src/constants/Categories'


export const isDefaultCategory = (categoryName: string): boolean => {
  return categoriesDefault.includes(categoryName)
}