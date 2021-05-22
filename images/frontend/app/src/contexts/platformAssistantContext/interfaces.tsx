export interface PlatformAssistantDispatch {
	(arg0: { type: string; payload?: any; error?: any }): void;
}

export interface PlatformAssistantContextProps {
	userRole: string;
	numOrganizationManaged: number;
	numGroupsManaged: number; 
	numDevicesManage: number;
	platformAssitantOptionToShow: string;
	groupMembersOptionToShow: string;
	groupMemberIdToEdit: number;
	userOptionToShow: string;
	userProfileOptionToShow: string;
	homeOptionToShow: string
	loading: boolean;
	errorMessage: string | null;
}

export interface PlatformAssistantActionPayload {
	userRole: string;
	numOrganizationManaged: number;
	numGroupsManaged: number; 
	numDevicesManage: number;
	platformAssitantOptionToShow: string;
	groupMembersOptionToShow: string;
	groupMemberIdToEdit: number;
	userOptionToShow: string;
	userProfileOptionToShow: string;
	homeOptionToShow: string
}

export interface PlatformAssistantAction {
	type: string;
	payload: PlatformAssistantActionPayload;
	error: string;
}

export interface IUserRole {
	userRole: string;
	numOrganizationManaged: number;
	numGroupsManaged: number;
	numDevicesManaged: number;
}

export interface IPlatformAssistantOptionToShow {
	platformAssistantOptionToShow: string;
}



