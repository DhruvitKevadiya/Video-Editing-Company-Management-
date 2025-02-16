import React, { useEffect, useMemo, useState } from 'react';
import JournalEntryDetails from './JournalEntryDetails';
import {
  getPaymentNo,
  setCreateJournalEntryData,
  setIsGetInitialValuesJournalEntry,
} from 'Store/Reducers/Accounting/JournalEntry/JournalEntrySlice';
import { useDispatch, useSelector } from 'react-redux';
import { getClientCompanyList } from 'Store/Reducers/Settings/CompanySetting/ClientCompanySlice';
import { getAccountList } from 'Store/Reducers/Settings/AccountMaster/AccountSlice';

const CreateJournalEntry = () => {
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState({});

  const {
    createJournalEntryData,
    journalEntryInitialData,
    isGetInitialValuesJournalEntry,
  } = useSelector(({ journalEntry }) => journalEntry);

  const handleAddJournalEntry = () => {
    dispatch(
      setIsGetInitialValuesJournalEntry({
        ...isGetInitialValuesJournalEntry,
        add: true,
      }),
    );

    dispatch(getPaymentNo())
      .then(res => {
        const journalEntryPaymentNo = res?.payload;
        return { journalEntryPaymentNo };
      })
      .then(({ journalEntryPaymentNo }) => {
        dispatch(
          getClientCompanyList({
            start: 0,
            limit: 0,
            isActive: true,
            search: '',
          }),
        )
          .then(response => {
            let companyData = [];
            if (response.payload?.data?.list?.length) {
              companyData = response.payload?.data?.list?.map(item => ({
                label: item?.company_name,
                value: item?._id,
              }));
            }
            return { journalEntryPaymentNo, companyData };
          })
          .then(({ journalEntryPaymentNo, companyData }) => {
            dispatch(
              getAccountList({
                start: 0,
                limit: 0,
                isActive: '',
                search: '',
                group_type: 'Bank Accounts',
              }),
            ).then(response => {
              let accountListData = [];
              if (response.payload?.data?.list?.[0]?.accounts?.length) {
                accountListData =
                  response.payload?.data?.list?.[0]?.accounts?.map(account => ({
                    label: account?.account_name,
                    value: account?._id,
                  }));
              }

              const updatedData = {
                ...journalEntryInitialData,
                payment_no: journalEntryPaymentNo,
                client_company_list: companyData,
                account_list: accountListData,
              };

              setInitialData(updatedData);
              dispatch(setCreateJournalEntryData(updatedData));
            });
          })
          .catch(error =>
            console.error('fetch the Accounts data - error', error),
          );
      })
      .catch(error => console.error('fetch the Payment Number - error', error));
  };

  useEffect(() => {
    if (isGetInitialValuesJournalEntry?.add === true) {
      setInitialData(createJournalEntryData);
    } else {
      handleAddJournalEntry();
    }
  }, []);

  return <JournalEntryDetails initialValues={initialData} isEdit={false} />;
};

export default CreateJournalEntry;
