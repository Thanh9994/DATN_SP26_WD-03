import { Tag } from 'antd';
import { IRoomType } from '@shared/src/schemas';

type RoomTypeTagProps = {
  type: IRoomType;
};

const roomTypeColorMap: Record<IRoomType, string> = {
  '2D': 'blue',
  '3D': 'cyan',
  IMAX: 'gold',
  '4DX': 'magenta',
};

export const RoomTypeTag = ({ type }: RoomTypeTagProps) => {
  return <Tag color={roomTypeColorMap[type]}>{type}</Tag>;
};

export default RoomTypeTag;
