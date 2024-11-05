import React, { useState } from 'react';

function CreateRequest() {
  const [formData, setFormData] = useState({
    type: 'Đi muộn',
    startDate: '',
    endDate: '',
    reason: '',
    approver: 'Nguyễn Văn A'  // Tên người phụ trách được hiển thị sẵn
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-center text-xl font-semibold mb-4">Tạo đơn</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700">Loại</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option>Đi muộn</option>
          <option>Về sớm</option>
          <option>Nghỉ</option>
          <option>Xin ra ngoài</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Thời gian</label>
        <input
          type="datetime-local"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Ngày xin phép</label>
        <input
          type="datetime-local"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Lý do</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          placeholder="Nhập lý do của bạn"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Người duyệt</label>
        <input
          type="text"
          name="approver"
          value={formData.approver}
          readOnly
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm"
        />
      </div>

      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Submit
      </button>
    </div>
  );
}

export default CreateRequest;
