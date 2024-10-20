import { Transaction } from '@/src/types/enum'


const LIMIT = 5
export const handleStatistic = (
  transactions: Transaction[]
): {
  total: number
  data: {
    name: string
    id: string
    amount: number
    percentage: number
  }[]
} => {
  if (!transactions)
    return {
      total: 0,
      data: [],
    }
  // filter categories
  const categories = transactions.map((transaction) => JSON.stringify(transaction.category))
  const setOfCategories = [...new Set(categories)]
  const filterCategories = setOfCategories.map((category) => ({
    name: JSON.parse(category).name,
    id: JSON.parse(category)._id,
    amount: 0,
  }))

  // calculate amount of each category and total amount
  let total = 0
  transactions.forEach((transaction) => {
    const index = filterCategories.findIndex(
      (category) => category.name === transaction.category.name
    )
    filterCategories[index].amount += transaction.amount
    total += transaction.amount
  })

  // calculate percentage
  const result = filterCategories.map((category) => ({
    name: category.name,
    amount: category.amount,
    id: category.id,
    percentage: Number(((category.amount / total) * 100).toFixed(1)),
  }))

  // limit to 4 categories
  if (result.length >= LIMIT) {
    // sort by percentage -> descending
    const mainCates = result.sort((a, b) => b.percentage - a.percentage).slice(0, LIMIT-1)
    const othersCategory = result.sort((a, b) => b.percentage - a.percentage).slice(LIMIT - 1)
    mainCates.push({
      name: 'Others',
      amount: othersCategory.reduce((pre, cur) => pre + cur.amount, 0),
      percentage: Number(
        (100 - mainCates.reduce((pre, cur) => pre + cur.percentage, 0)).toFixed(1)
      ),
      id: 'all' // ids for others category
    })
    return {
      total,
      data: mainCates,
    }
  }

  // sort by percentage -> descending
  return {
    total,
    data: result.sort((a, b) => b.percentage - a.percentage),
  }
}
