'use client'
import React, { useEffect, useState } from 'react'
import ExpenseListTable from './_components/ExpenseListTable'
import { db } from '@/utils/dbConfig';
import { Expenses, Budgets } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Page() {
    const { user } = useUser();
    const [expensesList, setExpensesList] = useState([]);
    const route=useRouter();

    useEffect(() => {
        if (user) {
            getAllExpenses();
        }
    }, [user]);

    const getBudgetList = async () => {
        const result = await db.select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        }).from(Budgets).leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

        setBudgetList(result);
        getAllExpenses();
    };

    const getAllExpenses=async()=>{
        const result=await db.select({
            id:Expenses.id,
            name:Expenses.name,
            amount:Expenses.amount,
            createdAt:Expenses.createdAt
        }).from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id,Expenses.budgetId))
        .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Expenses.id));

        setExpensesList(result);
    }

    return (
        <div className='p-10'>
            <h2 className='font-bold text-3xl'>
                <span className='flex gap-2 items-center'>
                <ArrowLeft onClick={()=>route.back()} className='cursor-pointer'/>
                    My Expenses
                </span>
            </h2>
            <div>
                <ExpenseListTable expensesList={expensesList} refreshData={()=>getBudgetList()}/>
            </div>
        </div>
    )
}

export default Page
