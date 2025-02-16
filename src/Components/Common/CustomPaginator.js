import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import LeftArrow from '../../Assets/Images/left-arrow.svg';
import RightArrow from '../../Assets/Images/right-arrow.svg';
import { memo } from 'react';

const CustomPaginator = memo(
  ({
    dataList,
    pageLimit,
    currentPage,
    totalCount,
    onPageChange,
    onPageRowsChange,
  }) => {
    const template = {
      layout:
        currentPage === 0
          ? 'CurrentPageReport RowsPerPageDropdown'
          : 'PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown',
      PrevPageLink: options => {
        return (
          <button
            className="border border-0 prev_arrow"
            onClick={() => onPageChange({ page: 'Prev' })}
            disabled={currentPage === 1 ? true : false}
          >
            <img
              src={LeftArrow}
              alt="left-arrow"
              className="rounded-circle"
              width={24}
              height={24}
            />
          </button>
        );
      },
      NextPageLink: options => {
        const totalPages = Math.ceil(totalCount / pageLimit);
        return (
          <button
            className="border border-0 next_arrow"
            onClick={() => onPageChange({ page: 'Next' })}
            disabled={
              dataList?.length === 0 || currentPage === totalPages
                ? true
                : false
            }
          >
            <img
              src={RightArrow}
              alt="left-arrow"
              className="rounded-circle"
              width={24}
              height={24}
            />
          </button>
        );
      },
      PageLinks: options => {
        if (
          (options.view.startPage === options.page &&
            options.view.startPage !== 0) ||
          (options.view.endPage === options.page &&
            options.page + 1 !== options.totalPages)
        ) {
          return <span style={{ userSelect: 'none' }}>...</span>;
        }

        return (
          <Button
            type="button"
            className={
              options.page === currentPage - 1
                ? 'p-paginator-page p-paginator-element p-link p-paginator-page-end p-highlight'
                : 'p-paginator-page p-paginator-element p-link p-paginator-page-start'
            }
            onClick={() => onPageChange(options.page + 1)}
          >
            {options.page + 1}
          </Button>
        );
      },
      RowsPerPageDropdown: options => {
        const dropdownOptions = [
          { label: 10, value: 10 },
          { label: 20, value: 20 },
          // { label: 30, value: 30 },
          { label: 50, value: 50 },
          { label: 100, value: 100 },
          // { label: 200, value: 200 },
          { label: 'All', value: 0 },
        ];

        return (
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={e => onPageRowsChange(e.value)}
          />
        );
      },
    };

    return (
      <>
        <Paginator
          rows={pageLimit}
          first={currentPage * pageLimit}
          totalRecords={totalCount}
          // rowsPerPageOptions={[5, 10, 25, 50]}
          //   currentPageReportTemplate={`Showing ${
          //     pageLimit * (currentPage - 1) + 1
          //   } to ${
          //     pageLimit * (currentPage - 1) + dataList?.length
          //   } of ${totalCount} entries`}
          //   template={template}
          currentPageReportTemplate={`Showing ${
            pageLimit * (currentPage - 1) + (dataList?.length ? 1 : 0)
          } to ${
            pageLimit * (currentPage - 1) +
            (dataList?.length ? dataList?.length : 0)
          } of ${totalCount ? totalCount : 0} entries`}
          template={template}
        />
      </>
    );
  },
);

export default CustomPaginator;
