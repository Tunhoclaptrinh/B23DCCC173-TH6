import { Table, Tag, Button, Space, Modal, Typography } from 'antd';
import { CalendarOutlined, DollarOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import CreateItineraryModal from './components/ScheduleModal';
import ScheduleDetail from './components/ScheduleDetail';

const { Title } = Typography;

interface Schedule {
	id: string;
	name: string;
	start_date: string;
	end_date: string;
	total_budget: number;
	status: 'planned' | 'completed' | 'cancelled';
}

const ScheduleManagement: React.FC = () => {
	const { schedules, getScheduleData, deleteSchedule } = useModel('DestinationManagement.schedule');
	const [detailVisible, setDetailVisible] = useState(false);
	const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
	const [createModalVisible, setCreateModalVisible] = useState(false);

	useEffect(() => {
		getScheduleData();
	}, []);

	const handleDelete = (scheduleId: string) => {
		Modal.confirm({
			title: 'Are you sure you want to delete this schedule?',
			content: 'This action cannot be undone.',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteSchedule(scheduleId);
			},
		});
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a: any, b: any) => a.name.localeCompare(b.name),
		},
		{
			title: 'Date Range',
			key: 'dateRange',
			render: (record: any) => (
				<Space>
					<CalendarOutlined />
					{`${record.start_date} to ${record.end_date}`}
				</Space>
			),
			sorter: (a: any, b: any) => dayjs(a.start_date).unix() - dayjs(b.start_date).unix(),
		},
		{
			title: 'Total Budget',
			dataIndex: 'total_budget',
			key: 'total_budget',
			render: (value: number) => (
				<Space>
					<DollarOutlined />
					{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
				</Space>
			),
			sorter: (a: any, b: any) => a.total_budget - b.total_budget,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status: Schedule['status']) => {
				const colorMap = {
					planned: 'blue',
					completed: 'green',
					cancelled: 'red',
				};
				return <Tag color={colorMap[status] || 'default'}>{status?.toUpperCase()}</Tag>;
			},
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (record: any) => (
				<Space>
					<Button
						icon={<EyeOutlined />}
						onClick={() => {
							setSelectedSchedule(record);
							setDetailVisible(true);
						}}
					>
						View
					</Button>
					<Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Title level={2}>Schedule Management</Title>

			<div style={{ marginBottom: 16, textAlign: 'right' }}>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
					Create Itinerary
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={schedules}
				rowKey='id'
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} schedules`,
				}}
			/>

			{selectedSchedule && (
				<ScheduleDetail visible={detailVisible} schedule={selectedSchedule} onCancel={() => setDetailVisible(false)} />
			)}

			<CreateItineraryModal
				visible={createModalVisible}
				onCancel={() => setCreateModalVisible(false)}
				onSuccess={() => {
					setCreateModalVisible(false);
					getScheduleData(); // Refresh data after creating new itinerary
				}}
			/>
		</div>
	);
};

export default ScheduleManagement;
