import { Modal, Form, Input, InputNumber, Select, Rate } from 'antd';
import { useState, useEffect } from 'react';
import { EDestinationType } from '@/services/base/constant';

interface DestinationFormProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	isEdit: boolean;
	destination?: DestinationManagement.Destination;
	onSubmit: (values: DestinationManagement.Destination, originalId?: string) => void;
}

const DestinationForm: React.FC<DestinationFormProps> = ({ visible, setVisible, isEdit, destination, onSubmit }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible && isEdit && destination) {
			form.setFieldsValue(destination);
		} else {
			form.resetFields();
		}
	}, [visible, isEdit, destination, form]);

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			onSubmit(values, destination?.id);
		});
	};

	return (
		<Modal
			title={isEdit ? 'Edit Destination' : 'Add New Destination'}
			visible={visible}
			onOk={handleSubmit}
			onCancel={() => setVisible(false)}
			width={800}
		>
			<Form form={form} layout='vertical' initialValues={destination}>
				<Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please input destination name!' }]}>
					<Input />
				</Form.Item>

				<Form.Item name='location' label='Location' rules={[{ required: true, message: 'Please input location!' }]}>
					<Input />
				</Form.Item>

				<Form.Item name='type' label='Type' rules={[{ required: true, message: 'Please select destination type!' }]}>
					<Select>
						{Object.values(EDestinationType).map((type) => (
							<Select.Option key={type} value={type}>
								{type}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					name='description'
					label='Description'
					rules={[{ required: true, message: 'Please input description!' }]}
				>
					<Input.TextArea rows={4} />
				</Form.Item>

				<Form.Item name='image_url' label='Image URL' rules={[{ required: true, message: 'Please input image URL!' }]}>
					<Input />
				</Form.Item>

				<Form.Item name='avg_rating' label='Rating' rules={[{ required: true, message: 'Please input rating!' }]}>
					<Rate allowHalf />
				</Form.Item>

				<Form.Item
					name='avg_accommodation_cost'
					label='Accommodation Cost (VND)'
					rules={[{ required: true, message: 'Please input accommodation cost!' }]}
				>
					<InputNumber min={0} step={100000} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					name='avg_food_cost'
					label='Food Cost (VND)'
					rules={[{ required: true, message: 'Please input food cost!' }]}
				>
					<InputNumber min={0} step={50000} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					name='avg_transport_cost'
					label='Transport Cost (VND)'
					rules={[{ required: true, message: 'Please input transport cost!' }]}
				>
					<InputNumber min={0} step={50000} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					name='estimated_visit_duration'
					label='Estimated Visit Duration (hours)'
					rules={[{ required: true, message: 'Please input estimated duration!' }]}
				>
					<InputNumber min={1} max={72} style={{ width: '100%' }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default DestinationForm;
