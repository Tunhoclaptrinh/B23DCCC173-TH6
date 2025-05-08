import { useState } from 'react';
import { message } from 'antd';
import {
	getMockSchedules,
	getMockScheduleDays,
	getMockScheduleItems,
	getMockBudgetItems,
	generateUUID,
	getDaysBetweenDates,
} from '@/services/DestinationManagement/destination';

export default () => {
	const [schedules, setSchedules] = useState<DestinationManagement.Schedule[]>([]);
	const [scheduleDays, setScheduleDays] = useState<DestinationManagement.ScheduleDays[]>([]);
	const [scheduleItems, setScheduleItems] = useState<DestinationManagement.ScheduleItems[]>([]);
	const [budgetItems, setBudgetItems] = useState<DestinationManagement.BudgetItems[]>([]);

	// Load all schedule-related data
	const getScheduleData = () => {
		// Load schedules
		const localSchedules = localStorage.getItem('schedules');
		if (localSchedules) {
			setSchedules(JSON.parse(localSchedules));
		} else {
			const initialSchedules = getMockSchedules();
			localStorage.setItem('schedules', JSON.stringify(initialSchedules));
			setSchedules(initialSchedules);
		}

		// Load schedule days
		const localDays = localStorage.getItem('scheduleDays');
		if (localDays) {
			setScheduleDays(JSON.parse(localDays));
		} else {
			const initialDays = getMockScheduleDays();
			localStorage.setItem('scheduleDays', JSON.stringify(initialDays));
			setScheduleDays(initialDays);
		}

		// Load schedule items
		const localItems = localStorage.getItem('scheduleItems');
		if (localItems) {
			setScheduleItems(JSON.parse(localItems));
		} else {
			const initialItems = getMockScheduleItems();
			localStorage.setItem('scheduleItems', JSON.stringify(initialItems));
			setScheduleItems(initialItems);
		}

		// Load budget items
		const localBudget = localStorage.getItem('budgetItems');
		if (localBudget) {
			setBudgetItems(JSON.parse(localBudget));
		} else {
			const initialBudget = getMockBudgetItems();
			localStorage.setItem('budgetItems', JSON.stringify(initialBudget));
			setBudgetItems(initialBudget);
		}
	};

	// Add new schedule with days
	const addSchedule = (newSchedule: Omit<DestinationManagement.Schedule, 'id'>) => {
		const scheduleId = generateUUID();
		const schedule = { ...newSchedule, id: scheduleId };

		// Create schedule days
		const days = getDaysBetweenDates(newSchedule.start_date, newSchedule.end_date);
		const newDays = Array.from({ length: days }, (_, index) => {
			const currentDate = new Date(newSchedule.start_date);
			currentDate.setDate(currentDate.getDate() + index);

			return {
				id: generateUUID(),
				schedule_id: scheduleId,
				day_number: index + 1,
				date: currentDate.toISOString().split('T')[0],
			};
		});

		// Update state and localStorage
		const updatedSchedules = [...schedules, schedule];
		const updatedDays = [...scheduleDays, ...newDays];

		localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
		localStorage.setItem('scheduleDays', JSON.stringify(updatedDays));

		setSchedules(updatedSchedules);
		setScheduleDays(updatedDays);

		message.success('Schedule created successfully!');
		return scheduleId;
	};

	// Update existing schedule
	const updateSchedule = (updatedSchedule: DestinationManagement.Schedule) => {
		const updatedSchedules = schedules.map((schedule) =>
			schedule.id === updatedSchedule.id ? updatedSchedule : schedule,
		);

		localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
		setSchedules(updatedSchedules);
		message.success('Schedule updated successfully!');
	};

	// Delete schedule and related data
	const deleteSchedule = (scheduleId: string) => {
		// Remove schedule
		const updatedSchedules = schedules.filter((schedule) => schedule.id !== scheduleId);

		// Remove related days
		const updatedDays = scheduleDays.filter((day) => day.schedule_id !== scheduleId);

		// Remove related items
		const dayIds = scheduleDays.filter((day) => day.schedule_id === scheduleId).map((day) => day.id);
		const updatedItems = scheduleItems.filter((item) => !dayIds.includes(item.schedule_day_id));

		// Remove related budget items
		const updatedBudget = budgetItems.filter((item) => item.schedule_id !== scheduleId);

		// Update localStorage and state
		localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
		localStorage.setItem('scheduleDays', JSON.stringify(updatedDays));
		localStorage.setItem('scheduleItems', JSON.stringify(updatedItems));
		localStorage.setItem('budgetItems', JSON.stringify(updatedBudget));

		setSchedules(updatedSchedules);
		setScheduleDays(updatedDays);
		setScheduleItems(updatedItems);
		setBudgetItems(updatedBudget);

		message.success('Schedule deleted successfully!');
	};

	// Add item to schedule day
	const addScheduleItem = (newItem: Omit<DestinationManagement.ScheduleItems, 'id'>) => {
		const item = { ...newItem, id: generateUUID() };
		const updatedItems = [...scheduleItems, item];

		localStorage.setItem('scheduleItems', JSON.stringify(updatedItems));
		setScheduleItems(updatedItems);
		message.success('Activity added to schedule!');
	};

	// Update schedule item
	const updateScheduleItem = (updatedItem: DestinationManagement.ScheduleItems) => {
		const updatedItems = scheduleItems.map((item) => (item.id === updatedItem.id ? updatedItem : item));

		localStorage.setItem('scheduleItems', JSON.stringify(updatedItems));
		setScheduleItems(updatedItems);
		message.success('Activity updated successfully!');
	};

	// Delete schedule item
	const deleteScheduleItem = (itemId: string) => {
		const updatedItems = scheduleItems.filter((item) => item.id !== itemId);

		localStorage.setItem('scheduleItems', JSON.stringify(updatedItems));
		setScheduleItems(updatedItems);
		message.success('Activity removed from schedule!');
	};

	// Add budget item
	const addBudgetItem = (newItem: Omit<DestinationManagement.BudgetItems, 'id'>) => {
		const item = { ...newItem, id: generateUUID() };
		const updatedBudget = [...budgetItems, item];

		localStorage.setItem('budgetItems', JSON.stringify(updatedBudget));
		setBudgetItems(updatedBudget);
		message.success('Budget item added successfully!');
	};

	return {
		schedules,
		scheduleDays,
		scheduleItems,
		budgetItems,
		getScheduleData,
		addSchedule,
		updateSchedule,
		deleteSchedule,
		addScheduleItem,
		updateScheduleItem,
		deleteScheduleItem,
		addBudgetItem,
	};
};
