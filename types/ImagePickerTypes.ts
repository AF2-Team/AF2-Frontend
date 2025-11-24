import { ImageSourcePropType } from "react-native";


export type ImageCropType = 'avatar' | 'cover';
export type AvatarShape = 'circle' | 'square';

export interface ImagePickerState {
  isVisible: boolean;
  type: ImageCropType | null; // avatar o header
  currentImageUri: ImageSourcePropType | null;
  selectedImageUri: string | null;
  avatarShape: AvatarShape;
}