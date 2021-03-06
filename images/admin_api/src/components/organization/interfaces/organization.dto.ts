import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, ValidateIf, ValidateNested } from "class-validator";
import CreateUserDto from "../../user/interfaces/User.dto";


class CreateOrganizationDto {
	@IsString()
	public name: string;

	@IsString()
	public acronym: string;

	@IsString()
	public address: string;

	@IsString()
	public city: string;

	@IsString()
	public zipCode: string;

	@IsString()
	public state: string;

	@IsString()
	public country: string;

	@IsNumber()
	public buildingId: number;

	@ValidateIf((obj) => obj.telegramInvitationLink !== undefined)
	@IsString()
	public telegramInvitationLink?: string;

	@ValidateIf((obj) => obj.telegramChatId !== undefined)
	@IsString()
	public telegramChatId?: string;

	@ValidateNested({ each: true })
	@Type(() => CreateUserDto)
	public orgAdminArray: CreateUserDto[];
}

export default CreateOrganizationDto;
