import { Tabs } from 'antd';
import DestinationManagement from './components/DestinationManagement';
import Statistics from './components/Statistics';

const { TabPane } = Tabs;

const MainPage: React.FC = () => {
	return (
		<div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
			<h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Bảng Điều Khiển Quản Lý Du Lịch</h1>
			<Tabs defaultActiveKey='1' type='card' size='large'>
				<TabPane tab='Quản lý Điểm đến' key='1'>
					<DestinationManagement />
				</TabPane>
				<TabPane tab='Thống kê' key='2'>
					<Statistics />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default MainPage;
