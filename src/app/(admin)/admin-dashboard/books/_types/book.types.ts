/**
 * Type definitions for Books Management in Admin Panel
 */

export interface AdminBook {
  id: string;
  title: string;
  thumbnail: string;
  viewUrl: string;
  downloadUrl: string;
  publishedYear: string;
  downloadCount: number;
  viewCount: number;
  isVisible: boolean;
  displayOrder: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface EditableBook {
  id: string;
  title: string;
  thumbnail: string;
  viewUrl: string;
  downloadUrl: string;
  publishedYear: string;
  isVisible: boolean;
  displayOrder?: number;
}
