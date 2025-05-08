import React, { useEffect, useState } from 'react';
import {
	Card,
	Row,
	Col,
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	InputNumber,
	Alert,
	Progress,
	Typography,
	Space,
} from 'antd';
import { PlusOutlined, DollarOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ECategoryBudget } from '@/services/base/constant';
import { formatCurrency } from '@/services/DestinationManagement/destination';
import LineChart from '../../components/Chart/LineChart';
import ColumnChart from '../../components/Chart/ColumnChart';
import DonutChart from '../../components/Chart/DonutChart';

const { Title } = Typography;
const { Option } = Select;

const BudgetManagement: React.FC = () => {
	const { schedules } = useModel('DestinationManagement.schedule');
	const {
		budgetItems,
		budgetLimits,
		getBudgetData,
		calculateBudgetStats,
		getBudgetChartData,
		addBudgetItem,
		updateBudgetLimit,
	} = useModel('DestinationManagement.budget');

	const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLimitModalVisible, setIsLimitModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [limitForm] = Form.useForm();

	useEffect(() => {
		if (selectedSchedule) {
			getBudgetData(selectedSchedule);
		}
	}, [selectedSchedule]);

	const budgetStats = selectedSchedule ? calculateBudgetStats(selectedSchedule) : null;
	const chartData = selectedSchedule ? getBudgetChartData(selectedSchedule) : null;

	const columns = [
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			render: (value: number) => formatCurrency(value),
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Date',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (date: string) => new Date(date).toLocaleDateString(),
		},
	];

	const handleAddExpense = (values: any) => {
		const newItem = {
			schedule_id: selectedSchedule!,
			category: values.category,
			amount: values.amount,
			description: values.description,
			created_at: new Date().toISOString(),
		};
		addBudgetItem(newItem);
		setIsModalVisible(false);
		form.resetFields();
	};

	const handleUpdateLimit = (values: any) => {
		updateBudgetLimit(values.category, values.amount);
		setIsLimitModalVisible(false);
		limitForm.resetFields();
	};

	const columnConfig = {
		data:
			chartData?.categories.map((category, index) => ({
				category,
				spent: chartData.spent[index],
				limit: chartData.limits[index],
			})) || [],
		xField: 'category',
		yField: ['spent', 'limit'],
		isGroup: true,
		columnStyle: {
			radius: [20, 20, 0, 0],
		},
	};

	// Sửa phần cấu hình biểu đồ
	const columnChartData = chartData
		? {
				xAxis: chartData.categories,
				yAxis: [chartData.spent, chartData.limits],
				yLabel: ['Spent', 'Budget Limit'],
		  }
		: {
				xAxis: [],
				yAxis: [],
				yLabel: [],
		  };

	const donutChartData = chartData
		? {
				xAxis: chartData.categories,
				yAxis: [chartData.spent],
				yLabel: ['Amount Spent'],
		  }
		: {
				xAxis: [],
				yAxis: [],
				yLabel: [],
		  };

	const pieConfig = {
		data:
			chartData?.categories.map((category, index) => ({
				type: category,
				value: chartData.spent[index],
			})) || [],
		angleField: 'value',
		colorField: 'type',
	};

	return (
		<div style={{ padding: '24px' }}>
			<Row justify='space-between' align='middle' style={{ marginBottom: 24 }}>
				<Col>
					<Title level={2}>Budget Management</Title>
				</Col>
				<Col>
					<Space>
						<Select
							style={{ width: 300 }}
							placeholder='Select Schedule'
							onChange={setSelectedSchedule}
							value={selectedSchedule}
						>
							{schedules.map((schedule) => (
								<Option key={schedule.id} value={schedule.id}>
									{schedule.name}
								</Option>
							))}
						</Select>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={() => setIsModalVisible(true)}
							disabled={!selectedSchedule}
						>
							Add Expense
						</Button>
						<Button icon={<DollarOutlined />} onClick={() => setIsLimitModalVisible(true)}>
							Update Limits
						</Button>
					</Space>
				</Col>
			</Row>

			{selectedSchedule && budgetStats && (
				<>
					<Row gutter={[16, 16]}>
						{Object.entries(budgetStats).map(([category, stats]) => (
							<Col span={8} key={category}>
								<Card>
									<Title level={4}>{category}</Title>
									<Progress
										type='circle'
										percent={Math.min(100, stats.percentage)}
										status={stats.isOverBudget ? 'exception' : 'normal'}
										format={() => (
											<div style={{ textAlign: 'center' }}>
												<div>{formatCurrency(stats.spent)}</div>
												<small>of {formatCurrency(stats.limit)}</small>
											</div>
										)}
									/>
									{stats.isOverBudget && (
										<Alert message='Over Budget!' type='error' showIcon style={{ marginTop: 16 }} />
									)}
								</Card>
							</Col>
						))}
					</Row>

					<Row gutter={[16, 16]} style={{ marginTop: 24 }}>
						<Col span={12}>
							<Card title='Budget Distribution'>
								<ColumnChart {...columnChartData} height={300} />
							</Card>
						</Col>
						<Col span={12}>
							<Card title='Expense Distribution'>
								<DonutChart {...donutChartData} height={300} />
							</Card>
						</Col>
					</Row>

					<Card title='Expenses' style={{ marginTop: 24 }}>
						<Table columns={columns} dataSource={budgetItems} rowKey='id' pagination={{ pageSize: 10 }} />
					</Card>
				</>
			)}

			<Modal title='Add New Expense' visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<Form form={form} onFinish={handleAddExpense} layout='vertical'>
					<Form.Item name='category' label='Category' rules={[{ required: true }]}>
						<Select>
							{Object.values(ECategoryBudget).map((category) => (
								<Option key={category} value={category}>
									{category}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='amount' label='Amount' rules={[{ required: true }]}>
						<InputNumber
							style={{ width: '100%' }}
							formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value!.replace(/₫\s?|(,*)/g, '')}
						/>
					</Form.Item>
					<Form.Item name='description' label='Description' rules={[{ required: true }]}>
						<Input.TextArea />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit'>
							Add Expense
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Update Budget Limits'
				visible={isLimitModalVisible}
				onCancel={() => setIsLimitModalVisible(false)}
				footer={null}
			>
				<Form form={limitForm} onFinish={handleUpdateLimit} layout='vertical'>
					<Form.Item name='category' label='Category' rules={[{ required: true }]}>
						<Select>
							{Object.values(ECategoryBudget).map((category) => (
								<Option key={category} value={category}>
									{category}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='amount' label='New Limit' rules={[{ required: true }]}>
						<InputNumber
							style={{ width: '100%' }}
							formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => value!.replace(/₫\s?|(,*)/g, '')}
						/>
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit'>
							Update Limit
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default BudgetManagement;
