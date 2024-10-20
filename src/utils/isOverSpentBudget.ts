import { Budget, FinancialPlan } from '@/src/types/enum'

export const isOverSpentBudget = (budgets: FinancialPlan[], amount: number) => {
 let isOverSpent = false
 const data: string[] = []
 for (const budget of budgets) {
   const leftAmount =
     Number(budget.attributes.target_amount) - Number((budget.attributes as Budget).spent_amount)
   if (amount > leftAmount) {
    isOverSpent = true
    data.push(budget.name)
   }
 }
 return [isOverSpent, data]
}
