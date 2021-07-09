import { IsNumber, IsString } from "class-validator";

class CreateFloorDto {
	@IsNumber()
	public buildingId: number;

	@IsNumber()
	public floorNumber: number;

	@IsString()
	public geoJsonData: string;

	public outerBounds?: number[][];
}

export default CreateFloorDto;