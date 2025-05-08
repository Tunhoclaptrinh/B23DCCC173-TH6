// import AppointmentScheduler from '@/components/ServiceManagementComponent/AppointmentScheduler';

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	// Ngọc code v1
	{
		path: '/home',
		name: 'Home',
		component: './DuLich/Home',
	},
	// cả team code
	{
		path: '/destination-management',
		name: 'Destination',

		icon: 'InsertRowRightOutlined',
		routes: [
			{
				path: '/destination-management/destination',
				name: 'Home',
				component: './DestinationManagement/homepage',
			},
			{
				path: '/destination-management/schedule-manage',
				name: 'Schedule manage',
				component: './DestinationManagement/schedulemanage',
			},
			{
				path: '/destination-management/budget',
				name: 'Budget manage',
				component: './DestinationManagement/budgetmanage',
			},

			{
				path: '/destination-management/admin',
				name: 'CRUD - Destination',
				component: './DestinationManagement/admin',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
