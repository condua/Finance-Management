import { Budget, FinancialPlan } from "@/src/types/enum";

export const getBudgetsBycategory = (budgets: FinancialPlan[], categoryId: string) => {
  return budgets.filter((budget) => {
   if (new Date(budget.end_date) < new Date()) return false
   const ids = (budget.attributes as Budget).categories.map((category) => category._id)

   return ids.includes(categoryId)
  })
}