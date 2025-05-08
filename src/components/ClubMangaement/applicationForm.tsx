import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

interface ApplicationFormProps {
	onFinish: (values: any) => void;
	onCancel: () => void;
	title: string;
	record?: ClubMangement.Application | null;
	isEdit?: boolean;
	isView?: boolean;
	clubs: ClubMangement.Club[];
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
	onFinish,
	onCancel,
	title,
	record,
	isEdit,
	isView,
	clubs,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (record) {
			form.setFieldsValue({ ...record });
		} else {
			form.resetFields();
		}
	}, [record, form]);

	const handleFinish = (values: any) => {
		if (onFinish) {
			onFinish(values);
		}
	};

	return (
		<div className='application-form'>
			<div className='form-header' style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
				<h2>
					{isEdit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Tạo mới'} {title}
				</h2>
			</div>

			<Form
				form={form}
				layout='vertical'
				onFinish={handleFinish}
				disabled={isView}
				initialValues={record || {}}
				style={{ padding: '24px' }}
			>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='full_name'
							label='Họ và tên'
							rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
						>
							<Input placeholder='Nhập họ và tên' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='email'
							label='Email'
							rules={[
								{ required: true, message: 'Vui lòng nhập email' },
								{ type: 'email', message: 'Vui lòng nhập email hợp lệ' },
							]}
						>
							<Input placeholder='Nhập email' />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='phone_number'
							label='Số điện thoại'
							rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
						>
							<Input placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='gender' label='Giới tính' rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
							<Select placeholder='Chọn giới tính'>
								<Select.Option value='Nam'>Nam</Select.Option>
								<Select.Option value='Nữ'>Nữ</Select.Option>
								<Select.Option value='Khác'>Khác</Select.Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='address' label='Địa chỉ' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
					<Input placeholder='Nhập địa chỉ' />
				</Form.Item>

				<Form.Item
					name='desired_club_id'
					label='Câu lạc bộ mong muốn'
					rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
				>
					<Select placeholder='Chọn câu lạc bộ'>
						{clubs.map((club) => (
							<Select.Option key={club._id} value={club._id}>
								{club.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='strengths' label='Điểm mạnh' rules={[{ required: true, message: 'Vui lòng nhập điểm mạnh' }]}>
					<TextArea rows={3} placeholder='Nhập điểm mạnh của bạn' />
				</Form.Item>

				<Form.Item
					name='reason'
					label='Lý do đăng ký'
					rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
				>
					<TextArea rows={4} placeholder='Tại sao bạn muốn tham gia câu lạc bộ này?' />
				</Form.Item>

				{(isEdit || isView) && (
					<Form.Item name='status' label='Trạng thái'>
						<Select disabled={isView}>
							<Select.Option value='pending'>Đang chờ</Select.Option>
							<Select.Option value='approved'>Đã duyệt</Select.Option>
							<Select.Option value='rejected'>Đã từ chối</Select.Option>
						</Select>
					</Form.Item>
				)}

				{(isEdit || isView) && (
					<Form.Item name='notes' label='Ghi chú'>
						<TextArea rows={3} placeholder='Ghi chú bổ sung' disabled={isView} />
					</Form.Item>
				)}

				{!isView && (
					<Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
						<Button onClick={onCancel} style={{ marginRight: 8 }}>
							Hủy
						</Button>
						<Button type='primary' htmlType='submit'>
							{isEdit ? 'Cập nhật' : 'Gửi'}
						</Button>
					</Form.Item>
				)}
			</Form>
		</div>
	);
};

export default ApplicationForm;
