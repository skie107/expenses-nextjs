import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import ExpensesForm from "@/components/ExpensesForm";
import ExpensesList from "@/components/ExpensesList";
import { checkAuthenticationAndMembership } from "@/lib/server-utils";

type DashboardProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: DashboardProps) {
  const paymentValueFromURL = (await searchParams).payment;

  const user = await checkAuthenticationAndMembership(
    paymentValueFromURL === "success" ? 5000 : 0
  );

  if (paymentValueFromURL === "success") {
    return redirect("/dashboard");
  }

  const expenses = await prisma.expense.findMany({
    where: {
      creatorId: user.id,
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-white text-center">Dashboard</h1>

      <div className="w-full max-w-[600px] mx-auto">
        <ExpensesList expenses={expenses} />

        <ExpensesForm />
      </div>
    </div>
  );
}
