import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  clearUpdateSelectedCompanyData,
  setIsGetInitialValues,
} from 'Store/Reducers/Settings/CompanySetting/CompanySlice';

export default function CompanySidebar() {
  const location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [sidebarToggle, setSidebarToggle] = useState(false);

  const { isGetInitialValues } = useSelector(({ company }) => company);

  const { userPermissions } = useSelector(({ auth }) => auth);

  let UserPreferences = localStorage.getItem('UserPreferences');
  if (UserPreferences) {
    UserPreferences = JSON.parse(window?.atob(UserPreferences));
  }
  const findPermission = key => {
    return userPermissions?.find(
      data => data?.key === key || data?.name === key,
    );
  };
  // const findPermission = name => {
  //   const settingPermission = userPermissions?.find(
  //     data => data?.key === 'setting' || data?.name === 'Setting',
  //   );
  //   let permission = false;
  //   if (settingPermission) {
  //     if (settingPermission?.permission?.length > 0) {
  //       let modulePermission = settingPermission?.permission?.find(
  //         d => d?.sub_module_key === name,
  //       );
  //       permission = modulePermission?.view;
  //     }
  //   }
  //   return permission;
  // };

  const checkViewPermission = (moduleKey, subModuleKey) => {
    const permission = findPermission(moduleKey);

    if (permission) {
      if (permission.permission && permission.permission.length > 0) {
        const modulePermission = permission.permission.find(
          d => d.sub_module_key === subModuleKey,
        );

        return modulePermission ? modulePermission.view : false;
      }
    }

    return false;
  };
  return (
    <>
      <div
        className="sidebar_toggle"
        onClick={() => setSidebarToggle(!sidebarToggle)}
      >
        <span></span>
        <h4>Setting Menu</h4>
      </div>
      <div
        className={
          sidebarToggle === true
            ? 'setting_left_wrap bg-white p20 radius15 show'
            : 'setting_left_wrap bg-white p20 radius15'
        }
      >
        <div className="setting_left_inner_wrap">
          <div className="close_toggle" onClick={() => setSidebarToggle(false)}>
            x
          </div>
          <h4>Company Settings</h4>
          <ul>
            {checkViewPermission('setting', 'company-profile') && (
              <li>
                <div
                  onClick={() => {
                    navigate(
                      `/update-company-profile/${UserPreferences.employee.company_name}`,
                    );

                    dispatch(
                      setIsGetInitialValues({
                        ...isGetInitialValues,
                        update: false,
                      }),
                    );
                    dispatch(clearUpdateSelectedCompanyData());
                  }}
                  className={
                    location.pathname?.includes('/update-company-profile')
                      ? 'side_menu_item active'
                      : 'side_menu_item'
                  }
                >
                  Company Profile
                </div>
              </li>
            )}
            {checkViewPermission('setting', 'company-list') && (
              <li>
                <Link
                  to="/company-list"
                  className={
                    location.pathname === '/company-list' ||
                    location.pathname === '/create-company' ||
                    location.pathname?.includes('/update-company')
                      ? 'active'
                      : ''
                  }
                >
                  Company List
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'subscription') && (
              <li>
                <Link
                  to="/subscription"
                  className={
                    location.pathname === '/subscription' ? 'active' : ''
                  }
                >
                  Subscription
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'employee') && (
              <li>
                <Link
                  to="/employee"
                  className={location.pathname === '/employee' ? 'active' : ''}
                >
                  Employee
                </Link>
              </li>
            )}

            {checkViewPermission('setting', 'client-company') && (
              <li>
                <Link
                  to="/client-company"
                  className={
                    location.pathname === '/client-company' ? 'active' : ''
                  }
                >
                  Client Company
                </Link>
              </li>
            )}
          </ul>
          <h4>Master</h4>
          <ul>
            {checkViewPermission('setting', 'project-type') && (
              <li>
                <Link
                  to="/project-type"
                  className={
                    location.pathname === '/project-type' ? 'active' : ''
                  }
                >
                  Project Type
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'product') && (
              <li>
                <Link
                  to="/product"
                  className={location.pathname === '/product' ? 'active' : ''}
                >
                  Product(Item)
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'package') && (
              <li>
                <Link
                  to="/package"
                  className={location.pathname === '/package' ? 'active' : ''}
                >
                  Package
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'roles-permission') && (
              <li>
                <Link
                  to="/role-permission"
                  className={
                    location.pathname === '/role-permission' ? 'active' : ''
                  }
                >
                  Role & Permission
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'reference') && (
              <li>
                <Link
                  to="/reference"
                  className={location.pathname === '/reference' ? 'active' : ''}
                >
                  Reference
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'location') && (
              <li>
                <Link
                  to="/location"
                  className={location.pathname === '/location' ? 'active' : ''}
                >
                  Locations(Address)
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'devices') && (
              <li>
                <Link
                  to="/device"
                  className={location.pathname === '/device' ? 'active' : ''}
                >
                  Devices
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'currency') && (
              <li>
                <Link
                  to="/currency"
                  className={location.pathname === '/currency' ? 'active' : ''}
                >
                  Currency
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'subscription-status') && (
              <li>
                <Link
                  to="/subscription-status"
                  className={
                    location.pathname === '/subscription-status' ? 'active' : ''
                  }
                >
                  Subscription Status
                </Link>
              </li>
            )}
          </ul>
          <h4>Account Master</h4>
          <ul>
            {checkViewPermission('setting', 'account') && (
              <li>
                <Link
                  to="/account"
                  className={location.pathname === '/account' ? 'active' : ''}
                >
                  Account
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'group') && (
              <li>
                <Link
                  to="/group"
                  className={location.pathname === '/group' ? 'active' : ''}
                >
                  Group
                </Link>
              </li>
            )}
            {checkViewPermission('setting', 'change-year') && (
              <li>
                <Link
                  to="/change-year"
                  className={
                    location.pathname === '/change-year' ? 'active' : ''
                  }
                >
                  Chang Year
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
