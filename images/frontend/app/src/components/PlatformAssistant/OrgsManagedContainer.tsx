import React, { FC, useState } from 'react'
import TableWithPagination from './TableWithPagination';
import { ORGS_MANAGED_OPTIONS } from './platformAssistantOptions';
import { IOrgManaged } from './TableColumns/organizationsManagedColumns';
import { ORGS_MANAGED_COLUMNS } from './TableColumns/organizationsManagedColumns';
import CreateOrgUser from './CreateOrgUser';
import { useOrgsManagedDispatch, useOrgsManagedOptionToShow, setOrgsManagedOptionToShow } from '../../contexts/orgsManagedOptions';


export interface IOrgUserInput {
    firstName: string;
    surname: string;
    login: string;
    email: string;
    roleInOrg: string;
}

export interface IOrgUsersInput {
    users: IOrgUserInput[];
}

const initialOrgUsersData = {
    users: [
        {
            firstName: "",
            surname: "",
            email: "",
            login: "",
            roleInOrg: "Viewer"
        }
    ]
}

interface OrgsManagedContainerProps {
    orgsManaged: IOrgManaged[];
    refreshOrgsManaged: () => void;
    refreshOrgUsers: () => void;
}

const OrgsManagedContainer: FC<OrgsManagedContainerProps> = ({ orgsManaged, refreshOrgsManaged, refreshOrgUsers }) => {
    const orgsManagedDispatch = useOrgsManagedDispatch();
    const orgsManageOptionToShow = useOrgsManagedOptionToShow();
    const [orgUsersInputData, setOrgUsersInputData] = useState<IOrgUsersInput>(initialOrgUsersData)

    const showOrgsManagedTableOption = () => {
        setOrgsManagedOptionToShow(orgsManagedDispatch, { orgsManagedOptionToShow: ORGS_MANAGED_OPTIONS.TABLE });
    }

    return (
        <>
            {orgsManageOptionToShow === ORGS_MANAGED_OPTIONS.TABLE &&
                <TableWithPagination
                    dataTable={orgsManaged}
                    columnsTable={ORGS_MANAGED_COLUMNS}
                    reloadTable={refreshOrgsManaged}
                    componentName=""
                />
            }
            {orgsManageOptionToShow === ORGS_MANAGED_OPTIONS.CREATE_ORG_USERS &&
                <CreateOrgUser
                    refreshOrgUsers={refreshOrgUsers}
                    backToTable={showOrgsManagedTableOption}
                    orgUsersInputData={orgUsersInputData}
                    setOrgUsersInputData={setOrgUsersInputData}
                />
            }
        </>
    )
}

export default OrgsManagedContainer;