import { useState } from 'react';
import { message } from 'antd';
import { ECategoryBudget } from '@/services/base/constant';
import { getMockBudgetItems, formatCurrency, generateUUID } from '@/services/DestinationManagement/destination';

export default () => {
	const [budgetItems, setBudgetItems] = useState<DestinationManagement.BudgetItems[]>([]);
	const [budgetLimits, setBudgetLimits] = useState<Record<ECategoryBudget, number>>({
		[ECategoryBudget.ACCOMMODATION]: 3000000,
		[ECategoryBudget.FOOD]: 2000000,
		[ECategoryBudget.TRANSPORT]: 1500000,
		[ECategoryBudget.ACTIVITIES]: 1000000,
		[ECategoryBudget.MISCELLANEOUS]: 500000,
		[ECategoryBudget.ENTERTAINMENT]: 800000,
		[ECategoryBudget.SHOPPING]: 600000,
		[ECategoryBudget.OTHER]: 400000,
	});

	// Load budget data
	const getBudgetData = (scheduleId: string) => {
		const localBudget = localStorage.getItem('budgetItems');
		const items = localBudget ? JSON.parse(localBudget) : getMockBudgetItems();
		const scheduleItems = items.filter((item: DestinationManagement.BudgetItems) => item.schedule_id === scheduleId);
		setBudgetItems(scheduleItems);
		return scheduleItems;
	};

	// Calculate budget statistics
	const calculateBudgetStats = (scheduleId: string) => {
		const items = budgetItems.filter((item) => item.schedule_id === scheduleId);
		const stats = Object.values(ECategoryBudget).reduce((acc, category) => {
			const categoryItems = items.filter((item) => item.category === category);
			const spent = categoryItems.reduce((sum, item) => sum + item.amount, 0);
			const limit = budgetLimits[category];
			const remaining = limit - spent;
			const percentage = (spent / limit) * 100;

			acc[category] = {
				spent,
				limit,
				remaining,
				percentage,
				isOverBudget: spent > limit,
			};
			return acc;
		}, {} as Record<ECategoryBudget, BudgetCategoryStats>);

		return stats;
	};

	// Get chart data for budget distribution
	const getBudgetChartData = (scheduleId: string) => {
		const stats = calculateBudgetStats(scheduleId);

		return {
			categories: Object.values(ECategoryBudget),
			spent: Object.values(stats).map((stat) => stat.spent),
			limits: Object.values(stats).map((stat) => stat.limit),
			percentages: Object.values(stats).map((stat) => stat.percentage),
		};
	};

	// Add budget item
	const addBudgetItem = (newItem: Omit<DestinationManagement.BudgetItems, 'id'>) => {
		const stats = calculateBudgetStats(newItem.schedule_id);
		const categoryStats = stats[newItem.category as ECategoryBudget];

		if (categoryStats.spent + newItem.amount > categoryStats.limit) {
			message.warning(
				`Adding this expense will exceed the ${newItem.category} budget limit of ${formatCurrency(
					categoryStats.limit,
				)}`,
			);
		}

		const item = {
			...newItem,
			id: generateUUID(),
		};

		const updatedItems = [...budgetItems, item];
		localStorage.setItem('budgetItems', JSON.stringify(updatedItems));
		setBudgetItems(updatedItems);

		return item;
	};

	// Update budget limits
	const updateBudgetLimit = (category: ECategoryBudget, amount: number) => {
		const newLimits = {
			...budgetLimits,
			[category]: amount,
		};
		setBudgetLimits(newLimits);
		localStorage.setItem('budgetLimits', JSON.stringify(newLimits));
	};

	return {
		budgetItems,
		budgetLimits,
		getBudgetData,
		calculateBudgetStats,
		getBudgetChartData,
		addBudgetItem,
		updateBudgetLimit,
	};
};

// Types
interface BudgetCategoryStats {
	spent: number;
	limit: number;
	remaining: number;
	percentage: number;
	isOverBudget: boolean;
}
