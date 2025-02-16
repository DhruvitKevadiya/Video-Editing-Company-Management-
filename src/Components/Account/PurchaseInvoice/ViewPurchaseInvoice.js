import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import PurchaseInvoiceDetail from './PurchaseInvoiceDetail';
import {
  getPurchaseInvoiceDetail,
  setIsGetInitialValuesPurchaseInvoice,
  setViewPurchaseInvoiceData,
} from 'Store/Reducers/Accounting/PurchaseInvoice/PurchaseInvoiceSlice';
import { getClientCompanyList } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { useParams } from 'react-router-dom';
import { generateUniqueId } from 'Helper/CommonHelper';

export default function ViewPurchaseInvoice() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesPurchaseInvoice, viewPurchaseInvoiceData } =
    useSelector(({ purchaseInvoice }) => purchaseInvoice);

  const handlePurchaseInvoiceDetails = async () => {
    const response = await dispatch(
      getPurchaseInvoiceDetail({
        purchase_invoice_id: id,
        pdf: false,
      }),
    );

    if (response?.payload) {
      const purchaseInvoiceDetails = response?.payload;

      const updatedPurchaseItems = purchaseInvoiceDetails?.purchaseItems?.map(
        item => {
          return {
            ...item,
            unique_id: generateUniqueId(),
          };
        },
      );

      return {
        ...response?.payload,
        create_date: purchaseInvoiceDetails?.create_date
          ? new Date(purchaseInvoiceDetails?.create_date?.split('T')[0])
          : '',
        purchase_items: updatedPurchaseItems,
      };
    }
  };

  const handleUpdatePurchaseInvoice = async () => {
    let compnayOpitions = [];
    dispatch(
      setIsGetInitialValuesPurchaseInvoice({
        ...isGetInitialValuesPurchaseInvoice,
        view: true,
      }),
    );

    const companyDataList = await dispatch(
      getClientCompanyList({
        start: 0,
        limit: 0,
        search: '',
        isActive: true,
        type: 2,
      }),
    );

    const company = companyDataList.payload?.data?.list;

    if (company?.length) {
      compnayOpitions = company?.map(item => ({
        label: item?.company_name,
        value: item?._id,
      }));
    }

    const updatedPurchaseInvoiceDetails = await handlePurchaseInvoiceDetails();

    const purchaseInvoiceData = {
      ...updatedPurchaseInvoiceDetails,
      client_company_list: compnayOpitions,
    };

    setInitialData(purchaseInvoiceData);
    dispatch(setViewPurchaseInvoiceData(purchaseInvoiceData));
  };

  const handleAddReceiptPaymentData = async () => {
    if (isGetInitialValuesPurchaseInvoice?.view === true) {
      const updatedPurchaseInvoiceDetails =
        await handlePurchaseInvoiceDetails();

      const purchaseInvoiceData = {
        ...viewPurchaseInvoiceData,
        ...updatedPurchaseInvoiceDetails,
      };
      setInitialData(purchaseInvoiceData);
      dispatch(setViewPurchaseInvoiceData(purchaseInvoiceData));
    } else {
      handleUpdatePurchaseInvoice();
    }
  };

  useEffect(() => {
    handleAddReceiptPaymentData();
  }, []);

  return <PurchaseInvoiceDetail initialValues={initialData} />;
}

// import React, { useState } from 'react';
// import { Col, Row } from 'react-bootstrap';
// import { Button } from 'primereact/button';
// import { Link } from 'react-router-dom';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { ColumnGroup } from 'primereact/columngroup';
// import { Dialog } from 'primereact/dialog';
// import ShowIcon from '../../../Assets/Images/show-icon.svg';
// import EditIcon from '../../../Assets/Images/edit.svg';
// import LogoImg from '../../../Assets/Images/logo.svg';
// import DownloadIcon from '../../../Assets/Images/download-icon.svg';

// export const JournalData = [
//   {
//     item_name: 'CR',
//     quantity: 'ABC Company',
//     rate: '₹ 0.00',
//     amount_paid: '₹ 25,000',
//   },
//   {
//     item_name: 'CR',
//     quantity: 'ABC Company',
//     rate: '₹ 0.00',
//     amount_paid: '₹ 25,000',
//   },
//   {
//     item_name: 'CR',
//     quantity: 'ABC Company',
//     rate: '₹ 0.00',
//     amount_paid: '₹ 25,000',
//   },
// ];

// export const EntryDetailsData = [
//   {
//     cr_db: 'CR',
//     client: 'ABC Company',
//     debit: '₹ 0.00',
//     credit: '₹ 25,000',
//   },
//   {
//     cr_db: 'DB',
//     client: 'ABC Company',
//     debit: '₹ 0.00',
//     credit: '₹ 25,000',
//   },
// ];

// export default function ViewPurchaseInvoice() {
//   const [visible, setVisible] = useState(false);

//   const JournalFooterGroup = (
//     <ColumnGroup>
//       <Row>
//         <Column className="text-end" footer="Total Amount" colSpan={3} />
//         <Column footer="₹ 25,000" />
//       </Row>
//     </ColumnGroup>
//   );

//   const EntryfooterGroup = (
//     <ColumnGroup>
//       <Row>
//         <Column footer="Total Amount" colSpan={3} />
//         <Column footer="₹ 45,000" colSpan={2} />
//       </Row>
//     </ColumnGroup>
//   );

