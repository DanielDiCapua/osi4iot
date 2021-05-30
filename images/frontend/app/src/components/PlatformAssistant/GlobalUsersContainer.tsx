import React, { FC } from 'react'
import { Create_GLOBAL_USERS_COLUMNS, IGlobalUser } from "./TableColumns/globalUsersColumns";
import TableWithPagination from './TableWithPagination';
import { GLOBAL_USERS_OPTIONS } from './platformAssistantOptions';
import CreateGlobalUser from './CreateGlobalUser';
import EditGlobalUser from './EditGlobalUser';
import { useGlobalUsersDispatch, useGlobalUsersOptionToShow, setGlobalUsersOptionToShow } from '../../contexts/globalUsers';


interface GlobalUsersContainerProps {
    globalUsers: IGlobalUser[];
    refreshGlobalUsers: () => void;
}

const GlobalUsersContainer: FC<GlobalUsersContainerProps> = ({ globalUsers, refreshGlobalUsers }) => {
    const globalUsersDispatch = useGlobalUsersDispatch();
    const globalUsersOptionToShow = useGlobalUsersOptionToShow();

    const showGlobalUsersTableOption = () => {
        setGlobalUsersOptionToShow(globalUsersDispatch, { globalUsersOptionToShow: GLOBAL_USERS_OPTIONS.TABLE });
    }

    return (
        <>

            { globalUsersOptionToShow === GLOBAL_USERS_OPTIONS.CREATE_GLOBAL_USER &&
                <CreateGlobalUser
                    backToTable={showGlobalUsersTableOption}
                    refreshGlobalUsers={refreshGlobalUsers}
                />
            }
            { globalUsersOptionToShow === GLOBAL_USERS_OPTIONS.EDIT_GLOBAL_USER &&
                <EditGlobalUser
                    globalUsers={globalUsers}
                    backToTable={showGlobalUsersTableOption}
                    refreshGlobalUsers={refreshGlobalUsers}
                />}
            { globalUsersOptionToShow === GLOBAL_USERS_OPTIONS.TABLE &&
                <TableWithPagination
                    dataTable={globalUsers}
                    columnsTable={Create_GLOBAL_USERS_COLUMNS(refreshGlobalUsers)}
                    componentName="global user"
                    createComponent={() => setGlobalUsersOptionToShow(globalUsersDispatch, { globalUsersOptionToShow: GLOBAL_USERS_OPTIONS.CREATE_GLOBAL_USER })}
                />
            }

        </>
    )
}

export default GlobalUsersContainer;