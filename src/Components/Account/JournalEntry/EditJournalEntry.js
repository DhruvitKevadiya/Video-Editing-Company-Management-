import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import JournalEntryDetails from './JournalEntryDetails';
import { getAccountList } from 'Store/Reducers/Settings/AccountMaster/AccountSlice';
import { getClientCompanyList } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import {
  getJournalEntry,
  setIsGetInitialValuesJournalEntry,
  setUpdateJournalEntryData,
} from 'Store/Reducers/Accounting/JournalEntry/JournalEntrySlice';

const EditJournalEntry = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const { isGetInitialValuesJournalEntry, updateJournalEntryData } =
    useSelector(({ journalEntry }) => journalEntry);

  // useEffect(() => {
  //   dispatch(getJournalEntry({ journal_entry_id: id }));
  // }, []);

  // const updatedData = {
  //   journal_entry_id: getJournalEntryData?._id,
  //   paymentType: getJournalEntryData?.payment_type,
  //   paymentGroup: getJournalEntryData?.payment_group,
  //   remark: getJournalEntryData?.remark,
  //   createDate: new Date(getJournalEntryData?.create_date),
  //   paymentNo: getJournalEntryData?.payment_no,

  //   journalEntryData: [
  //     {
  //       journal_entry_detail_id:
  //         getJournalEntryData?.journalEntryDetails?.[0]?._id,
  //       client_name: getJournalEntryData?.journalEntryDetails?.[0]?.client_name,
  //       crdb: 'CR',
  //       debit: 'blankme',
  //       credit: getJournalEntryData?.journalEntryDetails?.[0]?.credit,
  //       type: 1,
  //     },
  //     {
  //       journal_entry_detail_id:
  //         getJournalEntryData?.journalEntryDetails?.[1]?._id,
  //       client_name: getJournalEntryData?.journalEntryDetails?.[1]?.client_name,
  //       crdb: 'DB',
  //       debit: getJournalEntryData?.journalEntryDetails?.[1]?.debit,
  //       credit: 'blankme',
  //       type: 2,
  //     },
  //   ],
  // };

  const handleUpdateJournalEntry = async () => {
    let compnayOpitions = [];
    let accountOpitions = [];
    let updatedJournalEntryDetails = {};

    dispatch(
      setIsGetInitialValuesJournalEntry({
        ...isGetInitialValuesJournalEntry,
        update: true,
      }),
    );

    const response = await dispatch(
      getJournalEntry({
        journal_entry_id: id,
      }),
    );
    const companyDataList = await dispatch(
      getClientCompanyList({
        start: 0,
        limit: 0,
        isActive: true,
        search: '',
      }),
    );
    const accountDataList = await dispatch(
      getAccountList({
        start: 0,
        limit: 0,
        isActive: '',
        search: '',
        group_type: 'Bank Accounts',
      }),
    );

    const companyList = companyDataList.payload?.data?.list;

    if (companyList?.length) {
      compnayOpitions = companyList?.map(company => ({
        label: company?.company_name,
        value: company?._id,
      }));
    }

    const accountList = accountDataList.payload?.data?.list?.[0]?.accounts;

    if (accountList?.length) {
      accountOpitions = accountList?.map(account => ({
        label: account?.account_name,
        value: account?._id,
      }));
    }

    if (response?.payload) {
      const journalEntry = response?.payload;

      const updatedJournalEntryItems = journalEntry?.journalEntryDetails?.map(
        (item, index) => {
          return {
            ...item,
            transaction_type: index === 0 ? 'CR' : 'DB',
            client_name: item?.client_name,
            // debit: index === 0 ? 'blankme' : item?.debit,
            // credit: index === 0 ? item?.credit : 'blankme',
            // ...(item?.debit && { debit: item?.debit }),
            // ...(item?.credit && { credit: item?.credit }),
            debit: item?.debit,
            credit: item?.credit,
            type: index + 1,
            journal_entry_detail_id: item?._id,
          };
        },
      );

      const updatedData = {
        ...response?.payload,
        create_date: journalEntry?.create_date
          ? new Date(journalEntry?.create_date?.split('T')[0])
          : '',
        journalEntryData: updatedJournalEntryItems,
      };

      updatedJournalEntryDetails = updatedData;
    }

    const journalEntryData = {
      ...updatedJournalEntryDetails,
      account_list: accountOpitions,
      client_company_list: compnayOpitions,
    };

    setInitialData(journalEntryData);
    dispatch(setUpdateJournalEntryData(journalEntryData));
  };

  useEffect(() => {
    if (isGetInitialValuesJournalEntry?.update === true) {
      setInitialData(updateJournalEntryData);
    } else {
      handleUpdateJournalEntry();
    }
  }, []);

  return <JournalEntryDetails initialValues={initialData} isEdit={true} />;
};

export default EditJournalEntry;