//   return (
//     <div className="main_Wrapper">
//       <div className="bg-white radius15 border h-100">
//         <div className="billing_heading">
//           <Row className="align-items-center gy-3">
//             <Col sm={5}>
//               <div class="page_title">
//                 <h3 class="m-0">Purchase Invoice</h3>
//               </div>
//             </Col>
//             <Col sm={7}>
//               <ul className="billing-btn justify-content-sm-end">
//                 <li>
//                   <Button
//                     className="btn_border_dark filter_btn"
//                     onClick={() => setVisible(true)}
//                   >
//                     <img src={ShowIcon} alt="" /> Preview
//                   </Button>
//                 </li>
//                 <li>
//                   <Link
//                     className="btn_border_dark filter_btn"
//                     to="/create-purchase-invoice"
//                   >
//                     <img src={EditIcon} alt="" /> Edit
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/purchase-invoice"
//                     className="btn_border_dark filter_btn"
//                   >
//                     Exit Page
//                   </Link>
//                 </li>
//               </ul>
//             </Col>
//           </Row>
//         </div>
//         <div className="p20 p10-sm border-bottom">
//           <div className="client_pyment_wrapper">
//             <Row>
//               <Col lg={2}>
//                 <div className="client_pyment_wrap">
//                   <h5>Payment No</h5>
//                   <h4>#564892</h4>
//                 </div>
//               </Col>
//               <Col lg={2}>
//                 <div className="client_pyment_wrap">
//                   <h5>Create Date</h5>
//                   <h4>30/06/2023</h4>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//           <div className="client_pyment_details">
//             <Row>
//               <Col lg={2}>
//                 <div className="client_pyment_wrap">
//                   <h5 className="text_gray">Company</h5>
//                   <h5>ABC Company</h5>
//                 </div>
//               </Col>
//               <Col lg={2}>
//                 <div className="client_pyment_wrap">
//                   <h5 className="text_gray">Client Name</h5>
//                   <h5>Kapil Karchadiya</h5>
//                 </div>
//               </Col>
//               <Col lg={2}>
//                 <div className="client_pyment_wrap">
//                   <h5 className="text_gray">Email</h5>
//                   <h5>Kapilkarchadiya@gmail.com</h5>
//                 </div>
//               </Col>
//               <Col lg={2}>
//                 <div className="client_pyment_wrap">
//                   <h5 className="text_gray">Phone No</h5>
//                   <h5>+91 9876543211</h5>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//           <div className="client_pyment_details">
//             <Row>
//               <Col lg={2}>
//                 <div className="client_pyment_wrap">
//                   <h5 className="text_gray">Remark</h5>
//                   <h5>No Comments</h5>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </div>
//         <div className="billing_heading">
//           <Row className="justify-content-between align-items-center">
//             <Col lg={6}>
//               <div className="Receipt_Payment_head_wrapper">
//                 <div className="Receipt_Payment_head_txt">
//                   <h3 className="m-0">Add Expense Items</h3>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </div>
//         <div className="data_table_wrapper max_height">
//           <DataTable
//             value={JournalData}
//             sortField="price"
//             sortOrder={1}
//             rows={10}
//             footerColumnGroup={JournalFooterGroup}
//           >
//             <Column field="item_name" header="Item Name" sortable></Column>
//             <Column field="quantity" header="Quantity" sortable></Column>
//             <Column field="rate" header="Rate" sortable></Column>
//             <Column field="amount_paid" header="Amount Paid" sortable></Column>
//           </DataTable>
//         </div>
//       </div>
//       <Dialog
//         header={
//           <div className="dialog_logo">
//             <img src={LogoImg} alt="" />
//           </div>
//         }
//         className="modal_Wrapper payment_dialog"
//         visible={visible}
//         onHide={() => setVisible(false)}
//         draggable={false}
//       >
//         <div className="voucher_text">
//           <h2>Purchase Invoice</h2>
//         </div>
//         <div className="delete_popup_wrapper">
//           <div className="client_payment_details">
//             <div className="voucher_head">
//               <h5>Smile Films</h5>
//             </div>
//             <Row className="justify-content-between gy-3">
//               <Col sm={5}>
//                 <div className="user_bank_details">
//                   <h5>
//                     Payment By : <span>ABC Company</span>
//                   </h5>
//                 </div>
//                 <div className="user_bank_details">
//                   <h5>
//                     Receive by : <span>BCD Company</span>
//                   </h5>
//                 </div>
//               </Col>
//               <Col sm={5}>
//                 <div className="user_bank_details bank_details_light">
//                   <h5>
//                     Payment No <span>#52123</span>
//                   </h5>
//                 </div>
//                 <div className="user_bank_details bank_details_light">
//                   <h5>
//                     Payment Date <span>20 May 20219</span>
//                   </h5>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//           <div className="data_table_wrapper max_height border radius15 overflow-hidden">
//             <DataTable
//               value={EntryDetailsData}
//               sortField="price"
//               sortOrder={1}
//               rows={10}
//               footerColumnGroup={EntryfooterGroup}
//             >
//               <Column field="cr_db" header="CR/DB" sortable></Column>
//               <Column field="client" header="Client" sortable></Column>
//               <Column field="debit" header="Debit" sortable></Column>
//               <Column field="credit" header="Credit" sortable></Column>
//             </DataTable>
//           </div>
//           <div className="delete_btn_wrap">
//             <button className="btn_primary" onClick={() => setVisible(false)}>
//               <img src={DownloadIcon} alt="downloadicon" /> Download
//             </button>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// }
