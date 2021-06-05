import React, { FC } from 'react'
import TableWithPagination from './TableWithPagination';
import { GROUPS_OPTIONS } from './platformAssistantOptions';
import CreateGroup from './CreateGroup';
import EditGroup from './EditGroup';
import { useGroupsDispatch, useGroupsOptionToShow, setGroupsOptionToShow } from '../../contexts/groupsOptions';
import { IGroup, Create_GROUPS_COLUMNS } from './TableColumns/groupsColumns';


interface GroupsContainerProps {
    groups: IGroup[];
    refreshGroups: () => void;
}

const GroupsContainer: FC<GroupsContainerProps> = ({ groups, refreshGroups }) => {
    const groupsDispatch = useGroupsDispatch();
    const groupsOptionToShow = useGroupsOptionToShow();

    const showGroupsTableOption = () => {
        setGroupsOptionToShow(groupsDispatch, { groupsOptionToShow: GROUPS_OPTIONS.TABLE });
    }

    return (
        <>

            { groupsOptionToShow === GROUPS_OPTIONS.CREATE_GROUP && <CreateGroup backToTable={showGroupsTableOption} refreshGroups={refreshGroups} />}
            { groupsOptionToShow === GROUPS_OPTIONS.EDIT_GROUP && <EditGroup groups={groups} backToTable={showGroupsTableOption} refreshGroups={refreshGroups} />}
            { groupsOptionToShow === GROUPS_OPTIONS.TABLE &&
                <TableWithPagination
                    dataTable={groups}
                    columnsTable={Create_GROUPS_COLUMNS(refreshGroups)}
                    componentName="group"
                    reloadTable={refreshGroups}
                    createComponent={() => setGroupsOptionToShow(groupsDispatch, { groupsOptionToShow: GROUPS_OPTIONS.CREATE_GROUP })}
                />
            }

        </>
    )
}

export default GroupsContainer;
