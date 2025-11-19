export interface ApplicationState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  positionType: 'Full-Time' | 'Part-Time' | '';
  startDate: string;
  experience: string;
  references: string;
  whyGreenValley: string;
  
  // Acknowledgements
  ackOutdoor: boolean;
  ackPhysical: boolean;
  ackMachinery: boolean;
  ackCustomers: boolean;
  ackExhaustion: boolean;
}

export interface ParsedResumeData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  experienceSummary?: string;
}

export enum UploadStatus {
  IDLE,
  UPLOADING,
  PARSING,
  SUCCESS,
  ERROR
}
