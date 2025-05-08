import React, { useEffect } from 'react';
import { Row, Col, Card, Alert, Statistic, Progress, Space } from 'antd';
import { useModel } from 'umi';
import { DollarOutlined, WarningOutlined } from '@ant-design/icons';
import DonutChart from '@/components/Chart/DonutChart';
import ColumnChart from '@/components/Chart/ColumnChart';
import { formatCurrency } from '@/services/DestinationManagement/destination';
import { ECategoryBudget } from '@/services/base/constant';

interface BudgetDashboardProps {
	scheduleId: string;
}

const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ scheduleId }) => {
	const { getBudgetData, calculateBudgetStats, getBudgetChartData } = useModel('DestinationManagement.budget');
	const budgetStats = calculateBudgetStats(scheduleId);
	const chartData = getBudgetChartData(scheduleId);

	useEffect(() => {
		getBudgetData(scheduleId);
	}, [scheduleId]);

	// Calculate total budget statistics
	const totalSpent = Object.values(budgetStats).reduce((sum, stat) => sum + stat.spent, 0);
	const totalBudget = Object.values(budgetStats).reduce((sum, stat) => sum + stat.limit, 0);
	const totalRemaining = totalBudget - totalSpent;
	const overBudgetCategories = Object.entries(budgetStats).filter(([_, stats]) => stats.isOverBudget);

	return (
		<div style={{ padding: '24px' }}>
			{/* Alerts for over-budget categories */}
			{overBudgetCategories.length > 0 && (
				<Alert
					message='Budget Warning'
					description={
						<div>
							The following categories have exceeded their budget limits:
							<ul>
								{overBudgetCategories.map(([category, stats]) => (
									<li key={category}>
										{category}: Spent {formatCurrency(stats.spent)} of {formatCurrency(stats.limit)}(
										{stats.percentage.toFixed(1)}%)
									</li>
								))}
							</ul>
						</div>
					}
					type='warning'
					showIcon
					style={{ marginBottom: 24 }}
				/>
			)}

			{/* Summary Statistics */}
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col span={8}>
					<Card>
						<Statistic
							title='Total Budget'
							value={totalBudget}
							prefix={<DollarOutlined />}
							formatter={(value) => formatCurrency(value as number)}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title='Total Spent'
							value={totalSpent}
							prefix={<DollarOutlined />}
							formatter={(value) => formatCurrency(value as number)}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title='Remaining Budget'
							value={totalRemaining}
							prefix={<DollarOutlined />}
							formatter={(value) => formatCurrency(value as number)}
							valueStyle={{ color: totalRemaining < 0 ? '#cf1322' : '#3f8600' }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Charts */}
			<Row gutter={[16, 16]}>
				<Col span={12}>
					<Card title='Budget Distribution'>
						<DonutChart
							xAxis={chartData.categories}
							yAxis={[chartData.spent]}
							yLabel={['Amount Spent']}
							formatY={(value) => formatCurrency(value)}
							showTotal={true}
							height={300}
						/>
					</Card>
				</Col>
				<Col span={12}>
					<Card title='Budget vs Spent'>
						<ColumnChart
							xAxis={chartData.categories}
							yAxis={[chartData.spent, chartData.limits]}
							yLabel={['Spent', 'Budget Limit']}
							formatY={(value) => formatCurrency(value)}
							height={300}
						/>
					</Card>
				</Col>
			</Row>

			{/* Detailed Category Progress */}
			<Card title='Category Details' style={{ marginTop: 24 }}>
				<Row gutter={[16, 16]}>
					{Object.entries(budgetStats).map(([category, stats]) => (
						<Col span={12} key={category}>
							<Card size='small'>
								<Space direction='vertical' style={{ width: '100%' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span>{category}</span>
										<span>
											{formatCurrency(stats.spent)} / {formatCurrency(stats.limit)}
										</span>
									</div>
									<Progress
										percent={stats.percentage}
										status={stats.isOverBudget ? 'exception' : 'normal'}
										showInfo={true}
									/>
								</Space>
							</Card>
						</Col>
					))}
				</Row>
			</Card>
		</div>
	);
};

export default BudgetDashboard;
