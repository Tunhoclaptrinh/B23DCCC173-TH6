import { useEffect, useState } from 'react';
import ColumnChart from '../../../components/Chart/ColumnChart';
import DonutChart from '../../../components/Chart/DonutChart';
import LineChart from '../../../components/Chart/LineChart';
import { initializeAppData } from '@/services/DestinationManagement/destination';

// Define the DataChartType interface
export interface DataChartType {
	xAxis: string[];
	yAxis: number[][];
	yLabel: string[];
	title?: string;
	height?: number;
	type?: string;
	formatY?: (val: number) => string;
	colors?: string[]; // Array of colors for each data point
	otherOptions?: any;
	showTotal?: boolean;
	width?: string | number; // Allow string | number | undefined
}

const Statistics: React.FC = () => {
	const [schedules, setSchedules] = useState<DestinationManagement.Schedule[]>([]);
	const [scheduleItems, setScheduleItems] = useState<DestinationManagement.ScheduleItems[]>([]);
	const [budgetItems, setBudgetItems] = useState<DestinationManagement.BudgetItems[]>([]);
	const [destinations, setDestinations] = useState<DestinationManagement.Destination[]>([]);

	const [schedulesByMonth, setSchedulesByMonth] = useState<DataChartType>({
		xAxis: [],
		yAxis: [[]],
		yLabel: ['Số lịch trình'],
		colors: [],
	});
	const [popularDestinations, setPopularDestinations] = useState<DataChartType>({
		xAxis: [],
		yAxis: [[]],
		yLabel: ['Lượt ghé thăm'],
		colors: [],
	});
	const [revenueData, setRevenueData] = useState<DataChartType>({
		xAxis: [],
		yAxis: [[]],
		yLabel: ['Doanh thu (VND)'],
	});
	const [budgetBreakdown, setBudgetBreakdown] = useState<DataChartType>({
		xAxis: [],
		yAxis: [[]],
		yLabel: ['Tổng chi phí'],
	});

	// Define a palette of distinct colors for months and destinations
	const colorPalette = [
		'#FF6B6B', // Red
		'#4ECDC4', // Cyan
		'#45B7D1', // Blue
		'#96CEB4', // Green
		'#FFEEAD', // Yellow
		'#D4A5A5', // Pink
		'#9B59B6', // Purple
		'#E67E22', // Orange
		'#2ECC71', // Emerald
		'#F1C40F', // Gold
		'#7F8C8D', // Gray
		'#3498DB', // Light Blue
	];

	// Load data from localStorage when the component mounts
	useEffect(() => {
		const loadData = () => {
			try {
				const schedulesData = localStorage.getItem('schedules');
				const scheduleItemsData = localStorage.getItem('scheduleItems');
				const budgetItemsData = localStorage.getItem('budgetItems');
				const destinationsData = localStorage.getItem('destinations');

				// If no data exists, initialize sample data
				if (!schedulesData && !scheduleItemsData && !budgetItemsData && !destinationsData) {
					initializeAppData();
					try {
						setSchedules(localStorage.getItem('schedules') ? JSON.parse(localStorage.getItem('schedules')!) : []);
						setScheduleItems(
							localStorage.getItem('scheduleItems') ? JSON.parse(localStorage.getItem('scheduleItems')!) : [],
						);
						setBudgetItems(localStorage.getItem('budgetItems') ? JSON.parse(localStorage.getItem('budgetItems')!) : []);
						setDestinations(
							localStorage.getItem('destinations') ? JSON.parse(localStorage.getItem('destinations')!) : [],
						);
					} catch (error) {
						console.error('Error parsing data after initialization:', error);
						setSchedules([]);
						setScheduleItems([]);
						setBudgetItems([]);
						setDestinations([]);
					}
					return;
				}

				// Parse data from localStorage
				try {
					setSchedules(schedulesData ? JSON.parse(schedulesData) : []);
				} catch {
					console.error('Error parsing schedules from localStorage');
					setSchedules([]);
				}
				try {
					setScheduleItems(scheduleItemsData ? JSON.parse(scheduleItemsData) : []);
				} catch {
					console.error('Error parsing scheduleItems from localStorage');
					setScheduleItems([]);
				}
				try {
					setBudgetItems(budgetItemsData ? JSON.parse(budgetItemsData) : []);
				} catch {
					console.error('Error parsing budgetItems from localStorage');
					setBudgetItems([]);
				}
				try {
					setDestinations(destinationsData ? JSON.parse(destinationsData) : []);
				} catch {
					console.error('Error parsing destinations from localStorage');
					setDestinations([]);
				}
			} catch (error) {
				console.error('Error loading data from localStorage:', error);
			}
		};

		loadData();
	}, []);

	// Process data for charts when data changes
	useEffect(() => {
		// Check if there is no data
		if (!schedules.length && !scheduleItems.length && !budgetItems.length && !destinations.length) {
			setSchedulesByMonth({ xAxis: [], yAxis: [[]], yLabel: ['Số lịch trình'], colors: [] });
			setPopularDestinations({ xAxis: [], yAxis: [[]], yLabel: ['Lượt ghé thăm'], colors: [] });
			setRevenueData({ xAxis: [], yAxis: [[]], yLabel: ['Doanh thu (VND)'] });
			setBudgetBreakdown({ xAxis: [], yAxis: [[]], yLabel: ['Tổng chi phí'] });
			return;
		}

		// Process schedules by month
		const monthCounts: { [key: string]: number } = {};
		schedules.forEach((schedule: DestinationManagement.Schedule) => {
			if (schedule.start_date) {
				try {
					const month = new Date(schedule.start_date).toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
					monthCounts[month] = (monthCounts[month] || 0) + 1;
				} catch {
					console.warn(`Invalid date in schedule: ${schedule.id}`);
				}
			}
		});
		const monthKeys = Object.keys(monthCounts);
		// Assign a unique color to each month
		const monthColors = monthKeys.map((_, index) => colorPalette[index % colorPalette.length]);
		setSchedulesByMonth({
			xAxis: monthKeys,
			yAxis: [Object.values(monthCounts)],
			yLabel: ['Số lịch trình'],
			colors: monthColors,
		});
		// Log to debug color assignment
		console.log('Schedules by Month:', { xAxis: monthKeys, colors: monthColors });

		// Process popular destinations
		const destinationCounts: { [key: string]: number } = {};
		scheduleItems.forEach((item: DestinationManagement.ScheduleItems) => {
			if (item.destination_id) {
				destinationCounts[item.destination_id] = (destinationCounts[item.destination_id] || 0) + 1;
			}
		});
		const topDestinations = Object.entries(destinationCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([id, count]) => {
				const destination = destinations.find((d: DestinationManagement.Destination) => d.id === id);
				return {
					name: destination ? destination.name : 'Điểm đến không xác định',
					count,
				};
			})
			.filter((d) => d.name !== 'Điểm đến không xác định');
		const destinationNames = topDestinations.map((d) => d.name);
		// Assign a unique color to each destination
		const destinationColors = destinationNames.map((_, index) => colorPalette[index % colorPalette.length]);
		setPopularDestinations({
			xAxis: destinationNames,
			yAxis: [topDestinations.map((d) => d.count)],
			yLabel: ['Lượt ghé thăm'],
			colors: destinationColors,
		});
		// Log to debug color assignment
		console.log('Popular Destinations:', { xAxis: destinationNames, colors: destinationColors });

		// Process revenue over time
		const revenueByMonth: { [key: string]: number } = {};
		budgetItems.forEach((item: DestinationManagement.BudgetItems) => {
			if (item.schedule_id && item.amount) {
				const schedule = schedules.find((s: DestinationManagement.Schedule) => s.id === item.schedule_id);
				if (schedule && schedule.start_date) {
					try {
						const month = new Date(schedule.start_date).toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
						revenueByMonth[month] = (revenueByMonth[month] || 0) + item.amount;
					} catch {
						console.warn(`Invalid date in schedule: ${schedule.id}`);
					}
				}
			}
		});
		setRevenueData({
			xAxis: Object.keys(revenueByMonth),
			yAxis: [Object.values(revenueByMonth)],
			yLabel: ['Doanh thu (VND)'],
		});

		// Process budget breakdown by category
		const categoryCounts: { [key: string]: number } = {};
		budgetItems.forEach((item: DestinationManagement.BudgetItems) => {
			if (item.category && item.amount) {
				categoryCounts[item.category] = (categoryCounts[item.category] || 0) + item.amount;
			}
		});
		setBudgetBreakdown({
			xAxis: Object.keys(categoryCounts),
			yAxis: [Object.values(categoryCounts)],
			yLabel: ['Tổng chi phí'],
		});
	}, [schedules, scheduleItems, budgetItems, destinations]);

	if (!schedules.length && !scheduleItems.length && !budgetItems.length && !destinations.length) {
		return (
			<div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
				<h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Thống kê Du lịch</h1>
				<div>Không có dữ liệu để hiển thị</div>
			</div>
		);
	}

	return (
		<div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
			<h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Thống kê Du lịch</h1>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
				<div
					style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
				>
					<ColumnChart title='Lịch trình theo Tháng' {...schedulesByMonth} height={350} />
				</div>
				<div
					style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
				>
					<ColumnChart title='Điểm đến Phổ biến' {...popularDestinations} height={350} />
				</div>
				<div
					style={{
						background: '#fff',
						padding: '16px',
						borderRadius: '8px',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
					}}
				>
					<LineChart title='Doanh thu Theo thời gian' {...revenueData} height={350} />
				</div>
				<div
					style={{
						background: '#fff',
						padding: '16px',
						borderRadius: '8px',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
					}}
				>
					<DonutChart title='Phân bổ Ngân sách theo Danh mục' {...budgetBreakdown} height={350} showTotal={true} />
				</div>
			</div>
		</div>
	);
};

export default Statistics;
